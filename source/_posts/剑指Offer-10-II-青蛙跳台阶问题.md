---
title: 剑指Offer-10-II.青蛙跳台阶问题
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-08-29 15:23:39
categories:
    - Algorithm  
    - 剑指Offer  
    - 10
tags: [Algorithm, Offer, 动态规划]
---

# 题目
---
## 题目描述
一只青蛙一次可以跳上1级台阶，也可以跳上2级台阶。求该青蛙跳上一个 `n` 级的台阶总共有多少种跳法。   

答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。
<!-- more -->

## 示例1
> **输入**：n = 2  
> **输出**：2

## 示例2
> **输入**：n = 7  
> **输出**：21

## 示例3
> **输入**：n = 0  
> **输出**：1

# 题解
---
## 动态规划
> 可以跳1级和2级，则最终n级台阶可有 `两种跳法` 到达，即从 `n-1` 和 `n-2` 级台阶跳上来。  

- **状态定义**：dp为一维数组，dp[i]为第i个台阶时的跳法种数。  
- **转移方程**：dp[i] = dp[i-1] + dp[i-2]。  
- **初始状态**：dp[0] = 1, dp[1] = 1。

> **时间复杂度**：O(n)，循环n次，每次O(1)。  
> **空间复杂度**：O(n)，dp[n]占用O(n)。

```python
class Solution:
    def numWays(self, n: int) -> int:
        if n <= 1:
            return 1
        dp = []
        dp.append(1)
        dp.append(1)
        for i in range(2, n+1):
            dp_tmp = (dp[i-1] + dp[i-2]) % 1000000007
            dp.append(dp_tmp)
        return dp[n]
```

## 动态规划（空间优化）
> 利用 `辅助变量使a, b` 交替前进，节省了dp[]列表空间。  
> **时间复杂度**：O(n)，循环n次，每次O(1)。  
> **空间复杂度**：O(1)，变量占用O(1)。

```python
class Solution:
    def numWays(self, n: int) -> int:
        a, b = 1, 1
        for _ in range(n):
            a, b = b, a + b
        return a % 1000000007
```

