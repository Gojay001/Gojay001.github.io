---
title: 剑指Offer-31-栈的压入、弹出序列
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-10-16 14:52:51
categories:
    - Algorithm  
    - 剑指Offer  
    - 31
tags: [Algorithm, Offer, 栈]
---

# 题目
---
## 题目描述
输入两个整数序列，**第一个序列表示栈的压入顺序，请判断第二个序列是否为该栈的弹出顺序**。假设压入栈的所有数字均不相等。例如，序列 {1,2,3,4,5} 是某栈的压栈序列，序列 {4,5,3,2,1} 是该压栈序列对应的一个弹出序列，但 {4,3,5,1,2} 就不可能是该压栈序列的弹出序列。
<!-- more -->

## 示例1
> **输入**: pushed = [1,2,3,4,5], popped = [4,5,3,2,1]  
> **输出**: true  
> **解释**: 我们可以按以下顺序执行：  
> push(1), push(2), push(3), push(4), pop() -> 4,  
> push(5), pop() -> 5, pop() -> 3, pop() -> 2, pop() -> 1

## 示例2
> **输入**: pushed = [1,2,3,4,5], popped = [4,3,5,1,2]  
> **输出**: false  
> **解释**: 1 不能在 2 之前弹出。

# 题解
---
## 辅助栈
> 借用一个 **辅助栈，模拟压入/弹出操作** 的排列，根据是否模拟成功，即可得到结果。

- **入栈操作**: 按照压栈序列的顺序执行;
- **出栈操作**: 每次入栈后，循环判断 `“栈顶元素 == 弹出序列的当前元素”` 是否成立，将符合弹出序列顺序的栈顶元素全部弹出。

> **时间复杂度**：O(n)，每个元素最多入栈与出栈一次，即2n次出入栈操作；  
> **空间复杂度**：O(n)，辅助栈最多存储n个元素。

```python
class Solution:
    def validateStackSequences(self, pushed: List[int], popped: List[int]) -> bool:
        stack, i = [], 0
        for num in pushed:
            stack.append(num)
            while stack and stack[-1] == popped[i]:
                stack.pop()
                i += 1
        return not stack
```

## 原地辅助栈
> **将压栈序列pushed作为辅助栈**，指针i,j分别指向pushed栈顶及poped首位元素。 

- 将pushed作为辅助栈，入栈出栈操作转为对指针操作。

> **时间复杂度**：O(n)，每个元素最多入栈与出栈一次，即2n次出入栈操作；  
> **空间复杂度**：O(1)，pushed作为辅助栈，指针i,j只需常数额外空间。

```python
class Solution:
    def validateStackSequences(self, pushed: List[int], popped: List[int]) -> bool:
        i, j = 0, 0
        for num in pushed:
            pushed[i] = num
            while i >= 0 and pushed[i] == popped[j]:
                j += 1
                i -= 1
            i += 1
        return i == 0
```
