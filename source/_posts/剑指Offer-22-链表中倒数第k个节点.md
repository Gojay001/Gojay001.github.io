---
title: 剑指Offer-22-链表中倒数第k个节点
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-09-20 17:54:12
categories:
    - Algorithm  
    - 剑指Offer  
    - 22
tags: [Algorithm, Offer, 链表, 指针]
---

# 题目
---
## 题目描述
输入一个链表，输出该链表中倒数第k个节点。为了符合大多数人的习惯，本题从1开始计数，即链表的尾节点是倒数第1个节点。例如，一个链表有6个节点，从头节点开始，它们的值依次是1、2、3、4、5、6。这个链表的倒数第3个节点是值为4的节点。
<!-- more -->

## 示例
> 给定一个链表: **1->2->3->4->5**, 和 **k = 2**.  
> 返回链表 **4->5**.


# 题解
---
##  两次遍历
> **第一次遍历得到链表长度**，第二次遍历到倒数第k个结点返回。

> **时间复杂度**：O(n)，两次遍历链表，每次占用O(n)；  
> **空间复杂度**：O(1)，两次指针占用常数大小空间。

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def getKthFromEnd(self, head: ListNode, k: int) -> ListNode:
        first, cur, lens =head, head, 0
        while first:
            first = first.next
            lens += 1
        for i in range(lens-k):
            cur = cur.next
        return cur
```

## 快慢指针
> **快指针先走k步，然后快慢指针同时向后遍历**，当快指针走到链表尾部，则慢指针指向倒数第k个结点。

> **时间复杂度**：O(n)，遍历链表；  
> **空间复杂度**：O(1)，双指针占用常数大小空间。

```python
class Solution:
    def getKthFromEnd(self, head: ListNode, k: int) -> ListNode:
        fast, slow = head, head
        for _ in range(k):
            if not fast:
                return
            fast = fast.next
        while fast:
            fast, slow = fast.next, slow.next
        return slow
```
