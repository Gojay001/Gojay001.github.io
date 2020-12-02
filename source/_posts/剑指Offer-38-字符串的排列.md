---
title: 剑指Offer-38-字符串的排列
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-11-02 23:32:56
categories:
    - Algorithm  
    - 剑指Offer  
    - 38
tags: [Algorithm, Offer, DFS, 递归]
---

# 题目
---
## 题目描述
输入一个字符串，打印出该字符串中字符的所有排列。  

你可以以任意顺序返回这个字符串数组，但里面不能有重复元素。
<!-- more -->

## 示例
> **输入**: s = "abc"  
> **输出**: ["abc","acb","bac","bca","cab","cba"]

# 题解
---
([引用Krahets](https://leetcode-cn.com/problems/zi-fu-chuan-de-pai-lie-lcof/solution/mian-shi-ti-38-zi-fu-chuan-de-pai-lie-hui-su-fa-by/))
## 回溯DFS
> 深度优先搜索，先固定高位，后固定低位。当字符重复时剪枝。

每个当前位置新建一个set，用于存储字符序列并去除重复字符。

> **时间复杂度**: O(n!)，共有 n*(n-1)*...*2*1 种方案;  
> **空间复杂度**: O($n^2$)，DFS递归深度为n，递归辅助set累计存储 $n+(n-1)+..+2+1=(n+1)n/2$，即占用O($n^2$)额外空间;

```python
class Solution:
    def permutation(self, s: str) -> List[str]:
        path, res = list(s), []

        def dfs(loc):
            if loc == len(path) - 1:
                res.append(''.join(path))  # 添加排列方案
                return
            exist = set()  # 存储从第loc位开始，已经出现过的字符
            for i in range(loc, len(path)):
                if path[i] in exist:  # 重复，剪枝
                    continue
                exist.add(path[i])
                path[i], path[loc] = path[loc], path[i]  # 交换，将path[i]固定在第loc位
                dfs(loc+1)  # 固定下一位字符
                path[i], path[loc] = path[loc], path[i]  # 恢复交换

        dfs(0)
        return res
```
