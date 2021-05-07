---
title: 剑指Offer-46-把数字翻译成字符串
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-12-15 10:23:21
categories:
    - Algorithm  
    - 剑指Offer  
    - 46
tags: [Algorithm, Offer, 动态规划]
---

# 题目
---
## 题目描述
给定一个数字，我们按照如下规则把它翻译为字符串：0 翻译成 “a” ，1 翻译成 “b”，……，11 翻译成 “l”，……，25 翻译成 “z”。一个数字可能有多个翻译。请编程实现一个函数，用来计算一个数字有多少种不同的翻译方法。
<!-- more -->

## 示例1
> **输入**: 12258  
> **输出**: 5  
> **解释**: 12258有5种不同的翻译，分别是"bccfi", "bwfi", "bczi", "mcfi"和"mzi"

# 题解
---
## 动态规划
> 遍历字符串，判断当前字符与上一字符是否能够组合成字母。  

> **时间复杂度**: O(n)，遍历字符串;  
> **空间复杂度**: O(n)，字符串数组占用O(n)额外空间，dp数组占用O(n)额外空间;

```python
class Solution:
    def translateNum(self, num: int) -> int:
        strs = str(num)
        dp = []
        dp.append(1)
        dp.append(2 if strs[:2] >= '10' and strs[:2] <= '25' else 1)
        for i in range(2, len(strs)):
            if strs[i-1:i+1] >= '10' and strs[i-1:i+1] <= '25':
                cur = dp[i-1] + dp[i-2]
            else:
                cur = dp[i-1]
            dp.append(cur)
        return dp[-1]
```

- **原地dp**:
```python
class Solution:
    def translateNum(self, num: int) -> int:
        strs = str(num)
        a = b = 1
        for i in range(1, len(strs)):
            a, b = (a + b) if '10' <= strs[i-1:i+1] <= '25' else a, a
        return a
```

## 动态规划（空间优化）
> 字符串数组占用O(n)额外空间，因为从左到右计算和从右到左计算为对称操作，即可通过 **求余操作得到当前数字和前一数字**，而不需要先转换为字符串。  

> **时间复杂度**: O(n)，遍历字符串;  
> **空间复杂度**: O(1)，变量占用常数大小的额外空间;

```python
class Solution:
    def translateNum(self, num: int) -> int:
        a = b = 1
        y = num % 10
        while num != 0:
            num //= 10
            x = num % 10
            a, b = (a + b) if 10 <= 10*x+y <= 25 else a, a
            y = x
        return a
```