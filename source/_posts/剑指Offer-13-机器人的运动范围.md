---
title: 剑指Offer-13-机器人的运动范围
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-09-03 15:22:22
categories:
    - Algorithm  
    - 剑指Offer  
    - 13
tags: [Algorithm, Offer, DFS, BFS, 回溯]
---

# 题目
---
## 题目描述
地上有一个m行n列的方格，从坐标 `[0,0]` 到坐标 `[m-1,n-1]` 。一个机器人从坐标 `[0, 0]` 的格子开始移动，它每次可以向左、右、上、下移动一格（不能移动到方格外），也不能进入行坐标和列坐标的数位之和大于k的格子。例如，当k为18时，机器人能够进入方格 [35, 37] ，因为3+5+3+7=18。但它不能进入方格 [35, 38]，因为3+5+3+8=19。请问 **该机器人能够到达多少个格子**？

<!-- more -->

## 示例1
> **输入**：m = 2, n = 3, k = 1  
> **输出**：3

## 示例2
> **输入**：m = 3, n = 1, k = 0  
> **输出**：0

# 题解
---
（[引用Krahets](https://leetcode-cn.com/problems/ji-qi-ren-de-yun-dong-fan-wei-lcof/solution/mian-shi-ti-13-ji-qi-ren-de-yun-dong-fan-wei-dfs-b/)）  
> **数位和**：数字中个位及十位数值的和（题目给出 1 <= n,m <=100）；  
> **数位和增量公式**：机器人每次只能移动一格，即x到x+1(x-1)，设x的数位和为 $s_x$，x+1的数位和为 $s_{x+1}$；1) 当 `(x+1)%10!=0` : $s_{x+1} = s_x + 1$ ; 2) 当 `(x+1)%10==0` : $s_{x+1} = s_x - 8$ (例如，19的数位和为10，20的数位和为2)。  
> **可达解结构**：根据可达解的结构，机器人可 `仅通过向右和向下移动，访问所有可达解`。

## 深度优先搜索DFS
> 矩阵搜索问题，可使用 **DFS+剪枝** 解决。  

- **递归参数**：`i, j` 为矩阵行列索引，索引的数位和 `si, sj` 。
- **终止条件**：1)行列索引越界；2)数位和超过目标值k；3)当前元素已经访问过； `return 0`。
- **递推过程**：1）`标记当前矩阵元素`：将索引(i,j)存入集合visited中；2）`搜索下一单元格`：分别对当前元素的下、右两个方向进行DFS递归搜索；  
- **回溯返回值**：返回 `1 + 下方可达解 + 右方可达解`。

> **时间复杂度**：O(mn)，遍历矩阵中所有单元格；  
> **空间复杂度**：O(mn)，visited 存储矩阵所有单元格。

```python
class Solution:
    def movingCount(self, m: int, n: int, k: int) -> int:
        def dfs(i, j, si, sj):
            if i >= m or j >= n or k < si+sj or (i,j) in visited:
                return 0
            visited.add((i,j))
            return 1 + dfs(i+1, j, si+1 if (i+1)%10 else si-8, sj) + dfs(i, j+1, si, sj+1 if (j+1)%10 else sj-8)

        visited = set()
        return dfs(0, 0, 0, 0)   
```

## 广度优先搜索BFS
> 用 **队列实现BFS**，按所有方向向前搜索。

- **初始化**：将 `初始点(0,0)` 加入队列 queue；
- **终止条件**：`queue为空`，即所有可达解全部遍历出队；
- **递推过程**：1)`单元格出队`：队首单元格弹出，作为当前搜索单元格；2)`判断是否跳过`：a)行列索引越界; b)数位和超过目标值k; c)当前元素已经访问过; 3)`标记当前单元格`：将索引(i,j)存入集合visited中；4)`单元格入队`：将当前元素的下、右两个方向的元素加入 queue；
- **返回值**：集合 `visited的长度` 为可达解数量。

> **时间复杂度**：O(mn)，遍历矩阵中所有单元格；  
> **空间复杂度**：O(mn)，visited 存储矩阵所有单元格。

```python
class Solution:
    def movingCount(self, m: int, n: int, k: int) -> int:
        queue, visited = [(0, 0, 0, 0)], set()
        while queue:
            i, j, si, sj = queue.pop(0)
            if i >= m or j >= n or k < si+sj or (i,j) in visited:
                continue
            visited.add((i,j))
            queue.append((i+1, j, si+1 if (i+1)%10 else si-8, sj))
            queue.append((i, j+1, si, sj+1 if (j+1)%10 else sj-8))
        return len(visited)
```
