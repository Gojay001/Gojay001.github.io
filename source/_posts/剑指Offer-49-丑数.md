---
title: 剑指Offer-49-丑数
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-12-15 15:49:51
categories:
    - Algorithm  
    - 剑指Offer  
    - 49
tags: [Algorithm, Offer, 动态规划]
---

# 题目
---
## 题目描述
我们把只包含质因子 2、3 和 5 的数称作丑数（Ugly Number）。求按从小到大的顺序的第 n 个丑数。
<!-- more -->

## 示例1
> **输入**: n = 10  
> **输出**: 12  
> **解释**: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12 是前 10 个丑数。

# 题解
---
## 动态规划
> 计算当前各质数的丑数，**选取最小丑数作为当前值**，并将对应质数的位数加1。  

- dp数组存储第i个位置的丑数;  
- a,b,c分别对应2,3,5前进次数;
- n2,n3,n5对应2,3,5对应的当前丑数;

> **时间复杂度**: O(n)，遍历dp数组;  
> **空间复杂度**: O(n)，dp数组占用O(n)的额外空间;

```python
class Solution:
    def nthUglyNumber(self, n: int) -> int:
        dp, a, b, c = [1] * n, 0, 0, 0
        for i in range(1, n):
            n2, n3, n5 = dp[a] * 2, dp[b] * 3, dp[c] * 5
            dp[i] = min(n2, n3, n5)
            if dp[i] == n2:
                a += 1
            if dp[i] == n3:
                b += 1
            if dp[i] == n5:
                c += 1
        return dp[-1]
```