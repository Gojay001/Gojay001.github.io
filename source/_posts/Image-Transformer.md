---
title: Image Transformer
thumbnail: /gallery/thumbnails/ImageTransformer.png
date: 2020-05-15 16:15:09
categories:
    - DeepLearning
    - Image Generation
    - ImageTransformer
tags: [DL, Attention]
---

> **Image Transformer**[[1]](https://arxiv.org/abs/1802.05751) is a sequence modeling formulation of image generation generalized by `Transformer`, which restricting the **self-attention mechanism** to attend to local neighborhoods, while maintaining `large receptive field`. There are some details of reading and implementing it. 
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
> **Paper**: [Image Transformer](https://arxiv.org/abs/1802.05751)(2018 arXiv paper)  
> **Code**: [Code]  
> **Note**: [Mendeley](https://www.mendeley.com/viewer/?fileId=33fbf9ab-c19c-f9e1-01a8-eb0c466a248c&documentId=29df54a6-2fd3-3d8a-8172-398e996de1f5)

# Paper
---
## Abstract
![ImageTrans_Abstract.png](https://i.loli.net/2020/05/15/aolzun27SwJmFGZ.png)
> 1. **Image generation** has been successfully cast as an autoregressive sequence generation or transformation problem.  
> 2. In this work, they generalize the `Transformer` to a sequence modeling formulation of image generation.  
> 3. By restricting the **self-attention** mechanism to attend to local neighborhoods while maintaining `large receptive field`.  
> 4. outperform the current **state of the art** in image generation and super-resolution.

## Problem Description
![ImageTrans_PD.png](https://i.loli.net/2020/05/15/Z2ok45xiMILATOD.png)
> 1. Training **RNNs**(recurrent neural networks) to sequentially predict each pixel of even a small image is `computationally` very challenging. Thus, `parallelizable` models that use **CNNs**(convolutional neural networks) such as the PixelCNN have recently received much more attention, and have now surpassed the PixelRNN in quality.  
> 2. One disadvantage of **CNNs** compared to RNNs is their typically fairly `limited receptive field`. This can adversely affect their ability to model long-range phenomena common in images, such as symmetry and occlusion, especially with a small number of layers.  

## Problem Solution
![ImageTrans_PS.png](https://i.loli.net/2020/05/15/XdJgzIWvAaT2cQr.png)
> 1. **self-attention** can achieve a better `balance in the trade-off` between the virtually unlimited receptive field of the necessarily sequential `PixelRNN` and the limited receptive field of the much more parallelizable `PixelCNN` and its various extensions.
We.
> 2. Image Transformer which is a model based entirely on a self-attention mechanism allows us to use significantly **larger receptive fields** than the PixelCNN.  
> 3. **Increasing the size** of the receptive field plays a significant role in experiments improvement.  

## Conceptual Understanding
### Self-Attention
![ImageTrans_SelfAttention.png](https://i.loli.net/2020/05/15/PxnZoR4Q3dawgTJ.png)
> 1. Each self-attention layer computes a `d-dimensional representation` for each position.  
> 2. it first compares the position’s current representation to other positions' representations, obtaining an `attention distribution` over the other positions.  
> 3. This distribution is then used to `weight the contribution` of the other positions' representations to the next representation for the position. 

### Local Self-Attention
![ImageTrans_LocalAttention.png](https://i.loli.net/2020/05/15/BKF6Dw1yWQLzhIH.png)
> 1. Inspired by CNNs, they address this by adopting a notion of **locality**, restricting the positions in the `memory matrix M` to a local neighborhood around the query position.  
> 2. They partition the image into **query blocks** and associate each of these with a larger `memory block`.  
> 3. The model attends to the **same memory matrix**, the self-attention is then computed for all query blocks in parallel.  

## Core Conception
![ImageTrans_details.png](https://i.loli.net/2020/05/15/u2wic7FlBJG31LQ.png)
> 1. **Recomputing** the representation $q'$ of a single channel of one pixel $q$ by attending to a memory of previously generated pixels $m_1,m_2,...$.  
> 2. After performing **local self-attention** we apply a two-layer position- wise **feed-forward neural network** with the `same parameters` for all positions in a given layer.  
> 3. Self-attention and the feed-forward networks are followed by `dropout` and bypassed by a `residual connection` with subsequent `layer normalization`.

## Experiments
![ImageTrans_Experiments.png](https://i.loli.net/2020/05/15/6a3DBNMGqXIJ2bt.png)
![ImageTrans_results.png](https://i.loli.net/2020/05/15/szybrG49R6w7Cd3.png)
![ImageTrans_Comparison.png](https://i.loli.net/2020/05/15/cYl3pPF2v4AbW8B.png)

# Code
---
[Updating]

# Note
---
![ImageTrans_future1.png](https://i.loli.net/2020/05/15/5RjOb8AcJiDPhYr.png)
![ImageTrans_future2.png](https://i.loli.net/2020/05/15/i2a3zUuM7bFNjBx.png)
> 1. We further hope to have provided additional evidence that even in the light of **GANs**(generative adversarial networks), **likelihood-based** models of images is very much a promising area for further research.  
> 2. We would like to explore a broader variety of **conditioning information** including free-form text, and tasks combining modalities such as language-driven editing of images.  
> 3. Fundamentally, we aim to move beyond still images **to video** and towards applications in model-based `reinforcement learning`.

# References
---
[1] Parmar, Niki, et al. "Image transformer." arXiv preprint arXiv:1802.05751 (2018).
