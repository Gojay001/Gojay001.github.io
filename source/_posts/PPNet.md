---
title: PPNet
thumbnail: /gallery/thumbnails/PPNet.png
date: 2020-12-02 16:16:39
categories:
    - DeepLearning  
    - Few-Shot Segmentation  
    - PPNet
tags: [DL, FSS, PPNet]
---

> **PPNet**(Part-aware Prototype Network for Few-shot Semantic Segmentation)[[1]](https://arxiv.org/abs/2007.06309) decompose the holistic class representation into a set of `part-aware prototypes`, and leverage `unlabeled data` to better modeling of intra-class variations. Besides, `graph neural network` model is used to generate and enhance the proposed part-aware prototypes. There are some details of reading and implementing it. 
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
> **Paper**: [Part-aware Prototype Network for Few-shot Semantic Segmentation](https://arxiv.org/abs/2007.06309)  
> **Code**: [PyTorch](https://github.com/Xiangyi1996/PPNet-PyTorch)  
> **Note**: [Mendeley](https://www.mendeley.com/reference-manager/reader/9123fee1-109e-3aef-8816-c59509dc2fea/44c73f8f-3a4a-c30d-4cc7-a6cb371a9a5c)

# Paper
---
## Abstract
![PPNet_Abstract.png](https://i.loli.net/2020/12/03/LlRdmhB9fO5ixSv.png)

## Problem Description
![PPNet_PD.png](https://i.loli.net/2020/12/03/criLvj1P69WxJND.png)

## Problem Solution
![PPNet_PS.png](https://i.loli.net/2020/12/03/wbMBmctDkJAKURq.png)

## Conceptual Understanding
![PPNet_network.png](https://i.loli.net/2020/12/03/Ilz6AomqT9jphQD.png)

## Core Conception
![PPNet_Module.png](https://i.loli.net/2020/12/03/9ySo3GXKEUcRI1e.png)
## Part Generation
![PPNet_RartG.png](https://i.loli.net/2020/12/03/aqxTEOy6l3QIgRp.png)
## Part Refinement
![PPNet_PartR.png](https://i.loli.net/2020/12/03/QIXiajGkKLmAD9q.png)
## Mask Generation
![PPNet_MaskG.png](https://i.loli.net/2020/12/03/z6sh4aSMTF3rLNd.png)

## Experiments
![PPNet_results.png](https://i.loli.net/2020/12/03/96taPl38cOeokUS.png)
![PPNet_visualization.png](https://i.loli.net/2020/12/03/pGLQhnP43DRKlBE.png)

# Code
---
> 1. The **complete code** can be found in PPNet-PyTorch[[2]](https://github.com/Xiangyi1996/PPNet-PyTorch).

[Updating]

# Note
---
- decomposed objects to a set of part based on prototype for few-shot segmentation.

# References
---
> [1] Liu Y, Zhang X, Zhang S, et al. Part-aware prototype network for few-shot semantic segmentation[C]//European Conference on Computer Vision. Springer, Cham, 2020: 142-158.  
> [2] PPNet-PyTorch. https://github.com/Xiangyi1996/PPNet-PyTorch.