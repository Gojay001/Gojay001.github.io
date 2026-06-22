---
title: Stable Diffusion / LDM
date: '2026-06-22 09:50:36'
categories:
  - AIGC
  - Diffusion Model
tags:
  - DL
  - AIGC
  - DM
link: /paper-reading/sd.html
paper_reading: true
excerpt: 以前的扩散模型（如 DDPM）直接在「像素世界」里反复擦噪点画图——一张 512×512 的图有 78 万个像素，每一步去噪都要在这么大的画布上算一遍，训练动辄几百张 GPU 卡跑上几周。本文（潜在扩散 LDM，也就是后来的 Stable Diffusion）的核心招数是：先把图压缩到一个小很多的「缩略草稿世界」里再画。
thumbnail: /paper-reading/assets/sd/fig3.jpg
thumbnail_fit: contain
---

[阅读完整精读页面 →](/paper-reading/sd.html)
