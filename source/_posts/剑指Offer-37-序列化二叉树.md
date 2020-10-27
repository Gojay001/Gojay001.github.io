---
title: 剑指Offer-37-序列化二叉树
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-10-27 19:11:10
categories:
    - Algorithm  
    - 剑指Offer  
    - 37
tags: [Algorithm, Offer, BFS, 二叉树, 队列]
---

# 题目
---
## 题目描述
> 请实现两个函数，分别用来序列化和反序列化二叉树。
<!-- more -->

## 示例
```
你可以将以下二叉树：

    1
   / \
  2   3
     / \
    4   5

序列化为 "[1,2,3,null,null,4,5]"
```

# 题解
---
([引用Krahets](https://leetcode-cn.com/problems/xu-lie-hua-er-cha-shu-lcof/solution/mian-shi-ti-37-xu-lie-hua-er-cha-shu-ceng-xu-bian-/))
## 层序遍历BFS
> 层序遍历二叉树，使用队列实现BFS。

题目要求的 **序列化** 和 **反序列化** 是`可逆操作`，因此，序列化的字符串应携带完整的二叉树信息。  
为完整表示二叉树，考虑将叶节点下的 `null` 也记录。在此基础上，对于列表中任意某节点 `node` ，其左子节点 `node.left` 和右子节点 `node.right` 在序列中的位置都是 **唯一确定** 的。

- **序列化 Serialize**: 使用队列，对二叉树做层序遍历，将节点值转为字符串存储，再将当前节点的左右子树加入队列；越过叶节点的 `null` 也将存储;  
- **反序列化 Deserialize**: 利用队列按层构建二叉树，借助一个`指针 i` 指向节点 node 的左、右子节点，每构建一个 node 的左、右子节点，指针 i 就向`右移动 1 位`。

> **时间复杂度**: O(n)，遍历完全二叉树，长度最大为2n+1;  
> **空间复杂度**: O(n)，队列最多同时存储节点数为(2n+1)/2;

```python
# Definition for a binary tree node.
# class TreeNode(object):
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Codec:

    def serialize(self, root):
        """Encodes a tree to a single string.
        
        :type root: TreeNode
        :rtype: str
        """
        if not root:
            return '[]'
        queue = collections.deque()
        queue.append(root)
        res = []
        while queue:
            node = queue.popleft()
            if node:
                res.append(str(node.val))
                queue.append(node.left)
                queue.append(node.right)
            else:
                res.append('null')
        return '[' + ','.join(res) + ']'


    def deserialize(self, data):
        """Decodes your encoded data to tree.
        
        :type data: str
        :rtype: TreeNode
        """
        if data == '[]':
            return
        vals, i = data[1:-1].split(','), 1
        root = TreeNode(int(vals[0]))
        queue = collections.deque()
        queue.append(root)
        while queue:
            node = queue.popleft()
            if vals[i] != 'null':
                node.left = TreeNode(int(vals[i]))
                queue.append(node.left)
            i += 1
            if vals[i] != 'null':
                node.right = TreeNode(int(vals[i]))
                queue.append(node.right)
            i += 1
        return root

# Your Codec object will be instantiated and called as such:
# codec = Codec()
# codec.deserialize(codec.serialize(root))
```
