# 微信保险版婚礼邀请网页

这个版本专门为微信内置浏览器做了简化：
- 不用 React
- 不用 Vite 前端打包
- 不用 type=module
- 只有 HTML + CSS + 传统 JavaScript
- Netlify 仍然可以用 `npm run build` 输出到 `dist`

## 上传方式

把本文件夹里的内容上传到 GitHub：
- package.json
- build.js
- index.html
- README.md
- assets 文件夹

Netlify 保持：
- Build command: `npm run build`
- Publish directory: `dist`

## 后台入口

`你的网址/?admin=1`

密码：

`5201314`

## 改信息

直接在 `index.html` 里搜索：
- 陆承宇
- 苏晚宁
- 2026年10月1日
- 云玥国际酒店
- 上海市浦东新区滨江大道88号

替换成自己的内容。
