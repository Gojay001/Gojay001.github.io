---
title: 剑指Offer-25-合并两个排序的链表
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-09-21 15:29:26
categories:
    - Algorithm  
    - 剑指Offer  
    - 25
tags: [Algorithm, Offer, 递归, 链表, 指针]
---

# 题目
---
## 题目描述
输入两个递增排序的链表，合并这两个链表并使新链表中的节点仍然是递增排序的。
<!-- more -->

## 示例
> **输入**: 1->2->4, 1->3->4  
> **输出**: 1->1->2->3->4->4

# 题解
---
## 递归
> 遍历整个链表， **每次选出最小结点作为l1结点**，并将l1下个结点进行递归返回。

> **时间复杂度**：O(m+n)，遍历链表；  
> **空间复杂度**：O(m+n)，递归占用额外空间。

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def mergeTwoLists(self, l1: ListNode, l2: ListNode) -> ListNode:
        if not l1:
            return l2
        elif not l2:
            return l1
        else:
            (l1, l2) = (l2, l1) if l2.val < l1.val else (l1, l2)
            l1.next = self.mergeTwoLists(l1.next, l2)
        return l1
```

## 伪结点
> **用两个指针指向伪结点，cur指针用于遍历最小数值结点加入新链表**，最终返回dummy指向的结点，即为已拍好序的新链表（指向结点仍为原链表结点）。

- **指针更新**: 如果l1比l2头节点的值小，则`cur指向l1，l1头节点后移`；反之l2同理；然后`cur指针后移`，进行下一次迭代。
- **后处理**: 如果l1链表仍有结点，则cur指针指向l1；反之指向l2。

> **时间复杂度**：O(m+n)，遍历l1和l2链表；  
> **空间复杂度**：O(1)，cur,dummy指针占用常数大小空间。

```python
class Solution:
    def mergeTwoLists(self, l1: ListNode, l2: ListNode) -> ListNode:
        cur = dummy = ListNode(0)
        while l1 and l2:
            if l1.val <= l2.val:
                cur.next, l1 = l1, l1.next
            else:
                cur.next, l2 = l2, l2.next
            cur = cur.next
        cur.next = l1 if l1 else l2
        return dummy.next
```
