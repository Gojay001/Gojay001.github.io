---
title: Learning JavaWeb Path  
date: 2017-11-18 15:25:34  
thumbnail: /gallery/thumbnails/Java.jpg  
categories:  
    - JavaWeb  
    - Project    
tags: [Java, Path]  
---

# 基本概念的理解
---
<!-- more -->
* **绝对路径**：绝对路径就是你的主页上的文件或目录在硬盘上真正的路径，(URL和物理路径)例如：`C:\xyz\test.txt`；`http://www.test.com/index.html`；
* **相对路径**：相对与某个基准目录的路径，例如：`"/"`代表Web应用的`根目录`，`"./"`代表`当前目录`,`"../"`代表`上级目录`。

> 另外关于URI，URL,URN等内容，请参考RFC相关文档标准。

# 关于JSP/Servlet中的相对路径和绝对路径
---
## 服务器端的地址
> 服务器端的相对地址指的是相对于你的web应用的地址，这个地址是在服务器端解析的（不同于`html`和`javascript`中的相对地址，他们是由客户端浏览器解析的）；  
> 在jsp和servlet中的相对地址应该是相对于你的web应用，即相对于`http://192.168.0.1/webapp/`的。
用到的地方：  
* **forward**：servlet中的request.getRequestDispatcher(address);这个address是在服务器端解析的。`request.getRequestDispatcher(“/pages/a.jsp”)`的绝对路径地址：`http://192.168.0.1/webapp/pages/a.jsp`；
* **sendRedirect**：在jsp中`<%response.sendRedirect("/user/a.jsp");%>`。

## 客户端的地址
> 所有的html页面中的相对地址都是相对于服务器根目录`http://192.168.0.1/`的，而`不是`根目录下的该Web应用的目录：`http://192.168.0.1/webapp/`。

* HTML中的**form表单的action属性**的地址应该是相对于服务器根目录`http://192.168.0.1/`；如果提交到a.jsp为：`action＝"/webapp/user/a.jsp"`或`action="<%=request.getContextPath()%>"/user/a.jsp`；
* **Javascript**也是在客户端解析的，所以其相对路径和form表单一样。
> 因此，一般情况下，在`JSP/HTML`页面等引用的`CSS`、`Javascript`、`Action`等属性前面最好都加上`<%=request.getContextPath()%>`,以确保所引用的文件都属于Web应用中的目录。  
> 另外，应该尽量避免使用类似`"."`,`"./"`,`"../"`等类似的相对该文件位置的相对路径，这样当文件移动时，很容易出问题。

## 站点根目录和css路径问题
> 当在`jsp中引入css`时，如果其相对路径相对于当前jsp文件的，而在一个和这个jsp的`路径不一样的servlet中forward`这个jsp时，就会发现这个css样式根本没有起作用。  
> 这是因为在servlet中转发时`css的路径`就是相对于这个`servlet的相对路径`，而非jsp的路径了。  
> 所以这时候不能在jsp中用这样的路径：`<link href="one.css" rel="stylesheet" type="text/css">`或者`<link href="../../one.css" rel="stylesheet" type="text/css">`。  
> 这个时候要用站点根目录，就是相对于`http://192.168.0.1/`的目录，以`"/"`开头。  
> 因此上述错误应更正为`href=”/test/one.css”` 类似的站点根目录的相对目录。

# 获得JSP/Servlet中当前应用的相对路径和绝对路径
---
## JSP中获得当前应用的相对路径和绝对路径
* **根目录**所对应的绝对路径:`request.getRequestURI()`;
* **文件**的绝对路径:`application.getRealPath(request.getRequestURI())`;
* **当前web应用**的绝对路径:`application.getRealPath("/")`;
* **请求文件的上层目录**:`new File(application.getRealPath(request.getRequestURI())).getParent()`;

## Servlet中获得当前应用的相对路径和绝对路径
* **根目录**所对应的绝对路径:`request.getServletPath()`;
* **文件**的绝对路径:`request.getSession().getServletContext().getRealPath(request.getRequestURI())`;
* **当前web应用**的绝对路径:`servletConfig.getServletContext().getRealPath("/")`;
> **ServletContext对象**获得几种方式：  
> javax.servlet.http.HttpSession.getServletContext();  
> javax.servlet.jsp.PageContext.getServletContext();  
> javax.servlet.ServletConfig.getServletContext(); 

# JAVA的Class中获得相对路径，绝对路径
---
## 单独的Java类中获得绝对路径
> 根据`java.io.File`的Doc文挡，可知:  
>  默认情况下`new File("/")`代表的目录为：`System.getProperty("user.dir")`;  
> 程序获得执行类的当前路径:

```
import java.io.File;
public class FileTest {
    public static void main(String[] args) throws Exception {      
        System.out.println(Thread.currentThread().getContextClassLoader().getResource(""));    
        System.out.println(FileTest.class.getClassLoader().getResource(""));
　      System.out.println(ClassLoader.getSystemResource(""));        
        System.out.println(FileTest.class.getResource(""));        
        System.out.println(FileTest.class.getResource("/"));//Class文件所在路径  
        System.out.println(new File("/").getAbsolutePath());   
        System.out.println(System.getProperty("user.dir"));    
    }
}
```

## 服务器中的Java类获得当前路径

### Weblogic
> WebApplication的系统文件根目录是你的weblogic安装所在根目录。  
> 例如：如果你的weblogic安装在`c:\bea\weblogic700.....`  
> 那么，你的文件根路径就是`c:\`  
> 所以，有两种方式能够让你访问你的服务器端的文件:  
> 1. 使用**绝对路径**：  
> 比如将你的参数文件放在c:\yourconfig\yourconf.properties，直接使用`new FileInputStream("yourconfig/yourconf.properties")`;  
> 2. 使用**相对路径**：  
> 相对路径的根目录就是你的`webapplication的根路径`，即WEB-INF的上一级目录，将你的参数文件放在`yourwebapp\yourconfig\yourconf.properties`，这样使用：`new FileInputStream("./yourconfig/yourconf.properties")`;

### Tomcat
> 在类中输出`System.getProperty("user.dir");`显示的是`%Tomcat_Home%/bin`

### 如何读相对路径哪?
> 在Java文件中`getResource`或`getResourceAsStream`均可。  
> 例：`getClass().getResourceAsStream(filePath)`;filePath可以是"/filename",这里的/代表web发布根路径下`WEB-INF/classes`。

参考文档：[java路径问题](http://huttoncs.iteye.com/blog/2270670)
