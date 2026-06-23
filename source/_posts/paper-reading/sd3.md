---
title: SD 3 — Scaling Rectified Flow Transformers
date: '2026-06-23 08:59:08'
categories:
  - AIGC
  - Diffusion Model
tags:
  - DL
  - AIGC
  - DM
link: /paper-reading/sd3.html
paper_reading: true
excerpt: SD 1.x/2.x 像沿着弯弯曲曲的河道把噪声「擦」成图——DDPM/VP 调度路径长，少步采样容易糊。Rectified Flow（整流流）则走直线：$z_t=(1-t)x_0+t\epsilon$，数据与噪声之间一根绳，理论上一步就能走完（实际仍需多步积分，但比弯曲扩散更省步）。本文（SD3）的第一招是：在大规模文生图里证明「直线流 + 聪明的时间步采样」能打赢传统 LDM-linear / EDM 扩散配方。
thumbnail: /paper-reading/assets/sd3/fig1.jpg
thumbnail_fit: contain
---

[阅读完整精读页面 →](/paper-reading/sd3.html)
