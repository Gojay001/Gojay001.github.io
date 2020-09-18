---
title: 剑指Offer-19-正则表达式匹配
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-09-14 22:17:01
categories:
    - Algorithm  
    - 剑指Offer  
    - 19
tags: [Algorithm, Offer, 递归, 动态规划, 字符串]
---

# 题目
---
## 题目描述
请实现一个函数用来匹配包含`'.'`和`'*'`的正则表达式。模式中的字符'.'表示任意一个字符，而`'*'`表示它前面的字符可以出现任意次（含0次）。在本题中，匹配是指字符串的所有字符匹配整个模式。例如，字符串"aaa"与模式`"a.a"`和`"ab*ac*a"`匹配，但与`"aa.a"`和`"ab*a"`均不匹配。
<!-- more -->

## 示例1
> **输入**：s = "aa", p = "a"  
> **输出**：false  
> **解释**："a" 无法匹配 "aa" 整个字符串。

## 示例2
> **输入**：s = "aa", p = "a\*"  
> **输出**：true  
> **解释**：因为 '\*' 代表可以匹配零个或多个前面的那一个元素, 在这里前面的元素就是 'a'。因此，字符串 "aa" 可被视为 'a' 重复了一次。

## 示例3
> **输入**：s = "ab", p = ".\*"  
> **输出**：true  
> **解释**：".\*" 表示可匹配零个或多个（'\*'）任意字符（'.'）。

## 示例4
> **输入**：s = "aab", p = "c\*a\*b"  
> **输出**：true  
> **解释**：因为 '*' 表示零个或多个，这里 'c' 为 0 个, 'a' 被重复一次。因此可以匹配字符串 "aab"。

## 示例5
> **输入**：s = "mississippi", p = "mis\*is\*p\*."  
> **输出**：false

# 题解
---
## re库函数
> python3调用`re正则模块`。

```python
class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        return (re.fullmatch(p, s)) != None
```

## 递归
([引用WEAllen](https://leetcode-cn.com/problems/zheng-ze-biao-da-shi-pi-pei-lcof/solution/mian-shi-ti-19-zheng-ze-biao-da-shi-pi-pei-by-wral/))
> 核心思路：遇到 `x*` 的情况其实只有2种，只需分别处理这两种情况。

- **当x不匹配时**：抛弃掉整个 x*；
- **当x匹配时**：要么抵消掉一个s，x\* 保留；要么整个 x\* 抛弃掉。

```python
class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        if not p: 
            return not s
        first_match = bool(s) and p[0] in (".", s[0])
        if len(p) >= 2 and p[1] == "*":
            if first_match:
                return self.isMatch(s[1:], p) or self.isMatch(s, p[2:])
            else:
            return self.isMatch(s, p[2:])   
        return first_match and self.isMatch(s[1:], p[1:])
```

## 动态规划
(引用[superkakayong](https://leetcode-cn.com/problems/zheng-ze-biao-da-shi-pi-pei-lcof/solution/zi-jie-ti-ku-jian-19-kun-nan-zheng-ze-biao-da-shi-/),[loick](https://leetcode-cn.com/problems/zheng-ze-biao-da-shi-pi-pei-lcof/solution/dong-tai-gui-hua-er-wei-shu-zu-by-loick/))
> 当 `'x*'` 出现时，选择抛弃或保留。

- **状态定义**：dp为二维数组，dp[i][j]表示`s的前i个`字符和`p的前j个`字符是否匹配。
- **初始状态**：`dp[0][0] = True`，两个空字符是匹配的。
- **转移方程1**：`i == 0`时，表示以空字符串去匹配p的前j个字符，仅当p的字符为 'x*' 时为True。
- **转移方程2**：当`p的当前j字符为'.'`或者与s的当前i字符相同时，只需看dp[i-1][j-1]是否匹配。
- **转移方程3**：当`p的当前j字符为'*'`时，1)p的前一个字符x与s的当前i字符不匹配，且x不为'.'，则抛弃掉p中的 'x\*'，只需看dp[i][j-2]是否匹配；2)否则，保留 'x\*'，当dp[i][j-2]，dp[i][j-1]，dp[i-1][j]任一满足时为True。

> **时间复杂度**：O(mn)，计算二维数组dp[m][n]；  
> **空间复杂度**：O(mn)，保存二维数组dp[m][n]。

```python
class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        m, n = len(s)+1, len(p)+1
        dp = [[False]*n for _ in range(m)]
        dp[0][0] = True
        
        for i in range(1, n):
            if p[i-1] == '*' and dp[0][i-2] == True:
                dp[0][i] = True
        
        for i in range(1, m):
            for j in range(1, n):
                if p[j-1] == s[i-1] or p[j-1] == '.':
                    dp[i][j] = dp[i-1][j-1]
                elif p[j-1] == '*':
                    if p[j-2] != s[i-1] and p[j-2] != '.':
                        dp[i][j] = dp[i][j-2]
                    else:
                        dp[i][j] = dp[i][j-2] or dp[i][j-1] or dp[i-1][j]
                else:
                    dp[i][j] == False
        return dp[-1][-1]
```
