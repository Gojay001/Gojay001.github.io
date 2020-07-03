---
title: PV-RCNN
thumbnail: /gallery/thumbnails/PV-RCNN.png
date: 2020-06-23 18:43:53
categories:
    - DeepLearning
    - 3D Object Dedection
    - PV-RCNN
tags: [DL, Detection-3D, PV-RCNN]
---

> **PV-RCNN**[[1]](http://openaccess.thecvf.com/content_CVPR_2020/papers/Shi_PV-RCNN_Point-Voxel_Feature_Set_Abstraction_for_3D_Object_Detection_CVPR_2020_paper.pdf) is a **3D Object Detection** framework to integrate `3D voxel CNN` and `PointNet-based set abstraction` to learn more discriminative point cloud features. The most contributions in this papar is  **two-stage strategy** including the `voxel-to-keypoint` 3D scene encoding and the `keypoint-to-grid` RoI feature abstraction. There are some details of reading and implementing it. 
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
> **Paper**: [PV-RCNN: Point-Voxel Feature Set Abstraction for 3D Object Detection](http://openaccess.thecvf.com/content_CVPR_2020/papers/Shi_PV-RCNN_Point-Voxel_Feature_Set_Abstraction_for_3D_Object_Detection_CVPR_2020_paper.pdf)(CVPR 2020 paper)  
> **Code**: [PyTorch](https://github.com/sshaoshuai/PV-RCNN)  
> **Note**: [Mendeley](https://www.mendeley.com/viewer/?fileId=27532eab-6324-9637-0ff2-686fb058a2c4&documentId=3e0406f7-8d48-3933-a9dd-55aa2f55a808)

# Paper
---
## Abstract
![PV-RCNN_Abstract.png](https://i.loli.net/2020/06/23/BEe5DYuwqiZc61C.png)
> 1. They present PointVoxel-RCNN(**PV-RCNN**) for accurate 3D object detection from point clouds.  
> 2. It summarizes the 3D scene with a **3D voxel CNN** into a small set of `keypoints` via a novel **voxel set abstraction**(VSA) module.  
> 3. **RoI-grid pooling** is proposed to abstract proposal-specific features from the keypoints to the RoI-`grid points`, the RoI-grid feature points encode much richer context information.  
> 4. It surpasses **state-of-the-art** 3D detection.

## Problem Description
![PV-RCNN_PD.png](https://i.loli.net/2020/06/23/heG8Q6FBamEtwiU.png)
> 1. The `grid-based methods` generally transform the irregular point clouds to regular representations such as 3D voxels, they are **more computationally efficient**.  
> 2. The `point-based methods` directly extract discriminative features from raw point clouds for 3D detection, they could achieve **larger receptive field**.  

## Problem Solution
![PV-RCNN_PS.png](https://i.loli.net/2020/06/23/8FvWG5xBNH9hpYe.png)
> 1. They **integrated** these two types. The `voxel-based operation` efficiently encodes **multi-scale feature** representations, `PointNet-based set abstraction operation` preserves **accurate location information** with flexible receptive field.  
> 2. The voxel CNN with `3D sparse convolution` is adopted for **voxel-wise feature** learning and **accurate proposal** generation.  
> 3. A small set of `keypoints` are selected by the furtherest point sampling (**FPS**) to **summarize the overall 3D information** from the voxel-wise features.  
> 4. `PointNet-based set abstraction` for summarizing **multi-scale** point cloud information.  

## Conceptual Understanding
![PV-RCNN_framework.png](https://i.loli.net/2020/06/23/l2r9zKOSiCLd4ue.png)
![PV-RCNN_overall.png](https://i.loli.net/2020/06/23/hwrMFAQfmxVJyba.png)
> 1. **3D Sparse Convolution**: Input the `raw point clouds` to learn `multi-scale semantic features` and generate `3D object proposals`.  
> 2. **Voxel Set Abstraction**: the learned `voxel-wise feature` volumes at multiple neural layers are summarized into a small set of `key points`.  
> 3. **RoI-grid Pooling**: the `keypoint` features are aggregated to the RoI-`grid points`.  

## Core Conception
### Predicted Keypoint Weighting
![PV-RCNN_PKW.png](https://i.loli.net/2020/06/23/fHRlJBraFbs4eN7.png)
### RoI-grid Pooling
![PV-RCNN_RoI-grid.png](https://i.loli.net/2020/06/23/5EaycV76sG9TxwR.png)

## Experiments
![PV-RCNN_KITTI.png](https://i.loli.net/2020/06/23/kJ7PbGZzawoWLAR.png)
![PV-RCNN_val.png](https://i.loli.net/2020/06/23/9UJAYQT6ezLKjFR.png)
![PV-RCNN_WaymoOpen.png](https://i.loli.net/2020/06/23/fmj27FpLaIohAUP.png)

# Code
---
> 1. The **complete code** can be found in PV-RCNN[[2]](https://github.com/sshaoshuai/PV-RCNN).  
> 2. Another implementation can be found in vision3d[[3]](https://github.com/jhultman/vision3d).  
 
[Updating]

# Note
---
> 1. Provide more `accurate detections` by point cloud features.
> 2. Integrate it to `multiple object tracking` framework.

# References
---
> [1] Shi S, Guo C, Jiang L, et al. Pv-rcnn: Point-voxel feature set abstraction for 3d object detection[C]//Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition. 2020: 10529-10538.  
> [2] PV-RCNN. https://github.com/sshaoshuai/PV-RCNN  
> [3] vision3d. https://github.com/jhultman/vision3d
