---
title: 剑指Offer-39-数组中出现次数超过一半的数字
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-11-05 22:08:34
categories:
    - Algorithm  
    - 剑指Offer  
    - 39
tags: [Algorithm, Offer, HashMap]
---

# 题目
---
## 题目描述
数组中有一个数字出现的次数超过数组长度的一半，请找出这个数字。  

你可以假设数组是非空的，并且给定的数组总是存在多数元素。
<!-- more -->

## 示例
> **输入**: [1, 2, 3, 2, 2, 2, 5, 4, 2]  
> **输出**: 2

# 题解
---
## 排序找中间数
> 将数组排序后，目标数字个数超过数组长度一半，则中间数为目标数。

> **时间复杂度**: O(nlogn)，排序时间复杂度为O(nlogn);  
> **空间复杂度**: O(1);

```python
class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        nums.sort()
        return nums[len(nums) // 2]
```

## HashMap
> 使用 HashMap 记录每个数字出现次数，当出现次数大于数组长度一半时，则为目标数。

> **时间复杂度**: O(n)，遍历整个数组;  
> **空间复杂度**: O(n)，辅助HashMap最多占用n/2额外空间;

```python
class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        count = {}
        for num in nums:
            if num not in count:
                count[num] = 0
            count[num] += 1
            if count[num] > len(nums) // 2:
                return num
```

## 摩尔投票法
([引用Krahets](https://leetcode-cn.com/problems/shu-zu-zhong-chu-xian-ci-shu-chao-guo-yi-ban-de-shu-zi-lcof/solution/mian-shi-ti-39-shu-zu-zhong-chu-xian-ci-shu-chao-3/))
> 默认首位数为目标数，票数+1，当下位数字与当前目标数不同时，则票数-1；当票数为0时，重新使下一位数字为新的目标数，最终票数仍为正则当前数为目标数。

目标数个数大于数组长度一半，则抵消其他所有数后，票数仍未正；反之，非目标数无法抵消目标数所有个数。

> **时间复杂度**: O(n)，遍历整个数组;  
> **空间复杂度**: O(1)，变量votes占用常数额外空间;

```python
class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        votes = 0
        for num in nums:
            if votes == 0:
                res = num
            votes += 1 if num == res else -1
        return res
```