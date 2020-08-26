---
title: 剑指Offer-09-用两个栈实现队列
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-08-26 14:59:35
categories:
    - Algorithm  
    - 剑指Offer  
    - 09
tags: [Algorithm, Offer, 栈, 队列]
---

# 题目
---
## 题目描述
> **用两个栈实现一个队列**。队列的声明如下，请实现它的两个函数 `appendTail` 和 `deleteHead` ，分别完成在队列尾部插入整数和在队列头部删除整数的功能。(若队列中没有元素，`deleteHead` 操作返回 `-1` ).
<!-- more -->

## 示例1
> **输入**：  
> ["CQueue","appendTail","deleteHead","deleteHead"]  
> [[],[3],[],[]]  
> **输出**：[null,null,3,-1]

## 示例2
> **输入**：  
> ["CQueue","deleteHead","appendTail","appendTail","deleteHead","deleteHead"]  
> [[],[],[5],[2],[],[]]  
> **输出**：[null,-1,null,null,5,2]

# 题解
---
## 双栈分别正序和逆序
> **栈**：后入先出；**队列**：先入先出。  
> **栈1**：正序（后入先出）；**栈2**：栈1的逆序。  
> **实现逆序**：循环执行将栈1的元素出栈，并将其入栈至栈2，直到栈1为空。即 `stack2.append(stack1.pop())` 。  
> **appendTail()**：直接将元素 `入栈至栈1` 。  
> **deleteHead()**：1. 栈2不为空， `return stack2.pop()` ；2. 栈1为空， `return -1` ；3. 将栈1逆序输出到栈2， `return stack2.pop()` 。  
> **时间复杂度**： `appendTail()` 为O(1)； `deleteTail()` 为O(n)，先遍历输出逆序。  
> **空间复杂度**：O(n)，栈1和栈2共保存n个元素。

```python
class CQueue:

    def __init__(self):
        self.stack1, self.stack2 = [], []

    def appendTail(self, value: int) -> None:
        self.stack1.append(value)

    def deleteHead(self) -> int:
        if self.stack2:
            return self.stack2.pop()
        if not self.stack1:
            return -1
        while self.stack1:
            self.stack2.append(self.stack1.pop())
        return self.stack2.pop()


# Your CQueue object will be instantiated and called as such:
# obj = CQueue()
# obj.appendTail(value)
# param_2 = obj.deleteHead()
```
