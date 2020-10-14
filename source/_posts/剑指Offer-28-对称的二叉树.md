---
title: 剑指Offer-28-对称的二叉树
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-09-24 16:48:01
categories:
    - Algorithm  
    - 剑指Offer  
    - 28
tags: [Algorithm, Offer, 二叉树, 递归]
---

# 题目
---
## 题目描述
请实现一个函数，用来判断一棵二叉树是不是对称的。如果一棵二叉树和它的镜像一样，那么它是对称的。

例如，二叉树 [1,2,2,3,4,4,3] 是对称的。
```
    1
   /  \
  2    2
 / \  / \
3  4 4   3
```
但是下面这个 [1,2,2,null,3,null,3] 则不是镜像对称的:
```
    1
   / \
  2   2
   \   \
   3    3
```
<!-- more -->

## 示例1
> **输入**: root = [1,2,2,3,4,4,3]  
> **输出**: true

## 示例2
> **输入**: root = [1,2,2,null,3,null,3]  
> **输出**: false

# 题解
---
## 递归
> 以三层二叉树结点为递归基础，**每次将根节点的左右结点和右右结点进行交换**，然后将根节点的左、右结点分别作为根节点进行递归。 

**对称二叉树**特性：
- `root.left == root.right`: 根节点的左、右子结点相等;
- `root.left.left == root.right.right`: 左子树结点的左结点与右子树结点的右结点相等;
- `root.left.right == root.right.left`: 左子树结点的右结点与右子树结点的左结点相等;

**终止条件**：
- 根节点为空，return True;
- 根节点的左子树与右子树均为空，即遍历到叶子结点时二叉树仍对称，return True;
- 根节点的左子树或右子树一边为空，一边不为空，故二叉树不对称，return False;
- 根节点的左右子树结点不相等，return False;

根据对称二叉树特性，为判断`root.left.left == root.right.right`是否成立，则只需将root.left.right与root.right.right交换，从而比较root.left.left与root.left.right是否相等即可。

> **时间复杂度**：O(n)，遍历二叉树；  
> **空间复杂度**：O(n)，递归占用额外空间。

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def isSymmetric(self, root: TreeNode) -> bool:
        if not root:
            return True
        if not root.left and not root.right:
            return True
        elif not root.left or not root.right:
            return False
        if root.left.val != root.right.val:
            return False
        root.left.right, root.right.right = root.right.right, root.left.right
        return self.isSymmetric(root.left) and self.isSymmetric(root.right)
```
