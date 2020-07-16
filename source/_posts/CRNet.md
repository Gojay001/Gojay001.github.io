---
title: CRNet
thumbnail: /gallery/thumbnails/CRNet.png
date: 2020-07-10 15:56:24
categories:
    - DeepLearning  
    - Few-Shot Segmentation  
    - CRNet  
tags: [DL, FSS, CRNet]
---

> **CRNet**(Cross-Reference Networks)[[1]](https://openaccess.thecvf.com/content_CVPR_2020/papers/Liu_CRNet_Cross-Reference_Networks_for_Few-Shot_Segmentation_CVPR_2020_paper.pdf) make predictions for both the support image and the query image. It can better find the `co-occurrent objects` in the two images, thus helping the few-shot segmentation task. There are some details of reading and implementing it. 
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
> **Paper**: [CRNet: Cross-Reference Networks for Few-Shot Segmentation](https://openaccess.thecvf.com/content_CVPR_2020/papers/Liu_CRNet_Cross-Reference_Networks_for_Few-Shot_Segmentation_CVPR_2020_paper.pdf)(CVPR 2020 paper)  
> **Code**: [Code]  
> **Note**: [Mendeley](https://www.mendeley.com/viewer/?fileId=161a13d8-6526-470d-7889-dd7905e96320&documentId=b44fb606-2cd2-3955-bfa5-1430f6db76d8)

# Paper
---
## Abstract
![CRNet_Abstract.png](https://i.loli.net/2020/07/13/IcG7NiFghYf3MBx.png)
> 1. **Image segmentation** algorithms are based on `deep convolutional neural networks` in recent years.  
> 2. **Few-shot segmentation** aims to learn a segmentation model that can be gener- alized to novel classes with only a `few training images`.  
> 3. In this work, they propose a cross-reference network (**CRNet**) including `cross-reference module` for finding the co-occurrent objects and `mask refinement` module for refining predictions.  
> 4. It achieves **state-of-the-art** performance on the `PASCAL VOC 2012` dataset.

## Problem Description
![CRNet_PD.png](https://i.loli.net/2020/07/13/uZmHLzYG8TpRCVg.png)

## Problem Solution
![CRNet_PS.png](https://i.loli.net/2020/07/13/ZfexKDjHP9QmRJ3.png)

## Conceptual Understanding
![CRNet_Comparison.png](https://i.loli.net/2020/07/13/VY4yIAuv2ieTN1g.png)
![CRNet_Network.png](https://i.loli.net/2020/07/13/AWUHx93gQ8NmXlT.png) 

## Core Conception
![CRNet_cross-reference.png](https://i.loli.net/2020/07/13/JaSxqzYCcLiyArM.png)
![CRNet_condition.png](https://i.loli.net/2020/07/13/eOvZuxcfjEwMCah.png)
![CRNet_refinement.png](https://i.loli.net/2020/07/13/CJV9j5ctwrinuAg.png)

## Experiments
![CRNet_examples.png](https://i.loli.net/2020/07/13/wymXlRYZdpJfGcz.png)
![CRNet_Comparison-1-shot.png](https://i.loli.net/2020/07/13/tB7KTQGSkpudmNg.png)
![CRNet_Comparison-5-shot.png](https://i.loli.net/2020/07/13/ExJOW6Gk7Us2PbS.png)

# Code
---
[Updating]

# Note
---
[Updating]

# References
---
> [1] Liu W, Zhang C, Lin G, et al. CRNet: Cross-Reference Networks for Few-Shot Segmentation[C]//Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition. 2020: 4165-4173.
