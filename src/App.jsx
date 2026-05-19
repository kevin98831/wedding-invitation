
import React, { useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  Heart,
  Music,
  Share2,
  CalendarDays,
  Clock3,
  Building2,
  MapPin,
  Play,
  UserRound,
  Phone,
  Utensils,
  Users,
  MessageCircleHeart,
  LockKeyhole,
  Download,
  Pencil,
  Trash2,
  Search,
  LogOut,
  Camera,
  Mail,
  Gift,
  Menu,
  ChevronRight,
} from 'lucide-react'

const env = import.meta.env || {}
const SUPABASE_URL = env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || ''
const isCloud = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
const supabase = isCloud ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null
const STORAGE_KEY = 'wedding_scrapbook_guests'
const ADMIN_KEY = 'wedding_scrapbook_admin'
const ADMIN_PASSWORD = '5201314'

const config = {
  groom: '陆承宇',
  bride: '苏晚宁',
  date: '2026年10月1日',
  time: '18:18',
  hotel: '云玥国际酒店',
  address: '上海市浦东新区滨江大道88号',
  slogan: '情不知所起，一往而情深',
  filmDuration: '01:27',
  videoUrl: '/assets/wedding-film.mp4',
  illustration: '/assets/illustration-bg.png',
}

const emptyGuest = {
  name: '',
  gender: '先生',
  phone: '',
  side: '新郎方',
  attendance: '参加',
  guestCount: 1,
  dietary: '',
  note: '',
}

function cx(...args) {
  return args.filter(Boolean).join(' ')
}

function newId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random())
}

function normalizeGuest(row) {
  return {
    id: row.id || newId(),
    name: row.name || '',
    gender: row.gender || '先生',
    phone: row.phone || '',
    side: row.side || '新郎方',
    attendance: row.attendance || '参加',
    guestCount: Number(row.guest_count ?? row.guestCount ?? 1) || 1,
    dietary: row.dietary || '',
    note: row.note || '',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  }
}

function toDb(row) {
  return {
    name: row.name,
    gender: row.gender,
    phone: row.phone,
    side: row.side,
    attendance: row.attendance,
    guest_count: Number(row.guestCount) || 1,
    dietary: row.dietary,
    note: row.note,
  }
}

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function writeLocal(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function useGuests() {
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    setLoading(true)
    if (isCloud) {
      const { data, error } = await supabase.from('wedding_guests').select('*').order('created_at', { ascending: false })
      if (!error) setGuests((data || []).map(normalizeGuest))
    } else {
      setGuests(readLocal())
    }
    setLoading(false)
  }

  const addGuest = async (guest) => {
    const item = normalizeGuest({ ...guest, id: newId(), createdAt: new Date().toISOString() })
    if (isCloud) {
      const { error } = await supabase.from('wedding_guests').insert(toDb(item))
      if (error) throw error
      await refresh()
    } else {
      const next = [item, ...readLocal()]
      writeLocal(next)
      setGuests(next)
    }
  }

  const updateGuest = async (guest) => {
    if (isCloud) {
      const { error } = await supabase.from('wedding_guests').update(toDb(guest)).eq('id', guest.id)
      if (error) throw error
      await refresh()
    } else {
      const next = readLocal().map((item) => (item.id === guest.id ? guest : item))
      writeLocal(next)
      setGuests(next)
    }
  }

  const deleteGuest = async (id) => {
    if (isCloud) {
      const { error } = await supabase.from('wedding_guests').delete().eq('id', id)
      if (error) throw error
      await refresh()
    } else {
      const next = readLocal().filter((item) => item.id !== id)
      writeLocal(next)
      setGuests(next)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return { guests, loading, refresh, addGuest, updateGuest, deleteGuest }
}

function Button({ children, className, variant = 'red', ...props }) {
  return (
    <button
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98]',
        variant === 'red'
          ? 'bg-[#a92328] text-white shadow-[0_12px_30px_rgba(169,35,40,0.28)] hover:bg-[#921b20]'
          : 'border border-[#d7b98a] bg-[#fff9ee]/85 text-[#8e342f] hover:bg-white',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function PaperCard({ children, className }) {
  return (
    <div className={cx('rounded-[28px] border border-[#e7d3b8] bg-[#fff9ef]/88 shadow-[0_16px_45px_rgba(91,51,30,0.12)] backdrop-blur', className)}>
      {children}
    </div>
  )
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center gap-2 text-sm text-[#8b6659]">
        {Icon ? <Icon className="h-4 w-4 text-[#a92328]" /> : null}
        {label}
      </div>
      {children}
    </label>
  )
}

function Input(props) {
  return <input className="w-full rounded-full border border-[#eadbc5] bg-[#fffdf7] px-4 py-3 text-sm text-[#5a352f] outline-none placeholder:text-[#b79b8c] focus:border-[#b83336] focus:ring-4 focus:ring-red-100" {...props} />
}

function Select(props) {
  return <select className="w-full rounded-full border border-[#eadbc5] bg-[#fffdf7] px-4 py-3 text-sm text-[#5a352f] outline-none focus:border-[#b83336] focus:ring-4 focus:ring-red-100" {...props} />
}

function Textarea(props) {
  return <textarea className="min-h-[92px] w-full rounded-[22px] border border-[#eadbc5] bg-[#fffdf7] px-4 py-3 text-sm text-[#5a352f] outline-none placeholder:text-[#b79b8c] focus:border-[#b83336] focus:ring-4 focus:ring-red-100" {...props} />
}

function Stamp({ children, className }) {
  return <span className={cx('inline-flex rotate-[-3deg] rounded border border-[#b2403d]/50 px-3 py-1 text-xs tracking-[0.16em] text-[#a92328]', className)}>{children}</span>
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute left-[-40px] top-10 h-24 w-24 rotate-[-18deg] rounded-full border-2 border-[#b2403d]/30" />
      <div className="absolute right-[-35px] top-48 h-20 w-20 rotate-12 rounded-full border-2 border-[#d1a876]/40" />

      <div className="mx-auto max-w-[820px] px-4 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#fff6ea]/75 px-4 py-2 text-sm text-[#6f4c42] shadow-sm backdrop-blur">
            <Music className="h-4 w-4 text-[#a92328]" /> 背景音乐
          </div>
          <button className="rounded-full bg-[#fff6ea]/75 p-3 text-[#a92328] shadow-sm backdrop-blur">
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        <div className="relative overflow-hidden rounded-[38px] border border-white/80 paper-texture shadow-[0_28px_90px_rgba(78,43,27,0.18)]">
          <div className="absolute inset-0 opacity-[0.16] mix-blend-multiply" style={{ backgroundImage: 'url(/assets/illustration-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center top' }} />

          <div className="relative px-6 pb-8 pt-8 sm:px-10">
            <div className="absolute right-5 top-7 rotate-[-12deg] rounded-full border border-[#a92328]/40 px-3 py-2 text-xs text-[#a92328]">
              forever love<br />2026.10.01
            </div>

            <div className="flex justify-center">
              <img src={config.illustration} alt="wedding illustration" className="h-[360px] w-full rounded-[28px] object-cover object-top shadow-[0_14px_45px_rgba(91,51,30,0.12)] sm:h-[460px]" />
            </div>

            <div className="mt-[-60px] rounded-[30px] border border-white/70 bg-[#fffaf1]/88 p-6 shadow-[0_18px_50px_rgba(91,51,30,0.14)] backdrop-blur">
              <Stamp>10.01</Stamp>
              <div className="mt-4">
                <div className="font-serif text-5xl italic leading-none text-[#8d1f22] sm:text-6xl">Wedding</div>
                <div className="mt-1 font-serif text-4xl text-[#8d1f22] sm:text-5xl">Invitation</div>
              </div>
              <p className="mt-5 text-lg tracking-[0.18em] text-[#5f3e37]">诚邀您见证我们的幸福时刻</p>
              <div className="mt-6 flex items-center gap-2 text-[#9e2f32]">
                <Heart className="h-4 w-4 fill-[#9e2f32]" />
                <div className="h-px flex-1 border-t border-dashed border-[#c79575]" />
              </div>
              <div className="mt-5 rounded-2xl border border-[#ead8bc] bg-[#fffdf8] px-4 py-3 text-center text-xl tracking-[0.12em] text-[#74342f]">
                新郎 <span className="font-bold text-[#9c2f2f]">{config.groom}</span>
                <span className="mx-2">·</span>
                新娘 <span className="font-bold text-[#9c2f2f]">{config.bride}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FilmSection() {
  return (
    <section className="mx-auto max-w-[820px] px-4 py-7">
      <PaperCard className="torn-top overflow-hidden bg-[#f2c9c0]/75 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-center font-serif text-2xl tracking-[0.16em] text-[#8d1f22]">♥ 我们的婚礼电影预告 ♥</div>
            <div className="mt-1 text-center text-sm tracking-[0.1em] text-[#7b5148]">记录属于我们的心动瞬间</div>
          </div>
          <Button className="hidden px-4 py-2 sm:inline-flex">
            点击播放 <Play className="h-3.5 w-3.5 fill-white" />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="video-card relative overflow-hidden rounded-[24px] border-4 border-white bg-stone-900 shadow-[0_16px_35px_rgba(107,45,43,0.2)]">
            <video src={config.videoUrl} poster="/assets/film-frame-1.jpg" controls playsInline className="aspect-video w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
            <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs text-[#8d1f22] backdrop-blur">
              <Camera className="h-3.5 w-3.5" /> Film Preview
            </div>
          </div>

          <div className="rounded-[24px] border border-[#ecd6cc] bg-[#fff8f0]/70 p-5">
            <div className="font-serif text-3xl leading-relaxed text-[#8d1f22]">
              情不知所起<br />一往而情深
            </div>
            <div className="mt-4 text-sm leading-7 text-[#75524b]">这支小小的婚礼预告，记录了我们最想和你分享的笑容、拥抱与心动瞬间。</div>
            <div className="mt-4 text-right text-[#8d1f22]">{config.filmDuration}</div>
          </div>
        </div>
      </PaperCard>
    </section>
  )
}

function InfoSection({ onRSVP }) {
  const items = [
    { icon: CalendarDays, label: '婚礼日期', value: config.date },
    { icon: Clock3, label: '时间', value: config.time },
    { icon: Building2, label: '酒店', value: config.hotel },
    { icon: MapPin, label: '地址', value: config.address },
  ]

  return (
    <section id="info" className="mx-auto max-w-[820px] px-4 pb-7">
      <PaperCard className="p-5 sm:p-7">
        <div className="mb-5 text-center font-serif text-xl tracking-[0.15em] text-[#763d35]">
          新郎：{config.groom} <span className="mx-3 text-[#b83a3d]">❤</span> 新娘：{config.bride}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.label} className="flex gap-4 rounded-[22px] border border-[#ecdcc5] bg-[#fffdf8] p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#a92328] text-white shadow-[0_10px_20px_rgba(169,35,40,0.22)]">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-[#8b6659]">{item.label}</div>
                <div className="mt-1 text-base font-medium leading-6 text-[#5e342f]">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button onClick={onRSVP} className="w-full max-w-md text-lg tracking-[0.2em] sm:w-auto sm:px-16">
            来宾登记 <Heart className="h-4 w-4 fill-white" />
          </Button>
        </div>
      </PaperCard>
    </section>
  )
}

function GallerySection() {
  const frames = ['/assets/film-frame-1.jpg', '/assets/film-frame-2.jpg', '/assets/film-frame-3.jpg']
  return (
    <section className="mx-auto max-w-[820px] px-4 pb-7">
      <div className="mb-4 flex items-center gap-2 text-[#9d2e32]">
        <div className="h-px flex-1 bg-[#d8b59b]" />
        <span className="font-serif text-xl tracking-[0.16em]">邀请您一起见证我们的幸福</span>
        <div className="h-px flex-1 bg-[#d8b59b]" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {frames.map((src, index) => (
          <div key={src} className={cx('rounded-[10px] bg-white p-2 shadow-[0_12px_25px_rgba(91,51,30,0.16)]', index === 1 ? 'rotate-2' : index === 2 ? '-rotate-3' : 'rotate-[-2deg]')}>
            <img src={src} alt="film frame" className="aspect-[3/4] w-full rounded object-cover" />
            <div className="mt-2 text-center text-xs text-[#8b6659]">Happy wedding</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function RSVPForm({ onSubmit, submitting, message }) {
  const [form, setForm] = useState(emptyGuest)
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onSubmit(form)
    setForm(emptyGuest)
  }

  return (
    <section id="rsvp" className="mx-auto max-w-[820px] px-4 pb-7">
      <PaperCard className="p-5 sm:p-7">
        <div className="mb-5 text-center">
          <div className="font-serif text-2xl tracking-[0.16em] text-[#763d35]">来宾登记</div>
          <div className="mt-2 text-sm text-[#8b6659]">期待您的祝福与到来</div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field label="姓名" icon={UserRound}><Input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="请输入姓名" /></Field>
          <Field label="性别" icon={Users}>
            <Select value={form.gender} onChange={(e) => update('gender', e.target.value)}>
              <option>先生</option>
              <option>女士</option>
              <option>小朋友</option>
            </Select>
          </Field>
          <Field label="联系电话" icon={Phone}><Input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="方便婚礼前联系" /></Field>
          <Field label="来宾归属" icon={MailHeart}>
            <Select value={form.side} onChange={(e) => update('side', e.target.value)}>
              <option>新郎方</option>
              <option>新娘方</option>
              <option>共同好友</option>
              <option>亲友</option>
            </Select>
          </Field>
          <Field label="是否出席" icon={Users}>
            <Select value={form.attendance} onChange={(e) => update('attendance', e.target.value)}>
              <option>参加</option>
              <option>待定</option>
              <option>遗憾缺席</option>
            </Select>
          </Field>
          <Field label="出席人数" icon={Users}><Input type="number" min="1" max="10" value={form.guestCount} onChange={(e) => update('guestCount', e.target.value)} /></Field>
          <div className="sm:col-span-2"><Field label="忌口 / 饮食偏好" icon={Utensils}><Input value={form.dietary} onChange={(e) => update('dietary', e.target.value)} placeholder="如：海鲜过敏、不吃辣、素食" /></Field></div>
          <div className="sm:col-span-2"><Field label="祝福留言 / 备注" icon={MessageCircleHeart}><Textarea value={form.note} onChange={(e) => update('note', e.target.value)} placeholder="想对新人说的话，也可以写在这里" /></Field></div>

          <div className="sm:col-span-2">
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? '提交中...' : '提交登记'} <ChevronRight className="h-4 w-4" />
            </Button>
            {message ? <div className="mt-3 rounded-2xl bg-[#fff1e3] px-4 py-3 text-sm text-[#8d342f]">{message}</div> : null}
          </div>
        </form>
      </PaperCard>
    </section>
  )
}

function BlessingSection({ onAdmin }) {
  return (
    <section className="mx-auto max-w-[820px] px-4 pb-20">
      <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
        <PaperCard className="p-5">
          <div className="flex items-center gap-3 text-[#763d35]">
            <Gift className="h-5 w-5 text-[#a92328]" />
            <div className="font-serif text-xl">来宾留言墙</div>
          </div>
          <div className="mt-3 rounded-2xl bg-white/70 p-4">
            <div className="text-sm font-medium text-[#5f3e37]">小幸运</div>
            <div className="mt-1 text-xs text-[#9c8174]">2026-10-01 18:18</div>
            <div className="mt-2 text-sm text-[#75524b]">新婚快乐！百年好合，永结同心 ❤️❤️</div>
          </div>
        </PaperCard>
        <PaperCard className="p-5">
          <div className="flex items-center gap-3 text-[#763d35]">
            <LockKeyhole className="h-5 w-5 text-[#a92328]" />
            <div className="font-serif text-xl">管理员入口</div>
          </div>
          <p className="mt-3 text-sm leading-7 text-[#8b6659]">登录后可管理来宾信息，编辑、删除、导出名单。</p>
          <Button onClick={onAdmin} className="mt-4 w-full">管理员登录</Button>
        </PaperCard>
      </div>
      <div className="mt-7 text-center text-xs tracking-[0.14em] text-[#9d7666]">♡ © 2026 我们结婚啦 · 感谢您的祝福与见证 ♡</div>
    </section>
  )
}

function BottomNav({ onRSVP, onAdmin }) {
  return (
    <div className="fixed bottom-3 left-1/2 z-40 w-[calc(100%-24px)] max-w-[760px] -translate-x-1/2 rounded-[24px] border border-[#e7d3b8] bg-[#fffaf0]/92 px-2 py-2 shadow-[0_15px_40px_rgba(91,51,30,0.18)] backdrop-blur">
      <div className="grid grid-cols-4 text-xs text-[#7f574d]">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[#a92328]"><Mail className="h-5 w-5" />邀请函</button>
        <button onClick={() => document.getElementById('info')?.scrollIntoView({ behavior: 'smooth' })} className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2"><CalendarDays className="h-5 w-5" />婚礼信息</button>
        <button onClick={onRSVP} className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2"><Pencil className="h-5 w-5" />来宾登记</button>
        <button onClick={onAdmin} className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2"><MessageCircleHeart className="h-5 w-5" />后台</button>
      </div>
    </div>
  )
}

function AdminPanel({ guests, loading, onDelete, onUpdate, onExit }) {
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState(emptyGuest)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return guests
    return guests.filter((g) => [g.name, g.phone, g.side, g.attendance, g.dietary, g.note].join(' ').toLowerCase().includes(q))
  }, [guests, query])

  const totalPeople = guests.filter((g) => g.attendance === '参加').reduce((sum, g) => sum + Number(g.guestCount || 0), 0)

  const exportCsv = () => {
    const header = ['姓名', '性别', '电话', '归属', '是否出席', '人数', '忌口', '备注', '时间']
    const rows = guests.map((g) => [g.name, g.gender, g.phone, g.side, g.attendance, g.guestCount, g.dietary, g.note, g.createdAt])
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '婚礼来宾登记.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const save = async () => {
    await onUpdate({ ...draft, id: editing })
    setEditing(null)
  }

  return (
    <div className="min-h-screen paper-texture px-4 py-5 text-[#5a352f]">
      <div className="mx-auto max-w-[980px]">
        <PaperCard className="mb-5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-serif text-3xl text-[#8d1f22]">后台管理</div>
              <div className="mt-1 text-sm text-[#8b6659]">已登记来宾 {guests.length} · 预计出席 {totalPeople} 人</div>
            </div>
            <div className="flex gap-2">
              <Button variant="light" onClick={exportCsv}><Download className="h-4 w-4" />导出</Button>
              <Button variant="light" onClick={onExit}><LogOut className="h-4 w-4" />退出</Button>
            </div>
          </div>
        </PaperCard>

        <PaperCard className="p-5">
          <div className="mb-4 flex items-center gap-3 rounded-full border border-[#eadbc5] bg-white px-4 py-3">
            <Search className="h-4 w-4 text-[#a92328]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索姓名、电话、忌口、备注" className="w-full bg-transparent text-sm outline-none" />
          </div>

          {loading ? <div className="py-8 text-center text-[#8b6659]">加载中...</div> : null}
          <div className="space-y-3">
            {filtered.map((g) => (
              <div key={g.id} className="rounded-2xl border border-[#ecdcc5] bg-white/70 p-4">
                {editing === g.id ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input value={draft.name} onChange={(e) => setDraft((s) => ({ ...s, name: e.target.value }))} />
                    <Input value={draft.phone} onChange={(e) => setDraft((s) => ({ ...s, phone: e.target.value }))} />
                    <Select value={draft.gender} onChange={(e) => setDraft((s) => ({ ...s, gender: e.target.value }))}><option>先生</option><option>女士</option><option>小朋友</option></Select>
                    <Select value={draft.attendance} onChange={(e) => setDraft((s) => ({ ...s, attendance: e.target.value }))}><option>参加</option><option>待定</option><option>遗憾缺席</option></Select>
                    <Input value={draft.guestCount} type="number" min="1" onChange={(e) => setDraft((s) => ({ ...s, guestCount: e.target.value }))} />
                    <Input value={draft.dietary} onChange={(e) => setDraft((s) => ({ ...s, dietary: e.target.value }))} />
                    <div className="sm:col-span-2"><Textarea value={draft.note} onChange={(e) => setDraft((s) => ({ ...s, note: e.target.value }))} /></div>
                    <div className="sm:col-span-2 flex gap-2"><Button onClick={save}>保存</Button><Button variant="light" onClick={() => setEditing(null)}>取消</Button></div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-[#5a352f]">{g.name} <span className="text-sm font-normal text-[#8b6659]">{g.gender}</span></div>
                      <div className="mt-1 text-sm text-[#8b6659]">{g.phone || '未填写电话'} · {g.side} · {g.attendance} · {g.guestCount}人</div>
                      <div className="mt-2 text-sm text-[#8b6659]">忌口：{g.dietary || '无'} / 备注：{g.note || '无'}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(g.id); setDraft(g) }} className="rounded-full bg-[#fff5e8] p-2 text-[#a92328]"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => onDelete(g.id)} className="rounded-full bg-[#f3e9dc] p-2 text-[#75524b]"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </PaperCard>
      </div>
    </div>
  )
}

function AdminGate({ onLogin, onBack }) {
  const [password, setPassword] = useState('')
  return (
    <div className="min-h-screen paper-texture px-4 py-8">
      <PaperCard className="mx-auto max-w-md p-6">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#a92328] text-white">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <div className="font-serif text-3xl text-[#8d1f22]">管理员登录</div>
        <p className="mt-2 text-sm leading-7 text-[#8b6659]">登录后可查看和管理来宾登记信息。默认密码：5201314。</p>
        <div className="mt-5">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="请输入后台密码" />
        </div>
        <div className="mt-5 flex gap-2">
          <Button onClick={() => onLogin(password)} className="flex-1">登录</Button>
          <Button variant="light" onClick={onBack} className="flex-1">返回</Button>
        </div>
      </PaperCard>
    </div>
  )
}

export default function App() {
  const { guests, loading, addGuest, updateGuest, deleteGuest } = useGuests()
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [mode, setMode] = useState(() => new URLSearchParams(location.search).get('admin') === '1' ? 'admin' : 'site')
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(ADMIN_KEY) === '1')

  const submitGuest = async (form) => {
    setSubmitting(true)
    setMessage('')
    try {
      await addGuest(form)
      setMessage('登记成功，感谢您的祝福与到来。')
    } catch (e) {
      setMessage(`提交失败：${e.message || '请稍后重试'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const openAdmin = () => {
    history.replaceState(null, '', '?admin=1')
    setMode('admin')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const backSite = () => {
    history.replaceState(null, '', location.pathname)
    setMode('site')
  }

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_KEY, '1')
      setAuthed(true)
    } else {
      alert('密码不正确')
    }
  }

  if (mode === 'admin' && !authed) return <AdminGate onLogin={login} onBack={backSite} />
  if (mode === 'admin' && authed) return <AdminPanel guests={guests} loading={loading} onDelete={deleteGuest} onUpdate={updateGuest} onExit={() => { sessionStorage.removeItem(ADMIN_KEY); setAuthed(false); backSite() }} />

  const scrollRSVP = () => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <main className="min-h-screen paper-texture text-[#5a352f]">
      <Hero />
      <FilmSection />
      <InfoSection onRSVP={scrollRSVP} />
      <GallerySection />
      <RSVPForm onSubmit={submitGuest} submitting={submitting} message={message} />
      <BlessingSection onAdmin={openAdmin} />
      <BottomNav onRSVP={scrollRSVP} onAdmin={openAdmin} />
    </main>
  )
}
