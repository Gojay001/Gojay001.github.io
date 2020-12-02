---
title: 剑指Offer-40-最小的k个数
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-11-09 22:51:41
categories:
    - Algorithm  
    - 剑指Offer  
    - 40
tags: [Algorithm, Offer, topk, 排序]
---

# 题目
---
## 题目描述
输入整数数组 `arr` ，找出其中最小的 `k` 个数。例如，输入4、5、1、6、2、7、3、8这8个数字，则最小的4个数字是1、2、3、4。
<!-- more -->

## 示例1
> **输入**: arr = [3,2,1], k = 2  
> **输出**: [1,2] 或者 [2,1]

## 示例2
> **输入**: arr = [0,1,2,1], k = 1  
> **输出**: [0]

# 题解
---
## Python函数
> topk: 将数组排序，选取前k个值。

> **时间复杂度**: O(nlogn)，排序时间复杂度为O(nlogn);  
> **空间复杂度**: O(1);

```python
class Solution:
    def getLeastNumbers(self, arr: List[int], k: int) -> List[int]:
        return heapq.nsmallest(k, arr)
```

```python
class Solution:
    def getLeastNumbers(self, arr: List[int], k: int) -> List[int]:
        arr.sort()
        return arr[:k]
```

## 堆排序
> **维护一个大小为k的大顶堆**，将第k+1个元素后都与堆顶比较，当前元素小于堆顶时，则弹出堆顶并插入当前元素。

- **初始化大顶堆**: 将数组`前k个元素构建大顶堆`，即从非叶子节点向上构建，大值元素上浮;  
- **更新大顶堆**: 从数组第k+1个元素依次与堆顶元素比较，若小于堆顶，即当前元素属于topk，`弹出堆顶元素并插入当前元素`，重新构建大顶堆。

> **时间复杂度**: O(nlogn)，将一个元素插入大顶堆占用O(logn)，遍历整个数组占用O(n);  
> **空间复杂度**: O(k)，维护大小为k的大顶堆占用k额外空间;

```python
class Solution:
    def heapify(self, arr, i):  # 大顶堆化
        left, right = 2 * i + 1, 2 * i + 2
        largest = i
        if left < len(arr) and arr[left] > arr[largest]:
            largest = left
        if right < len(arr) and arr[right] > arr[largest]:
            largest = right
        if largest != i:
            arr[largest], arr[i] = arr[i], arr[largest]
            self.heapify(arr, largest)  # 交换后再次与左右子节点比较

    def build_heap(self, nums):  # 从非叶子节点初始化堆
        for i in range(len(nums) // 2 - 1, -1, -1):
            self.heapify(nums, i)

    def getLeastNumbers(self, arr: List[int], k: int) -> List[int]:
        if not arr or k <= 0:
            return []
        if len(arr) <= k:
            return arr
        
        heap = arr[:k]
        self.build_heap(heap)
        
        for i in range(k, len(arr)):
            if arr[i] < heap[0]:  # 当前元素比k堆顶小时，弹出堆顶并插入当前元素
                heap[0] = arr[i]
                self.heapify(heap, 0)
        return heap
```

## 快排
> **选取基准元素将数组分为左右两侧**，根据基准元素下标和k比较递归划分，直到基准元素下标为k，则左侧k个元素为topk。

- **基准划分**: 选取数组第一个元素为基准，i 标记比基准小的元素下标，j 标记比基准大的元素下标，最后`将基准交换并返回`基准元素下标;  
- **快速排序**: 1)当基准元素下标 `pivot+1 == k` 时，则基准左侧k-1元素都比基准元素小，即为topk; 2)若不相等，根据基准元素下标对左（右）侧进一步划分。

> **时间复杂度**: O(nlogn)，每轮遍历数组与基准比较占用O(n)，共需要logn轮比较;  
> **空间复杂度**: O(nlogn)，递归占用nlogn额外空间;

```python
class Solution:
    def partition(self, arr, left, right):
        pivot = left
        i = j = pivot + 1
        while j <= right:
            if arr[j] < arr[pivot]:
                arr[i], arr[j] = arr[j], arr[i]
                i += 1
            j += 1
        arr[pivot], arr[i-1] = arr[i-1], arr[pivot]
        return i-1
    
    def quick_sort(self, arr, left, right, k):
        pivot = self.partition(arr, left, right)
        if pivot + 1 == k:
            return
        elif pivot + 1 > k:  # topk元素全在基准左侧
            self.quick_sort(arr, left, pivot - 1, k)
        else:  # topk元素全在基准右侧
            self.quick_sort(arr, pivot + 1, right, k)

    def getLeastNumbers(self, arr: List[int], k: int) -> List[int]:
        if not arr or k <= 0:
            return []
        if len(arr) <= k:
            return arr
        self.quick_sort(arr, 0, len(arr) - 1, k)
        return arr[:k]
```
