---
title: 剑指Offer-03-数组中重复的数字
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-08-21 09:46:07
categories:
    - Algorithm  
    - 剑指Offer  
    - 03  
tags: [Algorithm, Offer]
---

# 题目
---
## 题目描述
> 找出`数组中重复的数字`。  
> 在一个长度为 n 的数组 nums 里的所有数字都在 0～n-1 的范围内。数组中某些数字是重复的，但不知道有几个数字重复了，也不知道每个数字重复了几次。请找出数组中任意一个重复的数字。
<!-- more -->

## 示例
> **输入**：  
> [2, 3, 1, 0, 2, 5, 3]. 
> **输出**：2 或 3 

# 题解
---
## 排序后查看相邻元素
> 先`排序，然后查看相邻元素是否相同`；若相同则元素重复，return。该方法运行时间慢。  
> **时间复杂度**：O(nlogn)  
> **空间复杂度**：O(1)  

```python
class Solution:
    def findRepeatNumber(self, nums: List[int]) -> int:
        nums.sort()
        for i in range(len(nums)):
            if nums[i] == nums[i+1]:
                return nums[i]
```

## 辅助空间
> 开辟一个新的列表或字典，`将nums数值作为新列表的索引并赋值为1`；若该索引已经复制则元素重复，return。  
> **时间复杂度**：O(n)  
> **空间复杂度**：O(n)  

```python
class Solution:
    def findRepeatNumber(self, nums: List[int]) -> int:
        repeatDict = {}
        for num in nums:
            if num not in repeatDict:
                repeatDict[num] = 1
            else:
                return num
```

## 原地交换
> 与辅助空间思路类似，`让索引i位置存放数值i`。如果索引位置i的元素不是i，将把i元素放在对应位置，即nums[nums[i]]与nums[i]交换。若交换时发现索引nums[i]的元素与索引相同，则元素重复，return。  
> **时间复杂度**：O(n)  
> **空间复杂度**：O(1) 

```python
class Solution:
    def findRepeatNumber(self, nums: List[int]) -> int:
        for i in range(len(nums)):
            while i != nums[i]:
                if nums[i] == nums[nums[i]]:
                    return nums[i]
                nums[nums[i]], nums[i] = nums[i], nums[nums[i]]
```

