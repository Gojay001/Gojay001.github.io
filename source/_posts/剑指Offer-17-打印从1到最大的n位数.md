---
title: 剑指Offer-17-打印从1到最大的n位数
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-09-11 10:36:11
categories:
    - Algorithm  
    - 剑指Offer  
    - 17
tags: [Algorithm, Offer, 字符串, DFS, 递归]
---

# 题目
---
## 题目描述
输入数字 n，按顺序打印出 **从 1 到最大的 n 位十进制数**。比如输入 3，则打印出 1、2、3 一直到最大的 3 位数 999。
<!-- more -->

## 示例1
> **输入**：n = 1  
> **输出**：[1,2,3,4,5,6,7,8,9]  

说明：  
- 用返回一个整数列表来代替打印
- n 为正整数

# 题解
---
## 直接输出
> start=1, end=$10^n - 1$。

> **时间复杂度**：O($10^n$)，生成长度为$10^n$的列表；  
> **空间复杂度**：O(1)

```python
class Solution:
    def printNumbers(self, n: int) -> List[int]:
        res = []
        for i in range(1, 10 ** n):
            res.append(i)
        return res
```

利用Python特性，`range()`可生成所需序列，`list()`将序列转为列表返回。

```python
class Solution:
    def printNumbers(self, n: int) -> List[int]:
        return list(range(1, 10 ** n))
```

## 大数打印
([引用Krahets](https://leetcode-cn.com/problems/da-yin-cong-1dao-zui-da-de-nwei-shu-lcof/solution/mian-shi-ti-17-da-yin-cong-1-dao-zui-da-de-n-wei-2/))
> **DFS**生成全排列：`先固定高位，递归搜索所有低位数字`，当个位数字被固定时，则添加数字的字符串。

[例]：当n=2时，即数字范围为1-99，先固定十位0-9，按顺序依次递归搜索；固定个位0-9时，终止递归并产生数字的字符串。  
> 根据上述方法，可初步编写全排列代码：

```python
class Solution:
    def printNumbers(self, n: int) -> [int]:
        def dfs(x):
            if x == n: # 终止条件：已固定完所有位
                res.append(''.join(num)) # 拼接 num 并添加至 res 尾部
                return
            for i in range(10): # 遍历 0 - 9
                num[x] = str(i) # 固定第 x 位为 i
                dfs(x + 1) # 开启固定第 x + 1 位
        
        num = ['0'] * n # 起始数字定义为 n 个 0 组成的字符列表
        res = [] # 数字字符串列表
        dfs(0) # 开启全排列递归
        return ','.join(res)  # 拼接所有数字字符串，使用逗号隔开，并返回
```
 
在此方法下，各数字字符串被逗号隔开，共同组成长字符串。返回的数字集字符串如下所示：  
```
输入：n = 1
输出："0,1,2,3,4,5,6,7,8,9"

输入：n = 2
输出："00,01,02,...,10,11,12,...,97,98,99"

输入：n = 3
输出："000,001,002,...,100,101,102,...,997,998,999"
```

观察可知，当前的生成方法仍有以下`问题`：1)数字前有多余0; 2)从0开始生成列表。  
`解决`方法如下：  
- **删除高位多余的0**: 1）`定义字符串左边界`，以保证添加的数字字符串 num[start:] 中无高位多余的0; 2)`更新左边界start`，当输出数字是9时，则下个数字需要进位，此时左边界 start 需要减1，即高位多余的0减少一个。
- **列表从1开始**: 在以上方法基础上，只需在添加数字字符串前判断其是否为 "0"。

> **时间复杂度**：O($10^n$)  
> **空间复杂度**：O($10^n$)，递归占用O(logn)额外空间。

```python
class Solution:
    def printNumbers(self, n: int) -> [int]:
        def dfs(x):
            if x == n:
                s = ''.join(num[self.start:])
                if s != '0': 
                    res.append(int(s))
                if n - self.start == self.count_nine: 
                    self.start -= 1
                return
            for i in range(10):
                if i == 9: 
                    self.count_nine += 1
                num[x] = str(i)
                dfs(x + 1)
            self.count_nine -= 1
        
        num, res = ['0'] * n, []
        self.count_nine = 0
        self.start = n - 1
        dfs(0)
        return res
```
