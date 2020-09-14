---
title: 剑指Offer-18-删除链表的节点
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-09-14 10:46:16
categories:
    - Algorithm  
    - 剑指Offer  
    - 18
tags: [Algorithm, Offer, 链表, 递归]
---

# 题目
---
## 题目描述
给定单向链表的头指针和一个要删除的节点的值，定义一个函数 **删除该节点**。  
返回删除后的链表的头节点。
<!-- more -->

## 示例1
> **输入**：head = [4,5,1,9], val = 5  
> **输出**：[4,1,9]  
> **解释**：给定你链表中值为 5 的第二个节点，那么在调用了你的函数之后，该链表应变为 4 -> 1 -> 9.

## 示例1
> **输入**：head = [4,5,1,9], val = 1  
> **输出**：[4,5,9]  
> **解释**：给定你链表中值为 1 的第三个节点，那么在调用了你的函数之后，该链表应变为 4 -> 5 -> 9.

# 题解
---
## 递归
> 判断 **下个结点的值是否为目标值**，若不是则将下个结点设为头节点，递归搜索。

- **特例**：头节点的值为目标值，则将下个结点设为头节点，return;
- **找到目标结点**：删除目标结点，return;
- **未找到目标结点**：将下个结点作为头节点，递归搜索目标。

> **时间复杂度**：O(n)，遍历整个链表；  
> **空间复杂度**：O(n)，递归占用辅助空间大小。

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None
class Solution:
    def deleteNode(self, head: ListNode, val: int) -> ListNode:
        if head.val == val:
            head = head.next
        elif head.next.val == val:
            head.next = head.next.next
        else:
            self.deleteNode(head.next, val)
        return head
```

## 单指针
> **单指针遍历链表**，循环搜索下个结点是否为目标结点，满足则return。

- **特例**：头节点的值为目标值，则将下个结点设为头节点，return;
- **找到目标结点**：删除目标结点，return;
- **未找到目标结点**：将下个结点作为头节点，遍历搜索链表。

> **时间复杂度**：O(n)  
> **空间复杂度**：O(1)

```python
class Solution:
    def deleteNode(self, head: ListNode, val: int) -> ListNode:
        cur = head
        if cur.val == val:
            return cur.next
        while cur.next:
            if cur.next.val == val:
                cur.next = cur.next.next
                return head
            else:
                cur = cur.next
```
