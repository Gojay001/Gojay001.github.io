---
title: PANet
thumbnail: /gallery/thumbnails/PANet.png
date: 2020-12-02 09:56:12
categories:
    - DeepLearning  
    - Few-Shot Segmentation  
    - PANet
tags: [DL, FSS, PANet]
---

> **PANet**(PANet: Few-Shot Image Semantic Segmentation with Prototype Alignment)[[1]](http://openaccess.thecvf.com/content_ICCV_2019/papers/Wang_PANet_Few-Shot_Image_Semantic_Segmentation_With_Prototype_Alignment_ICCV_2019_paper.pdf) `learns class-specific prototype` representations for images and `matches each pixel` to the learned prototypes. There are some details of reading and implementing it. 
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
> **Paper**: [PANet: Few-Shot Image Semantic Segmentation with Prototype Alignment](http://openaccess.thecvf.com/content_ICCV_2019/papers/Wang_PANet_Few-Shot_Image_Semantic_Segmentation_With_Prototype_Alignment_ICCV_2019_paper.pdf)(ICCV 2019 paper)  
> **Code**: [PyTorch](https://github.com/kaixin96/PANet)  
> **Note**: [Mendeley](https://www.mendeley.com/reference-manager/reader/2904ce4f-305b-388c-8b5a-a58259fa3cee/1e2a1138-6c0b-247b-1505-c4d7d7feab14)

# Paper
---
## Abstract
![PANet_Abstract.png](https://i.loli.net/2020/12/02/T71evCiJbcKw9F4.png)

## Problem Solution
![PANet_Overview.png](https://i.loli.net/2020/12/02/lQvSNATpVfOk7LX.png)
![PANet_PS.png](https://i.loli.net/2020/12/02/GAFZUK46HfeqXwY.png)

## Conceptual Understanding
![PANet_network.png](https://i.loli.net/2020/12/02/YCfgtD2Xx9E3FsU.png)
### Prototype learning
![PANet_prototype.png](https://i.loli.net/2020/12/02/bSry6HqVGMsgvNO.png)
### Non-parametric metric learning
![PANet_metric.png](https://i.loli.net/2020/12/02/dFK6LsP5iu4Gqmf.png)

## Core Conception
![PANet_Algorithm.png](https://i.loli.net/2020/12/02/rgQPTtOq7sB9jyJ.png)

## Experiments
![PANet_results.png](https://i.loli.net/2020/12/02/etowxWrIKzAlLDc.png)
![PANet_QR.png](https://i.loli.net/2020/12/02/9ZvBMaT45SDerdP.png)

# Code
---
[Updating]

# Note
---
- provided a baseline in prototype learning for few-shot segmentation.

# References
---
> [1] Wang K, Liew J H, Zou Y, et al. Panet: Few-shot image semantic segmentation with prototype alignment[C]//Proceedings of the IEEE International Conference on Computer Vision. 2019: 9197-9206.  
> [2] PANet. https://github.com/kaixin96/PANet.