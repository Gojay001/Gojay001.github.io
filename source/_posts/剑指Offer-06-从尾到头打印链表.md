---
title: 剑指Offer-06-从尾到头打印链表
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-08-24 15:09:34
categories:
    - Algorithm  
    - 剑指Offer  
    - 06
tags: [Algorithm, Offer, 链表, 递归, 栈]
---

# 题目
---
## 题目描述
> 输入一个链表的头节点， `从尾到头反过来返回每个节点的值` （用数组返回）。
<!-- more -->

## 示例
> **输入**：head = [1,3,2]  
> **输出**：[2,3,1]  

# 题解
---
## 递归解法
> 先走到链表末端，回溯时依次将节点元素加入列表。  
> **递推**：每次传入 `head.next` ，以 `head == None` 为终止条件，此时返回空列表 `[]` 。  
> **回溯**：每次返回 `当前list + 当前节点元素[head.val]` 。  
> **时间复杂度**：O(n)，遍历链表，递归n次。  
> **空间复杂度**：O(n)，递归使用O(n)空间。  

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def reversePrint(self, head: ListNode) -> List[int]:
        if head is None:
            return []
        return self.reversePrint(head.next) + [head.val]
```

## 辅助栈
> 使用Python列表中的reverse方法： `list.reverse()` 或 `list[::-1]` ，反向列表中元素。  
> 遍历链表，依次将节点元素 `push入栈` （使用append方法实现）；然后将节点元素 `pop出栈` （反向）。  
> **时间复杂度**：O(n)  
> **空间复杂度**：O(n)  

```python
class Solution:
    def reversePrint(self, head: ListNode) -> List[int]:
        stack = []
        while head:
            stack.append(head.val)
            head = head.next
        return stack[::-1]
```

