---
title: 剑指Offer-32-I. 从上到下打印二叉树
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-10-18 22:12:08
categories:
    - Algorithm  
    - 剑指Offer  
    - 32
tags: [Algorithm, Offer, BFS, 队列]
---

# 题目
---
## 题目描述
从上到下打印出二叉树的每个节点，同一层的节点按照从左到右的顺序打印。
<!-- more -->

## 示例
> **给定二叉树**: `[3,9,20,null,null,15,7]`, 

```
    3
   / \
  9  20
    /  \
   15   7
```
> **返回**: `[3,9,20,15,7]`

# 题解
---
## BFS/队列
> 二叉树的层次遍历，采用广度优先遍历（BFS），使用队列实现。

当队列不为空时，循环:
- **出队**: 队首元素出队;
- **打印**: 将当前元素的值添加到res;
- **子结点入队**: 若当前元素的左右子树不为空，则将其加入队列。

> **时间复杂度**：O(n)，每个结点都会经历入队出队操作，即BFS将会循环n次；  
> **空间复杂度**：O(n)，最差情况，即树为平衡二叉树时，最多有n/2个结点同时存储在队列。

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def levelOrder(self, root: TreeNode) -> List[int]:
        if not root:
            return []
        res, queue = [], collections.deque()
        queue.append(root)
        while queue:
            node = queue.popleft()
            res.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        return res
```
> Python 中使用 `collections` 中的双端队列 `deque()` ，其 `popleft()` 方法可达到 **O(1)** 时间复杂度；列表 list 的 `pop(0)` 方法时间复杂度为 **O(N)**。
