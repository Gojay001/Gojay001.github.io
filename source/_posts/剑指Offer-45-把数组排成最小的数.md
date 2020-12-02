---
title: 剑指Offer-45-把数组排成最小的数
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-11-23 17:05:50
categories:
    - Algorithm  
    - 剑指Offer  
    - 45
tags: [Algorithm, Offer, 排序]
---

# 题目
---
## 题目描述
输入一个非负整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最小的一个。
<!-- more -->

## 示例1
> **输入**: [10,2]  
> **输出**: "102"  

## 示例2
> **输入**: [3,30,34,5,9]  
> **输出**: "3033459"  

# 题解
---
([引用Krahets](https://leetcode-cn.com/problems/ba-shu-zu-pai-cheng-zui-xiao-de-shu-lcof/solution/mian-shi-ti-45-ba-shu-zu-pai-cheng-zui-xiao-de-s-4/))
## 位数规律
> 将数字数组转为 **字符串** 数组，然后将其 **排序**。  

- 使用Python内置函数functools.cmp_to_key，自定义字符串排序规则;

> **时间复杂度**: O(nlogn)，排序占用O(nlogn);  
> **空间复杂度**: O(n)，字符串数组占O用O(n)额外空间;

```python
class Solution:
    def minNumber(self, nums: List[int]) -> str:
        def sort_rule(x, y):
            a, b = x + y, y + x
            if a > b:
                return 1
            elif a < b:
                return -1
            else:
                return 0
        
        strs = [str(num) for num in nums]
        strs.sort(key = functools.cmp_to_key(sort_rule))
        return ''.join(strs)
```