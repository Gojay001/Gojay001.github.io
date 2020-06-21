---
title: DeepSORT
thumbnail: /gallery/thumbnails/DeepSORT.png
date: 2020-06-20 10:35:15
categories:
    - DeepLearning
    - Object Tracking
    - DeepSORT
tags: [DL, Tracking, MOT]
---

> **DeepSORT**[[1]](https://arxiv.org/abs/1703.07402) integrates `appearance information` to improve the performance of `SORT`, learned a deep association metric. There are some details of reading and implementing it. 
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
> **Paper**: [Simple Online and Realtime Tracking with a Deep Association Metric](https://arxiv.org/abs/1703.07402)(ICIP 2017 paper)  
> **Code**: [PyTorch](https://github.com/nwojke/deep_sort), [TensorFlow](https://github.com/Qidian213/deep_sort_yolov3)  
> **Note**: [Mendeley](https://www.mendeley.com/viewer/?fileId=4bdd5275-2587-dcc1-6dcd-ea8a59676550&documentId=de716d88-7206-37da-8903-6f3616998bac)

# Paper
---
## Abstract
![DeepSORT_Abstract.png](https://i.loli.net/2020/06/20/aDNpkhEtdTiszx5.png)
> 1. **SORT**[[2]](https://gojay.top/2020/06/14/SORT/) is a pragmatic approach to multiple object tracking.  
> 2. In this paper, **appearance information** was integrated to improve the performance of SORT for tackling the `long-term occlusions`.  
> 3. They place **offline pre-traning** with a learned `deep association metirc` on person re-id dataset, while establish `measurement-to-track associations` using nearest neighbor queries during **online application**.  
> 4. It reduces the number of **identity switches** by 45%.

## Problem Description
> 1. Traditional methods are not applicable in **online scenarios** and the performance of these methods comes at `increased computational` and `implementation complexity`.  
> 2. **SORT** returns a relatively high number of `identity switches`.  

## Problem Solution
![DeepSORT_PS.png](https://i.loli.net/2020/06/20/wukElyi38fd6jaV.png)
> They overcome this issue by replacing the association metric with a more informed metric that **combines motion and appearance information**.

## Core Conception
### State Estimation
![DeepSORT_Estimation.png](https://i.loli.net/2020/06/20/KlhfnoV56zywWjB.png)
### Assignment Problem
> 1. **Motion** information: `Mahalanobis` distance $d^{(1)}(i,j)=(d_{j}-y_{i})^{T}S_{i}^{-1}(d_{j}-y_{i})$.  
> 2. **Appearance** information: smallest `cosine` distance $d^{(2)}(i,j)=min \lbrace 1-r_{j}^{T}r_{k}^{(i)} |r_{k}^{(i)}\in{R_{i}} \rbrace$.  
> 3. In **combination** for occlusions: weighted sum $c_{i,j}=\lambda d^{(1)}(i,j)+(1-\lambda)d^{(2)}(i,j)$.  
### Matching Cascade
![DeepSORT_Matching.png](https://i.loli.net/2020/06/20/VrXym6S3MjaEYfB.png)
### Deep Appearance Descriptor
![DeepSORT_Architecture.png](https://i.loli.net/2020/06/20/5TcFVHg2aozqsSZ.png)

## Experiments
![DeepSORT_output.png](https://i.loli.net/2020/06/20/LCgbwueJB1aOGnM.png)
![DeepSORT_Results.png](https://i.loli.net/2020/06/20/yvYxZ9j6JNiz3so.png)

# Code
---
> 1. The **complete code** can be found in deep_sort[[3]](https://github.com/nwojke/deep_sort).  
> 2. Another `tensorflow` implementation can be found in deep_sort_yolov3[[4]](https://github.com/Qidian213/deep_sort_yolov3).
 
[Updating]

# Note
---
> More details about the `whole algorithm` and its `implementation` can be found in [[5]](https://zhuanlan.zhihu.com/p/133678626).

# References
---
> [1] Wojke N, Bewley A, Paulus D. Simple online and realtime tracking with a deep association metric[C]//2017 IEEE international conference on image processing (ICIP). IEEE, 2017: 3645-3649.  
> [2] Gojay. "SORT." https://gojay.top/2020/06/14/SORT/  
> [3] deep_sort. https://github.com/nwojke/deep_sort 
> [4] deep_sort_yolov3. https://github.com/Qidian213/deep_sort_yolov3  
> [5] pprp. "Anasis for Deep SORT." https://zhuanlan.zhihu.com/p/133678626
