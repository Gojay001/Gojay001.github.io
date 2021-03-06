---
title: ResNet
thumbnail: /gallery/thumbnails/ResNet.png
date: 2019-09-08 12:45:35
categories:
    - DeepLearning
    - Classification
    - ResNet
tags: [DL, Classification, ResNet]
---

> **ResNet**[[1]](http://openaccess.thecvf.com/content_cvpr_2016/papers/He_Deep_Residual_Learning_CVPR_2016_paper.pdf) is used to classify images with deep residual learning. There are some details of reading and implementing it.
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
> **Paper**: [[Deep Residual Learning for Image Recognition](http://openaccess.thecvf.com/content_cvpr_2016/papers/He_Deep_Residual_Learning_CVPR_2016_paper.pdf)(CVPR 2016 paper)  
> **Code**: [PyTorch](https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Classification/ResNet/Code)  
> **Note**: [ResNet](https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Classification/ResNet/Note)

# Paper
---
## Abstract
![ResNet_Abstract.png](https://i.loli.net/2020/02/03/W6Ot498efiFGwRP.png)
As `abstract` of the paper, their work mainly present a residual learning framework named **ResNet**, which based on the residual **building block** for classification and detection.  
> 1. It reformulate the layers as `learning residual functions` with reference to the layer inputs.  
> 2. Residual networks are easier to `optimize`, and can gain `accuracy` from considerably increased depth.  

## Problem Description
![ResNet_PD.png](https://i.loli.net/2020/02/03/CRHZhpAyPid8Mju.png) 
> Driven by the significance of depth, a question arises: Is learning better networks as easy as stacking more layers? 

![ResNet_Errors.png](https://i.loli.net/2020/02/03/Kp7oy3PSfJrYI6k.png)
> It shows `higher error` with `deeper network`.

## Problem Solution
![ResNet_PS.png](https://i.loli.net/2020/02/03/TnPYl9WzCZJKHIG.png)
![ResNet_Residual.png](https://i.loli.net/2020/02/03/pOEIhJM4FS1A3sT.png)  
> 1. Intuitively, the residual learning needs `less to learn`, because the residual is generally smaller. Therefore, the learning difficulty is smaller.  
> 2. Mathematically speaking, the gradients will not be vanished due to the `shortcut connection`, that is why residual is easier to learn.

## Conceptual Understanding
![ResNet_CU.png](https://i.loli.net/2020/02/03/8JrsHxhlRZBCMtq.png)
![ResNet_BuildingBlock.png](https://i.loli.net/2020/02/03/81rBlvAth5nw3GP.png) 
> 1. It presents two version of **building block** for ResNet, including `BasicBlock` and `Bottleneck`.    
> 2. It describes the choise about different dimensions, as to input and output with `same dimensions` or `dimensions increase`.  
> 3. It shows the function of `1x1` and `3x3` convolution layers works.  

## Core Concept
![ResNet_Network.png](https://i.loli.net/2020/02/03/IqQ7JZr5uBLktFD.png) 
![ResNet_Design.png](https://i.loli.net/2020/06/18/hzUBHQwcVE7RM2l.png)
![ResNet_RN.png](https://i.loli.net/2020/06/18/mXtacPyw31of9Ts.png)

## Experiments
![ResNet_ImageNet.png](https://i.loli.net/2020/02/03/ZaPFoCcN7xeOgip.png)
![ResNet_Experiments.png](https://i.loli.net/2020/02/03/yKv4EIaN6Spk2TM.png)
> It includes image classification datasets ImageNet, CIFAR-10, and objection detection datasets PASCAL VOC, COCO.  

# Code
---
> The **complete code** can be found in [ResNet][[2]](https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Classification/ResNet/Code).  

## Details of implementation
![ResNet_Architectures.png](https://i.loli.net/2020/02/03/aQcSEiLFmr96Vg2.png)

## Convolution layer
```python
def conv3x3(in_planes, out_planes, stride=1, groups=1, dilation=1):
    """3x3 convolution with padding"""
    return nn.Conv2d(in_planes, out_planes, kernel_size=3, stride=stride,
                     padding=dilation, groups=groups, bias=False, dilation=dilation)


def conv1x1(in_planes, out_planes, stride=1):
    """1x1 convolution"""
    return nn.Conv2d(in_planes, out_planes, kernel_size=1, stride=stride, bias=False)
```

## Building block
```python
class BasicBlock(nn.Module):
    expansion = 1

    def __init__(self, inplanes, planes, stride=1, downsample=None, groups=1,
                 base_width=64, dilation=1, norm_layer=None):
        super(BasicBlock, self).__init__()
        if norm_layer is None:
            norm_layer = nn.BatchNorm2d
        if groups != 1 or base_width != 64:
            raise ValueError(
                'BasicBlock only supports groups=1 and base_width=64')
        if dilation > 1:
            raise NotImplementedError(
                "Dilation > 1 not supported in BasicBlock")
        # Both self.conv1 and self.downsample layers downsample the input when stride != 1
        self.conv1 = conv3x3(inplanes, planes, stride)
        self.bn1 = norm_layer(planes)
        self.relu = nn.ReLU(inplace=True)
        self.conv2 = conv3x3(planes, planes)
        self.bn2 = norm_layer(planes)
        self.downsample = downsample
        self.stride = stride

    def forward(self, x):
        identity = x

        out = self.conv1(x)
        out = self.bn1(out)
        out = self.relu(out)

        out = self.conv2(out)
        out = self.bn2(out)

        if self.downsample is not None:
            identity = self.downsample(x)

        out += identity
        out = self.relu(out)

        return out
```

```python
class Bottleneck(nn.Module):
    expansion = 4

    def __init__(self, inplanes, planes, stride=1, downsample=None, groups=1,
                 base_width=64, dilation=1, norm_layer=None):
        super(Bottleneck, self).__init__()
        if norm_layer is None:
            norm_layer = nn.BatchNorm2d
        width = int(planes * (base_width / 64.)) * groups
        # Both self.conv2 and self.downsample layers downsample the input when stride != 1
        self.conv1 = conv1x1(inplanes, width)
        self.bn1 = norm_layer(width)
        self.conv2 = conv3x3(width, width, stride, groups, dilation)
        self.bn2 = norm_layer(width)
        self.conv3 = conv1x1(width, planes * self.expansion)
        self.bn3 = norm_layer(planes * self.expansion)
        self.relu = nn.ReLU(inplace=True)
        self.downsample = downsample
        self.stride = stride

    def forward(self, x):
        identity = x

        out = self.conv1(x)
        out = self.bn1(out)
        out = self.relu(out)

        out = self.conv2(out)
        out = self.bn2(out)
        out = self.relu(out)

        out = self.conv3(out)
        out = self.bn3(out)

        if self.downsample is not None:
            identity = self.downsample(x)

        out += identity
        out = self.relu(out)

        return out
```

## ResNet
```python
class ResNet(nn.Module):

    def __init__(self, block, layers, num_classes=1000, zero_init_residual=False,
                 groups=1, width_per_group=64, replace_stride_with_dilation=None,
                 norm_layer=None):
        super(ResNet, self).__init__()
        if norm_layer is None:
            norm_layer = nn.BatchNorm2d
        self._norm_layer = norm_layer

        self.inplanes = 64
        self.dilation = 1
        if replace_stride_with_dilation is None:
            # each element in the tuple indicates if we should replace
            # the 2x2 stride with a dilated convolution instead
            replace_stride_with_dilation = [False, False, False]
        if len(replace_stride_with_dilation) != 3:
            raise ValueError("replace_stride_with_dilation should be None "
                             "or a 3-element tuple, got {}".format(replace_stride_with_dilation))
        self.groups = groups
        self.base_width = width_per_group
        self.conv1 = nn.Conv2d(3, self.inplanes, kernel_size=7, stride=2, padding=3,
                               bias=False)
        self.bn1 = norm_layer(self.inplanes)
        self.relu = nn.ReLU(inplace=True)
        self.maxpool = nn.MaxPool2d(kernel_size=3, stride=2, padding=1)
        self.layer1 = self._make_layer(block, 64, layers[0])
        self.layer2 = self._make_layer(block, 128, layers[1], stride=2,
                                       dilate=replace_stride_with_dilation[0])
        self.layer3 = self._make_layer(block, 256, layers[2], stride=2,
                                       dilate=replace_stride_with_dilation[1])
        self.layer4 = self._make_layer(block, 512, layers[3], stride=2,
                                       dilate=replace_stride_with_dilation[2])
        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))
        self.fc = nn.Linear(512 * block.expansion, num_classes)

        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                nn.init.kaiming_normal_(
                    m.weight, mode='fan_out', nonlinearity='relu')
            elif isinstance(m, (nn.BatchNorm2d, nn.GroupNorm)):
                nn.init.constant_(m.weight, 1)
                nn.init.constant_(m.bias, 0)

        # Zero-initialize the last BN in each residual branch,
        # so that the residual branch starts with zeros, and each residual block behaves like an identity.
        # This improves the model by 0.2~0.3% according to https://arxiv.org/abs/1706.02677
        if zero_init_residual:
            for m in self.modules():
                if isinstance(m, Bottleneck):
                    nn.init.constant_(m.bn3.weight, 0)
                elif isinstance(m, BasicBlock):
                    nn.init.constant_(m.bn2.weight, 0)

    def _make_layer(self, block, planes, blocks, stride=1, dilate=False):
        norm_layer = self._norm_layer
        downsample = None
        previous_dilation = self.dilation
        if dilate:
            self.dilation *= stride
            stride = 1
        if stride != 1 or self.inplanes != planes * block.expansion:
            downsample = nn.Sequential(
                conv1x1(self.inplanes, planes * block.expansion, stride),
                norm_layer(planes * block.expansion),
            )

        layers = []
        layers.append(block(self.inplanes, planes, stride, downsample, self.groups,
                            self.base_width, previous_dilation, norm_layer))
        self.inplanes = planes * block.expansion
        for _ in range(1, blocks):
            layers.append(block(self.inplanes, planes, groups=self.groups,
                                base_width=self.base_width, dilation=self.dilation,
                                norm_layer=norm_layer))

        return nn.Sequential(*layers)

    def forward(self, x):
        x = self.conv1(x)
        x = self.bn1(x)
        x = self.relu(x)
        x = self.maxpool(x)

        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)

        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.fc(x)

        return x
```

## Pretrain
```python
def _resnet(arch, block, layers, pretrained, progress, **kwargs):
    model = ResNet(block, layers, **kwargs)
    if pretrained:
        state_dict = load_state_dict_from_url(model_urls[arch],
                                              progress=progress)
        model.load_state_dict(state_dict)
    return model
```

## Different layer
```python
def resnet18(pretrained=False, progress=True, **kwargs):
    return _resnet('resnet18', BasicBlock, [2, 2, 2, 2], pretrained, progress,
                   **kwargs)


def resnet34(pretrained=False, progress=True, **kwargs):
    return _resnet('resnet34', BasicBlock, [3, 4, 6, 3], pretrained, progress,
                   **kwargs)


def resnet50(pretrained=False, progress=True, **kwargs):
    return _resnet('resnet50', Bottleneck, [3, 4, 6, 3], pretrained, progress,
                   **kwargs)


def resnet101(pretrained=False, progress=True, **kwargs):
    return _resnet('resnet101', Bottleneck, [3, 4, 23, 3], pretrained, progress, **kwargs)


def resnet152(pretrained=False, progress=True, **kwargs):
    return _resnet('resnet152', Bottleneck, [3, 8, 36, 3], pretrained, progress, **kwargs)

```

# Note
---
> More details about code implementation can be found in [[3]](https://blog.csdn.net/darkeyers/article/details/90475475), [[4]](https://zhuanlan.zhihu.com/p/31852747).

# References
---
> [1] He, Kaiming, et al. "Deep residual learning for image recognition." Proceedings of the IEEE conference on computer vision and pattern recognition. 2016.  
> [2] ResNet. https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Classification/ResNet/Code  
> [3] Darkeyers. ResNet implementaion by Pytorch official. https://blog.csdn.net/darkeyers/article/details/90475475
> [4] Little teenager. CNN model you have to know: ResNet. https://zhuanlan.zhihu.com/p/31852747