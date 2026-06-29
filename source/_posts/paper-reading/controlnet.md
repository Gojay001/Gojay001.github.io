---
title: ControlNet — Adding Conditional Control to Text-to-Image Diffusion Models
date: '2026-06-29 03:43:36'
categories:
  - AIGC
  - Diffusion Model
tags:
  - DL
  - AIGC
  - DM
link: /paper-reading/controlnet.html
paper_reading: true
excerpt: 大扩散模型（如 Stable Diffusion）只会听文字，难精确控构图、姿态、边缘。ControlNet = 锁住原 U-Net 权重 + 复制可训练支路，用 zero-init 1×1 卷积渐进注入条件，不破坏预训练能力。可训 Canny / depth / pose / seg 等；小数据集也稳；「sudden convergence」现象——几百步后 loss 突然下降、条件控制突然学会。
thumbnail: /paper-reading/assets/controlnet/fig2.png
thumbnail_fit: contain
---

[阅读完整精读页面 →](/paper-reading/controlnet.html)
