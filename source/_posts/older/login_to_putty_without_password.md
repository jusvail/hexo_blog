---
title: Putty设置ssh自动登陆
cover: 
comments: true
date: 2017/10/2 20:46:25
categories:
- Linux
tags:
- putty
- linux
---

Putty是一个telnet、rlogin和ssh客户端，是一个在Windows平台下小巧且功能强大的远程连接客户端。然而Putty无法记用户名和密码，因此每次重新打开Putty都需要输入用户名和密码，很麻烦。特别的，如果长时间不操作，Putty的连接将断开，这时候需要重新启动Putty，体验很糟糕。
<!-- more -->
经过搜索一番后找到了配置Putty使用ssh登陆的方法，非常简单，最重要的是再也不用一遍遍的输入密码啦。

### 步骤

首先，使用PuTTYgen创建公匙和私匙。安装Putty时会附带一个ssh公匙私匙创建工具PuTTYgen，打开后可以直接点生成，生成的是默认的SSH-2 RSA key 2048位，此时你可以在面板上滑动鼠标生成密匙。生成完毕后可以不输入口令，这样就可以直接登陆。点击保存私匙，将它随便保存一个地方，如putty.ppk。然后将公匙也保存起来。

接着登陆你的VPS或云主机等等，将公匙复制到~/.ssh/authorized_keys文件中。如果VPS是刚装的系统，可能这个文件不存在，这时候只要简单的创建一个就好了。
``` console
 # mkdir ~/.ssh
 # touch ~/.ssh/authorized_keys
```

回到Putty，此时新建一个session，输入你的VPS等的ip地址和端口号，选择ssh登陆方式，然后在左边的目录中找到**连接/数据**，在"自动登陆用户名"中输入你的用户名，例如root；再在**连接/SSH/Auth**中，输入你刚刚生成的私匙文件的地址，比如D:\user\Documents\putty.ppk。然后回到session，点击**保存**。

现在每次登陆VPS就不用再输入账号密码啦，就很舒服~~