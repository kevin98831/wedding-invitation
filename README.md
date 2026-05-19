# 婚礼邀请网页：干净分离版

这版按你的要求重新整理：

## 页面结构

- 首页：`/`
  - 只放婚礼邀请函、婚礼信息、视频、登记按钮
  - 不显示管理员入口

- 来宾登记页：`/rsvp.html`
  - 单独页面填写来宾信息

- 后台管理页：`/admin.html`
  - 首页不展示入口
  - 只有你知道这个地址
  - 密码：`5201314`

## Netlify 设置

```text
Build command: npm run build
Publish directory: dist
```

## 上传 GitHub 文件

上传这些：

```text
package.json
build.js
index.html
rsvp.html
admin.html
README.md
assets 文件夹
```
