---
title: DDPO — Training Diffusion Models with Reinforcement Learning
date: '2026-11-06 09:18:10'
categories:
  - AIGC
  - Diffusion RL
tags:
  - DL
  - AIGC
  - DR
link: /paper-reading/ddpo.html
paper_reading: true
excerpt: 扩散模型是用「对数似然的近似」训出来的，但我们真正想要的往往不是似然，而是「图好不好看」「文件能不能压小」这类下游指标。这些指标没法写进 prompt，也没法用监督学习直接训。DDPO 的做法是：把 50 步去噪过程当成 50 步决策——每一步的「状态」是（prompt、当前时间步、当前噪声图），「动作」是这一步输出的更干净的图，「策略」就是去噪网络本身。因为采样器固定、每步加的高斯噪声方差已知，每一步的条件似然是可以精确算出来的，于是可以直接套用策略梯度（REINFORCE / PPO）：采样一批轨迹 → 给最终图打一个奖励分 → 把奖励乘到「每步 log 概率的梯度」上，好图加分、差图减分…
thumbnail: /paper-reading/assets/ddpo/fig1-teaser.jpg
thumbnail_fit: contain
---

[阅读完整精读页面 →](/paper-reading/ddpo.html)
