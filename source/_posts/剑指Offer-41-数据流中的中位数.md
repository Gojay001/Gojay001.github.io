---
title: 剑指Offer-41-数据流中的中位数
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-11-14 22:34:18
categories:
    - Algorithm  
    - 剑指Offer  
    - 41
tags: [Algorithm, Offer, 堆]
---

# 题目
---
## 题目描述
如何得到一个数据流中的中位数？如果从数据流中读出奇数个数值，那么中位数就是所有数值排序之后位于中间的数值。如果从数据流中读出偶数个数值，那么中位数就是所有数值排序之后中间两个数的平均值。
<!-- more -->

例如，

[2,3,4] 的中位数是 3

[2,3] 的中位数是 (2 + 3) / 2 = 2.5

设计一个支持以下两种操作的数据结构：  
- void addNum(int num) - 从数据流中添加一个整数到数据结构中。
- double findMedian() - 返回目前所有元素的中位数。

## 示例1
> **输入**:  
> ["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]  
> [[],[1],[2],[],[3],[]]  
> **输出**: [null,null,null,1.50000,null,2.00000]

## 示例2
> **输入**:  
> ["MedianFinder","addNum","findMedian","addNum","findMedian"]  
> [[],[2],[],[3],[]]   
> **输出**: [null,null,2.00000,null,2.50000]

# 题解
---
## 堆
> 维护同样大小的 **小顶堆和大顶堆**，分别存放较大和较小的一半元素，根据两个堆顶元素得到数据流的中位数。

新元素进堆（允许大值堆/小顶堆比小值堆/大顶堆元素个数多1）:  
- 当 **大值堆不等于小值堆** 元素个数时: 即大值堆个数多一个，上一轮中位数为大值堆堆顶元素，则将`新元素插入大值堆`，再将`大值堆堆顶元素弹出并插入到小值堆`，此时大值堆与小值堆元素个数相等，由两个堆顶元素共同确定中位数;  
- 当 **大值堆等于小值堆** 元素个数时: 将`新元素插入小值堆`，再将`小值堆堆顶元素弹出插入到大值堆`，此时大值堆元素个数多1，堆顶元素为中位数;

> **时间复杂度**: O(logn)，堆的插入和弹出均为O(logn);  
> **空间复杂度**: O(n)，大值堆和小值堆共占用额外空间O(n);

```python
class MedianFinder:

    def __init__(self):
        """
        initialize your data structure here.
        """
        self.max_heap, self.min_heap = [], []

    def addNum(self, num: int) -> None:
        if len(self.max_heap) != len(self.min_heap):
            heappush(self.max_heap, num)
            heappush(self.min_heap, -heappop(self.max_heap))
        else:
            heappush(self.min_heap, -num)
            heappush(self.max_heap, -heappop(self.min_heap))

    def findMedian(self) -> float:
        return self.max_heap[0] if len(self.max_heap) != len(self.min_heap) else (self.max_heap[0]-self.min_heap[0]) / 2.0


# Your MedianFinder object will be instantiated and called as such:
# obj = MedianFinder()
# obj.addNum(num)
# param_2 = obj.findMedian()
```
> Python 中 `heapq` 模块是小顶堆。实现 **大顶堆** 方法： 小顶堆的插入和弹出操作均将元素 **取反（负数）** 即可。