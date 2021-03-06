---
title: 跟我学Shiro（二）-身份认证  
date: 2017-11-22 11:16:43  
thumbnail: /gallery/thumbnails/shiro.png  
categories:   
    - JavaWeb  
    - Shiro  
tags: [Java, Shiro]  
---

# 简介
**身份验证**：在应用中能`证明他就是他本人`。一般提供一些标识信息来表明他就是他本人，如提供身份证，用户名/密码来证明。  
在 shiro 中，用户需要提供 `principals` （身份）和 `credentials`（证明）给 shiro，从而应用能验证用户身份。 
<!-- more  -->
* **principals**：身份；即主体的标识属性，可以是任何东西，如用户名、邮箱等，唯一即可。一个主体可以有多个 principals，但`只有一个 Primary principals`，一般是用户名/密码/手机号。 
* **credentials**：证明/凭证；即只有主体知道的安全值，如密码/数字证书等。   

> 最常见的 principals 和 credentials 组合就是`用户名/密码`了。  
> 另外两个相关的概念是之前提到的 `Subject` 及 `Realm`，分别是主体及验证主体的数据源。

# 环境准备

## 使用Maven构建
准备环境依赖：添加 `junit`、`common-logging` 及 `shiro-core` 依赖；
> **更新**：加入slf4j-nop依赖包。

```
<dependencies>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>commons-logging</groupId>
        <artifactId>commons-logging</artifactId>
        <version>1.2</version>
    </dependency>
    <dependency>
        <groupId>org.apache.shiro</groupId>
        <artifactId>shiro-core</artifactId>
        <version>1.4.0</version>
    </dependency>
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-nop</artifactId>
        <version>1.7.25</version>
    </dependency>
</dependencies>

```

# 登录/退出

## 准备一些用户身份/凭据
> shiro.ini

```
[users]
gojay=test
root=root
```
此处使用ini配置文件，通过`[user]`指定两个主体。

## 测试用例
> com.github.gojay001.test.LoginLogoutTest  
> **更新**：注意类过时。

```
@Test
public void testLoginLogout() {
    //1、获取SecurityManager工厂，此处使用Ini配置文件初始化SecurityManager
    Factory<SecurityManager> factory = new IniSecurityManagerFactory("classpath:shiro.ini");

    //2、得到SecurityManager实例 并绑定给SecurityUtils
    SecurityManager securityManager = factory.getInstance();
    SecurityUtils.setSecurityManager(securityManager);

    //3、得到Subject及创建用户名/密码身份验证Token（即用户身份/凭证）
    Subject subject = SecurityUtils.getSubject();
    UsernamePasswordToken token = new UsernamePasswordToken("root", "root");

    try {
        //4、登录，即身份验证
        subject.login(token);
    } catch (AuthenticationException e) {
        //5、身份验证失败
    }

    Assert.assertEquals(true, subject.isAuthenticated());

    //6、退出
    subject.logout();
}
```
* 首先通过new IniSecurityManagerFactory并指定一个ini配置文件来`创建一个SecurityManager工厂`；
* 接着`获取SecurityManager并绑定到SecurityUtils`，这是一个全局设置，设置一次即可；
* 通过SecurityUtils`得到Subject`，其会自动绑定到当前线程；如果在web环境在请求结束时需要解除绑定；然后`获取身份验证的Token`，如用户名/密码；
* `调用subject.login方法`进行登录，其会自动委托给SecurityManager.login方法进行登录；
* `如果身份验证失败捕获AuthenticationException或其子类`，常见的如： `DisabledAccountException`（禁用的帐号）、`LockedAccountException`（锁定的帐号）、`UnknownAccountException`（错误的帐号）、`ExcessiveAttemptsException`（登录失败次数过多）、`IncorrectCredentialsException` （错误的凭证）、`ExpiredCredentialsException`（过期的凭证）等，具体查看其继承关系；
* 最后可以`调用subject.logout退出`，其会自动委托给SecurityManager.logout方法退出。

## 总结步骤
> 1. 收集用户身份/凭证，即如用户名/密码；
> 2. 调用Subject.login进行登录，如果失败将得到相应的AuthenticationException异常，根据异常提示用户错误信息；否则登录成功；
> 3. 最后调用Subject.logout进行退出操作。

## 存在问题
> 1. `用户名/密码硬编码`在ini配置文件，以后需要改成如数据库存储，且密码需要加密存储；
> 2. `用户身份Token`可能不仅仅是用户名/密码，也可能`还有其他的`，如登录时允许用户名/邮箱/手机号同时登录。 

# 身份认证流程
![2-1.png](https://i.loli.net/2019/08/04/tfpzHNlgqS5QomI.png)

## 流程如下：
> 1. 首先`调用Subject.login(token)`进行登录，其会自动委托给Security Manager，调用之前必须通过SecurityUtils. setSecurityManager()设置；
> 2. `SecurityManager`负责真正的身份验证逻辑；它会`委托给Authenticator进行身份验证`；
> 3. Authenticator才是真正的身份验证者，Shiro API中核心的身份认证入口点，此处`可以自定义插入自己的实现`；
> 4. Authenticator可能会委托给相应的AuthenticationStrategy`进行多Realm身份验证`，默认ModularRealmAuthenticator会调用AuthenticationStrategy进行多Realm身份验证；
> 5. Authenticator会`把相应的token传入Realm，从Realm获取身份验证信息`，如果没有返回/抛出异常表示身份验证失败了。此处可以配置多个Realm，将按照相应的顺序及策略进行访问。

# Realm

**Realm**：域；Shiro从Realm获取安全数据（如用户、角色、权限），可以把Realm看成DataSource，即`安全数据源`。

org.apache.shiro.realm.Realm接口如下：
```
String getName(); //返回一个唯一的Realm名字  
boolean supports(AuthenticationToken token); //判断此Realm是否支持此Token  
AuthenticationInfo getAuthenticationInfo(AuthenticationToken token) throws AuthenticationException;  //根据Token获取认证信息
```
 
 ## 单Realm配置

 ### 自定义Realm实现
 > com.github.gojay001.realm.MyRealm1
 
```
 public class MyRealm1 implements Realm {
    public String getName() {
        return "myRealm1";
    }

    public boolean supports(AuthenticationToken authenticationToken) {
        return authenticationToken instanceof UsernamePasswordToken;
    }

    public AuthenticationInfo getAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        // 得到用户名
        String username = (String)authenticationToken.getPrincipal();
        // 得到密码
        String password = new String((char[])authenticationToken.getCredentials());
        if(!"root".equals(username)) {
            //用户名错误
            throw new UnknownAccountException();
        }
        if(!"root".equals(password)) {
            //密码错误
            throw new IncorrectCredentialsException();
        }
        //如果身份认证验证成功，返回一个AuthenticationInfo实现；
        return new SimpleAuthenticationInfo(username, password, getName());
    }
}
```

### ini配置文件指定自定义Realm实现
> shiro-realm.ini

```
# 声明一个realm
myRealm1=com.github.gojay001.realm.MyRealm1
# 指定securityManager的realms实现
securityManager.realms=$myRealm1
```
通过$name来引入之前的realm定义。

## 多Realm配置
### ini配置文件
> shiro-multi-realm.ini

```
# 声明一个realm  
myRealm1=com.github.zhangkaitao.shiro.chapter2.realm.MyRealm1  
myRealm2=com.github.zhangkaitao.shiro.chapter2.realm.MyRealm2  
# 指定securityManager的realms实现  
securityManager.realms=$myRealm1,$myRealm2
```
securityManager会按照realms指定的顺序进行身份认证。

## Shiro默认提供的Realm
![2-2.png](https://i.loli.net/2019/08/04/2gCrkAm37uDxsl8.png)

以后一般继承`AuthorizingRealm`（授权）即可；其继承了`AuthenticatingRealm`（即身份验证），而且也间接继承了`CachingRealm`（带有缓存实现）。  
其中主要默认实现如下：
* **org.apache.shiro.realm.text.IniRealm**：`[users]部分`指定用户名/密码及其角色；`[roles]部分`指定角色即权限信息；
* **org.apache.shiro.realm.text.PropertiesRealm**： `user.username=password,role1,role2`指定用户名/密码及其角色；`role.role1=permission1,permission2`指定角色及权限信息；
* **org.apache.shiro.realm.jdbc.JdbcRealm**：通过sql查询相应的信息，如`“select password from users where username = ?”`获取用户密码，`“select role_name from user_roles where username = ?”`获取用户角色；`“select permission from roles_permissions where role_name = ?”`获取角色对应的权限信息；也可以调用相应的api进行自定义sql；

## JDBC Realm使用

### 数据库及依赖
> **更新**：alibaba的druid包更新版本。

```
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>6.0.6</version>
</dependency>
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.5</version>
</dependency> 
```
本文将使用mysql数据库及druid连接池。

### 数据库下建表
`users`（用户名/密码）、`user_roles`（用户/角色）、`roles_permissions`（角色/权限）；  
具体请参照sql/shiro.sql；并添加一个用户记录，用户名/密码为root/root。

### ini配置
> shiro-jdbc-realm.ini

```
jdbcRealm=org.apache.shiro.realm.jdbc.JdbcRealm  
dataSource=com.alibaba.druid.pool.DruidDataSource  
dataSource.driverClassName=com.mysql.jdbc.Driver  
dataSource.url=jdbc:mysql://localhost:3306/shiro  
dataSource.username=root  
dataSource.password=root
jdbcRealm.dataSource=$dataSource  
securityManager.realms=$jdbcRealm 
```
1. `变量名=全限定类名` 自动创建一个类实例
2. `变量名.属性=值` 自动调用相应的setter方法进行赋值
3. `$变量名` 引用之前的一个对象实例 
4. `测试代码`和之前的没什么区别。

# Authenticator及AuthenticationStrategy

## 原理
**Authenticator**的职责是验证用户帐号，
是Shiro API中身份验证核心的入口点：
```
public AuthenticationInfo authenticate(AuthenticationToken authenticationToken) throws AuthenticationException;
```
如果验证成功，将返回AuthenticationInfo验证信息，此信息中包含了身份及凭证；  
如果验证失败将抛出相应的AuthenticationException实现。

**SecurityManager**接口继承了Authenticator，另外还有一个`ModularRealmAuthenticator实现`，其委托给多个Realm进行验证，验证规则通过`AuthenticationStrategy接口`指定，默认提供的实现：
* **FirstSuccessfulStrategy**：只要有`一个Realm验证成功`即可，`只返回第一个Realm`身份验证成功的认证信息，其他的忽略；
* **AtLeastOneSuccessfulStrategy**：只要有`一个Realm验证成功`即可，和FirstSuccessfulStrategy不同，`返回所有Realm`身份验证成功的认证信息；
* **AllSuccessfulStrategy**：`所有Realm验证成功`才算成功，且`返回所有Realm`身份验证成功的认证信息，如果有一个失败就失败了。
> `ModularRealmAuthenticator`默认使用`AtLeastOneSuccessfulStrategy`策略。

## 示例
> 假设有三个realm：  
> myRealm1： 用户名/密码为root/root时成功，且返回身份/凭据为root/root；  
> myRealm2： 用户名/密码为gojay/test时成功，且返回身份/凭据为gojay/test；  
> myRealm3： 用户名/密码为root/root时成功，且返回身份/凭据为root@foxmail.com/root；

### ini配置文件
> shiro-authenticator-all-success.ini

```
[main]
#指定securityManager的authenticator实现
authenticator=org.apache.shiro.authc.pam.ModularRealmAuthenticator
securityManager.authenticator=$authenticator

#指定securityManager.authenticator的authenticationStrategy
allSuccessfulStrategy=org.apache.shiro.authc.pam.AllSuccessfulStrategy
securityManager.authenticator.authenticationStrategy=$allSuccessfulStrategy

myRealm1=com.github.gojay001.realm.MyRealm1
myRealm2=com.github.gojay001.realm.MyRealm2
myRealm3=com.github.gojay001.realm.MyRealm3
securityManager.realms=$myRealm1,$myRealm3
```
### 测试代码
> com.github.gojay001.test.AuthenticatorTest

#### 首先通用化登录逻辑 
```
private void login(String configFile) {  
    //1、获取SecurityManager工厂，此处使用Ini配置文件初始化SecurityManager  
    Factory<org.apache.shiro.mgt.SecurityManager> factory =  
            new IniSecurityManagerFactory(configFile);  
  
    //2、得到SecurityManager实例 并绑定给SecurityUtils  
    org.apache.shiro.mgt.SecurityManager securityManager = factory.getInstance();  
    SecurityUtils.setSecurityManager(securityManager);  
  
    //3、得到Subject及创建用户名/密码身份验证Token（即用户身份/凭证）  
    Subject subject = SecurityUtils.getSubject();  
    UsernamePasswordToken token = new UsernamePasswordToken("root", "root");  
  
    subject.login(token);  
}  
```
#### 测试AllSuccessfulStrategy成功
```
@Test  
public void testAllSuccessfulStrategyWithSuccess() {  
    login("classpath:shiro-authenticator-all-success.ini");  
    Subject subject = SecurityUtils.getSubject();  
  
    //得到一个身份集合，其包含了Realm验证成功的身份信息  
    PrincipalCollection principalCollection = subject.getPrincipals();  
    Assert.assertEquals(2, principalCollection.asList().size());  
}
```
#### 测试AllSuccessfulStrategy失败
```
@Test(expected = UnknownAccountException.class)  
public void testAllSuccessfulStrategyWithFail() {  
    login("classpath:shiro-authenticator-all-fail.ini");  
    Subject subject = SecurityUtils.getSubject();  
}
```
> `shiro-authenticator-all-fail.ini` 与 `shiro-authenticator-all-success.ini` 不同的配置是使用了 `securityManager.realms=$myRealm1,$myRealm2` ；即myRealm验证失败。

>  对于 `AtLeastOneSuccessfulStrategy` 和 `FirstSuccessfulStrategy` 的区别：唯一不同点一个是`返回所有`验证成功的Realm的认证信息；另一个是`只返回第一个`验证成功的Realm的认证信息.`示例代码同上`

### 自定义AuthenticationStrategy实现
首先看其API：
```
//在所有Realm验证之前调用  
AuthenticationInfo beforeAllAttempts(  
Collection<? extends Realm> realms, AuthenticationToken token)   
throws AuthenticationException;  
//在每个Realm之前调用  
AuthenticationInfo beforeAttempt(  
Realm realm, AuthenticationToken token, AuthenticationInfo aggregate)   
throws AuthenticationException;  
//在每个Realm之后调用  
AuthenticationInfo afterAttempt(  
Realm realm, AuthenticationToken token,   
AuthenticationInfo singleRealmInfo, AuthenticationInfo aggregateInfo, Throwable t)  
throws AuthenticationException;  
//在所有Realm之后调用  
AuthenticationInfo afterAllAttempts(  
AuthenticationToken token, AuthenticationInfo aggregate)   
throws AuthenticationException;   
```
因为每个`AuthenticationStrategy`实例都是无状态的，所有每次都通过接口将相应的认证信息传入下一次流程；  
通过如上接口可以进行如合并/返回第一个验证成功的认证信息。  
自定义实现时一般`继承 org.apache.shiro.authc.pam.AbstractAuthenticationStrategy` 即可。`参考代码同上`

> 到此基本的身份验证就结束了。

# 总结
## 问题描述
### Assert过时
> **Assert in junit.framework has been deprecated**  
> **解决**：将 `import junit.framework.Assert;` 改为 `import org.junit.Assert;` 

### SLF4J加载失败
> SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder"  
> **解决**：Maven引入slf4j-nop包：
```
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-nop</artifactId>
    <version>1.7.6</version>
</dependency>
```

### implements不需要@Override

### alibaba的druid版本更新

## 重点
### 用户登录流程
* Subject.login(token)
* SecurityManager
* Authenticator
* AuthenticatorStrategy
* Realm

### Realm
* 单Realm
* 多Realm
* JDBCRealm

### AuthenticatorStrategy
* FirstSuccessfulStrategy
* AtLeastOneSuccessfulStrategy
* AllSuccessfulStrategy
* 自定义Strategy

> 参考代码：https://github.com/Gojay001/Demo/tree/master/ShiroTest/ShiroTest-chapter2
