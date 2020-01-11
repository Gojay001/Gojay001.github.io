---
title: SiamMask
thumbnail: /gallery/thumbnails/SiamMask.png
date: 2019-11-26 10:31:16
categories:
    - DeepLearning
    - Object Tracking
    - SiamMask
tags: [DL, Tracking, SiamMask]
---

> **SiamMask**[[1]](http://openaccess.thecvf.com/content_CVPR_2019/papers/Wang_Fast_Online_Object_Tracking_and_Segmentation_A_Unifying_Approach_CVPR_2019_paper.pdf) is used to **detect and segment objects** from videos in each frame, **initializing** a single bounding box and **outputing** binary segmentation mask and rotated objects boxes. There are some details of reading and implementing it. 
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
> **Paper**: [Fast Online Object Tracking and Segmentation: A Unifying Approach](http://openaccess.thecvf.com/content_CVPR_2019/papers/Wang_Fast_Online_Object_Tracking_and_Segmentation_A_Unifying_Approach_CVPR_2019_paper.pdf)(CVPR 2019 paper)  
> **Code**: [PyTorch](https://github.com/foolwood/SiamMask)  
> **Note**: [SiamMask](https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Tracking/SiamMask/Note)

# Paper
---
## Abstract
![SiamMask_Abstract.png](https://i.loli.net/2019/11/27/GoOd5IRwKBQHZhT.png)    
As `abstract` of the paper, their work mainly dubbed a method called **SiamMask**, which foucused on **VOT**(visual object tracking) and semi-supervised **VOS**(video object segmentation). It improved the `offline training` by augmenting loss with a binary segmentatin task.   
> 1. It solely relies on a single bounding box **initialisation** and **produces** class-agnostic object mask and rotated bounding boxes.  
> 2. It yield a solid evidence that SiamMask is a new **state of the art** among **real-time** trackers.

## Problem Description
![SiamMask_PD.png](https://i.loli.net/2019/11/27/rKdO8AiWwNCIzLH.png) 
> It shows the **task** of SiamMask focused on and the **needs** for tacking this problem.

## Problem Solution
![SiamMask_PS.png](https://i.loli.net/2019/11/27/CaObXSwIFGtfEi6.png)  
> It shows improments on **Initialisation** and **outputs** for accuracy.  

## Conceptual Understanding  
![SiamMask_Schematic.png](https://i.loli.net/2020/01/03/xIu8fhOiVRpWDlc.png)
![SiamMask_CU.png](https://i.loli.net/2019/11/27/YoH1sdPFzbQnc3N.png)  
> It describes the whole **architecture** of SiamMask with three brach and two branch, which adds **mask branch** to original siamese network.

## Details of implementation
![SiamMask_Implementation.png](https://i.loli.net/2019/11/27/rinPNk4UtOSJ7Zf.png)   
> 1. **network architecture**: it consists of `backbone`, `head` and `mask refinement module`.  
> 2. **training**: it divides three parts to training respectively, including `FC`, `RPN` and `segmentation`.  
> 3. **inference**: it evaluated once per frame with `max scores`.  

### Architecture
More details can be found in paper.
> 1. **backbone**: it remains the first 4-th stage of `ResNet`, with adding `adjust layer` and depth-wise `cross-correlated`.  
![SiamMask_Backbone.png](https://i.loli.net/2020/01/03/xu1Um6jrt7NDByk.png)
> 2. **head**: The `conv5` block in both variants contains a normalisation layer and ReLU non-linearity while `conv6` only consists of a 1×1 convolutional layer.  
![SiamMask_Head.png](https://i.loli.net/2020/01/03/qw1PkeFBaDiAfxK.png)
> 3. **refinement**: It merges low and high resolution features using multi- ple refinement modules made of `upsampling layers` and `skip connections`.  
![SiamMask_Refinement.png](https://i.loli.net/2020/01/03/RvQENIfnAW4yFba.png)
![SiamMask_Example.png](https://i.loli.net/2020/01/03/JuihvjsC4rFbnAo.png)

## Experiments
Ablation study shows the contributions for VOT.
![SiamMask_VOT2016.png](https://i.loli.net/2020/01/03/oRuWZHq9GcIrCEf.png)
More experienment results shows below.
![SiamMask_Results.png](https://i.loli.net/2020/01/03/qH3TDVCeyZGBj65.png)

# Code
---
> The **complete code** can be found in [SiamMask][[2]](https://github.com/foolwood/SiamMask). 

# Note
---
![SiamMask_Improvement.png](https://i.loli.net/2020/01/02/lupaxeJ4N7L5gXq.png)
> some free ideas that orienting **future work**.  
> More details of **Understanding** this work from author can be found in [[3]](https://zhuanlan.zhihu.com/p/58154634). 

# References
---
> [1] Wang, Qiang, et al. "Fast online object tracking and segmentation: A unifying approach." Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition. 2019.  
> [2] SiamMask. https://github.com/foolwood/SiamMask  
> [3] Qiang Wang. "Thinking about SiamMask." https://zhuanlan.zhihu.com/p/58154634