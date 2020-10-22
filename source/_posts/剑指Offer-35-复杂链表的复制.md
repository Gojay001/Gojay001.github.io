---
title: 剑指Offer-35-复杂链表的复制
thumbnail: /gallery/thumbnails/剑指Offer.jpg
date: 2020-10-22 17:08:34
categories:
    - Algorithm  
    - 剑指Offer  
    - 35
tags: [Algorithm, Offer, DFS, 递归, 二叉树]
---

# 题目
---
## 题目描述
> 请实现 `copyRandomList` 函数，复制一个复杂链表。在复杂链表中，每个节点除了有一个 `next` 指针指向下一个节点，还有一个 `random` 指针指向链表中的任意节点或者 `null`。
<!-- more -->

## 示例1
![剑指Offer-35-1.png](https://i.loli.net/2020/10/22/lRY2sNQLDyguI4e.png)
> **输入**: head = [[7,null],[13,0],[11,4],[10,2],[1,0]]  
> **输出**: [[7,null],[13,0],[11,4],[10,2],[1,0]]

## 示例2
![剑指Offer-35-2.png](https://i.loli.net/2020/10/22/8IPEYoQgqrR5U3b.png)
> **输入**: head = [[1,1],[2,1]]  
> **输出**: [[1,1],[2,1]]

# 题解
---
## Python深拷贝
> 直接调用Python深拷贝函数。

- **浅拷贝**: 只复制指向某个对象的指针，而不复制对象本身，新旧对象还是共享同一块内存;  
- **深拷贝**: 创造一个一模一样的对象，新对象跟原对象不共享内存;

```python
"""
# Definition for a Node.
class Node:
    def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
        self.val = int(x)
        self.next = next
        self.random = random
"""
class Solution:
    def copyRandomList(self, head: 'Node') -> 'Node':
        return copy.deepcopy(head)
```

## 哈希表迭代
> 先 **遍历存储** 链表所有节点到 `哈希表visited`， **再次遍历** 为visited中拷贝的节点分配next和random指针。

- **哈希表visited**: `{原节点: 拷贝节点}`;  
- **第一次遍历**: 为将每个节点存储到哈希表中，并对应其拷贝节点;  
- **第二次遍历**: 为每个拷贝节点分配 next 和 random 指针;

> **时间复杂度**：O(n)，遍历两次，每次遍历所有节点；  
> **空间复杂度**：O(n)，新建大小为n的哈希表。

```python
class Solution:
    def copyRandomList(self, head: 'Node') -> 'Node':
        if not head:
            return
        visited = {None: None}
        temp = head
        while temp:
            visited[temp] = Node(temp.val, None, None)
            temp = temp.next
        temp = head
        while temp:
            visited[temp].next = visited[temp.next]
            visited[temp].random = visited[temp.random]
            temp = temp.next
        return visited[head]
```

## DFS
> 先递归分配所有节点的 **next** 指针，再次递归返回每个节点的 **random** 指针。

从头节点依次递归所有节点:  
1. 从头节点开始拷贝，**将拷贝节点对应存储到哈希表**中;  
2. 由于一个节点可能被多个指针指到，如果 **该节点已被拷贝**，则不需要重复拷贝;  
3. 若 **还没拷贝该节点**，则创建一个新的节点进行拷贝，并将拷贝过的节点保存在哈希表中;  
4. 递归拷贝所有的 **next** 节点，再递归拷贝所有的 **random** 节点;  

> **时间复杂度**：O(n)，递归遍历所有节点；  
> **空间复杂度**：O(n)，递归占用辅助空间O(n)。

```python
class Solution:
    def copyRandomList(self, head: 'Node') -> 'Node':
        def dfs(node):
            if not node:
                return None
            if node in visited:
                return visited[node]
            copy = Node(node.val, None, None)
            visited[node] = copy
            copy.next = dfs(node.next)
            copy.random = dfs(node.random)
            return copy
        
        visited = {}
        return dfs(head)
```

## BFS
> 依次为每个节点分配next和random指针，并将其指针 **指向节点加入队列**，循环遍历所有节点。

从头节点依次递归所有节点:  
1. 创建 **哈希表**，存储头节点及其拷贝节点;  
2. 创建 **队列**，并将头节点入队;  
3. 当 **队列不为空** 时，弹出一个结点:  
- 如果该结点的 `next` 结点未被拷贝过，则拷贝 next 结点并加入队列;  
- 如果该结点的 `random` 结点未被拷贝过，则拷贝 random 结点并加入队列;  
4. 为 **拷贝节点** 分配 next 和 random 指针;

> **时间复杂度**：O(n)，递归遍历所有节点；  
> **空间复杂度**：O(n)，递归占用辅助空间O(n)。

```python
class Solution:
    def copyRandomList(self, head: 'Node') -> 'Node':
        if not head:
            return
        visited = {head: Node(head.val)}
        queue = collections.deque()
        queue.append(head)
        while queue:
            node = queue.popleft()
            if node.next and node.next not in visited:
                visited[node.next] = Node(node.next.val, None, None)
                queue.append(node.next)
            if node.random and node.random not in visited:
                visited[node.random] = Node(node.random.val, None, None)
                queue.append(node.random)
            visited[node].next = visited[node.next] if node.next in visited else None
            visited[node].random = visited[node.random] if node.random in visited else None
        return visited[head]
```
