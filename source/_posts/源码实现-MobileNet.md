---
title: 源码实现-MobileNet
thumbnail: /gallery/thumbnails/mobilenet.png
date: 2024-03-26 16:00:00
categories:
    - DeepLearning
    - PyTorch

tags: [pytorch, source_code, mobilenet]
---

> 本文整理 **MobileNetV1 / V2** （Depthwise Separable、Inverted Residual）中与标准卷积的差异，并给出与常见实现思路一致的 **PyTorch 极简模块**，便于对照 `timm` 等源码阅读。
<!-- more -->


# Contents

---

- **[概述与传统卷积](#概述与传统卷积)**
- **[MobileNetV1](#MobileNetV1)**
- **[MobileNetV2](#MobileNetV2)**
- **[PyTorch 极简实现](#PyTorch-极简实现)**
- **[reference](#reference)**

# 概述与传统卷积

---

传统卷积块常用组合：`Conv + BN + ReLU`（或同类激活）。

**MobileNet** 系列面向移动端与嵌入式场景，通过结构拆分显著降低计算量与参数量：

- **MobileNetV1**：引入 **Depthwise Separable Convolution**，把标准卷积拆成 **Depthwise（逐通道空间卷积）** + **Pointwise（1×1 通道混合）**，中间配合 BN 与 ReLU6；
- **MobileNetV2**：在 V1 基础上使用 **Inverted Residual（瓶颈倒置）**：先 **扩张（expansion）** → Depthwise → **投影（projection）**，并在步幅为 1 且输入输出通道一致时使用 **残差相加**；最后一个 pointwise 后通常 **不再接 ReLU（线性瓶颈）**，以避免破坏低维表征。

# MobileNetV1

---

对每个输入通道独立做空间卷积（groups = in_channels），再用 1×1 卷积做通道线性组合：

- **depthwise**：`Conv3×3`，`groups=in_channels`；
- **pointwise**：`Conv1×1`，输出期望通道数。

典型激活使用 **ReLU6**：`min(max(x, 0), 6)`，便于在低精度场景压缩动态范围。

# MobileNetV2

---

与「先压缩再卷积」的残差瓶颈相反，**Inverted Residual** 在低维输入上先用 1×1 **升高通道（expand）**，在高维空间做 depthwise，再用 1×1 **压回低维（project）**：

1. pointwise：`1×1` + BN + ReLU6（扩张到 `mid_channels`，常为 `in_channels × expansion`）；
2. depthwise：`k×k` + BN + ReLU6，`groups=mid_channels`；
3. pointwise：`1×1` + BN（一般 **无 ReLU**，线性瓶颈）；
4. 若 `stride == 1` 且 `in_channels == out_channels`，则 `out += x`。

当 stride≠1 或通道变化时，不进行残差相加。

# PyTorch 极简实现

---

下面是与上文结构对应的教学用模块名：**DepthwiseSeparableConv**（V1）、**ConvDepthwiseConv**（V2 倒置残差块）。对照可读性实现，`forward` 逻辑与常见开源代码一致。

```python
import torch
import torch.nn as nn


class DepthwiseSeparableConv(nn.Module):
    def __init__(self, in_channels, out_channels, stride=1):
        super().__init__()
        self.depthwise = nn.Sequential(
            nn.Conv2d(
                in_channels,
                in_channels,
                kernel_size=3,
                stride=stride,
                padding=1,
                groups=in_channels,
            ),
            nn.BatchNorm2d(in_channels),
            nn.ReLU6(inplace=True),
        )
        self.pointwise = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=1, stride=1, padding=0),
            nn.BatchNorm2d(out_channels),
            nn.ReLU6(inplace=True),
        )

    def forward(self, x):
        x = self.depthwise(x)
        x = self.pointwise(x)
        return x


class ConvDepthwiseConv(nn.Module):
    def __init__(
        self,
        in_channels,
        mid_channels,
        out_channels,
        kernel_size=3,
        stride=1,
        padding=1,
        dilation=1,
        **unused,
    ):
        super().__init__()
        self.use_residual = stride == 1 and in_channels == out_channels
        self.conv1 = nn.Sequential(
            nn.Conv2d(in_channels, mid_channels, kernel_size=1, stride=1, padding=0),
            nn.BatchNorm2d(mid_channels),
            nn.ReLU6(inplace=True),
        )
        self.depthwise = nn.Sequential(
            nn.Conv2d(
                mid_channels,
                mid_channels,
                kernel_size,
                stride,
                padding,
                groups=mid_channels,
                dilation=dilation,
            ),
            nn.BatchNorm2d(mid_channels),
            nn.ReLU6(inplace=True),
        )
        self.conv2 = nn.Sequential(
            nn.Conv2d(mid_channels, out_channels, kernel_size=1, stride=1, padding=0),
            nn.BatchNorm2d(out_channels),
        )

    def forward(self, x):
        out = self.conv1(x)
        out = self.depthwise(out)
        out = self.conv2(out)
        if self.use_residual:
            return x + out
        return out
```

工业实现里还会处理膨胀深度卷积、SE、分割头等细节；阅读 `**timm**` 中命名一致的模块更易对照论文与表格宽度倍数配置。

# reference

---

- Howard et al., *MobileNets: Efficient Convolutional Neural Networks for Mobile Vision Applications*（MobileNetV1）
- Sandler et al., *MobileNetV2: Inverted Residuals and Linear Bottlenecks*
- timm 中与 EfficientNet/MobileNet 系列共享的倒置残差参考实现：[timm — InvertedResidual（`_efficientnet_blocks.py`）](https://github.com/huggingface/pytorch-image-models/blob/main/timm/models/_efficientnet_blocks.py)

