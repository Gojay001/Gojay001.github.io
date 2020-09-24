---
title: 剑指Offer-27-二叉树的镜像
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-09-23 16:59:16
categories:
    - Algorithm  
    - 剑指Offer  
    - 27
tags: [Algorithm, Offer, 二叉树, 递归, 栈, 队列]
---

# 题目
---
## 题目描述
请完成一个函数，输入一个二叉树，该函数输出它的镜像。

例如输入：
```
     4
   /   \
  2     7
 / \   / \
1   3 6   9
```
镜像输出：
```
     4
   /   \
  7     2
 / \   / \
9   6 3   1
```
<!-- more -->

## 示例1
> **输入**: root = [4,2,7,1,3,6,9]  
> **输出**: [4,7,2,9,6,3,1]

# 题解
---
## 递归
> 遍历二叉树，将当前结点左右子结点交换，然后将左右子树递归交换。 

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
    def mirrorTree(self, root: TreeNode) -> TreeNode:
        if not root:
            return
        root.left, root.right = root.right, root.left
        self.mirrorTree(root.left)
        self.mirrorTree(root.right)
        return root
```

## 辅助栈/队列
> 利用栈（或队列）遍历树的所有节点，并交换当前结点的左右子节点。 

- 辅助栈弹出当前结点，存储其左右子树;
- 将当前结点的左右子结点交换;

> **时间复杂度**：O(n)，遍历二叉树；  
> **空间复杂度**：O(n)，辅助栈存储遍历得到的结点。

```python
class Solution:
    def mirrorTree(self, root: TreeNode) -> TreeNode:
        if not root:
            return
        stack = [root]
        while stack:
            node = stack.pop()
            if node.left:
                stack.append(node.left)
            if node.right:
                stack.append(node.right)
            node.left, node.right = node.right, node.left
        return root
```
