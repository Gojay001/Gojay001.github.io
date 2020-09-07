---
title: 剑指Offer-14-剪绳子
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-09-04 15:40:16
categories:
    - Algorithm  
    - 剑指Offer  
    - 14
tags: [Algorithm, Offer, 动态规划, 贪心]
---

# 题目
---
## 题目描述I
给你一根长度为 `n` 的绳子，请把绳子剪成整数长度的 `m` 段（m、n都是整数，n>1并且m>1），每段绳子的长度记为 `k[0],k[1]...k[m-1]` 。请问 `k[0]*k[1]*...*k[m-1]` 可能的 **最大乘积是多少** ？例如，当绳子的长度是8时，我们把它剪成长度分别为2、3、3的三段，此时得到的最大乘积是18。
<!-- more -->

## 示例1
> **输入**：2  
> **输出**：1  
> **解释**：2 = 1 + 1, 1 × 1 = 1

## 示例2
> **输入**：10  
> **输出**：36  
> **解释**：10 = 3 + 3 + 4, 3 × 3 × 4 = 36

# 题解
---
## 动态规划
> 一段 `长度为i` 的绳子，可剪在长度为j的位置，则绳子切分为长度为 `j` 和 `i-j` 两端。

- **状态定义**：dp为一维数组，dp[i]为长度为i的绳子的 `最大乘积值`。
- **转移方程**：`dp[i] = max(dp[i], dp[j] * dp[i-j])`。其中，根据是否切分得到最大值，即 `dp[j]=max(j,dp[j])`, `dp[i-j]=max(i-j,dp[i-j])`。
- **初始状态**：`dp[1] = 1`。

> **时间复杂度**：O($n^2$)，计算每个长度的最大值需计算n次，每次计算需切分n/2次；  
> **空间复杂度**：O(n)，一维数组dp记录每个长度的最大乘积值。

```python
class Solution:
    def cuttingRope(self, n: int) -> int:
        if n <= 3:
            return n - 1
        dp = [1] * (n+1)
        for i in range(2, n+1):
            for j in range(1, i//2 + 1):
                dp[i] = max(dp[i], max(j, dp[j]) * max(i-j, dp[i-j]))
        return dp[-1]
```

## 贪心算法
> 将绳子 `尽可能切为多个长度为3` 的片段，转化为处理最后一段绳子长度。

（[引用Krahets](https://leetcode-cn.com/problems/jian-sheng-zi-lcof/solution/mian-shi-ti-14-i-jian-sheng-zi-tan-xin-si-xiang-by/)）
> **推论一**：将绳子 `以相等的长度等分为多段`，得到的乘积最大。可由算术几何均值不等式推出。  
> **推论二**：尽可能将绳子 `以长度3等分为多段` 时，乘积最大。可求导求极值推出。

- **最后一段绳子长度为0**：刚好全部绳子按3等分，直接返回 $3^{n/3}$ ；
- **最后一段绳子长度为1**：$3 * 1 < 2 * 2$, 故取出将最后一段绳子长度为1和一段长度为3的片段组合为2+2，即返回 $3^{n/3-1} * 2 * 2$；
- **最后一段绳子长度为2**：最后剩一段绳子长度为2，故返回 $3^{n/3} * 2$。

> **时间复杂度**：O(1)，仅有求整、求余、次方运算；  
> **空间复杂度**：O(1)，仅使用辅助变量占用常数大小空间。

```python
class Solution:
    def cuttingRope(self, n: int) -> int:
        if n <= 3:
            return n - 1
        a, b = n // 3, n % 3
        if b == 0:
            return int(math.pow(3, a))
        elif b == 1:
            return int(math.pow(3, a-1) * 4)
        else:
            return int(math.pow(3, a) * 2)
```
> Python中常见有三种幂计算函数： `**` 和 `pow()` 的时间复杂度均为 `O(logn)`；而 `math.pow()` 始终调用 **C库的pow()函数**，其执行浮点取幂，时间复杂度为 `O(1)`。

## 题目描述II
答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。
> 即本题考虑 **“大数越界情况下的求余问题”**。

> **时间复杂度**：O(logn)，`**运算`；  
> **空间复杂度**：O(1)，仅使用辅助变量占用常数大小空间。
```python
class Solution:
    def cuttingRope(self, n: int) -> int:
        if n <= 3:
            return n - 1
        a, b, p = n // 3, n % 3, 1000000007
        if b == 0:
            return 3 ** a % p
        if b == 1:
            return 3 ** (a-1) * 4 % p
        return 3 ** a * 2 % p
```
> 由于Python语言特性，理论上变量取值范围由系统内存大小决定（`无限大`），因此不用考虑大数越界问题。