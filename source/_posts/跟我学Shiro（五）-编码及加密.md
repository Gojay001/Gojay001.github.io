---
title: 跟我学Shiro（五）-编码及加密  
date: 2017-11-29 14:54:50  
categories:  
	- JavaWeb  
	- Shiro  
tags: [Java, Shiro]  
---

在涉及到**密码存储**问题上，应该加密/生成密码摘要存储，而不是存储明文密码。
<!-- more -->

# 编码/解码
Shiro提供了 **base64** 和 **16进制字符串** 编码/解码的API支持，方便一些编码解码操作。Shiro内部的一些数据的存储/表示都使用了base64和16进制字符串。
```
String str = "hello";  
String base64Encoded = Base64.encodeToString(str.getBytes());  
String str2 = Base64.decodeToString(base64Encoded);  
Assert.assertEquals(str, str2);
```
通过如上方式可以进行`base64编码/解码`操作。

```
String str = "hello";  
String base64Encoded = Hex.encodeToString(str.getBytes());  
String str2 = new String(Hex.decode(base64Encoded.getBytes()));  
Assert.assertEquals(str, str2);
```
通过如上方式可以进行`16进制字符串编码/解码`操作。
> 还有一个可能经常用到的类`CodecSupport`，提供了`toBytes(str, "utf-8")` / `toString(bytes, "utf-8")`用于在byte数组/String之间转换。

# 散列（Hash）算法
**散列算法**一般用于`生成数据的摘要信息`，是一种不可逆的算法，一般适合存储密码之类的数据，常见的散列算法如MD5、SHA等。

一般进行散列时最好提供一个`salt`（盐），如用户名和ID（即盐）；这样散列的对象是“密码+用户名+ID”，这样生成的散列值相对来说更难破解。

## MD5
```
String str = "hello";  
String salt = "123";  
String md5 = new Md5Hash(str, salt).toString();//还可以转换为 toBase64()/toHex()
```
如上代码使用`MD5算法`通过盐“123”生成MD5散列。  
另外散列时还可以指定散列次数，如2次表示：md5(md5(str))：
`new Md5Hash(str, salt, 2).toString()`。

## SHA
```
String str = "hello";  
String salt = "123";  
String sha1 = new Sha256Hash(str, salt).toString();
```
使用`SHA256算法`生成相应的散列数据，另外还有如SHA1、SHA512算法。

## 通用的散列支持
```
String str = "hello";  
String salt = "123";  
//内部使用MessageDigest  
String simpleHash = new SimpleHash("SHA-1", str, salt).toString();
```
通过调用 `SimpleHash` 时指定散列算法，其内部使用了Java的 `MessageDigest` 实现。

为了方便使用，Shiro提供了 `HashService` ，默认提供了 `DefaultHashService` 实现。
```
// 默认算法SHA-512
DefaultHashService hashService = new DefaultHashService(); 
hashService.setHashAlgorithmName("SHA-512");
// 私盐，默认无
hashService.setPrivateSalt(new SimpleByteSource("123")); 
// 是否生成公盐，默认false
hashService.setGeneratePublicSalt(true);
// 用于生成公盐。默认就这个
hashService.setRandomNumberGenerator(new SecureRandomNumberGenerator());
// 生成Hash值的迭代次数
hashService.setHashIterations(1); 
  
HashRequest request = new HashRequest.Builder()  
            .setAlgorithmName("MD5").setSource(ByteSource.Util.bytes("hello"))  
            .setSalt(ByteSource.Util.bytes("123")).setIterations(2).build();  
String hex = hashService.computeHash(request).toHex(); 
```
* 首先创建一个 `DefaultHashService` ，默认使用`SHA-512算法`；
* 可以通过 `hashAlgorithmName` 属性修改算法；
* 可以通过 `privateSalt` 设置一个`私盐`，其在散列时自动与用户传入的公盐混合产生一个新盐；
* 可以通过 `generatePublicSalt` 属性在用户没有传入公盐的情况下是否生成`公盐`；
* 可以设置 `randomNumberGenerator` 用于生成`公盐`；
* 可以设置 `hashIterations` 属性来修改默认加密`迭代次数`；
* 需要构建一个 `HashRequest` ，传入算法、数据、公盐、迭代次数。

SecureRandomNumberGenerator用于**生成一个随机数**：
```
SecureRandomNumberGenerator randomNumberGenerator =  
     new SecureRandomNumberGenerator();  
randomNumberGenerator.setSeed("123".getBytes());  
String hex = randomNumberGenerator.nextBytes().toHex();
```

# 加密/解密
Shiro提供**对称式加密/解密算法**的支持，如AES、Blowfish等。  
当前还没有提供对非对称加密/解密算法支持，未来版本可能提供。

## AES算法实现
```
AesCipherService aesCipherService = new AesCipherService();
// 设置key长度
aesCipherService.setKeySize(128); 
//生成key  
Key key = aesCipherService.generateNewKey();  
String text = "hello";  
//加密  
String encrptText =   
aesCipherService.encrypt(text.getBytes(), key.getEncoded()).toHex();  
//解密  
String text2 =  
 new String(aesCipherService.decrypt(Hex.decode(encrptText), key.getEncoded()).getBytes());  
  
Assert.assertEquals(text, text2);
```

# PasswordService/CredentialsMatcher
Shiro提供了 `PasswordService` 及 `CredentialsMatcher` 用于提供**加密**密码及**验证**密码服务。
```
public interface PasswordService {  
    // 输入明文密码得到密文密码
    String encryptPassword(Object plaintextPassword) throws IllegalArgumentException;  
}
```
```
public interface CredentialsMatcher {  
    // 匹配用户输入的token的凭证（未加密）与系统提供的凭证（已加密）  
    boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info);  
} 
```
Shiro默认提供了**PasswordService**实现`DefaultPasswordService`；**CredentialsMatcher**实现`PasswordMatcher`及`HashedCredentialsMatcher`（更强大）。

## DefaultPasswordService配合PasswordMatcher实现简单的密码加密与验证服务

### 定义Realm
> com.github.gojay001.relam.MyRealm

```
public class MyRealm extends AuthorizingRealm {  
    private PasswordService passwordService;  
    public void setPasswordService(PasswordService passwordService) {  
        this.passwordService = passwordService;  
    }  
     // 省略doGetAuthorizationInfo，具体看代码   
    @Override  
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {  
        return new SimpleAuthenticationInfo(  
                "root",  
                passwordService.encryptPassword("root"),  
                getName());  
    }  
}
```
> 为了方便，直接注入一个`passwordService`来加密密码；实际使用时需要在`Service层`使用passwordService`加密`密码`并存储`到数据库。

### INI配置
> shiro-passwordservice.ini

```
[main]  
passwordService=org.apache.shiro.authc.credential.DefaultPasswordService  
hashService=org.apache.shiro.crypto.hash.DefaultHashService  
passwordService.hashService=$hashService  
hashFormat=org.apache.shiro.crypto.hash.format.Shiro1CryptFormat  
passwordService.hashFormat=$hashFormat  
hashFormatFactory=org.apache.shiro.crypto.hash.format.DefaultHashFormatFactory  
passwordService.hashFormatFactory=$hashFormatFactory  
  
passwordMatcher=org.apache.shiro.authc.credential.PasswordMatcher  
passwordMatcher.passwordService=$passwordService  
  
myRealm=com.github.gojay001.realm.MyRealm  
myRealm.passwordService=$passwordService  
myRealm.credentialsMatcher=$passwordMatcher  
securityManager.realms=$myRealm
```
* **passwordService**使用`DefaultPasswordService`，如果有必要也可以自定义；
* **hashService**定义散列密码使用的HashService，默认使用`DefaultHashService`（默认SHA-256算法）；
* **hashFormat**用于对散列出的值进行格式化，默认使用`Shiro1CryptFormat`，另外提供了Base64Format和HexFormat，对于有salt的密码请`自定义实现`ParsableHashFormat然后把salt格式化到散列值中；
* **hashFormatFactory**用于根据散列值得到散列的密码和salt；因为如果使用如SHA算法，那么会生成一个salt，此salt需要保存到散列后的值中以便之后与传入的密码比较时使用；默认使用`DefaultHashFormatFactory`；
* **passwordMatcher**使用`PasswordMatcher`，其是一个CredentialsMatcher实现；
* 将`credentialsMatcher`赋值给**myRealm**，myRealm间接继承了AuthenticatingRealm，其在调用getAuthenticationInfo方法获取到AuthenticationInfo信息后，会使用credentialsMatcher来验证凭据是否匹配，如果不匹配将抛出IncorrectCredentialsException异常。

> 测试用例参考： `com.github.gojay001.test.PasswordTest` ，包含JdbcRealm测试用例。  
> **缺点**：salt保存在散列值中，没有实现如密码重试次数限制。

## HashedCredentialsMatcher实现密码验证服务
Shiro提供了**CredentialsMatcher**的散列实现`HashedCredentialsMatcher`，和之前的PasswordMatcher不同的是，它只用于`密码验证`，且可以`提供自己的盐`，而不是随机生成盐，且生成密码散列值的算法需要自己写，因为能提供自己的盐。

### 生成密码散列值
此处我们使用`MD5算法`，“密码+盐（用户名+随机数）”的方式生成散列值：
```
String algorithmName = "md5";  
String username = "root";  
String password = "root";  
String salt1 = username;  
String salt2 = new SecureRandomNumberGenerator().nextBytes().toHex();  
int hashIterations = 2;  
  
SimpleHash hash = new SimpleHash(algorithmName, password, salt1 + salt2, hashIterations);  
String encodedPassword = hash.toHex();
```
如果要写用户模块，需要在新增用户/重置密码时使用如上算法保存密码，将`生成的密码`及`salt2`存入数据库。  
因为我们的散列算法是：md5(密码+username+salt2)。

### 生成Realm

#### 自定义Realm
> com.github.gojay001.realm.MyRealm2

```
protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
    // 用户名及salt1  
    String username = "liu"; 
    // 加密后的密码  
    String password = "202cb962ac59075b964b07152d234b70"; 
    String salt2 = "202cb962ac59075b964b07152d234b70";  
SimpleAuthenticationInfo ai =   
        new SimpleAuthenticationInfo(username, password, getName());  
    // 盐是用户名+随机数
    ai.setCredentialsSalt(ByteSource.Util.bytes(username+salt2)); 
        return ai;  
}
```
此处就是把步骤1中生成的相应数据组装为 `SimpleAuthenticationInfo` ，通过 `SimpleAuthenticationInfo` 的 `credentialsSalt` 设置盐， `HashedCredentialsMatcher` 会自动识别这个盐。

#### JdbcRealm
需要修改获取用户信息（包括盐）的sql： `“select password, password_salt from users where username = ?”` ；  
而我们的盐是由 `username+password_salt` 组成，所以需要通过如下ini配置（`shiro-jdbc-hashedCredentialsMatcher.ini`）修改：
```
jdbcRealm.saltStyle=COLUMN  
jdbcRealm.authenticationQuery=select password, concat(username,password_salt) from users where username = ?  
jdbcRealm.credentialsMatcher=$credentialsMatcher
```
* **saltStyle**表示使用`密码+盐`的机制，authenticationQuery第一列是密码，第二列是盐；
* 通过 `authenticationQuery` 指定密码及盐查询SQL。

### INI配置
> shiro-hashedCredentialsMatcher.ini

```
[main]  
credentialsMatcher=org.apache.shiro.authc.credential.HashedCredentialsMatcher  
credentialsMatcher.hashAlgorithmName=md5  
credentialsMatcher.hashIterations=2  
credentialsMatcher.storedCredentialsHexEncoded=true  
myRealm=com.github.gojay001.realm.MyRealm2  
myRealm.credentialsMatcher=$credentialsMatcher  
securityManager.realms=$myRealm
```
* 通过 `credentialsMatcher.hashAlgorithmName=md5` 指定散列算法为md5，需要和生成密码时的一样；
* `credentialsMatcher.hashIterations=2` ，散列迭代次数，需要和生成密码时的意义；
* `credentialsMatcher.storedCredentialsHexEncoded=true` 表示是否存储散列后的密码为16进制，需要和生成密码时的一样，默认是base64；

> 此处最需要注意的就是 `HashedCredentialsMatcher` 的算法需要和生成密码时的算法一样。另外HashedCredentialsMatcher会自动根据 `AuthenticationInfo` 的类型是否是 `SaltedAuthenticationInfo` 来`获取credentialsSalt盐`。

### 密码重试次数限制
如在1个小时内密码最多重试5次，如果尝试次数超过5次就锁定1小时，1小时后可再次重试，如果还是重试失败，可以锁定如1天，以此类推，防止密码被暴力破解。我们通过**继承HashedCredentialsMatcher**，且使用**Ehcache**记录`重试次数`和`超时时间`。

> com.github.gojay001.credentials.RetryLimitHashedCredentialsMatcher

```
public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {  
       String username = (String)token.getPrincipal();  
        //retry count + 1  
        Element element = passwordRetryCache.get(username);  
        if(element == null) {  
            element = new Element(username , new AtomicInteger(0));  
            passwordRetryCache.put(element);  
        }  
        AtomicInteger retryCount = (AtomicInteger)element.getObjectValue();  
        if(retryCount.incrementAndGet() > 5) {  
            //if retry count > 5 throw  
            throw new ExcessiveAttemptsException();  
        }  
  
        boolean matches = super.doCredentialsMatch(token, info);  
        if(matches) {  
            //clear retry count  
            passwordRetryCache.remove(username);  
        }  
        return matches;  
}
```
如上代码逻辑比较简单，即如果密码输入`正确`，`清除cache`中的记录；否则`cache中的重试次数+1`，如果超出5次那么抛出异常表示超出重试次数了。

# 总结

## 编码/解码
* Base64
* Hex
* Hash()

## 加密/解密
* 对称式加密/解密

## 加密/验证

### PasswordService
* DefaultPasswordService

### CredentialsMatcher
* PasswordMatcher
* HashedCredentialsMatcher

## DefaultPasswordService配合PasswordMatcher

### Realm
* 自定义Realm
* JdbcRealm

### ini配置
* passwordService
* hashService
* hashFormat
* hashFormatFactory
* passwordMatcher
* myRealm

## HashedCredentialsMatcher

### 生成Realm
* 使用MD5算法

### ini配置
* credentialsMatcher
* hashAlgorithmName
* hashIterations
* myRealm

### 添加密码重试次数限制
* 记录重试次数

> 参考代码： `https://github.com/Gojay001/Demo/tree/master/ShiroTest/ShiroTest-chapter5`