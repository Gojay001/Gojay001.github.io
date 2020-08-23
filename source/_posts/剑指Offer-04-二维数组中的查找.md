---
title: 剑指Offer-04-二维数组中的查找
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-08-21 16:02:19
categories:
    - Algorithm  
    - 剑指Offer  
    - 04  
tags: [Algorithm, Offer]
---

# 题目
---
## 题目描述
> 在一个 n * m 的二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个函数，`输入这样的一个二维数组和一个整数，判断数组中是否含有该整数`。
<!-- more -->

## 示例
> 现有矩阵 matrix 如下：  
```
[
  [1,   4,  7, 11, 15],
  [2,   5,  8, 12, 19],
  [3,   6,  9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30]
]
```
> 给定 target = `5`，返回 `true`。  
> 给定 target = `20`，返回 `false`。

# 题解
---
## 暴力解法
> `按行依次搜索`target，如果当前元素大于target，则进行下一行搜索；若当前元素等于target，则return True；未找到return False。  
> **时间复杂度**：O(nm)，最好情况O(1)  
> **空间复杂度**：O(1)  

```python
class Solution:
    def findNumberIn2DArray(self, matrix: List[List[int]], target: int) -> bool:
        for i in range(len(matrix)):
            for j in range(len(matrix[i])):
                if matrix[i][j] == target:
                    return True
                elif matrix[i][j] > target:
                    continue
        return False
```

## 二分查找
> 按行依次搜索target，`每次从中间元素进行匹配`，如果该行未找到，则进入下一行搜索；若找到则return True；未找到return False。  
> **时间复杂度**：O(nlogm)  
> **空间复杂度**：O(1)  

```python
class Solution:
    def findNumberIn2DArray(self, matrix: List[List[int]], target: int) -> bool:
        for i in range(len(matrix)):
            left, right = 0, len(matrix[i])-1
            while left <= right:
                mid = (left+right) // 2
                if target < matrix[i][mid]:
                    right = mid - 1
                elif target > matrix[i][mid]:
                    left = mid + 1
                else:
                    return True
        return False
```

## 二叉搜索树
![剑指Offer-04.png](https://i.loli.net/2020/08/23/3RJrhp4V5SdFyEa.png)
> `从右上角开始搜索，将矩阵转化为二叉搜索树`,如上图所示。右上角元素作为根节点，如果target小于当前节点，则向左下方搜索，即向左边列搜索；如果target大于当前节点，则向右下方搜索，即向下一行搜索；否则为找到target，return True。若行索引或列索引越界，即矩阵中无target值，return False。  
> `每轮迭代相当于将矩阵删除一行（列）`，得到新矩阵进行迭代。  
> **时间复杂度**：O(n+m)  
> **空间复杂度**：O(1)

```python
class Solution:
    def findNumberIn2DArray(self, matrix: List[List[int]], target: int) -> bool:
        if not matrix: 
            return False
        i, j = 0, len(matrix[0])-1
        while i <= len(matrix)-1 and j >= 0:
            if target < matrix[i][j]: 
                j -= 1
            elif target > matrix[i][j]: 
                i += 1
            else: 
                return True
        return False
```

