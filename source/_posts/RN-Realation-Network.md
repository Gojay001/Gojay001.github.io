---
title: RN(Relation Network)  
thumbnail: /gallery/thumbnails/RN.png  
date: 2019-08-21 15:51:05  
categories:  
    - DeepLearning  
    - Few-Shot Learning  
    - RN  
tags: [DL, FSL, RN]
---

> There are some details of reading and implementing the **Relation Network** for few-shot learning.
<!-- more -->

# Contents
---
- **[Paper & Code & note](#Paper&Code&note)**
- **[Paper understanding](#Paper)**
- **[Code understanding](#Code)**
- **[References](#References)**
- **[Note](#Note)**

# Paper & Code & note
---
> **Paper**: [Learning to Compare: Relation Network for Few-Shot Learning](https://arxiv.org/abs/1711.06025)(CVPR 2018 paper)  
> **Code**: [PyTorch](https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Few-Shot%20Learning/RN/Code/README.md)(Few-Shot Learning part)  
> **Note**: [RN for FSL](https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Few-Shot%20Learning/RN/Note)

# Paper
---
## Abstract
![RN_abstract.png](https://i.loli.net/2019/08/24/rmHGwBoZKsxAT2U.png)  
As `abstract` of the paper, their work mainly proposed a method called **Realation Network** (RN) to recognise new classes given only few examples from each.  
> 1. It based on **meta-learning**. That is to say, the RN learns a `deep distance metric` to compare a number of images with episodes, and it is a `episode-based` method.  
> 2. It classify images of new classes by computing **relation scores**. That is to say, there is a score in each `query` image with their relations of `sample` images in each class.  

## Problem Description
![RN_PD.png](https://i.loli.net/2019/08/24/FkOWoMGP7dmp2T4.png) 
> It shows the task of **few-shot learning** and the **exists model**.

## Problem Solution
![RN_PS.png](https://i.loli.net/2019/08/24/96ju1zHtcdQxVaA.png)  
> It includes **Embedding** module and **Relation** module of the RN.  

References: [36, 39], RNNs: [39, 32, 29], Fine-tuning: [29, 10].

## Conceptual Understanding
![RN_CU.png](https://i.loli.net/2019/08/24/2kxu5Hjbh9fJdyc.png)  
> It describes what is **meta-learning** and how to **classify** query images. 

## Remaining Problem
![RN_RP.png](https://i.loli.net/2019/08/24/rQ2CDGwYA6cus8M.png)  
> It is the **question** in my mind in terms of the paper and the code.  

## Core Conception
![RN_CC.png](https://i.loli.net/2019/08/24/q1TDicJkyjeQUaL.png)  
> It denotes the `most important` conception of **Relation Network** (RN) and explains the **Embedding** module and **Relation** module respectively.  

Besides, the **network architecture** shows below.
![RN_RN.png](https://i.loli.net/2019/08/24/ERIMHV2C4T9XqzZ.png)  
![RN_NA.png](https://i.loli.net/2019/08/24/QsDW4IrZcgEvAUL.png)

## Experimental Results
![RN_Omniglot.png](https://i.loli.net/2019/08/24/Q5Wa2UtLKBgNueZ.png)  
![RN_miniImagenet.png](https://i.loli.net/2019/08/24/xevhjHSwaf3Dbd7.png)  
> There are results of carring RN on **Omniglot** and **miniImagenet** datasets in paper, which shows that RN got better performance when comparing with other state-of-the-art methods.

# Code
---
## Program block
![RN_PB.png](https://i.loli.net/2019/08/25/zc8sGRqvEoiI61J.png) 
> It divides program files to three blocks, which are **pre-process**, **train** and **test** as well as the **function** list of the blocks.    

## Program explanation
![RN_PE.png](https://i.loli.net/2019/08/25/pIaAiQFvR5BT8SZ.png)  
> It explains the details of the **code** blocks in each process.  

## Program improvement
![RN_PI.png](https://i.loli.net/2019/08/25/BdbMWplwnDFQjZY.png)  
> Main work in my improved code are tackling **problems** and **optimizing** functions as well as train and test my personnal **datasets**.  

# References
---
> [1] Sung F, Yang Y, Zhang L, et al. Learning to compare: Relation network for few-shot learning[C]//Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition. 2018: 1199-1208.  
> [2] LearningToCompare_FSL. https://github.com/floodsung/LearningToCompare_FSL.  
> [3] Pytorch. https://github.com/pytorch/pytorch.  

# Note
---
![RN_note.png](https://i.loli.net/2019/08/25/f71tFaJ6oyYwAHe.png)  
