import { api, Auth, Orders, Admin, Drivers } from '../shared/api.js';
import { initGeo, getCurrentPosition } from '../shared/geo.js';

let appContent, sidebar, sidebarOverlay;
let socket, user, activeOrder, map, myMarker, geoWatchId, incomingTimer;
let currentViewFn = null, currentViewData = null;
let manualTheme = 'light';
let weatherEnabled = localStorage.getItem('movvi_weather') !== 'off';
let trafficEnabled = localStorage.getItem('movvi_traffic') !== 'off'; // Widget
let mapTrafficEnabled = localStorage.getItem('movvi_map_traffic') !== 'off'; // Google Layer
let newsEnabled = localStorage.getItem('movvi_news') !== 'off';
let weatherData = null;

const alertSoundUrl = 'https://www.myinstants.com/media/sounds/uber.mp3';
const callSoundUrl = 'https://actions.google.com/sounds/v1/communications/incoming_phone_call.ogg';

const alertAudio = new Audio(alertSoundUrl);
alertAudio.loop = true;
alertAudio.volume = 1.0;

const callAudio = new Audio(callSoundUrl);
callAudio.loop = true;
callAudio.volume = 1.0;

function unlockAudio() {
  const silent = () => {
    alertAudio.play().then(() => {
      alertAudio.pause();
      alertAudio.currentTime = 0;
      console.log('Audio unlocked');
    }).catch(e => console.log('Audio unlock failed', e));

    callAudio.play().then(() => {
      callAudio.pause();
      callAudio.currentTime = 0;
    }).catch(() => { });
  };
  silent();
}

const unlockAudioGlobal = () => {
  unlockAudio();
  // We can also try playing a short beep immediately on click to verify
  document.removeEventListener('click', unlockAudioGlobal);
  document.removeEventListener('touchstart', unlockAudioGlobal);
};
document.addEventListener('click', unlockAudioGlobal, { once: true });
document.addEventListener('touchstart', unlockAudioGlobal, { once: true });

// Fallback: many mobile browsers require a play() call directly inside the click handler context
// so we'll try to play it briefly whenever they click a button too

function getTrafficEstimate() {
  const h = new Date().getHours();
  const day = new Date().getDay(); // 0=Sun
  const isWeekend = day === 0 || day === 6;
  let level, label, tip;
  if (isWeekend) {
    if (h >= 10 && h <= 14) { level = 'moderado'; label = 'Trânsito Moderado'; tip = 'Saídas para lazer podem causar lentidão'; }
    else if (h >= 17 && h <= 20) { level = 'moderado'; label = 'Trânsito Moderado'; tip = 'Retorno do fim de semana'; }
    else { level = 'livre'; label = 'Trânsito Livre'; tip = 'Vias com bom fluxo'; }
  } else {
    if (h >= 7 && h <= 9) { level = 'intenso'; label = 'Trânsito Intenso'; tip = 'Horário de pico matutino'; }
    else if (h >= 11 && h <= 13) { level = 'moderado'; label = 'Trânsito Moderado'; tip = 'Horário de almoço'; }
    else if (h >= 17 && h <= 19) { level = 'intenso'; label = 'Trânsito Intenso'; tip = 'Horário de pico vespertino'; }
    else if (h >= 20 && h <= 22) { level = 'moderado'; label = 'Trânsito Moderado'; tip = 'Fluxo moderado noturno'; }
    else { level = 'livre'; label = 'Trânsito Livre'; tip = 'Vias com bom fluxo'; }
  }
  const colors = { livre: '#22c55e', moderado: '#eab308', intenso: '#ef4444' };
  return { level, label, tip, color: colors[level] };
}

function saveUser(u) { user = u; localStorage.setItem('movvi_driver', JSON.stringify(u)); }
function loadUser() { try { return JSON.parse(localStorage.getItem('movvi_driver')); } catch { return null; } }
function nav(fn, data) {
  closeSidebar();
  currentViewFn = fn;
  currentViewData = data;
  appContent.innerHTML = '';
  const el = fn(data);
  appContent.appendChild(el);
  el.classList.add('fade-in');
}
function isDark() { return document.documentElement.classList.contains('dark'); }
function tileUrl() {
  const layer = mapTrafficEnabled ? 'm,traffic' : 'm';
  return `https://mt{s}.google.com/vt/lyrs=${layer}&x={x}&y={y}&z={z}`;
}

function setTheme(mode) {
  manualTheme = 'light';
  document.documentElement.classList.remove('dark');
  localStorage.setItem('movvi_theme', 'light');
  if (sidebar) buildSidebar(); // refresh toggle state if needed
}

function refreshMapLayers() {
  const url = tileUrl();
  if (map) {
    map.eachLayer(l => { if (l instanceof L.TileLayer) l.setUrl(url); });
  }
}

// Force light theme immediately on load
setTheme('light');

const weatherCodes = { 0: 'Céu limpo', 1: 'Parcialmente limpo', 2: 'Parcialmente nublado', 3: 'Nublado', 45: 'Nevoeiro', 48: 'Nevoeiro gelado', 51: 'Garoa leve', 53: 'Garoa moderada', 55: 'Garoa densa', 61: 'Chuva leve', 63: 'Chuva moderada', 65: 'Chuva forte', 71: 'Neve leve', 73: 'Neve moderada', 75: 'Neve intensa', 80: 'Pancadas leves', 81: 'Pancadas moderadas', 82: 'Pancadas fortes', 95: 'Trovoada', 96: 'Trovoada com granizo leve', 99: 'Trovoada com granizo forte' };

async function fetchWeather(lat, lon) {
  try {
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,weathercode&forecast_days=1&timezone=America%2FSao_Paulo`);
    const d = await r.json();
    return d;
  } catch { return null; }
}

// ═══ SIDEBAR ═══
function buildSidebar() {
  let nm = user?.name?.split(' ')[0] || 'Motorista';
  nm = nm.replace(/\uFFFD/g, 'ã').replace(/Joo/i, 'João').replace(/Jo.?o/i, 'João').replace(/Cambao/i, 'Cambão');
  sidebar.innerHTML = `
    <div class="px-5 pt-12 pb-6 flex items-center justify-between border-b border-slate-200 dark:border-white/10">
      <div class="flex items-center gap-3">
        <div class="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30 overflow-hidden">
          ${user?.photo ? `<img src="${user.photo}" class="w-full h-full object-cover">` : `<span class="material-symbols-outlined text-lg">person</span>`}
        </div>
        <div>
          <h2 class="text-sm font-bold text-black font-bold dark:text-white">${nm}</h2>
          <div class="flex items-center gap-2">
            <p class="text-[10px] ${(user.walletBalance || 0) < 0 ? 'text-red-500' : 'text-slate-500'} font-black uppercase tracking-tighter">Saldo: R$ ${(user.walletBalance || 0).toFixed(2).replace('.', ',')}</p>
            ${user.blocked ? '<span class="size-1.5 rounded-full bg-red-500 animate-pulse"></span>' : ''}
          </div>
        </div>
      </div>
      <button class="sidebar-close size-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-primary"><span class="material-symbols-outlined text-base">close</span></button>
    </div>
    <nav class="flex-1 overflow-y-auto pt-4 px-3">
      <a data-nav="dash" class="flex items-center gap-3 px-3 py-3 rounded-lg text-black font-bold dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary cursor-pointer transition-colors"><span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">home</span><span class="text-sm font-semibold">Início</span></a>
      <a data-nav="history" class="flex items-center gap-3 px-3 py-3 rounded-lg text-black font-bold dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary cursor-pointer transition-colors"><span class="material-symbols-outlined">history</span><span class="text-sm font-semibold">Histórico</span></a>
      <a data-nav="earn" class="flex items-center gap-3 px-3 py-3 rounded-lg text-black font-bold dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary cursor-pointer transition-colors"><span class="material-symbols-outlined">account_balance_wallet</span><span class="text-sm font-semibold">Carteira</span></a>
      <a data-nav="profile" class="flex items-center gap-3 px-3 py-3 rounded-lg text-black font-bold dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary cursor-pointer transition-colors"><span class="material-symbols-outlined">person</span><span class="text-sm font-semibold">Perfil</span></a>
      <a data-nav="support" class="flex items-center gap-3 px-3 py-3 rounded-lg text-black font-bold dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary cursor-pointer transition-colors"><span class="material-symbols-outlined">support_agent</span><span class="text-sm font-semibold">Suporte</span></a>
      <!-- Aparência section removed to force light mode -->
      <div class="mt-3 mx-1 pt-3 border-t border-slate-200 dark:border-white/10">
        <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3 px-2">Preferências</p>
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2 text-black font-bold dark:text-slate-300"><span class="material-symbols-outlined text-base">thermostat</span><span class="text-xs font-semibold">Condições Climáticas</span></div>
          <button id="weather-toggle" class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${weatherEnabled ? 'bg-primary' : 'bg-slate-400 dark:bg-slate-600'}">
            <span class="${weatherEnabled ? 'translate-x-4' : 'translate-x-0'} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200"></span>
          </button>
        </div>
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2 text-black font-bold dark:text-slate-300"><span class="material-symbols-outlined text-base">traffic</span><span class="text-xs font-semibold">Widget Info Trânsito</span></div>
          <button id="traffic-toggle" class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${trafficEnabled ? 'bg-primary' : 'bg-slate-400 dark:bg-slate-600'}">
            <span class="${trafficEnabled ? 'translate-x-4' : 'translate-x-0'} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200"></span>
          </button>
        </div>
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2 text-black font-bold dark:text-slate-300"><span class="material-symbols-outlined text-base">layers</span><span class="text-xs font-semibold">Camada Trânsito (Mapa)</span></div>
          <button id="map-traffic-toggle" class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${mapTrafficEnabled ? 'bg-primary' : 'bg-slate-400 dark:bg-slate-600'}">
            <span class="${mapTrafficEnabled ? 'translate-x-4' : 'translate-x-0'} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200"></span>
          </button>
        </div>
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2 text-black font-bold dark:text-slate-300"><span class="material-symbols-outlined text-base">newspaper</span><span class="text-xs font-semibold">Notícias da Cidade</span></div>
          <button id="news-toggle" class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${newsEnabled ? 'bg-primary' : 'bg-slate-400 dark:bg-slate-600'}">
            <span class="${newsEnabled ? 'translate-x-4' : 'translate-x-0'} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200"></span>
          </button>
        </div>
        <div class="flex items-center justify-between px-2 py-2 border-t border-slate-200 dark:border-white/10 mt-2 pt-2">
          <div class="flex items-center gap-2 text-primary font-bold"><span class="material-symbols-outlined text-base">volume_up</span><span class="text-[10px] uppercase font-black tracking-widest">Teste de Alerta</span></div>
          <button id="btn-sound-test" class="bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all">Testar</button>
        </div>
      </div>
    </nav>
    <div class="px-5 pb-8 pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col gap-4">
      <a data-nav="profile" class="flex items-center gap-3 text-slate-600 dark:text-slate-400 cursor-pointer font-bold text-sm"><span class="material-symbols-outlined text-base">person</span>Perfil</a>
      <a data-nav="logout" class="flex items-center gap-3 text-red-500 hover:text-red-400 cursor-pointer font-bold text-sm"><span class="material-symbols-outlined text-base">logout</span>Sair</a>
    </div>`;
  sidebar.querySelectorAll('[data-nav]').forEach(a => {
    a.onclick = () => {
      unlockAudio();
      const t = a.dataset.nav;
      if (t === 'dash') nav(dashboardView);
      else if (t === 'earn') nav(earningsView);
      else if (t === 'history') nav(historyView);
      else if (t === 'profile') nav(profileView);
      else if (t === 'support') nav(supportChatView);
      else if (t === 'logout') { socket?.emit('driver:offline', user.id); socket?.disconnect(); localStorage.removeItem('movvi_driver'); nav(loginView); }
    };
  });
  sidebar.querySelector('.sidebar-close').onclick = closeSidebar;
  const wt = sidebar.querySelector('#weather-toggle');
  if (wt) wt.onclick = () => { weatherEnabled = !weatherEnabled; localStorage.setItem('movvi_weather', weatherEnabled ? 'on' : 'off'); buildSidebar(); };
  const tt = sidebar.querySelector('#traffic-toggle');
  if (tt) tt.onclick = () => { trafficEnabled = !trafficEnabled; localStorage.setItem('movvi_traffic', trafficEnabled ? 'on' : 'off'); buildSidebar(); };
  const mtt = sidebar.querySelector('#map-traffic-toggle');
  if (mtt) mtt.onclick = () => {
    mapTrafficEnabled = !mapTrafficEnabled;
    localStorage.setItem('movvi_map_traffic', mapTrafficEnabled ? 'on' : 'off');
    buildSidebar();
    refreshMapLayers();
  };
  const nt = sidebar.querySelector('#news-toggle');
  if (nt) nt.onclick = () => { newsEnabled = !newsEnabled; localStorage.setItem('movvi_news', newsEnabled ? 'on' : 'off'); buildSidebar(); };
  const st = sidebar.querySelector('#btn-sound-test');
  if (st) {
    st.onclick = () => {
      alertAudio.currentTime = 0;
      alertAudio.play().then(() => {
        setTimeout(() => { alertAudio.pause(); alertAudio.currentTime = 0; }, 2000);
      }).catch(() => alert('Áudio bloqueado! Clique em qualquer lugar e tente novamente.'));
    };
  }
}

function showDebtModal() {
  const overlay = document.createElement('div');
  overlay.id = 'debt-modal-overlay';
  overlay.className = 'fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in';
  overlay.innerHTML = `
    <div class="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-white/10 animate-scale-up">
      <div class="flex flex-col items-center text-center">
        <div class="size-20 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-6 shadow-inner">
          <span class="material-symbols-outlined text-4xl">account_balance_wallet</span>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-2 italic">SALDO BLOQUEADO</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
          Sua conta atingiu o limite de d\u00e9bito operacional de <span class="text-red-500 font-bold">R$ -50,00</span>.
          <br><br>
          Regularize seu saldo para voltar a ficar online e receber novos chamados de reboque.
        </p>
        
        <div class="flex flex-col gap-3 w-full">
          <button id="modal-request-release" class="w-full bg-[#FFD900] text-[#1a1400] font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-sm uppercase tracking-widest mb-1">
            Pedir Liberação do Sistema
          </button>
          <button id="modal-check" class="w-full bg-signal-green text-black font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-sm uppercase tracking-widest mb-1">
            Verificar Novamente
          </button>
          <button id="modal-pay" class="w-full bg-slate-900 text-white font-black py-3 rounded-2xl shadow-md active:scale-95 transition-all text-xs uppercase tracking-widest border border-white/5">
            Manual de Pagamento
          </button>
          <button id="modal-close" class="w-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-bold py-3 rounded-2xl text-xs uppercase tracking-widest text-center">
            Fechar
          </button>
        </div>
      </div>
    </div>
    <style>
      @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
      @keyframes scale-up { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      .animate-scale-up { animation: scale-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      .bg-signal-green { background-color: #22c55e; }
    </style>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector('#modal-request-release').onclick = () => {
    socket.emit('chat:driver-to-admin', { driverId: user.id, message: "⚠️ *SOLICITAÇÃO DE LIBERAÇÃO*\n\nPor favor, peço a liberação do meu acesso na ferramenta após pagamento do débito pendente." });
    const btn = overlay.querySelector('#modal-request-release');
    btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">check_circle</span> Solicitação Enviada';
    btn.classList.add('opacity-70', 'pointer-events-none');
  };

  overlay.querySelector('#modal-check').onclick = async () => {
    const btn = overlay.querySelector('#modal-check');
    btn.innerHTML = '<div class="size-5 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>';
    try {
      const fresh = await Drivers.get(user.id);
      user.blocked = fresh.blocked;
      user.walletBalance = fresh.walletBalance;
      saveUser(user);
      if (!user.blocked && user.walletBalance > -50) {
        overlay.remove();
        nav(dashboardView);
      } else {
        btn.innerHTML = 'Ainda Bloqueado';
        setTimeout(() => btn.innerHTML = 'Verificar Novamente', 2000);
      }
    } catch (e) {
      btn.innerHTML = 'Erro ao Sincronizar';
      setTimeout(() => btn.innerHTML = 'Verificar Novamente', 2000);
    }
  };

  overlay.querySelector('#modal-pay').onclick = () => {
    overlay.remove();
    nav(earningsView);
  };
  overlay.querySelector('#modal-close').onclick = () => {
    overlay.remove();
  };
}

function openSidebar() { sidebar.classList.add('open'); sidebarOverlay.classList.add('open'); }
function closeSidebar() { sidebar.classList.remove('open'); sidebarOverlay.classList.remove('open'); }

function connectSocket() {
  if (socket) return; // evita duplicados se reconectar via loop

  socket = io();
  socket.on('connect', () => {
    if (!user) return;
    socket.emit('register:driver', user.id);
    if (user.online) {
      socket.emit('driver:online', user.id);
      checkActiveOrder();
    }
  });

  socket.on('driver:online:error', (data) => {
    if (data.error === 'DEBT_BLOCK') {
      user.online = false;
      user.blocked = true;
      saveUser(user);
      showDebtModal();
      nav(dashboardView);
    }
  });

  socket.on('driver:data-updated', (data) => {
    console.log('[Socket] Driver data updated from server:', data);
    user.blocked = data.blocked;
    user.walletBalance = data.walletBalance;
    saveUser(user);

    // Close modal if unblocked
    const modal = document.getElementById('debt-modal-overlay');
    if (!user.blocked && (user.walletBalance || 0) > -50 && modal) {
      modal.remove();
      // If unblocked and on dashboard, we might want to refresh once
      if (currentViewFn === dashboardView) nav(dashboardView);
    }
  });

  // Força atualização a cada 10 segundos caso a conexão caia temporariamente
  setInterval(() => {
    if (socket && socket.connected && user && user.online) {
      socket.emit('driver:online', user.id);
      getCurrentPosition().then(p => {
        socket.emit('driver:location', { driverId: user.id, latitude: p.latitude, longitude: p.longitude });
      }).catch(() => { });
    }
  }, 10000);

  socket.on('order:incoming', (d) => {
    if (activeOrder) return; // Não recebe se já tiver um (proteção extra)
    nav(incomingView, d);
  });
  socket.on('order:timeout', () => {
    clearInterval(incomingTimer);
    alertAudio.pause();
    alertAudio.currentTime = 0;
    if (!activeOrder) nav(dashboardView);
  });
  socket.on('order:status', ({ orderId, status }) => {
    if (status === 'cancelled') {
      alertAudio.pause();
      alertAudio.currentTime = 0;
      clearInterval(incomingTimer);
      activeOrder = null;
      nav(dashboardView);
    } else if (activeOrder && (activeOrder.orderId === orderId || activeOrder.id === orderId)) {
      activeOrder.status = status;
      if (status === 'completed') nav(rateView, activeOrder);
    }
  });
  socket.on('order-chat:new-message', (msg) => {
    const btnChat = document.getElementById('btn-chat');
    if (btnChat && !document.getElementById('chat-msgs')) {
      if (!document.getElementById('chat-dot')) {
        btnChat.style.position = 'relative';
        btnChat.innerHTML += '<div id="chat-dot" class="absolute -top-1 -right-1 size-3.5 bg-red-500 rounded-full border-2 border-white dark:border-background-dark animate-pulse"></div>';
      }
    }
  });

  geoWatchId = initGeo(({ latitude, longitude }) => {
    if (user.online) {
      socket.emit('driver:location', { driverId: user.id, latitude, longitude });
    }
    if (myMarker) myMarker.setLatLng([latitude, longitude]);
    if (map) map.panTo([latitude, longitude]);
  });
}

// Verifica se há pedido ativo ao entrar/reconectar
async function checkActiveOrder() {
  try {
    const list = await Orders.list({ driverId: user.id, status: 'accepted,pickup,in_progress' });
    if (list && list.length > 0) {
      const o = list[0];
      activeOrder = {
        orderId: o.id,
        ...o
      };
      nav(activeJobView, activeOrder);
    } else {
      // Se n tiver pedido ativo, deve reconstruir e atualizar o dashboard para forçar refresh do mapa e estado.
      nav(dashboardView);
    }
  } catch (e) { console.error('Erro checkActiveOrder:', e); }
}

// ═══ LOGIN ═══
function loginView() {
  const d = document.createElement('div'); d.className = 'view active';
  d.style.background = '#FFD900';
  d.innerHTML = `
<div class="flex flex-col relative overflow-hidden" style="min-height:100dvh;font-family:Outfit,Inter,sans-serif">
  <!-- Yellow brand hero top -->
  <div class="bg-[#FFD900] relative overflow-hidden px-6 pt-14 pb-12 flex flex-col items-center text-center" style="animation:fadeUpIn 0.5s ease-out forwards">
    <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(135deg,rgba(0,0,0,0.03) 0%,transparent 50%,rgba(255,255,255,0.06) 100%)"></div>
    <img src="/assets/images/logo_movvi.png" alt="Movvi Resgate" class="w-64 h-auto object-contain relative z-10 mb-2 drop-shadow-lg">
    <p class="text-[#1a1400]/50 text-[13px] font-semibold mt-1 relative z-10">Motorista Parceiro</p>
  </div>

  <!-- Form section -->
  <div class="flex-1 bg-[#fafaf7] dark:bg-[#1a1706] rounded-t-[32px] -mt-6 relative z-10 px-6 pt-10 pb-8 flex flex-col" style="animation:fadeUpIn 0.5s ease-out 0.1s forwards;opacity:0">
    <form id="lf" class="flex flex-col gap-5 w-full max-w-sm mx-auto flex-1">
      <div class="flex flex-col gap-1.5">
        <label class="text-[#1a1400] dark:text-white/70 text-[12px] font-bold uppercase tracking-[0.08em] pl-1">Email</label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-[#1a1400]/30 dark:text-white/25"><span class="material-symbols-outlined text-[18px]">mail</span></span>
          <input class="form-input w-full bg-white dark:bg-white/[0.06] border-2 border-[#e8e4d9] dark:border-white/10 text-[#1a1400] dark:text-white placeholder-[#1a1400]/25 dark:placeholder-white/20 pl-11 py-3.5 text-[15px] font-semibold rounded-2xl focus:border-primary focus:ring-0 outline-none transition-all" id="le" type="email" placeholder="motorista@movvi.com" value="motorista@movvi.com"/>
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <div class="flex justify-between items-center">
          <label class="text-[#1a1400] dark:text-white/70 text-[12px] font-bold uppercase tracking-[0.08em] pl-1">Senha</label>
          <a id="forgot-pw" class="text-[12px] text-primary font-bold cursor-pointer hover:text-[#1a1400] dark:hover:text-white transition-colors pr-1">Esqueceu?</a>
        </div>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-[#1a1400]/30 dark:text-white/25"><span class="material-symbols-outlined text-[18px]">lock</span></span>
          <input class="form-input w-full bg-white dark:bg-white/[0.06] border-2 border-[#e8e4d9] dark:border-white/10 text-[#1a1400] dark:text-white placeholder-[#1a1400]/25 dark:placeholder-white/20 pl-11 py-3.5 text-[15px] font-semibold rounded-2xl focus:border-primary focus:ring-0 outline-none transition-all" id="lp" type="password" placeholder="••••••" value="123456"/>
        </div>
      </div>
      <div id="le-err" class="text-red-500 text-xs font-bold hidden"></div>
      <button type="submit" class="w-full bg-[#1a1400] dark:bg-primary text-white dark:text-[#1a1400] font-black py-4 text-[14px] uppercase tracking-[0.08em] rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2">
        <span>Entrar</span>
        <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
      </button>
    </form>

    <div class="text-center mt-8" style="animation:fadeUpIn 0.5s ease-out 0.25s forwards;opacity:0">
      <p class="text-[#1a1400]/40 dark:text-white/30 text-[14px] font-semibold">Não tem conta? <a id="go-reg" class="text-primary font-bold cursor-pointer hover:text-[#1a1400] dark:hover:text-white transition-colors">Registrar</a></p>
    </div>
  </div>
</div>
<style>
  @keyframes fadeUpIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
</style>`;


  d.querySelector('#lf').onsubmit = async (e) => {
    e.preventDefault();
    unlockAudio();
    try { const { user: u } = await Auth.loginDriver(d.querySelector('#le').value, d.querySelector('#lp').value); saveUser(u); connectSocket(); buildSidebar(); (!u.approved && u.onboardingStep !== 'approved') ? nav(onboardingView) : nav(dashboardView); }
    catch (err) { const el = d.querySelector('#le-err'); el.textContent = err.message; el.classList.remove('hidden'); }
  };
  d.querySelector('#go-reg').onclick = () => nav(registerView);
  d.querySelector('#forgot-pw').onclick = async () => {
    const email = window.prompt("Para redefinir sua senha, informe seu email:");
    if (email) {
      try {
        await Auth.forgotPasswordDriver(email);
        window.alert(`Um link de recuperação de senha foi enviado para ${email}. Verifique sua caixa de entrada.`);
      } catch (e) {
        window.alert(e.message || "Erro ao tentar redefinir senha.");
      }
    }
  };
  return d;
}

// ═══ REGISTER ═══
function registerView() {
  const d = document.createElement('div'); d.className = 'view active bg-background-light dark:bg-background-dark';
  d.innerHTML = `
<header class="flex items-center p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10">
  <button id="bk" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center"><span class="material-symbols-outlined text-black font-bold dark:text-slate-200">arrow_back</span></button>
  <h1 class="flex-1 text-center text-black font-bold dark:text-white text-base font-bold">Cadastro Motorista</h1><div class="size-10"></div>
</header>
<main class="flex-1 p-5 pb-24">
  <form id="rf" class="flex flex-col gap-4 bg-white dark:bg-white/5 p-6 rounded-xl border border-slate-200 dark:border-white/10">
    <div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">Nome Completo</label><input id="rn" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3" required/></div>
    <div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">E-mail</label><input id="re" type="email" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3" required/></div>
    <div class="grid grid-cols-2 gap-3">
      <div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">Telefone</label><input id="rph" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3"/></div>
      <div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">Chave PIX</label><input id="rpix" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3"/></div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">Veículo</label><input id="rv" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3"/></div>
      <div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">Placa</label><input id="rpl" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3"/></div>
    </div>
    <div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">Senha</label><input id="rp" type="password" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3" required/></div>
    <div id="re-err" class="text-red-500 text-xs font-medium hidden"></div>
    <button type="submit" class="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3.5 rounded-lg shadow-md mt-2 active:scale-[0.98]">Registrar</button>
  </form>
</main>`;
  d.querySelector('#bk').onclick = () => nav(loginView);
  d.querySelector('#rf').onsubmit = async (e) => {
    e.preventDefault();
    try { const { user: u } = await Auth.registerDriver({ name: d.querySelector('#rn').value, email: d.querySelector('#re').value, phone: d.querySelector('#rph').value, pixKey: d.querySelector('#rpix').value, vehicle: d.querySelector('#rv').value, plate: d.querySelector('#rpl').value, password: d.querySelector('#rp').value }); saveUser(u); connectSocket(); buildSidebar(); (!u.approved && u.onboardingStep !== 'approved') ? nav(onboardingView) : nav(dashboardView); }
    catch (err) { const el = d.querySelector('#re-err'); el.textContent = err.message; el.classList.remove('hidden'); }
  };
  return d;
}

// ═══ ONBOARDING ═══
function onboardingView() {
  const d = document.createElement('div'); d.className = 'view active bg-background-light dark:bg-background-dark';
  const step = user.onboardingStep || 'documents';

  const renderDocuments = () => `
    <h2 class="text-xl font-bold mb-4 text-[#1a1400] dark:text-white">Envio de Documentos</h2>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">Precisamos validar suas informações. Envie fotos nítidas dos seus documentos.</p>
    <form id="docs-form" class="flex flex-col gap-5">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-[#1a1400] dark:text-white">Foto da CNH</label>
        <input type="file" id="fi-cnh" accept="image/*" required class="w-full form-input bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-sm text-[#1a1400] dark:text-white">
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-[#1a1400] dark:text-white">Documento do Veículo (CRLV)</label>
        <input type="file" id="fi-crlv" accept="image/*" required class="w-full form-input bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl p-3 text-sm text-[#1a1400] dark:text-white">
      </div>
      <button type="submit" class="w-full bg-primary hover:bg-primary/90 text-[#1a1400] font-black py-4 mt-4 rounded-xl shadow-md active:scale-[0.98] transition-all uppercase tracking-wider text-sm">Próximo</button>
    </form>
  `;

  const renderKit = () => `
    <h2 class="text-xl font-bold mb-3 text-[#1a1400] dark:text-white">Kit Resgate</h2>
    <p class="text-sm text-[#1a1400]/60 dark:text-slate-400 font-medium mb-5">Para atuar, você precisa adquirir o kit obrigatório para realizar os serviços de assistência.</p>
    <div class="bg-[#FFD900]/10 border-2 border-[#FFD900] p-5 rounded-2xl mb-8">
       <h3 class="font-bold text-[#1a1400] dark:text-white mb-3">Itens Inclusos no Kit:</h3>
       <ul class="flex flex-col gap-2 mb-6">
         <li class="flex items-center gap-2 text-sm text-[#1a1400] dark:text-slate-200 font-semibold"><span class="material-symbols-outlined text-[#FFD900] text-[20px]">check_circle</span> 1 Cambão barra rígida</li>
         <li class="flex items-center gap-2 text-sm text-[#1a1400] dark:text-slate-200 font-semibold"><span class="material-symbols-outlined text-[#FFD900] text-[20px]">check_circle</span> 1 Cabo de Chupeta Bateria Carro</li>
         <li class="flex items-center gap-2 text-sm text-[#1a1400] dark:text-slate-200 font-semibold"><span class="material-symbols-outlined text-[#FFD900] text-[20px]">check_circle</span> 1 Bombona de Combustível</li>
         <li class="flex items-center gap-2 text-sm text-[#1a1400] dark:text-slate-200 font-semibold"><span class="material-symbols-outlined text-[#FFD900] text-[20px]">check_circle</span> 1 Kit Reparador de Pneu</li>
       </ul>
       <div class="flex flex-col items-center justify-center p-4 bg-white dark:bg-[#1a1400] rounded-xl shadow-sm">
         <span class="text-xs uppercase font-bold text-[#1a1400]/40 dark:text-white/40 mb-1">Valor do Kit</span>
         <span class="text-3xl font-black text-[#1a1400] dark:text-white">R$ 399,00</span>
       </div>
    </div>
    <button id="btn-pay" class="w-full bg-[#1a1400] dark:bg-white text-white dark:text-[#1a1400] font-black py-4 flex flex-col items-center justify-center rounded-xl shadow-lg active:scale-[0.98] transition-all">
      <span class="uppercase tracking-wider text-sm mb-1">Adquirir via PIX</span>
      <span class="text-[10px] opacity-70 font-medium">Após o pagamento, você será notificado para entrega do kit.</span>
    </button>
    
    <!-- Modal do PIX -->
    <div id="pix-modal" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 transition-all duration-300">
      <div id="pix-modal-content" class="bg-white dark:bg-[#1a1706] w-full max-w-sm rounded-[32px] p-8 flex flex-col items-center text-center scale-95 transition-transform duration-300">
        <h3 class="font-black text-xl text-[#1a1400] dark:text-white mb-2">Pagamento via PIX</h3>
        <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 w-full max-w-[240px]">Escaneie o QR Code abaixo ou copie e cole a chave PIX no seu app do banco.</p>
        <div class="bg-slate-100 dark:bg-white/5 p-4 rounded-2xl mb-6 flex justify-center w-full">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126460014BR.GOV.BCB.PIX011112345678900209Kit%20Movvi5204000053039865406399.005802BR5913Movvi%20Resgate6009Sao%20Paulo62070503***6304" alt="QR Code PIX" class="w-48 h-48 mix-blend-multiply dark:mix-blend-normal rounded-xl">
        </div>
        <button id="btn-copy-pix" class="w-full bg-[#FFD900] text-[#1a1400] font-bold py-3.5 rounded-xl mb-4 border border-transparent active:scale-95 transition-all text-sm uppercase tracking-wider">Copiar Chave PIX</button>
        <button id="btn-cancel-pix" class="w-full text-red-500 font-bold py-3 text-sm">Cancelar Pagamento</button>
      </div>
    </div>
  `;

  const renderPending = () => `
    <div class="flex flex-col items-center justify-center text-center py-12 px-2">
      <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-6">
        <span class="material-symbols-outlined text-[40px]">check</span>
      </div>
      <h2 class="text-2xl font-black text-[#1a1400] dark:text-white mb-3">Tudo Certo!</h2>
      <p class="text-[15px] font-medium text-[#1a1400]/60 dark:text-slate-400 mb-8 leading-relaxed">O pagamento do seu Kit Resgate foi confirmado. <strong class="text-[#1a1400] dark:text-white">Você será notificado(a) em breve a respeito da entrega do seu Kit.</strong> O perfil ficará online em até <strong class="text-[#1a1400] dark:text-white">12 horas</strong> após o recebimento dos materiais confirmados.</p>
      <button id="btn-refresh" class="w-full bg-[#fafaf7] dark:bg-[#201d10] border-2 border-slate-200 dark:border-white/10 text-[#1a1400] dark:text-white font-bold py-4 rounded-xl active:scale-[0.98] transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2"><span class="material-symbols-outlined text-[18px]">refresh</span> Atualizar Status</button>
      <button id="btn-request-release" class="w-full bg-[#FFD900] text-[#1a1400] shadow-md font-black py-4 mt-3 rounded-xl active:scale-[0.98] transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2"><span class="material-symbols-outlined text-[18px]">gavel</span> Pedir Liberação do Sistema</button>
      <button id="btn-logout" class="mt-6 text-sm font-bold text-red-500">Sair ou Entrar com outra conta</button>
    </div>
  `;

  d.innerHTML = `
    <header class="flex items-center justify-center p-5 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-white/80 dark:bg-[#1a1706]/80 backdrop-blur-md z-10 w-full">
      <img src="/assets/images/logo_movvi.png" alt="Movvi Resgate" class="h-6 object-contain drop-shadow-sm">
    </header>
    <main class="w-full max-w-md mx-auto p-6 pb-24 flex flex-col items-stretch" id="ob-container">
      ${step === 'documents' ? renderDocuments() : step === 'kit' ? renderKit() : renderPending()}
    </main>
  `;

  setTimeout(() => {
    if (step === 'documents') {
      d.querySelector('#docs-form').onsubmit = async (e) => {
        e.preventDefault();
        try {
          await Drivers.update(user.id, { onboardingStep: 'kit', cnhStatus: 'submitted', crlvStatus: 'submitted' });
          user.onboardingStep = 'kit';
          saveUser(user);
          nav(onboardingView);
        } catch (err) { alert(err.message); }
      };
    } else if (step === 'kit') {
      d.querySelector('#btn-pay').onclick = () => {
        const modal = d.querySelector('#pix-modal');
        modal.classList.remove('hidden');
        setTimeout(() => modal.querySelector('#pix-modal-content').classList.replace('scale-95', 'scale-100'), 10);
      };
      d.querySelector('#btn-cancel-pix').onclick = () => d.querySelector('#pix-modal').classList.add('hidden');
      d.querySelector('#btn-copy-pix').onclick = () => {
        const btn = d.querySelector('#btn-copy-pix');
        btn.textContent = "Chave PIX Copiada!";
        btn.classList.add('opacity-50');

        // Simular a confirmação que chega via webhook bancário
        setTimeout(() => {
          d.querySelector('#pix-modal-content').innerHTML = `
             <div class="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 mx-auto"><span class="material-symbols-outlined text-[40px]">check_circle</span></div>
             <h3 class="font-black text-2xl text-[#1a1400] dark:text-white mb-2">Pagamento Confirmado!</h3>
             <p class="text-[15px] font-medium text-slate-500 dark:text-slate-400 mb-2">Avisaremos você sobre a entrega do Kit Resgate. Redirecionando...</p>
           `;

          setTimeout(async () => {
            try {
              await Drivers.update(user.id, { onboardingStep: 'pending_approval', kitAcquired: true });
              user.onboardingStep = 'pending_approval';
              user.kitAcquired = true;
              saveUser(user);
              nav(onboardingView);
            } catch (err) { alert(err.message); }
          }, 3500);
        }, 3000);
      };
    } else {
      d.querySelector('#btn-refresh').onclick = async () => {
        try {
          const freshUser = await Drivers.get(user.id);
          saveUser(freshUser);
          if (freshUser.approved) nav(dashboardView);
          else { alert("Sua conta ainda está em análise. Fique de olho, em breve você estará online!"); nav(onboardingView); }
        } catch (err) { }
      };
      d.querySelector('#btn-request-release').onclick = () => {
        socket.emit('chat:driver-to-admin', { driverId: user.id, message: "⚠️ *NOVO CANDIDATO - SOLICITAÇÃO DE LIBERAÇÃO*\n\nJá paguei pelo Kit Resgate e estou aguardando a liberação na plataforma." });
        const btn = d.querySelector('#btn-request-release');
        btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">check_circle</span> Solicitação Enviada';
        btn.classList.add('opacity-70', 'pointer-events-none');
      };

      d.querySelector('#btn-logout').onclick = () => {
        localStorage.removeItem('movvi_driver');
        user = null;
        nav(loginView);
      };
    }
  }, 0);

  return d;
}

// ═══ DASHBOARD ═══
function dashboardView() {
  const d = document.createElement('div'); d.className = 'view active';
  const on = user.online || false;
  d.innerHTML = `
<div class="relative flex h-full w-full flex-col overflow-hidden" style="height:100dvh">
  <div id="dmap" class="absolute inset-0 z-0 bg-slate-200 dark:bg-background-dark/90"></div>
  <header class="relative z-10 flex items-center justify-between p-4">
    <div class="bg-white/90 dark:bg-background-dark/80 backdrop-blur-md p-2 rounded-xl border border-slate-300 dark:border-primary/20 flex items-center gap-3 shadow-lg">
      <span class="text-xs font-bold uppercase tracking-wider ${on ? 'text-green-600 dark:text-primary' : 'text-slate-500'} ml-1">${on ? 'Online' : 'Offline'}</span>
      <button id="toggle" class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${on ? 'bg-green-500 dark:bg-primary' : 'bg-slate-400 dark:bg-slate-600'}">
        <span class="${on ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-background-dark shadow ring-0 transition duration-200 ease-in-out"></span>
      </button>
    </div>
    <div class="flex items-center gap-3">
      <button id="btn-menu" class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 dark:bg-background-dark/80 backdrop-blur-md border border-slate-300 dark:border-primary/20 text-black font-bold dark:text-primary shadow-md">
        <span class="material-symbols-outlined">menu</span>
      </button>
    </div>
  </header>
  <div class="relative z-10 flex-1 pointer-events-none"></div>
  <button id="btn-recenter" class="absolute right-4 z-20 size-12 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-primary/20 shadow-xl flex items-center justify-center text-primary pointer-events-auto active:scale-95 transition-transform" style="bottom: 280px;">
    <span class="material-symbols-outlined" style="font-size:24px;">my_location</span>
  </button>
  <section id="bottom-sheet" class="relative z-30 bg-white dark:bg-background-dark border-t border-slate-200 dark:border-primary/20 rounded-t-[2rem] shadow-[0_-10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out" style="touch-action:none;">
    <div id="sheet-handle" class="flex h-8 w-full items-center justify-center cursor-grab active:cursor-grabbing">
      <div class="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700 transition-all"></div>
    </div>
    <div id="sheet-content" class="px-5 pb-5 pt-0 overflow-hidden transition-all duration-300">
      <!-- City & Status Row -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2.5">
          <div class="size-9 rounded-xl ${on ? 'bg-green-100 dark:bg-green-500/20' : 'bg-primary/10 dark:bg-primary/20'} flex items-center justify-center ${on ? 'text-green-600 dark:text-green-400' : 'text-primary'}">
            <span class="material-symbols-outlined text-lg">${on ? 'radar' : 'car_repair'}</span>
          </div>
          <div>
            <p id="city-name" class="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Localizando...</p>
            <p class="text-sm font-black text-slate-900 dark:text-white leading-tight">${on ? 'Buscando Resgate' : 'Sem chamados'}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span id="sheet-arrow" class="material-symbols-outlined text-slate-300 text-sm transition-transform duration-300">expand_more</span>
          <div class="h-2.5 w-2.5 rounded-full ${on ? 'bg-green-500 dark:bg-green-400' : 'bg-primary'} animate-pulse"></div>
        </div>
      </div>

      <!-- Collapsible Content -->
      <div id="sheet-details">
        <!-- Info Cards Row -->
        <div id="info-cards" class="grid gap-2.5" style="grid-template-columns: ${trafficEnabled && weatherEnabled ? '1fr 1fr' : '1fr'};">
          ${trafficEnabled ? `
          <div id="traffic-card" class="relative overflow-hidden rounded-2xl p-4" style="background:linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%);">
            <div class="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10" style="background:radial-gradient(circle,#22c55e,transparent);transform:translate(30%,-30%)"></div>
            <div class="flex items-center gap-1.5 mb-2">
              <div id="traffic-indicator" class="size-2 rounded-full bg-green-500 animate-pulse"></div>
              <span class="text-[8px] font-black uppercase tracking-[0.2em] text-green-700/60">Tr\u00e2nsito Agora</span>
            </div>
            <div class="flex items-baseline gap-1.5">
              <span id="traffic-emoji" class="text-lg leading-none">\ud83d\udfe2</span>
              <p id="traffic-level" class="text-sm font-black text-green-800 leading-none">Livre</p>
            </div>
            <p id="traffic-tip" class="text-[10px] font-semibold text-green-700/70 mt-1.5 leading-snug line-clamp-2">Vias com bom fluxo</p>
            <div class="mt-2.5 h-1 rounded-full bg-green-200/60 overflow-hidden">
              <div id="traffic-fill" class="h-full rounded-full transition-all duration-700" style="width:33%;background:linear-gradient(90deg,#22c55e,#4ade80)"></div>
            </div>
          </div>` : ''}

          ${weatherEnabled ? `
          <div id="weather-card" class="relative overflow-hidden rounded-2xl p-4" style="background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);">
            <div class="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10" style="background:radial-gradient(circle,#3b82f6,transparent);transform:translate(30%,-30%)"></div>
            <div class="flex items-center gap-1.5 mb-2">
              <span id="weather-icon-emoji" class="text-sm leading-none">\u26c5</span>
              <span class="text-[8px] font-black uppercase tracking-[0.2em] text-blue-700/60">Clima</span>
            </div>
            <div class="flex items-baseline gap-1">
              <p id="weather-temp" class="text-2xl font-black text-blue-900 leading-none tracking-tighter" style="font-feature-settings:'tnum'">--\u00b0</p>
            </div>
            <p id="weather-desc" class="text-[10px] font-bold text-blue-700/70 mt-1 leading-snug">Carregando...</p>
            <div id="weather-extra" class="flex items-center gap-2.5 mt-2">
              <div class="flex items-center gap-1 text-blue-600/50">
                <span class="material-symbols-outlined text-[11px]">air</span>
                <span id="weather-wind" class="text-[9px] font-bold">-- km/h</span>
              </div>
              <div id="weather-forecast" class="flex items-center gap-1.5 text-blue-600/50" style="scrollbar-width:none"></div>
            </div>
          </div>` : ''}

          ${!trafficEnabled && !weatherEnabled ? `
          <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50">
            <span class="material-symbols-outlined text-slate-300 text-lg">widgets</span>
            <p class="text-xs font-semibold text-slate-400">${on ? 'Aguardando solicita\u00e7\u00f5es...' : 'Ative os widgets no menu lateral'}</p>
          </div>` : ''}
        </div>

        ${newsEnabled ? `
        <div id="news-section" class="mt-3">
          <div class="flex items-center gap-2 mb-2 px-0.5">
            <div class="bg-red-500 rounded-md px-1.5 py-0.5"><span class="text-[9px] font-black text-white tracking-wide">G1</span></div>
            <span class="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">Not\u00edcias de Hoje</span>
            <div class="flex-1"></div>
            <div id="news-loading" class="size-3 border border-slate-300 border-t-red-500 rounded-full animate-spin"></div>
            <span id="news-counter" class="text-[8px] font-bold text-slate-300 hidden">1/1</span>
          </div>
          <div id="news-ticker" class="relative overflow-hidden" style="min-height:48px">
            <div id="news-item" class="transition-all duration-500 ease-out" style="opacity:1;transform:translateY(0)">
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-100"><p class="text-[11px] text-slate-400 font-semibold">Carregando not\u00edcias...</p></div>
            </div>
          </div>
        </div>` : ''}
      </div>
    </div>
  </section>
</div>`;

  d.querySelector('#btn-menu').onclick = openSidebar;

  // ── Bottom Sheet Drag Gesture ──
  const sheet = d.querySelector('#bottom-sheet');
  const sheetDetails = d.querySelector('#sheet-details');
  const sheetArrow = d.querySelector('#sheet-arrow');
  const sheetHandle = d.querySelector('#sheet-handle');
  let sheetCollapsed = false;

  function collapseSheet() {
    sheetCollapsed = true;
    if (sheetDetails) { sheetDetails.style.maxHeight = '0px'; sheetDetails.style.opacity = '0'; sheetDetails.style.overflow = 'hidden'; }
    if (sheetArrow) sheetArrow.style.transform = 'rotate(180deg)';
  }
  function expandSheet() {
    sheetCollapsed = false;
    if (sheetDetails) { sheetDetails.style.maxHeight = '600px'; sheetDetails.style.opacity = '1'; sheetDetails.style.overflow = 'visible'; }
    if (sheetArrow) sheetArrow.style.transform = 'rotate(0deg)';
  }

  if (sheetHandle) {
    let startY = 0, isDragging = false;
    const onStart = (e) => { startY = e.touches ? e.touches[0].clientY : e.clientY; isDragging = true; };
    const onEnd = (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
      const dy = endY - startY;
      if (dy > 30) collapseSheet();
      else if (dy < -30) expandSheet();
    };
    sheetHandle.addEventListener('touchstart', onStart, { passive: true });
    sheetHandle.addEventListener('touchend', onEnd, { passive: true });
    sheetHandle.addEventListener('mousedown', onStart);
    sheetHandle.addEventListener('mouseup', onEnd);
    sheetHandle.onclick = () => { sheetCollapsed ? expandSheet() : collapseSheet(); };
  }
  if (sheetDetails) { sheetDetails.style.maxHeight = '600px'; sheetDetails.style.transition = 'max-height 0.3s ease, opacity 0.3s ease'; }

  d.querySelector('#toggle').onclick = async () => {
    unlockAudio();

    // Sync status before toggle to avoid using stale local data
    try {
      const fresh = await Drivers.get(user.id);
      user.blocked = fresh.blocked;
      user.walletBalance = fresh.walletBalance;
      saveUser(user);
    } catch (e) { }

    if (!user.online && (user.blocked || (user.walletBalance || 0) <= -50)) {
      showDebtModal();
      return;
    }
    user.online = !user.online;
    saveUser(user);
    socket.emit(user.online ? 'driver:online' : 'driver:offline', user.id);
    window.location.reload();
  };


  let dashboardMapTimer = setTimeout(() => {
    const el = d.querySelector('#dmap'); if (!el) return;
    const initLat = user?.latitude || -23.55, initLon = user?.longitude || -46.63;
    const initialZoom = on ? 15 : 13;
    map = L.map(el, { zoomControl: false, attributionControl: false }).setView([initLat, initLon], initialZoom);
    L.tileLayer(tileUrl(), { subdomains: ['0', '1', '2', '3'] }).addTo(map);
    getCurrentPosition().then(p => {
      map.flyTo([p.latitude, p.longitude], initialZoom, { duration: 1.5 });

      // Reverse geocode to get city name
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${p.latitude}&lon=${p.longitude}&addressdetails=1`)
        .then(r => r.json())
        .then(geo => {
          const a = geo.address || {};
          const city = a.city || a.town || a.village || a.municipality || 'Rio de Janeiro';
          const neighbourhood = a.neighbourhood || a.suburb || '';
          resolvedCityName = city;
          const cityEl = d.querySelector('#city-name');
          if (cityEl) cityEl.textContent = [neighbourhood, city].filter(Boolean).join(' • ') || 'Região desconhecida';
          if (newsEnabled) loadNews();
        }).catch(() => {
          const cityEl = d.querySelector('#city-name');
          if (cityEl) cityEl.textContent = 'GPS ativo';
          resolvedCityName = 'Rio de Janeiro';
          if (newsEnabled) loadNews();
        });

      const radarHtml = on
        ? `<div style="position:absolute;left:0;top:0;pointer-events:none">
            <div style="position:absolute;left:-200px;top:-200px;width:400px;height:400px;border-radius:50%;background:rgba(59,130,246,0.06);animation:pulseRadar 3s ease-out infinite"></div>
            <div style="position:absolute;left:-125px;top:-125px;width:250px;height:250px;border-radius:50%;background:rgba(59,130,246,0.10);animation:pulseRadar 3s ease-out infinite 0.7s"></div>
            <div style="position:absolute;left:-60px;top:-60px;width:120px;height:120px;border-radius:50%;background:rgba(59,130,246,0.15);animation:pulseRadar 3s ease-out infinite 1.4s"></div>
            <div style="position:absolute;left:-8px;top:-8px;width:16px;height:16px;border-radius:50%;background:#3b82f6;box-shadow:0 0 10px rgba(59,130,246,0.8);z-index:2; border:2px solid white"></div>
          </div>
            <style>
              @keyframes pulseRadar { 0% { transform: scale(0); opacity: 1; } 100% { transform:scale(1.5);opacity:0; } }
            </style>`
        : `<div style="position:absolute;left:0;top:0;pointer-events:none">
            <div style="position:absolute;left:-8px;top:-8px;width:16px;height:16px;border-radius:50%;background:#94a3b8;border:3px solid white;box-shadow:0 0 8px rgba(0,0,0,0.15);z-index:2"></div>
           </div>`;

      myMarker = L.marker([p.latitude, p.longitude], {
        icon: L.divIcon({
          className: '',
          html: radarHtml,
          iconSize: [0, 0], iconAnchor: [0, 0]
        })
      }).addTo(map);

      d.querySelector('#btn-recenter').onclick = () => {
        const latlng = myMarker.getLatLng();
        map.flyTo(latlng, initialZoom, { duration: 0.8 });
      };

      const btnTraf = d.querySelector('#btn-traffic-dash');
      if (btnTraf) {
        btnTraf.onclick = () => {
          mapTrafficEnabled = !mapTrafficEnabled;
          localStorage.setItem('movvi_map_traffic', mapTrafficEnabled ? 'on' : 'off');
          btnTraf.innerHTML = `<span class="material-symbols-outlined">${mapTrafficEnabled ? 'traffic' : 'layers'}</span>`;
          btnTraf.className = `bg-white/90 dark:bg-background-dark/80 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-300 dark:border-primary/20 transition-all ${mapTrafficEnabled ? 'text-blue-500' : 'text-slate-400'}`;
          refreshMapLayers();
          if (sidebar) buildSidebar();
        };
      }

      // ── Populate Traffic Card (Premium) ──
      if (trafficEnabled) {
        const tr = getTrafficEstimate();
        const card = d.querySelector('#traffic-card');
        const tLvl = d.querySelector('#traffic-level');
        const tTip = d.querySelector('#traffic-tip');
        const tIndicator = d.querySelector('#traffic-indicator');
        const tEmoji = d.querySelector('#traffic-emoji');
        const tFill = d.querySelector('#traffic-fill');

        const styles = {
          livre: { emoji: '🟢', bg: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', dotColor: '#22c55e', fillBg: 'linear-gradient(90deg,#22c55e,#4ade80)', width: '33%', labelCls: 'text-sm font-black text-green-800 leading-none', tipCls: 'text-[10px] font-semibold text-green-700/70 mt-1.5 leading-snug line-clamp-2' },
          moderado: { emoji: '🟡', bg: 'linear-gradient(135deg,#fefce8,#fef9c3)', dotColor: '#eab308', fillBg: 'linear-gradient(90deg,#eab308,#facc15)', width: '66%', labelCls: 'text-sm font-black text-yellow-800 leading-none', tipCls: 'text-[10px] font-semibold text-yellow-700/70 mt-1.5 leading-snug line-clamp-2' },
          intenso: { emoji: '🔴', bg: 'linear-gradient(135deg,#fef2f2,#fecaca)', dotColor: '#ef4444', fillBg: 'linear-gradient(90deg,#ef4444,#f87171)', width: '100%', labelCls: 'text-sm font-black text-red-800 leading-none', tipCls: 'text-[10px] font-semibold text-red-700/70 mt-1.5 leading-snug line-clamp-2' },
        };
        const s = styles[tr.level] || styles.livre;
        if (card) card.style.background = s.bg;
        if (tEmoji) tEmoji.textContent = s.emoji;
        if (tLvl) { tLvl.textContent = tr.label; tLvl.className = s.labelCls; }
        if (tTip) { tTip.textContent = tr.tip; tTip.className = s.tipCls; }
        if (tIndicator) tIndicator.style.background = s.dotColor;
        if (tFill) { tFill.style.background = s.fillBg; tFill.style.width = s.width; }
        if (on) { L.circleMarker([p.latitude, p.longitude], { radius: 60, color: tr.color, fillColor: tr.color, fillOpacity: 0.08, weight: 1, opacity: 0.3 }).addTo(map); }
      }

      // ── Populate Weather Card (Premium) ──
      if (weatherEnabled) {
        fetchWeather(p.latitude, p.longitude).then(w => {
          if (!w || !w.current_weather) return;
          weatherData = w;
          const cw = w.current_weather;
          const desc = weatherCodes[cw.weathercode] || 'Desconhecido';
          const temp = Math.round(cw.temperature);
          const wind = Math.round(cw.windspeed);
          const code = cw.weathercode;
          const tempEl = d.querySelector('#weather-temp');
          const descEl = d.querySelector('#weather-desc');
          const windEl = d.querySelector('#weather-wind');
          const emojiEl = d.querySelector('#weather-icon-emoji');
          const forecastEl = d.querySelector('#weather-forecast');
          const wCard = d.querySelector('#weather-card');

          if (tempEl) tempEl.textContent = temp + '°';
          if (descEl) descEl.textContent = desc;
          if (windEl) windEl.textContent = wind + ' km/h';

          if (code === 0 || code === 1) { if (emojiEl) emojiEl.textContent = '☀️'; if (wCard) wCard.style.background = 'linear-gradient(135deg,#fffbeb,#fef3c7)'; }
          else if (code >= 45 && code <= 48) { if (emojiEl) emojiEl.textContent = '🌫️'; }
          else if (code >= 51 && code <= 67) { if (emojiEl) emojiEl.textContent = '🌧️'; if (wCard) wCard.style.background = 'linear-gradient(135deg,#f0f9ff,#cfe2ff)'; }
          else if (code >= 80 && code <= 82) { if (emojiEl) emojiEl.textContent = '⛈️'; if (wCard) wCard.style.background = 'linear-gradient(135deg,#eef2ff,#c7d2fe)'; }
          else if (code >= 95) { if (emojiEl) emojiEl.textContent = '⚡'; }

          if (forecastEl && w.hourly) {
            const now = new Date().getHours();
            let html = '';
            for (let i = now + 1; i < Math.min(now + 4, (w.hourly.time || []).length); i++) {
              const h = new Date(w.hourly.time[i]).getHours();
              const t = Math.round(w.hourly.temperature_2m[i]);
              html += `<span class="text-[9px] font-bold whitespace-nowrap bg-white/60 px-1.5 py-0.5 rounded-md">${h}h ${t}°</span>`;
            }
            forecastEl.innerHTML = html;
          }
        }).catch(() => { });
      }

    }).catch(() => { });
  }, 100);

  // ── News Logic ──
  let resolvedCityName = 'Rio de Janeiro';

  function loadNews() {
    let newsItems = [];
    let newsIdx = 0;
    const ticker = d.querySelector('#news-item');
    const newsLoading = d.querySelector('#news-loading');
    const newsCounter = d.querySelector('#news-counter');

    function renderG1(n) {
      return `<div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">\n        <div class="bg-red-500 rounded-md px-1.5 py-1 shrink-0 mt-0.5"><span class="text-[9px] font-black text-white leading-none">G1</span></div>\n        <div class="flex-1 min-w-0">\n          <p class="text-[11px] font-bold text-slate-800 leading-snug line-clamp-2">${n.title}</p>\n          <div class="flex items-center gap-2 mt-1">\n            <span class="text-[9px] font-black text-red-500">${n.source || 'G1'}</span>\n            ${n.timeAgo ? `<span class="text-[9px] font-semibold text-slate-400">• ${n.timeAgo}</span>` : ''}\n          </div>\n        </div>\n      </div>`;
    }

    function showItem() {
      if (!ticker || newsItems.length === 0) return;
      ticker.style.opacity = '0';
      ticker.style.transform = 'translateY(6px)';
      setTimeout(() => {
        ticker.innerHTML = renderG1(newsItems[newsIdx]);
        ticker.style.opacity = '1';
        ticker.style.transform = 'translateY(0)';
        if (newsCounter && newsItems.length > 1) { newsCounter.textContent = `${newsIdx + 1}/${newsItems.length}`; newsCounter.classList.remove('hidden'); }
      }, 250);
    }

    function fetchNews() {
      console.log('[News] Fetching for:', resolvedCityName);
      if (newsLoading) newsLoading.style.display = '';
      fetch(`/api/news?city=${encodeURIComponent(resolvedCityName)}`)
        .then(r => r.json())
        .then(data => {
          if (newsLoading) newsLoading.style.display = 'none';
          if (!data.items || data.items.length === 0) {
            if (ticker) ticker.innerHTML = '<div class="p-3 rounded-xl bg-slate-50 border border-slate-100"><p class="text-[11px] text-slate-400 font-semibold">Sem notícias de hoje</p></div>';
            return;
          }
          newsItems = data.items;
          newsIdx = 0;
          showItem();
        })
        .catch(() => {
          if (newsLoading) newsLoading.style.display = 'none';
          if (ticker) ticker.innerHTML = '<div class="p-3 rounded-xl bg-slate-50 border border-slate-100"><p class="text-[11px] text-slate-400 font-semibold">Falha ao carregar</p></div>';
        });
    }

    fetchNews();
    setInterval(() => {
      if (newsItems.length > 1) { newsIdx = (newsIdx + 1) % newsItems.length; showItem(); }
      if (newsIdx === 0 && newsItems.length > 0) fetchNews();
    }, 40000);
  }

  return d;
}
// ═══ INCOMING REQUEST ═══
function incomingView(data) {
  const d = document.createElement('div'); d.className = 'view active bg-background-light dark:bg-background-dark';
  const pr = (data.driverPrice || data.price || 0).toFixed(2).replace('.', ',');
  let tl = Math.floor((data.timeout || 15000) / 1000);
  d.innerHTML = `
<div class="flex flex-col h-full">
  <div class="p-6 text-center border-b border-slate-200 dark:border-white/10">
    <div class="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse"><div class="w-2 h-2 bg-primary rounded-full"></div>Novo Chamado</div>
  </div>
  <div class="flex-1 flex flex-col items-center justify-center p-6 mt-4">
    <div class="relative mb-10 w-full flex flex-col items-center justify-center">
      <div id="glow-ring" class="absolute bg-primary/30 blur-3xl rounded-full size-36 animate-pulse transition-all duration-500 z-0"></div>
      <div class="relative flex items-center justify-center z-10 scale-[1.35] drop-shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <svg class="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="white" class="dark:fill-[#1a1a1a] border-slate-200 dark:border-white/5" stroke="currentColor" stroke-width="3" stroke-opacity="0.1"/>
          <circle id="tc" cx="50" cy="50" r="42" fill="none" stroke="#ffd900" stroke-width="7" stroke-dasharray="264" stroke-dashoffset="0" stroke-linecap="round" style="transition: stroke-dashoffset 1s linear, stroke 0.5s ease;"/>
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span id="tt" class="text-5xl font-black text-slate-900 dark:text-white leading-none tracking-tighter transition-colors duration-500" style="font-family: 'JetBrains Mono', monospace;">${tl}</span>
          <span id="tt-lbl" class="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-0.5 transition-colors duration-500">SEG</span>
        </div>
      </div>
    </div>
    <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-2 text-center leading-tight tracking-tight">${data.vehicleModel || 'Veículo'}</h2>
    <div class="bg-primary/20 text-primary px-3 py-1 rounded-lg border border-primary/30 mb-4 font-bold flex items-center gap-1"><span class="material-symbols-outlined text-sm">build</span> ${data.serviceName || data.serviceType || 'Tipo de Pane Não Informado'}</div>
    
    <div class="w-full flex items-center gap-3 bg-slate-100 dark:bg-white/5 px-4 py-3 rounded-2xl mb-6 border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
      <div class="size-12 rounded-xl border border-primary bg-primary/10 flex items-center justify-center text-primary shrink-0 relative overflow-hidden">
        ${data.clientPhoto ? `<img src="${data.clientPhoto}" class="w-full h-full object-cover">` : '<span class="material-symbols-outlined text-2xl">person</span>'}
        <div class="absolute -bottom-1 -right-1 size-4 bg-green-500 rounded-full border-2 border-white dark:border-background-dark shadow-sm"></div>
      </div>
      <div class="text-left flex-1 min-w-0">
        <p class="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-0.5">Cliente Solicitante</p>
        <p class="text-base font-black text-black dark:text-white truncate">${data.clientName || 'Cliente'}</p>
      </div>
      <div class="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-200 dark:border-yellow-500/20">
        <span class="text-xs font-black">5.0</span><span class="material-symbols-outlined text-[12px]">star</span>
      </div>
    </div>
    <div class="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 flex justify-around mb-6">
      <div class="text-center"><p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Percurso total</p><p class="text-black font-bold dark:text-white text-lg">${data.distanceKm || '?'} km</p></div>
      <div class="w-px bg-slate-200 dark:bg-white/10"></div>
      <div class="text-center"><p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Ganho (Líquido)</p><p class="text-primary font-black text-lg">R$ ${pr}</p></div>
    </div>
    <div class="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 mb-4 flex flex-col gap-3 relative">
      <div class="absolute left-[20px] top-6 bottom-16 w-0.5 bg-slate-200 dark:bg-white/10"></div>
      <div class="flex flex-col gap-1 relative z-10 pl-5">
         <div class="absolute left-[-5px] top-1 bottom-0 size-3 rounded-full bg-white border-2 border-primary"></div>
         <p class="text-[9px] text-slate-500 mb-0.5 uppercase tracking-wider font-bold">Origem (Retirada)</p>
         <p class="text-black font-bold dark:text-white text-sm font-semibold leading-tight line-clamp-2">${data.pickupAddress || 'Endereço Indisponível'}</p>
      </div>
      <div class="flex flex-col gap-1 relative z-10 pl-5">
         <div class="absolute left-[-5px] top-1 bottom-0 size-3 rounded-full bg-slate-400 dark:bg-slate-500"></div>
         <p class="text-[9px] text-slate-500 mb-0.5 uppercase tracking-wider font-bold">Destino Final (Entrega)</p>
         <p class="text-black font-bold dark:text-white text-sm font-semibold leading-tight line-clamp-2">${data.destinationAddress || 'Endereço Indisponível'}</p>
      </div>
    </div>
  </div>
  <div class="p-5 flex gap-3 border-t border-slate-200 dark:border-white/10">
    <button id="bd" class="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold py-4 rounded-xl hover:text-red-500">Recusar</button>
    <button id="ba" class="flex-[2] bg-primary text-black font-bold py-4 rounded-xl shadow-lg hover:bg-primary/90 active:scale-[0.98]">Aceitar Corrida</button>
  </div>
</div > `;
  const circ = d.querySelector('#tc'), tot = (data.timeout || 15000) / 1000;
  const txt = d.querySelector('#tt');
  const txtLbl = d.querySelector('#tt-lbl');
  const glow = d.querySelector('#glow-ring');

  const updateVisuals = () => {
    circ.style.strokeDashoffset = 264 * (1 - tl / tot);
    const ratio = tl / tot;
    if (ratio <= 0.3) {
      circ.style.stroke = '#ef4444'; // Red
      txt.style.color = '#ef4444';
      txtLbl.style.color = '#ef4444';
      glow.classList.remove('bg-primary/30', 'bg-[#f97316]/30');
      glow.classList.add('bg-[#ef4444]/40', 'animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite]');
    } else if (ratio <= 0.6) {
      circ.style.stroke = '#f97316'; // Orange
      txt.style.color = '#f97316';
      txtLbl.style.color = '#f97316';
      glow.classList.remove('bg-primary/30');
      glow.classList.add('bg-[#f97316]/30');
    }
  };

  const stopAudioLocal = () => {
    try { alertAudio.pause(); alertAudio.currentTime = 0; } catch (e) { }
  };

  try {
    alertAudio.currentTime = 0;
    alertAudio.play().catch(e => console.log('Audio blocked', e));
  } catch (e) { }

  updateVisuals();

  incomingTimer = setInterval(() => {
    tl--;
    if (tl < 0) tl = 0;
    txt.textContent = tl;
    updateVisuals();
    if (tl <= 0) {
      clearInterval(incomingTimer);
      stopAudioLocal();
    }
  }, 1000);

  d.querySelector('#ba').onclick = () => { stopAudioLocal(); clearInterval(incomingTimer); socket.emit('order:accept', { driverId: user.id, orderId: data.orderId }); activeOrder = data; nav(activeJobView, data); };
  d.querySelector('#bd').onclick = () => { stopAudioLocal(); clearInterval(incomingTimer); socket.emit('order:decline', { driverId: user.id, orderId: data.orderId }); nav(dashboardView); };

  return d;
}

// ═══ ACTIVE JOB ═══
function activeJobView(data) {
  const d = document.createElement('div'); d.className = 'view active';
  d.innerHTML = `
<div class="relative flex flex-col" style="height:100dvh">
  <div class="absolute top-4 left-4 z-[60]"><button id="btn-menu" class="size-10 rounded-lg bg-background-dark/80 backdrop-blur-md border border-primary/20 text-primary flex items-center justify-center"><span class="material-symbols-outlined">menu</span></button></div>
  <div class="absolute top-4 right-4 z-[60] flex gap-2">
      <div class="flex flex-col gap-2">
        <button id="btn-recenter" class="bg-white/90 dark:bg-background-dark/80 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-300 dark:border-primary/20 text-primary active:scale-95 transition-all"><span class="material-symbols-outlined">my_location</span></button>
        <button id="btn-traffic-dash" class="bg-white/90 dark:bg-background-dark/80 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-300 dark:border-primary/20 transition-all ${mapTrafficEnabled ? 'text-blue-500' : 'text-slate-400'}"><span class="material-symbols-outlined">${mapTrafficEnabled ? 'traffic' : 'layers'}</span></button>
      </div>
    </div>
  
  <div id="nav-instructions" class="absolute top-4 left-1/2 z-[100] bg-slate-950/85 backdrop-blur-xl rounded-[1.5rem] p-3 shadow-[0_15px_45px_rgba(0,0,0,0.4)] border border-white/10 flex items-center gap-3 transition-all duration-700 transform -translate-x-1/2 -translate-y-40 opacity-0 pointer-events-none w-[calc(100%-120px)] max-w-[260px]">
    <div class="size-10 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/30 shrink-0 shadow-inner">
      <span id="nav-icon" class="material-symbols-outlined text-[28px]">navigation</span>
    </div>
    <div class="flex-1 min-w-0">
      <p id="nav-dist" class="text-blue-400 font-bold tracking-wider text-[11px] uppercase mb-0">Calculando...</p>
      <p id="nav-desc" class="text-white font-bold leading-tight text-xs truncate">Aguarde...</p>
    </div>
  </div>

  <div id="jmap-wrapper" class="absolute inset-0 z-10 bg-[#e5e7eb] dark:bg-background-dark" style="perspective: 1400px; overflow: hidden;">
    <div id="jmap" class="absolute inset-0 transition-transform duration-600 ease-out pointer-events-auto" style="transform-origin: center 80%;"></div>
  </div>

  <!-- Map Controls -->
  <div class="absolute right-4 top-24 z-40 flex flex-col gap-2">
    <!-- Perspective/Compass Button -->
    <button id="btn-perspective" class="size-11 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-center text-primary active:scale-95 transition-all">
      <span class="material-symbols-outlined transition-transform duration-500 text-[24px]" id="compass-icon" style="text-shadow: 0 0 10px rgba(255,217,0,0.4)">explore</span>
    </button>
    
    <!-- Traffic Toggle Button -->
    <button id="btn-traffic-job" class="size-11 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all ${mapTrafficEnabled ? 'text-blue-500' : 'text-slate-400'}">
      <span class="material-symbols-outlined text-[24px]">${mapTrafficEnabled ? 'traffic' : 'layers'}</span>
    </button>
  </div>

  <section id="job-bottom-sheet" class="absolute bottom-[90px] left-0 right-0 z-30 flex flex-col flex-shrink-0 bg-white dark:bg-background-dark border-t border-primary/20 rounded-t-[2rem] shadow-[0_-10px_30px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-out" style="touch-action:none;">
    <div id="job-sheet-handle" class="flex h-10 w-full items-center justify-center cursor-grab active:cursor-grabbing">
      <div class="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700 transition-all"></div>
    </div>
    
    <div id="job-sheet-content" class="px-6 pb-2 pt-0 transition-all duration-300 overflow-hidden" style="max-height: 600px;">
      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-3">
          <div class="size-12 rounded-xl overflow-hidden border border-primary bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-sm">
            ${data.clientPhoto ? `<img src="${data.clientPhoto}" class="w-full h-full object-cover">` : '<span class="material-symbols-outlined text-2xl">person</span>'}
          </div>
          <div><p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Cliente</p><h3 class="text-black font-bold dark:text-white text-lg leading-tight">${data.clientName || 'Cliente'}</h3></div>
        </div>
        <div class="flex gap-2">
          <button id="btn-chat" class="size-10 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:text-primary"><span class="material-symbols-outlined">chat</span></button>
          <button id="btn-call" class="size-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20"><span class="material-symbols-outlined">call</span></button>
        </div>
      </div>
      <div class="bg-indigo-50 dark:bg-indigo-500/10 rounded-xl p-3 flex items-start gap-3 mb-3 border border-indigo-200 dark:border-indigo-500/20">
        <span class="material-symbols-outlined text-indigo-500 mt-0.5">build</span>
        <div><p class="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-0.5">${data.serviceName || data.serviceType || 'Ocorrência'}</p><p class="text-black font-bold dark:text-slate-200 text-sm font-medium line-clamp-2 leading-tight">${data.problemDescription || 'Sem detalhes adiconados.'}</p></div>
      </div>
      <div class="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 mb-2 p-4 relative">
        <div class="absolute left-[20px] top-6 bottom-16 w-0.5 bg-slate-200 dark:bg-white/10"></div>
        <div class="flex items-start gap-4 relative z-10 mb-4">
          <div class="size-6 rounded-full bg-white dark:bg-background-dark border-4 border-primary shrink-0 mt-0.5"></div>
          <div class="flex-1 min-w-0">
            <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Origem</p>
            <p class="text-black font-bold dark:text-slate-300 text-sm font-semibold leading-tight">${data.pickupAddress || ''}</p>
            <a href="https://maps.google.com/?q=${data.pickupLat || '-23.55'},${data.pickupLon || '-46.63'}" target="_blank" class="mt-2 text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-emerald-500 px-2.5 py-1 rounded inline-flex items-center gap-1 active:scale-95 transition-all w-fit"><span class="material-symbols-outlined text-[14px]">explore</span>Navegar (Maps)</a>
          </div>
        </div>
        <div class="flex items-start gap-4 relative z-10">
          <div class="size-6 rounded-full bg-white dark:bg-background-dark border-4 border-slate-400 shrink-0 mt-0.5" id="dest-dot"></div>
          <div class="flex-1 min-w-0">
            <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Destino Final (<span class="text-primary font-black">${data.distanceKm || '?'} km</span> totais)</p>
            <p class="text-black font-bold dark:text-slate-300 text-sm font-semibold leading-tight">${data.destinationAddress || 'Não informado'}</p>
            <a id="nav-dest" href="https://maps.google.com/?q=${data.destinationLat || '-23.55'},${data.destinationLon || '-46.63'}" target="_blank" class="mt-2 text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-emerald-500 px-2.5 py-1 rounded inline-flex items-center gap-1 active:scale-95 transition-all w-fit hidden"><span class="material-symbols-outlined text-[14px]">explore</span>Navegar (Maps)</a>
          </div>
        </div>
        <div id="route-info" class="flex items-center justify-center gap-2 text-xs text-slate-500 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mt-3"><span class="material-symbols-outlined text-sm animate-spin text-blue-500">progress_activity</span><span class="text-blue-500 font-black uppercase tracking-widest text-[10px]">Calculando Trajeto...</span></div>
    </div>
  </section>
  <div class="absolute bottom-0 left-0 right-0 p-6 pt-4 border-t border-slate-200 dark:border-white/5 w-full z-40 bg-white dark:bg-background-dark pb-8">
    <button id="btn-start-nav" class="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-[0_4px_15px_rgba(37,99,235,0.4)] active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-wide transition-all"><span class="material-symbols-outlined">explore</span> Iniciar Trajeto</button>
    <button id="b1" class="w-full bg-primary text-black font-bold py-4 rounded-xl shadow-[0_4px_15px_rgba(255,217,0,0.4)] active:scale-[0.98] hidden relative z-50 uppercase tracking-widest transition-all">Cheguei ao Local</button>
    <button id="b2" class="w-full bg-primary/10 border border-primary text-primary font-bold py-4 rounded-xl hidden relative z-50 uppercase tracking-widest">Embarque Confirmado</button>
    <button id="b3" class="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hidden relative z-50 uppercase tracking-widest">Concluir Viagem</button>
  </div>
</div>`;
  d.querySelector('#btn-menu').onclick = openSidebar;
  d.querySelector('#btn-chat').onclick = () => {
    const dot = document.getElementById('chat-dot');
    if (dot) dot.remove();
    nav(clientChatView, data);
  };
  d.querySelector('#btn-call').onclick = () => startCall(data.clientId, data.clientName, data.clientPhoto);
  const b1 = d.querySelector('#b1'), b2 = d.querySelector('#b2'), b3 = d.querySelector('#b3'), btnStartNav = d.querySelector('#btn-start-nav');

  // Bottom Sheet Logic
  const jsheetContent = d.querySelector('#job-sheet-content');
  const jsheetHandle = d.querySelector('#job-sheet-handle');
  let jsheetCollapsed = false;

  function collapseJSheet() {
    jsheetCollapsed = true;
    if (jsheetContent) {
      jsheetContent.style.maxHeight = '0px';
      jsheetContent.style.opacity = '0';
      jsheetContent.style.padding = '0';
    }
  }
  function expandJSheet() {
    jsheetCollapsed = false;
    if (jsheetContent) {
      jsheetContent.style.maxHeight = '600px';
      jsheetContent.style.opacity = '1';
      jsheetContent.style.paddingBottom = '0.5rem';
      jsheetContent.style.paddingLeft = '1.5rem';
      jsheetContent.style.paddingRight = '1.5rem';
    }
  }

  if (jsheetHandle) {
    let startY = 0, isDragging = false;
    const onStart = (e) => { startY = e.touches ? e.touches[0].clientY : e.clientY; isDragging = true; };
    const onEnd = (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
      const dy = endY - startY;
      if (dy > 30) collapseJSheet();
      else if (dy < -30) expandJSheet();
    };
    jsheetHandle.addEventListener('touchstart', onStart, { passive: true });
    jsheetHandle.addEventListener('touchend', onEnd, { passive: true });
    jsheetHandle.addEventListener('mousedown', onStart);
    jsheetHandle.addEventListener('mouseup', onEnd);
    jsheetHandle.onclick = () => { jsheetCollapsed ? expandJSheet() : collapseJSheet(); };
  }
  if (jsheetContent) { jsheetContent.style.maxHeight = '600px'; } // init height

  btnStartNav.onclick = () => {
    btnStartNav.classList.add('hidden');
    b1.classList.remove('hidden');
    collapseJSheet(); // Hide details so map is absolute
    isFollowing = true;
    if (jobMap) jobMap.invalidateSize();
    sync3D();
    // Force immediate instruction update
    traceRoute(currentLat, currentLon);
  };

  // INIT state based on data
  if (data.status === 'pickup') {
    btnStartNav.classList.add('hidden');
    b2.classList.remove('hidden');
  } else if (data.status === 'in_progress') {
    btnStartNav.classList.add('hidden');
    b3.classList.remove('hidden');
    collapseJSheet();
  }

  let watchId = null;
  const stopGPS = () => { if (watchId) navigator.geolocation.clearWatch(watchId); };

  b1.onclick = () => { socket.emit('order:arrived', { orderId: data.orderId }); b1.classList.add('hidden'); b2.classList.remove('hidden'); expandJSheet(); };
  b2.onclick = () => {
    socket.emit('order:start', { orderId: data.orderId });
    b2.classList.add('hidden');
    b3.classList.remove('hidden');
    collapseJSheet(); // Collapse again when starting real ride
    const destDot = d.querySelector('#dest-dot');
    if (destDot) destDot.classList.replace('border-slate-400', 'border-primary');
    d.querySelector('#route-info').innerHTML = '<span class="text-primary font-bold leading-tight drop-shadow-sm">Em viagem para o destino final</span>';
    traceRoute(currentLat, currentLon);
  };
  b3.onclick = () => { stopGPS(); socket.emit('order:complete', { orderId: data.orderId }); activeOrder = null; nav(rateView, data); };

  const pLat = data.pickupLat || -23.55, pLon = data.pickupLon || -46.63;
  let jobMap = null, routeLine = null, drvMarker = null;
  let currentLat = user.latitude || pLat, currentLon = user.longitude || pLon;
  let isFollowing = true, mapViewMode = 2; // 0: 2D, 1: 3D North, 2: 3D Chase
  let prevLat = null, prevLon = null, carHeading = 0;

  function sync3D() {
    const jm = d.querySelector('#jmap');
    const icon = d.querySelector('#compass-icon');
    if (!jm) return;

    if (icon) icon.style.transform = `rotate(${-carHeading}deg)`;

    // If user is manually exploring (isFollowing=false), keep it 2D for easier interaction
    if (!isFollowing) {
      jm.style.transform = 'rotateX(0deg) rotateZ(0deg) scale(1) translateY(0%)';
      return;
    }

    if (mapViewMode === 2) {
      // 3D Chase (Rotating) - Cinematic distant view
      jm.style.transform = `rotateX(62deg) rotateZ(${-carHeading}deg) scale(6) translateY(32%)`;
    } else if (mapViewMode === 1) {
      // 3D North (Fixed)
      jm.style.transform = `rotateX(62deg) rotateZ(0deg) scale(6) translateY(32%)`;
    } else {
      // 2D (Standard)
      jm.style.transform = 'rotateX(0deg) rotateZ(0deg) scale(1) translateY(0%)';
    }
  }

  d.querySelector('#btn-perspective').onclick = () => {
    isFollowing = true; // Reset following when changing mode
    mapViewMode = (mapViewMode + 1) % 3;
    sync3D();
  };

  const btnTrafJob = d.querySelector('#btn-traffic-job');
  if (btnTrafJob) {
    btnTrafJob.onclick = () => {
      mapTrafficEnabled = !mapTrafficEnabled;
      localStorage.setItem('movvi_map_traffic', mapTrafficEnabled ? 'on' : 'off');
      btnTrafJob.innerHTML = `<span class="material-symbols-outlined text-[24px]">${mapTrafficEnabled ? 'traffic' : 'layers'}</span>`;
      btnTrafJob.className = `size-11 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all ${mapTrafficEnabled ? 'text-blue-500' : 'text-slate-400'}`;

      const url = tileUrl();
      if (jobMap) {
        jobMap.eachLayer(l => { if (l instanceof L.TileLayer) l.setUrl(url); });
      }
      if (sidebar) buildSidebar();
    };
  }

  function getCarIcon(heading) {
    // In Chase mode (map rotates), the car icon should always point "Up" relative to the camera
    const rotation = (isFollowing && mapViewMode === 2) ? 0 : heading;
    return L.divIcon({
      className: '',
      html: `
        <div style="transform: rotate(${rotation}deg); transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; align-items: center; justify-content: center; width: 60px; height: 60px;">
          <!-- Pulse shadow -->
          <div class="absolute size-8 bg-blue-500/20 rounded-full animate-ping"></div>
          
          <svg width="28" height="48" viewBox="0 0 24 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 6px 12px rgba(0,0,0,0.4))">
            <!-- Body Chassis -->
            <path d="M3 12C3 7 6 4 12 4C18 4 21 7 21 12V30C21 36 18 38 12 38C6 38 3 36 3 30V12Z" fill="#1d4ed8" stroke="#3b82f6" stroke-width="1.5"/>
            <!-- Glass/Windows -->
            <path d="M5 14C5 11 7 9 12 9C17 9 19 11 19 14V18H5V14Z" fill="#93c5fd" fill-opacity="0.6"/>
            <rect x="6" y="28" width="12" height="6" rx="1.5" fill="#93c5fd" fill-opacity="0.3"/>
            <!-- Roof Detail -->
            <path d="M6 19H18V27C18 28.5 17 29.5 15.5 29.5H8.5C7 29.5 6 28.5 6 27V19Z" fill="#1e40af"/>
            <!-- Headlights (Glow) -->
            <rect x="5" y="6" width="4" height="2" rx="1" fill="#fef08a" style="filter:blur(1px)"/>
            <rect x="15" y="6" width="4" height="2" rx="1" fill="#fef08a" style="filter:blur(1px)"/>
            <!-- Spoiler/Detail -->
            <path d="M4 35H20" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  }

  d.querySelector('#btn-recenter').onclick = () => {
    isFollowing = true;
    mapViewMode = 2; // Default back to Chase 3D
    const btnIcon = d.querySelector('#btn-recenter');
    btnIcon.classList.replace('text-slate-600', 'text-primary');
    jobMap.setView([currentLat || user.latitude, currentLon || user.longitude], 18);
    sync3D();
  };

  let routeDebounceId = null;
  async function traceRoute(fromLat, fromLon) {
    // Calculate heading/rotation
    if (prevLat && prevLon) {
      const dy = fromLat - prevLat;
      const dx = (fromLon - prevLon) * Math.cos(fromLat * Math.PI / 180);
      if (Math.abs(dx) > 0.00001 || Math.abs(dy) > 0.00001) {
        carHeading = Math.atan2(dx, dy) * 180 / Math.PI;
      }
    }
    prevLat = fromLat; prevLon = fromLon;
    currentLat = fromLat; currentLon = fromLon;

    const infoEl = d.querySelector('#route-info');

    let tLat = pLat, tLon = pLon;
    if (activeOrder && activeOrder.status === 'in_progress') {
      tLat = data.destinationLat || pLat;
      tLon = data.destinationLon || pLon;
    }

    if (!drvMarker) {
      drvMarker = L.marker([fromLat, fromLon], { icon: getCarIcon(isFollowing ? 0 : carHeading) }).addTo(jobMap);
    } else {
      drvMarker.setLatLng([fromLat, fromLon]);
      drvMarker.setIcon(getCarIcon(isFollowing ? 0 : carHeading));
    }

    if (isFollowing) {
      jobMap.setView([fromLat, fromLon], jobMap.getZoom() > 16 ? jobMap.getZoom() : 18, { animate: false });
      sync3D();
    }

    // Provide location to server/client continually
    socket.emit('driver:location', { driverId: user.id, latitude: fromLat, longitude: fromLon });

    if (routeDebounceId) return;
    routeDebounceId = setTimeout(() => { routeDebounceId = null; }, 5000); // 5 sec throttle

    try {
      const resp = await fetch(`https://router.project-osrm.org/route/v1/driving/${fromLon},${fromLat};${tLon},${tLat}?overview=full&geometries=geojson&steps=true`);
      const json = await resp.json();
      if (json.routes && json.routes.length > 0) {
        const coords = json.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        if (routeLine) jobMap.removeLayer(routeLine);
        routeLine = L.polyline(coords, { color: '#3b82f6', weight: 6, opacity: 0.9 }).addTo(jobMap);

        const dur = Math.round(json.routes[0].duration / 60);
        const dist = (json.routes[0].distance / 1000).toFixed(1);
        infoEl.innerHTML = `<span class="material-symbols-outlined text-sm text-blue-500">navigation</span><span class="text-blue-500 font-black uppercase tracking-widest text-[11px]">~${dur} min • ${dist}km</span>`;

        const navUI = d.querySelector('#nav-instructions');
        if (isFollowing) {
          navUI.classList.remove('opacity-0', '-translate-y-40', 'pointer-events-none');
          navUI.classList.add('opacity-100', 'translate-y-0');
        } else {
          navUI.classList.remove('opacity-100', 'translate-y-0');
          navUI.classList.add('opacity-0', '-translate-y-40', 'pointer-events-none');
        }

        // Turn by turn Steps Logic
        const currentStep = json.routes[0].legs[0].steps[0];
        const nextStep = json.routes[0].legs[0].steps[1];

        if ((nextStep || currentStep)) {
          const targetStep = nextStep || currentStep;
          const mod = targetStep.maneuver.modifier || 'straight';
          const type = targetStep.maneuver.type || '';
          let dir = 'Siga em frente'; let icon = 'straight';

          if (mod.includes('left')) { dir = 'Vire à esquerda'; icon = 'turn_left'; }
          else if (mod.includes('right')) { dir = 'Vire à direita'; icon = 'turn_right'; }
          else if (mod.includes('uturn')) { dir = 'Faça o retorno'; icon = 'u_turn_left'; }

          if (type.includes('arrive')) { dir = 'Chegando ao destino'; icon = 'location_on'; }
          else if (type.includes('roundabout')) { dir = 'Na rotatória'; icon = 'roundabout_right'; }

          const road = targetStep.name ? ` na ${targetStep.name}` : '';

          const distToNext = currentStep.distance || 0;
          const distStr = distToNext > 1000 ? (distToNext / 1000).toFixed(1) + ' km' : Math.round(distToNext) + ' m';

          d.querySelector('#nav-dist').textContent = `EM ${distStr}`;
          d.querySelector('#nav-desc').textContent = dir + road;
          d.querySelector('#nav-icon').textContent = icon;
        }
        socket.emit('driver:eta', { orderId: data.orderId, clientId: data.clientId, etaMinutes: dur, distanceKm: parseFloat(dist) });
        return;
      }
    } catch (e) {
      console.error('OSRM Nav Error:', e);
      const navUI = d.querySelector('#nav-instructions');
      if (navUI && isFollowing) {
        navUI.classList.remove('opacity-0', '-translate-y-40', 'pointer-events-none');
        navUI.classList.add('opacity-100', 'translate-y-0');
        d.querySelector('#nav-dist').textContent = 'NAVEGANDO';
        d.querySelector('#nav-desc').textContent = 'Siga o trajeto no mapa';
        d.querySelector('#nav-icon').textContent = 'navigation';
      }
    }

    // Fallback: straight line
    if (routeLine) jobMap.removeLayer(routeLine);
    routeLine = L.polyline([[fromLat, fromLon], [tLat, tLon]], { color: '#3b82f6', weight: 4, dashArray: '10,8', opacity: 0.7 }).addTo(jobMap);
    const lineDist = (Math.sqrt(Math.pow(fromLat - tLat, 2) + Math.pow(fromLon - tLon, 2)) * 111).toFixed(1);
    infoEl.innerHTML = `<span class="material-symbols-outlined text-sm text-blue-500">navigation</span><span class="text-blue-500 font-black uppercase tracking-widest text-[11px]">~${lineDist}km (linha reta)</span>`;
  }

  setTimeout(() => {
    jobMap = L.map(d.querySelector('#jmap'), { zoomControl: false, attributionControl: false }).setView([pLat, pLon], 15);
    L.tileLayer(tileUrl(), { subdomains: ['0', '1', '2', '3'] }).addTo(jobMap);
    jobMap.invalidateSize();

    L.marker([pLat, pLon], { icon: L.divIcon({ className: '', html: '<div style="width:20px;height:20px;background:#ffd900;border:3px solid #000;border-radius:50%"></div>', iconSize: [20, 20], iconAnchor: [10, 10] }) }).addTo(jobMap);

    jobMap.on('dragstart touchstart mousedown', () => {
      if (isFollowing) {
        isFollowing = false;
        sync3D();
      }
    });

    jobMap.on('zoomstart', () => {
      if (isFollowing) {
        isFollowing = false;
        sync3D();
      }
    });

    // Run once at start
    traceRoute(currentLat, currentLon);

    // Watch position continuously
    if (navigator.geolocation && navigator.geolocation.watchPosition) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => traceRoute(pos.coords.latitude, pos.coords.longitude),
        () => { },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, 300);

  // Cleanup map resources when destroying
  const cleanupCheck = setInterval(() => {
    if (!document.body.contains(d)) {
      stopGPS();
      clearInterval(cleanupCheck);
    }
  }, 5000);

  return d;
}

// ═══ RATE ═══
function rateView(data) {
  const d = document.createElement('div'); d.className = 'view active bg-background-light dark:bg-background-dark';
  let sr = 0; const pr = (data.driverPrice || data.price || 0).toFixed(2).replace('.', ',');
  d.innerHTML = `
<div class="flex-1 flex flex-col items-center p-6 pt-16">
  <div class="size-16 bg-primary/20 rounded-full flex items-center justify-center mb-6"><span class="material-symbols-outlined text-primary text-3xl">check</span></div>
  <h1 class="text-2xl font-black text-black font-bold dark:text-white mb-1">Viagem Concluída!</h1>
  <p class="text-slate-500 text-sm mb-8">Pagamento: R$ ${pr}</p>
  <p class="text-slate-500 text-xs font-medium uppercase tracking-wider mb-4">Como foi o cliente?</p>
  <div class="flex gap-2 mb-8" id="stars">${[1, 2, 3, 4, 5].map(n => `<button data-v="${n}" class="size-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center hover:border-primary"><span class="material-symbols-outlined text-2xl text-slate-300">star</span></button>`).join('')}</div>
  <button id="done" class="w-full bg-primary text-black font-bold py-4 rounded-xl shadow-lg mt-auto">Concluir</button>
</div>`;
  d.querySelectorAll('#stars button').forEach(s => { s.onclick = async () => { sr = parseInt(s.dataset.v); d.querySelectorAll('#stars button span').forEach(sp => { const v = parseInt(sp.parentElement.dataset.v); sp.className = `material - symbols - outlined text - 2xl ${v <= sr ? 'text-primary' : 'text-slate-300'} `; }); try { await Orders.rate(data.orderId || data.id, sr, 'driver'); } catch { } }; });
  d.querySelector('#done').onclick = () => nav(dashboardView);
  return d;
}

// ═══ EARNINGS ═══
function earningsView() {
  const d = document.createElement('div'); d.className = 'view active bg-background-light dark:bg-background-dark';

  // 🟢 Render structural skeleton immediately (Avoid White Screen)
  d.innerHTML = `
    <header class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-20">
      <button id="btn-menu-init" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-black font-bold dark:text-slate-200"><span class="material-symbols-outlined">menu</span></button>
      <h2 class="font-bold text-black font-bold dark:text-white">Carteira</h2><div class="size-10"></div>
    </header>
    <main id="wallet-main" class="flex-1 overflow-y-auto pb-24">
      <div class="flex flex-col items-center justify-center py-20 animate-pulse">
        <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Carregando carteira...</p>
      </div>
    </main>`;

  const menuBtn = d.querySelector('#btn-menu-init');
  if (menuBtn) menuBtn.onclick = openSidebar;

  const updateWalletUI = async () => {
    try {
      if (!user || !user.id) return;
      const walletData = await api('/drivers/' + user.id + '/wallet');
      const balance = walletData.balance || 0;
      const transactions = walletData.transactions || [];
      const driverData = await Drivers.get(user.id);

      user.walletBalance = balance;
      user.blocked = driverData.blocked;
      saveUser(user);

      const balStr = (balance || 0).toFixed(2).replace('.', ',');
      const isNeg = (balance || 0) < 0;
      const mainEl = d.querySelector('#wallet-main');

      mainEl.innerHTML = `
        <div class="p-6 pb-4 bg-white dark:bg-surface-dark/30 border-b border-slate-200 dark:border-white/5 shadow-sm">
          <div class="flex items-start justify-between mb-4">
            <div>
              <p class="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Saldo na Plataforma</p>
              <h2 class="text-4xl font-black ${(balance || 0) < 0 ? 'text-red-500 dark:text-red-400' : 'text-emerald-500'}">R$ ${balStr}</h2>
            </div>
            <div>
              ${user.blocked ? '<span class="px-2 py-1 bg-red-500 text-white text-[9px] font-black rounded uppercase animate-pulse tracking-tighter">Conta Bloqueada</span>' : ''}
            </div>
          </div>

          <!-- Explicação do Sistema -->
          <div class="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-4 mb-5 flex items-start gap-3">
            <span class="material-symbols-outlined text-indigo-500 text-xl mt-0.5">help</span>
            <div>
              <p class="text-[11px] font-black text-indigo-900 dark:text-indigo-400 uppercase tracking-wider mb-1">Como eu pago a taxa?</p>
              <p class="text-xs text-indigo-700/80 dark:text-indigo-300 leading-snug">Você fecha a corrida e recebe <strong class="text-indigo-900 dark:text-indigo-200">100%</strong> do dinheiro do cliente na hora. A taxa de uso (<strong class="text-indigo-900 dark:text-indigo-200">15%</strong>) vira saldo devedor aqui na carteira. Assim, você só paga o app <b>depois</b> de Lucrar.<br/><br/>⚠️ Limite máximo: <strong class="text-red-500">-R$ 50,00</strong> (gera bloqueio de novos chamados).</p>
            </div>
          </div>

          <!-- MINHA CHAVE PIX -->
          <div class="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 rounded-xl p-4 mb-5">
            <div class="flex items-center gap-2 mb-3">
              <span class="material-symbols-outlined text-primary text-xl">pix</span>
              <h3 class="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Minha Chave Pix</h3>
            </div>
            <p class="text-[10px] text-slate-500 mb-3 leading-tight font-medium">Cadastre sua chave PIX para apresentá-la ao cliente na conclusão do serviço.</p>
            <div class="flex items-center gap-2">
              <input type="text" id="wallet-pix-input" placeholder="CPF, Email, Telefone..." value="${user.pixKey || ''}" class="flex-1 bg-white dark:bg-background-dark border border-slate-300 dark:border-white/20 rounded-lg px-3 py-2.5 text-sm text-black dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary transition-colors font-medium">
              <button id="btn-save-pix-wallet" class="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg px-4 py-2.5 text-xs font-black uppercase tracking-wider active:scale-95 transition-transform flex items-center justify-center min-w-[80px]">Salvar</button>
            </div>
          </div>

          <button id="btn-pay-pix" class="w-full ${isNeg ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900' : 'bg-primary text-black'} font-black py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 tracking-wide text-sm">
            ${isNeg ? 'QUITAR DÍVIDA / PAGAR' : 'ADICIONAR CRÉDITOS'} <span class="material-symbols-outlined text-base">qr_code_2</span>
          </button>
        </div>

            <div class="p-4">
              <div class="flex items-center justify-between mb-4 px-2">
                <h3 class="text-xs font-black text-slate-500 uppercase tracking-widest">Extrato Detalhado</h3>
                <span class="material-symbols-outlined text-slate-400 text-sm">history</span>
              </div>

              <div id="tx-list" class="space-y-3">
                ${transactions.length ? transactions.map(t => {
        const isFee = t.type === 'fee';
        const amt = (t.amount || 0).toFixed(2).replace('.', ',');
        const srvVal = t.orderValue ? `R$ ${t.orderValue.toFixed(2).replace('.', ',')}` : '';
        const date = new Date(t.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

        return `
        <div class="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col gap-2">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs font-bold text-slate-900 dark:text-white">${t.description}</p>
              <p class="text-[10px] text-slate-400 font-medium">${date}</p>
            </div>
            <p class="${isFee ? 'text-red-500' : 'text-green-500'} font-black text-sm">${isFee ? '' : '+'}${amt}</p>
          </div>
          ${isFee ? `<div class="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-2 mt-1">
            <p class="text-[9px] text-slate-400 uppercase font-bold">Valor Total Serv.</p>
            <p class="text-[9px] text-slate-600 dark:text-slate-300 font-bold">${srvVal}</p>
          </div>` : ''}
          <div class="flex items-center justify-between">
            <p class="text-[9px] text-slate-400 uppercase font-bold">Saldo Resultante</p>
            <p class="text-[9px] font-black text-slate-500">R$ ${t.balanceAfter.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>`;
      }).join('') : '<div class="py-12 text-center"><span class="material-symbols-outlined text-slate-200 text-5xl mb-2">payments</span><p class="text-slate-400 text-xs font-bold">Nenhuma transação registrada</p></div>'}
              </div>
            </div>`;

      const payBtn = d.querySelector('#btn-pay-pix');
      if (payBtn) payBtn.onclick = () => showPixModal(isNeg ? Math.abs(balance) : 0);

      const btnSavePix = d.querySelector('#btn-save-pix-wallet');
      const pixInput = d.querySelector('#wallet-pix-input');
      if (btnSavePix && pixInput) {
        btnSavePix.onclick = async () => {
          const val = pixInput.value.trim();
          btnSavePix.innerHTML = '<div class="size-4 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin"></div>';
          try {
            await api('/drivers/' + user.id, 'PUT', { pixKey: val });
            user.pixKey = val;
            saveUser(user);
            btnSavePix.innerHTML = '<span class="material-symbols-outlined text-sm">check</span>';
            setTimeout(() => btnSavePix.innerHTML = 'Salvar', 2000);
          } catch (err) {
            btnSavePix.innerHTML = 'ERRO';
            setTimeout(() => btnSavePix.innerHTML = 'Salvar', 2000);
          }
        };
      }

    } catch (e) {
      console.error('Wallet Error:', e);
      const msg = e.message || 'Erro de conexão';
      d.querySelector('#wallet-main').innerHTML = `
        <div class="p-20 text-center">
          <p class="text-red-500 text-sm font-black mb-4">${msg}</p>
          <button id="retry-wallet" class="px-6 py-2 bg-primary rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">Tentar Novamente</button>
        </div>`;
      const retryBtn = d.querySelector('#retry-wallet');
      if (retryBtn) retryBtn.onclick = updateWalletUI;
    }
  };

  const showPixModal = (amount) => {
    const m = document.createElement('div');
    m.className = 'fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300';
    const amountStr = amount.toFixed(2).replace('.', ',');
    m.innerHTML = `
            <div class="w-full max-w-sm bg-white dark:bg-background-dark rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl slide-in-from-bottom duration-500 animate-in relative overflow-hidden">
      <div class="absolute -right-10 -top-10 size-32 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="flex items-center justify-between mb-8">
        <h3 class="font-black text-slate-900 dark:text-white text-lg uppercase tracking-tight">Pagamento PIX</h3>
        <button id="close-modal-pix" class="size-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500"><span class="material-symbols-outlined text-sm">close</span></button>
      </div>

      <div class="flex flex-col items-center gap-4 mb-6">
        <div class="bg-white p-3 rounded-2xl shadow-inner border-4 border-slate-50 relative group">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126480014br.gov.bcb.pix0111123456789010203Movvi5204000053039865404${amount.toFixed(2)}5802BR5913MovviServices6009SaoPaulo62070503***6304CA1E" class="w-40 h-40 rounded" />
          <div class="absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
             <span class="material-symbols-outlined text-primary text-4xl animate-pulse">qr_code_scanner</span>
          </div>
        </div>
        
        <div class="w-full mt-4">
          <label class="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1.5 block">Valor da Recarga/Pagamento (R$)</label>
          <div class="relative">
            <input id="pix-amount" type="number" step="0.01" value="${(amount > 0 ? amount : 20).toFixed(2)}" class="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-lg font-black text-slate-900 dark:text-white outline-none focus:border-primary transition-colors text-center" />
          </div>
          ${amount > 0 ? `<p class="text-[10px] text-red-500 font-bold mt-2 text-center">* Sugestão Mínima para cobrir o saldo devedor.</p>` : ''}
        </div>
      </div>

      <div class="space-y-3">
        <button id="btn-copy-pix" class="w-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 text-sm active:scale-95 transition-all">Copiar Chave PIX <span class="material-symbols-outlined text-sm">content_copy</span></button>
        <button id="btn-confirm-pay" class="w-full bg-primary text-black font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all text-sm uppercase tracking-widest">Já Realizei o Pagamento</button>
      </div>
      
      <p class="text-[9px] text-center text-slate-400 mt-6 px-4">O saldo será atualizado automaticamente após a confirmação do pagamento pela nossa central.</p>
    </div>`;

    document.body.appendChild(m);

    const close = () => { m.classList.remove('animate-in'); m.classList.add('animate-out', 'fade-out', 'duration-300'); m.querySelector('div').classList.add('slide-out-to-bottom'); setTimeout(() => m.remove(), 300); };
    m.querySelector('#close-modal-pix').onclick = close;

    const confirmBtn = m.querySelector('#btn-confirm-pay');
    if (confirmBtn) confirmBtn.onclick = async () => {
      confirmBtn.innerHTML = '<span class="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span> CONFIRMANDO...';
      confirmBtn.disabled = true;

      const inputVal = parseFloat(m.querySelector('#pix-amount').value);
      if (isNaN(inputVal) || inputVal <= 0) {
        alert('Por favor, informe um valor válido maior que zero.');
        confirmBtn.innerHTML = 'Já Realizei o Pagamento';
        confirmBtn.disabled = false;
        return;
      }

      try {
        await api('/drivers/' + user.id + '/pay', { method: 'POST', body: JSON.stringify({ amount: inputVal }) });
        const uRes = await api('/drivers/' + user.id);
        Object.assign(user, uRes);
        saveUser(user);
        close();
        updateWalletUI();
        alert('✅ Pagamento Confirmado!\nSeu saldo foi zerado e sua conta está regularizada.');
      } catch (err) {
        alert('Erro ao confirmar pagamento: ' + err.message);
        confirmBtn.innerHTML = 'Já Realizei o Pagamento';
        confirmBtn.disabled = false;
      }
    };
  };

  updateWalletUI();
  return d;
}

// ═══ HISTORY ═══
function historyView() {
  const d = document.createElement('div'); d.className = 'view active bg-background-light dark:bg-background-dark';
  d.innerHTML = `
<header class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10">
  <button id="btn-menu" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-black font-bold dark:text-slate-200"><span class="material-symbols-outlined">menu</span></button>
  <h2 class="font-bold text-black font-bold dark:text-white">Histórico</h2><div class="size-10"></div>
</header>
            <main class="flex-1 overflow-y-auto p-4"><div id="hl"><p class="text-slate-500 text-sm text-center py-8">Carregando...</p></div></main>`;
  d.querySelector('#btn-menu').onclick = openSidebar;
  (async () => {
    try {
      const o = await Orders.list({ driverId: user.id }); const el = d.querySelector('#hl'); if (!o.length) { el.innerHTML = '<p class="text-slate-500 text-sm text-center py-8">Nenhuma corrida</p>'; return; }
      el.innerHTML = o.map(i => `<div class="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-3"><div class="size-12 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400"><span class="material-symbols-outlined">minor_crash</span></div><div class="flex-1"><h4 class="font-semibold text-sm text-black font-bold dark:text-white">${i.serviceName}</h4><p class="text-xs text-slate-500">${i.pickupAddress || 'Local'}</p></div><div class="text-right"><p class="text-xs font-bold ${i.status === 'completed' ? 'text-green-500' : i.status === 'cancelled' ? 'text-red-500' : 'text-primary'}">${i.status}</p></div></div>`).join('');
    } catch { }
  })();
  return d;
}

// ═══ PROFILE ═══
// ═══ PROFILE ═══
function profileView() {
  const d = document.createElement('div'); d.className = 'view active bg-background-light dark:bg-background-dark';
  const rawNm = user.name || '';
  const nm = rawNm.replace(/\uFFFD/g, 'ã').replace(/Joo/i, 'João').replace(/Jo.?o/i, 'João');
  const userPhoto = user.photo || '';

  d.innerHTML = `
<header class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10 transition-all">
  <button id="btn-menu" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-black font-bold dark:text-slate-200"><span class="material-symbols-outlined">menu</span></button>
  <h2 class="font-bold text-black font-bold dark:text-white">Perfil</h2><div class="size-10"></div>
</header>
            <main class="flex-1 p-5 overflow-y-auto">
              <div class="flex flex-col items-center gap-4 mb-8 mt-4 relative">
                <div class="relative group cursor-pointer z-10" id="photo-container">
                  <div class="size-28 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-background-dark shadow-xl flex items-center justify-center text-slate-400 overflow-hidden relative">
                    ${userPhoto ? `<img src="${userPhoto}" class="w-full h-full object-cover" id="p-img" />` : `<span class="material-symbols-outlined text-[3rem]" id="p-icon">person</span>`}
                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span class="material-symbols-outlined text-white">photo_camera</span>
                    </div>
                  </div>
                  <div class="absolute bottom-0 right-0 size-8 bg-primary rounded-full border-2 border-white dark:border-background-dark flex items-center justify-center text-black shadow-lg">
                    <span class="material-symbols-outlined text-sm">edit</span>
                  </div>
                  <input type="file" id="f-input" accept="image/*" class="hidden" />
                </div>
              </div>

              <div class="flex flex-col gap-4">
                <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 relative group">
                  <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Nome Completo</p>
                  <div class="flex items-center justify-between">
                    <input type="text" id="i-name" class="bg-transparent text-black font-bold dark:text-white font-medium text-lg w-full outline-none" value="${nm}" readonly />
                    <button id="b-edit-name" class="text-primary p-2 -mr-2"><span class="material-symbols-outlined text-sm">edit</span></button>
                  </div>
                </div>
                <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4">
                  <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Email</p>
                  <p class="text-black font-bold dark:text-white font-medium text-base">${user.email || 'N/A'}</p>
                </div>
                <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4">
                  <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Telefone</p>
                  <p class="text-black font-bold dark:text-white font-medium text-base">${user.phone || 'N/A'}</p>
                </div>
                <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 relative group">
                  <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Chave PIX (Para Recebimentos)</p>
                  <div class="flex items-center justify-between">
                    <input type="text" id="i-pix" class="bg-transparent text-black font-bold dark:text-white font-medium text-base w-full outline-none placeholder-slate-400" placeholder="Sua chave PIX" value="${user.pixKey || ''}" readonly />
                    <button id="b-edit-pix" class="text-primary p-2 -mr-2"><span class="material-symbols-outlined text-sm">edit</span></button>
                  </div>
                </div>
                <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4">
                  <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Veículo Reservado</p>
                  <p class="text-black font-bold dark:text-white font-medium text-base">${user.vehicle || 'N/A'} - ${user.plate || 'N/A'}</p>
                </div>
              </div>

              <button id="btn-save" class="w-full bg-primary text-black font-bold py-3.5 rounded-xl shadow-lg mt-8 hidden active:scale-[0.98] transition-all">Salvar Alterações</button>
            </main>`;

  d.querySelector('#btn-menu').onclick = openSidebar;

  const fInput = d.querySelector('#f-input');
  const btnSave = d.querySelector('#btn-save');
  const iName = d.querySelector('#i-name');
  const bEditName = d.querySelector('#b-edit-name');
  const iPix = d.querySelector('#i-pix');
  const bEditPix = d.querySelector('#b-edit-pix');
  let newPhoto = null;

  d.querySelector('#photo-container').onclick = () => fInput.click();

  fInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newPhoto = ev.target.result;
        const c = d.querySelector('.size-28');
        c.innerHTML = `<img src="${newPhoto}" class="w-full h-full object-cover relative z-0" />
                       <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"><span class="material-symbols-outlined text-white">photo_camera</span></div>`;
        btnSave.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    }
  };

  bEditName.onclick = () => {
    iName.removeAttribute('readonly');
    iName.focus();
    iName.classList.add('border-b', 'border-primary', 'pb-1');
    btnSave.classList.remove('hidden');
  };

  bEditPix.onclick = () => {
    iPix.removeAttribute('readonly');
    iPix.focus();
    iPix.classList.add('border-b', 'border-primary', 'pb-1');
    btnSave.classList.remove('hidden');
  };

  btnSave.onclick = async () => {
    const fn = iName.value.trim();
    if (fn) user.name = fn;
    const pK = iPix.value.trim();
    user.pixKey = pK; // allowed to be empty
    if (newPhoto) user.photo = newPhoto;
    saveUser(user);

    // Update server quietly
    try {
      await fetch('/api/drivers/' + user.id, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name, photo: user.photo, pixKey: user.pixKey })
      });
    } catch { }

    btnSave.textContent = 'Salvo!';
    btnSave.classList.remove('bg-primary');
    btnSave.classList.add('bg-green-500', 'text-white');
    setTimeout(() => {
      btnSave.classList.add('hidden');
      btnSave.textContent = 'Salvar Alterações';
      btnSave.classList.add('bg-primary');
      btnSave.classList.remove('bg-green-500', 'text-white');
      iName.setAttribute('readonly', 'true');
      iName.classList.remove('border-b', 'border-primary', 'pb-1');
      iPix.setAttribute('readonly', 'true');
      iPix.classList.remove('border-b', 'border-primary', 'pb-1');
      buildSidebar(); // refresh sidebar 
    }, 1500);
  };

  return d;
}

// ═══ SUPPORT CHAT ═══
function supportChatView() {
  const d = document.createElement('div'); d.className = 'view active bg-background-light dark:bg-background-dark';
  d.innerHTML = `
    <header class="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10">
      <button id="bk" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center"><span class="material-symbols-outlined text-black font-bold dark:text-slate-200">arrow_back</span></button>
      <div class="flex-1"><h1 class="text-base font-bold text-black font-bold dark:text-white">Suporte Movvi</h1><p class="text-[10px] text-slate-500">Chat com a plataforma</p></div>
      <div class="size-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center"><span class="material-symbols-outlined text-primary">support_agent</span></div>
    </header>
    <div id="chat-msgs" class="flex-1 overflow-y-auto p-4 space-y-3" style="max-height:calc(100dvh - 140px)"></div>
    <form id="chat-form" class="p-3 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-background-dark sticky bottom-0">
      <div class="flex gap-2 items-center">
        <button type="button" id="btn-attach" class="size-11 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200 dark:border-white/10 active:scale-95 transition-all"><span class="material-symbols-outlined">attach_file</span></button>
        <input type="file" id="chat-file-input" class="hidden" accept="image/*,.pdf" />
        <input id="chat-input" class="form-input flex-1 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-4 text-sm" placeholder="Digite sua mensagem..." autocomplete="off"/>
        <button type="submit" class="size-11 bg-primary rounded-xl flex items-center justify-center text-black font-bold shadow-md hover:bg-primary/90 active:scale-95 transition-all"><span class="material-symbols-outlined text-lg">send</span></button>
      </div>
    </form>`;

  d.querySelector('#bk').onclick = () => nav(dashboardView);

  const msgsEl = d.querySelector('#chat-msgs');
  const fileInput = d.querySelector('#chat-file-input');
  const btnAttach = d.querySelector('#btn-attach');

  btnAttach.onclick = () => fileInput.click();

  function renderMsg(m) {
    const mine = m.from === 'driver';
    const time = new Date(m.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.className = `flex ${mine ? 'justify-end' : 'justify-start'} `;

    let content = '';
    if (m.file) {
      if (m.file.startsWith('data:image')) {
        content = `<img src="${m.file}" class="max-w-full rounded-lg mb-1 border border-black/10 cursor-pointer" onclick="window.open('${m.file}')" />`;
      } else {
        content = `<div class="flex items-center gap-2 p-2 bg-black/5 rounded-lg mb-1"><span class="material-symbols-outlined">description</span><a href="${m.file}" target="_blank" class="text-xs underline">Documento</a></div>`;
      }
    }
    if (m.message) {
      content += `<p class="text-sm">${m.message}</p>`;
    }

    div.innerHTML = `<div class="max-w-[80%] px-4 py-2.5 rounded-2xl ${mine ? 'bg-primary text-black font-bold rounded-br-md shadow-sm' : 'bg-slate-100 dark:bg-white/10 text-black font-bold dark:text-white rounded-bl-md shadow-sm'}">${content} <p class="text-[9px] mt-1 ${mine ? 'text-black/60' : 'text-slate-400'} text-right">${time}</p></div>`;
    msgsEl.appendChild(div);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  // Load history
  socket.emit('chat:get-history', { driverId: user.id });
  socket.once('chat:history', ({ messages }) => {
    msgsEl.innerHTML = '';
    messages.forEach(renderMsg);
  });

  // Listen for incoming messages
  const onMsg = (msg) => { if (msg.driverId === user.id && msg.from === 'admin') renderMsg(msg); };
  socket.on('chat:new-message', onMsg);

  // Send message function
  const send = async (txt, file = null) => {
    socket.emit('chat:driver-to-admin', { driverId: user.id, driverName: user.name, message: txt, file });
    renderMsg({ from: 'driver', message: txt, file, timestamp: new Date().toISOString() });
  };

  // Text send
  d.querySelector('#chat-form').onsubmit = (e) => {
    e.preventDefault();
    const inp = d.querySelector('#chat-input');
    const txt = inp.value.trim();
    if (!txt) return;
    send(txt);
    inp.value = '';
  };

  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      send('', reader.result);
      fileInput.value = '';
    };
    reader.readAsDataURL(file);
  };

  return d;
}

// ═══ CLIENT CHAT (Driver -> Client) ═══
function clientChatView(data) {
  const d = document.createElement('div'); d.className = 'view active bg-background-light dark:bg-background-dark';
  const oId = data.orderId || data.id;
  d.innerHTML = `
            <div class="flex flex-col" style="height:100dvh">
<header class="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-white/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10">
  <button id="bk" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center"><span class="material-symbols-outlined text-black dark:text-slate-200">arrow_back</span></button>
  <div class="flex-1 min-w-0">
    <h1 class="text-base font-bold text-black dark:text-white truncate">${data.clientName || 'Cliente'}</h1>
    <p class="text-[10px] text-slate-500">Chat do Pedido</p>
  </div>
  <a href="tel:${data.clientPhone || ''}" class="size-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center"><span class="material-symbols-outlined text-primary">call</span></a>
</header>
<div id="chat-msgs" class="flex-1 overflow-y-auto p-4 space-y-3"></div>
<form id="chat-form" class="p-3 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-background-dark">
  <div class="flex gap-2 items-center">
    <button type="button" id="btn-audio" class="size-11 bg-slate-100 dark:bg-white/10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:text-red-500 active:scale-95 shrink-0"><span class="material-symbols-outlined text-lg">mic</span></button>
    <input id="chat-input" class="form-input flex-1 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black dark:text-white py-3 px-4 text-sm" placeholder="Digite sua mensagem..." autocomplete="off"/>
    <button type="submit" class="size-11 bg-primary rounded-xl flex items-center justify-center text-black shadow-md hover:bg-primary/90 active:scale-95 shrink-0"><span class="material-symbols-outlined text-lg">send</span></button>
  </div>
  <div id="recording-status" class="hidden mt-2 flex items-center gap-2 text-red-500 text-xs font-semibold"><span class="material-symbols-outlined text-sm animate-pulse">radio_button_checked</span><span>Gravando...</span><button type="button" id="btn-stop" class="ml-auto px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-bold">Enviar</button><button type="button" id="btn-cancel-audio" class="px-3 py-1 bg-slate-300 dark:bg-white/10 text-black dark:text-white rounded-lg text-xs font-bold">Cancelar</button></div>
</form>
</div>`;

  d.querySelector('#bk').onclick = () => nav(activeJobView, data);

  const msgsEl = d.querySelector('#chat-msgs');

  function renderMsg(m) {
    const mine = m.from === 'driver';
    const time = new Date(m.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.className = `flex ${mine ? 'justify-end' : 'justify-start'} `;
    let content;
    if (m.type === 'audio' && m.audioData) {
      content = `<audio controls src="${m.audioData}" style="max-width:220px;height:40px"></audio>`;
    } else {
      content = `<p class="text-sm">${m.message}</p>`;
    }
    div.innerHTML = `<div class="max-w-[80%] px-4 py-2.5 rounded-2xl ${mine ? 'bg-primary text-black rounded-br-md' : 'bg-slate-100 dark:bg-white/10 text-black dark:text-white rounded-bl-md'}">${content} <p class="text-[9px] mt-1 ${mine ? 'text-black/60' : 'text-slate-400'} text-right">${time}</p></div>`;
    msgsEl.appendChild(div);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  socket.emit('order-chat:get-history', { orderId: oId });
  socket.once('order-chat:history', ({ messages }) => { if (messages) messages.forEach(renderMsg); });

  const onMsg = (msg) => { if (msg.orderId === oId) renderMsg(msg); };
  socket.on('order-chat:new-message', onMsg);

  // Text send
  d.querySelector('#chat-form').onsubmit = (e) => {
    e.preventDefault();
    const inp = d.querySelector('#chat-input');
    const txt = inp.value.trim();
    if (!txt) return;
    socket.emit('order-chat:driver-to-client', { orderId: oId, clientId: data.clientId, driverId: user.id, message: txt, type: 'text' });
    renderMsg({ from: 'driver', message: txt, type: 'text', timestamp: new Date().toISOString() });
    inp.value = '';
  };

  // Audio recording
  let mediaRecorder = null, audioChunks = [];
  const btnAudio = d.querySelector('#btn-audio');
  const recStatus = d.querySelector('#recording-status');
  const btnStop = d.querySelector('#btn-stop');
  const btnCancelAudio = d.querySelector('#btn-cancel-audio');

  btnAudio.onclick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunks.push(e.data); };
      mediaRecorder.onstop = () => { stream.getTracks().forEach(t => t.stop()); };
      mediaRecorder.start();
      recStatus.classList.remove('hidden');
      btnAudio.classList.add('hidden');
    } catch (err) { alert('Não foi possível acessar o microfone.'); }
  };

  btnStop.onclick = () => {
    if (!mediaRecorder || mediaRecorder.state !== 'recording') return;
    mediaRecorder.onstop = () => {
      mediaRecorder.stream.getTracks().forEach(t => t.stop());
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onloadend = () => {
        const audioData = reader.result;
        socket.emit('order-chat:driver-to-client', { orderId: oId, clientId: data.clientId, driverId: user.id, type: 'audio', audioData });
        renderMsg({ from: 'driver', type: 'audio', audioData, timestamp: new Date().toISOString() });
      };
      reader.readAsDataURL(blob);
      recStatus.classList.add('hidden');
      btnAudio.classList.remove('hidden');
    };
    mediaRecorder.stop();
  };

  btnCancelAudio.onclick = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.onstop = () => { mediaRecorder.stream.getTracks().forEach(t => t.stop()); };
      mediaRecorder.stop();
    }
    audioChunks = [];
    recStatus.classList.add('hidden');
    btnAudio.classList.remove('hidden');
  };

  return d;
}

function startApp() {
  appContent = document.getElementById('app-content');
  sidebar = document.getElementById('sidebar');
  sidebarOverlay = document.getElementById('sidebar-overlay');

  if (!appContent || !sidebarOverlay) {
    console.error('CRITICAL: DOM elements not found.');
    return;
  }

  sidebarOverlay.onclick = closeSidebar;

  const saved = loadUser();
  if (saved) {
    user = saved;
    connectSocket();
    buildSidebar();
    (!user.approved && user.onboardingStep !== 'approved') ? nav(onboardingView) : nav(dashboardView);
  } else {
    nav(loginView);
  }
}

// ─── STARTUP ───
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}

// ═══ VOIP (WEB RTC) ═══
let peerConn = null, localStream = null;

function startCall(targetId, targetName, targetPhoto) {
  unlockAudio();
  nav(voiceCallView, { targetId, targetName, targetPhoto, incoming: false });
}

function voiceCallView(data) {
  const d = document.createElement('div'); d.className = 'view active bg-slate-900 text-white';
  d.innerHTML = `
            <div class="flex flex-col h-full items-center justify-between p-10 bg-gradient-to-b from-slate-800 to-black">
  <div class="text-center mt-10">
    <div class="size-32 rounded-full overflow-hidden border-4 border-emerald-500 shadow-2xl mb-6 mx-auto">
      ${data.targetPhoto ? `<img src="${data.targetPhoto}" class="w-full h-full object-cover">` : '<span class="material-symbols-outlined text-6xl mt-6">person</span>'}
    </div>
    <h2 class="text-2xl font-black mb-2">${data.targetName}</h2>
    <p id="call-status" class="text-emerald-400 font-bold uppercase tracking-widest text-xs animate-pulse">${data.incoming ? 'Chamada Recebida...' : 'Chamando...'}</p>
  </div>

  <div class="flex gap-8 mb-20 text-center">
    ${data.incoming ? `
      <button id="btn-accept" class="size-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg active:scale-95 transition-all"><span class="material-symbols-outlined text-3xl">call</span></button>
      <button id="btn-hangup" class="size-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg active:scale-95 transition-all"><span class="material-symbols-outlined text-3xl">call_end</span></button>
    ` : `
      <button id="btn-hangup" class="size-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg active:scale-95 transition-all"><span class="material-symbols-outlined text-3xl">call_end</span></button>
    `}
  </div>
  <audio id="remote-audio" autoplay class="hidden"></audio>
</div>`;

  const status = d.querySelector('#call-status');
  const remoteAudio = d.querySelector('#remote-audio');

  const cleanup = () => {
    callAudio.pause(); callAudio.currentTime = 0;
    if (localStream) localStream.getTracks().forEach(t => t.stop());
    if (peerConn) peerConn.close();
    peerConn = null; localStream = null;
  };

  const setupRTC = async () => {
    peerConn = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    peerConn.onicecandidate = (e) => { if (e.candidate) socket.emit('call:signal', { targetId: data.targetId, signal: { ice: e.candidate } }); };
    peerConn.ontrack = (e) => { remoteAudio.srcObject = e.streams[0]; status.textContent = 'Em Chamada'; status.classList.remove('animate-pulse'); };

    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStream.getTracks().forEach(t => peerConn.addTrack(t, localStream));

    if (!data.incoming) {
      const offer = await peerConn.createOffer();
      await peerConn.setLocalDescription(offer);
      socket.emit('call:request', { targetId: data.targetId, userId: user.id, callerName: user.name, callerPhoto: user.photo });
      socket.emit('call:signal', { targetId: data.targetId, signal: { sdp: offer } });
    }
  };

  if (data.incoming) {
    callAudio.play();
    d.querySelector('#btn-accept').onclick = async () => {
      callAudio.pause(); callAudio.currentTime = 0;
      await setupRTC();
      socket.emit('call:accept', { targetId: data.targetId });
    };
  }

  d.querySelector('#btn-hangup').onclick = () => {
    socket.emit('call:end', { targetId: data.targetId });
    cleanup();
    nav(dashboardView);
  };

  socket.off('call:signal').on('call:signal', async ({ signal }) => {
    if (!peerConn) await setupRTC();
    if (signal.sdp) {
      await peerConn.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      if (signal.sdp.type === 'offer') {
        const answer = await peerConn.createAnswer();
        await peerConn.setLocalDescription(answer);
        socket.emit('call:signal', { targetId: data.targetId, signal: { sdp: answer } });
      }
    } else if (signal.ice) {
      await peerConn.addIceCandidate(new RTCIceCandidate(signal.ice));
    }
  });

  socket.off('call:accepted').on('call:accepted', () => { status.textContent = 'Em Chamada'; status.classList.remove('animate-pulse'); });
  socket.off('call:rejected').on('call:rejected', () => { cleanup(); nav(dashboardView); });
  socket.off('call:ended').on('call:ended', () => { cleanup(); nav(dashboardView); });

  if (!data.incoming) setupRTC();

  return d;
}

// Add global listener for incoming calls
function listenCalls() {
  socket.on('call:incoming', (callData) => {
    unlockAudio();
    nav(voiceCallView, { targetId: callData.fromId, targetName: callData.callerName, targetPhoto: callData.callerPhoto, incoming: true });
  });
}
// update connectSocket to call listenCalls()
const oldConnect = connectSocket;
connectSocket = () => { oldConnect(); listenCalls(); };
