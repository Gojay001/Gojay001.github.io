---
title: 剑指Offer-33-二叉搜索树的后序遍历序列
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-10-20 20:42:34
categories:
    - Algorithm  
    - 剑指Offer  
    - 33
tags: [Algorithm, Offer, 递归, 栈]
---

# 题目
---
## 题目描述
输入一个整数数组，判断该数组是不是某二叉搜索树的后序遍历结果。如果是则返回 true，否则返回 false。假设输入的数组的任意两个数字都互不相同。
<!-- more -->

> **给定二叉树**: 

```
     5
    / \
   2   6
  / \
 1   3
```

## 示例1
> **输入**: [1,6,3,2,5]  
> **输出**: false

## 示例2
> **输入**: [1,3,2,6,5]  
> **输出**: true

# 题解
---
- **后序遍历**: [左子树，右子树，根节点];
- **二叉搜索树**: 左子树节点值<根节点值，右子树节点值>根节点值，左右子树也为二叉搜索树；

## 递归
> 最后一个元素为根节点，**通过根节点分割左右子树**，递归判断左右子树是否为二叉搜索树。

将最后一个元素设为根节点，从左向右遍历列表:
- **左子树**: 左子树元素<根节点元素，当前元素>根节点时 `结束`;  
- **右子树**: 右子树元素>根节点元素，当前元素<根节点时 `return False`;  
- **递归**: 左右子树作为新列表分别递归判断。

**终止条件**: 当列表长度<=1时，说明判断未出错，即该列表为二叉搜索树。

> **时间复杂度**：O($n^2$)，最差情况，即树退化为链表，每次去掉根节点，需要n次，每轮需遍历所有节点，占用O(n)；  
> **空间复杂度**：O(n)，递归占用辅助空间O(n)。

```python
class Solution:
    def verifyPostorder(self, postorder: List[int]) -> bool:
        def recur(nums):
            if len(nums) <= 1:
                return True
            root = nums[-1]
            for left in range(len(nums)):
                if nums[left] > root:
                    break
            for right in range(left, len(nums)):
                if nums[right] < root:
                    return False
            return recur(nums[:left]) and recur(nums[left:-1])

        if not postorder:
            return True
        return recur(postorder)
```

## 单调栈
([引用Krahets](https://leetcode-cn.com/problems/er-cha-sou-suo-shu-de-hou-xu-bian-li-xu-lie-lcof/solution/mian-shi-ti-33-er-cha-sou-suo-shu-de-hou-xu-bian-6/))
> 设 **根节点的值为无穷大**，右子树为空，而左子树为题目给定的树，这样一来仍然是二叉搜索树。

初始化: 根节点$root=+\infty$;  
倒序遍历列表: 
- **判断**: 若当前元素>root，不满足定义，return False;  
- **更新**: 当遇到值递减的节点，循环执行出栈，并将其节点赋值给root;  
- **入栈**: 将当前节点入栈。

> **时间复杂度**：O(n)，每个节点都会经历一次入栈出栈操作；  
> **空间复杂度**：O(n)，最差情况，单调栈存储所有节点。

```python
class Solution:
    def verifyPostorder(self, postorder: [int]) -> bool:
        stack, root = [], float("+inf")
        for i in range(len(postorder)-1, -1, -1):
            if postorder[i] > root: 
                return False
            while(stack and postorder[i] < stack[-1]):
                root = stack.pop()
            stack.append(postorder[i])
        return True
```
