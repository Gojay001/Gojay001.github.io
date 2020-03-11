---
title: PAMCC-AOT
thumbnail: /gallery/thumbnails/PAMCC-AOT.png
date: 2020-02-25 17:23:40
categories:
    - DeepLearning
    - Object Tracking
    - PAMCC-AOT
tags: [DL, Tracking, AOT]
---

> **Pose-Assisted Multi-Camera Collaboration System**[[1]](https://arxiv.org/pdf/2001.05161.pdf) is a novel method, which enables a camera to cooperate with the others by sharing camera poses for **AOT**(active object tracking). There are some details of reading and implementing it. 
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
> **Paper**: [Pose-Assisted Multi-Camera Collaboration for Active Object Tracking](https://arxiv.org/pdf/2001.05161.pdf)(AAAI 2020 paper)  
> **Code**: [Pytorch][Updating]  
> **Note**: [PAMCC-AOT](https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Tracking/PAMCC-AOT/Note)

# Paper
---
## Abstract
![PAMCC_Abstract.png](https://i.loli.net/2020/03/05/boPwgRD79B1cmJk.png)
> 1. **PAMCC-AOT** is proposed to solve complex scenarios problems.
> 2. The `vision-based controller` tracks targets based on observed images.  
> 3. The `pose-based controller` moves the camera in accordance to the poses of the other cameras.  
> 4. At each step, the `switcher` decides which action to take from the two controllers according to the visibility of the target.  

## Problem Description
![PAMCC_PD.png](https://i.loli.net/2020/03/05/sUzY42L75oXkWn6.png)
> **AOT**: a tracker is able to control its motion so as to follow a target autonomously.  
> **Problems**: high complexity of environments and limitation of camera mobility. 

## Problem Solution
![PAMCC_PS.png](https://i.loli.net/2020/03/05/uLdrSojp5OI71RN.png)
> 1. It extend the independent AOT to the `CMC-AOT`.  
> 2. They proposed `PAMCC-AOT` sharing camera poses.  
> 3. They provided a set of `3D environments`.

## Conceptual Understanding
![PAMCC_Overview.png](https://i.loli.net/2020/03/05/LCe9slH3XKqUmZO.png)
![PAMCC_Network.png](https://i.loli.net/2020/03/05/tey8owNKmrjbsW4.png)
> In the system, each camera is equipped with `two controllers` and `a switcher`.  
> 1. **Vision-based Controller**: it serves as an image processor and guides the camera to execute policy based on image observation.  
> 2. **Pose-based Controller**: it helps the camera who receives an imperfect observation to execute policy based on the supplementary pose information provided by other cameras.  
> 3. **Switcher**: it makes the camera switch between the vision-based controller and pose-based controller properly.

## Experiments
![PAMCC_Results.png](https://i.loli.net/2020/03/05/xTiPhZcnHMRDW3l.png)

# Code
---
[Updating]

# Note
---
![PAMCC_Conclusion.png](https://i.loli.net/2020/03/05/CQniYkFgSTRpL84.png)

# References
---
> [1] Li, Jing, et al. "Pose-Assisted Multi-Camera Collaboration for Active Object Tracking." arXiv preprint arXiv:2001.05161 (2020).  
