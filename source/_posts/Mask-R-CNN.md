---
title: Mask R-CNN
thumbnail: /gallery/thumbnails/Mask R-CNN.png
date: 2020-08-17 21:37:19
categories:
    - DeepLearning  
    - Object Segmentation  
    - Mask R-CNN  
tags: [DL, Segmentation, Mask R-CNN]
---

> **Mask R-CNN**[[1]](http://openaccess.thecvf.com/content_ICCV_2017/papers/He_Mask_R-CNN_ICCV_2017_paper.pdf) is a framework for object **instance segmentation**, which adds a branch for `predicting an object mask` in parallel with the existing branch for bounding box recognition of `Faster R-CNN`. There are some details of reading and implementing it.  
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
> **Paper**: [Mask R-CNN](http://openaccess.thecvf.com/content_ICCV_2017/papers/He_Mask_R-CNN_ICCV_2017_paper.pdf)(ICCV 2017 paper)  
> **Code**: [Pytorch](https://github.com/facebookresearch/detectron2)  
> **Note**: [Mendeley](https://www.mendeley.com/viewer/?fileId=7cf81d53-02f7-9c65-0040-d1a695798524&documentId=c8be9f0f-e376-399b-96d7-5470dfd95a2a)

# Paper
---
## Abstract
![Mask R-CNN_Abstract.png](https://i.loli.net/2020/08/19/CYqtbVd9SJoDkwa.png)  
> 1. It is a framework for object **instance segmentation**.  
> 2. It extends `Faster R-CNN` by adding a branch for **predicting an object mask** in parallel with the existing branch for bounding box recognition.  
> 3. It challenges instance `segmentation`, bounding-box object `detection`, and person `keypoint` detection.  
> 4. It serves as a solid **baseline** in instance-level recognition.  

## Problem Description
![Mask R-CNN_PD.png](https://i.loli.net/2020/08/19/ZON9UKSFLe2RVaz.png)

## Problem Solution
![Mask R-CNN_PS.png](https://i.loli.net/2020/08/19/WwRoj1sS4Y5fuaC.png)

## Conceptual Understanding
![Mask R-CNN_framework.png](https://i.loli.net/2020/08/19/JBnDjVRAO6Hl5si.png)

## Core Conception
### Loss
![Mask R-CNN_Loss.png](https://i.loli.net/2020/08/19/4NZEos2dGHUVpIc.png)
### Mask
![Mask R-CNN_mask.png](https://i.loli.net/2020/08/19/ADjVwQFTWKcbgS8.png)
![Mask R-CNN_Head.png](https://i.loli.net/2020/08/19/4jErPFaW9RAI3UM.png)
### RoIAlign
![Mask R-CNN_RoIAlign.png](https://i.loli.net/2020/08/19/78pRm3IBwaEcY2h.png)
![Mask R-CNN_RoIAlign-details.png](https://i.loli.net/2020/08/19/kDOiJQuMpRHLs3o.png)

## Experiments
![Mask R-CNN_results.png](https://i.loli.net/2020/08/19/eGxm6bV48LyXEdj.png)
![Mask R-CNN_Ablations.png](https://i.loli.net/2020/08/19/cg5apbFo93rZQDS.png)
![Mask R-CNN_AP.png](https://i.loli.net/2020/08/19/kRViK42PfIChMsu.png)

# Code
---
> The **complete code** can be found in detectron2[[2]](https://github.com/facebookresearch/detectron2).  

# Note
---
> More details of **Mask R-CNN and its extends** like RoIAlign, bilinear interpolation and etc. can be found in [[3]](https://zhuanlan.zhihu.com/p/37998710).  


# References
---
> [1] He K, Gkioxari G, Dollár P, et al. Mask r-cnn[C]//Proceedings of the IEEE international conference on computer vision. 2017: 2961-2969.  
> [2] detectron2. https://github.com/facebookresearch/detectron2  
> [3] stone. "The amazing Mask R-CNN." https://zhuanlan.zhihu.com/p/37998710
