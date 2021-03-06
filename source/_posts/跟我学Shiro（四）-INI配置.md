---
title: 跟我学Shiro（四）-INI配置  
date: 2017-11-28 14:50:37  
thumbnail: /gallery/thumbnails/shiro.png  
categories:  
	- JavaWeb  
	- Shiro  
tags: [Java, Shiro]  
---

# SecurityManager
Shiro是从根对象 `SecurityManager` 进行身份验证和授权的，这个对象是线程安全且真个应用只需要一个即可，因此Shiro提供了 `SecurityUtils` 让我们绑定它为`全局`的，方便后续操作。
<!-- more -->
> 因为Shiro的类都是POJO的，因此都很容易放到任何IoC容器管理。  
> 但是和一般的IoC容器的区别在于，Shiro从根对象securityManager开始导航。  
> Shiro支持的依赖注入：public空参构造器对象的创建、setter依赖注入。

## 纯Java代码写法
> com.github.gojay001.test.NonConfigurationCreateTest

```
DefaultSecurityManager securityManager = new DefaultSecurityManager();

//设置authenticator
ModularRealmAuthenticator authenticator = new ModularRealmAuthenticator();
authenticator.setAuthenticationStrategy(new AtLeastOneSuccessfulStrategy());
securityManager.setAuthenticator(authenticator);

//设置authorizer
ModularRealmAuthorizer authorizer = new ModularRealmAuthorizer();
authorizer.setPermissionResolver(new WildcardPermissionResolver());
securityManager.setAuthorizer(authorizer);

//设置Realm
DruidDataSource ds = new DruidDataSource();
ds.setDriverClassName("com.mysql.jdbc.Driver");
ds.setUrl("jdbc:mysql://localhost:3306/shiro");
ds.setUsername("root");
ds.setPassword("root");

JdbcRealm jdbcRealm = new JdbcRealm();
jdbcRealm.setDataSource(ds);
jdbcRealm.setPermissionsLookupEnabled(true);
securityManager.setRealms(Arrays.asList((Realm) jdbcRealm));

//将SecurityManager设置到SecurityUtils 方便全局使用
SecurityUtils.setSecurityManager(securityManager);

Subject subject = SecurityUtils.getSubject();

UsernamePasswordToken token = new UsernamePasswordToken("root", "root");
subject.login(token);

Assert.assertTrue(subject.isAuthenticated());
```

## 等价的INI配置

### shiro-config.ini：
```
[main]
#覆盖默认的securityManager
#securityManager=org.apache.shiro.mgt.DefaultSecurityManager

#authenticator
authenticator=org.apache.shiro.authc.pam.ModularRealmAuthenticator
authenticationStrategy=org.apache.shiro.authc.pam.AtLeastOneSuccessfulStrategy
authenticator.authenticationStrategy=$authenticationStrategy
securityManager.authenticator=$authenticator

#authorizer
authorizer=org.apache.shiro.authz.ModularRealmAuthorizer
permissionResolver=org.apache.shiro.authz.permission.WildcardPermissionResolver
authorizer.permissionResolver=$permissionResolver
securityManager.authorizer=$authorizer

#realm
dataSource=com.alibaba.druid.pool.DruidDataSource
dataSource.driverClassName=com.mysql.jdbc.Driver
dataSource.url=jdbc:mysql://localhost:3306/shiro
dataSource.username=root
dataSource.password=root

jdbcRealm=org.apache.shiro.realm.jdbc.JdbcRealm
jdbcRealm.dataSource=$dataSource
jdbcRealm.permissionsLookupEnabled=true
securityManager.realms=$jdbcRealm
```
> `对象名=全限定类名`  相对于调用public无参构造器创建对象  
> `对象名.属性名=值`    相当于调用setter方法设置常量值  
> `对象名.属性名=$对象引用`    相当于调用setter方法设置对象引用

### com.github.gojay001.test.ConfigurationCreateTest：
```
Factory<SecurityManager> factory =
    new IniSecurityManagerFactory("classpath:shiro-config.ini");

SecurityManager securityManager = factory.getInstance();

//将SecurityManager设置到SecurityUtils 方便全局使用
SecurityUtils.setSecurityManager(securityManager);

Subject subject = SecurityUtils.getSubject();

UsernamePasswordToken token = new UsernamePasswordToken("root", "root");
subject.login(token);

Assert.assertTrue(subject.isAuthenticated());
```

> 如上代码是从Shiro `INI配置`中获取相应的`securityManager`实例：  
> 1. 默认情况先创建一个名字为 `securityManager` ，类型为 `org.apache.shiro.mgt.DefaultSecurityManager` 的默认的 `SecurityManager` ，如果想`自定义`，只需要在ini配置文件中指定“securityManager=SecurityManager实现类”即可，名字必须为securityManager，它是起始的根；  
> 2. `IniSecurityManagerFactory` 是创建 `securityManager` 的工厂，其需要一个ini配置文件路径，其支持`classpath:`（类路径）、`file:`（文件系统）、`url:`（网络）三种路径格式，默认是`文件系统`；  
> 3. 接着获取`SecuriyManager实例`，后续步骤和之前的一样。

如上可以看出Shiro INI配置方式本身提供了一个简单的`IoC/DI机制`方便在配置文件配置，但是是从 `securityManager` 这个根对象开始导航。

# INI配置
`ini配置文件`类似于Java中的 `properties（key=value）` ，不过提供了将key/value分类的特性，key是每个部分不重复即可，而不是整个配置文件。如下是INI配置分类：
```
[main]  
#提供了对根对象securityManager及其依赖的配置  
securityManager=org.apache.shiro.mgt.DefaultSecurityManager  
…………  
securityManager.realms=$jdbcRealm  
  
[users]  
#提供了对用户/密码及其角色的配置，用户名=密码，角色1，角色2  
username=password,role1,role2  
  
[roles]  
#提供了角色及权限之间关系的配置，角色=权限1，权限2  
role1=permission1,permission2  
  
[urls]  
#用于web，提供了对web url拦截相关的配置，url=拦截器[参数]，拦截器  
/index.html = anon  
/admin/** = authc, roles[admin], perms["permission1"]
```

## [main]部分
提供了对根对象 **securityManager** 及其依赖对象的配置。

### 创建对象
```
securityManager=org.apache.shiro.mgt.DefaultSecurityManager
```
其构造器必须是`public空参构造器`，通过反射创建相应的实例。

### 常量值setter注入
```
dataSource.driverClassName=com.mysql.jdbc.Driver  
jdbcRealm.permissionsLookupEnabled=true  
```
会自动调用 `jdbcRealm.setPermissionsLookupEnabled(true)` ，对于这种常量值会自动类型转换。

### 对象引用setter注入
```
authenticator=org.apache.shiro.authc.pam.ModularRealmAuthenticator  
authenticationStrategy=org.apache.shiro.authc.pam.AtLeastOneSuccessfulStrategy  
authenticator.authenticationStrategy=$authenticationStrategy  
securityManager.authenticator=$authenticator   
```
会自动通过 `securityManager.setAuthenticator(authenticator)` 注入引用依赖。

### 嵌套属性setter注入 
```
securityManager.authenticator.authenticationStrategy=$authenticationStrategy
```
支持这种嵌套方式的setter注入。

### byte数组setter注入 
```
#base64 byte[]  
authenticator.bytes=aGVsbG8=  
#hex byte[]  
authenticator.bytes=0x68656c6c6f   
```
默认需要使用Base64进行编码，也可以使用0x十六进制。

### Array/Set/List setter注入 
```
authenticator.array=1,2,3  
authenticator.set=$jdbcRealm,$jdbcRealm
```
多个之间通过“，”分割。

### Map setter注入
```
authenticator.map=$jdbcRealm:$jdbcRealm,1:1,key:abc  
```
格式是： `map=key：value，key：value` ，可以注入常量及引用值，常量的话都看作字符串（即使有泛型也不会自动造型）。  

### 实例化/注入顺序 
```
realm=Realm1  
realm=Realm12  
  
authenticator.bytes=aGVsbG8=  
authenticator.bytes=0x68656c6c6f
```
后边的`覆盖`前边的注入。

## [users]部分
配置用户名/密码及其角色，格式：`用户名=密码，角色1，角色2`，角色部分可省略。如：
```
[users]
root=root,role1,role2
gojay=test
```
密码一般生成其摘要/加密存储。

## [roles]部分
配置角色及权限之间的关系，格式：`角色=权限1，权限2`；如：
```
[roles]  
role1=user:create,user:update  
role2=*
```
如果只有角色没有对应的权限，可以不配roles。

## [urls]部分
配置url及相应的拦截器之间的关系，格式：`url=拦截器[参数]，拦截器[参数]`，如：
```
[urls]  
/admin/** = authc, roles[admin], perms["permission1"]
```

> 参考代码： `https://github.com/Gojay001/Demo/tree/master/ShiroTest/ShiroTest-chapter4`
