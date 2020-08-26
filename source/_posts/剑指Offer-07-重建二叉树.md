---
title: 剑指Offer-07-重建二叉树
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-08-25 16:05:59
categories:
    - Algorithm  
    - 剑指Offer  
    - 07
tags: [Algorithm, Offer, 递归, 二叉树, HashMap]
---

# 题目
---
## 题目描述
> 输入某二叉树的 `前序遍历和中序遍历` 的结果，请 `重建该二叉树` 。假设输入的前序遍历和中序遍历的结果中都不含重复的数字。
<!-- more -->

## 示例
- **输入**： 
``` 
前序遍历 preorder = [3,9,20,15,7]  
中序遍历 inorder = [9,3,15,20,7]
```

- **输出**：返回如下二叉树
```
    3  
   / \  
  9  20  
    /  \  
   15   7
```

# 题解
---
## 原地递归
> **前序遍历**：根节点、左子树、右子树；**中序遍历**：左子树、根节点、右子树。  
> 已知前序遍历和中序遍历重建二叉树：
> - **递推**：前序遍历的第一个节点为 `根节点` ，找到其在中序遍历中的对应位置，在根节点左边为 `左子树` ，在根节点右边为 `右子树` 。将得到的左右子树作为新序列， `递归` 划分其左右子树。  
> - **终止**：前序或中序为空，即到达叶子节点，return None。  
> **时间复杂度**：O($n^2$)，以根节点遍历序列，每次递归左右子树。  
> **空间复杂度**：O(n)，递归使用O(n)空间。

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> TreeNode:
        if not preorder or not inorder:
            return None
        loc = inorder.index(preorder[0])
        root = TreeNode(preorder[0])
        root.left = self.buildTree(preorder[1 : loc+1], inorder[ : loc])
        root.right = self.buildTree(preorder[loc+1 : ], inorder[loc+1 : ])
        return root
```

## 哈希表递归
([引用Krahets](https://leetcode-cn.com/problems/zhong-jian-er-cha-shu-lcof/solution/mian-shi-ti-07-zhong-jian-er-cha-shu-di-gui-fa-qin/))
> 使用哈希表预存储 `中序遍历的值与索引` 的映射关系，每次搜索的时间复杂度为O(1)。  
> **方法参数**： `pre_root` ：前序根节点索引； `in_left` ：中序左边界； `in_right` ：中序右边界。
> **子树根节点索引**：左子树根节点为 `前序根节点+1` ；右子树根节点为 `前序根节点+1+左子树长度(中序根节点索引-左边界)` 。  
> **时间复杂度**：O(n)，初始化HashMap遍历inorder，占用O(n)；每层递归中的节点建立、搜索操作占用O(1)。  
> **空间复杂度**：O(n)，HashMap使用O(n)额外空间；递归操作中系统需使用O(n)额外空间。  

```python
class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> TreeNode:
        self.dic, self.preorder = {}, preorder
        for i in range(len(inorder)):
            self.dic[inorder[i]] = i
        return self.recur(0, 0, len(inorder)-1)

    def recur(self, pre_root, in_left, in_right):
        if in_left > in_right: 
            return
        root = TreeNode(self.preorder[pre_root])
        loc = self.dic[self.preorder[pre_root]]
        root.left = self.recur(pre_root+1, in_left, loc-1)
        root.right = self.recur(pre_root+1+loc-in_left, loc+1, in_right)
        return root
```

