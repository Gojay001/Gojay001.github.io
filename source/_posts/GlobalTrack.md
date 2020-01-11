---
title: GlobalTrack
thumbnail: /gallery/thumbnails/GlobalTrack.png
date: 2020-01-04 08:15:20
categories:
    - DeepLearning
    - Object Tracking
    - GlobalTrack
tags: [DL, Tracking, GlobalTrack]
---

> **GlobalTrack**[[1]](https://arxiv.org/pdf/1912.08531.pdf) is a pure global tracker for **long-term tracking**, without temporal consistency assumption making cumulative errors. There are some details of reading and implementing it.
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
> **Paper**: [GlobalTrack: A Simple and Strong Baseline for Long-term Tracking](https://arxiv.org/pdf/1912.08531.pdf)(AAAI 2020 paper)  
> **Code**: [Pytorch](https://github.com/huanglianghua/GlobalTrack)  
> **Note**: [GlobalTrack](https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Tracking/GlobalTrack/Note)

# Paper
---
## Abstract
![GlobalTrack_Abstract.png](https://i.loli.net/2020/01/09/9xEH8ec2YSyNQOb.png) 
As `abstract` of the paper, their work mainly proposed a method called **GlobalTrack**, which is a pure global instance search based tracker that makes `no assumption` on the temporal consistency.   
> 1. It is developed based on two-stage object detector Faster R-CNN, with two submodules `QG-RPN` and `QG-RCNN`.  
> 2. it is able to perform `full-image` and `multi-scale` search of arbitrary instances with only a **single query** as the guide.  
> 3. They further propose a `cross-query` loss to improve the robustness of this approach against distractors. 

## Problem Description
![GlobalTrack_PD.png](https://i.loli.net/2020/01/09/FieyOYchuaRSqNK.png) 
> It shows the difficults of `long-term tracking` and the problem of `existing trackers`.

## Problem Solution
![GlobalTrack_PS.png](https://i.loli.net/2020/01/09/7CuMdwjcrWtbKi3.png)  
> It shows the **methods** for solving long-term tracking problem.  

## Conceptual Understanding
![GlobalTrack_Architecture.png](https://i.loli.net/2020/01/11/Vx6BRCIos7PmLzq.png)
![GlobalTrack_CU.png](https://i.loli.net/2020/01/09/O2rsA5CqplZG3kX.png)  
> It describes the overall architecture of GlobalTrack with `QG-RPN` and `QG-RCNN`.

## Details of implementation
![GlobalTrack_Implementation.png](https://i.loli.net/2020/01/09/xrBYwAnS3i8FzVL.png) 
> 1. **Offline Training**: it samples `frame pairs` from training videos.  
> 2. **Online Tracking**: it contains `initialization`, `tracking` and `results`.  
> 3. **Cross-query Loss**: it choose `top-1 prediction` as result. 

### Architecture
![GlobalTrack_Arch.png](https://i.loli.net/2020/01/11/Bb6iJfIWFo8kEq2.png)
> 1. **Query-Guide RPN**: it generating query-specific proposals.  
> 2. **Query-Guide RCNN**: it consists of feature modulation and traditional RCNN.  
> 3. **Tracking Results**: it takes top-1 prediction as results.  

## Experiments
They compared this approach GlobalTrack with state-of-the-art trackers on four large-scale tracking benchmarks as follows.
![GlobalTrack_Ex1.png](https://i.loli.net/2020/01/11/jnrF62a1SDPTKXt.png)
![GlobalTrack_Ex2.png](https://i.loli.net/2020/01/11/bpnHEVCB2fG8qvy.png)
![GlobalTrack_Ex3.png](https://i.loli.net/2020/01/11/wP1H5Jg68XBfCoq.png)

# Code
---
> The **complete code** can be found in [GlobalTrack][[2]](https://github.com/huanglianghua/GlobalTrack). 

# Note
---
![GlobalTrack_Improvement.png](https://i.loli.net/2020/01/09/uz2587VQdgOPfsy.png)
> some free ideas that orienting **future work**. 

# References
---
> [1] Huang, Lianghua, Xin Zhao, and Kaiqi Huang. "GlobalTrack: A Simple and Strong Baseline for Long-term Tracking." arXiv preprint arXiv:1912.08531 (2019).  
> [2] GlobalTrack. https://github.com/huanglianghua/GlobalTrack  