---
title: Tracklet
thumbnail: /gallery/thumbnails/Tracklet.png
date: 2020-03-26 16:41:56
categories:
    - DeepLearning
    - Object Tracking
    - Tracklet
tags: [DL, Tracking, MOT]
---

> **Tracklet**[[1]](https://arxiv.org/abs/2003.02795) is a novel method for optimizing `tracklet consistency`, which directly takes the `prediction errors` into account. There are some details of reading and implementing it. 
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
> **Paper**: [Multi-object Tracking via End-to-end Tracklet Searching and Ranking](https://arxiv.org/abs/2003.02795)(arXiv 2020 paper)  
> **Code**: [Pytorch][Updating]  
> **Note**: [Tracklet](https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Tracking/Tracklet/Note)

# Paper
---
## Abstract
![Tracklet_Abstract.png](https://i.loli.net/2020/03/27/nxgNL3iSzwIy6Fr.png)
> 1. Recent work use **sequence model** to calculate the `similarity score` between the detections and the previous tracklets, but the forced exposure to ground-truth in the training stage leads to the `training-inference discrepancy` problem.  
> 2. This paper directly takes the `prediction errors` into account to optimize tracklet consistency.  
> 3. It havs achieved `state-of-the-art` in MOT15-17 challenge benchmarks using public detection and online settings.

## Problem Description
![Tracklet_PD1.png](https://i.loli.net/2020/03/27/zJ7hZow1cfXHgjI.png)
![Tracklet_PD2.png](https://i.loli.net/2020/03/27/xyDN9hWI5TbrZAF.png)
> 1. **pairwise-detection matching** based on affinity model: It has limited capability to associate `long-term` consistent trajectories.  
> 2. affinity model on **sequence model**: tracklet representative feature for `matching` can somewhat be ill-posed and ideal assumption brings up a potential `vulnerability`. 

## Problem Solution
![Tracklet_PS.png](https://i.loli.net/2020/03/27/FWGkirCulfpbhgv.png)
> 1. They propose a **global score** to measure the inner `appearance consistency` of tracklet.
> 2. It optimizes the **whole tracklet** with a `margin loss`.  
> 3. a novel algorithm has been established to `simulate the prediction data distribution on training` by introducing realistic discombobulated candidates to model.  

## Conceptual Understanding
![Tracklet_CU.png](https://i.loli.net/2020/03/27/3ZmrPFzwNvLkKUI.png)
> 1. **Tracklet-level** based tracking: It constructs an affinity model on the `tracklet level` and then uses it to associate the tracklet with detection or connect short tracklets.  
> 2. **Pair-wise association** methods: They establish an affinity model on the `isolated detections`, and then generate tracking results from the bottom up.  
> The **common concern** of these two types of methods is to `guarantee the consistency of the entire associated trajectories`. 

## Core Conception
![Tracklet_Network.png](https://i.loli.net/2020/03/27/219VSogiUlnLwqM.png)
> 1. Training procedure: It follows a “searching-learning-ranking-pruning” pipeline.  
> 2. Scoring Network: The `appearance feature` of each detection are extracted with CNN(**ResNet-50**), and the `appearance embedding` of tracklet are obtained through encoder(**LSTM**).  
> 3. It trained by online hypothesis tracklet searching with `margin loss` and `rank loss`, details as follow.

![Tracklet_CC.png](https://i.loli.net/2020/03/27/IxdSb8aVH3DBsOG.png)

## Experiments
![Tracklet_Results.png](https://i.loli.net/2020/03/27/qAfh2vIuDRWTtlX.png)  
> They report the quantitative results on the three datasets in **MOT Challenge Benchmark**.

# Code
---
![Tracklet_SBTO.png](https://i.loli.net/2020/03/27/CgTOnXJujhDeIsV.png)

# Note
---
> More details of **Tracklet optimization** and the like can be found in [[2]](https://blog.csdn.net/qq_36449741/article/details/104815321?depth_1-utm_source=distribute.pc_relevant.none-task&utm_source=distribute.pc_relevant.none-task).

# References
---
[1] Hu, T., Huang, L., & Shen, H. (2020). Multi-object Tracking via End-to-end Tracklet Searching and Ranking. arXiv preprint arXiv:2003.02795.  
[2] Change_ZH. "Tracklet: MOT Scoring Network." https://blog.csdn.net/qq_36449741/article/details/104815321?depth_1-utm_source=distribute.pc_relevant.none-task&utm_source=distribute.pc_relevant.none-task.