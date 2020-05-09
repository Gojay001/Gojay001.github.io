---
title: SiamRPN++
thumbnail: /gallery/thumbnails/SiamRPN++.png
date: 2020-05-09 16:44:57
categories:
    - DeepLearning
    - Object Tracking
    - SiamRPN++
tags: [DL, Tracking, VOT]
---

> **SiamRPN++**[[1]](https://arxiv.org/abs/1812.11703) is a novel Siamese network based tracker to adopt **deep networks** that broke strict `translation invariance`. It performs `layer-wise` and `depth-wise` aggregations to successfully trained a `ResNet-driven` Siamese tracker. There are some details of reading and implementing it. 
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
> **Paper**: [SiamRPN++: Evolution of Siamese Visual Tracking with Very Deep Networks](https://arxiv.org/abs/1812.11703)(CVPR 2019 paper)  
> **Code**: [PyTorch](https://github.com/STVIR/pysot)  
> **Note**: [Mendeley](https://www.mendeley.com/viewer/?fileId=4ba3094e-f89b-cd13-6eda-a9d9cf3f08b0&documentId=b76fbf38-6c7f-31d6-8357-522ce419fa0b)

# Paper
---
## Abstract
![SiamRPN___Abstract.png](https://i.loli.net/2020/05/09/dKiPGpSx8LZt1CE.png)
> 1. Siamese trackers formulate tracking as convolutional feature cross-correlation that still have an `accuracy gap` to take advantage of features from **deep networks**.  
> 2. This paper proved the core reason comes from the `lack ofstrict translation invariance`, and break this restriction through a simple yet effective **spatial aware sampling strategy**.  
> 3. They further proposed a new model architecture to perform **layer-wise and depth- wise aggregations**.  
> 4. It obtains currently the **best results** on five large tracking benchmarks.

## Problem Description
![SiamRPN___PD.png](https://i.loli.net/2020/05/09/RQm2BqgKuEZC49o.png)
> 1. `Padding` in deep networks will destroy the strict **translation invariance**.  
> 2. `RPN` requires **asymmetrical** features for classification and regression. 

## Problem Solution
![SiamRPN___PS.png](https://i.loli.net/2020/05/09/JdM6ON2mR9jxvI3.png)
> 1. **Sampling strategy**: break the spatial `invariance` restriction.
> 2. **Layer-wise** feature aggregation: predict the similarity map from features learned at `multiple levels`.  
> 3. **Depth-wise** separable correlation: produce multiple similarity maps associated with different semantic meanings to `reduces the parameter number`.  

## Conceptual Understanding
![SiamRPN___CU.png](https://i.loli.net/2020/05/09/DnFoO9fEZIcYiuB.png)
> 1. **Hypothesis**: the violation of strict translation invariance will lead to a `spatial bias`.  
> 2. **Experiments**: targets are placed in the center with `different shift ranges` in sepreate training experiments.  
> 3. **Results**: a strong center bias is learned, increasing shift ranges could `learn more area` to alleviate it. 

## Core Conception
![SiamRPN___framework.png](https://i.loli.net/2020/05/09/IiRTPfqLa27oStE.png)
### Layer-wise Aggregation
![SiamRPN___layer-wise.png](https://i.loli.net/2020/05/09/NHGbl5iJcjFohxs.png)
> 1. They explore **multi-level features** both low level and semantic information that extracted from the last three residual block, refering these outputs as $F_3(z)$, $F_4(z)$, and $F_5(z)$.  
> 2. The output sizes of the three RPN modules have the same spatial resolution, **weighted sum** is adopted directly on the RPN output.
### Depth-wise Cross Correlation
![SiamRPN___XCorr.png](https://i.loli.net/2020/05/09/mUdgQ1nJy4uRqOt.png)
![SiamRPN___depth-wise.png](https://i.loli.net/2020/05/09/dUDWuGs3Xotikjv.png)
> 1. A **conv-bn block** is adopted to make two feature maps with the same number of channels do the `correlation operation`.  
> 2. Another **conv-bn-relu block** is appended to `fuse different channel` outputs.

![SiamRPN___phenomena.png](https://i.loli.net/2020/05/09/OMvzBE2nfeVrhLP.png)
Furthermore, an interesting phenomena is that the objects in the same category have high response on same channels, while responses of the rest channels are suppressed. It can be comprehended as `each channel represents some semantic information`.  

## Experiments
![SiamRPN___results.png](https://i.loli.net/2020/05/09/QziTsWuJ4m5HY9n.png)
![SiamRPN___more.png](https://i.loli.net/2020/05/09/QzWjHtSND98s3FJ.png) 

# Code
---
> The **complete code** can be found in [pysot][[2]](https://github.com/STVIR/pysot).

# Note
---
> More details of **SiamRPN++** and the like can be found in [[3]](https://zhuanlan.zhihu.com/p/66757733).

# References
---
> [1] LI, Bo, et al. Siamrpn++: Evolution of siamese visual tracking with very deep networks. In: Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition. 2019. p. 4282-4291.  
> [2] pysot. https://github.com/STVIR/pysot.  
> [3] Erer Huang. "Overview of Siamese Network Methods." https://zhuanlan.zhihu.com/p/66757733.  
