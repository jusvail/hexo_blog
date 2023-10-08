---
title: Linux vps的ssh无密码登录
cover: 
comments: true
date: 2018/12/9 13:22:25
categories:
- Linux
tags:
- ssh
- linux
---

关于Linux的ssh登录，明明很简单但是总是哪一步会忘记。所以现在写下来防止以后忘记。
<!-- more -->

### 步骤

首先，在本地终端中创建公匙和私匙：
``` console
 # ssh-keygen -t rsa
```

一路回车。完成后将本地的公匙传到vps上：
``` console
 # scp ~/.ssh/id_rsa.pub user@主机IP:~/.ssh/
```
最后将传到vps上的公匙添加到~/.ssh/authorized_keys中就大功告成啦。
``` console
 # cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys 
```
可能是root进行的操作，ssh的时候会出现:
``` console
 # “WARNING: UNPROTECTED PRIVATE KEY FILE!”
```
看错误说明就很明显是私匙太暴露了，改下权限就OK了：
``` console
 # chmod 600 ~/.ssh/id_rsa
```
同时可以在~/.ssh/config中设置多个vps登录：
``` console
 # vi ~/.ssh/config
 # 
 # Host rus
 # User 用户名
 # HostName IP(vps的ip或者域名)
 # Port 22(默认)
 # IdentityFile ~/.ssh/id_rsa

```
好了之后依然可能出现上面的权限问题，同样把权限改成600就行了：
``` console
 # chmod 600 ~/.ssh/config
```

大功告成！！