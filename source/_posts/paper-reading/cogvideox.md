---
title: CogVideoX — Text-to-Video Diffusion Models with An Expert Transformer
date: '2026-06-23 14:30:00'
categories:
  - AIGC
  - Video Generation
tags:
  - DL
  - AIGC
  - VG
link: /paper-reading/cogvideox.html
paper_reading: true
excerpt: 文生视频 = 扩散 + DiT，但旧模型动作小、时长短、叙事难连贯。CogVideoX 四件套：3D 因果 VAE（时空 8×8×4 压缩，减 flicker）+ Expert Transformer（文本/视频 Expert AdaLN + 3D full attention 替代 2D+1D 分离注意力）+ Multi-Resolution Frame Pack（混时长/分辨率 batch 训练）+ 密集 caption 流水线（Panda70M → CogVLM 帧 caption → GPT-4 汇总 → CogVLM2-Caption）。产出 768×1360、16fps、10 秒视…
thumbnail: /paper-reading/assets/cogvideox/fig2.png
thumbnail_fit: contain
---

[阅读完整精读页面 →](/paper-reading/cogvideox.html)
