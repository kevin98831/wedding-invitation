<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover">
  <title>婚礼后台</title>
  <style>
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  margin:0;color:#5a352f;background:#f3e6d7;
  font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",Arial,sans-serif;
  background-image:radial-gradient(circle at 15% 5%,rgba(255,255,255,.9),transparent 24%),radial-gradient(circle at 85% 20%,rgba(188,37,42,.14),transparent 28%),linear-gradient(180deg,#f8efe6 0%,#ecd0c7 58%,#f6e7d9 100%);
}
button,input,select,textarea{font:inherit}
a{text-decoration:none;color:inherit}
.page{max-width:760px;margin:0 auto;padding:10px 10px 96px}
.top{position:sticky;top:0;z-index:12;display:flex;align-items:center;justify-content:space-between;padding:8px 4px 10px;background:linear-gradient(180deg,rgba(248,239,230,.96),rgba(248,239,230,.65));backdrop-filter:blur(10px)}
.pill{display:inline-flex;align-items:center;gap:6px;border:0;border-radius:999px;background:rgba(255,251,244,.9);padding:9px 14px;box-shadow:0 8px 20px rgba(93,55,35,.12);font-size:13px;color:#7b5448}
.iconBtn{width:42px;height:42px;border:0;border-radius:50%;background:rgba(255,251,244,.9);box-shadow:0 8px 20px rgba(93,55,35,.12);color:#a92328}
.posterWrap{border-radius:28px;overflow:hidden;border:1px solid rgba(255,255,255,.88);box-shadow:0 24px 75px rgba(91,51,30,.20);background:#fff7ec}
.poster{display:block;width:100%;height:auto}
.card{margin-top:16px;border:1px solid #e4ccb1;background:rgba(255,250,241,.93);border-radius:26px;box-shadow:0 16px 44px rgba(91,51,30,.13);padding:18px}
.title{margin:0;font-family:Georgia,"Songti SC",serif;font-size:24px;letter-spacing:.12em;color:#8d1f22;text-align:center}
.muted{font-size:13px;line-height:1.8;color:#815f55}
.video{position:relative;overflow:hidden;border-radius:22px;border:4px solid #fff;background:#111;box-shadow:0 16px 35px rgba(107,45,43,.20)}
video{display:block;width:100%;background:#111}
.infoGrid{display:grid;grid-template-columns:1fr;gap:10px;margin-top:14px}
.info{display:flex;gap:12px;border:1px solid #ead9c0;border-radius:20px;background:#fffdf8;padding:13px}
.dot{display:flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:50%;background:#a92328;color:white;font-weight:bold;flex:0 0 auto}
.label{font-size:12px;color:#8b6659}
.value{margin-top:2px;font-weight:650;color:#5e342f;line-height:1.45}
.photos{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:14px}
.photo{background:#fff;padding:7px 7px 16px;border-radius:9px;box-shadow:0 12px 25px rgba(91,51,30,.16)}
.photo:nth-child(1){transform:rotate(-2deg)}.photo:nth-child(2){transform:rotate(2deg)}.photo:nth-child(3){transform:rotate(-3deg)}
.photo img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:4px}
.photo div{text-align:center;font-size:11px;color:#8b6659;margin-top:5px}
.form{display:grid;gap:12px;margin-top:16px}
.field label{display:block;margin-bottom:7px;font-size:13px;color:#8b6659}
input,select,textarea{width:100%;border:1px solid #eadbc5;background:#fffdf7;border-radius:999px;padding:13px 14px;outline:none;color:#5a352f}
textarea{border-radius:20px;min-height:88px;resize:vertical}
.btn{display:inline-flex;align-items:center;justify-content:center;width:100%;border:0;border-radius:999px;background:#a92328;color:#fff;padding:14px 18px;font-weight:700;letter-spacing:.12em;box-shadow:0 12px 30px rgba(169,35,40,.28)}
.btn2{background:#fff9ee;color:#8e342f;border:1px solid #d7b98a;box-shadow:none}
.msg{display:none;margin-top:10px;border-radius:16px;background:#fff1e3;padding:10px 12px;font-size:13px;color:#8d342f}
.quick{position:fixed;left:12px;right:12px;bottom:12px;z-index:30;max-width:740px;margin:auto;border:1px solid #e2c8aa;background:rgba(255,250,241,.95);border-radius:24px;box-shadow:0 16px 45px rgba(91,51,30,.22);backdrop-filter:blur(10px);padding:8px}
.quickGrid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}
.quick a,.quick button{display:flex;align-items:center;justify-content:center;border:0;border-radius:18px;background:transparent;color:#7c564c;padding:10px 5px;font-size:12px}
.quick .red{background:#a92328;color:#fff;font-weight:700}
.statGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:12px}
.stat{border:1px solid #ead9c0;border-radius:18px;background:rgba(255,255,255,.6);padding:12px;text-align:center}
.stat b{display:block;font-size:22px;color:#8d1f22}
.guest{border:1px solid #ead9c0;border-radius:18px;background:rgba(255,255,255,.66);padding:13px;margin-top:10px}
.guestTop{display:flex;justify-content:space-between;gap:10px}
.smallBtn{border:0;border-radius:999px;background:#fff5e8;color:#a92328;padding:8px 10px;margin-left:5px}
@media(min-width:640px){
  .page{padding-top:16px}
  .infoGrid{grid-template-columns:1fr 1fr}
  .form{grid-template-columns:1fr 1fr}
  .full{grid-column:1/-1}
}
</style>
</head>
<body>
  <main class="page">
    <div class="top">
      <a class="pill" href="index.html">← 返回邀请函</a>
      <a class="pill" href="rsvp.html">来宾登记</a>
    </div>

    <section id="loginBox" class="card">
      <h1 class="title" style="text-align:left">管理员登录</h1>
      <p class="muted">默认密码：5201314</p>
      <input id="adminPwd" type="password" placeholder="请输入后台密码">
      <button class="btn" style="margin-top:12px" onclick="adminLogin()">登录</button>
    </section>

    <section id="adminBox" style="display:none">
      <div class="card">
        <h1 class="title" style="text-align:left">后台管理</h1>
        <p class="muted">管理来宾登记信息</p>
        <div class="statGrid">
          <div class="stat"><b id="statTotal">0</b><span class="muted">登记数</span></div>
          <div class="stat"><b id="statAttend">0</b><span class="muted">参加人数</span></div>
          <div class="stat"><b id="statPending">0</b><span class="muted">待定</span></div>
        </div>
        <input id="search" oninput="renderGuests()" placeholder="搜索姓名、电话、忌口、备注" style="margin-top:12px">
        <div style="display:flex;gap:10px;margin-top:12px">
          <button class="btn" onclick="exportCSV()">导出 CSV</button>
          <button class="btn btn2" onclick="loadGuests()">刷新</button>
        </div>
      </div>
      <div id="guestList"></div>
    </section>
  </main>

  <div class="quick">
    <div class="quickGrid">
      <a href="index.html">邀请函</a>
      <a class="red" href="rsvp.html">登记</a>
      <a href="admin.html">后台</a>
    </div>
  </div>

  <script>
var SUPABASE_URL = "__SUPABASE_URL__";
var SUPABASE_KEY = "__SUPABASE_ANON_KEY__";
var cloudMode = !!(SUPABASE_URL && SUPABASE_KEY);
var guestCache = [];

function $(id){ return document.getElementById(id); }
function localGuests(){ try { return JSON.parse(localStorage.getItem('separate_rsvp_guests') || '[]'); } catch(e){ return []; } }
function saveLocal(list){ localStorage.setItem('separate_rsvp_guests', JSON.stringify(list)); }
function esc(s){ return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
function newId(){ return String(Date.now()) + String(Math.floor(Math.random()*10000)); }
function normalize(row){ return { id:row.id||newId(), name:row.name||'', gender:row.gender||'', phone:row.phone||'', side:row.side||'', attendance:row.attendance||'', guest_count:Number(row.guest_count||row.guestCount||1), dietary:row.dietary||'', note:row.note||'', created_at:row.created_at||row.createdAt||'' }; }

function adminLogin(){
  if($('adminPwd').value==='5201314'){
    sessionStorage.setItem('separate_admin_ok','1');
    $('loginBox').style.display='none';
    $('adminBox').style.display='block';
    loadGuests();
  } else alert('密码不正确');
}

function loadGuests(){
  if(cloudMode && window.fetch){
    fetch(SUPABASE_URL + '/rest/v1/wedding_guests?select=*&order=created_at.desc', { headers:{ 'apikey':SUPABASE_KEY, 'Authorization':'Bearer '+SUPABASE_KEY }})
    .then(function(r){ if(!r.ok) throw new Error('读取失败'); return r.json(); })
    .then(function(d){ guestCache=(d||[]).map(normalize); renderGuests(); })
    .catch(function(){ guestCache=localGuests().map(normalize); renderGuests(); });
  } else { guestCache=localGuests().map(normalize); renderGuests(); }
}

function renderGuests(){
  var q=($('search')&&$('search').value||'').toLowerCase();
  var list=guestCache.filter(function(g){ return !q || [g.name,g.phone,g.side,g.attendance,g.dietary,g.note].join(' ').toLowerCase().indexOf(q)>=0; });
  var attend=0,pending=0; guestCache.forEach(function(g){ if(g.attendance==='参加') attend+=Number(g.guest_count||1); if(g.attendance==='待定') pending++; });
  $('statTotal').innerHTML=guestCache.length; $('statAttend').innerHTML=attend; $('statPending').innerHTML=pending;
  if(!list.length){ $('guestList').innerHTML='<div class="card muted">暂无来宾数据</div>'; return; }
  var html='';
  list.forEach(function(g){ html+='<div class="guest"><div class="guestTop"><div><b>'+esc(g.name)+' '+esc(g.gender)+'</b><div class="muted">'+esc(g.phone||'未填写电话')+' · '+esc(g.side)+' · '+esc(g.attendance)+' · '+esc(g.guest_count)+'人</div><div class="muted">忌口：'+esc(g.dietary||'无')+' / 备注：'+esc(g.note||'无')+'</div></div><div><button class="smallBtn" onclick="deleteGuest(\\''+g.id+'\\')">删除</button></div></div></div>'; });
  $('guestList').innerHTML=html;
}

function deleteGuest(id){
  if(!confirm('确定删除这条登记信息吗？')) return;
  if(cloudMode && window.fetch && String(id).length>20){
    fetch(SUPABASE_URL + '/rest/v1/wedding_guests?id=eq.' + encodeURIComponent(id), { method:'DELETE', headers:{ 'apikey':SUPABASE_KEY, 'Authorization':'Bearer '+SUPABASE_KEY }}).then(loadGuests).catch(loadGuests);
  } else { var list=localGuests().filter(function(g){ return String(g.id)!==String(id); }); saveLocal(list); guestCache=list; renderGuests(); }
}

function exportCSV(){
  var rows=[['姓名','性别','电话','归属','是否出席','人数','忌口','备注','时间']];
  guestCache.forEach(function(g){ rows.push([g.name,g.gender,g.phone,g.side,g.attendance,g.guest_count,g.dietary,g.note,g.created_at]); });
  var csv=rows.map(function(row){ return row.map(function(cell){ return '"' + String(cell||'').replace(/"/g,'""') + '"'; }).join(','); }).join('\\n');
  var blob=new Blob(['\\ufeff'+csv],{type:'text/csv;charset=utf-8;'}); var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url; a.download='婚礼来宾登记.csv'; a.click(); URL.revokeObjectURL(url);
}

if(sessionStorage.getItem('separate_admin_ok')==='1'){ $('loginBox').style.display='none'; $('adminBox').style.display='block'; loadGuests(); }
</script>
</body>
</html>