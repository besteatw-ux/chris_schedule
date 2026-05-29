// 🔖 VERSION: 2026-05-29-v3-IG-LONG-FORM
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  Video, Smartphone, Image, ChevronLeft, ChevronRight, Save, Trash2,
  Plus, ClipboardList, ChevronDown, Sparkles, X, Users, CheckCircle2,
  Download, Cloud, Loader2, RefreshCw, Calendar, Instagram, Music2,
  BookText, Layers, BarChart3, TrendingUp, TrendingDown, Minus, Info,
  Edit,
} from "lucide-react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";

// ─── Firebase ────────────────────────────────────────────────────────────────
const STORAGE_KEY = "bestea_content_calendar_v5";
const CLIENT_ID_KEY = "bestea_content_calendar_client_id";
const firebaseConfig = {
  apiKey: "AIzaSyCOdBYPw6GTjOFyx9ZpX_vl00p-lslR3Ss",
  authDomain: "besteatiktok.firebaseapp.com",
  projectId: "besteatiktok",
  storageBucket: "besteatiktok.firebasestorage.app",
  messagingSenderId: "655154750593",
  appId: "1:655154750593:web:e7c25e58f8edf8e7ff5980",
  measurementId: "G-369EC9VK8N",
};
const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const CLOUD_DOC_PATH = { collection: "sharedCalendars", document: "bestea-tiktok-main" };

// ─── Brand ───────────────────────────────────────────────────────────────────
const BRAND = `【品牌 — 天下第一好茶 BESTEA】
官網：https://www.besttea1.com
品牌背景：30年台灣高山茶專家。以無與倫比的風味與品質聯繫世界，讓全世界都能品味到台灣茶的工藝之美。自2019年起，BESTEA秉持獨具匠心的設計理念和暖而透亮的品牌印象，引領新一代深入感受傳統茶飲無可比擬的魅力，致力於促進台灣高山烏龍茶的全球知名度。
茶園優勢：擁有自家茶園，集結專業茶農、採茶工及一流製茶師傅。從茶園土壤管理、人工手摘採茶到精細製茶工序，一貫作業嚴格把關每個細節，只為將台灣大自然最純粹的風味完美呈現。
製茶工藝：人工手摘只選當季最鮮嫩茶菁，在布包與光影間以時間塑形香氣，封存山林氣息呈現清透回甘的茶湯。
茶葉產品：
・烏龍茶：福壽山（茶皇【精製茶】、茶王、天池、義莊、唐莊）、大禹嶺（山皇【精製茶】、90K、88K、新佳陽）、梨山（白茶、華崗、吊橋頭、翠峰、翠巒、清境、東眼）、杉林溪、阿里山（金萱、阿里山、瑞里）、四季春
・紅茶：東方美人茶、福壽山紅茶【精製茶】、華崗紅茶、鹿野紅烏龍、梨山紅茶、日月潭紅玉
・精焙：福壽山精焙、大禹嶺精焙、梨山精焙、梨山炭焙、木柵鐵觀音、凍頂烏龍
・新品：文山包種茶、三峽碧螺春綠茶
茶包：天天好茶原葉茶包（芬芳的總和綜合12入、悠悠紅玉12入、奶香金萱12入、暮暮觀音12入、醇翠烏龍12入、天天好茶禮盒20入）、經典好茶平面茶包（福壽山30入、大禹嶺30入、華崗紅茶30入、焙烏龍30入）、大份量茶包（原葉100入、平面100入）
組合：御用/頂級/嚴選/平價/經濟實惠/精焙/紅茶嚐鮮好茶組
品牌承諾：100%純正台灣高山茶、SGS檢驗合格、無人工香料色素、產地溯源、7日退換、24hr出貨、全球配送✈️
國際認可：榮獲日本、韓國、歐洲、美國、香港、澳門等地區廣大好評`;

// ─── Social Platforms ────────────────────────────────────────────────────────
const SOC_PLATFORMS = [
  {
    id: "instagram", label: "Instagram", icon: "📸", accent: "#C13584",
    formats: [
      { id: "reels", label: "Reels 短影片", maxLen: 280, rules: "字數 180-280字（不含程式自動補的聯絡資訊區塊與 hashtag），絕對不能像抖音那樣 2-3 句草草了事。必須寫成有起承轉合的品牌長文，分 4-6 段，每段 2-3 行短句。【結構建議】Hook 一行 → 故事/情境 2-3 段 → 茶款/品牌觀點 1-2 段 → 詩意收尾 1 行。每段中間空一行。文青質感、有溫度、像品牌主理人在說話，不是行銷話術。禁用「值得」「推薦」「必買」「開賣」，改用「珍藏」「品味」「感受」「藏著」「不只是」。三版本切角不同：A 從感官情境切入、B 從品牌價值切入、C 從生活儀式切入。copy 只寫到收尾為止，不要寫 BESTEA 分隔線和聯絡資訊（程式會自動補）。【IG Hashtag】5-8個，固定 #天下第一好茶 #BESTEA #besteatw，再加 2-5 個精準中型標籤。title 欄位留空。" },
    ],
  },
  {
    id: "tiktok", label: "抖音 / TikTok", icon: "🎵", accent: "#111",
    formats: [
      { id: "video", label: "短影片", maxLen: 70, rules: "建議50-70字，依內容調整，2-3句。不用標點符號，用空格或Emoji斷句。三個版本要有不同切角：A從喝茶感受出發、B從茶葉特色出發、C從生活場景出發。語氣自然口語，像真人分享，不像廣告。避免「值得一試」「推薦」「必買」，改用「喝完才懂」「沒想到」「從此每天必備」等真實感受。如果是促銷/新品/送禮類，結尾加 👉🏻 主頁看更多；日常/美感/故事類讓文案自然結尾。【抖音 Hashtag 2026規則】3-5個標籤效果最好。固定放：#天下第一好茶 #BESTEA，再加1-3個精準主題標籤，依影片內容選擇。注意：title欄位留空，抖音不需要標題。" },
    ],
  },
  {
    id: "xiaohongshu", label: "小紅書", icon: "📕", accent: "#FE2C55",
    formats: [
      { id: "post", label: "圖文筆記", maxLen: 150, rules: "必須生成【標題】和【正文】。標題：20字內，有故事感有畫面，讓人想點進來看，三個版本標題切角完全不同。正文：建議100-150字，用¸代替逗號，用.ᐟ代替驚嘆號，用✅📍💡⭐️分段。三個版本要有明顯差異：A閨蜜分享感、B知識乾貨感、C生活詩意感。語氣繁體中文，兩岸都能接受，真實有溫度不像廣告。文案一律自然結尾，不加任何引導搜尋或購買的CTA。注意：絕對不能出現「官網」「連結」「下單」「購買」「有保證」「零農藥」「最好」「第一」「企業贈禮」「檢驗合格」等廣告敏感詞，改用「品質穩定」「農藥殘留低」「值得信賴」「送禮首選」等自然說法。【小紅書 Hashtag規則】8-10個精準標籤。固定放：#天下第一好茶 #BESTEA #台湾茶 #台湾高山茶，再加4-6個繁體主題標籤(依茶葉品種/情境/生活風格選擇)。選中型標籤，不用百萬級熱門標籤。title欄位填標題，copy欄位填正文。" },
      { id: "video", label: "影片筆記", maxLen: 80, rules: "必須生成【標題】和【正文】。標題：20字內，生活畫面感，如「清晨第一杯¸用高山茶包開始.ᐟ」。正文：建議60-80字，依內容需要調整，2-3句，搭配 ✨🍵💕 等小紅書風符號，用¸代替逗號，用.ᐟ代替驚嘆號，生活日常感。文案一律自然結尾，不加任何引導搜尋或購買的CTA，讓內容說話。注意：絕對不能出現「官網」「連結」「下單」「購買」等字眼，會被限流。【小紅書 Hashtag規則】6-8個精準標籤。固定放：#天下第一好茶 #BESTEA #台湾茶 #台湾高山茶，再加2-4個繁體主題標籤(依影片內容選擇)。title欄位填標題，copy欄位填正文。" },
    ],
  },
];


// ─── Video Styles ─────────────────────────────────────────────────────────────
const VIDEO_STYLES = [
  {
    id: "daily_life",
    label: "☕ 日常生活",
    desc: "喝茶的日常片段，自然真實",
    prompt: `【日常生活風格】各平台語氣：
- IG Reels：質感生活感，像在翻相簿，「煮水聲剛停，茶香就來了」，短句有停頓，符號點綴，讓畫面說話，不解釋太多
- 抖音短影片：口語自然，像跟朋友傳訊息，「每天早上這杯 整個人清醒了」，生活化不誇張
- 小紅書：閨蜜分享感，寫生活小確幸，「把這杯茶加進早晨儀式之後¸整天都順了.ᐟ」`
  },
  {
    id: "product_intro",
    label: "📦 產品介紹",
    desc: "茶葉特色、口感、產地介紹",
    prompt: `【產品介紹風格】各平台語氣：
- IG Reels：詩意語言描述口感和產地，「海拔2500公尺的清晨 封存在這一罐裡」，質感專業但不冷漠
- 抖音短影片：直接說重點，「這茶為什麼值得 喝一口就懂了」，口語有說服力，讓人想試
- 小紅書：像跟閨蜜分享好東西，說清楚特色和適合誰，有具體推薦理由`
  },
  {
    id: "behind_scenes",
    label: "🎬 幕後記錄",
    desc: "拍攝過程、茶園、製茶現場",
    prompt: `【幕後記錄風格】各平台語氣：
- IG Reels：臨場感，像跟著鏡頭走，「清晨五點的茶園 只有霧和茶香」，畫面感強，情緒到位
- 抖音短影片：真實跟拍感，「跟我去茶園看看 採茶到底有多辛苦」，讓人感受製茶不容易
- 小紅書：細節豐富，描述現場氛圍，讓人感受品牌用心，建立信任感`
  },
  {
    id: "knowledge",
    label: "📚 茶知識",
    desc: "高山茶知識、沖泡方式、選茶技巧",
    prompt: `【茶知識風格】各平台語氣：
- IG Reels：知識有質感，「很多人不知道 高山茶的回甘跟海拔有關」，說得簡單但有深度，值得收藏
- 抖音短影片：反問開頭製造好奇，「你買的高山茶 真的是高山茶嗎」，讓人想看完，實用有趣
- 小紅書：乾貨清單感，整理重點讓人收藏，「選高山茶前一定要知道的事」`
  },
  {
    id: "aesthetic",
    label: "🎨 形象美感",
    desc: "純視覺質感，意境優先",
    prompt: `【形象美感風格】各平台語氣：
- IG Reels：文字像詩，極簡短句，「一杯茶。一個清晨。這就夠了。」有停頓感，質感符號點綴，不堆砌資訊
- 抖音短影片：畫面字幕感，每句話都是一個畫面，美但不距離感
- 小紅書：視覺系筆記，短詩配美圖，讓人想收藏和分享`
  },
  {
    id: "gift",
    label: "🎁 送禮推薦",
    desc: "禮盒、節慶送禮、開箱情境",
    prompt: `【送禮推薦風格】各平台語氣：
- IG Reels：送禮的溫度和質感，「送一份有心的禮 不需要多貴 只需要剛好」，文青有情感
- 抖音短影片：實用送禮攻略，「送長輩送老闆都適合 這款茶讓我省了很多腦細胞」，接地氣有說服力
- 小紅書：送禮攻略，說清楚送誰、什麼場合、為什麼選這個，讓人照著買`
  },
  {
    id: "brewing",
    label: "🍵 沖泡教學",
    desc: "泡茶步驟、水溫、器具示範",
    prompt: `【沖泡教學風格】各平台語氣：
- IG Reels：優雅泡茶示範，「水溫差10度 茶的香氣就不一樣了」，美感和知識並重
- 抖音短影片：實用教學，「學會這個泡茶技巧 你的茶會好喝一倍」，步驟清楚讓人學得會
- 小紅書：詳細圖文教學，水溫/時間/茶量都說清楚，高收藏率`
  },
  {
    id: "origin_story",
    label: "🌿 產地故事",
    desc: "茶農、高山、節氣與製茶工藝",
    prompt: `【產地故事風格】各平台語氣：
- IG Reels：有溫度的品牌故事，「這杯茶從採摘到你手上 歷經了多少個清晨」，讓人對品牌產生認同
- 抖音短影片：感動真實，「茶農說這批茶只有幾十斤 喝了才知道為什麼」，真實感動人心
- 小紅書：深度好文，說茶農故事、產地環境、製茶工藝，讓人覺得這杯茶值得`
  },
  {
    id: "new_product",
    label: "✨ 新品上市",
    desc: "新茶、新系列、首發介紹",
    prompt: `【新品上市風格】各平台語氣：
- IG Reels：新品的期待感和驚喜感，「等了很久的那款 終於來了」，質感預告，讓人想馬上試
- 抖音短影片:開箱第一印象，「第一次喝到這個 真的沒想到」，真實反應有說服力
- 小紅書：詳細新品評測，外觀/香氣/口感/回甘都說，讓人參考決定要不要買`
  },
  {
    id: "promo",
    label: "💰 促銷優惠",
    desc: "限時折扣、組合優惠、節慶活動",
    prompt: `【促銷優惠風格】各平台語氣：
- IG Reels：不說「便宜」，說「這個時機值得珍藏」「限量的理由是品質不妥協」，質感促銷
- 抖音短影片：直接說划算，「這個價格買到這個品質 不買真的虧了」「限時優惠 手慢就沒」，有衝動感
- 小紅書：種草囤貨感，「好值.ᐟ 這款我已經囤了三罐」「性價比爆表 閨蜜都在搶」`
  },
];



// ─── Planner Constants ───────────────────────────────────────────────────────
const PLATFORM_OPTIONS = [
  { value: "IG", label: "Instagram", icon: Instagram, color: "#e1306c" },
  { value: "TIKTOK", label: "TikTok", icon: Music2, color: "#010101" },
  { value: "XHS", label: "小紅書", icon: BookText, color: "#fe2c55" },
];
const PLATFORM_LABEL_MAP = { IG: "Instagram", TIKTOK: "TikTok", XHS: "小紅書" };
const MIN_YEAR = 2026, MIN_MONTH = 2, MAX_YEAR = 2030, MAX_MONTH = 11;

const defaultCalendarData = {
  "2026-03-10": { title: "2026 首波春茶開跑", notes: "拍茶園空景、嫩芽特寫、採茶手部動作", collaborators: "內容部 A", platform: "IG", hasPost: false, hasVideo: true, hasStory: true, scheduled: true, published: false },
  "2026-03-15": { title: "茶園空拍大景素材", notes: "空拍高山茶園與雲海氛圍", collaborators: "攝影組", platform: "TIKTOK", hasPost: false, hasVideo: true, hasStory: false, scheduled: true, published: true },
  "2026-05-20": { title: "春茶採收高峰紀錄", notes: "可剪成品牌形象短片", collaborators: "企劃部", platform: "XHS", hasPost: true, hasVideo: true, hasStory: true, scheduled: false, published: false },
};
const defaultGrowthData = { "2026-03": { IG: 1200, TIKTOK: 850, XHS: 360, notes: "本月粉絲總數紀錄。" } };

// ─── Helpers ─────────────────────────────────────────────────────────────────
const EMPTY_ENTRY = { id: "", title: "", notes: "", collaborators: "", platform: "", hasPost: false, hasVideo: false, hasStory: false, scheduled: false, published: false, igCopy: "", tiktokCopy: "", xhsCopy: "", xhsTitle: "" };
function createEntryId() { return `entry_${Math.random().toString(36).slice(2)}_${Date.now()}`; }
function normalizeEntry(entry = {}) { return { ...EMPTY_ENTRY, ...entry, id: entry.id || createEntryId(), platform: entry.platform || "", hasPost: !!entry.hasPost, hasVideo: !!entry.hasVideo, hasStory: !!entry.hasStory, scheduled: !!entry.scheduled, published: !!entry.published, igCopy: entry.igCopy || "", tiktokCopy: entry.tiktokCopy || "", xhsCopy: entry.xhsCopy || "", xhsTitle: entry.xhsTitle || "" }; }
function getEntriesFromDay(dayValue) { if (!dayValue) return []; if (Array.isArray(dayValue)) return dayValue.map(normalizeEntry); if (typeof dayValue === "object" && Array.isArray(dayValue.items)) return dayValue.items.map(normalizeEntry); if (typeof dayValue === "object") return [normalizeEntry(dayValue)]; return []; }
function packEntriesForSave(entries) { const valid = entries.map(normalizeEntry).filter(e => e.title.trim() || e.notes.trim() || e.collaborators.trim() || e.hasPost || e.hasVideo || e.hasStory || e.scheduled || e.published); if (valid.length === 0) return undefined; if (valid.length === 1) return valid[0]; return valid; }
function getDaySummary(entries) { return { total: entries.length, hasPost: entries.some(e => e.hasPost), hasVideo: entries.some(e => e.hasVideo), hasStory: entries.some(e => e.hasStory), scheduled: entries.some(e => e.scheduled), published: entries.some(e => e.published) }; }
function getPlatformMeta(platform) { return PLATFORM_OPTIONS.find(p => p.value === platform) || null; }
function getClientId() { try { const e = localStorage.getItem(CLIENT_ID_KEY); if (e) return e; const id = `client_${Math.random().toString(36).slice(2)}_${Date.now()}`; localStorage.setItem(CLIENT_ID_KEY, id); return id; } catch { return `client_fallback_${Date.now()}`; } }
function monthKeyFromYearMonth(year, month) { return `${year}-${String(month + 1).padStart(2, "0")}`; }
function formatNumber(value) { return Number(value || 0).toLocaleString("zh-TW"); }
function formatSigned(value) { const n = Number(value || 0); return `${n >= 0 ? "+" : ""}${n.toLocaleString("zh-TW")}`; }
function toCSV(rows) { return rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n"); }
function downloadCSV(filename, rows) { const blob = new Blob(["\uFEFF" + toCSV(rows)], { type: "text/csv;charset=utf-8;" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url); }
function formatError(error) { if (!error) return "unknown"; if (typeof error === "object") return String(error.code || error.message || "unknown"); return String(error); }
function formatTime(iso) { if (!iso) return "尚未儲存"; try { return new Date(iso).toLocaleString("zh-TW"); } catch { return iso; } }
function todayDateStr() { return new Date().toISOString().split("T")[0]; }
function normalizeGrowthRow(raw) { if (!raw) return { IG: 0, TIKTOK: 0, XHS: 0, notes: "" }; if (typeof raw.IG === "number" || typeof raw.IG === "string") return { IG: Number(raw.IG || 0), TIKTOK: Number(raw.TIKTOK || 0), XHS: Number(raw.XHS || 0), notes: raw.notes || "" }; if ("IG_base" in raw || "IG_delta" in raw) return { IG: Number(raw.IG_base || 0) + Number(raw.IG_delta || 0), TIKTOK: Number(raw.TIKTOK_base || 0) + Number(raw.TIKTOK_delta || 0), XHS: Number(raw.XHS_base || 0) + Number(raw.XHS_delta || 0), notes: raw.notes || "" }; return { IG: 0, TIKTOK: 0, XHS: 0, notes: "" }; }
function computeGrowthRows(growthData) { const sortedKeys = Object.keys(growthData).sort(); return sortedKeys.map((key, idx) => { const cur = normalizeGrowthRow(growthData[key]); const prev = idx > 0 ? normalizeGrowthRow(growthData[sortedKeys[idx - 1]]) : null; const igDelta = prev !== null ? cur.IG - prev.IG : null; const ttDelta = prev !== null ? cur.TIKTOK - prev.TIKTOK : null; const xhDelta = prev !== null ? cur.XHS - prev.XHS : null; const totalCur = cur.IG + cur.TIKTOK + cur.XHS; const totalPrev = prev ? prev.IG + prev.TIKTOK + prev.XHS : null; return { key, isBase: idx === 0, igTotal: cur.IG, ttTotal: cur.TIKTOK, xhTotal: cur.XHS, igDelta, ttDelta, xhDelta, totalFollowers: totalCur, totalDelta: totalPrev !== null ? totalCur - totalPrev : null, notes: cur.notes }; }); }
function loadLocalBundle() { try { const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return { calendarData: defaultCalendarData, growthData: defaultGrowthData }; const parsed = JSON.parse(raw); return { calendarData: parsed.calendarData ?? defaultCalendarData, growthData: parsed.growthData ?? defaultGrowthData }; } catch { return { calendarData: defaultCalendarData, growthData: defaultGrowthData }; } }
function saveLocalBundle(bundle) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(bundle)); } catch (err) { console.error("localStorage 儲存失敗:", err); } }

// ─── Social API ───────────────────────────────────────────────────────────────
function safeJSON(raw) {
  let s = raw.replace(/```json|```/g, "").trim();
  const a = s.indexOf("{"), b = s.lastIndexOf("}");
  if (a !== -1 && b !== -1) s = s.slice(a, b + 1);
  try { return JSON.parse(s); } catch (_) {}
  let f = "", inS = false, esc = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (esc) { f += c; esc = false; continue; }
    if (c === "\\") { f += c; esc = true; continue; }
    if (c === '"') { inS = !inS; f += c; continue; }
    if (inS && c === "\n") { f += "\\n"; continue; }
    if (inS && c === "\r") continue;
    if (inS && c === "\t") { f += "\\t"; continue; }
    f += c;
  }
  try { return JSON.parse(f); } catch (_) {}
  throw new Error("AI 回傳格式異常，請重新生成");
}

async function callSocialAPI(messages, apiKey, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) await new Promise(r => setTimeout(r, 1500 * attempt));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 4000, messages }),
      });
      if (!res.ok) { if (attempt < retries) continue; throw new Error(`API ${res.status}`); }
      const data = await res.json();
      const text = data.content?.map(i => i.text || "").join("\n") || "";
      if (!text.trim()) { if (attempt < retries) continue; throw new Error("AI 回傳空內容"); }
      return safeJSON(text);
    } catch (e) { if (attempt >= retries) throw e; }
  }
}

async function genPlatform({ platformId, briefing, extraNotes, images = [], apiKey, stylePrompt = "" }) {
  const plat = SOC_PLATFORMS.find(p => p.id === platformId);
  const fmtDesc = plat.formats.map(f => `【${f.label}】字數上限${f.maxLen}字\n規則：${f.rules}`).join("\n\n");

  const IG_SIGNATURE = "\n\n—— BESTEA ——\n\n線上訂購 ▸ https://www.besttea1.com\n訂購專線 ▸ 05-5347859\nLINE官方 ▸ https://lin.ee/IKZCmex\n☞ 企業贈禮、大量訂購歡迎私訊";

  const textPrompt = `你是天下第一好茶 BESTEA 的品牌社群小編，負責 ${plat.label} 平台。用戶會給你素材描述，你要改寫成符合品牌調性和平台風格的文案。

【字數硬性規定（超過就是失敗）】
- 限動：不超過50字（抖音限動40字）
- 短影片/Reels：不超過80字
- 貼文/筆記：不超過150字
- 以上都不含 Hashtag

【版本差異化（非常重要）】
A/B/C三個版本必須有明顯不同：
- 版本A：情境畫面感切入
- 版本B：產品特色切入
- 版本C：生活情感切入

【開頭 Hook（前10個字決定生死）】
禁止用「無論是...」「在這個...」「隨著...」等平淡開頭。
- Instagram：有畫面感的短句，例：「煮水聲剛停。茶香就來了。」
- 抖音：生活口語，例：「喝了這杯 整個下午都不一樣了」
- 小紅書：生活故事感，例：「把高山茶裝進下午茶時光¸真的回不去了.ᐟ」

${platformId === "instagram" ? `【IG Reels 專屬規範｜品牌長文風】
這是品牌官方帳號的 Reels caption，不是抖音短影片字幕。請寫成「品牌主理人在分享一段故事/觀點」的長文，不是兩三句口號。

【結構（必須照寫）】
① Hook 一行：吸引人讀下去的開場，如「高山茶的珍貴，不只是海拔。」
② 故事段 2-3 段：每段 2-3 行短句，把產地/工藝/感官畫面說出來
③ 品牌觀點段 1-2 段：說出這款茶/這個品牌的態度
④ 詩意收尾 1 行：留白感的金句

【字數】180-280 字（不含 hashtag 與程式自動補的聯絡資訊區塊）

【語氣】
- 文青質感，有溫度，像在翻品牌的雜誌專欄
- 句子短、有停頓、有畫面
- 禁用「開賣」「值得」「推薦」「必買」，改用「珍藏」「品味」「感受」「藏著」「不只是」
- Emoji 限用：🤍🫧☁️🍃✨🤎☕🌿🕊（節制使用，1-3 個就夠）

【三版本切角必須完全不同】
- 版本A：從感官情境切入（喝茶當下的畫面、香氣、回甘）
- 版本B：從品牌價值/工藝切入（為什麼這款茶這樣做、品牌的堅持）
- 版本C：從生活儀式切入（茶融入日常、節氣、慢生活）

【極重要】copy 只寫上面四段結構的內容，到「詩意收尾」為止。不要寫「—— BESTEA ——」分隔線、不要寫官網/電話/LINE/B2B 資訊，程式會自動補上。` : ""}
${platformId === "tiktok" ? `【抖音 TikTok 專屬規範】超口語碎碎念接地氣。產品簡稱（梨山白茶→白茶，大禹嶺90K→90K，阿里山金萱→金萱）。短影片不用標點，用空格或Emoji斷句。全繁體中文。` : ""}
${platformId === "xiaohongshu" ? `【小紅書專屬規範】必須全程使用繁體中文，絕對不可以出現任何簡體字。用¸代替所有逗號，用.ᐟ代替所有驚嘆號。Hashtag固定順序：#天下第一好茶 → #BESTEA → #besteatw → 主題相關標籤。` : ""}

【Hashtag 規則】
- 放在 hashtags 陣列中，不要寫在 copy 文案裡
- 品牌標籤必放最前面：#天下第一好茶、#BESTEA、#besteatw
- IG：共5-8個；抖音：共3-5個；小紅書：共8-12個

${stylePrompt ? `【影片風格指定】\n${stylePrompt}` : ""}

${BRAND}

${briefing ? `【用戶提供的素材內容】\n${briefing}` : ""}
${images.length > 0 ? `【圖片素材】已附上${images.length}張圖片，融入文案。` : ""}
${extraNotes ? `【額外備註】${extraNotes}` : ""}

請撰寫以下格式：
${fmtDesc}

每個格式請生成3個不同版本（A/B/C）。
只回傳純 JSON，字串內換行用 \\n：
{
  "formats": [
    { "format_id": "${plat.formats[0].id}", "format_label": "${plat.formats[0].label}", "versions": [
      { "v": 1, "label": "版本A", "title": "", "copy": "", "hashtags": [], "tip": "" },
      { "v": 2, "label": "版本B", "title": "", "copy": "", "hashtags": [], "tip": "" },
      { "v": 3, "label": "版本C", "title": "", "copy": "", "hashtags": [], "tip": "" }
    ]}${plat.formats.length > 1 ? `,
    { "format_id": "${plat.formats[1]?.id}", "format_label": "${plat.formats[1]?.label}", "versions": [
      { "v": 1, "label": "版本A", "title": "", "copy": "", "hashtags": [], "tip": "" },
      { "v": 2, "label": "版本B", "title": "", "copy": "", "hashtags": [], "tip": "" },
      { "v": 3, "label": "版本C", "title": "", "copy": "", "hashtags": [], "tip": "" }
    ]}` : ""}
  ]
}`;

  const content = [];
  (images||[]).forEach(img => { content.push({ type: "image", source: { type: "base64", media_type: img.type, data: img.base64 } }); });
  content.push({ type: "text", text: textPrompt });
  const result = await callSocialAPI([{ role: "user", content }], apiKey);

  // 🔒 IG 強制補上聯絡資訊（不依賴 AI）
  if (platformId === "instagram" && result?.formats) {
    result.formats.forEach(fmt => {
      fmt.versions?.forEach(v => {
        if (v.copy) {
          let cleaned = v.copy
            .replace(/\n*——\s*BESTEA\s*——[\s\S]*$/i, "")
            .replace(/\n*線上訂購[\s\S]*$/i, "")
            .trim();
          v.copy = cleaned + IG_SIGNATURE;
        }
      });
    });
  }

  return result;
}


// ─── Social Components ────────────────────────────────────────────────────────
function FormatTab({ formats, activeIdx, onSelect, accent }) {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid #F0F0F0" }}>
      {formats.map((f, i) => (
        <button key={f.id} onClick={() => onSelect(i)} style={{ flex: 1, padding: "12px 0", border: "none", borderBottom: i === activeIdx ? `2.5px solid ${accent}` : "2.5px solid transparent", background: "transparent", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: i === activeIdx ? 800 : 500, color: i === activeIdx ? accent : "#AAA" }}>
          {f.label}
        </button>
      ))}
    </div>
  );
}

function CopyBlock({ item }) {
  const [copied, setCopied] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const full = item.copy + (item.hashtags?.length ? "\n\n" + item.hashtags.map(h => h.startsWith("#") ? h : `#${h}`).join(" ") : "");
  const copy = () => { navigator.clipboard.writeText(full); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const copyTitle = () => { navigator.clipboard.writeText(item.title); setCopiedTitle(true); setTimeout(() => setCopiedTitle(false), 2000); };
  return (
    <div style={{ padding: "18px 20px 16px" }}>
      {item.title && (
        <div style={{ marginBottom: 12, padding: "10px 12px", background: "#fff7ed", borderRadius: 10, border: "1px solid #fed7aa" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#c2410c", marginBottom: 6, letterSpacing: "0.05em" }}>📌 小紅書標題</div>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#111", marginBottom: 8 }}>{item.title}</div>
          <button onClick={copyTitle} style={{ background: copiedTitle ? "#10B981" : "#ea580c", color: "#fff", border: "none", borderRadius: 7, padding: "5px 14px", fontWeight: 700, cursor: "pointer", fontSize: 11, fontFamily: "inherit", transition: "all .2s" }}>
            {copiedTitle ? "✓ 已複製標題" : "複製標題"}
          </button>
        </div>
      )}
      <div style={{ fontSize: 14, lineHeight: 2, color: "#333", whiteSpace: "pre-wrap", marginBottom: 14 }}>{item.copy}</div>
      {item.hashtags?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
          {item.hashtags.map((h, i) => (
            <span key={i} style={{ background: "#F5F5F5", color: "#555", padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 500 }}>{h.startsWith("#") ? h : `#${h}`}</span>
          ))}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {item.tip && <div style={{ fontSize: 11, color: "#BBB", flex: 1 }}>💡 {item.tip}</div>}
        <button onClick={copy} style={{ background: copied ? "#10B981" : "#111", color: "#fff", border: "none", borderRadius: 8, padding: "7px 18px", fontWeight: 700, cursor: "pointer", fontSize: 11, fontFamily: "inherit", transition: "all .2s", flexShrink: 0, marginLeft: 12 }}>{copied ? "✓ 已複製" : "複製全文"}</button>
      </div>
    </div>
  );
}

function PlatformCard({ platformId, results, loading }) {
  const plat = SOC_PLATFORMS.find(p => p.id === platformId);
  const [tab, setTab] = useState(0);
  const [ver, setVer] = useState(0);
  const hasData = results?.formats?.length > 0;
  const curFmt = results?.formats?.[tab];
  const curItem = curFmt?.versions?.[ver] || curFmt;
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8E8E8", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.03)" }}>
      <div style={{ padding: "16px 20px 0", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>{plat.icon}</span>
        <span style={{ fontSize: 16, fontWeight: 900, color: "#111" }}>{plat.label}</span>
      </div>
      {plat.formats.length > 1 && (
        <div style={{ padding: "12px 20px 0" }}>
          <FormatTab formats={plat.formats} activeIdx={tab} onSelect={(i) => { setTab(i); setVer(0); }} accent={plat.accent} />
        </div>
      )}
      {loading ? (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <div style={{ width: 24, height: 24, border: "3px solid #EEE", borderTopColor: plat.accent, borderRadius: "50%", animation: "bspin .7s linear infinite", margin: "0 auto 10px" }} />
          <div style={{ fontSize: 13, color: "#BBB" }}>生成中...</div>
        </div>
      ) : hasData && curItem ? (
        <>
          {curFmt?.versions?.length > 1 && (
            <div style={{ display: "flex", gap: 6, padding: "10px 20px 0" }}>
              {curFmt.versions.map((v, i) => (
                <button key={i} onClick={() => setVer(i)} style={{ flex: 1, padding: "6px 4px", borderRadius: 8, border: i === ver ? `2px solid ${plat.accent}` : "1.5px solid #e2e8f0", background: i === ver ? `${plat.accent}10` : "#fff", color: i === ver ? plat.accent : "#94a3b8", fontSize: 12, fontWeight: i === ver ? 800 : 500, cursor: "pointer", fontFamily: "inherit" }}>
                  {v.label}
                </button>
              ))}
            </div>
          )}
          <CopyBlock item={curItem} />
        </>
      ) : (
        <div style={{ padding: "36px 20px", textAlign: "center", color: "#DDD", fontSize: 13 }}>點擊「生成文案」後顯示結果</div>
      )}
    </div>
  );
}

// ─── Social Tab ───────────────────────────────────────────────────────────────
function SocialTab({ prefillBriefing = "", onClearPrefill }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("bestea_anthropic_key") || "");
  const [showKey, setShowKey] = useState(!localStorage.getItem("bestea_anthropic_key"));
  const [selected, setSelected] = useState(["instagram", "tiktok", "xiaohongshu"]);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [briefing, setBriefing] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [results, setResults] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const fileRef = useRef(null);
  const resultsRef = useRef(null);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bestea_copy_history") || "[]"); } catch { return []; }
  });
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (prefillBriefing) {
      setBriefing(prefillBriefing);
      if (onClearPrefill) onClearPrefill();
    }
  }, [prefillBriefing]);

  const saveKey = () => { localStorage.setItem("bestea_anthropic_key", apiKey); setShowKey(false); };
  const toggle = id => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const compressImage = (dataUrl, type, maxSize = 800) => {
    return new Promise(resolve => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width, h = img.height;
        if (w > maxSize || h > maxSize) {
          if (w > h) { h = Math.round(h * maxSize / w); w = maxSize; }
          else { w = Math.round(w * maxSize / h); h = maxSize; }
        }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = dataUrl;
    });
  };

  const addFiles = useCallback((files) => {
    Array.from(files).forEach(file => {
      const isImg = file.type.startsWith("image/"), isVid = file.type.startsWith("video/");
      if (!isImg && !isVid) return;
      if (isImg) {
        const reader = new FileReader();
        reader.onload = async e => {
          const compressed = await compressImage(e.target.result, file.type);
          setImages(prev => prev.length < 10 ? [...prev, { base64: compressed.split(",")[1], type: "image/jpeg", preview: compressed, name: file.name, isVideo: false }] : prev);
        };
        reader.readAsDataURL(file);
      } else {
        const videoUrl = URL.createObjectURL(file);
        const video = document.createElement("video");
        video.src = videoUrl; video.muted = true; video.preload = "auto";
        video.onloadeddata = () => { video.currentTime = 1; };
        video.onseeked = () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth || 640; canvas.height = video.videoHeight || 360;
          canvas.getContext("2d").drawImage(video, 0, 0);
          const fd = canvas.toDataURL("image/jpeg", 0.85);
          setImages(prev => prev.length < 10 ? [...prev, { base64: fd.split(",")[1], type: "image/jpeg", preview: fd, name: file.name, isVideo: true }] : prev);
          URL.revokeObjectURL(videoUrl);
        };
      }
    });
  }, []);

  const removeImage = useCallback((idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    if (fileRef.current) fileRef.current.value = "";
  }, []);

  const generate = useCallback(async () => {
    if (!apiKey.trim()) { setError("請先輸入 Anthropic API Key"); setShowKey(true); return; }
    if (!briefing.trim() && !images.length) { setError("請輸入活動描述或上傳圖片/影片"); return; }
    if (!selected.length) { setError("請至少選擇一個平台"); return; }
    setError(""); setResults({});
    const lm = {}; selected.forEach(id => { lm[id] = true; }); setLoadingMap(lm);
    for (const pid of selected) {
      try {
        const res = await genPlatform({ platformId: pid, briefing, extraNotes, images, apiKey, stylePrompt: VIDEO_STYLES.find(s => s.id === selectedStyle)?.prompt || "" });
        setResults(prev => ({ ...prev, [pid]: res }));
      } catch (e) { setResults(prev => ({ ...prev, [pid]: { error: e.message } })); }
      setLoadingMap(prev => ({ ...prev, [pid]: false }));
      if (selected.indexOf(pid) < selected.length - 1) await new Promise(r => setTimeout(r, 800));
    }
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
  }, [selected, briefing, extraNotes, images, apiKey, selectedStyle]);

  const isLoading = Object.values(loadingMap).some(Boolean);
  const font = `'Noto Sans TC','SF Pro Display',-apple-system,sans-serif`;
  const inputBase = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E5E5E5", fontSize: 13, fontFamily: font, outline: "none", boxSizing: "border-box", color: "#111", background: "#fff" };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px 60px", fontFamily: font }}>
      {showKey && (
        <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 8 }}>🔑 請輸入 Anthropic API Key</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-ant-api03-..." style={{ ...inputBase, flex: 1, borderColor: "#fcd34d" }} />
            <button onClick={saveKey} style={{ padding: "0 16px", background: "#059669", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: font }}>確認</button>
          </div>
        </div>
      )}
      {!showKey && (
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setShowHistory(v => !v)} style={{ fontSize: 11, color: showHistory ? "#059669" : "#94a3b8", background: "none", border: "1px solid #e2e8f0", borderRadius: 6, padding: "3px 10px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
            🕐 歷史記錄 {history.length > 0 && `(${history.length})`}
          </button>
          <button onClick={() => setShowKey(true)} style={{ fontSize: 11, color: "#94a3b8", background: "none", border: "1px solid #e2e8f0", borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}>
            🔑 更換 API Key
          </button>
        </div>
      )}

      {showHistory && history.length > 0 && (
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
            <span>📋 最近生成記錄（點擊帶入）</span>
            <button onClick={() => { setHistory([]); localStorage.removeItem("bestea_copy_history"); }} style={{ fontSize: 10, color: "#dc2626", background: "none", border: "none", cursor: "pointer" }}>清除全部</button>
          </div>
          {history.map(h => (
            <div key={h.id} onClick={() => { setBriefing(h.briefing); setShowHistory(false); }}
              style={{ padding: "7px 10px", background: "#fff", borderRadius: 8, marginBottom: 5, border: "1px solid #e2e8f0", cursor: "pointer" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 2 }}>{h.briefing || "（無描述）"}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", display: "flex", gap: 8 }}>
                <span>⏰ {h.time}</span>
                <span>📱 {h.platforms.join(" · ")}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {prefillBriefing && (
        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: "#047857", fontWeight: 600 }}>
          ✨ 已帶入排程內容，可直接生成文案
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#AAA", letterSpacing: 1, display: "block", marginBottom: 8 }}>📝 活動 / 素材內容描述</label>
        <textarea value={briefing} onChange={e => setBriefing(e.target.value)}
          placeholder={"描述你的內容，AI 會根據這些資訊 + 上傳的圖片一起寫文案：\n\n• 活動：3月會員日，限定組加碼再折 NT$100\n• 影片：泡梨山白茶的過程，從開罐到出湯\n• 圖片：朝霞映春禮盒擺拍，搭配乾燥花\n• 新品：東方美人茶上市，蜜香果韻是賣點"}
          style={{ ...inputBase, minHeight: 130, resize: "vertical", lineHeight: 1.8 }} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#AAA", letterSpacing: 1, display: "block", marginBottom: 8 }}>📷 上傳圖片 / 影片（選填）— AI 會看圖寫文案</label>
        <div onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer?.files); }} onDragOver={e => e.preventDefault()}
          style={{ border: "2px dashed #DDD", borderRadius: 14, background: "#fff", padding: "16px", minHeight: 80 }}>
          {images.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
              {images.map((img, idx) => (
                <div key={idx} style={{ position: "relative", width: 80, height: 80 }}>
                  <img src={img.preview} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #e2e8f0" }} />
                  {img.isVideo && <div style={{ position: "absolute", top: 2, left: 2, background: "rgba(0,0,0,.6)", color: "#fff", fontSize: 9, borderRadius: 4, padding: "1px 4px" }}>影片</div>}
                  <button onClick={() => removeImage(idx)} style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#dc2626", color: "#fff", border: "none", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </div>
              ))}
              {images.length < 10 && (
                <div onClick={() => fileRef.current?.click()} style={{ width: 80, height: 80, border: "2px dashed #DDD", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#AAA", fontSize: 28 }}>+</div>
              )}
            </div>
          )}
          {images.length === 0 && (
            <div onClick={() => fileRef.current?.click()} style={{ textAlign: "center", cursor: "pointer", padding: "12px 0" }}>
              <div style={{ fontSize: 30, marginBottom: 6, opacity: .5 }}>📷</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#999" }}>點擊上傳或拖曳（最多10張）</div>
              <div style={{ fontSize: 11, color: "#CCC", marginTop: 4 }}>JPG · PNG · WEBP · MP4 · MOV</div>
            </div>
          )}
          {images.length > 0 && <div style={{ fontSize: 11, color: "#94a3b8" }}>{images.length}/10 · 點 + 繼續新增</div>}
        </div>
        <input ref={fileRef} type="file" accept="image/*,video/*" multiple style={{ display: "none" }} onChange={e => addFiles(e.target.files)} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#AAA", letterSpacing: 1, display: "block", marginBottom: 8 }}>平台（可多選）</label>
        <div style={{ display: "flex", gap: 8 }}>
          {SOC_PLATFORMS.map(p => {
            const on = selected.includes(p.id);
            return (
              <button key={p.id} onClick={() => toggle(p.id)} style={{ flex: "1 1 0", padding: "14px 12px", borderRadius: 12, cursor: "pointer", border: on ? `2px solid ${p.accent}` : "2px solid #EBEBEB", background: on ? `${p.accent}06` : "#fff", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "all .2s", fontFamily: font }}>
                <span style={{ fontSize: 22 }}>{p.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: on ? p.accent : "#888" }}>{p.label}</span>
                <span style={{ fontSize: 9, color: "#CCC" }}>限動·貼文·短影片</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#AAA", letterSpacing: 1, display: "block", marginBottom: 8 }}>
          🎬 影片風格（選填）
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {VIDEO_STYLES.map(s => {
            const on = selectedStyle === s.id;
            return (
              <button key={s.id} onClick={() => setSelectedStyle(on ? "" : s.id)}
                style={{ padding: "7px 12px", borderRadius: 99, border: on ? "2px solid #059669" : "1.5px solid #e2e8f0", background: on ? "#f0fdf4" : "#fff", color: on ? "#047857" : "#64748b", fontSize: 12, fontWeight: on ? 800 : 500, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>
                {s.label}
              </button>
            );
          })}
        </div>
        {selectedStyle && (
          <div style={{ fontSize: 11, color: "#059669", marginTop: 6, padding: "5px 10px", background: "#f0fdf4", borderRadius: 7 }}>
            ✓ {VIDEO_STYLES.find(s => s.id === selectedStyle)?.desc}
          </div>
        )}
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#AAA", letterSpacing: 1, display: "block", marginBottom: 8 }}>額外備註（選填）</label>
        <textarea value={extraNotes} onChange={e => setExtraNotes(e.target.value)} placeholder="折扣碼、活動期間、特殊要求..." style={{ ...inputBase, minHeight: 52, resize: "vertical", lineHeight: 1.7 }} />
      </div>

      {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: "#DC2626", fontSize: 12, fontWeight: 600 }}>{error}</div>}

      <button onClick={generate} disabled={isLoading} style={{ width: "100%", padding: "15px", borderRadius: 12, border: "none", background: isLoading ? "#D4D4D4" : "#111", color: "#fff", fontSize: 14, fontWeight: 800, cursor: isLoading ? "not-allowed" : "pointer", fontFamily: font, transition: "all .2s" }}>
        {isLoading ? "⏳ 生成中..." : `生成 ${selected.length} 平台 × 3 格式文案 →`}
      </button>

      <div ref={resultsRef} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
        {selected.map(pid => {
          const res = results[pid]; const ld = loadingMap[pid];
          if (res?.error) return <div key={pid} style={{ background: "#FEF2F2", borderRadius: 12, padding: 14, color: "#DC2626", fontSize: 12, fontWeight: 600 }}>❌ {SOC_PLATFORMS.find(p => p.id === pid)?.label}：{res.error}</div>;
          return <PlatformCard key={pid} platformId={pid} results={res} loading={ld} />;
        })}
      </div>
    </div>
  );
}

// ─── Growth Cell ─────────────────────────────────────────────────────────────
function GrowthCell({ val }) {
  if (val === null || val === undefined) return <span style={{ color: "#cbd5e1", fontSize: 12 }}>基準</span>;
  if (val > 0) return <span style={{ color: "#059669", fontWeight: 800, fontSize: 12, display: "inline-flex", alignItems: "center", gap: 2 }}><TrendingUp size={11} />{formatSigned(val)}</span>;
  if (val < 0) return <span style={{ color: "#dc2626", fontWeight: 800, fontSize: 12, display: "inline-flex", alignItems: "center", gap: 2 }}><TrendingDown size={11} />{formatSigned(val)}</span>;
  return <span style={{ color: "#94a3b8", fontWeight: 700, fontSize: 12, display: "inline-flex", alignItems: "center", gap: 2 }}><Minus size={11} />0</span>;
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [mainTab, setMainTab] = useState("planner");
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());
  const [calendarData, setCalendarData] = useState(() => loadLocalBundle().calendarData);
  const [growthData, setGrowthData] = useState(() => loadLocalBundle().growthData);

  const [socialPrefill, setSocialPrefill] = useState("");

  const [selectedDate, setSelectedDate] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editingIndex, setEditingIndex] = useState(0);
  const [selectedDateEntries, setSelectedDateEntries] = useState([normalizeEntry()]);
  const [editDate, setEditDate] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editCollaborators, setEditCollaborators] = useState("");
  const [editPlatform, setEditPlatform] = useState("");
  const [editHasPost, setEditHasPost] = useState(false);
  const [editHasVideo, setEditHasVideo] = useState(false);
  const [editHasStory, setEditHasStory] = useState(false);
  const [editScheduled, setEditScheduled] = useState(false);
  const [editPublished, setEditPublished] = useState(false);
  const [editIgCopy, setEditIgCopy] = useState("");
  const [editTiktokCopy, setEditTiktokCopy] = useState("");
  const [editXhsCopy, setEditXhsCopy] = useState("");
  const [editXhsTitle, setEditXhsTitle] = useState("");

  const [growthMonth, setGrowthMonth] = useState("");
  const [growthIG, setGrowthIG] = useState("");
  const [growthTT, setGrowthTT] = useState("");
  const [growthXH, setGrowthXH] = useState("");
  const [growthNotes, setGrowthNotes] = useState("");

  const [authReady, setAuthReady] = useState(false);
  const [isCloudReady, setIsCloudReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState("本機模式");
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  const clientIdRef = useRef(getClientId());
  const hasLoadedCloudRef = useRef(false);
  const skipNextUploadRef = useRef(false);
  const saveTimerRef = useRef(null);
  const initialSyncDoneRef = useRef(false);
  const calendarDataRef = useRef(calendarData);
  const growthDataRef = useRef(growthData);
  useEffect(() => { calendarDataRef.current = calendarData; }, [calendarData]);
  useEffect(() => { growthDataRef.current = growthData; }, [growthData]);

  const cloudDocRef = useMemo(() => doc(db, CLOUD_DOC_PATH.collection, CLOUD_DOC_PATH.document), []);
  const currentMonthKey = monthKeyFromYearMonth(currentYear, currentMonth);
  const monthNames = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
  const today = todayDateStr();

  useEffect(() => { saveLocalBundle({ calendarData, growthData }); }, [calendarData, growthData]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setCalendarData(prev => {
      let changed = false;
      const updated = {};
      Object.entries(prev).forEach(([date, val]) => {
        const entryDate = new Date(date);
        entryDate.setHours(0, 0, 0, 0);
        if (entryDate < today) {
          const entries = getEntriesFromDay(val);
          const newEntries = entries.map(e => {
            if (e.scheduled && !e.published) { changed = true; return { ...e, published: true }; }
            return e;
          });
          updated[date] = newEntries.length === 1 ? newEntries[0] : newEntries;
        } else {
          updated[date] = val;
        }
      });
      return changed ? updated : prev;
    });
  }, []);

  const writeCloudData = useCallback(async (bundle, reason = "manual") => {
    const now = new Date().toISOString();
    await setDoc(cloudDocRef, { ...bundle, updatedAt: now, updatedBy: clientIdRef.current, updateReason: reason });
    setLastSavedAt(now);
  }, [cloudDocRef]);

  useEffect(() => {
    signInAnonymously(auth).catch(err => { setSyncStatus(`雲端登入失敗：${formatError(err)}`); setAuthReady(true); });
    const unsub = onAuthStateChanged(auth, user => { setSyncStatus(user ? "已連線雲端" : "尚未登入雲端"); setAuthReady(true); });
    return unsub;
  }, []);

  useEffect(() => {
    if (!authReady || !auth.currentUser) return;
    setSyncStatus("正在載入雲端資料...");
    const unsub = onSnapshot(cloudDocRef, async snapshot => {
      try {
        const data = snapshot.data();
        if (data && (data.calendarData || data.growthData)) {
          const nc = data.calendarData ?? defaultCalendarData; const ng = data.growthData ?? defaultGrowthData;
          skipNextUploadRef.current = true; hasLoadedCloudRef.current = true; initialSyncDoneRef.current = true;
          setCalendarData(nc); setGrowthData(ng); setLastSavedAt(data.updatedAt || ""); setSyncStatus("已同步最新雲端資料"); setIsCloudReady(true);
        } else if (!initialSyncDoneRef.current) {
          const local = loadLocalBundle(); await writeCloudData(local, "initial-create");
          skipNextUploadRef.current = true; hasLoadedCloudRef.current = true; initialSyncDoneRef.current = true;
          setCalendarData(local.calendarData); setGrowthData(local.growthData); setSyncStatus("已建立雲端排程表"); setIsCloudReady(true);
        } else { hasLoadedCloudRef.current = true; setIsCloudReady(true); }
      } catch (err) { setSyncStatus(`初始化雲端失敗：${formatError(err)}`); hasLoadedCloudRef.current = true; setIsCloudReady(true); }
    }, err => { setSyncStatus(`雲端同步失敗：${formatError(err)}`); hasLoadedCloudRef.current = true; setIsCloudReady(true); });
    return unsub;
  }, [authReady, cloudDocRef, writeCloudData]);

  useEffect(() => {
    if (!authReady || !auth.currentUser) return;
    if (!hasLoadedCloudRef.current || !isCloudReady) return;
    if (skipNextUploadRef.current) { skipNextUploadRef.current = false; return; }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSyncStatus("儲存中...");
    saveTimerRef.current = setTimeout(async () => {
      try { await writeCloudData({ calendarData: calendarDataRef.current, growthData: growthDataRef.current }, "auto-save"); setSyncStatus("已自動儲存並同步"); }
      catch (err) { setSyncStatus(`雲端儲存失敗：${formatError(err)}`); }
    }, 600);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [calendarData, growthData, authReady, isCloudReady, writeCloudData]);

  const forceSyncNow = useCallback(async () => {
    if (!auth.currentUser) { setSyncStatus("尚未登入雲端，無法同步"); return; }
    setIsManualSyncing(true); setSyncStatus("手動同步中...");
    try { await writeCloudData({ calendarData: calendarDataRef.current, growthData: growthDataRef.current }, "manual-force-sync"); setSyncStatus("已手動同步成功"); }
    catch (err) { setSyncStatus(`手動同步失敗：${formatError(err)}`); }
    finally { setIsManualSyncing(false); }
  }, [writeCloudData]);

  const reloadFromCloud = useCallback(async () => {
    if (!auth.currentUser) { setSyncStatus("尚未登入雲端，無法重新載入"); return; }
    setIsManualSyncing(true); setSyncStatus("重新讀取雲端中...");
    try {
      const snap = await getDoc(cloudDocRef); const data = snap.data();
      if (data && (data.calendarData || data.growthData)) { skipNextUploadRef.current = true; setCalendarData(data.calendarData ?? defaultCalendarData); setGrowthData(data.growthData ?? defaultGrowthData); setLastSavedAt(data.updatedAt || ""); setSyncStatus("已重新載入雲端資料"); }
      else setSyncStatus("雲端目前沒有資料");
    } catch (err) { setSyncStatus(`重新讀取失敗：${formatError(err)}`); }
    finally { setIsManualSyncing(false); }
  }, [cloudDocRef]);

  const daysInMonth = useMemo(() => new Date(currentYear, currentMonth + 1, 0).getDate(), [currentYear, currentMonth]);
  const firstDayOfMonth = useMemo(() => new Date(currentYear, currentMonth, 1).getDay(), [currentYear, currentMonth]);
  const trailingEmptyCells = (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7;

  const stats = useMemo(() => {
    let posts = 0, reels = 0, stories = 0, scheduled = 0, published = 0, total = 0;
    Object.entries(calendarData).forEach(([date, raw]) => {
      const [y, m] = date.split("-").map(Number);
      if (y === currentYear && m - 1 === currentMonth) {
        const entries = getEntriesFromDay(raw); total += entries.length;
        posts += entries.filter(e => e.hasPost).length; reels += entries.filter(e => e.hasVideo).length;
        stories += entries.filter(e => e.hasStory).length; scheduled += entries.filter(e => e.scheduled).length; published += entries.filter(e => e.published).length;
      }
    });
    return { posts, reels, stories, scheduled, published, pending: total - published, total };
  }, [calendarData, currentYear, currentMonth]);

  const monthEntries = useMemo(() => {
    const rows = [];
    Object.entries(calendarData).forEach(([date, raw]) => {
      const [y, m] = date.split("-").map(Number);
      if (y === currentYear && m - 1 === currentMonth) getEntriesFromDay(raw).forEach((item, index) => rows.push({ date, index, ...item }));
    });
    return rows.sort((a, b) => { if (a.platform !== b.platform) return a.platform.localeCompare(b.platform); if (a.published !== b.published) return a.published ? 1 : -1; if (a.date !== b.date) return b.date.localeCompare(a.date); return a.index - b.index; });
  }, [calendarData, currentYear, currentMonth]);

  const monthEntriesByPlatform = useMemo(() => PLATFORM_OPTIONS.map(p => ({ ...p, items: monthEntries.filter(i => i.platform === p.value) })), [monthEntries]);
  const growthRows = useMemo(() => computeGrowthRows(growthData), [growthData]);
  const currentGrowthRow = useMemo(() => growthRows.find(r => r.key === currentMonthKey) || null, [growthRows, currentMonthKey]);

  const goToPrevMonth = useCallback(() => {
    if (currentYear === MIN_YEAR && currentMonth === MIN_MONTH) return;
    if (currentMonth === 0) { setCurrentYear(y => y - 1); setCurrentMonth(11); } else setCurrentMonth(m => m - 1);
  }, [currentYear, currentMonth]);

  const goToNextMonth = useCallback(() => {
    if (currentYear === MAX_YEAR && currentMonth === MAX_MONTH) return;
    if (currentMonth === 11) { setCurrentYear(y => y + 1); setCurrentMonth(0); } else setCurrentMonth(m => m + 1);
  }, [currentYear, currentMonth]);

  const loadGrowthForm = useCallback((monthKey) => {
    setGrowthMonth(monthKey); const raw = growthData[monthKey];
    if (raw) { const norm = normalizeGrowthRow(raw); setGrowthIG(norm.IG ? String(norm.IG) : ""); setGrowthTT(norm.TIKTOK ? String(norm.TIKTOK) : ""); setGrowthXH(norm.XHS ? String(norm.XHS) : ""); setGrowthNotes(norm.notes || ""); }
    else { setGrowthIG(""); setGrowthTT(""); setGrowthXH(""); setGrowthNotes(""); }
  }, [growthData]);

  useEffect(() => { loadGrowthForm(currentMonthKey); }, [currentMonthKey, loadGrowthForm]);
  const clearGrowthForm = useCallback(() => { setGrowthIG(""); setGrowthTT(""); setGrowthXH(""); setGrowthNotes(""); }, []);

  const saveGrowth = async () => {
    const key = growthMonth || currentMonthKey;
    const rowToSave = { IG: growthIG === "" ? 0 : Number(growthIG), TIKTOK: growthTT === "" ? 0 : Number(growthTT), XHS: growthXH === "" ? 0 : Number(growthXH), notes: growthNotes.trim() };
    const nextGrowthData = { ...growthDataRef.current, [key]: rowToSave }; setGrowthData(nextGrowthData);
    if (auth.currentUser) { try { setSyncStatus("粉絲數量儲存中..."); await writeCloudData({ calendarData: calendarDataRef.current, growthData: nextGrowthData }, "save-growth"); setSyncStatus("粉絲數量已儲存並同步"); } catch (err) { setSyncStatus(`粉絲數量儲存失敗：${formatError(err)}`); } }
  };

  const deleteGrowthMonth = async (key) => {
    const next = { ...growthDataRef.current }; delete next[key]; setGrowthData(next);
    if (auth.currentUser) { try { await writeCloudData({ calendarData: calendarDataRef.current, growthData: next }, "delete-growth"); setSyncStatus("已刪除並同步"); } catch (err) { setSyncStatus(`刪除失敗：${formatError(err)}`); } }
  };

  const loadEntryToForm = useCallback((entry, dateStr) => {
    const safe = normalizeEntry(entry); setEditDate(dateStr || ""); setEditTitle(safe.title); setEditNotes(safe.notes); setEditCollaborators(safe.collaborators || ""); setEditPlatform(safe.platform); setEditHasPost(safe.hasPost); setEditHasVideo(safe.hasVideo); setEditHasStory(safe.hasStory); setEditScheduled(safe.scheduled); setEditPublished(safe.published); setEditIgCopy(safe.igCopy || "");
    setEditTiktokCopy(safe.tiktokCopy || "");
    setEditXhsCopy(safe.xhsCopy || "");
    setEditXhsTitle(safe.xhsTitle || "");
  }, []);

  const clearEditing = useCallback(() => { setEditTitle(""); setEditNotes(""); setEditCollaborators(""); setEditPlatform(""); setEditHasPost(false); setEditHasVideo(false); setEditHasStory(false); setEditScheduled(false); setEditPublished(false); }, []);
  const getFormValues = () => ({ title: editTitle, notes: editNotes, collaborators: editCollaborators, platform: editPlatform, hasPost: editHasPost, hasVideo: editHasVideo, hasStory: editHasStory, scheduled: editScheduled, published: editPublished, igCopy: editIgCopy, tiktokCopy: editTiktokCopy, xhsCopy: editXhsCopy, xhsTitle: editXhsTitle });
  const openBlankEntryForDate = useCallback((dateStr) => { setSelectedDate(dateStr); setSelectedDateEntries([normalizeEntry()]); setEditingIndex(0); setEditDate(dateStr); clearEditing(); }, [clearEditing]);
  const handleDateClick = useCallback((dateStr, targetIndex = 0) => { const entries = getEntriesFromDay(calendarData[dateStr]); const safeEntries = entries.length ? entries : [normalizeEntry()]; const safeIndex = Math.min(targetIndex, safeEntries.length - 1); setSelectedDate(dateStr); setSelectedDateEntries(safeEntries); setEditingIndex(safeIndex); loadEntryToForm(safeEntries[safeIndex], dateStr); }, [calendarData, loadEntryToForm]);
  const closeModal = useCallback(() => { setSelectedDate(null); setEditingIndex(0); setSelectedDateEntries([normalizeEntry()]); setEditDate(""); clearEditing(); }, [clearEditing]);

  const switchEditingItem = (index) => {
    const saved = getFormValues();
    setSelectedDateEntries(prev => {
      const next = [...prev];
      next[editingIndex] = normalizeEntry({ ...prev[editingIndex], ...saved });
      setTimeout(() => loadEntryToForm(next[index], editDate), 0);
      return next;
    });
    setEditingIndex(index);
  };
  const addNewScheduleItem = () => {
    if (selectedDateEntries.length >= 3) return;
    setSelectedDateEntries(prev => { const next = [...prev]; next[editingIndex] = normalizeEntry({ ...prev[editingIndex], ...getFormValues() }); next.push(normalizeEntry()); return next; });
    setEditingIndex(p => p + 1);
    clearEditing();
  };
  const removeCurrentEditingItemOnly = () => { setSelectedDateEntries(prev => { if (!prev.length) return prev; const next = prev.filter((_, i) => i !== editingIndex); if (next.length === 0) { setEditingIndex(0); clearEditing(); return [normalizeEntry()]; } const ni = Math.max(0, editingIndex - 1); setEditingIndex(ni); loadEntryToForm(next[ni], editDate); return next; }); };

  const saveEntry = async () => {
    const targetDate = editDate || selectedDate; if (!targetDate) return;
    const draft = normalizeEntry({ ...(selectedDateEntries[editingIndex] ?? normalizeEntry()), ...getFormValues() });
    const nextDayEntries = [...selectedDateEntries]; nextDayEntries[editingIndex] = draft;
    const packed = packEntriesForSave(nextDayEntries); const next = { ...calendarDataRef.current };
    if (selectedDate && selectedDate !== targetDate) { const oldEntries = getEntriesFromDay(next[selectedDate]).filter((_, i) => i !== editingIndex); const oldPacked = packEntriesForSave(oldEntries); if (!oldPacked) delete next[selectedDate]; else next[selectedDate] = oldPacked; }
    if (!packed) delete next[targetDate]; else next[targetDate] = packed;
    setCalendarData(next); closeModal();
    if (auth.currentUser) { try { setSyncStatus("儲存中..."); await writeCloudData({ calendarData: next, growthData: growthDataRef.current }, "save-entry"); setSyncStatus("已儲存並同步"); } catch (err) { setSyncStatus(`儲存同步失敗：${formatError(err)}`); } }
  };

  const deleteEntry = async () => {
    if (!selectedDate) return; const next = { ...calendarDataRef.current }; delete next[selectedDate]; setCalendarData(next); closeModal();
    if (auth.currentUser) { try { setSyncStatus("刪除後同步中..."); await writeCloudData({ calendarData: next, growthData: growthDataRef.current }, "delete-entry"); setSyncStatus("已刪除並同步"); } catch (err) { setSyncStatus(`刪除同步失敗：${formatError(err)}`); } }
  };

  const exportCSV = useCallback(() => {
    const rows = [["日期","序號","平台","主題","備註","協作者","貼文","REELS","限時動態","已排程","已發布"], ...Object.entries(calendarDataRef.current).sort((a, b) => a[0].localeCompare(b[0])).flatMap(([date, raw]) => getEntriesFromDay(raw).map((item, idx) => [date, idx + 1, PLATFORM_LABEL_MAP[item.platform] || item.platform, item.title || "", item.notes || "", item.collaborators || "", item.hasPost ? "是" : "否", item.hasVideo ? "是" : "否", item.hasStory ? "是" : "否", item.scheduled ? "是" : "否", item.published ? "是" : "否"]))];
    downloadCSV(`content-calendar-${currentYear}-${String(currentMonth + 1).padStart(2, "0")}.csv`, rows);
  }, [currentYear, currentMonth]);

  const exportGrowthCSV = useCallback(() => {
    const rows = [["月份","IG 粉絲總數","IG 成長","TikTok 粉絲總數","TikTok 成長","小紅書粉絲總數","小紅書成長","三平台總粉絲","三平台總成長","備註"], ...growthRows.map(r => [r.key, r.igTotal, r.igDelta !== null ? r.igDelta : "基準", r.ttTotal, r.ttDelta !== null ? r.ttDelta : "基準", r.xhTotal, r.xhDelta !== null ? r.xhDelta : "基準", r.totalFollowers, r.totalDelta !== null ? r.totalDelta : "基準", r.notes])];
    downloadCSV("follower-growth.csv", rows);
  }, [growthRows]);

  const TAB_OPTIONS = [
    { value: "planner", label: "排程表", icon: Calendar },
    { value: "social", label: "社群文案", icon: Edit },
    { value: "growth", label: "粉絲成長", icon: BarChart3 },
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Arial, "Noto Sans TC", sans-serif; background: #f8fafc; color: #0f172a; }
        button, input, textarea, select { font: inherit; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bspin { to { transform: rotate(360deg); } }
        .app { min-height: 100vh; padding: 24px; background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); }
        .container { max-width: 1360px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; margin-bottom: 28px; flex-wrap: wrap; }
        .left-head { flex: 1; min-width: 320px; }
        .badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 999px; background: #d1fae5; color: #047857; font-size: 12px; font-weight: 700; margin-bottom: 14px; }
        .title { font-size: 42px; line-height: 1.08; margin: 0 0 16px 0; font-weight: 900; letter-spacing: -0.02em; }
        .title .accent { color: #059669; }
        .tabs { display: inline-flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
        .tab-btn { border: 1px solid #cbd5e1; background: #fff; color: #334155; border-radius: 14px; padding: 9px 14px; display: inline-flex; align-items: center; gap: 8px; font-weight: 900; cursor: pointer; font-size: 14px; }
        .tab-btn.active { background: #0f172a; color: #fff; border-color: #0f172a; }
        .controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
        .select-wrap { position: relative; }
        .select { appearance: none; border: 2px solid #e2e8f0; background: #fff; border-radius: 12px; padding: 9px 36px 9px 13px; font-size: 15px; font-weight: 700; color: #334155; outline: none; }
        .select-arrow { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
        .nav-buttons { display: flex; gap: 8px; }
        .icon-btn { width: 40px; height: 40px; border-radius: 11px; border: 1px solid #cbd5e1; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #475569; }
        .icon-btn:hover { background: #f8fafc; }
        .icon-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .head-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; align-items: center; }
        .secondary-btn { height: 34px; padding: 0 10px; border-radius: 11px; border: 1px solid #cbd5e1; background: #fff; color: #334155; display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 800; cursor: pointer; }
        .secondary-btn:hover { background: #f8fafc; }
        .sync-chip { display: inline-flex; align-items: center; gap: 6px; color: #94a3b8; font-size: 11px; font-weight: 700; white-space: nowrap; }
        .sync-sub { color: #94a3b8; }
        .head-actions .sync-chip.compact { width: 100%; opacity: 0.9; margin-top: -2px; }
        .stats { display: grid; grid-template-columns: repeat(6, minmax(96px, 1fr)); gap: 10px; min-width: 560px; }
        .growth-stats-header { display: grid; grid-template-columns: repeat(4, minmax(118px, 1fr)); gap: 10px; min-width: 460px; }
        .stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 14px; text-align: center; box-shadow: 0 3px 12px rgba(15,23,42,0.05); }
        .stat-label { font-size: 10px; color: #94a3b8; font-weight: 800; letter-spacing: 0.06em; margin-bottom: 5px; }
        .stat-value { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 24px; font-weight: 900; }
        .content-layout { display: grid; grid-template-columns: minmax(0, 1fr) 540px; gap: 20px; align-items: start; }
        .content-layout.expanded { grid-template-columns: 1fr; }
        .growth-layout { display: flex; flex-direction: column; gap: 20px; }
        .calendar-shell { background: #fff; border: 1px solid #e2e8f0; border-radius: 22px; overflow: hidden; box-shadow: 0 10px 32px rgba(15,23,42,0.07); }
        .weekday-row { display: grid; grid-template-columns: repeat(7, 1fr); background: #1e293b; color: rgba(255,255,255,0.88); }
        .weekday { text-align: center; padding: 13px 6px; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; }
        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: #e2e8f0; }
        .empty-cell { min-height: 116px; background: #f8fafc; }
        .day-cell { min-height: 116px; background: #fff; padding: 8px; cursor: pointer; position: relative; transition: background 0.12s; }
        .day-cell:hover { background: #f0fdf4; }
        .day-cell.published { background: #fef2f2; }
        .day-cell.published:hover { background: #fee2e2; }
        .day-cell.scheduled:not(.published) { background: #eff6ff; }
        .day-cell.scheduled:not(.published):hover { background: #dbeafe; }
        .day-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
        .day-number { width: 24px; height: 24px; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #64748b; }
        .day-number.today { background: #059669; color: #fff; }
        .day-number.published { background: #dc2626; color: #fff; }
        .day-number.scheduled:not(.published) { background: #2563eb; color: #fff; }
        .day-icons { display: flex; gap: 3px; align-items: center; justify-content: flex-end; flex-wrap: wrap; }
        .published-check, .scheduled-check, .count-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 16px; height: 16px; border-radius: 999px; color: #fff; font-size: 9px; font-weight: 900; padding: 0 4px; }
        .published-check { background: #dc2626; }
        .scheduled-check { background: #2563eb; }
        .count-badge { background: #0f172a; }
        .day-items { display: flex; flex-direction: column; gap: 3px; margin-top: 4px; }
        .day-title { font-size: 10px; line-height: 1.3; font-weight: 800; color: #065f46; background: rgba(209,250,229,0.8); border: 1px solid #a7f3d0; border-radius: 6px; padding: 4px 6px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .day-title.scheduled:not(.published) { color: #1d4ed8; background: #dbeafe; border-color: #93c5fd; }
        .day-title.published { color: #991b1b; background: #fee2e2; border-color: #fecaca; }
        .platform-mini { display: inline-flex; align-items: center; gap: 3px; font-size: 9px; font-weight: 900; color: #475569; margin-bottom: 1px; }
        .day-plus { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #cbd5e1; opacity: 0; transition: opacity 0.15s; }
        .day-cell:hover .day-plus { opacity: 1; }
        .sidebar { background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 18px; box-shadow: 0 10px 32px rgba(15,23,42,0.06); position: sticky; top: 20px; max-height: calc(100vh - 40px); overflow: auto; }
        .sidebar-tools { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
        .sidebar-tool-actions { display: flex; gap: 8px; }
        .mini-btn { height: 30px; padding: 0 10px; border-radius: 8px; border: 1px solid #cbd5e1; background: #fff; color: #334155; display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 800; cursor: pointer; }
        .mini-btn:hover { background: #f8fafc; }
        .sidebar-title, .section-title { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 900; margin-bottom: 4px; }
        .sidebar-subtitle, .section-subtitle { font-size: 12px; color: #64748b; margin-bottom: 14px; }
        .platform-grid { display: grid; grid-template-columns: repeat(3, minmax(148px, 1fr)); gap: 14px; align-items: start; }
        .platform-section { min-width: 0; }
        .platform-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; }
        .platform-title { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 900; }
        .platform-count { font-size: 11px; font-weight: 900; padding: 3px 8px; border-radius: 999px; background: #f1f5f9; color: #475569; }
        .entry-list { display: flex; flex-direction: column; gap: 7px; }
        .entry-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 11px; background: #fff; cursor: pointer; transition: 0.12s; }
        .entry-card:hover { border-color: #86efac; background: #f0fdf4; }
        .entry-card.scheduled:not(.published) { background: #eff6ff; border-color: #bfdbfe; }
        .entry-card.published { background: #fef2f2; border-color: #fecaca; }
        .entry-top { display: flex; justify-content: space-between; gap: 6px; align-items: center; margin-bottom: 4px; }
        .entry-date { font-size: 11px; font-weight: 900; color: #475569; }
        .entry-status { font-size: 10px; font-weight: 900; padding: 3px 7px; border-radius: 999px; white-space: nowrap; }
        .entry-status.done { background: #fee2e2; color: #b91c1c; }
        .entry-status.scheduled { background: #dbeafe; color: #1d4ed8; }
        .entry-status.wait { background: #ecfdf5; color: #047857; }
        .entry-title { font-size: 12px; font-weight: 900; line-height: 1.4; margin-bottom: 4px; color: #0f172a; }
        .entry-meta { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 3px; }
        .entry-chip { display: inline-flex; align-items: center; gap: 3px; padding: 3px 7px; border-radius: 999px; background: #f8fafc; color: #475569; font-size: 10px; font-weight: 800; }
        .entry-notes { font-size: 11px; color: #64748b; line-height: 1.4; }
        .empty-state { border: 1px dashed #e2e8f0; border-radius: 12px; padding: 14px; text-align: center; color: #94a3b8; font-size: 12px; line-height: 1.6; background: #f8fafc; }
        .footer { margin-top: 16px; background: rgba(255,255,255,0.85); border: 1px solid #e2e8f0; border-radius: 16px; padding: 13px 18px; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
        .legend { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .legend-item { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: #475569; }
        .legend-dot { width: 9px; height: 9px; border-radius: 999px; }
        .legend-note { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #94a3b8; }
        .overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.55); display: flex; align-items: center; justify-content: center; padding: 16px; z-index: 999; }
        .modal { width: 100%; max-width: 660px; background: #fff; border-radius: 26px; overflow: hidden; box-shadow: 0 28px 70px rgba(15,23,42,0.3); max-height: calc(100vh - 32px); overflow-y: auto; }
        .modal-head { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #fff; padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; }
        .modal-head-title { font-size: 17px; font-weight: 900; }
        .close-btn { width: 34px; height: 34px; border: none; border-radius: 999px; background: rgba(255,255,255,0.15); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .modal-body { padding: 18px 22px 22px; }
        .schedule-tabs { display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 14px; }
        .schedule-tab { border: 1px solid #e2e8f0; background: #fff; border-radius: 9px; padding: 6px 11px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 800; color: #475569; }
        .schedule-tab.active { background: #ecfdf5; border-color: #34d399; color: #047857; }
        .schedule-tab.add { border-style: dashed; background: #f8fafc; }
        .field-group { margin-bottom: 11px; }
        .field-label { display: block; font-size: 10px; font-weight: 800; color: #94a3b8; margin-bottom: 5px; letter-spacing: 0.06em; text-transform: uppercase; }
        .text-input, .textarea, .date-input, .number-input { width: 100%; border: 2px solid #e2e8f0; background: #f8fafc; border-radius: 11px; padding: 10px 12px; font-size: 14px; font-weight: 700; color: #334155; outline: none; }
        .text-input:focus, .textarea:focus, .date-input:focus, .number-input:focus { border-color: #059669; background: #fff; }
        .textarea { min-height: 52px; resize: vertical; line-height: 1.5; }
        .two-cols { display: grid; gap: 11px; grid-template-columns: 1fr 1fr; }
        .three-cols { display: grid; gap: 11px; grid-template-columns: 1fr 1fr 1fr; }
        .platform-btn-group { display: flex; gap: 8px; flex-wrap: wrap; }
        .platform-btn { border: 2px solid #e2e8f0; background: #f8fafc; border-radius: 9px; padding: 8px 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 800; color: #64748b; transition: 0.1s; }
        .platform-btn:hover { background: #fff; border-color: #cbd5e1; color: #334155; }
        .platform-btn.active-IG { border-color: #e1306c; background: #fff0f6; color: #be185d; }
        .platform-btn.active-TIKTOK { border-color: #475569; background: #f1f5f9; color: #0f172a; }
        .platform-btn.active-XHS { border-color: #fe2c55; background: #fff1f2; color: #be123c; }
        .post-type-group { display: flex; gap: 8px; }
        .post-type-btn { flex: 1; border: 2px solid #e2e8f0; background: #f8fafc; border-radius: 13px; padding: 13px 8px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 12px; font-weight: 900; color: #64748b; transition: 0.1s; }
        .post-type-btn:hover { background: #fff; border-color: #cbd5e1; color: #334155; }
        .post-type-btn.active-post { background: #f5f3ff; border-color: #7c3aed; color: #5b21b6; }
        .post-type-btn.active-video { background: #ecfdf5; border-color: #10b981; color: #047857; }
        .post-type-btn.active-story { background: #fffbeb; border-color: #f59e0b; color: #b45309; }
        .status-group { display: flex; gap: 8px; }
        .status-btn { flex: 1; border: 2px solid #e2e8f0; background: #f8fafc; border-radius: 11px; padding: 10px 8px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 5px; font-size: 12px; font-weight: 900; color: #64748b; transition: 0.1s; }
        .status-btn:hover { background: #fff; border-color: #cbd5e1; }
        .status-btn.active-scheduled { background: #dbeafe; border-color: #2563eb; color: #1d4ed8; }
        .status-btn.active-published { background: #fee2e2; border-color: #ef4444; color: #b91c1c; }
        .modal-actions { margin-top: 16px; display: flex; gap: 9px; align-items: center; }
        .danger-btn { border: none; background: transparent; color: #94a3b8; cursor: pointer; padding: 8px; border-radius: 8px; display: inline-flex; align-items: center; }
        .danger-btn:hover { color: #dc2626; background: #fff1f2; }
        .minor-btn { border-radius: 9px; border: 1px solid #cbd5e1; background: #fff; color: #334155; padding: 9px 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 800; }
        .minor-btn:hover { background: #f8fafc; }
        .save-btn { flex: 1; border: none; border-radius: 13px; background: #059669; color: #fff; padding: 12px; font-size: 14px; font-weight: 900; display: flex; align-items: center; justify-content: center; gap: 7px; cursor: pointer; }
        .save-btn:hover { background: #047857; }
        .growth-form-shell { background: #fff; border: 1px solid #e2e8f0; border-radius: 22px; box-shadow: 0 8px 28px rgba(15,23,42,0.06); }
        .growth-form-body { padding: 20px 24px 24px; }
        .growth-actions { margin-top: 13px; display: flex; gap: 9px; align-items: center; }
        .info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 11px; padding: 10px 14px; font-size: 12px; color: #1e40af; margin-bottom: 14px; display: flex; align-items: flex-start; gap: 8px; line-height: 1.55; }
        .growth-table-shell { background: #fff; border: 1px solid #e2e8f0; border-radius: 22px; overflow: hidden; box-shadow: 0 8px 28px rgba(15,23,42,0.06); }
        .growth-table { width: 100%; border-collapse: collapse; }
        .growth-table th { background: #1e293b; color: rgba(255,255,255,0.8); font-size: 10px; font-weight: 800; letter-spacing: 0.05em; padding: 12px 13px; text-align: left; white-space: nowrap; }
        .growth-table td { padding: 11px 13px; font-size: 13px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .growth-table tr:last-child td { border-bottom: none; }
        .growth-table tr:hover td { background: #f8fafc; }
        .growth-table tr.current-month td { background: #f0fdf4; }
        .growth-table tr.base-row td { background: #fafaf9; }
        .month-label { font-weight: 900; color: #0f172a; white-space: nowrap; }
        .current-badge { display: inline-block; background: #059669; color: #fff; font-size: 9px; font-weight: 900; padding: 2px 6px; border-radius: 999px; margin-left: 5px; }
        .base-badge { display: inline-block; background: #7c3aed; color: #fff; font-size: 9px; font-weight: 900; padding: 2px 6px; border-radius: 999px; margin-left: 5px; }
        .num-cell { font-weight: 800; color: #0f172a; }
        .notes-cell { font-size: 11px; color: #64748b; max-width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .edit-row-btn { border: 1px solid #e2e8f0; background: #fff; color: #475569; border-radius: 7px; padding: 3px 9px; font-size: 11px; font-weight: 800; cursor: pointer; margin-right: 4px; }
        .edit-row-btn:hover { background: #f0fdf4; border-color: #059669; color: #059669; }
        .del-row-btn { border: 1px solid #e2e8f0; background: #fff; color: #94a3b8; border-radius: 7px; padding: 3px 7px; font-size: 11px; cursor: pointer; }
        .del-row-btn:hover { background: #fff1f2; border-color: #dc2626; color: #dc2626; }
        @media (max-width: 1100px) { .content-layout { grid-template-columns: 1fr; } .sidebar { position: static; max-height: none; } .stats { grid-template-columns: repeat(3, 1fr); min-width: 0; } .growth-stats-header { grid-template-columns: repeat(2, 1fr); min-width: 0; } .platform-grid { grid-template-columns: 1fr; } }
        @media (max-width: 768px) { .app { padding: 12px; } .title { font-size: 28px; } .day-cell, .empty-cell { min-height: 76px; } .two-cols, .three-cols { grid-template-columns: 1fr; } .stats, .growth-stats-header { grid-template-columns: repeat(2, 1fr); } .post-type-group, .status-group { gap: 6px; } }
      `}</style>

      <div className="app">
        <div className="container">
          <div className="header">
            <div className="left-head">
              <div className="badge"><Sparkles size={13} />品牌行銷規劃系統 (2026-2030)</div>
              <h1 className="title">Bestea <span className="accent">多平台</span> 排程表</h1>
              <div className="tabs">
                {TAB_OPTIONS.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.value} className={`tab-btn ${mainTab === tab.value ? "active" : ""}`} onClick={() => setMainTab(tab.value)} type="button">
                      <Icon size={15} />{tab.label}
                    </button>
                  );
                })}
              </div>
              {mainTab !== "social" && (
                <>
                  <div className="controls">
                    <div className="select-wrap">
                      <select className="select" value={currentYear} onChange={e => { const v = Number(e.target.value); setCurrentYear(v); if (v === 2026 && currentMonth < 2) setCurrentMonth(2); }}>
                        {[2026, 2027, 2028, 2029, 2030].map(y => <option key={y} value={y}>{y} 年</option>)}
                      </select>
                      <ChevronDown size={15} className="select-arrow" />
                    </div>
                    <div className="select-wrap">
                      <select className="select" value={currentMonth} onChange={e => setCurrentMonth(Number(e.target.value))}>
                        {monthNames.map((name, idx) => <option key={idx} value={idx} disabled={currentYear === 2026 && idx < 2}>{name}</option>)}
                      </select>
                      <ChevronDown size={15} className="select-arrow" />
                    </div>
                    <div className="nav-buttons">
                      <button className="icon-btn" onClick={goToPrevMonth} disabled={currentYear === MIN_YEAR && currentMonth === MIN_MONTH}><ChevronLeft size={18} /></button>
                      <button className="icon-btn" onClick={goToNextMonth} disabled={currentYear === MAX_YEAR && currentMonth === MAX_MONTH}><ChevronRight size={18} /></button>
                    </div>
                  </div>
                  <div className="head-actions">
                    <button className="secondary-btn" onClick={mainTab === "planner" ? exportCSV : exportGrowthCSV}><Download size={14} />{mainTab === "planner" ? "匯出排程 CSV" : "匯出粉絲數 CSV"}</button>
                    <button className="secondary-btn" onClick={forceSyncNow} disabled={isManualSyncing}>{isManualSyncing ? <Loader2 size={14} className="spin" /> : <Cloud size={14} />}手動同步</button>
                    <button className="secondary-btn" onClick={reloadFromCloud} disabled={isManualSyncing}><RefreshCw size={14} />重新載入雲端</button>
                    <div className="sync-chip compact">{!authReady || !isCloudReady ? <Loader2 size={12} className="spin" /> : <Cloud size={12} />}<span>{syncStatus}</span><span className="sync-sub">　最後儲存：{formatTime(lastSavedAt)}</span></div>
                  </div>
                </>
              )}
            </div>

            {mainTab === "planner" && (
              <div className="stats">
                <div className="stat-card"><div className="stat-label">貼文</div><div className="stat-value"><Image size={15} color="#7c3aed" />{stats.posts}</div></div>
                <div className="stat-card"><div className="stat-label">REELS</div><div className="stat-value"><Video size={15} color="#10b981" />{stats.reels}</div></div>
                <div className="stat-card"><div className="stat-label">限時動態</div><div className="stat-value"><Smartphone size={15} color="#f59e0b" />{stats.stories}</div></div>
                <div className="stat-card"><div className="stat-label">已排程</div><div className="stat-value"><Calendar size={15} color="#2563eb" />{stats.scheduled}</div></div>
                <div className="stat-card"><div className="stat-label">已發布</div><div className="stat-value"><CheckCircle2 size={15} color="#dc2626" />{stats.published}</div></div>
                <div className="stat-card"><div className="stat-label">待發布</div><div className="stat-value"><ClipboardList size={15} color="#475569" />{stats.pending}</div></div>
              </div>
            )}
            {mainTab === "growth" && (currentGrowthRow ? (
              <div className="growth-stats-header">
                <div className="stat-card"><div className="stat-label">Instagram</div><div className="stat-value"><Instagram size={15} color="#e1306c" />{formatNumber(currentGrowthRow.igTotal)}</div></div>
                <div className="stat-card"><div className="stat-label">TikTok</div><div className="stat-value"><Music2 size={15} />{formatNumber(currentGrowthRow.ttTotal)}</div></div>
                <div className="stat-card"><div className="stat-label">小紅書</div><div className="stat-value"><BookText size={15} color="#fe2c55" />{formatNumber(currentGrowthRow.xhTotal)}</div></div>
                <div className="stat-card"><div className="stat-label">本月成長</div><div className="stat-value" style={{ fontSize: currentGrowthRow.isBase ? 13 : 22, color: currentGrowthRow.isBase ? "#7c3aed" : (currentGrowthRow.totalDelta || 0) >= 0 ? "#059669" : "#dc2626" }}>{currentGrowthRow.isBase ? "基準月" : <>{(currentGrowthRow.totalDelta || 0) >= 0 ? <TrendingUp size={15} color="#059669" /> : <TrendingDown size={15} color="#dc2626" />}{formatSigned(currentGrowthRow.totalDelta)}</>}</div></div>
              </div>
            ) : (
              <div className="growth-stats-header"><div className="stat-card" style={{ gridColumn: "1/-1" }}><div className="stat-label">尚無粉絲資料</div><div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>請在下方新增第一筆基準數據</div></div></div>
            ))}
          </div>

          <div style={{ display: mainTab === "social" ? "block" : "none" }}>
            <SocialTab prefillBriefing={socialPrefill} onClearPrefill={() => setSocialPrefill("")} />
          </div>

          {mainTab === "planner" && (
            <div className={`content-layout ${sidebarCollapsed ? "expanded" : ""}`}>
              <div>
                <div className="calendar-shell">
                  <div className="weekday-row">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} className="weekday">{d}</div>)}</div>
                  <div className="calendar-grid">
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`es-${i}`} className="empty-cell" />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const entries = getEntriesFromDay(calendarData[dateStr]);
                      const summary = getDaySummary(entries);
                      const isToday = today === dateStr;
                      return (
                        <div key={dateStr} className={`day-cell ${summary.scheduled ? "scheduled" : ""} ${summary.published ? "published" : ""}`} onClick={() => handleDateClick(dateStr)}>
                          <div className="day-top">
                            <div className={`day-number ${isToday ? "today" : ""} ${summary.scheduled ? "scheduled" : ""} ${summary.published ? "published" : ""}`}>{day}</div>
                            <div className="day-icons">
                              {summary.hasPost && <Image size={10} color="#7c3aed" />}
                              {summary.hasVideo && <Video size={10} color="#059669" />}
                              {summary.hasStory && <Smartphone size={10} color="#f59e0b" />}
                              {summary.total > 1 && <span className="count-badge">{summary.total}</span>}
                              {summary.scheduled && !summary.published && <span className="scheduled-check">排</span>}
                              {summary.published && <span className="published-check">✓</span>}
                            </div>
                          </div>
                          {entries.length ? (
                            <div className="day-items">
                              {entries.slice(0, 2).map((item, idx) => { const meta = getPlatformMeta(item.platform); const PIcon = meta ? meta.icon : null; return (<div key={item.id || idx} className={`day-title ${item.scheduled ? "scheduled" : ""} ${item.published ? "published" : ""}`}>{PIcon && <div className="platform-mini"><PIcon size={9} />{PLATFORM_LABEL_MAP[item.platform]}</div>}{item.title || "未命名內容"}</div>); })}
                              {entries.length > 2 && <div className="day-title">+{entries.length - 2} 項</div>}
                            </div>
                          ) : <div className="day-plus"><Plus size={14} /></div>}
                        </div>
                      );
                    })}
                    {Array.from({ length: trailingEmptyCells }).map((_, i) => <div key={`ee-${i}`} className="empty-cell" />)}
                  </div>
                </div>
                <div className="footer">
                  {sidebarCollapsed && <button className="mini-btn" type="button" onClick={() => setSidebarCollapsed(false)}><ChevronLeft size={13} />展開清單</button>}
                  <div className="legend">{[{ color: "#7c3aed", label: "📷 貼文" }, { color: "#10b981", label: "🎥 REELS" }, { color: "#f59e0b", label: "📱 限時動態" }, { color: "#2563eb", label: "排 已排程" }, { color: "#dc2626", label: "✓ 已發布" }].map(({ color, label }) => (<div key={label} className="legend-item"><span className="legend-dot" style={{ background: color }} />{label}</div>))}</div>
                  <div className="legend-note"><Layers size={13} />同一天可建立多筆排程</div>
                </div>
              </div>

              {!sidebarCollapsed && (
                <aside className="sidebar">
                  <div className="sidebar-tools">
                    <div><div className="sidebar-title"><ClipboardList size={16} />本月內容清單</div><div className="sidebar-subtitle">{currentYear} 年 {monthNames[currentMonth]} ｜共 {stats.total} 筆</div></div>
                    <div className="sidebar-tool-actions">
                      <button className="mini-btn" type="button" onClick={() => openBlankEntryForDate(today)}><Plus size={13} />新增</button>
                      <button className="mini-btn" type="button" onClick={() => setSidebarCollapsed(true)}><ChevronRight size={13} />收起</button>
                    </div>
                  </div>
                  {stats.total === 0 ? <div className="empty-state">這個月目前還沒有排程內容。<br />點月曆日期或「新增」按鈕開始。</div> : (
                    <div className="platform-grid">
                      {monthEntriesByPlatform.map(group => {
                        const PlatformIcon = group.icon;
                        return (
                          <div key={group.value} className="platform-section">
                            <div className="platform-head"><div className="platform-title"><PlatformIcon size={14} />{group.label}</div><div className="platform-count">{group.items.length}</div></div>
                            <div className="entry-list">
                              {group.items.length === 0 ? <div className="empty-state">尚無內容</div> : group.items.map(item => (
                                <div key={`${item.date}-${item.id}`} className={`entry-card ${item.scheduled ? "scheduled" : ""} ${item.published ? "published" : ""}`} onClick={() => handleDateClick(item.date, item.index)}>
                                  <div className="entry-top"><div className="entry-date">{item.date}</div><div className={`entry-status ${item.published ? "done" : item.scheduled ? "scheduled" : "wait"}`}>{item.published ? "已發布" : item.scheduled ? "已排程" : "待排程"}</div></div>
                                  <div className="entry-title">{item.title || "未命名內容"}</div>
                                  <div className="entry-meta">{item.hasPost && <div className="entry-chip"><Image size={10} />貼文</div>}{item.hasVideo && <div className="entry-chip"><Video size={10} />REELS</div>}{item.hasStory && <div className="entry-chip"><Smartphone size={10} />限動</div>}{item.collaborators && <div className="entry-chip"><Users size={10} />{item.collaborators}</div>}</div>
                                  {item.notes && <div className="entry-notes">{item.notes}</div>}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </aside>
              )}
            </div>
          )}

          {mainTab === "growth" && (
            <div className="growth-layout">
              <div className="growth-form-shell">
                <div className="growth-form-body">
                  <div className="section-title"><BarChart3 size={17} />登錄粉絲數</div>
                  <div className="section-subtitle">每月輸入當下的粉絲總數，系統自動與上月比較並計算成長幅度。</div>
                  <div className="info-box"><Info size={14} style={{ marginTop: 1, flexShrink: 0 }} /><span>請直接輸入<strong>目前各平台粉絲總數</strong>。系統會自動與上個月比較，算出成長幅度。<strong>2026年3月</strong>為基準月，不計算成長。</span></div>
                  <div className="two-cols" style={{ marginBottom: 11 }}>
                    <div className="field-group" style={{ marginBottom: 0 }}>
                      <label className="field-label">月份</label>
                      <div className="select-wrap" style={{ display: "block" }}>
                        <select className="select" style={{ width: "100%", borderRadius: 11, padding: "9px 34px 9px 12px", fontSize: 14 }} value={growthMonth} onChange={e => loadGrowthForm(e.target.value)}>
                          {(() => { const opts = []; for (let y = 2026; y <= MAX_YEAR; y++) for (let m = 0; m < 12; m++) { const key = `${y}-${String(m + 1).padStart(2, "0")}`; opts.push(<option key={key} value={key}>{y} 年 {monthNames[m]}</option>); } return opts; })()}
                        </select>
                        <ChevronDown size={14} className="select-arrow" />
                      </div>
                    </div>
                    <div className="field-group" style={{ marginBottom: 0 }}><label className="field-label">備註</label><input className="text-input" type="text" value={growthNotes} onChange={e => setGrowthNotes(e.target.value)} /></div>
                  </div>
                  <div className="three-cols">
                    <div className="field-group"><label className="field-label" style={{ display: "flex", alignItems: "center", gap: 4 }}><Instagram size={10} color="#e1306c" />Instagram 總粉絲數</label><input className="number-input" type="number" min="0" value={growthIG} onChange={e => setGrowthIG(e.target.value)} /></div>
                    <div className="field-group"><label className="field-label" style={{ display: "flex", alignItems: "center", gap: 4 }}><Music2 size={10} />TikTok 總粉絲數</label><input className="number-input" type="number" min="0" value={growthTT} onChange={e => setGrowthTT(e.target.value)} /></div>
                    <div className="field-group"><label className="field-label" style={{ display: "flex", alignItems: "center", gap: 4 }}><BookText size={10} color="#fe2c55" />小紅書 總粉絲數</label><input className="number-input" type="number" min="0" value={growthXH} onChange={e => setGrowthXH(e.target.value)} /></div>
                  </div>
                  <div className="growth-actions">
                    <button className="minor-btn" type="button" onClick={clearGrowthForm}><Trash2 size={14} />清空</button>
                    <button className="save-btn" type="button" onClick={saveGrowth}><Save size={16} />儲存</button>
                  </div>
                </div>
              </div>
              {growthRows.length > 0 && (
                <div className="growth-table-shell">
                  <table className="growth-table">
                    <thead><tr><th>月份</th><th><Instagram size={10} style={{ verticalAlign: "middle", marginRight: 3 }} />IG 總粉絲</th><th>IG 成長</th><th><Music2 size={10} style={{ verticalAlign: "middle", marginRight: 3 }} />TikTok 總粉絲</th><th>TikTok 成長</th><th><BookText size={10} style={{ verticalAlign: "middle", marginRight: 3 }} />小紅書總粉絲</th><th>小紅書成長</th><th>三平台總計</th><th>總成長</th><th>備註</th><th></th></tr></thead>
                    <tbody>
                      {growthRows.map(row => {
                        const isCurrent = row.key === currentMonthKey;
                        return (
                          <tr key={row.key} className={isCurrent ? "current-month" : row.isBase ? "base-row" : ""}>
                            <td><span className="month-label">{row.key}</span>{row.isBase && <span className="base-badge">基準</span>}{isCurrent && <span className="current-badge">本月</span>}</td>
                            <td className="num-cell">{formatNumber(row.igTotal)}</td><td><GrowthCell val={row.isBase ? null : row.igDelta} /></td>
                            <td className="num-cell">{formatNumber(row.ttTotal)}</td><td><GrowthCell val={row.isBase ? null : row.ttDelta} /></td>
                            <td className="num-cell">{formatNumber(row.xhTotal)}</td><td><GrowthCell val={row.isBase ? null : row.xhDelta} /></td>
                            <td className="num-cell" style={{ fontWeight: 900 }}>{formatNumber(row.totalFollowers)}</td>
                            <td><GrowthCell val={row.isBase ? null : row.totalDelta} /></td>
                            <td className="notes-cell">{row.notes}</td>
                            <td style={{ whiteSpace: "nowrap" }}><button className="edit-row-btn" onClick={() => loadGrowthForm(row.key)}>編輯</button><button className="del-row-btn" onClick={() => deleteGrowthMonth(row.key)} title="刪除此月"><X size={11} /></button></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {selectedDate && (
          <div className="overlay">
            <div className="modal">
              <div className="modal-head"><div className="modal-head-title">編輯排程</div><button className="close-btn" onClick={closeModal}><X size={16} /></button></div>
              <div className="modal-body">
                <div className="schedule-tabs">
                  {selectedDateEntries.map((entry, idx) => { const meta = getPlatformMeta(entry.platform); const PIcon = meta ? meta.icon : Calendar; const color = meta ? meta.color : "#64748b"; return (<button key={entry.id || idx} type="button" className={`schedule-tab ${editingIndex === idx ? "active" : ""}`} onClick={() => switchEditingItem(idx)} style={{ borderLeft: `3px solid ${color}`, ...(editingIndex === idx ? { background: `${color}15`, color: color } : {}) }}><PIcon size={12} style={{ color }} />{idx + 1}. {entry.title || "未命名"}</button>); })}
                  {selectedDateEntries.length < 3 && (
                    <button type="button" className="schedule-tab add" onClick={addNewScheduleItem}><Plus size={12} />新增同日排程</button>
                  )}
                </div>
                <div className="two-cols">
                  <div className="field-group"><label className="field-label">日期</label><input className="date-input" type="date" value={editDate} onChange={e => setEditDate(e.target.value)} /></div>
                  <div className="field-group"><label className="field-label">協作者</label><input className="text-input" type="text" value={editCollaborators} onChange={e => setEditCollaborators(e.target.value)} /></div>
                </div>
                <div className="field-group">
                  <label className="field-label">發布平台</label>
                  <div className="platform-btn-group">
                    {PLATFORM_OPTIONS.map(p => { const Icon = p.icon; return (<button key={p.value} type="button" className={`platform-btn ${editPlatform === p.value ? `active-${p.value}` : ""}`} onClick={() => setEditPlatform(editPlatform === p.value ? "" : p.value)}><Icon size={14} />{p.label}</button>); })}
                  </div>
                </div>
                <div className="field-group"><label className="field-label">主題名稱</label><input className="text-input" type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} /></div>
                <div className="field-group">
                  <label className="field-label">內容大綱 / 文案提示</label>
                  <textarea className="textarea" value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="描述影片內容、拍攝重點、主打賣點…生成文案時可直接帶入" />
                </div>
                <div className="field-group">
                  <label className="field-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>📸 IG 文案備存</span>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {editIgCopy && <span style={{ fontSize: 10, color: "#C13584", fontWeight: 700 }}>✓ 已有文案</span>}
                      {editIgCopy && <button type="button" onClick={() => navigator.clipboard.writeText(editIgCopy)} style={{ fontSize: 10, padding: "2px 8px", background: "#C13584", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>複製</button>}
                    </div>
                  </label>
                  <textarea className="textarea" value={editIgCopy} onChange={e => setEditIgCopy(e.target.value)} placeholder="把 IG 生成好的文案貼在這裡…" style={{ minHeight: 70, fontSize: 12 }} />
                </div>
                <div className="field-group">
                  <label className="field-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>🎵 抖音 文案備存</span>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {editTiktokCopy && <span style={{ fontSize: 10, color: "#111", fontWeight: 700 }}>✓ 已有文案</span>}
                      {editTiktokCopy && <button type="button" onClick={() => navigator.clipboard.writeText(editTiktokCopy)} style={{ fontSize: 10, padding: "2px 8px", background: "#111", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>複製</button>}
                    </div>
                  </label>
                  <textarea className="textarea" value={editTiktokCopy} onChange={e => setEditTiktokCopy(e.target.value)} placeholder="把抖音生成好的文案貼在這裡…" style={{ minHeight: 70, fontSize: 12 }} />
                </div>
                <div className="field-group">
                  <label className="field-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>📕 小紅書 文案備存</span>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {editXhsCopy && <span style={{ fontSize: 10, color: "#FE2C55", fontWeight: 700 }}>✓ 已有文案</span>}
                      {editXhsCopy && <button type="button" onClick={() => navigator.clipboard.writeText(editXhsCopy)} style={{ fontSize: 10, padding: "2px 8px", background: "#FE2C55", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>複製</button>}
                    </div>
                  </label>
                  <textarea className="textarea" value={editXhsCopy} onChange={e => setEditXhsCopy(e.target.value)} placeholder="把小紅書生成好的文案貼在這裡…" style={{ minHeight: 70, fontSize: 12 }} />
                </div>
                <div className="field-group">
                  <label className="field-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>📕 小紅書標題備存</span>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {editXhsTitle && <span style={{ fontSize: 10, color: "#FE2C55", fontWeight: 700 }}>✓ 已有標題</span>}
                      {editXhsTitle && <button type="button" onClick={() => navigator.clipboard.writeText(editXhsTitle)} style={{ fontSize: 10, padding: "2px 8px", background: "#FE2C55", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>複製</button>}
                    </div>
                  </label>
                  <input className="text-input" value={editXhsTitle} onChange={e => setEditXhsTitle(e.target.value)} placeholder="把小紅書生成的標題貼在這裡…" style={{ fontSize: 12 }} />
                </div>
                <div className="field-group">
                  <label className="field-label">貼文類型（可複選）</label>
                  <div className="post-type-group">
                    <button type="button" className={`post-type-btn ${editHasPost ? "active-post" : ""}`} onClick={() => setEditHasPost(v => !v)}><Image size={20} />貼文</button>
                    <button type="button" className={`post-type-btn ${editHasVideo ? "active-video" : ""}`} onClick={() => setEditHasVideo(v => !v)}><Video size={20} />REELS</button>
                    <button type="button" className={`post-type-btn ${editHasStory ? "active-story" : ""}`} onClick={() => setEditHasStory(v => !v)}><Smartphone size={20} />限時動態</button>
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">狀態</label>
                  <div className="status-group">
                    <button type="button" className={`status-btn ${editScheduled ? "active-scheduled" : ""}`} onClick={() => setEditScheduled(v => !v)}><Calendar size={15} />已排程</button>
                    <button type="button" className={`status-btn ${editPublished ? "active-published" : ""}`} onClick={() => setEditPublished(v => !v)}><CheckCircle2 size={15} />已發布</button>
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="danger-btn" onClick={deleteEntry} title="刪除此日全部排程" type="button"><Trash2 size={16} /></button>
                  <button className="minor-btn" onClick={removeCurrentEditingItemOnly} type="button"><X size={13} />刪除這一筆</button>
                  <button className="save-btn" onClick={saveEntry} type="button"><Save size={16} />儲存變更</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
