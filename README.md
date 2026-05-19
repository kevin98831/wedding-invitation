# 婚礼电子请帖 RSVP App

## 环境变量

在 Vercel 里添加：

VITE_SUPABASE_URL=你的 Supabase Project URL，不要带 /rest/v1/
VITE_SUPABASE_ANON_KEY=你的 Supabase Publishable key

注意：不要把 Secret key / service_role key 放到前端或发给别人。

## 本地运行

npm install
npm run dev

## 构建

npm run build
