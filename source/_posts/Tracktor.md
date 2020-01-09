---
title: Tracktor
thumbnail: /gallery/thumbnails/Tracktor.png
date: 2019-11-09 08:21:49
categories:
    - DeepLearning  
    - Object Tracking  
    - Tracktor  
tags: [DL, Tracking, Tracktor]
---

> **Tracking without bells and wistles**[[1]](https://arxiv.org/abs/1903.05625) is used to **detect objects** from videos in each frame, while **forming tracks** by linking corresponding detections across time. There are some details of reading and implementing it.  
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
> **Paper**: [[Tracking without bells and whistles](https://arxiv.org/pdf/1903.05625.pdf)(ICCV 2019 paper)  
> **Code**: [PyTorch](https://github.com/Gojay001/tracking_wo_bnw)  
> **Note**: [tracking_wo_bnw](https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Tracking/tracktor/Note)

# Paper
---
## Abstract
![tracking_Abstract.png](https://i.loli.net/2019/11/09/g1R4zUjKkCfbieo.png)    
As `abstract` of the paper, their work mainly converted a detector into a **Tracktor**, which exploit the **bounding box regression** of an object detector to predict the position of an object in the next frame.  
> 1. It extended a straightforward **re-identification** and **camera motion compensation** to improving `identity preservation` across frames.  
> 2. It achieved **state-of-the-art** on tackling most of the `easy tracking scenarios`. Besides, it also got ideal effect in tackling `complex tracking scenarios`. Therefore, it point out promising future research **directions**.

## Problem Description
![tracking_PD.png](https://i.loli.net/2019/11/09/7C6jrXBRAn1dveg.png) 
> It shows the **problem** of multi-object tracking and **exsiting solution** for tacking this problem.

## Problem Solution
![tracking_PS.png](https://i.loli.net/2019/11/09/XvVkJMzjNSDU2cf.png)  
> It intrudued a **Tracktor**, converted detector into a tracktor by exploit the `bounding box regression`, and then extended `Siamese network` and `motion model`.  

## Conceptual Understanding
![tracking_CU.png](https://i.loli.net/2019/11/09/g92n4ZytoFVqMQJ.png)  
![tracking_flow.png](https://i.loli.net/2019/11/09/tHsJ9qa1IuE7SwP.png)  
> It describes the whole flow of Tracktor, including **detector** and **two processing steps**, that is `initialing new` tracks and `killing old` tracks. Then it explains **each symbol** of this process and how to deal with them. 

## Details of implementation
![tracking_Doi.png](https://i.loli.net/2019/11/09/oYwuheT9bKmrtFH.png)   
### tracking multi-object
> 1. **tracking step**: it includes `detecting` object and `form tracks` by linking frames.  
> 2. **reID**: it uses `Siamese network` to generate apearance feature to re-identify killed objects.  
> 3. **motion model**: it contains problems of `large camera motion` and `low video frame rate`.  
### Experiments
> 1. **tracking**: it choosed Faster **R-CNN** with ResNet-101 as backbone network, it also provided **FPN** and `other strategy`.  
> 2. **reID**: it trained `TriNet` with ResNet-50 as backbone network, and `triplet loss` as loss function.  
> 3. **CMC and ECC** to deal with large camera motion, **CVA** to tackle low video frame rate problem.  

# Code
---
> The **complete code** can be found in [here](https://github.com/Gojay001/tracking_wo_bnw) with citing tracking_wo_bnw[[2]](https://github.com/phil-bergmann/tracking_wo_bnw).  

## Tracktor algorithm
![tracking_algorithm.png](https://i.loli.net/2019/11/09/zXQkF7Ve2W8bgoC.png)

# Note
---
![tracking_Improvement.png](https://i.loli.net/2019/11/09/hEpR1WycrkVTtH9.png)
> some methods to improve **accuracy** or accelerate **speed** can add into this program.  

# References
---
> [1] Bergmann, Philipp, Tim Meinhardt, and Laura Leal-Taixe. "Tracking without bells and whistles." arXiv preprint arXiv:1903.05625 (2019).  
> [2] tracking_wo_bnw. https://github.com/phil-bergmann/tracking_wo_bnw  