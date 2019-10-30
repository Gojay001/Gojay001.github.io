---
title: GoogLeNet
thumbnail: /gallery/thumbnails/GoogLeNet.png
date: 2019-09-05 15:01:37
categories:
    - DeepLearning
    - Classification
    - GoogLeNet
tags: [DL, Classification, GoogLeNet, Inception]
---

> **GoogLeNet**[[1]](https://www.cv-foundation.org/openaccess/content_cvpr_2015/papers/Szegedy_Going_Deeper_With_2015_CVPR_paper.pdf) is used to classify images with inception v1. There are some details of reading and implementing it.  
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
> **Paper**: [Going deeper with convolutions](https://www.cv-foundation.org/openaccess/content_cvpr_2015/papers/Szegedy_Going_Deeper_With_2015_CVPR_paper.pdf)(CVPR 2015 paper)  
> **Code**: [PyTorch](https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Classification/GoogLeNet/Code)  
> **Note**: [GoogLeNet](https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Classification/GoogLeNet/Note)

# Paper
---
## Abstract
![googlenet_Abstract.png](https://i.loli.net/2019/10/29/ztR8rPIYdhQajLb.png)
As `abstract` of the paper, their work mainly proposed a CNN architecture codenamed **Inception**, so that to build a inception-based network with 22 layers called **GoogLeNet** for classification and detection.  
> 1. bulid **Inception** architecture based on the `Hebbian principle` and the intuition of `multi-scale` processing.  
> 2. It increased the depth and width of the network while keeping the **computational budget constant**.  

## Problem Description
![googlenet_PD.png](https://i.loli.net/2019/10/29/3fer8KJgdqv79oH.png) 
> It shows the **purpose** of GoogLenet and the **drawbacks** of exsiting methods about solving this problem.

## Problem Solution
![googlenet_PS.png](https://i.loli.net/2019/10/29/p4gKhc2B7RtkAUX.png)  
> It proposal a network architecture named **Inception**, including `what it can do` and `how it works`.  

## Conceptual Understanding
![googlenet_CU.png](https://i.loli.net/2019/10/29/gqm8RnSbXYweZ1o.png)  
> It describes two version of **architecture** of Inception, including `naive version` and `inception_v1`.  

## Core Conception
![googlenet_CC.png](https://i.loli.net/2019/10/29/Q7uRCnAoJ6vam9M.png)  
> It denotes the `most important` conception of Inception mudules, and it explains convolution on **multiple scales** to extract features, and using **spare matrix** to accelerate convergence speed with a `instance`.  

Besides, the **network architecture** shows below.
![googlenet_network.jpg](https://i.loli.net/2019/10/30/RPK2nCyZqXFz5ix.jpg) 
![googlenet_incarnation.png](https://i.loli.net/2019/10/30/sCOkLz8ovmjT56U.png)

# Code
> The **complete code** can be found in [here](https://github.com/Gojay001/DeepLearning-pwcn/tree/master/Classification/GoogLeNet/Code).  

## Details of implementation
the whole network architecture:
![googlenet_Doi.png](https://i.loli.net/2019/10/29/j5CPhTV9IdWztus.png)  
the details of googlenet:
![googlenet_details.jpg](https://i.loli.net/2019/10/29/kyvzUOxl2XduY9Q.jpg)
the step of implementation:
![googlenet_code.png](https://i.loli.net/2019/10/29/owpufOnQLmaE8V6.png)  
> It includes the whole network **architeture** and the implementation of **auxiliary classfier**.  

## Inception
```python
class BasicConv2d(nn.Module):

    def __init__(self, in_channels, out_channels, **kwargs):
        super(BasicConv2d, self).__init__()
        self.conv = nn.Conv2d(in_channels, out_channels, bias=False, **kwargs)
        self.bn = nn.BatchNorm2d(out_channels, eps=0.001)

    def forward(self, x):
        x = self.conv(x)
        x = self.bn(x)
        return F.relu(x, inplace=True)
```

```python
class Inception(nn.Module):

    def __init__(self, in_channels, ch1x1, ch3x3red, ch3x3, ch5x5red, ch5x5, pool_proj):
        super(Inception, self).__init__()

        self.branch1 = BasicConv2d(in_channels, ch1x1, kernel_size=1)

        self.branch2 = nn.Sequential(
            BasicConv2d(in_channels, ch3x3red, kernel_size=1),
            BasicConv2d(ch3x3red, ch3x3, kernel_size=3, padding=1)
        )

        self.branch3 = nn.Sequential(
            BasicConv2d(in_channels, ch5x5red, kernel_size=1),
            BasicConv2d(ch5x5red, ch5x5, kernel_size=3, padding=1)
        )

        self.branch4 = nn.Sequential(
            nn.MaxPool2d(kernel_size=3, stride=1, padding=1, ceil_mode=True),
            BasicConv2d(in_channels, pool_proj, kernel_size=1)
        )

    def forward(self, x):
        branch1 = self.branch1(x)
        branch2 = self.branch2(x)
        branch3 = self.branch3(x)
        branch4 = self.branch4(x)

        outputs = [branch1, branch2, branch3, branch4]
        return torch.cat(outputs, 1)
```

## Auxiliary classifer
```python
class InceptionAux(nn.Module):

    def __init__(self, in_channels, num_classes):
        super(InceptionAux, self).__init__()
        self.conv = BasicConv2d(in_channels, 128, kernel_size=1)

        self.fc1 = nn.Linear(2048, 1024)
        self.fc2 = nn.Linear(1024, num_classes)

    def forward(self, x):
        # aux1: N x 512 x 14 x 14, aux2: N x 528 x 14 x 14
        x = F.adaptive_avg_pool2d(x, (4, 4))
        # aux1: N x 512 x 4 x 4, aux2: N x 528 x 4 x 4
        x = self.conv(x)
        # N x 128 x 4 x 4
        x = torch.flatten(x, 1)
        # N x 2048
        x = F.relu(self.fc1(x), inplace=True)
        # N x 2048
        x = F.dropout(x, 0.7, training=self.training)
        # N x 2048
        x = self.fc2(x)
        # N x 1024

        return x

```

## GoogLeNet
```python
class GoogLeNet(nn.Module):

    def __init__(self, num_classes=1000, aux_logits=True, transform_input=False, init_weights=True):
        super(GoogLeNet, self).__init__()
        self.aux_logits = aux_logits
        self.transform_input = transform_input

        self.conv1 = BasicConv2d(3, 64, kernel_size=7, stride=2, padding=3)
        self.maxpool1 = nn.MaxPool2d(3, stride=2, ceil_mode=True)
        self.conv2 = BasicConv2d(64, 64, kernel_size=1)
        self.conv3 = BasicConv2d(64, 192, kernel_size=3, padding=1)
        self.maxpool2 = nn.MaxPool2d(3, stride=2, ceil_mode=True)

        self.inception3a = Inception(192, 64, 96, 128, 16, 32, 32)
        self.inception3b = Inception(256, 128, 128, 192, 32, 96, 64)
        self.maxpool3 = nn.MaxPool2d(3, stride=2, ceil_mode=True)

        self.inception4a = Inception(480, 192, 96, 208, 16, 48, 64)
        self.inception4b = Inception(512, 160, 112, 224, 24, 64, 64)
        self.inception4c = Inception(512, 128, 128, 256, 24, 64, 64)
        self.inception4d = Inception(512, 112, 144, 288, 32, 64, 64)
        self.inception4e = Inception(528, 256, 160, 320, 32, 128, 128)
        self.maxpool4 = nn.MaxPool2d(2, stride=2, ceil_mode=True)

        self.inception5a = Inception(832, 256, 160, 320, 32, 128, 128)
        self.inception5b = Inception(832, 384, 192, 384, 48, 128, 128)

        if aux_logits:
            self.aux1 = InceptionAux(512, num_classes)
            self.aux2 = InceptionAux(528, num_classes)

        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))
        self.dropout = nn.Dropout(0.2)
        self.fc = nn.Linear(1024, num_classes)

        if init_weights:
            self._initialize_weights()

    def _initialize_weights(self):
        for m in self.modules():
            if isinstance(m, nn.Conv2d) or isinstance(m, nn.Linear):
                import scipy.stats as stats
                X = stats.truncnorm(-2, 2, scale=0.01)
                values = torch.as_tensor(
                    X.rvs(m.weight.numel()), dtype=m.weight.dtype)
                values = values.view(m.weight.size())
                with torch.no_grad():
                    m.weight.copy_(values)
            elif isinstance(m, nn.BatchNorm2d):
                nn.init.constant_(m.weight, 1)
                nn.init.constant_(m.bias, 0)

    def forward(self, x):
        if self.transform_input:
            x_ch0 = torch.unsqueeze(x[:, 0], 1) * \
                (0.229 / 0.5) + (0.485 - 0.5) / 0.5
            x_ch1 = torch.unsqueeze(x[:, 1], 1) * \
                (0.224 / 0.5) + (0.456 - 0.5) / 0.5
            x_ch2 = torch.unsqueeze(x[:, 2], 1) * \
                (0.225 / 0.5) + (0.406 - 0.5) / 0.5
            x = torch.cat((x_ch0, x_ch1, x_ch2), 1)

        # N x 3 x 224 x 224
        x = self.conv1(x)
        # N x 64 x 112 x 112
        x = self.maxpool1(x)
        # N x 64 x 56 x 56
        x = self.conv2(x)
        # N x 64 x 56 x 56
        x = self.conv3(x)
        # N x 192 x 56 x 56
        x = self.maxpool2(x)

        # N x 192 x 28 x 28
        x = self.inception3a(x)
        # N x 256 x 28 x 28
        x = self.inception3b(x)
        # N x 480 x 28 x 28
        x = self.maxpool3(x)
        # N x 480 x 14 x 14
        x = self.inception4a(x)
        # N x 512 x 14 x 14
        if self.training and self.aux_logits:
            aux1 = self.aux1(x)

        x = self.inception4b(x)
        # N x 512 x 14 x 14
        x = self.inception4c(x)
        # N x 512 x 14 x 14
        x = self.inception4d(x)
        # N x 528 x 14 x 14
        if self.training and self.aux_logits:
            aux2 = self.aux2(x)

        x = self.inception4e(x)
        # N x 832 x 14 x 14
        x = self.maxpool4(x)
        # N x 832 x 7 x 7
        x = self.inception5a(x)
        # N x 832 x 7 x 7
        x = self.inception5b(x)
        # N x 1024 x 7 x 7

        x = self.avgpool(x)
        # N x 1024 x 1 x 1
        x = torch.flatten(x, 1)
        # N x 1024
        x = self.dropout(x)
        x = self.fc(x)
        # N x 1000 (num_classes)
        if self.training and self.aux_logits:
            return _GoogLeNetOutputs(x, aux2, aux1)
        return x
```

# Note
---
> More details of **Inception** about implementation can be found in [[2]](https://my.oschina.net/u/876354/blog/1637819).  
> More details of conception about **multi-scale** and **spare matrix** can be found in [[3]](https://zhuanlan.zhihu.com/p/32702031).  

# References
---
> [1] Szegedy, Christian, et al. "Going deeper with convolutions." Proceedings of the IEEE conference on computer vision and pattern recognition. 2015.  
> [2] Bing Xue. "Big word about CNN classic model." https://my.oschina.net/u/876354/blog/1637819.  
> [3] Lei Zhang. "Deep understanding GoogLeNet architecture." https://zhuanlan.zhihu.com/p/32702031.  