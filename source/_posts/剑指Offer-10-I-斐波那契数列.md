---
title: 剑指Offer-10-I.斐波那契数列
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-08-27 15:01:45
categories:
    - Algorithm  
    - 剑指Offer  
    - 10
tags: [Algorithm, Offer, 递归, 动态规划]
---

# 题目
---
## 题目描述
写一个函数，输入 `n` ，求斐波那契（Fibonacci）数列的第 `n` 项。斐波那契数列的定义如下：  
> F(0) = 0,   F(1) = 1  
> F(N) = F(N - 1) + F(N - 2), 其中 N > 1.  

**斐波那契数列**由 0 和 1 开始，之后的斐波那契数就是由之前的两数相加而得出。  
答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。
<!-- more -->

## 示例1
> **输入**：n = 2  
> **输出**：1

## 示例2
> **输入**：n = 5  
> **输出**：5

# 题解
---
## 递归
> 把f(n) `拆解` 为f(n-1)和f(n-2)递归计算，以f(1)和f(0)为终止条件。  
> 大量重复递归计算，会直接超时。  
> **时间复杂度**：O($2^n$)  
> **空间复杂度**：O(n)

```python
class Solution:
    def fib(self, n: int) -> int:
        if n <= 0:
            return n
        return self.fib(n-1) + self.fib(n-2)
```

## 动态规划
- **状态定义**：dp为一维数组，dp[i]为斐波那契数列的第i个值。  
- **转移方程**：dp[i] = dp[i-1] + dp[i-2]。  
- **初始状态**：dp[0] = 0, dp[1] = 1。

> **时间复杂度**：O(n)，循环n次，每次O(1)。  
> **空间复杂度**：O(n)，dp[n]占用O(n)。

```python
class Solution:
    def fib(self, n: int) -> int:
        if n <= 0:
            return n
        dp = []
        dp.append(0)
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
    def fib(self, n: int) -> int:
        a, b = 0, 1
        for _ in range(n):
            a, b = b, a + b
        return a % 1000000007
```

