---
title: OSLSM
thumbnail: /gallery/thumbnails/OSLSM.png
date: 2020-10-19 20:53:47
categories:
    - DeepLearning  
    - Few-Shot Segmentation  
    - OSLSM
tags: [DL, FSS, OSLSM]
---

> **OSLSM**(One-Shot Learning for Semantic Segmentation)[[1]](https://arxiv.org/abs/1709.03410) **firstly proposed two-branch approach** to one-shot semantic segmentation. **Conditioning branch** trains a network `to get parameter` $\theta$, and **Segmentaion branch** `outputs the final mask` based on parameter $\theta$. There are some details of reading and implementing it. 
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
> **Paper**: [One-Shot Learning for Semantic Segmentation](https://arxiv.org/abs/1709.03410)(BMVC 2017 paper)  
> **Code**: [Caffe](https://github.com/lzzcd001/OSLSM)  
> **Note**: [Mendeley](https://www.mendeley.com/reference-manager/reader/749c31e5-39de-3a41-85cf-c9c50faff3b0/74624f4d-d2bb-41e9-59ce-5d602eab798c)

# Paper
---
## Abstract
![OSLSM_Abstract.png](https://i.loli.net/2020/10/19/YdNBiGEOaIc3emn.png)
> 1. They extend `low-shot methods` to support `semantic segmentation`.  
> 2. They train a network that `produces parameters` for a FCN.  
> 3. They use this FCN to perform dense `pixel-level prediction` on a test image for the `new semantic class`.  
> 4. It outperforms the **state-of-the-art** method on the `PASCAL VOC 2012` dataset.

## Problem Description
> A simple approach to performing one-shot semantic image segmentation is to **fine-tune a pre-trained segmentation network** on the labeled image.  

- This approach `is prone to over-fitting` due to the millions of parameters being updated.
- The fine tuning approach to one-shot learning, which `may require many iterations of SGD` to learn parameters for the segmentation network.
- Besides, thousands of dense features are computed from a single image and one-shot methods `do not scale well to this many features`.

## Problem Solution
![OSLSM_Overview.png](https://i.loli.net/2020/10/19/2fzyOjEUgQnlxsG.png)
![OSLSM_PS.png](https://i.loli.net/2020/10/19/btKPGopAfQh9md5.png)

## Conceptual Understanding
![OSLSM_Architecture.png](https://i.loli.net/2020/10/19/DpyJmOuRVBrGYAT.png)

## Core Conception
![OSLSM_weight-hashing.png](https://i.loli.net/2020/10/19/ZNTHXWqpkPCwgGt.png)

## Experiments
![OSLSM_MIoU.png](https://i.loli.net/2020/10/19/hcIT4QkDXmWLVYg.png)
![OSLSM_QR.png](https://i.loli.net/2020/10/19/N5niD31s2Ma6XBo.png)

# Code
---
[Updating]

# Note
---
- It takes inspiration from few-shot learning and **firstly proposes a novel two-branched approach to one-shot semantic segmentation**.

# References
---
> [1] Shaban A, Bansal S, Liu Z, et al. One-shot learning for semantic segmentation[J]. arXiv preprint arXiv:1709.03410, 2017.  
> [2] OSLSM. https://github.com/lzzcd001/OSLSM.
