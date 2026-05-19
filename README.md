# 婚礼邀请网页：手绘猫咪 + 复古拼贴版

这是按你选定的最后一版 UI 做的婚礼电子请帖网页。

## 包含功能

- 手绘婚礼插画风首页
- 视频预告区域，已内置你上传的视频
- 视频帧拼贴相册
- 婚礼日期、时间、酒店、地址信息
- 来宾登记表
- 后台管理页面
  - 查看来宾
  - 编辑来宾
  - 删除来宾
  - 导出 CSV

## 后台入口

上线后访问：

```text
你的网址/?admin=1
```

默认后台密码：

```text
5201314
```

## Supabase 环境变量

如果你继续用之前的 Supabase，Netlify / Vercel 里保持这两个环境变量：

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

不配置也能本地演示，但数据只会保存在当前浏览器。

## 如何改新人信息

打开：

```text
src/App.jsx
```

修改开头的 `config`：

```js
groom: '陆承宇',
bride: '苏晚宁',
date: '2026年10月1日',
time: '18:18',
hotel: '云玥国际酒店',
address: '上海市浦东新区滨江大道88号',
```

## 如何换视频

替换：

```text
public/assets/wedding-film.mp4
```

或者修改 `src/App.jsx` 里的：

```js
videoUrl: '/assets/wedding-film.mp4'
```
