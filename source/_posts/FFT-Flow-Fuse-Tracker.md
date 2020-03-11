---
title: FFT(Flow-Fuse Tracker)
thumbnail: /gallery/thumbnails/FFT.png
date: 2020-03-05 11:13:26
categories:
    - DeepLearning
    - Object Tracking
    - FFT
tags: [DL, Tracking, MOT]
---

> **FFT(Flow-Fuse Tracker)**[[1]](https://arxiv.org/abs/2001.11180) is an end-to-end DNN tracking approach, that jointly learns both target `motions` and `associations` for **MOT**(multiple object tracking). There are some details of reading and implementing it. 
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
> **Paper**: [Multiple Object Tracking by Flowing and Fusing](https://arxiv.org/pdf/2001.11180)(arXiv 2020 paper)  
> **Code**: [Pytorch][Updating]  
> **Note**: [FFT](https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Tracking/FFT/Note)

# Paper
---
## Abstract
![FFT_Abstract.png](https://i.loli.net/2020/03/05/1OesrJHjDAGtz9P.png)
> 1. **Previous**: estimating target-wise motions and conducting pair-wise Re-Identification(Re-ID).  
> 2. **This paper**: target `flowing` and target `fusing`.  
> 3. **Achievment**: SOTA on 2DMOT15, MOT16 and MOT17.  

## Problem Description
![FTT_PD.png](https://i.loli.net/2020/03/05/8OtgljCNLzT9o76.png)
> Reccent approaches: First produce target `motion and appearance features` respectively, then conduct target `association` between frames.  
> It is very difficult for **computating** both features.

## Problem Solution
![FFT_PS.png](https://i.loli.net/2020/03/05/VRa6PuLqOtsTZK3.png)
> It includes two techniques: **target flowing** and **target fusing**.  
> For target flowing: `FlowTracker` extract target-wise motions from pixel-level optical flows.  
> For target fusing: `FuseTracker` refines and fuse targets.  

![FFT_Step.png](https://i.loli.net/2020/03/05/23n594VCaT8ODXA.png)

## Conceptual Understanding
![FFT_Overview.png](https://i.loli.net/2020/03/05/vLTWRQGalhquezm.png)
![FFT_FlowTracker.png](https://i.loli.net/2020/03/05/3hD9UVx1i7taR5I.png)
![FFT_FuseTracker.png](https://i.loli.net/2020/03/05/lJauE7OYwsFZf8X.png)

## Experiments
![FFT_AblationStudy.png](https://i.loli.net/2020/03/05/9IFQE2sliwM1JBc.png)
![FFT_MOT15.png](https://i.loli.net/2020/03/05/WubM9GzesxKoaJl.png)
![FFT_MOT.png](https://i.loli.net/2020/03/05/shPekuRUY1v2qpa.png)

# Code
---
## Algorithm
![FFT_Algorithm.png](https://i.loli.net/2020/03/05/Siv6hm3QZLpftJO.png)

# Note
---
![FFT_Improvement.png](https://i.loli.net/2020/03/05/FXkIu4oRUAyMWSN.png)

# References
---
> [1] Zhang, Jimuyang, et al. "Multiple Object Tracking by Flowing and Fusing." arXiv preprint arXiv:2001.11180 (2020).  