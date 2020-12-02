---
title: 剑指Offer-42-连续子数组的最大和
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-11-18 16:08:24
categories:
    - Algorithm  
    - 剑指Offer  
    - 42
tags: [Algorithm, Offer, 动态规划]
---

# 题目
---
## 题目描述

输入一个整型数组，数组中的一个或连续多个整数组成一个子数组。求所有子数组的和的最大值。

要求时间复杂度为O(n)。
<!-- more -->

## 示例1
> **输入**: nums = [-2,1,-3,4,-1,2,1,-5,4]  
> **输出**: 6  
> **解释**: 连续子数组 [4,-1,2,1] 的和最大，为 6。

# 题解
---
## 动态规划
- 依次遍历数组，根据前一索引dp，保存当前索引的子数组最大和。

> **时间复杂度**: O(n)，遍历整个数组;  
> **空间复杂度**: O(n)，保存dp数组;

```python
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        dp = []
        dp.append(nums[0])
        for i in range(1, len(nums)):
            max_num = nums[i] + max(dp[i-1], 0)
            dp.append(max_num)
        return max(dp)
```

## 原地优化（动态规划）
- 将原地nums数组元素更改为当前索引的子数组最大和。

> **时间复杂度**: O(n)，遍历整个数组;  
> **空间复杂度**: O(1)，原地更改数组，不占用额外空间;

```python
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        for i in range(1, len(nums)):
            nums[i] += max(nums[i-1], 0)
        return max(nums)
```