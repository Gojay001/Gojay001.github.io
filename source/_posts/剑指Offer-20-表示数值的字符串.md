---
title: 剑指Offer-20-表示数值的字符串
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-09-18 15:45:50
categories:
    - Algorithm  
    - 剑指Offer  
    - 20
tags: [Algorithm, Offer, 字符串, 有限状态自动机]
---

# 题目
---
## 题目描述
请实现一个函数用来判断字符串是否表示数值（包括整数和小数）。例如，字符串"+100"、"5e2"、"-123"、"3.1416"、"-1E-16"、"0123"都表示数值，但"12e"、"1a3.14"、"1.2.3"、"+-5"及"12e+5.4"都不是。
<!-- more -->

# 题解
---
## 直接转换
> python3调用try-catch，成功转化则return True。

```python
class Solution:
    def isNumber(self, s: str) -> bool:
        try:
            float(s)
            return True
        except ValueError:
            return False
```

## 有限状态自动机
([引用Krahets](https://leetcode-cn.com/problems/biao-shi-shu-zhi-de-zi-fu-chuan-lcof/solution/mian-shi-ti-20-biao-shi-shu-zhi-de-zi-fu-chuan-y-2/))
> 根据字符类型和合法数值的特点，**先定义状态，再画出状态转移图**。

### 字符类型
空格 「 」、数字「 0—9 」 、正负号 「 +- 」 、小数点 「 . 」 、幂符号 「 eE 」 。

### 状态定义
![剑指Offer-20.png](https://i.loli.net/2020/09/18/GmTFDwJnUR4iaxe.png)
合法的结束状态有 2, 3, 7, 8 。

- **状态转移表states**：设`states[i]`，其中i为所处状态，states[i]使用哈希表存储可转移至的状态；
- **当前状态p**：状态初始化为 `p = 0`；
- **状态转移循环**：遍历字符串s的每个字符c。 1)记录字符类型t; 2)若字符类型t不在哈希表states[p]中，说明无法转移至下一状态,直接return False; 3)状态p转移至states[p][t]；
- **返回值**：跳出循环后，2,3,7,8为合法结束状态。

> **时间复杂度**：O(n)，遍历字符串；  
> **空间复杂度**：O(1)，states和p占用常数大小的额外空间。

```python
class Solution:
    def isNumber(self, s: str) -> bool:
        states = [
            { ' ': 0, 's': 1, 'd': 2, '.': 4 }, # 0. start with 'blank'
            { 'd': 2, '.': 4 } ,                # 1. 'sign' before 'e'
            { 'd': 2, '.': 3, 'e': 5, ' ': 8 }, # 2. 'digit' before 'dot'
            { 'd': 3, 'e': 5, ' ': 8 },         # 3. 'digit' after 'dot'
            { 'd': 3 },                         # 4. 'digit' after 'dot' (‘blank’ before 'dot')
            { 's': 6, 'd': 7 },                 # 5. 'e'
            { 'd': 7 },                         # 6. 'sign' after 'e'
            { 'd': 7, ' ': 8 },                 # 7. 'digit' after 'e'
            { ' ': 8 }                          # 8. end with 'blank'
        ]
        p = 0                           # start with state 0
        for c in s:
            if '0' <= c <= '9': 
                t = 'd' # digit
            elif c in "+-": 
                t = 's'     # sign
            elif c in "eE": 
                t = 'e'     # e or E
            elif c in ". ": 
                t = "."       # dot, blank
            else: 
                t = '?'               # unknown
            if t not in states[p]: 
                return False
            p = states[p][t]
        return p in (2, 3, 7, 8)
```
