---
title: 剑指Offer-24-反转链表
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-09-20 21:38:09
categories:
    - Algorithm  
    - 剑指Offer  
    - 24
tags: [Algorithm, Offer, 递归, 链表, 指针]
---

# 题目
---
## 题目描述
定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。
<!-- more -->

## 示例
> **输入**: 1->2->3->4->5->NULL  
> **输出**: 5->4->3->2->1->NULL

# 题解
---
## 递归
> 遍历整个链表，从最后结点开始，**每次将结点指向反向**，然后递归返回。

- **将两个结点反向**: head.next.next = head; head.next = None;
[例]`4->5->None`: 1)4->5,5->4; 2)5->4->None;

> **时间复杂度**：O(n)，遍历链表；  
> **空间复杂度**：O(n)，递归占用额外空间。

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        if not head or not head.next:
            return head
        node = self.reverseList(head.next)
        head.next.next = head
        head.next = None
        return node
```

##  多指针
> 遍历整个链表，pre指向已反向链表，cur指向当前结点，next指向下个结点，每次 **将当前结点指向pre已反向链表，并把cur指向下个结点**。

- **结点反向**: cur.next = pre;
- **指针更新**: next = cur.next; pre = cur; cur = next;
[例]`1->2->3->None`: 1)None<-1,2->3->None; 2)None<-1<-2,3->None; 3)None<-1<-2<-3;

> **时间复杂度**：O(n)，遍历链表；  
> **空间复杂度**：O(1)，三个指针占用常数大小空间。

```python
class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        pre, cur = None, head
        while cur:
            next = cur.next
            cur.next = pre
            pre, cur = cur, next
        return pre
```
