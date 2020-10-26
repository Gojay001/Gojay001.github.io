---
title: 剑指Offer-36-二叉搜索树与双向链表
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-10-26 21:33:38
categories:
    - Algorithm  
    - 剑指Offer  
    - 36
tags: [Algorithm, Offer, DFS, 二叉树]
---

# 题目
---
## 题目描述
> 输入一棵二叉搜索树，**将该二叉搜索树转换成一个排序的循环双向链表**。要求不能创建任何新的节点，只能调整树中节点指针的指向。
<!-- more -->

## 示例
以下面的二叉搜索树为例：
![剑指Offer-36-1.png](https://i.loli.net/2020/10/26/nVlAY3KfUJeMRPT.png)
我们希望将这个二叉搜索树转化为双向循环链表。链表中的每个节点都有一个前驱和后继指针。对于双向循环链表，第一个节点的前驱是最后一个节点，最后一个节点的后继是第一个节点。  

下图展示了上面的二叉搜索树转化成的链表。“head” 表示指向链表中有最小元素的节点。
![剑指Offer-36-2.png](https://i.loli.net/2020/10/26/u2GVUKYjflHvC9c.png)
特别地，我们希望可以就地完成转换操作。当转化完成以后，树中节点的左指针需要指向前驱，树中节点的右指针需要指向后继。还需要返回链表中的第一个节点的指针。

# 题解
---
## 中序遍历
> 中序遍历实现排序链表，每个节点进行`前向指针和后向指针的连接`，最后将头节点和尾节点连接。

`dfs(cur)`: 递归实现中序遍历；
1. **终止条件**: 当前节点为空时，return;
2. **递归左子树**: dfs(cur.left);
3. **构建链表**: 1) 当pre为空时，即`当前节点标记为头节点`; 2)当pre不为空，`更改当前节点与上一节点的双向连接关系`; 3) 将当前节点更新为pre;
4. **递归右子树**: dfs(cur.right);

> **时间复杂度**: O(n)，中序遍历需遍历所有节点;
> **空间复杂度**: O(n)，递归占用额外空间;

```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
"""
class Solution:
    def treeToDoublyList(self, root: 'Node') -> 'Node':
        def dfs(cur):
            if not cur:
                return
            dfs(cur.left)
            if self.pre:
                self.pre.right, cur.left = cur, self.pre
            else:
                self.head = cur
            self.pre = cur
            dfs(cur.right)

        if not root:
            return
        self.pre = None
        dfs(root)
        self.head.left, self.pre.right = self.pre, self.head
        return self.head
```
