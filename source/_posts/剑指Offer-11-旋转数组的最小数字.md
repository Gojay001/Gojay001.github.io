---
title: 剑指Offer-11-旋转数组的最小数字
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-08-30 15:10:29
categories:
    - Algorithm  
    - 剑指Offer  
    - 11
tags: [Algorithm, Offer, 数组, 二分查找]
---

# 题目
---
## 题目描述
把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。输入一个递增排序的数组的一个旋转， **输出旋转数组的最小元素** 。例如，数组 `[3,4,5,1,2]` 为 `[1,2,3,4,5]` 的一个旋转，该数组的最小值为1。
<!-- more -->

## 示例1
> **输入**：[3,4,5,1,2]  
> **输出**：1

## 示例2
> **输入**：[2,2,2,0,1]  
> **输出**：0

# 题解
---
## 暴力搜索
> 依次 `遍历` 数组，寻找数组最小值。  
> **时间复杂度**：O(n)  
> **空间复杂度**：O(1)

```python
class Solution:
    def minArray(self, numbers: List[int]) -> int:
        return min(numbers)
```

## 二分查找
> 每次取数组 `中间元素` 与左（右）排序数组中 `最右侧的元素` 比较，最终返回数组最小值。  
> 左排序数组：mid左边的数组；右排序数组：mid右边的数组。  

- 当 `numbers[mid] > numbers[right]` 时：最小元素在右排序数组[mid+1,right]中，故使 **left = mid + 1**；
- 当 `numbers[mid] < numbers[right]` 时：最小元素在左排序数组[left,mid]中，故使 **right = mid**；
- 当 `numbers[mid] == numbers[right]` 时：无法判断最小元素在哪个排序数组中，故使 **right = right - 1**，缩小判断范围。

### 分析numbers[mid] == numbers[right]  
例：[1,0,1,1,1], [1,1,1,0,1]，无法判断最小元素在哪个排序数组中。  
> `right=right-1` 验证：  
> 1. 最小元素在 `左排序数组` 中：numbers[mid] == numbers[right]，则数组[mid,right]中所有元素值相等，right=right-1只会抛弃一个重复值，最小值仍会在[left,mid]中。  
> 2. 最小元素在 `右排序数组` 中：numbers[mid] == numbers[right]，则数组[left,mid]及[right]元素值相等。1）若最小元素在 `[mid+1,right-1]` 中，执行right=right-1后，最小值仍在[mid+1,right-1]中；2）若最小元素为 `[right]` ，[left,mid]与[right]元素值相同，执行right=right-1后，最小值仍在[left,mid]中。  

> **时间复杂度**：O($\log_{2}n$)  
> **空间复杂度**：O(1)

```python
class Solution:
    def minArray(self, numbers: List[int]) -> int:
        left, right = 0, len(numbers)-1
        while left < right:
            mid = (left + right) // 2
            if numbers[mid] > numbers[right]:
                left = mid + 1
            elif numbers[mid] < numbers[right]:
                right = mid
            else:
                right -= 1
        return numbers[left]
            
```
