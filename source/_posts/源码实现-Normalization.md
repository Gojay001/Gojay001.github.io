---
title: 源码实现-Normalization
thumbnail: /gallery/thumbnails/normalization.png
date: 2026-05-08 12:00:00
categories:
    - DeepLearning
    - PyTorch

tags: [pytorch, source_code, normalization]
---

> 本文整理 **BatchNorm / LayerNorm / RMSNorm** 的作用与差异，并给出与 PyTorch 思路一致的简化实现（dummy），便于对照官方源码阅读。
<!-- more -->


# Contents

---

- **[概述与对比](#概述与对比)**
- **[极简伪代码（BN / LN / RMSNorm）](#极简伪代码)**
- **[BatchNorm](#BatchNorm)**
- **[LayerNorm](#LayerNorm)**
- **[RMSNorm](#RMSNorm)**
- **[reference](#reference)**

# 概述与对比

---

## 归一化的作用

- **稳定输入分布**（常见目标为零均值、单位方差），减轻内部协变量偏移带来的影响；
- 使各层学习目标相对稳定，**梯度更平滑**（减轻激活函数饱和区带来的梯度问题）；
- 梯度更稳定后，往往可以使用**更大学习率**，从而**加快收敛**。

## BN 与 LN 的对比

- `BN`：**逐通道**归一化，在 **NHW**（或序列场景下的 **NL**）上统计；
- `LN`：**逐样本 / 逐 token** 归一化；图像上常对 **CHW**，序列上对最后一维 **D**。

**CNN**：图像具有空间不变性，同一通道在不同空间位置的可比性强，适合**跨样本、逐通道**做 BN。

**Transformer**：LN 在每个样本的**每个 token 内**，对特征维 **D** 独立归一化，使每个 token 的特征向量分布稳定。

统一形式：先标准化，再用可学习参数做仿射变换：`y = scale * x + shift`（RMSNorm 常省略 bias）。

# 极简伪代码

---

```python
import torch
import torch.nn as nn

class BatchNorm2d:
    """教学用极简 BN2d，非 nn.Module。"""
    def __init__(self, num_features, eps=1e-5, momentum=0.1):
        self.num_features = num_features
        self.eps = eps
        self.momentum = momentum
        self.gamma = nn.Parameter(torch.ones(num_features))
        self.beta = nn.Parameter(torch.zeros(num_features))
        self.running_mean = torch.zeros(num_features)
        self.running_var = torch.ones(num_features)
        self.training = True

    def forward(self, x):
        N, C, H, W = x.shape
        if self.training:
            mean = x.mean(dim=(0, 2, 3), keepdim=True)
            var = x.var(dim=(0, 2, 3), keepdim=True, unbiased=False)
            with torch.no_grad():
                self.running_mean = (1 - self.momentum) * self.running_mean + self.momentum * mean.squeeze()
                self.running_var = (1 - self.momentum) * self.running_var + self.momentum * var.squeeze()
        else:
            mean = self.running_mean.view(1, C, 1, 1)
            var = self.running_var.view(1, C, 1, 1)
        x_norm = (x - mean) / torch.sqrt(var + self.eps)
        gamma = self.gamma.view(1, C, 1, 1)
        beta = self.beta.view(1, C, 1, 1)
        return x_norm * gamma + beta


class LayerNorm(nn.Module):
    def __init__(self, dim, eps=1e-6):
        super().__init__()
        self.eps = eps
        self.gamma = nn.Parameter(torch.ones(dim))
        self.beta = nn.Parameter(torch.zeros(dim))

    def forward(self, x):
        mean = x.mean(-1, keepdim=True)
        var = x.var(-1, keepdim=True)
        x_norm = (x - mean) / torch.sqrt(var + self.eps)
        return self.gamma * x_norm + self.beta


class RMSNorm(nn.Module):
    def __init__(self, dim, eps=1e-6):
        super().__init__()
        self.eps = eps
        self.gamma = nn.Parameter(torch.ones(dim))

    def forward(self, x):
        rms = torch.sqrt(x.pow(2).mean(-1, keepdim=True) + self.eps)
        x_norm = x / rms
        return self.gamma * x_norm
```

# BatchNorm

---

- **图像 NCHW**：在 **NHW** 上统计，**逐通道**归一化（`normalized_shape=[N,H,W]`）；
- **序列 NCL**：在 **NL** 上统计，同样是逐通道（`normalized_shape=[N,L]`）。

PyTorch 官方实现入口：

> [torch/nn/modules/batchnorm.py](https://github.com/pytorch/pytorch/blob/main/torch/nn/modules/batchnorm.py)

文档中的形状约定（节选）：

```python
class BatchNorm1d(_BatchNorm):
    r"""
    Shape:
        - Input: :math:`(N, C)` or :math:`(N, C, L)`, where :math:`N` is the batch size,
          :math:`C` is the number of features or channels, and :math:`L` is the sequence length
        - Output: :math:`(N, C)` or :math:`(N, C, L)` (same shape as input)

    Examples::

        >>> m = nn.BatchNorm1d(100)
        >>> input = torch.randn(20, 100)
        >>> output = m(input)
    """

class BatchNorm2d(_BatchNorm):
    r"""
    Shape:
        - Input: :math:`(N, C, H, W)`
        - Output: :math:`(N, C, H, W)` (same shape as input)

    Examples::

        >>> m = nn.BatchNorm2d(100)
        >>> input = torch.randn(20, 100, 35, 45)
        >>> output = m(input)
    """
```

更完整的 **BatchNorm2d dummy**（支持 `affine`、`track_running_stats`、多维度输入扩展思路；类名避免与上文极简版冲突）：

```python
import torch
import torch.nn as nn
class BatchNorm2dDummy(nn.Module):
    def __init__(
        self,
        num_features: int,
        eps: float = 1e-5,
        momentum: float = 0.1,
        affine: bool = True,
        track_running_stats: bool = True,
    ):
        super().__init__()
        self.num_features = num_features
        self.eps = eps
        self.momentum = momentum
        self.affine = affine
        self.track_running_stats = track_running_stats

        if affine:
            self.weight = nn.Parameter(torch.ones(num_features))
            self.bias = nn.Parameter(torch.zeros(num_features))
        else:
            self.register_parameter("weight", None)
            self.register_parameter("bias", None)

        if track_running_stats:
            self.register_buffer("running_mean", torch.zeros(num_features))
            self.register_buffer("running_var", torch.ones(num_features))
            self.register_buffer("num_batches_tracked", torch.tensor(0, dtype=torch.long))
        else:
            self.register_buffer("running_mean", None)
            self.register_buffer("running_var", None)
            self.register_buffer("num_batches_tracked", None)

        self.training = True

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        if x.dim() not in [2, 3, 4, 5]:
            raise ValueError(f"Expect 2-5D input (got {x.dim()}D input)")

        if x.dim() == 4:
            dims = (0, 2, 3)
        elif x.dim() == 3:
            dims = (0, 2)
        elif x.dim() == 5:
            dims = (0, 2, 3, 4)
        else:
            dims = (0,)

        if self.training and self.track_running_stats:
            batch_mean = x.mean(dim=dims, keepdim=True)
            batch_var = x.var(dim=dims, keepdim=True, unbiased=False)
            with torch.no_grad():
                m = self.momentum
                self.running_mean = (1 - m) * self.running_mean + m * batch_mean.squeeze()
                self.running_var = (1 - m) * self.running_var + m * batch_var.squeeze()
                self.num_batches_tracked += 1
            mean, var = batch_mean, batch_var
        elif not self.training and self.track_running_stats:
            shape = [1] * x.dim()
            shape[1] = -1
            mean = self.running_mean.view(*shape)
            var = self.running_var.view(*shape)
        else:
            mean = x.mean(dim=dims, keepdim=True)
            var = x.var(dim=dims, keepdim=True, unbiased=False)

        normalized = (x - mean) / torch.sqrt(var + self.eps)

        if self.affine and self.weight is not None and self.bias is not None:
            weight_shape = [1] * x.dim()
            weight_shape[1] = -1
            w = self.weight.view(*weight_shape)
            b = self.bias.view(*weight_shape)
            normalized = normalized * w + b

        return normalized
```

# LayerNorm

---

- **图像 NCHW**：可按样本在 **CHW** 上归一化（`normalized_shape=[C,H,W]`）；
- **序列 NLD**：通常只在最后一维 **D** 上归一化（`normalized_shape=[D]`）。

`nn.LayerNorm` 负责管理可学习的 `weight` / `bias`，核心计算多委托给 `torch.nn.functional.layer_norm`。

官方入口：

> [normalization.py — LayerNorm](https://github.com/pytorch/pytorch/blob/main/torch/nn/modules/normalization.py#L105)
> [functional.layer_norm](https://github.com/pytorch/pytorch/blob/main/torch/nn/functional.py#L2924)

文档示例（节选）：

```python
class LayerNorm(Module):
    r"""
    Examples::

        >>> # NLP
        >>> batch, sentence_length, embedding_dim = 20, 5, 10
        >>> embedding = torch.randn(batch, sentence_length, embedding_dim)
        >>> layer_norm = nn.LayerNorm(embedding_dim)
        >>> output = layer_norm(embedding)
        >>>
        >>> # Image：在最后三维（通道与空间）上归一化
        >>> N, C, H, W = 20, 5, 10, 10
        >>> input = torch.randn(N, C, H, W)
        >>> layer_norm = nn.LayerNorm([C, H, W])
        >>> output = layer_norm(input)
    """
```

**functional 形式的 dummy**（对应「在 `normalized_shape` 指定的一组末尾维度上」求均值方差）：

```python
def layer_norm(input, normalized_shape, weight=None, bias=None, eps=1e-5):
    dims = list(range(input.dim() - len(normalized_shape), input.dim()))
    mean = input.mean(dim=dims, keepdim=True)
    var = input.var(dim=dims, keepdim=True, unbiased=False)
    normalized = (input - mean) / torch.sqrt(var + eps)
    if weight is not None and bias is not None:
        normalized = normalized * weight + bias
    elif weight is not None:
        normalized = normalized * weight
    elif bias is not None:
        normalized = normalized + bias
    return normalized
```

底层实现还可对照 CPU / CUDA kernel（阅读源码时便于理解边界与数值稳定性）：

> [layer_norm_kernel.cpp](https://github.com/pytorch/pytorch/blob/main/aten/src/ATen/native/cpu/layer_norm_kernel.cpp#L59)
> [layer_norm_kernel.cu](https://github.com/pytorch/pytorch/blob/main/aten/src/ATen/native/cuda/layer_norm_kernel.cu#L253)

# RMSNorm

---

相比 LN：**去掉减均值（中心化）**，只保留除以 RMS 的缩放；仿射部分往往**只有缩放 gamma，无 bias**。

直观理解：中心化与偏置可由后续 FFN 等层补偿；**缩放对稳定梯度幅度**往往更关键。形式上若存在线性层：`y = W(x - μ) + b = Wx + (b - Wμ)`，偏置与中心化存在冗余空间。

官方接口：

> [normalization.py — RMSNorm](https://github.com/pytorch/pytorch/blob/main/torch/nn/modules/normalization.py#L343)

```python
class RMSNorm(Module):
    r"""
    Examples::

        >>> rms_norm = nn.RMSNorm([2, 3])
        >>> input = torch.randn(2, 2, 3)
        >>> output = rms_norm(input)
    """
```

# reference

---

- [PyTorch BatchNorm](https://github.com/pytorch/pytorch/blob/main/torch/nn/modules/batchnorm.py)
- [PyTorch LayerNorm / RMSNorm](https://github.com/pytorch/pytorch/blob/main/torch/nn/modules/normalization.py)
- [PyTorch F.layer_norm](https://github.com/pytorch/pytorch/blob/main/torch/nn/functional.py)

