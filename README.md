# 项目介绍

简单模拟 CSRF 攻击的 DEMO

# CSRF 简介

CSRF ，即跨站请求伪造，是一种网络攻击方式，，它在 2007 年曾被列为互联网 20 大安全隐患之一。其他安全隐患，比如 SQL 脚本注入，跨站域脚本攻击等在近年来已经逐渐为众人熟知，很多网站也都针对他们进行了防御。然而，对于大多数人来说，CSRF 却依然是一个陌生的概念。即便是大名鼎鼎的 Gmail, 在 2007 年底也存在着 CSRF 漏洞，从而被黑客攻击而使 Gmail 的用户造成巨大的损失。

# 你必须理解的前提

cookie 一般会随浏览器的请求而发送，重点是**该 cookie 的发送仅仅取决于目标服务器**，而不是你从哪个站点发送的。

所以，骇客可以伪造一个网站，诱导用户点击进来，在进来这一瞬间，则发送跨域请求目标服务器。此时，如果用户的 cookie 还存在的话，那么相当于带上了用户的身份信息发送了请求。

由于浏览器的同源策略，所以一般骇客是不会用 ajax 的，而是用 script 标签，或者 iframe 表单配合 form

在某个站点 B，模拟 GET 请求

```html
<script src="http://localhost:9000/transform?from=A&to=C"></script>
```

模拟 POST 请求

```html
<iframe style="display: none;" name="csrf-frame"></iframe>
<form
  method="post"
  action="http://localhost:9000/transform"
  target="csrf-frame"
  id="csrf-form"
>
  <input type="hidden" name="to" value="C" />
  <input type="hidden" name="from" value="A" />
  <input type="submit" value="submit" />
</form>
<script>
  document.getElementById("csrf-form").submit();
</script>
```

# 关于 Cookie

Cookie 的种下是由服务器端返回的响应报文`Set-Cookie`决定的。与安全相关的有以下几个指令。

- httponly : 不允许 js 操作 cookie，因为浏览器的同源策略，对于 csrf 来说并没什么卵用。
- domain : 指定哪些主机能接收 Cookie，如果不指定，默认为服务器的一级域名。如`baidu.com`。注意**是指定哪些主机能接收 cookie，而不是指定哪些站点能发送 cookie**
- path : 指定主机的哪些路径能够接收 cookie，如`/docs`。`docs/xxx`也能接收 cookie
- sameSite : IE8 以上都支持该字段，它可以制定策略发送 cookie，防止 csrf 攻击，有以下三种取值，`None、Strict、Lax`

说说 sameSite 的取值 :

- Lax(默认值) : 为跨站子请求保留，如图片加载，iframes 的调用
- Strict : 当且仅当浏览器的站点地址与目标接口的地址一致时才会发送 cookie
- None : 浏览器会在同站请求、跨站请求下继续发送 cookies，不区分大小写。

# 项目运行

```
yarn install
npm run bank
npm run hacker
```

访问 :

```
localhost:9000
localhost:10086
```

# 攻击模拟

本项目使用`koa`简单模拟`Hacker(骇客)`，与`Bank(银行)`两个角色，并在本地的响应端口模拟伪站(hacker) 与 主站(bank)

并尝试用 get、post 模拟跨站攻击。

# 防御模拟

- 很基本的一点是重要接口使用`POST`方式请求，而不是`GET`
- 后端校验 Referer 首部 ，但是 Refer 也是可以伪造的
- 加入验证码，重要操作之前加入这一步，基本可以打死 csrf
- csrf token
