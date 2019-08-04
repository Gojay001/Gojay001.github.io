---
title: 跟我学Shiro（六）-Realm及相关对象  
date: 2017-11-30 17:18:00  
thumbnail: /gallery/thumbnails/shiro.png  
categories:  
	- JavaWeb  
	- Shiro  
tags: [Java, Shiro]  
---

# Realm
---
## 定义实体及关系
![6-1.png](https://i.loli.net/2019/08/04/9IzlrkhGxKUiEab.png)
<!-- more -->
**用户-角色**之间是多对多关系，**角色-权限**之间是多对多关系；且`用户`和`权限`之间通过`角色`建立关系。  
在系统中验证时通过`权限验证`，角色只是权限集合，即所谓的显式角色。
* **用户**实体包括：编号`id`、用户名`username`、密码`password`、盐`salt`、是否锁定`locked`；
* **角色**实体包括：、编号`id`、角色标识符`role`、描述`description`、是否可用`available`；
* **权限**实体包括：编号`id`、权限标识符`permission`、描述`description`、是否可用`available`。

> 另外还有两个**关系实体**：  
> **用户-角色**实体：用户编号、角色编号，且组合为复合主键）；  
> **角色-权限**实体：角色编号、权限编号，且组合为复合主键）。

## 环境准备
为了方便数据库操作，使用 `org.springframework: spring-jdbc: 4.0.0.RELEASE` 依赖。

### 定义Service及Dao
> 为了实现的简单性，只实现必须的功能，其他的可以自己实现即可。

#### PermissionService
实现基本的**创建/删除**权限。
```
public interface PermissionService {  
    public Permission createPermission(Permission permission);  
    public void deletePermission(Long permissionId);  
}
```

#### RoleService
相对于PermissionService多了**关联/移除关联角色-权限**功能。
```
public interface RoleService {  
    public Role createRole(Role role);  
    public void deleteRole(Long roleId);  
    // 添加角色-权限之间关系  
    public void correlationPermissions(Long roleId, Long... permissionIds);  
    // 移除角色-权限之间关系  
    public void uncorrelationPermissions(Long roleId, Long... permissionIds);  
}
```

#### UserService
使用 **findByUsername** 、 **findRoles** 及 **findPermissions** 来查找用户名对应的帐号、角色及权限信息。  
> 之后的Realm就使用这些方法来查找相关信息。

```
public interface UserService {  
    // 创建账户
    public User createUser(User user);   
    // 修改密码
    public void changePassword(Long userId, String newPassword);  
    // 添加用户-角色关系
    public void correlationRoles(Long userId, Long... roleIds);   
    // 移除用户-角色关系
    public void uncorrelationRoles(Long userId, Long... roleIds);  
    // 根据用户名查找用户
    public User findByUsername(String username);  
    // 根据用户名查找其角色
    public Set<String> findRoles(String username); 
    // 根据用户名查找其权限  
    public Set<String> findPermissions(String username); 
} 
```

#### UserServiceImpl
在创建账户及修改密码时直接把**生成密码操作**委托给 `PasswordHelper`。
```
public User createUser(User user) {  
    // 加密密码  
    passwordUtils.encryptPassword(user);  
    return userDao.createUser(user);  
}  
public void changePassword(Long userId, String newPassword) {  
    User user =userDao.findOne(userId);  
    user.setPassword(newPassword);  
    passwordUtils.encryptPassword(user);  
    userDao.updateUser(user);  
}
```

#### PasswordUtils
之后的CredentialsMatcher需要和此处加密的算法一样。  
user.getCredentialsSalt()辅助方法返回username+salt。
```
public class PasswordUtils {  
    private RandomNumberGenerator randomNumberGenerator =  
     new SecureRandomNumberGenerator();  
    private String algorithmName = "md5";  
    private final int hashIterations = 2;  
    public void encryptPassword(User user) {  
        user.setSalt(randomNumberGenerator.nextBytes().toHex());  
        String newPassword = new SimpleHash(  
                algorithmName,  
                user.getPassword(),  
                ByteSource.Util.bytes(user.getCredentialsSalt()),  
                hashIterations).toHex();  
        user.setPassword(newPassword);  
    }  
} 
```
> 为了节省篇幅，对于**DAO/Service**的接口及实现，具体请参考源码 `com.github.gojay001` ；  
> 另外参考Service层的测试用例 `com.github.gojay001.service.ServiceTest` 。

### 定义Realm

#### RetryLimitHashedCredentialsMatcher
> com.github.gojay001.credentials

```
public class RetryLimitHashedCredentialsMatcher extends HashedCredentialsMatcher {

    private Ehcache passwordRetryCache;

    public RetryLimitHashedCredentialsMatcher() {
        CacheManager cacheManager = CacheManager.newInstance(CacheManager.class.getClassLoader().getResource("ehcache.xml"));
        passwordRetryCache = cacheManager.getCache("passwordRetryCache");
    }

    @Override
    public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {
        String username = (String)token.getPrincipal();
        // retry count + 1
        Element element = passwordRetryCache.get(username);
        if(element == null) {
            element = new Element(username , new AtomicInteger(0));
            passwordRetryCache.put(element);
        }
        AtomicInteger retryCount = (AtomicInteger)element.getObjectValue();
        if(retryCount.incrementAndGet() > 5) {
            // if retry count > 5 throw
            throw new ExcessiveAttemptsException();
        }

        boolean matches = super.doCredentialsMatch(token, info);
        if(matches) {
            // clear retry count
            passwordRetryCache.remove(username);
        }
        return matches;
    }
}
```

#### UserRealm
> com.github.gojay001.realm

```
public class UserRealm extends AuthorizingRealm {
    private UserService userService = new UserServiceImpl();

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        String username = (String)principals.getPrimaryPrincipal();

        SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
        authorizationInfo.setRoles(userService.findRoles(username));
        authorizationInfo.setStringPermissions(userService.findPermissions(username));

        return authorizationInfo;
    }

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {

        String username = (String)token.getPrincipal();

        User user = userService.findByUsername(username);

        //没找到帐号
        if(user == null) {
            throw new UnknownAccountException();
        }

        //帐号锁定
        if(Boolean.TRUE.equals(user.getLocked())) {
            throw new LockedAccountException();
        }

        // 交给AuthenticatingRealm使用CredentialsMatcher进行密码匹配，如果觉得人家的不好可以自定义实现
        return new SimpleAuthenticationInfo(
                user.getUsername(),
                user.getPassword(),
                // salt=username+salt
                ByteSource.Util.bytes(user.getCredentialsSalt()),
                //realm name
                getName()
        );
    }
}
```
* **UserRealm父类AuthorizingRealm将获取Subject相关信息分成两步**：获取身份验证信息 `doGetAuthenticationInfo` 及授权信息 `doGetAuthorizationInfo` ；
* **doGetAuthenticationInfo**：首先根据传入的用户名获取User信息；在组装SimpleAuthenticationInfo信息时，需要传入：身份信息`用户名`、凭据`密文密码`、盐`username+salt`， *CredentialsMatcher* 使用盐加密传入的明文密码和此处的密文密码进行匹配。
* **doGetAuthorizationInfo**：`PrincipalCollection` 是一个身份集合，因为我们现在就一个Realm，所以直接调用getPrimaryPrincipal得到之前传入的`用户名`即可；然后根据用户名`调用UserService接口`获取角色及权限信息。

# AuthenticationToken
---
![6-2.png](https://i.loli.net/2019/08/04/QgMFCh1X7aeAEI6.png)

**AuthenticationToken**用于收集用户提交的身份 `用户名` 及凭据 `密码` ：
```
public interface AuthenticationToken extends Serializable {  
    Object getPrincipal(); 
    Object getCredentials(); 
}
```
* **RememberMeAuthenticationToken**：提供了 `boolean isRememberMe()` **记住我**的功能；
* **HostAuthenticationToken**：提供了 `String getHost()` 方法用于获取用户**主机**的功能。

> Shiro提供了一个直接拿来用的**UsernamePasswordToken**，用于实现用户名/密码Token组。实现了 `RememberMeAuthenticationToken` 和 `HostAuthenticationToken` ，可以实现记住我及主机验证的支持。

# AuthenticationInfo
---
![6-3.png](https://i.loli.net/2019/08/04/FxzAB7hVGevZ5cl.png)

**AuthenticationInfo**有两个作用：
* 如果Realm是 `AuthenticatingRealm` 子类，则提供给 `AuthenticatingRealm` 内部使用的 `CredentialsMatcher` 进行凭据验证；（如果没有继承它需要在自己的Realm中自己实现验证）。
* 提供给 `SecurityManager` 来创建 `Subject` （提供身份信息）。

> **MergableAuthenticationInfo**用于提供在多Realm时`合并AuthenticationInfo的功能`，主要合并Principal。  
> 比如 `HashedCredentialsMatcher` ，在验证时会判断 `AuthenticationInfo` 是否是**SaltedAuthenticationInfo**子类，来获取盐信息。  
> **Account**相当于我们之前的 `User` ， `SimpleAccount` 是其一个实现。  
> 其他情况一般返回**SimpleAuthenticationInfo**即可。

# PrincipalCollection
---
![6-4.png](https://i.loli.net/2019/08/04/OPzuYTWsefwZ2gX.png)

因为我们可以在Shiro中同时配置多个Realm，所以身份信息可能就有多个；因此其提供了**PrincipalCollection**用于`聚合这些身份信息`：  
```
public interface PrincipalCollection extends Iterable, Serializable {  
    // 得到主要的身份
    Object getPrimaryPrincipal();   
    // 根据身份类型获取第一个
    <T> T oneByType(Class<T> type);   
    // 根据身份类型获取一组
    <T> Collection<T> byType(Class<T> type);   
    // 转换为List
    List asList();   
    // 转换为Set
    Set asSet();
    // 根据Realm名字获取
    Collection fromRealm(String realmName);   
    // 获取所有身份验证通过的Realm名字
    Set<String> getRealmNames();   
    // 判断是否为空
    boolean isEmpty();  
}
```
> **getPrimaryPrincipal**：如果只有一个Principal那么直接返回即可，如果有多个Principal，则返回第一个（因为内部使用Map存储，所以可以认为是返回任意一个）；  
> **oneByType/byType**：根据`凭据的类型`返回相应的Principal；  
> **fromRealm**根据`Realm名字`（每个Principal都与一个Realm关联）获取相应的Principal。

**MutablePrincipalCollection**是一个可变的PrincipalCollection接口，即提供了如下可变方法：
```
public interface MutablePrincipalCollection extends PrincipalCollection {  
    // 添加Realm-Principal的关联
    void add(Object principal, String realmName);   
    // 添加一组Realm-Principal的关联
    void addAll(Collection principals, String realmName);
    // 添加PrincipalCollection
    void addAll(PrincipalCollection principals);
    // 清空
    void clear();
}
```

#  AuthorizationInfo
---
![6-5.png](https://i.loli.net/2019/08/04/sCxRSW21bDFd7Gz.png)

**AuthorizationInfo**用于`聚合授权信息`的：
```
public interface AuthorizationInfo extends Serializable {  
    // 获取角色字符串信息
    Collection<String> getRoles();
    // 获取权限字符串信息
    Collection<String> getStringPermissions(); 
    // 获取Permission对象信息
    Collection<Permission> getObjectPermissions(); 
}
```
当我们使用 `AuthorizingRealm` 时，如果身份验证成功，在进行授权时就通过 `doGetAuthorizationInfo` 方法获取角色/权限信息用于授权验证。  
> Shiro提供了一个实现 **SimpleAuthorizationInfo** ，大多数时候使用这个即可。

# Subject
---
![6-6.png](https://i.loli.net/2019/08/04/fBt62JiSgTW1ex4.png)

**Subject**是Shiro的核心对象，基本所有`身份验证`、`授权`都是通过Subject完成。

## 身份信息获取
```
// Primary Principal
Object getPrincipal(); 
// PrincipalCollection
PrincipalCollection getPrincipals(); 
```

## 身份验证
```
void login(AuthenticationToken token) throws AuthenticationException;  
boolean isAuthenticated();  
boolean isRemembered();
```

## 角色授权验证
```
boolean hasRole(String roleIdentifier);  
boolean[] hasRoles(List<String> roleIdentifiers);  
boolean hasAllRoles(Collection<String> roleIdentifiers);  
void checkRole(String roleIdentifier) throws AuthorizationException;  
void checkRoles(Collection<String> roleIdentifiers) throws AuthorizationException;  
void checkRoles(String... roleIdentifiers) throws AuthorizationException;
```

## 权限授权验证
```
boolean isPermitted(String permission);  
boolean isPermitted(Permission permission);  
boolean[] isPermitted(String... permissions);  
boolean[] isPermitted(List<Permission> permissions);  
boolean isPermittedAll(String... permissions);  
boolean isPermittedAll(Collection<Permission> permissions);  
void checkPermission(String permission) throws AuthorizationException;  
void checkPermission(Permission permission) throws AuthorizationException;  
void checkPermissions(String... permissions) throws AuthorizationException;  
void checkPermissions(Collection<Permission> permissions) throws AuthorizationException;
```

## 会话
```
// 相当于getSession(true)
Session getSession(); 
Session getSession(boolean create);
```
> 如果 `create=false` 如果没有会话将`返回null`；而 `create=true` 如果没有会话会强制`创建一个`。

## 退出
```
void logout();
```

## RunAs
```
void runAs(PrincipalCollection principals) throws NullPointerException, IllegalStateException;  
boolean isRunAs();  
PrincipalCollection getPreviousPrincipals();  
PrincipalCollection releaseRunAs();
```
**RunAs**即实现**允许A假设为B身份进行访问**：  
> 通过调用 `subject.runAs(b)` 进行访问；  
> 接着调用 `subject.getPrincipals` 将获取到B的身份；  
> 此时调用 `isRunAs` 将返回true，而a的身份需要通过 `subject.getPreviousPrincipals` 获取；  
> 如果不需要RunAs了调用 `subject.releaseRunAs` 即可。

## 多线程
```
<V> V execute(Callable<V> callable) throws ExecutionException;  
void execute(Runnable runnable);  
<V> Callable<V> associateWith(Callable<V> callable);  
Runnable associateWith(Runnable runnable);
```
> 在多线程执行中需要传播到相应的线程才能获取到相应的Subject。  
> 最简单的办法就是通过 `execute(runnable/callable实例)` 直接调用；  
> 或者通过 `associateWith(runnable/callable实例)` 得到一个包装后的实例；  
> 它们都是通过：把当前线程的Subject绑定过去；在线程执行结束后自动释放。

Subject自己不会实现相应的身份验证/授权逻辑，而是通过DelegatingSubject委托给SecurityManager实现。

如果想自定义创建，可以通过：
```
new Subject.Builder().principals(身份).authenticated(true/false).buildSubject()
```

## Subject一般流程
* **身份验证**（login）
* **授权**（hasRole\*/isPermitted\*或checkRole\*/checkPermission\*）
* 将相应的数据存储到**会话**（Session）
* **切换身份**（RunAs）/**多线程**身份传播
* **退出**

> 必须的功能就是1、2、5。到目前为止我们就可以使用Shiro进行应用程序的安全控制了，但是还是缺少如对Web验证、Java方法验证等的一些简化实现。

# 总结
---
## Realm
* Permission
* Role
* User
* User-Role
* Role-Permission

## AuthenticationToken
* Principal
* Credentials
* RemeberMeAuthenticationToken
* HostAuthenticationToken
* UsernamePasswordToken

## AuthenticationInfo
* 提供身份信息
* 提供凭据验证
* SimpleAuthenticationInfo

## PrincipalCollection
* Principal
* MutablePrincipalCollection
* PrincipalMap

## AuthorizationInfo
* Roles
* StringPermissions
* ObjectPermissions
* SimpleAuthorizationInfo

## Subject
* 身份获取
* 身份验证
* 角色授权
* 权限授权
* 会话
* 退出
* RunAs
* 多线程

> 参考代码： `https://github.com/Gojay001/Demo/tree/master/ShiroTest/ShiroTest-chapter6`