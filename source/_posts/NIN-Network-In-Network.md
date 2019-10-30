---
title: NIN(Network In Network)
thumbnail: /gallery/thumbnails/NIN.png
date: 2019-08-31 17:42:39
categories:
    - DeepLearning
    - Classification
    - NIN
tags: [DL, Classification, NIN]
---

> There are some details of reading and implementing the **Network In Network** for image classification.
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
> **Paper**: [Network In Network](https://arxiv.org/pdf/1312.4400.pdf)(arXiv 2013 paper)  
> **Code**: [PyTorch](https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Classification/NIN/Code)  
> **Note**: [NIN](https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Classification/NIN/Note)

# Paper
---
## Abstract
![NIN_Abstract.png](https://i.loli.net/2019/08/31/TahN9BAIMoEcbQm.png)
As `abstract` of the paper, their work mainly build a "micro network" called **Network In Network** (NIN) to replace traditional Convolutional Nerual Network(CNNs) and utilize **global average pooling** (GAP) instead of fully-connected layer(FC) to classify images.  
> 1. build `micro neural networks` with more complex structures to abstract the data within the receptive field.  
> 2. utilize `global average pooling` over feature maps in the classification layer, which is easier to interpret and less prone to overfitting than traditional fully connected layers.  

## Problem Description
![NIN_PD.png](https://i.loli.net/2019/08/31/uBxZzFv6HVGILJs.png)
> It shows the **steps** of classifing images as well as describes the traditional and state-of-the-art **methods**.  

## Problem Solution
![NIN_PS.png](https://i.loli.net/2019/08/31/LKDNC5P2RIQAvUt.png)
> It includes MLP (**multilayer perceotrn**) layer and GAP (**global average pooling**).  

## Conceptual Understanding
![NIN_CU.png](https://i.loli.net/2019/08/31/yKJ7Yl9X1kfxNEt.png)
> It describes how does **mlpconv** works and what does **GAP** means.  

## Core Conception
![NIN_CC.png](https://i.loli.net/2019/08/31/Lp8EucQwfoAOr2q.png)
> It denotes the `most important` conception of **Network In Network** (NIN) and explains the steps of traditional **CNNs** and novel **NIN** to classify images respectively.  

Besides, the **comparison** shows below.
![NIN_Comparison.png](https://i.loli.net/2019/08/31/JnUoASWKOIEc5db.png)

## Experimental Results
**datasets**:  
- CIFAR-10
- CIFAR-100
- SVHN
- MNIST

> `notes`:  
> 1. fine-tuned local receptive field **size** and **weight** decay.  
> 2. using **dropout**.

# Code
---
## Model Detail
![NIN_NA.png](https://i.loli.net/2019/09/01/oR9xLV8Jr7EC6lc.png)
```
NIN(
  (features1): Sequential(
    (0): Conv2d(3, 192, kernel_size=(5, 5), stride=(1, 1), padding=(2, 2))
    (1): ReLU()
    (2): Conv2d(192, 160, kernel_size=(1, 1), stride=(1, 1))
    (3): ReLU()
    (4): Conv2d(160, 96, kernel_size=(1, 1), stride=(1, 1))
    (5): ReLU()
    (6): MaxPool2d(kernel_size=3, stride=2, padding=1, dilation=1, ceil_mode=False)
    (7): Dropout(p=0.5, inplace=False)
  )
  (features2): Sequential(
    (0): Conv2d(96, 192, kernel_size=(5, 5), stride=(1, 1), padding=(2, 2))
    (1): ReLU()
    (2): Conv2d(192, 192, kernel_size=(1, 1), stride=(1, 1))
    (3): ReLU()
    (4): Conv2d(192, 192, kernel_size=(1, 1), stride=(1, 1))
    (5): ReLU()
    (6): MaxPool2d(kernel_size=3, stride=2, padding=1, dilation=1, ceil_mode=False)
    (7): Dropout(p=0.5, inplace=False)
  )
  (features3): Sequential(
    (0): Conv2d(192, 192, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1))
    (1): ReLU()
    (2): Conv2d(192, 192, kernel_size=(1, 1), stride=(1, 1))
    (3): ReLU()
    (4): Conv2d(192, 10, kernel_size=(1, 1), stride=(1, 1))
    (5): ReLU()
  )
  (gap): AvgPool2d(kernel_size=8, stride=1, padding=0)
)
```

## PyTorch Implementation
> The **complete code** can be found in [here](https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Classification/NIN/Code).  
> The implementation of **network** as follows.  

```py
class NIN(nn.Module):

    def __init__(self, in_channels=3, out_channels=10):
        super(NIN, self).__init__()

        self.features1 = nn.Sequential(
            nn.Conv2d(in_channels, 192, kernel_size=5, stride=1, padding=2),
            nn.ReLU(),
            nn.Conv2d(192, 160, kernel_size=1, stride=1, padding=0),
            nn.ReLU(),
            nn.Conv2d(160, 96, kernel_size=1, stride=1, padding=0),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=3, stride=2, padding=1),
            nn.Dropout(0.5)
        )
        self.features2 = nn.Sequential(
            nn.Conv2d(96, 192, kernel_size=5, stride=1, padding=2),
            nn.ReLU(),
            nn.Conv2d(192, 192, kernel_size=1, stride=1, padding=0),
            nn.ReLU(),
            nn.Conv2d(192, 192, kernel_size=1, stride=1, padding=0),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=3, stride=2, padding=1),
            nn.Dropout(0.5)
        )
        self.features3 = nn.Sequential(
            nn.Conv2d(192, 192, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.Conv2d(192, 192, kernel_size=1, stride=1, padding=0),
            nn.ReLU(),
            nn.Conv2d(192, out_channels, kernel_size=1, stride=1, padding=0),
            nn.ReLU(),
        )

        self.gap = nn.AvgPool2d(kernel_size=8, stride=1, padding=0)

    def forward(self, x):
        x = self.features1(x)
        x = self.features2(x)
        x = self.features3(x)
        x = self.gap(x)
        x = x.view(x.size(0), -1)

        return x
```

## TensorFlow Implementation
> the code and more details can be found in [[2]](https://embedai.wordpress.com/2017/07/23/network-in-network-implementation-using-tensorflow/).

# Note
---
> More details of **mlpconv** and **cccp** can be found in [[3]](https://blog.csdn.net/mounty_fsc/article/details/51746111).  
> What the effect of **1 by 1 convolution kernel** can be found in [[4]](http://www.caffecn.cn/?/question/136).  

# References
---
> [1] Min Lin, Qiang Chen, and Shuicheng Yan. "Network in network." arXiv preprint arXiv:1312.4400 (2013).  
> [2] Eugene. "NETWORK-IN-NETWORK IMPLEMENTATION USING TENSORFLOW." https://embedai.wordpress.com/2017/07/23/network-in-network-implementation-using-tensorflow/  
> [3] Ou. "(Paper) Network Analysis of Network In Network."  https://blog.csdn.net/mounty_fsc/article/details/51746111  
> [4] ysu. "What is the role of 1 by 1 convolution kernel?" http://www.caffecn.cn/?/question/136  