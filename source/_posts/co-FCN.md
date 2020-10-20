---
title: co-FCN
thumbnail: /gallery/thumbnails/co-FCN.png
date: 2020-10-19 22:03:52
categories:
    - DeepLearning  
    - Few-Shot Segmentation  
    - co-FCN
tags: [DL, FSS, co-FCN]
---

> **co-FCN**(Conditional Networks for Few-Shot Semantic Segmentation)[[1]](https://arxiv.org/abs/1709.03410) handle **sparse pixel-wise annotations** to achieve nearly the same accuracy. There are some details of reading and implementing it. 
<!-- more -->

# Contents
---
- **[Paper & Code & note](#Paper&Code&note)**
- **[Paper understanding](#Paper)**
- **[Code understanding](#Code)**
- **[Note](#Note)**
- **[References](#References)**

# Paper & Code & note
---
> **Paper**: [Conditional Networks for Few-Shot Semantic Segmentation](https://openreview.net/pdf?id=SkMjFKJwG)(ICLR 2018 paper)  
> **Code**: [Code] 
> **Note**: [Mendeley](https://www.mendeley.com/reference-manager/reader/2b5c49b3-fdc2-3123-a886-49e0a108255b/1c09d920-7dae-897d-7603-caa16c4a9860)

# Paper
---
## Abstract
![co-FCN_Abstract.png](https://i.loli.net/2020/10/20/5MUgKQeiNhSX9BL.png) 
> 1. They propose the **co-FCN**, a conditional network learned by **end-to-end optimization** to perform fast, accurate few-shot segmentation.  
> 2. The network conditions on an annotated support set of images via `feature fusion` to do inference on an unannotated query image.  
> 3. Annotations are instead conditioned on in a `single forward pass`, making our method suitable for interactive use.

## Problem Description
> Some current methods rely on **meta-learning**, or **learning to learn**, in order to quickly adapt to new domains or tasks.  

- It cannot be applied out-of-the-box to the **structured output setting** due to the `high dimensionality of the output space`.
- The **statistical dependencies among outputs** that result from the `spatial correlation of pixels in the input`.

## Problem Solution
- Our contributions cover handling **sparse pixel-wise annotations**, **conditioning features vs. parameters**.
- Our method achieves `nearly the same accuracy` with only **one positive and one negative pixel**.

## Conceptual Understanding
![co-FCN_network.png](https://i.loli.net/2020/10/20/gaLwhZfrD3b574N.png)

## Experiments
![co-FCN_Evaluation.png](https://i.loli.net/2020/10/20/d1U3OGKfielRTQB.png)

# Code
---
[Updating]

# Note
---
[Updating]

# References
---
> [1] Rakelly K, Shelhamer E, Darrell T, et al. Conditional networks for few-shot semantic segmentation[J]. 2018.  
