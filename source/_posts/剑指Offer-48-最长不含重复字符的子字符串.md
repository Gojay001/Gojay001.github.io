---
title: 剑指Offer-48-最长不含重复字符的子字符串
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-12-15 11:28:49
categories:
    - Algorithm  
    - 剑指Offer  
    - 48
tags: [Algorithm, Offer, 滑动窗口]
---

# 题目
---
## 题目描述
请从字符串中找出一个最长的不包含重复字符的子字符串，计算该最长子字符串的长度。
<!-- more -->

## 示例1
> **输入**: "abcabcbb"  
> **输出**: 3  
> **解释**: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。

## 示例2
> **输入**: "bbbbb"  
> **输出**: 1  
> **解释**: 因为无重复字符的最长子串是 "b"，所以其长度为 1。

## 示例3
> **输入**: "pwwkew"  
> **输出**: 3  
> **解释**: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。  
> 请注意，你的答案必须是 `子串` 的长度，"pwke" 是一个子序列，不是子串。

# 题解
---
([引用腐烂的橘子](https://leetcode-cn.com/problems/zui-chang-bu-han-zhong-fu-zi-fu-de-zi-zi-fu-chuan-lcof/solution/tu-jie-hua-dong-chuang-kou-shuang-zhi-zhen-shi-xia/))
## 滑动窗口（双指针）
> 遍历字符串，用 **双指针标记当前滑动窗口**，滑动窗口包含当前元素时，`窗口右移`。  

遍历字符串，tail指针右移:  
- **窗口不包含当前元素**: 更新窗口最大长度;  
- **窗口包含当前元素**: head指针右移，直到窗口不包含当前元素;  

> **时间复杂度**: O($n^2$)，遍历字符串占用O(n)，窗口右移O(n);  
> **空间复杂度**: O(1)，变量占用常数大小的额外空间;

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        head, tail, res = 0, 0, 1
        if len(s) < 2:
            return len(s)
        while tail < len(s) - 1:
            tail += 1
            if s[tail] not in s[head:tail]:
                res = max(tail - head + 1, res)
            else:
                while s[tail] in s[head:tail]:
                    head += 1
        return res
```

## 优化滑动窗口（哈希表）
> 使用 **哈希表记录每个字符的下一个索引**，然后尽量向右移动尾指针来拓展窗口，并更新窗口的最大长度。如果尾指针指向的元素重复，则将 **头指针直接移动到窗口中重复元素的右侧**。

遍历字符串，tail指针右移:  
- **若当前元素存在哈希表中**: `head指针`跳跃到重复字符的下一位;  
- **更新** 哈希表和窗口长度;

> **时间复杂度**: O(n)，遍历字符串;  
> **空间复杂度**: O(n)，哈希表占用O(n)额外空间;

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        head, res = 0, 0
        hashmap = {}
        for tail in range(len(s)):
            if s[tail] in hashmap:
                head = max(hashmap[s[tail]], head)
            hashmap[s[tail]] = tail + 1
            res = max(tail - head + 1, res)
        return res
```