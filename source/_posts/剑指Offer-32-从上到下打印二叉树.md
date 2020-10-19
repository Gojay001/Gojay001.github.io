---
title: 剑指Offer-32-从上到下打印二叉树
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-10-18 22:12:08
categories:
    - Algorithm  
    - 剑指Offer  
    - 32
tags: [Algorithm, Offer, BFS, 队列]
---

# 题目I
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
## BFS / 队列
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

# 题目II
---
## 题目描述
从上到下按层打印二叉树，同一层的节点按从左到右的顺序打印，每一层打印到一行。
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

> **返回**其层次遍历结果: 

```
[
  [3],
  [9,20],
  [15,7]
]
```

# 题解
---
## BFS / 队列
> 二叉树的层次遍历，采用广度优先遍历（BFS），使用队列实现，使用列表存储每层所有结点元素。

1. 每层打印到一行: 将本层全部结点打印到列表，再将下层结点全部加入队列。
2. 当队列不为空时，循环:
- 新建列表cur,用于存储当层打印结果;
- 当前层打印，循环次数为当前层结点个数，即队列长度: a)**出队**: 队首元素出队; b)**打印**: 将当前元素的值添加到列表cur; c)**子结点入队**: 若当前元素的左右子树不为空，则将其加入队列;  
- 将当前层列表加入到res。

> **时间复杂度**：O(n)，每个结点都会经历入队出队操作，即BFS将会循环n次；  
> **空间复杂度**：O(n)，最差情况，即树为平衡二叉树时，最多有n/2个结点同时存储在队列。

```python
class Solution:
    def levelOrder(self, root: TreeNode) -> List[List[int]]:
        if not root:
            return []
        res, queue = [], collections.deque()
        queue.append(root)
        while queue:
            cur = []
            for _ in range(len(queue)):
                node = queue.popleft()
                cur.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            res.append(cur)
        return res
```

# 题目III
---
## 题目描述
请实现一个函数按照之字形顺序打印二叉树，即第一行按照从左到右的顺序打印，第二层按照从右到左的顺序打印，第三行再按照从左到右的顺序打印，其他行以此类推。
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

> **返回**其层次遍历结果: 

```
[
  [3],
  [20,9],
  [15,7]
]
```

# 题解
---
## BFS + 倒序
- 当res的长度为偶数时，即当前层为 **偶数层**，此时对当前层列表进行`倒序操作`。

> **时间复杂度**：O(n)，每个结点都会经历入队出队操作，即BFS将会循环n次，占用O(n)；进行少于n个节点的倒序操作，占用O(n)；  
> **空间复杂度**：O(n)，最差情况，即树为平衡二叉树时，最多有n/2个结点同时存储在队列。

```python
class Solution:
    def levelOrder(self, root: TreeNode) -> List[List[int]]:
        if not root:
            return []
        res, queue = [], collections.deque()
        queue.append(root)
        while queue:
            cur = []
            for _ in range(len(queue)):
                node = queue.popleft()
                cur.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            res.append(cur)
        return res
```

## BFS + 双端队列
- 将当前层输出改为双端队列，当为奇数层时，元素加入队列尾部；当为 **偶数层** 时，`元素加入队列头部`。

> **时间复杂度**：O(n)，每个结点都会经历入队出队操作，即BFS将会循环n次；  
> **空间复杂度**：O(n)，最差情况，即树为平衡二叉树时，最多有n/2个结点同时存储在队列。

```python
class Solution:
    def levelOrder(self, root: TreeNode) -> List[List[int]]:
        if not root:
            return []
        res, queue = [], collections.deque()
        queue.append(root)
        while queue:
            cur = collections.deque()
            for _ in range(len(queue)):
                node = queue.popleft()
                if len(res) % 2:
                    cur.appendleft(node.val)
                else:
                    cur.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            res.append(list(cur))
        return res
```