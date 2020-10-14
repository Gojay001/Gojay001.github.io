---
title: 剑指Offer-30-包含min函数的栈
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-10-14 15:34:20
categories:
    - Algorithm  
    - 剑指Offer  
    - 30
tags: [Algorithm, Offer, 栈]
---

# 题目
---
## 题目描述
定义栈的数据结构，请在该类型中实现一个能够得到栈的最小元素的 min 函数在该栈中，调用 min、push 及 pop 的时间复杂度都是 O(1)。
<!-- more -->

## 示例
> MinStack minStack = new MinStack();  
> minStack.push(-2);  
> minStack.push(0);  
> minStack.push(-3);  
> minStack.min();   --> 返回 -3.  
> minStack.pop();  
> minStack.top();      --> 返回 0.  
> minStack.min();   --> 返回 -2.

# 题解
---
## 辅助栈
> **利用辅助栈存储当前最小元素**，每当push新的最小值或pop当前最小值时更新辅助栈。 

- **主栈stack**: 存储所有元素，实现 `push()`, `pop()`, `top()` 函数;
- **辅助栈stack_min**: 存储stack非严格降序元素，栈顶元素为stack中当前最小元素，实现 `min()` 函数。

> **时间复杂度**：O(n)，遍历二叉树；  
> **空间复杂度**：O(n)，递归占用额外空间。

```python
class MinStack:

    def __init__(self):
        """
        initialize your data structure here.
        """
        self.stack, self.stack_min = [], []

    def push(self, x: int) -> None:
        self.stack.append(x)
        if not self.stack_min or x <= self.stack_min[-1]:
            self.stack_min.append(x)

    def pop(self) -> None:
        if self.stack.pop() == self.stack_min[-1]:
            self.stack_min.pop()

    def top(self) -> int:
        return self.stack[-1]

    def min(self) -> int:
        return self.stack_min[-1]


# Your MinStack object will be instantiated and called as such:
# obj = MinStack()
# obj.push(x)
# obj.pop()
# param_3 = obj.top()
# param_4 = obj.min()
```
