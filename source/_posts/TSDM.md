---
title: TSDM
thumbnail: /gallery/thumbnails/TSDM.png
date: 2020-05-23 11:09:01
categories:
    - DeepLearning
    - Object Tracking
    - TSDM
tags: [DL, Tracking, VOT]
---

> **TSDM**[[1]](https://arxiv.org/abs/2005.04063) is a **RGB-D tracker** which use depth information to pretreatment and fuse information to pro-processing. It is composed of a `Mask-generator`(M-g), `SiamRPN++` and a `Depth-refiner`(D-r). There are some details of reading and implementing it. 
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
> **Paper**: [TSDM: Tracking by SiamRPN++ with a Depth-refiner and a Mask-generator](https://arxiv.org/abs/2005.04063)(arXiv 2020 paper)  
> **Code**: [PyTorch](https://github.com/Gojay001/TSDM)  
> **Note**: [Mendeley](https://www.mendeley.com/viewer/?fileId=7721e686-ad20-cd43-2c85-efb222828ee4&documentId=3ceab671-243c-3258-8acc-3c4dc894fdc6)

# Paper
---
## Abstract
![TSDM_Abstract.png](https://i.loli.net/2020/05/23/CTjkxo4luMcvIRb.png)
> 1. **Depth information** provides informative cues for foreground-background separation and target bounding box regression.  
> 2. Few trackers have used depth information to play the important role aforementioned due to the **lack of a suitable model**.  
> 3. In this paper, a **RGB-D tracker** named TSDM is proposed, The `M-g` generates the background masks, and updates them as the target 3D position changes. The `D-r` optimizes the target bounding box estimated by `SiamRPN++`, based on the spatial depth distribution difference between the target and the surrounding background.  
> 4. It outperforms the **state-of-the-art** on the PTB and VOT.

## Problem Description
![TSDM_PD.png](https://i.loli.net/2020/05/23/l7k2CnYdKFuXHDi.png)
> 1. The main obstacle is that the tracker requires **constant information** (such as color), but the target `depth distribution may change` a lot when the target moves.  

## Problem Solution
![TSDM_PS1.png](https://i.loli.net/2020/05/23/sJCzbWlnBiQ8XdT.png)
![TSDM_PS2.png](https://i.loli.net/2020/05/23/kYjv1QwrRKTobnO.png)
> 1. **Depth mudules**: `M-g` and `D-r` can overcome the obstacle above and make use of depth information effectively.
> 2. **Data augmentation**: it helps `retrain SiamRPN++` to work better with the M-g module.  

## Conceptual Understanding
![TSDM_Pipeline.png](https://i.loli.net/2020/05/23/FZU1hn3WsTva87o.png)
> 1. **Mask-generator**: Input $X_d$ and $\overline{Dt_{i-1}}$ into M-g to get $M$ and $M_c$, then use $F_m(\cdot)$ to get $X_m$.  
> 2. **SiamRPN++**: Input $Z$ and $X_m$ into the core, then outputs the target bounding box $B_s$ ($W,H,C_x,C_y$).  
> 3. **Depth-refiner**: Cut out $R_c$ and $R_d$ from $X_c$ and $X_d$ by $B_s$ respectively. Then input $R_c$ and $R_d$ into D-r to get the refined target bounding box $B_d$ ($w,h,xr,yb$).  

## Core Conception
### Mask-generator
> 1. M-g generates two **background mask** images, $M$ is a 2-value image for clearing out the background of $X_c$, and $M_c$ is a color image for coloring the background of $X_c$.  
> 2. **$M_c$ color selection**: $M_c$ enhances the target background difference to make the target template matching easier.
> 3. **M-g stop-restart strategy**: M-g should automatically stop to avoid masking the real target when a transient tracking drift happens.  
> 4. **M-g simulated data augmentation**: it used to generate enough training samples ($X_m$) to retrain the SiamRPN++.  
### SiamRPN++
> - It takes an image pair ($Z,X$) as input and outputs the target bounding box in the current frame, as: $f(Z,X)=\phi(Z)\ast\phi(X)$.  
> - More details of SiamRPN++ can be found in previous blog [SiamRPN++][[2]](https://gojay.top/2020/05/09/SiamRPN++/).
### Depth-refiner
> 1. The bounding box estimated by the core contains the whole target, D-r improve the tracker performance just by `cutting out no-target area`.  
> 2. **Information Fusion Network**: It uses `depth` information to optmize the target state, and `color` information to overcomes the slight color-depth mismatch. The full architecture is as follows:    

![TSDM_Architecture.png](https://i.loli.net/2020/05/23/KsZ3E49h7rqwbHO.png)

## Experiments
![TSDM_Result.png](https://i.loli.net/2020/05/23/vsPDpfiEXBTNzCH.png)
![TSDM_VOT.png](https://i.loli.net/2020/05/23/4khIEPgyb97e5Kp.png)
![TSDM_PTB.png](https://i.loli.net/2020/05/23/N2DJ1WKnzqisE3u.png)

# Code
---
> The **complete code** can be found in [here](https://github.com/Gojay001/TSDM) with citing TSDM[[3]](https://github.com/lql-team/TSDM).  
[Updating]

# Note
---
> How to use depth information on MOT tasks, detection or re-ID.

# References
---
> [1] ZHAO, Pengyao, et al. TSDM: Tracking by SiamRPN++ with a Depth-refiner and a Mask-generator. arXiv preprint arXiv:2005.04063, 2020.
> [2] Gojay. "SiamRPN++." https://gojay.top/2020/05/09/SiamRPN++/
> [3] TSDM. https://github.com/lql-team/TSDM
