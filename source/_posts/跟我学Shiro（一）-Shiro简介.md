---
title: 跟我学Shiro（一）-Shiro简介  
date: 2017-11-19 11:06:53  
categories:   
	- JavaWeb  
	- Shiro  
tags: [Java, Shiro]  
---

# 简介

## 认识
* Apache Shiro是Java的一个安全框架。  
* 对比`Spring Security`小而简单。  
* 可同时用在JavaSE、JavaEE环境中。  
* 主要完成认证、授权、加密、会话管理、与Web集成、缓存等。
<!-- more -->

## 功能
![1-1.png](https://i.loli.net/2019/08/04/2icLvSGIotKdmC9.png)
* **Authentication**：身份认证/登录，验证用户是不是拥有相应的身份；
* **Authorization**：授权，即权限验证，验证某个已认证的用户是否拥有某个权限；
* **Session Manager**：会话管理，即用户登录后就是一次会话，在没有退出之前，它的所有信息都在会话中；
* **Cryptography**：加密，保护数据的安全性，如密码加密存储到数据库，而不是明文存储；
* **Web Support**：Web 支持，可以非常容易的集成到 Web 环境；
* **Concurrency**：shiro 支持多线程应用的并发验证，即如在一个线程中开启另一个线程，能把权限自动传播过去；
* **Testing**：提供测试支持；
* **Run As**：允许一个用户假装为另一个用户（如果他们允许）的身份进行访问；
* **Remember Me**：记住我，这个是非常常见的功能，即一次登录后，下次再来的话不用登录了。

> Shiro不会去维护用户、维护权限；这些需要自己设计提供，然后通过相应的接口注入给Shiro。

## 架构

### 从外部看Shiro：
![1-2.png](https://i.loli.net/2019/08/04/HUeCOTW3RNdk5wu.png)
* **Subject**：主体；代表了与当前应用交互的用户，如网络爬虫、机器人等；所有 `Subject` 都绑定到 `SecurityManager`，与 `Subject` 的所有交互都会委托给 `SecurityManager`；可以把 `Subject` 认为是一个门面，`SecurityManager` 才是实际的执行者；
* **SecurityManager**：安全管理器；即所有与安全有关的操作都会与 `SecurityManager` 交互，且它管理着所有 `Subject`；它是 Shiro 的核心，负责与其他组件进行交互，可以把它看成`Spring NVC`中的 `DispatcherServlet` 前端控制器；
* **Realm**：域；`Shiro` 从 `Realm` 获取安全数据（如用户、角色、权限），就是说 `SecurityManager` 要验证用户身份，那么它需要从 `Realm` 获取相应的用户进行比较以确定用户身份是否合法；也需要从 `Realm` 得到用户相应的角色/权限进行验证用户是否能进行操作；可以把 Realm 看成 `DataSource`，即安全数据源。

> 最简单的一个 Shiro 应用：
> 1. 应用代码通过 `Subject` 来进行认证和授权，而 `Subject` 又委托给 `SecurityManager`；
> 2. 我们需要给 Shiro 的 `SecurityManager` 注入 `Realm`，从而让 `SecurityManager` 能得到合法的用户及其权限进行判断。
> 可以看出：Shiro不提供维护用户/权限，而是通过Realm让开发人员自己注入。

### 从内部看Shiro：
![1-3.png](https://i.loli.net/2019/08/04/mtUHo7nAzGLOZbB.png)
* **Subject**：主体；可以看到主体可以是任何可以与应用交互的“用户”；
* **SecurityManager** ：安全管理器；所有具体的交互都通过 `SecurityManager` 进行控制；它管理着所有 `Subject`，且负责进行认证和授权、及会话、缓存的管理，是Shiro的心脏；
* **Authenticator**：认证器；负责主体认证的，这是一个扩展点，如果用户觉得 Shiro 默认的不好，可以自定义实现；其需要认证策略`Authentication Strategy`，即什么情况下算用户认证通过了； * **Authrizer**：授权器；用来决定主体是否有权限进行相应的操作，即控制着用户能访问应用中的哪些功能；
* **Realm**：可以有 1 个或多个 `Realm`，可以认为是安全实体数据源，即用于获取安全实体的，由用户提供；Shiro 不知道用户/权限存储在哪及以何种格式存储，所以我们一般在应用中都需要实现自己的 `Realm`；
* **SessionManager**：Session需要有人去管理它的生命周期，这个组件就是`SessionManager`；Shiro 抽象了一个自己的 Session 来管理主体与应用之间交互的数据；这样的话，比如我们在 Web 环境用，刚开始是一台 Web 服务器；接着又上了台 EJB 服务器；这时想把两台服务器的会话数据放到一个地方，这个时候就可以实现自己的分布式会话（如把数据放到 Memcached 服务器）；
* **SessionDAO**：数据访问对象`DAO`，用于会话的 CRUD，比如我们想把 Session 保存到数据库，那么可以实现自己的 SessionDAO，通过如JDBC写到数据库；比如想把 `Session` 放到`Memcached`中，可以实现自己的 `Memcached SessionDAO`；另外 `SessionDAO` 中可以使用 `Cache` 进行缓存，以提高性能；
* **CacheManager**：缓存控制器；来管理如用户、角色、权限等的缓存的；因为这些数据基本上很少去改变，放到缓存中后可以提高访问的性能；
* **Cryptography**：密码模块;Shiro 提高了一些常见的加密组件用于如密码加密/解密的。

> 到此 Shiro 架构及其组件就认识完了。