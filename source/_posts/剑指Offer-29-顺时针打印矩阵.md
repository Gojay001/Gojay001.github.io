---
title: 剑指Offer-29-顺时针打印矩阵
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-10-14 14:36:16
categories:
    - Algorithm  
    - 剑指Offer  
    - 29
tags: [Algorithm, Offer, 数组]
---

# 题目
---
## 题目描述
输入一个矩阵，按照从外向里以顺时针的顺序依次打印出每一个数字。
<!-- more -->

## 示例1
> **输入**: matrix = [[1,2,3],[4,5,6],[7,8,9]]  
> **输出**: [1,2,3,6,9,8,7,4,5]

## 示例2
> **输入**: matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]  
> **输出**: [1,2,3,4,8,12,11,10,9,5,6,7]

# 题解
---
## 逆时针旋转
([引用SolitudeRain](https://leetcode-cn.com/problems/shun-shi-zhen-da-yin-ju-zhen-lcof/comments/))
> 提取最前面的元素，然后将剩下元素逆时针旋转90度，再依次循环进行。 

- 沿主对角线对称+沿水平方向对称= **将原矩阵逆时针旋转90度** ，所以每次只要pop出第一行就可以了。

```python
class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        result = []
        while matrix:
            result.extend(list(matrix.pop(0)))
            matrix = list(zip(*matrix))
            matrix.reverse()
        return result
```

# 设定边界
> 设定矩阵的“上、下、左、右”四个边界，模拟题目要求遍历顺序。 

1. **空值处理**: 当 `matrix` 为空时，直接return;
2. **初始化**: 矩阵 左、右、上、下边界标志 `l,r,t,b` 及最终结果 `res`;
3. **循环遍历**: 按照“左到右、上到下、右到左、下到上”循环，每个方向进行如下操作，
- 输出当前元素到res，即打印矩阵;
- 边界向内收缩，即该行或该列已被打印;
- 判断是否越界，是否打印完毕；

> **时间复杂度**：O(mn)，每遍历一圈占用O(max{m,n})，共需便利min{m,n}轮；  
> **空间复杂度**：O(1)，四个边界标志占用常数大小的额外空间。

```python
class Solution:
    class Solution:
    def spiralOrder(self, matrix:[[int]]) -> [int]:
        if not matrix: 
            return []
        l, r, t, b, res = 0, len(matrix[0])-1, 0, len(matrix)-1, []
        while True:
            for i in range(l, r+1): 
                res.append(matrix[t][i]) # left to right
            t += 1
            if t > b: 
                break
            for i in range(t, b + 1): 
                res.append(matrix[i][r]) # top to bottom
            r -= 1
            if l > r: 
                break
            for i in range(r, l - 1, -1): 
                res.append(matrix[b][i]) # right to left
            b -= 1
            if t > b: 
                break
            for i in range(b, t - 1, -1): 
                res.append(matrix[i][l]) # bottom to top
            l += 1
            if l > r: 
                break
        return res
```
