---
title: VideoDPO — Omni-Preference Alignment for Video Diffusion Generation
date: '2026-11-06 09:18:10'
categories:
  - AIGC
  - Diffusion RL
tags:
  - DL
  - AIGC
  - DR
link: /paper-reading/videodpo.html
paper_reading: true
excerpt: 把视频生成模型当成学生：给同一道题（提示词），让它用不同随机种子交四份答案（视频）。自动阅卷系统 OmniScore 同时看画面质量、帧间运动与文本匹配，选出最高分和最低分的视频。训练时不再重新生成整段视频，而是给保存的视频 latent 加噪，让可训练模型和冻结的参考模型分别预测噪声，用“赢家与输家的去噪误差差，相对于参考模型改善了多少”构建偏好损失。
thumbnail: /paper-reading/assets/videodpo/fig1-teaser.jpg
thumbnail_fit: contain
---

[阅读完整精读页面 →](/paper-reading/videodpo.html)
