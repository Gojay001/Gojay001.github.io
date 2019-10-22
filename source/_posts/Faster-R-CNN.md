---
title: Faster R-CNN  
thumbnail: /gallery/thumbnails/Faster R-CNN.png  
date: 2019-10-19 23:47:35
categories:
    - DeepLearning  
    - Object Detection  
    - Faster R-CNN  
tags: [DL, Detection, Faster R-CNN]
---

> **Faster R-CNN**[[1]](https://arxiv.org/pdf/1506.01497.pdf) is used to detect objects in images, with outputing bounding box and class scores. There are some details of reading and implementing it.  
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
> **Paper**: [Faster R-CNN: Towards Real-Time Object Detection with Region Proposal Networks](https://arxiv.org/pdf/1506.01497.pdf)(NIPS 2015 paper)  
> **Code**: [PyTorch](https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Detection/Faster%20R-CNN/Code/README.md)  
> **Note**: [Faster R-CNN](https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Detection/Faster%20R-CNN/Note)

# Paper
---
## Abstract
![Faster-RCNN_Abstract.png](https://i.loli.net/2019/10/22/FHvUPsjBV4IMxl9.png)  
As `abstract` of the paper, their work mainly proposed a method called **Faster R-CNN**, which introduced a Region Proposal Network (RPN) and further merge RPN and Fast R-CNN to detect objects.  
> 1. It introduced a **RPN**. An RPN is a fully convolutional network that simultaneously predicts object `bounds` and objectness `scores` at each position. Besides, RPN using the recently popular terminology of neural networks with `“attention” mechanisms` to generate proposals.  
> 2. It **merged RPN** and Fast R-CNN into a single network. The unified network detects objects by `sharing their convolutional features` enabling nearly `cost-free` region proposals.

## Problem Description
![Faster-RCNN_PD.png](https://i.loli.net/2019/10/22/toubNvlhg57fPnQ.png) 
> It shows the **purpose** of Faster R-CNN and **exsiting methods** about solving this problem.

## Problem Solution
![Faster-RCNN_PS.png](https://i.loli.net/2019/10/22/lmHGjeqgKiDESCd.png)  
> It intrudued a network called **RPN**, including `how it works` and `what it roles`.  

## Conceptual Understanding
![Faster-RCNN_CU.png](https://i.loli.net/2019/10/22/wZkmTdo6t4jClxi.png)  
> It describes the whole **architecture** of Faster R-CNN, including `how it works` and what `ouputs` in each mudules. 

## Core Conception
![Faster-RCNN_CC.png](https://i.loli.net/2019/10/22/NidM78RsBGCXqWF.png)  
> It denotes the `most important` conception of Faster R-CNN mudules, and it explains the **Conv layers** (conv + relu + pooling), **RPN** (feature maps -> proposals), **RoI pooling** (feature maps + proposals -> proposal feature maps), **Classification** (proposal feature maps -> bbox + cls) respectively.  

Besides, the **network architecture** shows below.
![Faster-RCNN_NA.png](https://i.loli.net/2019/10/22/BeWR2YPCEa3c5rz.png)  
![Faster-RCNN_Net.jpg](https://i.loli.net/2019/10/22/f6do2RgYuCnyzNA.jpg)

## Details of implementation
![Faster-RCNN_Doi.png](https://i.loli.net/2019/10/22/R4xMUNBY896iSWX.png)   
### RPN
> 1. **anchors**: it seleted k(3*3) anchor boxes with outputing 2k scores and 4k coordinates.  
> 2. **classication + regression**: it takes RPN outputs as inputs, generating positive anchors and bbox regression.  
> 3. **proposal layers**: it contains pre_nms_topN, ignore cross-boundary, NMS, topN to generate proposals.  
### Experiments
> 1. **loss function**: it considers classification loss and regression loss as loss function.  
> 2. **training**: it choosed `alternating training`, that is to say, RPN -> Fast R-CNN -> RPN2 -> unifiled network(RPN + Fast R-CNN).  

# Code
---
> The **complete code** can be found in [here](https://github.com/Gojay001/faster-rcnn.pytorch) with citing faster-rcnn.pytorch[[2]](https://github.com/jwyang/faster-rcnn.pytorch).  

## Datasets
> default datasets include **PASCAL_VOC** and **COCO** files. As my own data, it should transform to VOC or COCO format files.  
> The details of data format as follows.  

```
`PASCAL_VOC`:
|- VOCdevkit2007
    |- VOC2007
        |- Annotations
            |- .xml
        |- ImageSets
            |- Main
                |- trainval.txt
                |- test.txt
        |- JPEGImages
            |- .jpg
|- VOCdevkit2012
    |- VOC2012
        |- ...
```

## Program improvement
> 1. Modified files to be compatible with my own **machine**.  
> 2. Changed custom **datasets** and classes to train.  

# Note
---
> More details of **Faster R-CNN conception** about anchors, loss and etc. can be found in [[3]](https://zhuanlan.zhihu.com/p/31426458).  

# References
---
> [1] Ren, Shaoqing, et al. "Faster r-cnn: Towards real-time object detection with region proposal networks." Advances in neural information processing systems. 2015.  
> [2] faster-rcnn.pytorch. https://github.com/jwyang/faster-rcnn.pytorch  
> [3] Shang Bai. "A paer understanding Faster R-CNN." https://zhuanlan.zhihu.com/p/31426458.  
