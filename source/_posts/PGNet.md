---
title: PGNet
thumbnail: /gallery/thumbnails/PGNet.png
date: 2020-07-28 15:39:02
categories:
    - DeepLearning  
    - Few-Shot Segmentation  
    - PGNet  
tags: [DL, FSS, PGNet]
---

> **PGNet**(Pyramid Graph Networks)[[1]](https://openaccess.thecvf.com/content_ICCV_2019/papers/Zhang_Pyramid_Graph_Networks_With_Connection_Attentions_for_Region-Based_One-Shot_Semantic_ICCV_2019_paper.pdf) modeled structured segmentation data with `graphs` and further proposed a `pyramid-like` structure that models different sizes of image regions as graph nodes. There are some details of reading and implementing it. 
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
> **Paper**: [Pyramid Graph Networks with Connection Attentions for Region-Based One-Shot Semantic Segmentation](https://openaccess.thecvf.com/content_ICCV_2019/papers/Zhang_Pyramid_Graph_Networks_With_Connection_Attentions_for_Region-Based_One-Shot_Semantic_ICCV_2019_paper.pdf)(ICCV 2019 paper)  
> **Code**: [Code]  
> **Note**: [Mendeley](https://www.mendeley.com/viewer/?fileId=672b8f91-8a7c-c4d5-293e-66aa74eea9e8&documentId=363d5efa-69a1-3590-ba6f-be219cd095b6)

# Paper
---
## Abstract
![PGNet_Abstract.png](https://i.loli.net/2020/07/29/zMuxchgAdr9UGTj.png)
> 1. **One-shot image segmentation** yields a many-to-many message passing problem with only `one training image` available.  
> 2. **Previous methods** described as one-to-many problem by squeezing support data to a `global descriptor`.  
> 3. In this work, they model structured segmentation data with **graphs** and apply `attentive graph reasoning`, `graph attention mechanism` could establish the element-to-element correspondence, `pyramid-like structure` is able to  capture correspondence at different semantic levels.  
> 4. It leads to new **state-of-the-art** performance on 1-shot and 5-shot segmentation benchmarks of the `PASCAL VOC 2012` dataset.

## Problem Description
![PGNet_PD.png](https://i.loli.net/2020/07/29/sxjrE43viX5B1No.png)

## Problem Solution
![PGNet_PS.png](https://i.loli.net/2020/07/29/c6reyUIoqORD9K1.png)
![PGNet_episode.png](https://i.loli.net/2020/07/29/YAroctS45LE9eVD.png)

## Conceptual Understanding
![PGNet_Illustration.png](https://i.loli.net/2020/07/29/G53zlNkaSJCFrwv.png)
![PGNet_Network.png](https://i.loli.net/2020/07/29/HiRqwF68s7EpMfk.png) 

## Core Conception
![PGNet_GAU.png](https://i.loli.net/2020/07/29/W93LIonVJFAw5Z2.png)
![PGNet_correlation.png](https://i.loli.net/2020/07/29/FCrWSKxBiVmqGdI.png)

## Experiments
![PGNet_Results.png](https://i.loli.net/2020/07/29/nYi1b57XQkdoUR3.png)
![PGNet_Comparison.png](https://i.loli.net/2020/07/29/XNGbSHPeOdUWsou.png)

# Code
---
[Updating]

# Note
---
[Updating]

# References
---
> [1] Zhang C, Lin G, Liu F, et al. Pyramid graph networks with connection attentions for region-based one-shot semantic segmentation[C]//Proceedings of the IEEE International Conference on Computer Vision. 2019: 9587-9595.
