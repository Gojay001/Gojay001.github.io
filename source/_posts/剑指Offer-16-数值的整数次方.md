---
title: 剑指Offer-16-数值的整数次方
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-09-07 22:32:28
categories:
    - Algorithm  
    - 剑指Offer  
    - 16
tags: [Algorithm, Offer, 递归, 分治]
---

# 题目
---
## 题目描述
实现函数double Power(double base, int exponent)，**求base的exponent次方**。不得使用库函数，同时不需要考虑大数问题。
<!-- more -->

## 示例1
> **输入**：2.00000, 10  
> **输出**：1024.00000  

## 示例2
> **输入**：2.10000, 3  
> **输出**：9.26100  

## 示例3
> **输入**：2.00000, -2  
> **输出**：0.25000  
> **解释**：$2^{-2} = 1/2^{2} = 1/4 = 0.25$

# 题解
---
## 快速幂
> 把指数n做 **“二进制分解”**，在 **底数不断自身乘以自身** 的过程中，将最终结果需要的部分保存下来。

$x^n = x^{n/2} * x^{n/2} = (x^2)^{n/2}$, 设//为向下取整除法:
- **n为偶数**：$x^n = (x^2)^{n//2}$；
- **n为奇数**：$x^n = x(x^2)^{n//2}$, 即多出一项x。

1)若x==0，则返回0; 2)初始化res=1; 3)当n<0时，将x转为分数，n取负数; 4)循环：a.若n&1==1,则将当前x乘入res; b.执行$x=x^2$; c.将n右移一位。

> **时间复杂度**：O(logn)，二分对数级别时间复杂度；  
> **空间复杂度**：O(1)

```python
class Solution:
    def myPow(self, x: float, n: int) -> float:
        if x == 0: 
            return 0
        res = 1
        if n < 0: 
            x, n = 1 / x, -n
        while n:
            if n & 1: 
                res *= x
            x *= x
            n >>= 1
        return res
```

## 递归
> 将指数n每次 **二分**，然后分 **奇偶数分别递归** 求解。

- **递推**：1)n为`奇数`: 提出x，并使n-1，继续递归; 2)n为`偶数`: 将n二分，继续递归。
- **终止**：当 `n == 0` 时，x的0次幂为1。

1)若x==0，返回0; 2)若n==0，递推结束; 3)若n<0，将x取分数，幂次取反; 4)分奇偶递推。  

> **时间复杂度**：O(logn)  
> **空间复杂度**：O(1)

```python
class Solution:
    def myPow(self, x: float, n: int) -> float:
        if x == 0:
            return 0
        if n == 0:
            return 1
        elif n < 0:
            return 1 / self.myPow(x, -n)
        if n & 1:
            return x * self.myPow(x, n-1)
        else:
            return self.myPow(x*x, n//2)
```
