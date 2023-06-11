---
title: Python-random汇总
thumbnail: /gallery/thumbnails/random.png
date: 2023-06-11 15:12:32
categories:
    - DigitalImageProcessing
    - Python API
tags: [python, numpy, pytorch]
---

> 本文主要对 python 常用的几个 `random 模块` 进行简单的对比分析，并对常用的函数及其参数进行总结。包括 `python-random, numpy-random, pytorch-random`。
<!-- more -->

# Contents
---
- **[随机数及随机种子](#随机数及随机种子)**
- **[不同库中 random 模块](#不同库中random模块)**
- **[random模块常用函数](#random模块常用函数)**
- **[reference](#reference)**

# 随机数及随机种子
---
- 真随机数

真随机数需要自然界中真实的随机物理现象才能产生，而对于计算机来说生成这种随机数是很难办到的；

- 伪随机数

伪随机数是通过一个初始化的值，来计算来产生一个随机序列；  
如果初始值是不变的，那么多次从该种子产生的随机序列也是相同的。  
通过设置相同初始值，在程序每次运行时就能生成相同的随机序列，从而复现程序结果。  
这个 `初始值` 就称为 `随机种子`。

# 不同库中random模块
---
## 程序中随机数
```python
import random
import numpy as np
import torch

# set seed
seed = 12345
random.seed(seed)
np.random.seed(seed)
torch.manual_seed(seed)

# generate random number
n_random = random.random()
n_np_random = np.random.rand(1)
n_torch_ranfom = torch.rand(1)

print(f'random: {n_random}, np: {n_np_random}, torch: {n_torch_ranfom}')
# random: 0.41661987254534116, np: [0.92961609], torch: tensor([0.9817])
```

此时，每次程序运行结果将会是上述值；  
当 ramdom/numpy/torch 版本不同时，生成的随机数可能会与上述值不同；

## seed 作用范围
- 当程序中产生多个随机数时，随机数将会改变；【在 for 循环中常见】

以 numpy 举例，python, torch 中 random 模块同理：

```python
seed = 12345
np.random.seed(seed)
n_np_random_1 = np.random.rand(2)
n_np_random_2 = np.random.rand(2)

print(f'first: {n_np_random_1}, second: {n_np_random_2}')
# first: [0.92961609 0.31637555], second: [0.18391881 0.20456028]
```

因为第二次生成随机数，已经不是在之前设置的np.random.seed(seed)下了；

- 如果想`生成多个相同的随机数`，则需要再次设置相同的 seed：

```python
seed = 12345
np.random.seed(seed)
n_np_random_1 = np.random.rand(2)
np.random.seed(seed)
n_np_random_2 = np.random.rand(2)

print(f'first: {n_np_random_1}, second: {n_np_random_2}')
# first: [0.92961609 0.31637555], second: [0.92961609 0.31637555]
```

- 此外，只设置一次 seed，虽然在程序中会生成了多个不同的随机数，但是在每次运行的结果将会保持一致；

即，每次运行程序都将会得到 # first: [0.92961609 0.31637555], second: [0.18391881 0.20456028]；

## 不同库的 seed 相互隔离
**np.random.seed**, **torch.manual_seed** 使用 `MT19937` 来生成随机数；
> MT 是因为这个伪随机数产生器基于 Mersenne Twister 算法。
> 19937 是因为产生随的机数的周期长，可达到 $2^{19937-1}$。

np.random.seed 只影响 NumPy 的随机过程，torch.manual_seed 也只影响 PyTorch 的随机过程。

```python
np.random.seed(12345)

print(np.random.rand(1)) # always output [0.92961609]
print(torch.rand(1))  # different in each running time
```

```python
torch.manual_seed(12345)

print(np.random.rand(1)) # different in each running time
print(torch.rand(1))  # always output tensor([0.9817])
```

## CUDA 随机数
`torch.cuda.manual_seed_all`: 设置显卡的随机种子。  
同样只影响 CUDA 的随机过程，与 NumPy 和 PyTorch 相互隔离。  
在 PyTorch 的内部，使用 `CUDA Runtime API` 提供的 `curand` 来设置随机种子。

- `torch.manual_seed` 是对所有的设备设置随机种子：

```python
import torch
torch.cuda.manual_seed_all(12345)

print(torch.rand(1))  # different in each running time
print(torch.rand(1, device="cuda:0"))  # always output tensor([0.8202], device='cuda:0')
print(torch.rand(1, device="cuda:1"))  # always output tensor([0.8202], device='cuda:1')
```

- 如果希望在不同的 GPU 设备上可以`生成不同的随机数`：

```python
import torch

seed = 12345
torch.manual_seed(seed)
for i in range(torch.cuda.device_count()):
    torch.cuda.set_device(i)
    torch.cuda.manual_seed_all(seed + i)

print(torch.rand(1))  # always output tensor([0.0819])
print(torch.rand(1, device="cuda:0"))  # always output tensor([0.8202], device='cuda:0')
print(torch.rand(1, device="cuda:1"))  # always output tensor([0.9036], device='cuda:1')
```

此时，既保证了随机性（不同设备产生不同的随机数），也保证了确定性（多次调用产生相同结果）。

- 用 GPU 训练的实验结果，`在 CPU 上复现`：

CPU 设置随机种子是用 PyTorch 官方实现的 `MT19937`，而 GPU 是用到了 CUDA Runtime API 的 `curand`。因此两套实现是完全不同的，那么对于相同的随机种子，理应产生不同的随机序列，用下面的代码可以验证：

```python
import torch

torch.manual_seed(12345)
print(torch.rand(1))  # always output tensor([0.9817])

torch.manual_seed(12345)
print(torch.rand(1, device="cuda:0"))  # always output tensor([0.8202], device='cuda:0')
```

**只要不直接在 GPU 上创建随机变量，就可以避免这个问题**。  
即，在 CPU 上创建 Tensor，再切换到 GPU 上：

```python
import torch

torch.manual_seed(12345)
print(torch.rand(1))  # always output tensor([0.9817])

torch.manual_seed(12345)
print(torch.rand(1).to("cuda:0"))  # always output tensor tensor([0.9817], device='cuda:0')
```

此时，GPU 和 CPU 的输出保持一致。

# random 模块常用函数
---
## python - random
python 中 random 模块主要用于生成`一个随机元素或一个随机列表`。  
详细函数见官方文档（3.11.4）：https://docs.python.org/zh-cn/3/library/random.html

| Methods | Descriptions |
| --- | --- |
| random.random() | 返回一个 [0, 1) 的浮点数 |
| random.uniform(a, b) | 返回一个 [a, b] 的浮点数 |
| random.randrange(start, stop[, step]) | 返回一个整数 from range(start, stop, step) |
| random.randint(a, b) | 返回一个 [a, b] 的整数 |
| random.choice(seq) | 返回一个随机元素 from sequence |
| random.choices(population, *, …, k=1) | 返回大小为 k 的元素列表，从 population 中有放回抽样 |
| random.sample(population, k, *, …) | 返回大小为 k 的元素列表，从 population 中不放回抽样 |
| random.shuffle(x) | 就地将序列 x 随机打乱位置 |

## numpy - random
numpy 中 random 模块主要用于生成`指定形状（大小或维度）的 np.ndarray`。  
详细函数见官方文档（1.24）：https://numpy.org/doc/stable/reference/random/index.html  
【size 可以取 int, tuple, list】

| Methods | Descriptions |
| --- | --- |
| np.random.random([size]) | 返回指定 size 的 [0, 1) np.ndarray |
| np.random.rand(d0, d1, …, dn) | 返回指定 dim 的 [0, 1) np.ndarray，均匀分布 |
| np.random.randn(d0, d1, …, dn) | 返回指定 dim 的 [0, 1) np.ndarray，标准正态分布 |
| np.random.randint(low=0, high[, size, dtype]) | 返回指定 size 的 [low, high) np.ndarray |
| np.random.choice(a[, size, replace, p]) | 返回指定 size 的 np.ndarray from a |

## torch - random
pytorch 中 random 相关函数主要用于生成`指定形状（大小或维度）的 torch.Tensor`。  
详细函数见官方文档（2.0）：https://pytorch.org/docs/stable/search.html?q=rand&check_keywords=yes&area=default  
【size 可以取 int, tuple, list】

| Methods | Descriptions |
| --- | --- |
| torch.rand(*size[, …]) | 返回指定 size 的 [0, 1) torch.Tensor，均匀分布 |
| torch.randn(*size[, …]) | 返回指定 size 的 [0, 1) torch.Tensor，正态分布 |
| torch.randint(low=0, high, size[, …]) | 返回指定 size 的 [low, high) torch.Tensor |
| torch.randperm(n[, …]) | 返回 [0, n-1] 的整数排列 torch.Tensor |

# reference
---
> [1] [Seed Everything - 可复现的 PyTorch](https://chenglu.me/blogs/real-seed-everything).  
> [2] [Pytorch中的随机性问题](https://www.cnblogs.com/sddai/p/14606613.html).  
> [3] [Python自带的random库，numpy的随机库，torch的随机函数](https://www.cnblogs.com/picassooo/p/13633771.html).  
> [4] [python-3.11.4-random](https://docs.python.org/zh-cn/3/library/random.html).  
> [5] [numpy-1.24-random](https://numpy.org/doc/stable/reference/random/index.html).  
> [6] [pytorch-2.0-random](https://pytorch.org/docs/stable/search.html?q=rand&check_keywords=yes&area=default).