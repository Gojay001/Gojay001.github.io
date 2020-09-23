---
title: 剑指Offer-26-树的子结构
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-09-23 14:47:18
categories:
    - Algorithm  
    - 剑指Offer  
    - 26
tags: [Algorithm, Offer, 树, 递归, DFS]
---

# 题目
---
## 题目描述
输入两棵二叉树A和B，判断B是不是A的子结构。(约定空树不是任意一个树的子结构)

B是A的子结构， 即 A中有出现和B相同的结构和节点值。

例如:
给定的树 A:
```
     3  
    / \  
   4   5  
  / \  
 1   2
```
给定的树 B：
```
   4 
  /
 1
```
返回 true，因为 B 与 A 的一个子树拥有相同的结构和节点值。
<!-- more -->

## 示例1
> **输入**: A = [1,2,3], B = [3,1]  
> **输出**: false

## 示例2
> **输入**: A = [3,4,5,1,2], B = [4,1]  
> **输出**: true

# 题解
---
## 递归+DFS
> 遍历两棵树，**左右子树分别递归**判断是否为子结构。

**若B树为A树的子结构，则有如下三种情况**：
1. `A树与B树`完全相等
2. A的`左子树`与B树完全相等
3. A的`右子树`与B树完全相等

**DFS搜索两树是否相等**：
1. 若A树为空，返回False；若B树为空，则说明B树为A树子结构，返回True;
2. 两棵树都不为空，则需比较如下三种情况：
- A的`根节点`与B的根节点是否相同
- A的`左子树`与B的左子树是否相同
- A的`右子树`与B的右子树是否相同 

> **时间复杂度**：O(mn)，先序遍历树A占用O(m)，每次调用DFS判断占用O(n)；  
> **空间复杂度**：O(m)，递归占用额外空间。

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def isSubStructure(self, A: TreeNode, B: TreeNode) -> bool:
        if not A or not B:
            return False
        return self.dfs(A, B) or self.isSubStructure(A.left, B) or self.isSubStructure(A.right, B)
    
    def dfs(self, A, B):
        if not A:
            return False
        elif not B:
            return True
        else:
            return A.val == B.val and self.dfs(A.left, B.left) and self.dfs(A.right, B.right)
```
