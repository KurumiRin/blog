## chmod/chown

### chown

    chown 更改文件的所属用户和组
    通过ls命令,第三列和第四列便是文件所属用户和用户组

```Bash
$ ls -lah .
total 1.2M
drwxr-xr-x 11 rin rin 4.0K Jun 22 18:42 .
drwxr-xr-x  5 root    root    4.0K Jun 24 11:06 ..
drwxr-xr-x  2 rin rin 4.0K Jun 10 15:45 .circleci
drwxr-xr-x  2 rin rin 4.0K Jun 10 15:45 .codesandbox
-rw-r--r--  1 rin rin  294 May 22  2021 .editorconfig
-rw-r--r--  1 rin rin  759 Jun 10 15:45 .eslintignore
-rw-r--r--  1 rin rin 8.4K Jun 10 15:45 .eslintrc.js
drwxr-xr-x  7 rin rin 4.0K Jun 14 19:06 .git
-rw-r--r--  1 rin rin   12 May 22  2021 .gitattributes
```

通过 `chown -R`可以将子文件的所属用户和用户组一起修改
例如 `chown -R rin:rin .` 将 . 文件夹下当前目录的用户及用户组设为 rin

### chmod

    chmod 更改文件的读写权限
    mode是值linux中对某个文件的访问权限
    可以通过stat获取某个文件的mode, stat -c %a 获取数字的mode , stat -c %A 获取可读化的mode

```Bash
# -c：--format
# %a：获得数字的 mode
$ stat -c %a README.md
644

# %A：获得可读化的 mode
$ stat -c %A README.md
-rw-r--r--
```

文件权限:

- r: 可读，二进制为 100，也就是 4
- w: 可写，二进制为 010，也就是 2
- x: 可执行，二进制为 001，也就是 1

用户分类:

- user 文件当前用户
- group 文件当前用户所属组
- other 其它用户

`rw-`当前用户可读可写,110 十进制 6
`r--`当前用户组可读,100 十进制 4
`r--`其他用户可读,100 十进制 4
所以数组 mode 为 644
可读华 mode 为 -rw-r--r--

通过 chmod 与数字所代表的权限，即可修改某个文件的权限。

```Bash
# 同理可得 777，即 rwx、rwx、rwx，代表所有用户可读可写可执行
$ chmod 777 yarn.lock
```

另外也可以以可读化形式添加权限:

```Bash
# u: user
# g: group
# o: other
# a: all
# +-=: 增加减少复制
# perms: 权限
$ chmod [ugoa...][[+-=][perms...]...]

# 为 yarn.lock 文件的用户所有者添加可读权限
$ chmod u+r yarn.lock

# 为所有用户添加 yarn.lock 的可读权限
$ chmod a+r yarn.lock

# 为所有用户删除 yarn.lock 的可读权限
$ chmod a-r yarn.lock
```
