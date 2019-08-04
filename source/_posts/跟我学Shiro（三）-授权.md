---
title: 跟我学Shiro（三）-授权  
date: 2017-11-23 11:41:24  
categories:   
    - JavaWeb  
    - Shiro  
tags: [Java, Shiro]  
---

# 简介
**授权**：也叫访问控制，即在应用中控制谁能访问哪些资源（如访问页面/编辑数据/页面操作等）。在授权中需了解的几个关键对象：`主体`（Subject）、`资源`（Resource）、`权限`（Permission）、`角色`（Role）。
<!-- more -->
* **主体**：即访问应用的用户，在Shiro中使用Subject代表该用户。用户只有授权后才允许访问相应的资源。
* **资源**：在应用中用户可以访问的任何东西，比如访问JSP页面、查看/编辑某些数据、访问某个业务方法、打印文本等等都是资源。用户只要授权后才能访问。
* **权限**：安全策略中的原子授权单位，通过权限我们可以表示在应用中用户有没有操作某个资源的权力。
* **角色**：角色代表了操作集合，可以理解为权限的集合，一般情况下我们会赋予用户角色而不是权限，即这样用户可以拥有一组权限，赋予权限时比较方便。
* **隐式角色**：即直接通过角色来验证用户有没有操作权限。
* **显式角色**：在程序中通过权限控制谁能访问某个资源，角色聚合一组权限集合。

> **了解更多**：搜索`“RBAC”`和`“RBAC新解”`分别了解`“基于角色的访问控制”`和`“基于资源的访问控制”`。

# 授权方式
> Shiro支持三种方式的授权。

## 编程式
通过写if/else授权代码块完成： 
```
Subject subject = SecurityUtils.getSubject();  
if(subject.hasRole(“admin”)) {  
    //有权限  
} else {  
    //无权限  
}
```

## 注解式
通过在执行的Java方法上放置相应的注解完成： 
```
@RequiresRoles("admin")  
public void hello() {  
    //有权限  
} 
```
没有权限将抛出相应的异常。

## JSP/GSP标签
在JSP/GSP页面通过相应的标签完成：
```
<shiro:hasRole name="admin">  
<!— 有权限 —>  
</shiro:hasRole>
```

# 授权

## 基于角色的访问控制（隐式角色）

### 在ini配置文件配置用户拥有的角色
> shiro-role.ini

```
[users]
root=root,role1,role2
gojay=test,role1
```
> **规则**：`“用户名=密码,角色1，角色2”`，如果需要在应用中判断用户是否有相应角色，就需要在相应的Realm中返回角色信息；也就是说`Shiro不负责维护用户-角色信息`，需要应用提供，Shiro只是提供相应的接口方便验证。

### 测试用例
> com.github.gojay001.test.RoleTest

```
@Test
public void testHasRole() {
    login("classpath:shiro-role.ini", "root", "root");
    // 判断拥有角色：role1
    Assert.assertTrue(subject().hasRole("role1"));
    // 判断拥有角色：role1 and role2
    Assert.assertTrue(subject().hasAllRoles(Arrays.asList("role1", "role2")));
    // 判断拥有角色：role1 and role2 and !role3
    boolean[] result = subject().hasRoles(Arrays.asList("role1", "role2", "role3"));
    Assert.assertEquals(true, result[0]);
    Assert.assertEquals(true, result[1]);
    Assert.assertEquals(false, result[2]);
}
```
> Shiro提供了`hasRole/hasAllRoles`用于判断用户是否拥有某个角色/某些权限；但是没有提供如hashAnyRole用于判断是否有某些权限中的某一个。

```
@Test(expected = UnauthorizedException.class)
public void testCheckRole() {
    login("classpath:shiro-role.ini", "root", "root");
    // 断言拥有角色：role1
    subject().checkRole("role1");
    // 断言拥有角色：role1 and role3 失败抛出异常
    subject().checkRoles("role1", "role3");
}
```
> Shiro提供的`checkRole/checkRoles`和`hasRole/hasAllRoles`不同的地方是它在判断为假的情况下会`抛出UnauthorizedException异常`。

**基于角色的访问控制**（即隐式角色）的缺点：如果很多地方进行了角色判断，但是有一天不需要了那么就需要修改相应代码把`所有相关的地方`进行删除；这就是粗粒度造成的问题。

## 基于资源的访问控制（显式角色）

### 在ini配置文件配置用户拥有的角色及角色-权限关系
> shiro-permission.ini

```
[users]
root=root,role1,role2
gojay=test,role1
[roles]
role1=user:create,user:update
role2=user:create,user:delete
```
> **规则**：`“用户名=密码，角色1，角色2”“角色=权限1，权限2”`，即首先根据用户名找到角色，然后根据角色再找到权限；即角色是权限集合；Shiro同样不进行权限的维护，需要我们通过Realm返回相应的权限信息。只需要维护“用户——角色”之间的关系即可。

### 测试用例
> com.github.gojay001.test.PermissionTest

```
@Test
public void testIsPermitted() {
    login("classpath:shiro-permission.ini", "root", "root");
    // 判断拥有权限：user:create
    Assert.assertTrue(subject().isPermitted("user:create"));
    // 判断拥有权限：user:update and user:delete
    Assert.assertTrue(subject().isPermittedAll("user:update", "user:delete"));
    // 判断没有权限：user:view
    Assert.assertFalse(subject().isPermitted("user:view"));
}
```
> Shiro提供了`isPermitted`和`isPermittedAll`用于判断用户是否拥有某个权限或所有权限，也`没有提供如isPermittedAny`用于判断拥有某一个权限的接口。

```
@Test(expected = UnauthorizedException.class)
public void testCheckPermission() {
    login("classpath:shiro-permission.ini", "root", "root");
    // 断言拥有权限：user:create
    subject().checkPermission("user:create");
    // 断言拥有权限：user:delete and user:update
    subject().checkPermissions("user:delete", "user:update");
    // 断言拥有权限：user:view 失败抛出异常
    subject().checkPermissions("user:view");
}
```
> `checkPermissions`失败的情况下会抛出UnauthorizedException异常。

**基于资源的访问控制**（显式角色），也可以叫基于权限的访问控制，这种方式的一般规则是`“资源标识符：操作”`，即是资源级别的粒度；这种方式的好处就是如果要修改基本都是一个资源级别的修改，不会对其他模块代码产生影响，粒度小。但是实现起来可能稍微复杂点，需要维护“用户——角色，角色——权限（资源：操作）”之间的关系。 

# Permission
**字符串通配符权限**  
**规则**：`“资源标识符：操作：对象实例ID”`  即对哪个资源的哪个实例可以进行什么操作。其默认支持通配符权限字符串，`“:”`表示资源/操作/实例的分割；`“,”`表示操作的分割；`“*”`表示任意资源/操作/实例。

## 单个资源单个权限
```
subject().checkPermissions("system:user:update");
```
> 用户拥有资源`“system:user”`的`“update”`权限。

## 单个资源多个权限
ini配置文件：
```
role41=system:user:update,system:user:delete
```
通过判断：
```
subject().checkPermissions("system:user:update", "system:user:delete");
```
可以简写为：`"system:user:update,delete"`
> 用户拥有资源`“system:user”`的`“update”`和`“delete”`权限。

## 单个资源全部权限
ini配置：
```
role51="system:user:create,update,delete,view" 
```
通过判断：
```
subject().checkPermissions("system:user:create,delete,update:view");
```
可以简写为：`system:user:*`
> 用户拥有资源`“system:user”`的`“create”`、`“update”`、`“delete”`和`“view”`所有权限。

## 所有资源全部权限
ini配置：
```
role61=*:view
```
通过判断：
```
subject().checkPermissions("user:view");
```
> 用户拥有所有资源的`“view”`所有权限。

## 实例级别的权限

### 单个实例单个权限
ini配置：
```
role71=user:view:1
```

通过判断：
```
subject().checkPermissions("user:view:1");
```
> 对资源user的1实例拥有view权限。

### 单个实例多个权限
ini配置：
```
role72="user:update,delete:1"
```

通过判断：
```
subject().checkPermissions("user:delete,update:1");  
subject().checkPermissions("user:update:1", "user:delete:1");
```
> 对资源user的1实例拥有update、delete权限。

### 单个实例所有权限
ini配置：
```
role73=user:*:1
```

通过判断：
```
subject().checkPermissions("user:update:1", "user:delete:1", "user:view:1");
```
> 对资源user的1实例拥有所有权限。

### 所有实例单个权限
ini配置：
```
role74=user:auth:*
```

通过判断：
```
subject().checkPermissions("user:auth:1", "user:auth:2"); 
```
> 对资源user的1实例拥有所有权限。

### 所有实例所有权限
ini配置：
```
role75=user:*:*
```

通过判断：
```
subject().checkPermissions("user:view:1", "user:auth:2"); 
```
> 对资源user的1实例拥有所有权限。

## Shiro对权限字符串缺失部分的处理
* 如`user:view` 等价于 `user:view:*`；  
`organization` 等价于 `organization:*` 或者 `organization:*:*`。  
可以这么理解，这种方式实现了**前缀匹配**。
* 如`user:*` 可以匹配 `user:delete`；  
`user:delete` 可以匹配 `user:delete:1`；  
`user:*:1` 可以匹配 `user:view:1`；  
`user` 可以匹配 `user:view` 或 `user:view:1`等。  
即\*可以匹配所有，不加\*可以进行前缀匹配；
* 如`*:view` 不能匹配 `system:user:view`；需要使用 `*:*:view`；  
即**后缀匹配**必须指定前缀（多个冒号就需要多个*来匹配）。

## WildcardPermission
如下两种方式是等价的：
```
subject().checkPermission("menu:view:1");  
subject().checkPermission(new WildcardPermission("menu:view:1"));
```
> 因此没什么必要的话使用字符串更方便。

## 性能问题
`通配符匹配`方式比`字符串匹配`来说是更复杂的，因此需要花费更长时间，但是一般系统的权限不会太多，且可以配合缓存来提供其性能，如果这样性能还达不到要求我们可以实现位操作算法实现性能更好的权限匹配。另外实例级别的权限验证如果数据量太大也不建议使用，可能造成查询权限及匹配变慢。可以考虑比如在sql查询时加上权限字符串之类的方式在查询时就完成了权限匹配。

# 授权流程
![3-1.png](https://i.loli.net/2019/08/04/uMhPXtxenUl51fv.png)

## 流程如下：
> 1. 首先调用`Subject.isPermitted*/hasRole*`接口，其会委托给SecurityManager，而`SecurityManager`接着会委托给`Authorizer`；
> 2. `Authorizer`是真正的授权者；如果我们调用如`isPermitted(“user:view”)`，其首先会通过`PermissionResolver`把字符串转换成相应的`Permission实例`；
> 3. 在进行授权之前，其会`调用相应的Realm`获取Subject相应的`角色/权限`用于匹配传入的角色/权限；
> 4. `Authorizer`会`判断`Realm的角色/权限是否和传入的`匹配`，如果有`多个Realm`，会委托给`ModularRealmAuthorizer`进行循环判断，如果匹配如isPermitted*/hasRole*会返回true，否则返回false表示授权失败。

* ModularRealmAuthorizer进行多Realm匹配流程：

> 1. 首先检查相应的`Realm`是否实现了`Authorizer`；
> 2. 如果实现了Authorizer，那么接着调用其相应的`isPermitted*/hasRole*接口`进行匹配；
> 3. 如果有一个`Realm匹配`那么将返回true，否则返回false。

* 如果Realm进行授权的话，应该继承AuthorizingRealm，其流程是：

> 1. 如果调用`hasRole*`，则直接获取`AuthorizationInfo.getRoles()`与传入的角色比较即可；
> 2. 如果调用如`isPermitted(“user:view”)`，首先通过`PermissionResolver`将权限字符串转换成相应的`Permission实例`，默认使用`WildcardPermissionResolver`，即转换为通配符的`WildcardPermission`；
> 3. 通过`AuthorizationInfo.getObjectPermissions()`得到`Permission实例集合`；通过`AuthorizationInfo. getStringPermissions()`得到字符串集合并通过PermissionResolver解析为`Permission实例`；然后获取用户的角色，并通过`RolePermissionResolver`解析角色对应的`权限集合`（默认没有实现，可以自己提供）；
> 4. 接着调用`Permission. implies(Permission p)`逐个与传入的权限比较，如果有`匹配`的则返回true，否则false。

# Authorizer
**Authorizer**的职责是进行授权（访问控制），提供了相应的角色/权限判断接口。`SecurityManager`继承了`Authorizer接口`，且提供了`ModularRealmAuthorizer`用于多Realm时的授权匹配。  
**PermissionResolver**用于解析权限字符串到Permission实例。   
**RolePermissionResolver**用于根据角色解析相应的权限集合。

* 可以通过如下ini配置更改`Authorizer`实现：
```
authorizer=org.apache.shiro.authz.ModularRealmAuthorizer  
securityManager.authorizer=$authorizer
```

* 设置`ModularRealmAuthorizer`的`permissionResolver`，其会自动设置到相应的Realm上（其实现了`PermissionResolverAware`接口），如：
```
permissionResolver=org.apache.shiro.authz.permission.WildcardPermissionResolver  
authorizer.permissionResolver=$permissionResolver 
```

* 设置`ModularRealmAuthorizer`的`rolePermissionResolver`，其会自动设置到相应的Realm上（其实现了`RolePermissionResolverAware`接口），如：
```
rolePermissionResolver=com.github.gojay001.permission.MyRolePermissionResolver  
authorizer.rolePermissionResolver=$rolePermissionResolver
```

## 示例

### ini配置
> shiro-jdbc-authorizer.ini

```
[main]
# 自定义authorizer
authorizer=org.apache.shiro.authz.ModularRealmAuthorizer
# 自定义permissionResolver
# permissionResolver=org.apache.shiro.authz.permission.WildcardPermissionResolver
permissionResolver=com.github.gojay001.permission.BitAndWildPermissionResolver
authorizer.permissionResolver=$permissionResolver
# 自定义rolePermissionResolver
rolePermissionResolver=com.github.gojay001.permission.MyRolePermissionResolver
authorizer.rolePermissionResolver=$rolePermissionResolver

securityManager.authorizer=$authorizer

# 自定义realm 一定要放在securityManager.authorizer赋值之后
# 因为调用setRealms会将realms设置给authorizer，并给各个Realm设置permissionResolver和rolePermissionResolver
jdbcRealm=org.apache.shiro.realm.jdbc.JdbcRealm
dataSource=com.alibaba.druid.pool.DruidDataSource
dataSource.driverClassName=com.mysql.jdbc.Driver
dataSource.url=jdbc:mysql://localhost:3306/shiro
dataSource.username=root
dataSource.password=root
jdbcRealm.dataSource=$dataSource
jdbcRealm.permissionsLookupEnabled=true
securityManager.realms=$jdbcRealm

```
> 不能使用`IniSecurityManagerFactory`创建的`IniRealm`，因为其初始化顺序的问题可能造成后续的初始化Permission造成影响。

### 定义BitAndWildPermissionResolver及BitPermission
> **BitPermission**用于实现位移方式的权限，如规则是：
权限字符串格式：`+资源字符串+权限位+实例ID`；以+开头中间通过+分割；权限：`0 表示所有权限`；`1 新增`（二进制：0001）、`2 修改`（二进制：0010）、`4 删除`（二进制：0100）、`8 查看`（二进制：1000）；如 `+user+10` 表示对资源user拥有`修改/查看`权限。

```
public class BitPermission implements Permission {
    private String resourceIdentify;
    private int permissionBit;
    private String instanceId;

    public BitPermission(String permissionString) {
        String[] array = permissionString.split("\\+");

        if (array.length > 1) {
            resourceIdentify = array[1];
        }

        if (StringUtils.isEmpty(resourceIdentify)) {
            resourceIdentify = "*";
        }

        if (array.length > 2) {
            permissionBit = Integer.valueOf(array[2]);
        }

        if (array.length > 3) {
            instanceId = array[3];
        }

        if (StringUtils.isEmpty(instanceId)) {
            instanceId = "*";
        }
    }

    public boolean implies(Permission permission) {
        if(!(permission instanceof BitPermission)) {
            return false;
        }
        BitPermission other = (BitPermission) permission;

        if(!("*".equals(this.resourceIdentify) || this.resourceIdentify.equals(other.resourceIdentify))) {
            return false;
        }

        if(!(this.permissionBit ==0 || (this.permissionBit & other.permissionBit) != 0)) {
            return false;
        }

        if(!("*".equals(this.instanceId) || this.instanceId.equals(other.instanceId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "BitPermission{" +
                "resourceIdentify='" + resourceIdentify + '\'' +
                ", permissionBit=" + permissionBit +
                ", instanceId='" + instanceId + '\'' +
                '}';
    }
}
```

**Permission接口**提供了`boolean implies(Permission p)方法`用于判断权限匹配的；
```
public class BitAndWildPermissionResolver implements PermissionResolver {  
    @Override  
    public Permission resolvePermission(String permissionString) {  
        if(permissionString.startsWith("+")) {  
            return new BitPermission(permissionString);  
        }  
        return new WildcardPermission(permissionString);  
    }  
} 
```
**BitAndWildPermissionResolver**实现了`PermissionResolver接口`，并根据权限字符串是否以“+”开头来解析权限字符串为BitPermission或WildcardPermission。

### 定义MyRolePermissionResolver
**RolePermissionResolver**用于根据角色字符串来解析得到权限集合。
```
public class MyRolePermissionResolver implements RolePermissionResolver {  
    @Override  
    public Collection<Permission> resolvePermissionsInRole(String roleString) {  
        if("role1".equals(roleString)) {  
            return Arrays.asList((Permission)new WildcardPermission("menu:*"));  
        }  
        return null;  
    }  
}
```

### 自定义Realm
使用**JdbcRealm**，需要做的操作如下：
* 执行`sql/shiro-init-data.sql` 插入相关的权限数据；
* 使用`shiro-jdbc-authorizer.ini配置文件`，需要`设置jdbcRealm.permissionsLookupEnabled为true`来开启权限查询。

> 这里也可以自定义实现Realm，可参考com.github.gojay001.realm.MyRealm

### 测试用例
```
@Test
public void testIsPermitted2() {
    login("classpath:shiro-jdbc-authorizer.ini", "root", "root");
    // 判断拥有权限：user:create
    Assert.assertTrue(subject().isPermitted("user1:update"));
    Assert.assertTrue(subject().isPermitted("user2:update"));
    // 通过二进制位的方式表示权限
    Assert.assertTrue(subject().isPermitted("+user1+2"));// 新增权限
    Assert.assertTrue(subject().isPermitted("+user1+8"));// 查看权限
    Assert.assertTrue(subject().isPermitted("+user2+10"));// 新增及查看

    Assert.assertFalse(subject().isPermitted("+user1+4"));// 没有删除权限

    Assert.assertTrue(subject().isPermitted("menu:view"));// 通过MyRolePermissionResolver解析得到的权限
}
```

# 总结

## 授权流程
* Subject.isPermitted\*/hasRole\*
* SecurityManager
* Authorizer
* PermissionResolver/RolePermissionResolver/Permission
* Realm

## Realm
* user
* role
* permission

## Security
* Authorizer
* PermissionResolver
* RolePermissionResolver
* Realm

## Subject
* hasRole/hasAllRoles
* checkRole/checkRoles
* isPermitted/isPermittedAll
* checkPermission/checkPermissions

> 参考代码：https://github.com/Gojay001/Demo/tree/master/ShiroTest/ShiroTest-chapter3
