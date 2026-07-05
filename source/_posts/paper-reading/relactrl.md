---
title: RelaCtrl — Relevance-Guided Efficient Control for Diffusion Transformers
date: '2026-07-01 12:10:57'
categories:
  - AIGC
  - Diffusion Model
tags:
  - DL
  - AIGC
  - DM
link: /paper-reading/relactrl.html
paper_reading: true
excerpt: 给 DiT 加「可控生成」（Canny、Depth、Seg 等）时，主流做法很「笨重」：PixArt-δ 直接复制前 13 个 DiT block 做 ControlNet，参数和 FLOPs 各涨约 50%；OminiControl 把控制 token 拼进序列，token 数翻倍，FLOPs 涨约 70%。更关键的是——它们假设每一层对控制信号同等重要，均匀堆控制模块，造成大量冗余。
thumbnail: /paper-reading/assets/relactrl/fig2.png
thumbnail_fit: contain
---

[阅读完整精读页面 →](/paper-reading/relactrl.html)
