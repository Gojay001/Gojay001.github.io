---
title: FairMOT
thumbnail: /gallery/thumbnails/FairMOT.png
date: 2020-05-25 19:31:14
categories:
    - DeepLearning
    - Object Tracking
    - FairMOT
tags: [DL, Tracking, MOT]
---

> **FairMOT**[[1]](https://arxiv.org/abs/2004.01888) is a **one-shot tracker** to fuse object detection and re-identification in a single network. The most contributions in this papar are `anchor-free` Re-ID feture extraction, multi-layer `feature aggregation` and `lower-dimensional` re-ID fetures. There are some details of reading and implementing it. 
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
> **Paper**: [A Simple Baseline for Multi-Object Tracking](https://arxiv.org/abs/2004.01888)(arXiv 2020 paper)  
> **Code**: [Pytorch](https://github.com/Gojay001/FairMOT)  
> **Note**: [Mendeley](https://www.mendeley.com/viewer/?fileId=3596929f-22de-4f63-7b5a-574ca3f75d1c&documentId=2f8fe432-d0b0-3dd8-aca8-2128175c156a)

# Paper
---
## Abstract
![FairMOT_Abstract.png](https://i.loli.net/2020/05/28/LIsCEvDGgup65e2.png)
> 1. There has been remarkable progress on **multi-object tracking** with object detection and re-identification.  
> 2. Little attention has been focused on accomplishing the two tasks in a **single network**.  
> 3. In this work, they study the essential **reasons** behind the failure, and accordingly present a simple baseline to addresses the problem.  
> 4. It outperforms the **state-of-the-art** on the public datasets.

## Problem Description
> 1. **Two steps**: First the `detection` model localizes the bounding boxes of objects, then the `association` model extracts Re-ID features and links it to tracks. However, those methods cannot perform inference at video rate because the two networks **do not share features**.  
> 2. **One-shot**: Those methods `jointly` detect objects and learn Re-ID features. However, the **accuracy** and **ID switches** get worse a lot.  

## Problem Solution
![FairMOT_anchor-free.png](https://i.loli.net/2020/05/28/8bFG29dRVMkZI1t.png)
> 1. **Anchor-Free**: the anchor-based methods usually operate on a `coarse grid`. So there is a high chance that the features extracted at the anchor are `not aligned with the object center`.  
> 2. **Multi-Layer Feature Aggregation**: it helps `reduce identity switches` by aggregating low-level and high-level features.  
> 3. **Lower-dimensional features**: It helps reduce the risk of `over-fitting` to small data, and improves the tracking `robustness`.

## Conceptual Understanding
![FairMOT_Overview.png](https://i.loli.net/2020/05/28/PzwV5syQnaN36LO.png)
> 1. **Multi-Layer Feature Aggregation**: It follows Deep Layer Aggregation (`DLA`) to fuse features from multiple layers in order to deal with objects of different scales.  
> 2. **Anchor-free object detection**: It estimates the `object centers` on high-resolution feature map.  
> 3. **pixel-wise Re-identification**: It learn `low-dimensional` Re-ID features to reduce the computation time and improve the robustness.  

## Core Conception
### Object Dection Branch
> 1. **Heatmap Head**: This head is responsible for estimating the locations of the `object centers`.  
> 2. **Center Offset Head**: This head is responsible for localizing the objects `more precisely`.  
> 3. **Box Size Head**: This head is responsible for estimating the height and width of the target `bounding box` at each anchor location.  
### Identify Embedding Branch
> 1. The goal of the identity embedding branch is to generate features that can `distinguish different objects`.  
> 2. The resulting featuresis $E\in{R^{128\times{W}\times{H}}}$, the distance between different objects should be larger.
### Loss Functions
> 1. **Heatmap Loss**: The loss function is defined as pixel-wise logistic regression with `focal loss`.  
> 2. **Offset and Size Loss**: They we enforce `l1 losses` for the two heads.  
> 3. **Identity Enbedding Loss**: They treat object identity embedding as a classification task, then compute the `softmax loss`.
### Online Tracking
![FairMOT_Tracking.png](https://i.loli.net/2020/05/28/QlBpdnh8v14YTaM.png)

## Experiments
![FairMOT_one-shot.png](https://i.loli.net/2020/05/28/bsJxNwjY1cKHRuh.png)
![FairMOT_private.png](https://i.loli.net/2020/05/28/VWYjHe5bt9kLI4y.png)

# Code
---
> The **complete code** can be found in [here](https://github.com/Gojay001/FairMOT) with citing FairMOT[[2]](https://github.com/ifzhang/FairMOT).  
[Updating]

# Note
---
> 1. This method achieves the SOTA under the `private detector` on MOT Challenge, but it still exists in experiments.  
> 2. It mostly improved detectional performance, when using it in actual enviroments, the `IDS` increase a lot than previous methods.  
> 3. Considering how to improve the IDS is important in real world, maybe we can improve the association module based on `depth information`.  

# References
---
> [1] Zhan Y, Wang C, Wang X, et al. A Simple Baseline for Multi-Object Tracking[J]. arXiv preprint arXiv:2004.01888, 2020.
> [2] FairMOT. https://github.com/ifzhang/FairMOT
