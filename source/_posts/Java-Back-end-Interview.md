---
title: Java Back-end Interview  
date: 2018-02-01 10:01:31  
thumbnail: /gallery/thumbnails/interview.jpg  
categories:  
    - JavaWeb  
    - Interview  
tags: [Java, interview]  
---

# 写在前面
---
在大三上的期末时间段，偶然得知某滴信息安全部的后端开发实习岗位。由于厂牌和待遇的吸引，便抱着试一试的心态投了简历。下面就一面的提问进行技术总结，答案仅为个人理解，问题没有详细解释只提出大概要点。
<!-- more -->

# 面试细节
---
## 自我介绍
首先是介绍自己，包括求职岗位，个人情况（比如学校、年级、专业等），技术学习情况（技术栈、技术能力、项目等）。

## 项目
* 项目架构
* 细节处理及实现

由于在简历的项目经历必不可少，首先就选了一个项目进行细节剖析。这个就是把自己的实现思路表达出来，毕竟自己写的项目对所运用到的东西心里也有点数。针对这次面试，面试官对安全方面可能看得比较重，所以从头到尾一直在挖这边的细节。

## Java基础

### String、StringBuffered
* 二者区别
* 存储在JVM哪里

> 可变，线程安全；  
> 存储在常量池。

### 编码
* Class文件编码
* 谈谈遇到过的乱码问题及如何解决
* UTF-8和UTF-16区别

> Class文件采用Unicode编码(UTF-16)；  
> 乱码问题： **页面乱码**（HTML、JSP）， **传值乱码**（配置过滤器）， **数据库乱码**（检查Tomcat、Mysql配置）  
> 其他相关： `http://www.qianxingzhem.com/post-1499.html`

### abstract、interface
* 两者区别

> 多继承实现，全部抽象；

### JDK8
> 这个暂时不太了解，下面贴出关于新特性的官方说明和博客链接：  
> 官方说明： `http://www.oracle.com/technetwork/java/javase/8-whats-new-2157071.html`  
> 博客： `http://blog.csdn.net/qiubabin/article/details/70256683`

### 集合
* 简述集合以及底层实现
* HashMap、HashTable，如何改进
* ArrayList、LinkedList，区别
* HashMap、TreeMap、LinkedHashMap，区别

> 线程安全、效率；  
> 数组查询，链表增删；  
> **HashMap**：允许一条记录键为空，多条记录值为空，不同步；  
> **HashTable**：不允许键值为空，同步，效率低；  
> **LinkedHashMap**：保存记录的插入顺序；  
> **TreeMap**：可以根据键排序。  
> 参考： `http://blog.csdn.net/xin_jmail/article/details/25975085`

### 类加载机制
> (1)全盘负责(2)父类委托(3)缓存机制  
> 参考： `https://www.cnblogs.com/ityouknow/p/5603287.html`

### JVM
* 内存模型
* 数据存储位置（如int i=0;）
* GC（判断GC root，GC分区）

> JVM相关： `http://blog.gojay.xin/2017/12/09/初识Java虚拟机/`

## 专业相关
* **如何保证信息没有被更改**
* **认证、授权**
* **数据加密**

## 后端相关

### Servlet生命周期
> 容器加载类  
> 实例化  
> init()  
> service()  
> destroy()

### GET、POST
* 二者区别

> body，参数，安全性。

### cookie、session
* 二者区别
* 两台服务器负载均衡处理session

> 客户端（浏览器）、服务器；
> session保持、复制、共享；

### 算法
* Stack特性
* 用stack实现时间复杂度为O(1)的getMin()方法

> 后进先出；  
> 使用辅助栈`http://blog.csdn.net/sheepmu/article/details/38459165`

### 数据库
* 事务及特性

> **ACID** `https://www.cnblogs.com/nobounds/p/5409472.html`

## 其他问题
后面就根据简历上面写的东西对其他方面提了一些问题，比如看过哪些技术书籍，平时怎么学习以及解决问题等等。

# 写在最后
---
这次面试整体来说，主要是简历上写了哪些就问的相关技术点，熟悉、掌握、了解都基本会提到一点。感触较大的是什么问题他都能够一直往深处挖，到最后确实不知道或者自己看情况直接说不了解。由于这次招人比较紧急，要求不算太高，所以也就放得比较宽，没有太严格。我也是匆忙投简历，加上当天考英语六级，基本上就没怎么准备。后期会结合自身再改改简历，最重要的还是提升自己，针对技术方面还是需要稳扎稳打，夯实基础。过了几天换了一个人打电话来约二面的时候再次提到了入职和任职时间，最终因为没有协调好时间就没有进行二面。虽然有点遗憾，但是我也更加了解自己现在的水平，以及正式入职所需要具备的能力。这也算是一个转折点吧，最终我决定了考研，技术方面自然也会落下不少，技术博客最近一年也不会怎么更了吧，包括这一篇本应该一个多月前更的也拖到了现在。最后的最后，祝自己考研顺利吧，不忘初心，方能始终。