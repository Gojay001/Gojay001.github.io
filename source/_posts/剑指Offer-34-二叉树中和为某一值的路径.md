---
title: 剑指Offer-34-二叉树中和为某一值的路径
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-10-22 16:12:14
categories:
    - Algorithm  
    - 剑指Offer  
    - 34
tags: [Algorithm, Offer, DFS, 递归, 二叉树]
---

# 题目
---
## 题目描述
输入一棵二叉树和一个整数，打印出二叉树中节点值的和为输入整数的所有路径。从树的根节点开始往下一直到叶节点所经过的节点形成一条路径。
<!-- more -->

## 示例1
> **给定二叉树**: 

```
              5
             / \
            4   8
           /   / \
          11  13  4
         /  \    / \
        7    2  5   1
```
**返回**: 
```
[
   [5,4,11,2],
   [5,8,4,5]
]
```

# 题解
---
## DFS回溯
> 二叉树搜索问题，使用**回溯算法**，先序遍历搜索节点，同时记录节点路径。

- **先序遍历**: [根节点, 左子树, 右子树];  
- **路径记录**: 记录根节点到当前节点的路径; 1)当前节点为叶子节点; 2)节点值和为sum;

从根节点向下搜索子树:  
1. **路径更新**: 当当前节点加入路径;  
2. **目标值更新**: 目标值-当前值;  
3. **路径记录**: 当该路径满足目标值，则将其路径加入到res;  
4. **子树遍历**: 递归搜素左、右子树;  
5. **路径恢复**: 向上回溯前，将当前节点从路径中删除。

> **时间复杂度**：O(n)，先序遍历所有节点；  
> **空间复杂度**：O(n)，递归占用辅助空间O(n)。

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def pathSum(self, root: TreeNode, sum: int) -> List[List[int]]:
        res, path = [], []

        def dfs(root, sum):
            if not root:
                return
            path.append(root.val)
            sum -= root.val
            if sum == 0 and not root.left and not root.right:
                res.append(list(path))
            dfs(root.left, sum)
            dfs(root.right, sum)
            path.pop()

        dfs(root, sum)
        return res
```
