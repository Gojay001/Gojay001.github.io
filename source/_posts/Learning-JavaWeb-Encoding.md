---
title: Learning JavaWeb Encoding  
date: 2017-11-15 15:51:41  
thumbnail: /gallery/thumbnails/Java.jpg  
categories:  
    - JavaWeb  
    - Project    
tags: [Java, Encoding]  
---

# 项目配置
---
<!-- more -->

## 页面乱码
页面乱码只需设置相关 `字符集编码` 即可。  

### **JSP页面**：  
```
<%@ page pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" language="java" %>
```
`pageEncoding` :该页面编码格式；  
`charset` :页面解码格式；

### **HTML页面**：
```
<meta http-equiv=Content-Type content="text/html;charset=utf-8">
```

## 传值乱码
`页面` 到 `controller` 传值乱码需要在 **web.xml** 配置字符编码过滤器。  

### 直接应用 `spring` 中字符编码过滤器：
```
<!--字符编码-->
<filter>
    <filter-name>characterEncodingFilter</filter-name>
    <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
    <init-param>
        <param-name>encoding</param-name>
        <param-value>UTF-8</param-value>
    </init-param>
    <init-param>
        <param-name>forceEncoding</param-name>
        <param-value>true</param-value>
    </init-param>
</filter>
<filter-mapping>
    <filter-name>characterEncodingFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```
* 分析源码发现作用相当于servlet中：
```
request.setCharacterEncoding("UTF-8");  
response.setCharacterEncoding("UTF-8");  
```
* Spring自带过滤器主要针对POST请求，对GET请求无效。  
对于GET请求的参数乱码，解决方法是采用数据还原：
```
String userName = request.getParameter("userName");     
userName = new String(userName.getBytes("iso8859-1"),"UTF-8");
```
* `<url-pattern>` 中匹配说明：  
`/`: 不会匹配到*.jsp，但会匹配/login等路径类型的url；  
`/*`: 会匹配/login、*.jsp、*.html等路径；  

### 根据源码可 `自己编写` 字符编码过滤器：  
```
public class CharacterEncodingFilter implements Filter {
    private String encoding = null;
    private FilterConfig filterConfig = null;
    @Override
    public void init(FilterConfig config) throws ServletException {
        this.filterConfig = config;
        this.encoding = config.getInitParameter("encoding");
    }
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        if (encoding != null) {
            request.setCharacterEncoding(encoding);
            response.setContentType("text/html;charset=" + encoding);
        }
        chain.doFilter(request, response);
    }
}
```

## 存入数据库乱码
需要在 `数据库配置文件` 设置参数。
```
url=jdbc:mysql://gojay001.mysql.rds.aliyuncs.com:3306/trade?useUnicode=true&characterEncoding=utf8
```

# 环境配置
---
## Tomcat配置
在tomcat的 `conf/server.xml` 中配置Get请求默认编码：
```
<Connector port="8080" protocol="HTTP/1.1"  
      connectionTimeout="20000"  
      redirectPort="8443"   
      URIEncoding="UTF-8"  
      useBodyEncodingForURI="true"  
      />
```

## 数据库配置
安装mysql之后默认的字符编码为 `latin1` :  
1. 查看: 
```
$ show variables like '%char%';
```
2. `vi /etc/my.cf` 修改为下面内容后重启mysql：
```
[mysqld]
character_set_server=utf8
lower_case_table_names=1
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
user=mysql
symbolic-links=0
sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES 
[mysqld_safe]
default-character-set = utf8
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid
[client]
default-character-set = utf8
[mysql.server]
default-character-set = utf8
[mysql]
default-character-set = utf8
```

# 其他问题
---
* **HTML文件**显示乱码：
将编码格式保存为UTF-8包含BOM。