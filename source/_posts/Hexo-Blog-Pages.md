---
title: Hexo+Blog+Pages  
date: 2019-08-07 00:21:43  
thumbnail: /gallery/thumbnails/hexo.jpg  
categories:   
    - Blog  
    - Hexo  
tags: [hexo, icarus]  
---

> This blog records the details about **building hexo blogs**, as well as deploying it to Github and Coding **Pages**.  
<!-- more -->
# Basic Installation
---
## Install **Node.js** and **Git**

### install **Node.js**
> Just go to the [website](https://nodejs.org/zh-cn/download/) and you can `download` it. Then, it will be installed at */usr/local/bin* .  
After that, you can `validate` it as follows:  

```
$ node -v
v10.16.0
$ npm -v
6.9.0
```

### install **Git**
Also, you can just [download](https://hexo.io/zh-cn/docs/) and `check` your git version as follows:  
```
$ Git --version
git version 2.20.1
```

## Install **Hexo**
Now, we can install the Hexo. Note that add `sudo` to solve the problem of permission. `-g` refers global install.
```
$ sudo npm install -g hexo-cli
```
> I have met some `problems` in this way, and through another way `solved` it: 
```
sudo npm install -g hexo-cli --unsafe-perm
```

## **Initialize** Hexo
1. Create a folder(e.g. `blog` ) and `cd` into it.
2. `Initialize` blog and download a series of files.
3. Install `npm` .
4. hexo `generate` and `server`.

```
$ mkdir blog
$ cd blog
$ sudo hexo init
$ sudo npm install
$ hexo g
$ hexo s
```

# Install **Themes**
---
> Note that there are more than one `_config.yml` in the blog file.  
> - one is in `root directory` .  
> - and every `themes directory` also have one.  

## Choose themes
It is possible for us to choose our own themes by the [website](https://hexo.io/themes/).   
For me, what I like is the [ hexo-theme-icarus](https://github.com/ppoffice/hexo-theme-icarus).  

## Download themes
Now, what we need to do is download it as follows:  
```
$ cd blog
$ git clone https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus
```

## Change themes
Then, for the `_config.yml` in `root directory` : Changing `theme: landscape` to `theme: yilia` .

## Reload hexo
Last, just reload hexo `generate` and `server` .

# **Customize** themes
---
> There are a lot of ways to define your own functions. For me, a simple way is finding a suitalbe theme and just download it. Besides, I visited all the `issues` and `documents` of offical github.  
The following is **core functions**. 

## "_config.yml"
This file in `root directory` represents the `global hexo settings` , and in themes directory just configure one theme.

### root directory
It includes `site` , `themes` , `deployment` , `sitemap` and so on. My complete configuration pushed at the [Github](https://github.com/Gojay001/Gojay001.github.io/blob/hexo/_config.yml) .

### icarus directory
Similarly, it contains important settings. Like `images` , `navbar` , `footer` , `search` , `comment`, ` widgets`, and other `plugins` .

## Pages & Domain
- **Pages**:  
There are `Github Page` and `Coding Page` could be choose. More details can be find in their websites.
- **Domain**:  
I register `.top` domain in **AliCloud** , following resolve the URL by `CNAME` .

## Sitemap
- baidusitemap.xml
- sitemap.xml(Google)

# **Conclusion**
---
This blog just mentioned kinds of core **keywords** , if you have any question about that, just `google` or `baidu` it and then solve it.

> Notes:  
> 1. **npm** usage: `sudo cnpm install xxx` to use taobao mirrors.  
> 2. daily **commands**: `hexo clean` , `hexo s -g` , `hexo d -g` .  

## Source Tree
```
.
├── _config.yml
├── package.json
├─.deploy_git
├─node_modules
├─public
├─scaffolds
├─source
  ├─_posts
  ├─about
  ├─gallery
  └─CNAME
└─themes
    ├─landscape
    └─icarus
      ├─_config.yml
      ├─source
      └─...
```

# **References**
> [1] [**Hexo** Documents](https://hexo.io/zh-cn/docs/)   
> [2] [**Icarus** Documents & Issues](https://github.com/ppoffice/hexo-theme-icarus)  
> [3] [customize **Icarus**](https://www.alphalxy.com/2019/03/customize-icarus/)  
> [4] [deploy **git** to Github & Coding](https://www.jianshu.com/p/934d4b501b18)  
> [5] [push **sitemap** to Baidu & Google](https://www.jianshu.com/p/7d3d87b52ad7?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)  
> [6] [**back up** hexo datas to Github](https://blog.csdn.net/u012195214/article/details/72721065)  