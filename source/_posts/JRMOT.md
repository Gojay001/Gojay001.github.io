---
title: JRMOT
thumbnail: /gallery/thumbnails/JRMOT.png
date: 2020-02-28 17:17:03
categories:
    - DeepLearning
    - Object Tracking
    - JRMOT
tags: [DL, Tracking, MOT]
---

> **JRMOT**[[1]](https://arxiv.org/pdf/2002.08397.pdf) is a novel **3D MOT** system that integrates information from `2D RGB images` and `3D point clouds` into a real-time performing framework. There are some details of reading and implementing it. 
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
> **Paper**: [JRMOT: A Real-Time 3D Multi-Object Tracker and a New Large-Scale Dataset](https://arxiv.org/pdf/2002.08397.pdf)(arXiv 2020 paper)  
> **Code**: [Pytorch][Updating]  
> **Note**: [JRMOT](https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Tracking/JRMOT/Note)

# Paper
---
## Abstract
![JRMOT_Abstract.png](https://i.loli.net/2020/03/07/dmaLBQJ4GUCwT68.png)
> 1. **JRMOT** is a novel 3D MOT system that integrates information from 2D RGB images and 3D point clouds into a real-time performing framework.  
> 2. They also released the **JRDB dataset**, which is a novel large scale 2D+3D dataset.  
> 3. It demonstrates **state-of-the-art** performance against competing methods on the popular `2D tracking` KITTI benchmark and serves as a competitive `3D tracking` baseline for our dataset and benchmark.

## Problem Description
![JRMOT_PD.png](https://i.loli.net/2020/03/07/dghLEX3SUctofVY.png)
> **MOT**: the agent needs to perceive the motion of the multiple dynamic objects and other agents.  
> **Reccent approaches:**: perceive `2D motion` from RGB video streams. 

## Problem Solution
![JRMOT_PS.png](https://i.loli.net/2020/03/07/HfmgSq3XZUKW9Rw.png)
> 1. It integrates 2D detection from `Mask R-CNN` and 3D information from `F-PointNet`.
> 2. It fuses the 3D shape descriptor with a 2D RGB descriptor through `Aligned-ReID`.  
> 3. It uses optimal joint probabilistic `data association` step.  
> 4. A novel multi-modal `recursive Kalman filter` was proposed.

## Conceptual Understanding
![JRMOT_Overview.png](https://i.loli.net/2020/03/07/MFN7LyRxT2ptcVr.png)
> It shows all components of the JRMOT, and workflow as below.  
![JRMOT_Workflow.png](https://i.loli.net/2020/03/07/GkX5gKVAhBJSYzs.png)

## Experiments
![JRMOT_Car.png](https://i.loli.net/2020/03/07/7sZvzGifPRN35Qt.png)  
![JRMOT_Pedestrian.png](https://i.loli.net/2020/03/07/4Dk8QM7rW2xwqCX.png)  
> It results on online KITTI Car and Pedestrian Tracking, and gets SOTA performance.  

# Code
---
[Updating]

# Note
---
![JRMOT_dataset.png](https://i.loli.net/2020/03/07/JcwWAfkHONEIUne.png)
> It shows data collection platform and sample visualization of the dataset.  

# References
---
> 1. Shenoi A, Patel M, Gwak J Y, et al. JRMOT: A Real-Time 3D Multi-Object Tracker and a New Large-Scale Dataset[J]. arXiv preprint arXiv:2002.08397, 2020.