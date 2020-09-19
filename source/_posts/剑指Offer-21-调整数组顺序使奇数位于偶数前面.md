---
title: 剑指Offer-21-调整数组顺序使奇数位于偶数前面
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-09-19 11:24:19
categories:
    - Algorithm  
    - 剑指Offer  
    - 21
tags: [Algorithm, Offer, 数组, 指针]
---

# 题目
---
## 题目描述
输入一个整数数组，实现一个函数来调整该数组中数字的顺序，使得所有奇数位于数组的前半部分，所有偶数位于数组的后半部分。
<!-- more -->

# 题解
---
## 分别存储
> odd 和 even 分别存储，最后合并。

> **时间复杂度**：O(n)，遍历列表；  
> **空间复杂度**：O(n)，奇数和偶数共占O(n)空间。

```python
class Solution:
    def exchange(self, nums: List[int]) -> List[int]:
        odd, even = [], []
        for i in nums:
            if i % 2 == 0:
                even.append(i)
            else:
                odd.append(i)
        return odd + even
```

## 单指针
> 指针odd指向已确定奇数后的第一个数，遍历整个列表，若为奇数则交换。

> **时间复杂度**：O(n)，遍历列表；  
> **空间复杂度**：O(1)，指针odd占用常数空间。

```python
class Solution:
    def exchange(self, nums: List[int]) -> List[int]:
        odd = 0
        for i in range(len(nums)):
            if nums[i] % 2 == 1:
                nums[odd], nums[i] = nums[i], nums[odd]
                odd += 1
        return nums
```

## 双指针
> 指针odd指向前向奇数，指针even指向后向偶数，从前遍历整个列表，若为偶数则与后方交换。

> **时间复杂度**：O(n)，遍历列表；  
> **空间复杂度**：O(1)，指针odd和even占用常数空间。

```python
class Solution:
    def exchange(self, nums: List[int]) -> List[int]:
        odd, even = 0, len(nums)-1
        while odd < even:
            if nums[odd] % 2 == 0:
                nums[odd], nums[even] = nums[even], nums[odd]
                even -= 1
            else:
                odd += 1
        return nums
```
