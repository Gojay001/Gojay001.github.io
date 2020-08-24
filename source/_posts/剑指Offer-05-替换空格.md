---
title: 剑指Offer-05-替换空格
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-08-24 14:35:47
categories:
    - Algorithm  
    - 剑指Offer  
    - 05
tags: [Algorithm, Offer]
---

# 题目
---
## 题目描述
> 请实现一个函数，把 `字符串 s 中的每个空格替换成"%20"` 。
<!-- more -->

## 示例
> **输入**：s = "We are happy."  
> **输出**："We%20are%20happy."  

# 题解
---
## 新建字符串
> 在Python语言中， `字符串被设计成不可变类型` ，即无法直接修改字符串的某一位字符，需要 `新建一个字符串` 实现。  
> 初始化一个list； `遍历字符串s中每个字符c` ，若c为空格，则在list中添加"%20"；若c不为空格，则在list中添加字符c。  
> **时间复杂度**：O(n)，遍历O(n)，每轮添加O(1)。  
> **空间复杂度**：O(n)，新建list使用线性大小空间。  

```python
class Solution:
    def replaceSpace(self, s: str) -> str:
        res = []
        for c in s:
            if c == ' ': 
                res.append("%20")
            else: 
                res.append(c)
        return "".join(res)
```

## Python特性
> 使用Python字符串中的replace方法： `str.replace(old, new[, max])` ，将字符串中的 str1 替换成 str2,如果 max 指定，则替换不超过 max 次。  
> **时间复杂度**：O(n)  
> **空间复杂度**：O(n)  

```python
class Solution:
    def replaceSpace(self, s: str) -> str:
        return s.replace(" ", "%20");
```
