---
title: PixArt-α — Fast Training DiT for T2I
date: '2026-06-30 10:00:00'
categories:
  - AIGC
  - Diffusion Model
tags:
  - DL
  - AIGC
  - DM
link: /paper-reading/pixart-alpha.html
paper_reading: true
excerpt: 文生图（T2I）训练极贵——Stable Diffusion 1.5 级别模型常需数百万 GPU 时。PixArt-α 的核心思路是「分阶段解耦」：不要一上来就 1024px + 文本 + 美学一起学，而是拆成三步——先学像素依赖（低分辨率、无文本），再学文图对齐，最后学美学与高分辨率。每一步只解决一个子问题，训练更稳、更省。
thumbnail: /paper-reading/assets/pixart-alpha/fig2.png
thumbnail_fit: contain
---

[阅读完整精读页面 →](/paper-reading/pixart-alpha.html)
