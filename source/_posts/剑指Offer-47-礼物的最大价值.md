---
title: 剑指Offer-47-礼物的最大价值
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-12-15 11:14:27
categories:
    - Algorithm  
    - 剑指Offer  
    - 47
tags: [Algorithm, Offer, 动态规划]
---

# 题目
---
## 题目描述
在一个 m*n 的棋盘的每一格都放有一个礼物，每个礼物都有一定的价值（价值大于 0）。你可以从棋盘的左上角开始拿格子里的礼物，并每次向右或者向下移动一格、直到到达棋盘的右下角。给定一个棋盘及其上面的礼物的价值，请计算你最多能拿到多少价值的礼物？
<!-- more -->

## 示例1
> **输入**:   
> [
>   [1,3,1],
>   [1,5,1],
>   [4,2,1]
> ]
> **输出**: 12  
> **解释**: 路径 1→3→5→2→1 可以拿到最多价值的礼物

# 题解
---
## 动态规划
> 当前位置的最大值为当前值+max(左方，上方)。  

- **边界**: dp[0][i] = dp[0][i-1] + grid[0][i]; dp[i][0] = dp[i-1][0] + grid[i][0];  
- **转移方程**: dp[i][j] = max(dp[i-1][j], dp[i][j-1]) + grid[i][j];  

> **时间复杂度**: O(mn)，遍历grid矩阵;  
> **空间复杂度**: O(mn)，dp数组占用O(mn)额外空间;

```python
class Solution:
    def maxValue(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        dp = [[0] * n for i in grid]
        dp[0][0] = grid[0][0]
        for i in range(1, m):
            dp[i][0] = dp[i-1][0] + grid[i][0]
        for i in range(1, n):
            dp[0][i] = dp[0][i-1] + grid[0][i]
        for i in range(1, m):
            for j in range(1, n):
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]) + grid[i][j]
        return dp[-1][-1]
```

- **原地dp**:

> **时间复杂度**: O(mn)，遍历grid矩阵;  
> **空间复杂度**: O(1)，更新原数组值，不占用额外空间;

```python
class Solution:
    def maxValue(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])
        for i in range(1, m):
            grid[i][0] += grid[i-1][0]
        for i in range(1, n):
            grid[0][i] += grid[0][i-1]
        for i in range(1, m):
            for j in range(1, n):
                grid[i][j] += max(grid[i][j-1], grid[i-1][j])
        return grid[-1][-1]
```
