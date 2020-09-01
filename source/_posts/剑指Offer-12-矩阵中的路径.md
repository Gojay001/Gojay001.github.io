---
title: 剑指Offer-12-矩阵中的路径
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-08-31 20:53:18
categories:
    - Algorithm  
    - 剑指Offer  
    - 12
tags: [Algorithm, Offer, DFS, 回溯]
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
## 回溯算法
（[引用Krahets](https://leetcode-cn.com/problems/ju-zhen-zhong-de-lu-jing-lcof/solution/mian-shi-ti-12-ju-zhen-zhong-de-lu-jing-shen-du-yo/)）
> 矩阵搜索问题，使用 **DFS+剪枝** 解决。

> 深度优先搜索（**DFS**）：递归遍历矩阵，先朝某个方向 `搜索到底` ，再回溯到上个节点，沿另一个方向搜索。  
> **剪枝**：在搜索过程中遇到 `该路径不可能与目标匹配` 时，应立即返回，称为可行性剪枝。

- **递归参数**：i,j为矩阵行列索引，k为目标字符在word中的索引。
- **终止条件**：1）`return False` ; a)行列索引越界；b)当前矩阵元素与目标字符不同；2）`return True` ; 字符串已经全部匹配，即 `k==len(word)-1` 。
- **递推过程**：1）`标记当前矩阵元素`：将 board[i][j]值暂存tmp，并重新赋值为''，标记其已被访问过；2）`搜索下一单元格`：分别对当前元素的上下左右四个方向进行DFS递归搜索；3）`还原当前矩阵元素`：若从矩阵左上角未搜索到word，将循环i,j进行后续搜索，故需还原矩阵元素。

> **时间复杂度**：O($mn3^k$)  
> **空间复杂度**：O(k)

```python
class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        def dfs(i, j, k):
            if not 0 <= i < len(board) or not 0 <= j < len(board[i]) or board[i][j] != word[k]:
                return False
            if k == len(word) - 1:
                return True
            tmp, board[i][j] = board[i][j], ''
            flag = dfs(i+1, j, k+1) or dfs(i-1, j, k+1) or dfs(i, j+1, k+1) or dfs(i, j-1, k+1)
            board[i][j] = tmp
            return flag
        
        for i in range(len(board)):
            for j in range(len(board[i])):
                if dfs(i, j, 0):
                    return True
        return False        
```

## 非递归DFS
（[引用东流](https://leetcode-cn.com/problems/ju-zhen-zhong-de-lu-jing-lcof/solution/fei-di-gui-dfs53-100-by-dong-liu-4/)，击败84.5% + 99.8%）
> DFS用栈维护，BFS用队列维护。

```python
class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        # 预处理
        w_l = len(word)
        if w_l < 1:
            return True
        rows = len(board)
        cols = len(board[0])
        # 标记数组
        board_vis = [[0] * cols for i in range(rows)]
        # 方向数组
        dir_list = [[-1, 0], [0, 1], [1, 0],[0, -1]]
        # 非递归DFS要用栈维护哦，先把所有头节点放进来，每个节点包括3个值（i,j,l）,i和j是它的坐标，l是它在word中的下标
        word_stack = []
        for i in range(rows):
            for j in range(cols):
                if board[i][j] == word[0]:
                    word_stack.append((i, j, 0))
        # 正式开始DFS咯
        while len(word_stack) > 0:
            # 获取头节点信息，先不要弹出
            top = word_stack[-1]
            tx = top[0]
            ty = top[1]
            tl = top[2]
            # 访问这个节点，并开始深度遍历
            board_vis[tx][ty] = 1
            # 出口条件，如果word遍历完，返回True
            if tl == w_l - 1:
                return True
            # flag记录是否能够继续深度遍历
            flag = True
            for di in dir_list:
                next_x = tx + di[0]
                next_y = ty + di[1]
                # 深度遍历的条件
                if next_x >= 0 and next_x < rows and next_y >= 0 and next_y < cols \
                        and board_vis[next_x][next_y] == 0 and board[next_x][next_y] == word[tl + 1]:                   
                    # 注意子节点与父节点的关系
                    word_stack.append((next_x, next_y, tl + 1))
                    flag = False
            # 如果不能继续深度遍历，回溯，这个回溯有点复杂：需要一层一层往上回溯，回溯到有多个子节点的地方，类似于树的深度遍历
            if flag:
                while len(word_stack):
                    top = word_stack[-1]
                    if top[2] != tl:
                        break
                    tl -= 1
                    # 弹出，并标记取消
                    word_stack.pop()
                    board_vis[top[0]][top[1]] = 0
        return False
```
