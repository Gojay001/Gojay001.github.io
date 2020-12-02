---
title: 剑指Offer-44-数字序列中某一位的数字
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-11-23 16:09:57
categories:
    - Algorithm  
    - 剑指Offer  
    - 44
tags: [Algorithm, Offer, 数学]
---

# 题目
---
## 题目描述
数字以0123456789101112131415…的格式序列化到一个字符序列中。在这个序列中，第5位（从下标0开始计数）是5，第13位是1，第19位是4，等等。

请写一个函数，求任意第n位对应的数字。
<!-- more -->

## 示例1
> **输入**: n = 3  
> **输出**: 3  

## 示例2
> **输入**: n = 11  
> **输出**: 0  

# 题解
---
([引用Krahets](https://leetcode-cn.com/problems/shu-zi-xu-lie-zhong-mou-yi-wei-de-shu-zi-lcof/solution/mian-shi-ti-44-shu-zi-xu-lie-zhong-mou-yi-wei-de-6/))
## 位数规律
> 计算当前所在的`位数`范围，其次确定对应`数字`，最后找出对应该数字的`第几位`。  

1. 确定所求数位的所在数字的位数 `digit`;  
2. 确定所求数位所在的数字 `num`;  
3. 确定所求数位在 num 的哪一数位;

> **时间复杂度**: O(logn)，循环最多logn次，num转为字符串占用O(n);  
> **空间复杂度**: O(logn)，num转为字符串占O(logn)额外空间;

```python
class Solution:
    def findNthDigit(self, n: int) -> int:
        digit, start, count = 1, 1, 9
        while n > count:
            n -= count
            digit += 1
            start *= 10
            count = 9 * start * digit
        num = start + (n - 1) // digit
        return int(str(num)[(n - 1) % digit])
```