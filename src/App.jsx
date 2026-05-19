
import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import {
  Heart,
  CalendarDays,
  MapPin,
  UserRound,
  Users,
  Utensils,
  Phone,
  MessageCircleHeart,
  ShieldCheck,
  Pencil,
  Trash2,
  Plus,
  Search,
  Image as ImageIcon,
  Video,
  Lock,
  LogOut,
  Download,
  Cloud,
  Database,
} from "lucide-react";

const STORAGE_KEY = "wedding_invitation_guests_v2";
const SETTINGS_KEY = "wedding_invitation_settings_v2";
const LOCAL_ADMIN_PASSWORD = "5201314";

const env = import.meta.env || {};
const SUPABASE_URL = env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || "";
const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const supabase = isSupabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
}

const defaultSettings = {
  groom: "新郎",
  bride: "新娘",
  date: "2026年10月1日 18:18",
  venue: "幸福花园宴会厅",
  address: "请在后台填写婚礼地址",
  videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  coverImage:
    "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1600&q=80",
  gallery: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80",
  ],
};

const defaultGuests = [
  {
    id: newId(),
    name: "张三",
    gender: "先生",
    phone: "13800000000",
    side: "新郎方",
    attendance: "参加",
    guestCount: 1,
    dietary: "不吃香菜",
    note: "祝新人百年好合！",
    createdAt: new Date().toISOString(),
  },
];

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function classNames(...items) {
  return items.filter(Boolean).join(" ");
}

function normalizeGuest(row) {
  return {
    id: row.id,
    name: row.name || "",
    gender: row.gender || "先生",
    phone: row.phone || "",
    side: row.side || "新郎方",
    attendance: row.attendance || "参加",
    guestCount: Number(row.guest_count ?? row.guestCount ?? 1) || 1,
    dietary: row.dietary || "",
    note: row.note || "",
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

function guestToDb(guest) {
  return {
    name: guest.name || "",
    gender: guest.gender || "先生",
    phone: guest.phone || "",
    side: guest.side || "新郎方",
    attendance: guest.attendance || "参加",
    guest_count: Number(guest.guestCount) || 1,
    dietary: guest.dietary || "",
    note: guest.note || "",
  };
}

function PrimaryButton({ children, className, ...props }) {
  return (
    <button
      className={classNames(
        "inline-flex items-center justify-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, className, ...props }) {
  return (
    <button
      className={classNames(
        "inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 bg-white/80 px-5 py-3 text-sm font-semibold text-rose-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-700">
        {Icon ? <Icon className="h-4 w-4 text-rose-400" /> : null}
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      className="w-full rounded-2xl border border-rose-100 bg-white/85 px-4 py-3 text-stone-800 outline-none ring-0 transition placeholder:text-stone-300 focus:border-rose-300 focus:bg-white focus:shadow-md focus:shadow-rose-100"
      {...props}
    />
  );
}

function SelectInput(props) {
  return (
    <select
      className="w-full rounded-2xl border border-rose-100 bg-white/85 px-4 py-3 text-stone-800 outline-none transition focus:border-rose-300 focus:bg-white focus:shadow-md focus:shadow-rose-100"
      {...props}
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      className="min-h-24 w-full rounded-2xl border border-rose-100 bg-white/85 px-4 py-3 text-stone-800 outline-none transition placeholder:text-stone-300 focus:border-rose-300 focus:bg-white focus:shadow-md focus:shadow-rose-100"
      {...props}
    />
  );
}

function ModeBadge({ cloudMode }) {
  return (
    <div className={classNames(
      "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
      cloudMode ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
    )}>
      {cloudMode ? <Cloud className="h-3.5 w-3.5" /> : <Database className="h-3.5 w-3.5" />}
      {cloudMode ? "云数据库模式" : "本地演示模式"}
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/75 p-5 shadow-xl shadow-rose-100/60 backdrop-blur">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-500">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-2xl font-bold text-stone-800">{value}</div>
      <div className="mt-1 text-sm text-stone-500">{label}</div>
    </div>
  );
}

function HomePage({ settings, setPage, cloudMode }) {
  return (
    <div>
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/70 shadow-2xl shadow-rose-100/70 backdrop-blur">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${settings.coverImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white via-rose-50/90 to-amber-50/90" />
        <div className="relative grid gap-8 p-6 md:grid-cols-[1.05fr_0.95fr] md:p-10 lg:p-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-5 flex flex-wrap gap-2">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-sm text-rose-600 shadow-sm">
                <Heart className="h-4 w-4 fill-rose-400 text-rose-400" />
                诚邀您见证我们的婚礼
              </div>
              <ModeBadge cloudMode={cloudMode} />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-stone-800 md:text-7xl">
              {settings.groom}
              <span className="mx-3 text-rose-400">&</span>
              {settings.bride}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-stone-600">
              因为有您的见证，这一天会更加完整。请观看我们的电子请帖，并留下您的出席信息。
            </p>

            <div className="mt-8 grid gap-3 text-stone-700 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-4">
                <CalendarDays className="h-5 w-5 text-rose-500" />
                <span>{settings.date}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-4">
                <MapPin className="h-5 w-5 text-rose-500" />
                <span>{settings.venue}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryButton onClick={() => setPage("rsvp")}>填写来宾信息</PrimaryButton>
              <GhostButton onClick={() => setPage("admin")}>进入后台看板</GhostButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="aspect-[9/16] overflow-hidden rounded-[2rem] border-8 border-white bg-stone-900 shadow-2xl md:aspect-[3/4]">
              <video
                className="h-full w-full object-cover"
                src={settings.videoUrl}
                controls
                autoPlay
                muted
                loop
                playsInline
                poster={settings.coverImage}
              />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-3xl bg-white/90 p-5 shadow-xl backdrop-blur md:block">
              <div className="text-sm text-stone-500">Wedding Invitation</div>
              <div className="mt-1 text-xl font-bold text-stone-800">Save the Date</div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {(settings.gallery || []).map((src, index) => (
          <motion.div
            key={src + index}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-xl shadow-rose-100/50"
          >
            <img
              src={src}
              alt={`婚礼相册 ${index + 1}`}
              className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </motion.div>
        ))}
      </section>
    </div>
  );
}

function RSVPPage({ addGuest, settings, setPage }) {
  const [form, setForm] = useState({
    name: "",
    gender: "先生",
    phone: "",
    side: "新郎方",
    attendance: "参加",
    guestCount: 1,
    dietary: "",
    note: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    setError("");
    const result = await addGuest({ ...form, name: form.name.trim(), guestCount: Number(form.guestCount) || 1 });
    setSubmitting(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
    setForm({ name: "", gender: "先生", phone: "", side: "新郎方", attendance: "参加", guestCount: 1, dietary: "", note: "" });
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl rounded-[2.5rem] border border-white/70 bg-white/80 p-10 text-center shadow-2xl shadow-rose-100 backdrop-blur">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100">
          <Heart className="h-10 w-10 fill-rose-400 text-rose-400" />
        </div>
        <h2 className="text-4xl font-bold text-stone-800">登记成功</h2>
        <p className="mt-4 leading-8 text-stone-600">
          感谢您的回复，我们已经收到您的来宾信息。婚礼当天期待与您相见。
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <PrimaryButton onClick={() => setPage("home")}>返回首页</PrimaryButton>
          <GhostButton onClick={() => setSubmitted(false)}>继续登记</GhostButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[2.5rem] border border-white/70 bg-white/75 p-8 shadow-2xl shadow-rose-100 backdrop-blur">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-600">
          <Users className="h-4 w-4" />
          来宾信息登记
        </div>
        <h2 className="text-4xl font-bold text-stone-800">请留下您的信息</h2>
        <p className="mt-4 leading-8 text-stone-600">
          方便我们安排席位、餐食与现场接待。填写后，后台看板会自动记录。
        </p>
        <div className="mt-8 rounded-3xl bg-rose-50 p-5 text-sm leading-7 text-stone-600">
          <div className="font-semibold text-stone-800">婚礼信息</div>
          <div className="mt-2 flex items-center gap-2"><CalendarDays className="h-4 w-4 text-rose-500" />{settings.date}</div>
          <div className="mt-2 flex items-center gap-2"><MapPin className="h-4 w-4 text-rose-500" />{settings.venue}</div>
          <div className="mt-2 text-stone-500">{settings.address}</div>
        </div>
      </div>

      <form
        onSubmit={submit}
        className="rounded-[2.5rem] border border-white/70 bg-white/80 p-6 shadow-2xl shadow-rose-100 backdrop-blur md:p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="姓名" icon={UserRound}>
            <TextInput value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="请输入姓名" required />
          </Field>
          <Field label="称谓 / 性别" icon={UserRound}>
            <SelectInput value={form.gender} onChange={(e) => update("gender", e.target.value)}>
              <option>先生</option>
              <option>女士</option>
              <option>小朋友</option>
              <option>其他</option>
            </SelectInput>
          </Field>
          <Field label="手机号" icon={Phone}>
            <TextInput value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="方便婚礼前联系，可选" />
          </Field>
          <Field label="来宾关系" icon={Heart}>
            <SelectInput value={form.side} onChange={(e) => update("side", e.target.value)}>
              <option>新郎方</option>
              <option>新娘方</option>
              <option>共同好友</option>
              <option>家人亲属</option>
              <option>同事</option>
            </SelectInput>
          </Field>
          <Field label="是否出席" icon={ShieldCheck}>
            <SelectInput value={form.attendance} onChange={(e) => update("attendance", e.target.value)}>
              <option>参加</option>
              <option>待定</option>
              <option>遗憾缺席</option>
            </SelectInput>
          </Field>
          <Field label="同行人数" icon={Users}>
            <TextInput type="number" min="1" max="20" value={form.guestCount} onChange={(e) => update("guestCount", e.target.value)} />
          </Field>
          <div className="md:col-span-2">
            <Field label="忌口 / 过敏 / 特殊餐食" icon={Utensils}>
              <TextInput value={form.dietary} onChange={(e) => update("dietary", e.target.value)} placeholder="例如：不吃辣、海鲜过敏、素食、不吃香菜" />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="想对新人说的话" icon={MessageCircleHeart}>
              <TextArea value={form.note} onChange={(e) => update("note", e.target.value)} placeholder="写一句祝福吧" />
            </Field>
          </div>
        </div>
        {error ? <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</div> : null}
        <PrimaryButton className="mt-7 w-full" type="submit" disabled={submitting}>
          {submitting ? "提交中..." : "提交登记"}
        </PrimaryButton>
      </form>
    </div>
  );
}

function AdminPage({
  guests,
  settings,
  cloudMode,
  adminSession,
  authError,
  signInAdmin,
  signOutAdmin,
  createGuest,
  updateGuest,
  deleteGuest,
  saveSettingsToStore,
  refreshGuests,
}) {
  const [localAuthed, setLocalAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({});
  const [settingsDraft, setSettingsDraft] = useState(settings);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => setSettingsDraft(settings), [settings]);

  const isAdmin = cloudMode ? Boolean(adminSession) : localAuthed;

  const filteredGuests = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return guests;
    return guests.filter((guest) =>
      [guest.name, guest.gender, guest.phone, guest.side, guest.attendance, guest.dietary, guest.note]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [guests, query]);

  const stats = useMemo(() => {
    const attend = guests.filter((g) => g.attendance === "参加");
    const pending = guests.filter((g) => g.attendance === "待定");
    const totalPeople = attend.reduce((sum, g) => sum + (Number(g.guestCount) || 1), 0);
    return { total: guests.length, attend: attend.length, pending: pending.length, totalPeople };
  }, [guests]);

  async function login(e) {
    e.preventDefault();
    setMessage("");
    if (cloudMode) {
      setWorking(true);
      await signInAdmin(email, password);
      setWorking(false);
    } else {
      if (password === LOCAL_ADMIN_PASSWORD) setLocalAuthed(true);
      else setMessage("后台密码不正确，演示密码是 5201314。正式上线建议使用 Supabase Auth。");
    }
  }

  function startEdit(guest) {
    setEditing(guest.id);
    setDraft({ ...guest });
  }

  function updateDraft(key, value) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function saveEdit() {
    setWorking(true);
    const result = await updateGuest(editing, { ...draft, guestCount: Number(draft.guestCount) || 1 });
    setWorking(false);
    if (result?.error) {
      setMessage(result.error);
      return;
    }
    setEditing(null);
    setDraft({});
    setMessage("已保存来宾信息");
  }

  async function removeGuest(id) {
    if (!confirm("确定删除这位来宾信息吗？")) return;
    setWorking(true);
    const result = await deleteGuest(id);
    setWorking(false);
    if (result?.error) setMessage(result.error);
    else setMessage("已删除来宾信息");
  }

  async function addBlankGuest() {
    const item = {
      name: "新来宾",
      gender: "先生",
      phone: "",
      side: "新郎方",
      attendance: "参加",
      guestCount: 1,
      dietary: "",
      note: "",
    };
    setWorking(true);
    const result = await createGuest(item, true);
    setWorking(false);
    if (result?.error) {
      setMessage(result.error);
      return;
    }
    if (result?.guest) startEdit(result.guest);
  }

  function exportCsv() {
    const headers = ["姓名", "称谓", "手机号", "关系", "是否出席", "同行人数", "忌口", "祝福", "登记时间"];
    const rows = guests.map((g) => [
      g.name,
      g.gender,
      g.phone,
      g.side,
      g.attendance,
      g.guestCount,
      g.dietary,
      g.note,
      new Date(g.createdAt).toLocaleString(),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "婚礼来宾登记.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function saveSettings() {
    const gallery = typeof settingsDraft.gallery === "string"
      ? settingsDraft.gallery.split("\n").map((x) => x.trim()).filter(Boolean)
      : settingsDraft.gallery;
    setWorking(true);
    const result = await saveSettingsToStore({ ...settingsDraft, gallery });
    setWorking(false);
    if (result?.error) setMessage(result.error);
    else setMessage("页面配置已保存");
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md rounded-[2.5rem] border border-white/70 bg-white/85 p-8 shadow-2xl shadow-rose-100 backdrop-blur">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-500">
          <Lock className="h-7 w-7" />
        </div>
        <div className="mb-3"><ModeBadge cloudMode={cloudMode} /></div>
        <h2 className="text-3xl font-bold text-stone-800">后台登录</h2>
        <p className="mt-3 text-sm leading-7 text-stone-500">
          {cloudMode
            ? "正式版使用 Supabase Auth 管理后台账号。请用你在 Supabase 后台创建的管理员邮箱和密码登录。"
            : "当前没有配置 Supabase，仍是本地演示版。演示密码：5201314。"}
        </p>
        <form onSubmit={login} className="mt-6 space-y-4">
          {cloudMode ? (
            <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="管理员邮箱" required />
          ) : null}
          <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="请输入后台密码" required />
          {(authError || message) ? <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{authError || message}</div> : null}
          <PrimaryButton className="w-full" type="submit" disabled={working}>{working ? "登录中..." : "进入看板"}</PrimaryButton>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-600">
              <ShieldCheck className="h-4 w-4" />
              来宾后台看板
            </div>
            <ModeBadge cloudMode={cloudMode} />
          </div>
          <h2 className="text-4xl font-bold text-stone-800">登记数据管理</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {cloudMode ? <GhostButton onClick={refreshGuests}>刷新数据</GhostButton> : null}
          <GhostButton onClick={cloudMode ? signOutAdmin : () => setLocalAuthed(false)}><LogOut className="h-4 w-4" />退出后台</GhostButton>
        </div>
      </div>

      {message ? <div className="rounded-3xl bg-white/80 p-4 text-sm text-stone-600 shadow-sm">{message}</div> : null}

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="登记总数" value={stats.total} icon={Users} />
        <StatCard label="确认参加" value={stats.attend} icon={Heart} />
        <StatCard label="待定人数" value={stats.pending} icon={ShieldCheck} />
        <StatCard label="预计到场人数" value={stats.totalPeople} icon={UserRound} />
      </div>

      <section className="rounded-[2.5rem] border border-white/70 bg-white/80 p-6 shadow-2xl shadow-rose-100 backdrop-blur md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-2xl font-bold text-stone-800">来宾名单</h3>
            <p className="mt-1 text-sm text-stone-500">支持增加、编辑、删除和导出 CSV。</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <GhostButton onClick={exportCsv}><Download className="h-4 w-4" />导出表格</GhostButton>
            <PrimaryButton onClick={addBlankGuest} disabled={working}><Plus className="h-4 w-4" />新增来宾</PrimaryButton>
          </div>
        </div>

        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-rose-100 bg-white px-4 py-3">
          <Search className="h-5 w-5 text-rose-400" />
          <input
            className="w-full bg-transparent outline-none placeholder:text-stone-300"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索姓名、手机号、忌口、关系等"
          />
        </div>

        <div className="overflow-hidden rounded-3xl border border-rose-100 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-[1050px] w-full text-left text-sm">
              <thead className="bg-rose-50 text-stone-600">
                <tr>
                  <th className="p-4">姓名</th>
                  <th className="p-4">称谓</th>
                  <th className="p-4">电话</th>
                  <th className="p-4">关系</th>
                  <th className="p-4">出席</th>
                  <th className="p-4">人数</th>
                  <th className="p-4">忌口</th>
                  <th className="p-4">祝福</th>
                  <th className="p-4">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {filteredGuests.map((guest) => {
                  const isEditing = editing === guest.id;
                  return (
                    <tr key={guest.id} className="align-top text-stone-700">
                      <td className="p-3">{isEditing ? <TextInput value={draft.name} onChange={(e) => updateDraft("name", e.target.value)} /> : guest.name}</td>
                      <td className="p-3">{isEditing ? <SelectInput value={draft.gender} onChange={(e) => updateDraft("gender", e.target.value)}><option>先生</option><option>女士</option><option>小朋友</option><option>其他</option></SelectInput> : guest.gender}</td>
                      <td className="p-3">{isEditing ? <TextInput value={draft.phone} onChange={(e) => updateDraft("phone", e.target.value)} /> : guest.phone}</td>
                      <td className="p-3">{isEditing ? <SelectInput value={draft.side} onChange={(e) => updateDraft("side", e.target.value)}><option>新郎方</option><option>新娘方</option><option>共同好友</option><option>家人亲属</option><option>同事</option></SelectInput> : guest.side}</td>
                      <td className="p-3">{isEditing ? <SelectInput value={draft.attendance} onChange={(e) => updateDraft("attendance", e.target.value)}><option>参加</option><option>待定</option><option>遗憾缺席</option></SelectInput> : guest.attendance}</td>
                      <td className="p-3">{isEditing ? <TextInput type="number" min="1" value={draft.guestCount} onChange={(e) => updateDraft("guestCount", e.target.value)} /> : guest.guestCount}</td>
                      <td className="p-3">{isEditing ? <TextInput value={draft.dietary} onChange={(e) => updateDraft("dietary", e.target.value)} /> : guest.dietary}</td>
                      <td className="p-3 max-w-xs">{isEditing ? <TextInput value={draft.note} onChange={(e) => updateDraft("note", e.target.value)} /> : guest.note}</td>
                      <td className="p-3">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <PrimaryButton className="px-4 py-2" onClick={saveEdit} disabled={working}>保存</PrimaryButton>
                            <GhostButton className="px-4 py-2" onClick={() => setEditing(null)}>取消</GhostButton>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button className="rounded-full bg-rose-50 p-2 text-rose-600 hover:bg-rose-100" onClick={() => startEdit(guest)}><Pencil className="h-4 w-4" /></button>
                            <button className="rounded-full bg-stone-100 p-2 text-stone-600 hover:bg-stone-200" onClick={() => removeGuest(guest.id)}><Trash2 className="h-4 w-4" /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredGuests.length === 0 ? (
                  <tr><td className="p-8 text-center text-stone-400" colSpan="9">暂无来宾数据</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-white/70 bg-white/80 p-6 shadow-2xl shadow-rose-100 backdrop-blur md:p-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-stone-800">请帖页面配置</h3>
          <p className="mt-1 text-sm text-stone-500">可替换首页视频、封面图、相册图和婚礼基本信息。</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="新郎姓名" icon={UserRound}><TextInput value={settingsDraft.groom} onChange={(e) => setSettingsDraft((p) => ({ ...p, groom: e.target.value }))} /></Field>
          <Field label="新娘姓名" icon={UserRound}><TextInput value={settingsDraft.bride} onChange={(e) => setSettingsDraft((p) => ({ ...p, bride: e.target.value }))} /></Field>
          <Field label="婚礼时间" icon={CalendarDays}><TextInput value={settingsDraft.date} onChange={(e) => setSettingsDraft((p) => ({ ...p, date: e.target.value }))} /></Field>
          <Field label="婚礼场地" icon={MapPin}><TextInput value={settingsDraft.venue} onChange={(e) => setSettingsDraft((p) => ({ ...p, venue: e.target.value }))} /></Field>
          <div className="md:col-span-2"><Field label="详细地址" icon={MapPin}><TextInput value={settingsDraft.address} onChange={(e) => setSettingsDraft((p) => ({ ...p, address: e.target.value }))} /></Field></div>
          <div className="md:col-span-2"><Field label="请帖视频 URL" icon={Video}><TextInput value={settingsDraft.videoUrl} onChange={(e) => setSettingsDraft((p) => ({ ...p, videoUrl: e.target.value }))} placeholder="填入你的视频链接，例如 OSS / COS / CDN / MP4 地址" /></Field></div>
          <div className="md:col-span-2"><Field label="首页封面图 URL" icon={ImageIcon}><TextInput value={settingsDraft.coverImage} onChange={(e) => setSettingsDraft((p) => ({ ...p, coverImage: e.target.value }))} /></Field></div>
          <div className="md:col-span-2"><Field label="相册图片 URL，每行一张" icon={ImageIcon}><TextArea value={Array.isArray(settingsDraft.gallery) ? settingsDraft.gallery.join("\n") : settingsDraft.gallery} onChange={(e) => setSettingsDraft((p) => ({ ...p, gallery: e.target.value }))} /></Field></div>
        </div>
        <PrimaryButton className="mt-7" onClick={saveSettings} disabled={working}>{working ? "保存中..." : "保存页面配置"}</PrimaryButton>
      </section>
    </div>
  );
}

export default function WeddingInvitationApp() {
  const cloudMode = isSupabaseConfigured;
  const [page, setPage] = useState("home");
  const [guests, setGuests] = useState(() => (cloudMode ? [] : loadJson(STORAGE_KEY, defaultGuests)));
  const [settings, setSettings] = useState(() => loadJson(SETTINGS_KEY, defaultSettings));
  const [adminSession, setAdminSession] = useState(null);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(cloudMode);

  useEffect(() => {
    if (!cloudMode) {
      saveJson(STORAGE_KEY, guests);
    }
  }, [cloudMode, guests]);

  useEffect(() => {
    if (!cloudMode) {
      saveJson(SETTINGS_KEY, settings);
    }
  }, [cloudMode, settings]);

  useEffect(() => {
    if (!cloudMode || !supabase) return;
    let ignore = false;

    async function boot() {
      setLoading(true);
      await loadSettings();
      const { data } = await supabase.auth.getSession();
      if (!ignore) setAdminSession(data.session || null);
      setLoading(false);
    }

    boot();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminSession(session || null);
      if (session) loadGuests();
    });

    return () => {
      ignore = true;
      listener?.subscription?.unsubscribe?.();
    };
  }, [cloudMode]);

  useEffect(() => {
    if (cloudMode && adminSession) loadGuests();
  }, [cloudMode, adminSession]);

  async function loadSettings() {
    if (!cloudMode || !supabase) return;
    const { data, error } = await supabase
      .from("wedding_settings")
      .select("data")
      .eq("id", "main")
      .maybeSingle();
    if (!error && data?.data) {
      setSettings({ ...defaultSettings, ...data.data });
    }
  }

  async function loadGuests() {
    if (!cloudMode || !supabase) return { error: "当前不是云数据库模式" };
    const { data, error } = await supabase
      .from("wedding_guests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return { error: error.message };
    setGuests((data || []).map(normalizeGuest));
    return { ok: true };
  }

  async function addGuest(guest, fromAdmin = false) {
    if (!cloudMode || !supabase) {
      const item = { ...guest, id: newId(), createdAt: new Date().toISOString() };
      setGuests((prev) => [item, ...prev]);
      return { ok: true, guest: item };
    }

    const payload = guestToDb(guest);
    if (fromAdmin) {
      const { data, error } = await supabase.from("wedding_guests").insert(payload).select("*").single();
      if (error) return { error: error.message };
      const item = normalizeGuest(data);
      setGuests((prev) => [item, ...prev]);
      return { ok: true, guest: item };
    }

    const { error } = await supabase.from("wedding_guests").insert(payload);
    if (error) return { error: error.message };
    if (adminSession) await loadGuests();
    return { ok: true };
  }

  async function updateGuest(id, guest) {
    if (!cloudMode || !supabase) {
      setGuests((prev) => prev.map((item) => (item.id === id ? { ...guest, id } : item)));
      return { ok: true };
    }
    const { data, error } = await supabase
      .from("wedding_guests")
      .update({ ...guestToDb(guest), updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();
    if (error) return { error: error.message };
    const item = normalizeGuest(data);
    setGuests((prev) => prev.map((g) => (g.id === id ? item : g)));
    return { ok: true };
  }

  async function deleteGuest(id) {
    if (!cloudMode || !supabase) {
      setGuests((prev) => prev.filter((item) => item.id !== id));
      return { ok: true };
    }
    const { error } = await supabase.from("wedding_guests").delete().eq("id", id);
    if (error) return { error: error.message };
    setGuests((prev) => prev.filter((item) => item.id !== id));
    return { ok: true };
  }

  async function saveSettingsToStore(nextSettings) {
    if (!cloudMode || !supabase) {
      setSettings(nextSettings);
      return { ok: true };
    }
    const { error } = await supabase
      .from("wedding_settings")
      .upsert({ id: "main", data: nextSettings, updated_at: new Date().toISOString() });
    if (error) return { error: error.message };
    setSettings(nextSettings);
    return { ok: true };
  }

  async function signInAdmin(email, password) {
    setAuthError("");
    if (!supabase) return { error: "Supabase 未配置" };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return { error: error.message };
    }
    await loadGuests();
    return { ok: true };
  }

  async function signOutAdmin() {
    setAuthError("");
    if (supabase) await supabase.auth.signOut();
    setAdminSession(null);
    setGuests([]);
  }

  const navItems = [
    { key: "home", label: "请帖首页" },
    { key: "rsvp", label: "信息登记" },
    { key: "admin", label: "后台看板" },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ffe4e6,transparent_35%),radial-gradient(circle_at_top_right,#fef3c7,transparent_30%),linear-gradient(135deg,#fff7ed,#fff1f2_45%,#fafaf9)] px-4 py-6 text-stone-800 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-full border border-white/70 bg-white/75 px-4 py-3 shadow-xl shadow-rose-100/60 backdrop-blur md:px-6">
          <button onClick={() => setPage("home")} className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-200">
              <Heart className="h-5 w-5 fill-white" />
            </div>
            <div className="text-left">
              <div className="font-bold tracking-wide">Wedding Invitation</div>
              <div className="text-xs text-stone-500">电子请帖 · 来宾登记</div>
            </div>
          </button>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                className={classNames(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  page === item.key
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-200"
                    : "text-stone-600 hover:bg-rose-50 hover:text-rose-600"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </header>

        {loading ? (
          <div className="rounded-[2.5rem] bg-white/80 p-10 text-center shadow-xl text-stone-500">正在加载婚礼请帖...</div>
        ) : null}
        {!loading && page === "home" ? <HomePage settings={settings} setPage={setPage} cloudMode={cloudMode} /> : null}
        {!loading && page === "rsvp" ? <RSVPPage addGuest={addGuest} settings={settings} setPage={setPage} /> : null}
        {!loading && page === "admin" ? (
          <AdminPage
            guests={guests}
            settings={settings}
            cloudMode={cloudMode}
            adminSession={adminSession}
            authError={authError}
            signInAdmin={signInAdmin}
            signOutAdmin={signOutAdmin}
            createGuest={addGuest}
            updateGuest={updateGuest}
            deleteGuest={deleteGuest}
            saveSettingsToStore={saveSettingsToStore}
            refreshGuests={loadGuests}
          />
        ) : null}

        <footer className="mt-10 text-center text-sm text-stone-400">
          Made with love · {settings.groom} & {settings.bride}
        </footer>
      </div>
    </main>
  );
}
