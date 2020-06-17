---
title: SORT
thumbnail: /gallery/thumbnails/SORT.png
date: 2020-06-14 12:47:54
categories:
    - DeepLearning
    - Object Tracking
    - SORT
tags: [DL, Tracking, MOT]
---

> **SORT**[[1]](https://arxiv.org/abs/1602.00763) is pragmatic approach for **online and realtime** applications. It achieves SOTA with using `Kalman filter` and `Hungarian algorithm`. There are some details of reading and implementing it. 
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
> **Paper**: [Simple Online and Realtime Tracking](https://arxiv.org/abs/1602.00763)(ICIP 2016 paper)  
> **Code**: [PyTorch](https://github.com/abewley/sort)  
> **Note**: [Mendeley](https://www.mendeley.com/viewer/?fileId=13481f42-a600-524f-08b2-c16d48b76b2c&documentId=a3d58906-82b5-3454-b0db-173e8bedc4e0)

# Paper
---
## Abstract
![SORT_Abstract.png](https://i.loli.net/2020/06/15/u7SPa1cqrkLZOiy.png)
> 1. THis paper explores a pragmatic approach to multiple object tracking where the main focus is to `associate objects`.  
> 2. To this end, `detection quality` is identified as a key factor influencing tracking performance.  
> 3. It only use the `Kalman filter` and `Hungarian algorithm` for the tracking components.  
> 4. It achieves an accuracy comparable to `state-of-the-art` online trackers.

## Problem Description
> 1. Traditionally methods delay making difficult decisions while there is `high uncertainty` over the object assignments.  
> 2. Recent developments still delay the `decision making` which makes them unsuitable for online tracking.  

## Problem Solution
![SORT_Simple.png](https://i.loli.net/2020/06/15/BiferdJYLpGm96F.png)
![SORT_PS.png](https://i.loli.net/2020/06/15/av8bwNkBlYFPgzf.png)
> 1. **Occam's Razor**: Only the `bounding box` position and size are used for both motion estimation and data association.  
> 2. **Detection**: CNN based, like Faster R-CNN[[2]](https://gojay.top/2019/10/19/Faster-R-CNN/).  
> 3. **Motion estimation**: Kalman filter[[3]](https://zhuanlan.zhihu.com/p/39912633).  
> 4. **Data association**: Hungarian algorithm[[4]](https://zhuanlan.zhihu.com/p/62981901).

## Core Conception
### Detection
![SORT_Comparison.png](https://i.loli.net/2020/06/15/TDyNnBFciJKQm1z.png)
> To this end, **detection quality** is identified as a `key factor` influencing tracking performance, where changing the detector can improve tracking by up to 18.9%. 
### Estimation Model
![SORT_Estimation.png](https://i.loli.net/2020/06/15/LVa2uc4lARBEjS6.png)
> 1. It used to `propagate` a target’s identity into the next frame.  
> 2. It uses `Kalman filter` with a linear constant velocity model.  
> 3. The state of each target is modelled as: $x=[u,v,s,r,\dot{u},\dot{v},\dot{s}]^T$.  
### Data Association
![SORT_Association.png](https://i.loli.net/2020/06/15/iFpybWmC3dcqseY.png)
> 1. It used to `assign detections` to existing targets.  
> 2. The assignment cost matrix is then computed as the intersection-over-union `(IOU) distance`.  
> 3. The assignment is solved optimally using the `Hungarian algorithm`.
### Creation and Deletion of Track Identities
![SORT_Management.png](https://i.loli.net/2020/06/15/1oW98fgSUrXFsKk.png)

## Experiments
![SORT_Performance.png](https://i.loli.net/2020/06/15/ifJtZF2CWT6LHme.png)
![SORT_MOT.png](https://i.loli.net/2020/06/15/vcXpkKJVNtWoaP4.png)

# Code
---
> The **complete code** can be found in SORT[[5]](https://github.com/abewley/sort).  
 
[Updating]

# Note
---
> 1. Allowing for new methods to focus on object `re-identification` to handle long term occlusion.  
> 2. Future work will investigate a tightly coupled `detection` and tracking framework.

# References
---
> [1] Bewley, Alex, et al. "Simple online and realtime tracking." 2016 IEEE International Conference on Image Processing (ICIP). IEEE, 2016.  
> [2] gojay. "Faster R-CNN." https://gojay.top/2019/10/19/Faster-R-CNN/  
> [3] Bzarg, Bot. "How a Kalman filter works in pictures." https://zhuanlan.zhihu.com/p/39912633  
> [4] ZihaoZhao. "Hungarian algorithm and Kuhn-Munkres algorithm." https://zhuanlan.zhihu.com/p/62981901
> [5] SORT. https://github.com/abewley/sort
