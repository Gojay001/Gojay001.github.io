---
title: ChordEdit — One-Step Low-Energy Transport for Image Editing
date: '2026-06-24 06:44:29'
categories:
  - AIGC
  - Diffusion Model
tags:
  - DL
  - AIGC
  - DM
link: /paper-reading/chordedit.html
paper_reading: true
excerpt: 一步文生图模型（如 SD-Turbo、SwiftBrush-v2、InstaFlow）把原本需要几十步的扩散蒸馏成一次前向就能出图——合成速度极快，自然让人期待「实时编辑」。但把传统编辑套路（源/目标 prompt 的 drift 差分）硬塞进一步模型会彻底翻车：物体严重扭曲、背景碎裂——因为 naive 编辑场是两个大幅度、发散轨迹的算术差，能量高、方差大，单步大积分误差累积致命。
thumbnail: /paper-reading/assets/chordedit/fig1.jpg
thumbnail_fit: contain
---

[阅读完整精读页面 →](/paper-reading/chordedit.html)
