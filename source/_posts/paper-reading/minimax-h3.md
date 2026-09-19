---
title: MiniMax-H3 — A General-Purpose Omni-Modal Video Generation Model
date: '2026-09-19 16:52:39'
categories:
  - AIGC
  - Video Generation
tags:
  - DL
  - AIGC
  - VG
link: /paper-reading/minimax-h3.html
paper_reading: true
excerpt: 把 MiniMax-H3 想象成一个「全能导演」：你随手丢给它文字、几张图、几段参考视频和几段音频，它先派一个「编剧助理」（H3-Context-IR）把这堆杂乱素材读懂、理顺时序与关系，写成一份结构化的分镜脚本（Context 中间表示）；然后「导演本体」（H3-Base，330 亿参数的单流 Transformer）照着脚本一次性把画面和立体声一起拍出来——注意是画面和声音联合生成，而不是先出画面再配音；最后如果你要更高清，它不另请「放大专家」，而是把 768p 成片连同原始素材塞回自己脑子里重画一遍成 2K（H3-Regenerate-2K）。
thumbnail: /paper-reading/assets/minimax-h3/fig1.png
thumbnail_fit: contain
---

[阅读完整精读页面 →](/paper-reading/minimax-h3.html)
