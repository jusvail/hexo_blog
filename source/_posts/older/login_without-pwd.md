---
title: The SSH passwordless login for Linux VPS
cover: 
comments: true
date: 2018/12/9 13:22:25
categories:
- Linux
tags:
- ssh
- linux
---

Regarding SSH login on Linux, it's seemingly simple but I always forget which step. So, I'm writing it down now to prevent forgetting in the future.
<!-- more -->

### Steps

First, generate the public and private keys in the local terminal:

``` console
ssh-keygen -t rsa
```

Just press Enter all the way. Once done, transfer the local public key to the VPS:

``` console
scp ~/.ssh/id_rsa.pub user@hostname:~/.ssh/
```

Finally, add the transferred public key to ~/.ssh/authorized_keys on the VPS:

``` console
cat ~/.ssh/id_rsa.pub >~/.ssh/authorized_keys 
```

If the operation was performed as root, when SSHing, you might encounter:

``` console
WARNING: UNPROTECTED PRIVATE KEY FILE!
```

The error indicates that the private key is too exposed. Change the permissions to fix this:

``` console
chmod 600 ~/.ssh/id_rsa
```

You can also set up multiple VPS logins in ~/.ssh/config:

``` console
vi ~/.ssh/config

```

Add configurations like:

``` console
Host myvps
User username
HostName IP_or_domain_of_vps
Port 22 (default)
IdentityFile ~/.ssh/id_rsa
```

After that, you might still encounter permission issues mentioned above. Similarly, change the permission to 600:

``` console
chmod 600 ~/.ssh/config
```

All done!
