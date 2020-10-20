---
title: SG-One
thumbnail: /gallery/thumbnails/SG-One.png
date: 2020-10-20 10:34:55
categories:
    - DeepLearning  
    - Few-Shot Segmentation  
    - SG-One
tags: [DL, FSS, SG-One]
---

> **SG-One**(SG-One: Similarity Guidance Network for One-Shot Semantic Segmentation)[[1]](https://arxiv.org/abs/1810.09091) adopt a **masked average pooling** strategy for producing the `guidance features`, then leverage the **cosine similarity** to build the `relationship`. There are some details of reading and implementing it. 
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
> **Paper**: [SG-One: Similarity Guidance Network for One-Shot Semantic Segmentation](https://arxiv.org/abs/1810.09091)(arXiv 2018 / TCYB 2020 paper)  
> **Code**: [PyTorch](https://github.com/xiaomengyc/SG-One)  
> **Note**: [Mendeley](https://www.mendeley.com/reference-manager/reader/ffe2d6e7-5c75-392a-87d7-1e47a0bb683c/0bf89367-08cd-3b21-6e06-ff32cb9b7860)

# Paper
---
## Abstract
![SG-One_Abstract.png](https://i.loli.net/2020/10/20/dsEJTAZM4v5OhSm.png)

## Problem Description
> Current existing methods are all based on the **Siamese framework**, that is, a pair of `parallel networks is trained` for extracting the features of labeled support images and query images.  

- The parameters of using the two **parallel networks are redundant**, which is prone to `overfitting` and leading to the waste of `computational resources`.
- `Combining the features` of support and query images by **mere multiplication is inadequate** for guiding the query network to learn high-quality segmentation masks.

## Problem Solution
![SG-One_overview.png](https://i.loli.net/2020/10/20/4vaxNhbD6VtgQPH.png)
![SG-One_PS.png](https://i.loli.net/2020/10/20/GlgV8PjXFK6pMO2.png)

## Conceptual Understanding
![SG-One_network.png](https://i.loli.net/2020/10/20/SbvQ5zsFhq8lu7o.png)
- **Similarity Guidance branch**: The extracted representative vectors of support images are expected to contain the `high-level semantic features of a specific object`.
- **Segmentation branch**: Through the concatenation, Segmentation Branch can borrow features from the paralleling branch, and these two branches can `communicate information during the forward and backward stages`.

## Core Conception
![SG-One_MAP.png](https://i.loli.net/2020/10/20/YK3dMDSeWHmvBph.png)
![SG-One_SG.png](https://i.loli.net/2020/10/20/m9Uz23KwFj7XPfn.png)

## Experiments
![SG-One_MIoU.png](https://i.loli.net/2020/10/20/Me2PH6iFw5WDptT.png)
![SG-One_results.png](https://i.loli.net/2020/10/20/4DdkzgIn1XVmyNG.png)
![SG-One_SimilarityMap.png](https://i.loli.net/2020/10/20/unxr1h7daobyTfm.png)
![SG-One_Comparision.png](https://i.loli.net/2020/10/20/1cfkMLPvNxpiamg.png)
![SG-One_parameters.png](https://i.loli.net/2020/10/20/mldTGMOpvJR8hYz.png)
![SG-One_vectors.png](https://i.loli.net/2020/10/20/fD9mupCcastreK7.png)

# Code
---
[Updating]

# Note
---
1. The **latent distributions** between the training classes and testing classes do not align, which `prevents us from obtaining better features for input images`.
2. The predicted masks some-times can only cover part of the target regions and may include some background noises if the **target object is too similar to the background**.

# References
---
> [1] Zhang X, Wei Y, Yang Y, et al. Sg-one: Similarity guidance network for one-shot semantic segmentation[J]. IEEE Transactions on Cybernetics, 2020.  
> [2] SG-One. https://github.com/xiaomengyc/SG-One.
