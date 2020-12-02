---
title: 剑指Offer-43-1～n 整数中 1 出现的次数
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-11-18 21:27:33
categories:
    - Algorithm  
    - 剑指Offer  
    - 43
tags: [Algorithm, Offer, 数学]
---

# 题目
---
## 题目描述
输入一个整数 n ，求1～n这n个整数的十进制表示中1出现的次数。

例如，输入12，1～12这些整数中包含1 的数字有1、10、11和12，1一共出现了5次。
<!-- more -->

## 示例1
> **输入**: n = 12  
> **输出**: 5  

## 示例2
> **输入**: n = 13  
> **输出**: 6  

# 题解
---
([引用Krahets](https://leetcode-cn.com/problems/1nzheng-shu-zhong-1chu-xian-de-ci-shu-lcof/solution/mian-shi-ti-43-1n-zheng-shu-zhong-1-chu-xian-de-2/))
## 位数规律
> 依次遍历数字n的每一位数，根据规律统计出现1的个数。  

- **当前位 = 0**: 只由高位决定，即 `high * digit`;  
- **当前位 = 1**: 由高位和低位共同决定，即 `high * digit + low + 1`;  
- **否则**: 只由高位决定，即 `(high + 1) * digit`;

> **时间复杂度**: O(logn)，遍历数字n的位数，需要循环logn次;  
> **空间复杂度**: O(1)，变量占用常数级额外空间;

```python
class Solution:
    def countDigitOne(self, n: int) -> int:
        low, cur, high = 0, n % 10, n // 10
        digit, res = 1, 0
        while high != 0 or cur != 0:
            if cur == 0:
                res += high * digit
            elif cur == 1:
                res += high * digit + low + 1
            else:
                res += (high + 1) * digit
            low += cur * digit
            cur = high % 10
            high //= 10
            digit *= 10
        return res
```