import { Auth, Orders, Pricing } from '../shared/api.js';
import { initGeo, getCurrentPosition } from '../shared/geo.js';

console.log('[DEBUG] main.js loaded');

let appContent, sidebar, sidebarOverlay;
let socket, user, currentOrder, map, driverMarker, geoWatchId;

const callAudio = new Audio('https://www.myinstants.com/media/sounds/incoming-call-sound.mp3');
callAudio.loop = true;
callAudio.volume = 1.0;

function unlockAudio() {
  callAudio.play().then(() => { callAudio.pause(); callAudio.currentTime = 0; });
}

function saveUser(u) { user = u; localStorage.setItem('movvi_client', JSON.stringify(u)); }
function loadUser() { try { return JSON.parse(localStorage.getItem('movvi_client')); } catch { return null; } }
function nav(fn, d) { closeSidebar(); appContent.innerHTML = ''; const el = fn(d); appContent.appendChild(el); el.classList.add('fade-in'); }
function isDark() { return document.documentElement.classList.contains('dark'); }
function tileUrl() { return 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'; }
var clientTheme = localStorage.getItem('movvi_client_theme') || 'light';
function setClientTheme(mode) {
  clientTheme = mode;
  if (mode === 'light') { document.documentElement.classList.remove('dark'); localStorage.setItem('movvi_client_theme', 'light'); }
  else if (mode === 'dark') { document.documentElement.classList.add('dark'); localStorage.setItem('movvi_client_theme', 'dark'); }
  else { localStorage.removeItem('movvi_client_theme'); }
  buildSidebar();
}

// ═══ SIDEBAR ═══
function buildSidebar() {
  let nm = user?.name?.split(' ')[0] || 'Cliente';
  nm = nm.replace(/\uFFFD/g, 'ã').replace(/Joo/i, 'João').replace(/Jo.?o/i, 'João'); // Fix encoding de localstorage antigo

  const isDk = isDark();
  const userPhoto = user.photo || '';
  sidebar.innerHTML = `<div class="px-5 pt-12 pb-6 flex items-center justify-between border-b border-slate-200 dark:border-white/10"><div class="flex items-center gap-3"><div class="size-11 overflow-hidden rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center text-primary shadow-sm">${userPhoto ? `<img src="${userPhoto}" class="w-full h-full object-cover">` : '<span class="material-symbols-outlined">person</span>'}</div><div><p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest mb-0.5">Ola, ${nm}</p><h1 class="text-base font-black text-black dark:text-white leading-tight">Movvi Resgate</h1></div></div><button class="sidebar-close size-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-primary transition-colors"><span class="material-symbols-outlined text-base">close</span></button></div><nav class="flex-1 overflow-y-auto pt-4 px-3"><a data-nav="home" class="flex items-center gap-3 px-3 py-3 rounded-xl text-black font-bold dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary cursor-pointer transition-colors group"><span class="material-symbols-outlined text-slate-400 group-hover:text-primary" style="font-variation-settings:\'FILL\' 1">home</span><span class="text-sm font-bold">Inicio</span></a><a data-nav="history" class="flex items-center gap-3 px-3 py-3 rounded-xl text-black font-bold dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary cursor-pointer transition-colors group"><span class="material-symbols-outlined text-slate-400 group-hover:text-primary">history</span><span class="text-sm font-bold">Historico</span></a><a data-nav="profile" class="flex items-center gap-3 px-3 py-3 rounded-xl text-black font-bold dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary cursor-pointer transition-colors group"><span class="material-symbols-outlined text-slate-400 group-hover:text-primary">person</span><span class="text-sm font-bold">Perfil</span></a><div class="mt-4 px-3 py-3"><p class="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-widest">Aparencia</p><div class="flex gap-1 bg-slate-100 dark:bg-white/10 rounded-xl p-1"><button data-theme="light" class="flex-1 text-[10px] py-1.5 rounded-lg font-bold transition-all ${clientTheme === 'light' ? 'bg-white dark:bg-white/20 text-primary shadow-sm' : 'text-slate-500'}">CLARO</button><button data-theme="dark" class="flex-1 text-[10px] py-1.5 rounded-lg font-bold transition-all ${clientTheme === 'dark' ? 'bg-white dark:bg-white/20 text-primary shadow-sm' : 'text-slate-500'}">ESCURO</button><button data-theme="auto" class="flex-1 text-[10px] py-1.5 rounded-lg font-bold transition-all ${clientTheme === 'auto' ? 'bg-white dark:bg-white/20 text-primary shadow-sm' : 'text-slate-500'}">AUTO</button></div></div></nav><div class="px-5 pb-8 pt-4 border-t border-slate-200 dark:border-white/10"><a data-nav="logout" class="flex items-center gap-3 text-red-500 hover:text-red-400 cursor-pointer font-bold text-sm"><span class="material-symbols-outlined text-base">logout</span>Sair da Conta</a></div>`;
  sidebar.querySelectorAll('[data-nav]').forEach(a => {
    a.onclick = () => {
      const t = a.dataset.nav;
      if (t === 'home') nav(homeView);
      else if (t === 'history') nav(historyView);
      else if (t === 'profile') nav(profileView);
      else if (t === 'logout') { localStorage.removeItem('movvi_client'); socket?.disconnect(); nav(loginView); }
    };
  });
  sidebar.querySelectorAll('[data-theme]').forEach(btn => {
    btn.onclick = () => setClientTheme(btn.dataset.theme);
  });
  sidebar.querySelector('.sidebar-close').onclick = closeSidebar;
}

function openSidebar() { sidebar.classList.add('open'); sidebarOverlay.classList.add('open'); }
function closeSidebar() { sidebar.classList.remove('open'); sidebarOverlay.classList.remove('open'); }

function connectSocket() {
  socket = io();
  socket.on('connect', () => {
    if (!user) return;
    socket.emit('register:client', user.id);
  });
  socket.on('order:searching', ({ message }) => {
    const el = document.getElementById('search-status'); if (el) el.textContent = message;
  });
  socket.on('order:accepted', (d) => {
    // Server now sends the full order object
    currentOrder = { ...currentOrder, ...d, orderId: d.id || d.orderId, status: 'accepted' };
    nav(trackingView, currentOrder);
  });
  socket.on('order:status', ({ orderId, status }) => {
    if (currentOrder && (currentOrder.id === orderId || currentOrder.orderId === orderId)) {
      currentOrder.status = status;
      if (status === 'completed') { const tmp = currentOrder; currentOrder = null; nav(ratingView, tmp); }
      if (status === 'arrived') {
        const etaText = document.getElementById('eta-text');
        if (etaText) etaText.innerHTML = '<span class="text-emerald-500 font-black animate-pulse">Motorista Chegou!</span>';
        const distTxt = document.getElementById('dist-text');
        if (distTxt) distTxt.textContent = '0 km';
      }
      if (status === 'in_progress') {
        const etaText = document.getElementById('eta-text');
        if (etaText) etaText.innerHTML = '<span class="text-primary font-black">Em Trânsito</span>';
      }
    }
  });
  socket.on('order-chat:new-message', (msg) => {
    const btnChat = document.getElementById('btn-chat');
    if (btnChat && !document.getElementById('chat-msgs')) {
      // Pulse animation and red outline to catch attention clearly
      btnChat.classList.add('animate-pulse', 'border-red-500', 'bg-red-50');
      // Adding a notification dot
      if (!document.getElementById('chat-dot')) {
        btnChat.insertAdjacentHTML('beforeend', '<div id="chat-dot" class="absolute -top-1 -right-1 size-4 bg-red-500 rounded-full border-2 border-white dark:border-background-dark animate-pulse shadow-md"></div>');
      }
    }
  });
  socket.on('driver:location', ({ latitude, longitude }) => { if (driverMarker) driverMarker.setLatLng([latitude, longitude]); if (map) map.panTo([latitude, longitude]); });
  if (!geoWatchId) {
    geoWatchId = initGeo(({ latitude, longitude }) => { socket.emit('client:location', { clientId: user.id, latitude, longitude }); });
  }
}

// ═══ LOGIN ═══
function loginView() {
  const d = document.createElement('div'); d.className = 'view active';
  d.style.background = '#FFD900';
  d.innerHTML = `
<div class="flex flex-col relative overflow-hidden" style="min-height:100dvh;font-family:Outfit,Inter,sans-serif">
  <!-- Yellow brand hero top -->
  <div class="bg-[#FFD900] relative overflow-hidden px-6 pt-8 pb-8 flex flex-col items-center text-center" style="animation:fadeUpIn 0.5s ease-out forwards">
    <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(135deg,rgba(0,0,0,0.03) 0%,transparent 50%,rgba(255,255,255,0.06) 100%)"></div>
    <img src="/assets/images/logo_movvi.png" alt="Movvi Resgate" class="w-64 h-auto object-contain relative z-10 mb-1 drop-shadow-lg">
    <p class="text-[#1a1400]/50 text-[13px] font-semibold relative z-10">Seu parceiro de confiança na estrada.</p>
  </div>

  <!-- Form section -->
  <div class="flex-1 bg-[#fafaf7] dark:bg-[#1a1706] rounded-t-[32px] -mt-6 relative z-10 px-6 pt-10 pb-8 flex flex-col" style="animation:fadeUpIn 0.5s ease-out 0.1s forwards;opacity:0">
    <form id="lf" class="flex flex-col gap-5 w-full max-w-sm mx-auto flex-1">
      <div class="flex flex-col gap-1.5">
        <label class="text-[#1a1400] dark:text-white/70 text-[12px] font-bold uppercase tracking-[0.08em] pl-1">Email</label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-[#1a1400]/30 dark:text-white/25"><span class="material-symbols-outlined text-[18px]">mail</span></span>
          <input class="form-input w-full bg-white dark:bg-white/[0.06] border-2 border-[#e8e4d9] dark:border-white/10 text-[#1a1400] dark:text-white placeholder-[#1a1400]/25 dark:placeholder-white/20 pl-11 py-3.5 text-[15px] font-semibold rounded-2xl focus:border-primary focus:ring-0 outline-none transition-all" id="le" type="email" placeholder="exemplo@email.com"/>
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <div class="flex justify-between items-center">
          <label class="text-[#1a1400] dark:text-white/70 text-[12px] font-bold uppercase tracking-[0.08em] pl-1">Senha</label>
          <a id="forgot-pw" class="text-[12px] text-primary font-bold cursor-pointer hover:text-[#1a1400] dark:hover:text-white transition-colors pr-1">Esqueceu?</a>
        </div>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-[#1a1400]/30 dark:text-white/25"><span class="material-symbols-outlined text-[18px]">lock</span></span>
          <input class="form-input w-full bg-white dark:bg-white/[0.06] border-2 border-[#e8e4d9] dark:border-white/10 text-[#1a1400] dark:text-white placeholder-[#1a1400]/25 dark:placeholder-white/20 pl-11 py-3.5 text-[15px] font-semibold rounded-2xl focus:border-primary focus:ring-0 outline-none transition-all" id="lp" type="password" placeholder="••••••"/>
        </div>
      </div>
      <div id="le-err" class="text-red-500 text-xs font-bold hidden"></div>
      <button type="submit" class="w-full bg-[#1a1400] dark:bg-primary text-white dark:text-[#1a1400] font-black py-4 text-[14px] uppercase tracking-[0.08em] rounded-2xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2">
        <span>Entrar</span>
        <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
      </button>
    </form>

    <div class="text-center mt-8" style="animation:fadeUpIn 0.5s ease-out 0.25s forwards;opacity:0">
      <p class="text-[#1a1400]/40 dark:text-white/30 text-[14px] font-semibold">Não tem conta? <a id="go-reg" class="text-primary font-bold cursor-pointer hover:text-[#1a1400] dark:hover:text-white transition-colors">Criar conta</a></p>
    </div>
  </div>
</div>
<style>
  @keyframes fadeUpIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
</style>`;

  d.querySelector('#lf').onsubmit = async (e) => {
    e.preventDefault();
    try { const { user: u } = await Auth.loginClient(d.querySelector('#le').value, d.querySelector('#lp').value); saveUser(u); initApp(); }
    catch (err) { const el = d.querySelector('#le-err'); el.textContent = err.message; el.classList.remove('hidden'); }
  };
  d.querySelector('#go-reg').onclick = () => nav(registerView);
  d.querySelector('#forgot-pw').onclick = async () => {
    const email = window.prompt("Para redefinir sua senha, informe seu email:");
    if (email) {
      try {
        await Auth.forgotPasswordClient(email);
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
  const d = document.createElement('div'); d.className = 'view active bg-slate-50 dark:bg-slate-900';
  d.innerHTML = '<header class="flex items-center p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md z-10"><button id="bk" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center"><span class="material-symbols-outlined text-black font-bold dark:text-slate-200">arrow_back</span></button><h1 class="flex-1 text-center text-black font-bold dark:text-white text-base font-bold">Criar Conta</h1><div class="size-10"></div></header><main class="flex-1 p-5 pb-24"><form id="rf" class="flex flex-col gap-4 bg-white dark:bg-white/5 p-6 rounded-xl border border-slate-200 dark:border-white/10"><div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">Nome Completo</label><input id="rn" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3" required/></div><div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">E-mail</label><input id="re" type="email" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3" required/></div><div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">Telefone</label><input id="rph" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3"/></div><div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">Veiculo</label><input id="rv" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3" placeholder="Ex: Honda Civic 2022"/></div><div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">Senha</label><input id="rp" type="password" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3" required/></div><div id="re-err" class="text-red-500 text-xs font-medium hidden"></div><button type="submit" class="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3.5 rounded-lg shadow-md mt-2 active:scale-[0.98]">Criar conta</button></form></main>';
  d.querySelector('#bk').onclick = () => nav(loginView);
  d.querySelector('#rf').onsubmit = async (e) => {
    e.preventDefault();
    try { const u = await Auth.registerClient({ name: d.querySelector('#rn').value, email: d.querySelector('#re').value, phone: d.querySelector('#rph').value, vehicleModel: d.querySelector('#rv').value, password: d.querySelector('#rp').value }); saveUser(u); initApp(); }
    catch (err) { const el = d.querySelector('#re-err'); el.textContent = err.message; el.classList.remove('hidden'); }
  };
  return d;
}

// ═══ HOME ═══
function homeView() {
  const d = document.createElement('div'); d.className = 'view active bg-slate-50 dark:bg-slate-900';
  let nm = user.name?.split(' ')[0] || 'Cliente';
  nm = nm.replace(/\uFFFD/g, 'ã').replace(/Joo/i, 'João').replace(/Jo.?o/i, 'João'); // Fix encoding de localstorage antigo
  d.innerHTML = `
<header class="flex items-center justify-between px-5 py-4 sticky top-0 bg-slate-50/95 dark:bg-background-dark/95 backdrop-blur-md z-10">
  <div class="flex items-center gap-4">
    <div class="relative group cursor-pointer" id="header-profile-btn">
      <div class="size-14 overflow-hidden rounded-[18px] bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-[0_4px_15px_-3px_rgba(0,0,0,0.1)] border border-slate-200/50 dark:border-white/10 relative z-10">
        ${user.photo ? `<img src="${user.photo}" class="w-full h-full object-cover">` : '<span class="material-symbols-outlined text-3xl font-light">account_circle</span>'}
      </div>
      <div class="absolute -bottom-1 -right-1 size-5 bg-green-500 border-2 border-slate-50 dark:border-background-dark rounded-full z-20"></div>
    </div>
    <div class="flex flex-col justify-center">
      <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-0.5">Ola, ${nm}</p>
      <h1 class="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight">Movvi Resgate</h1>
    </div>
  </div>
  <button id="btn-menu" class="relative size-12 rounded-[16px] bg-white dark:bg-slate-800 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-200/50 dark:border-white/10 hover:-translate-y-0.5 active:translate-y-0 transition-transform flex items-center justify-center group">
    <span class="material-symbols-outlined text-slate-800 font-medium dark:text-slate-200 group-hover:text-primary transition-colors">notes</span>
  </button>
</header>
<main class="flex-1 overflow-y-auto px-5 py-2 pb-10">
  <div class="bg-primary rounded-[24px] p-5 mb-6 text-slate-900 shadow-lg relative overflow-hidden">
    <div class="absolute -right-4 -top-4 opacity-20"><span class="material-symbols-outlined" style="font-size:100px">verified_user</span></div>
    <h2 class="text-[22px] font-black mb-1 relative z-10 leading-tight">Precisando de <br>ajuda agora?</h2>
    <p class="text-xs font-semibold opacity-80 relative z-10 w-[85%]">Escolha o serviço abaixo e enviamos um resgate na hora.</p>
  </div>
  
  <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 px-1">Selecione o Serviço</p>
  <div class="grid grid-cols-2 gap-4">
    <button class="sv flex flex-col items-start gap-4 p-5 rounded-3xl bg-white dark:bg-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50 dark:border-white/5 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 group" data-type="reboque" data-name="Reboque no Cambão">
      <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 group-hover:bg-primary group-hover:text-black transition-colors shadow-inner">
        <span class="material-symbols-outlined text-3xl">minor_crash</span>
      </div>
      <div class="text-left mt-1">
        <h3 class="font-black text-slate-900 dark:text-white leading-tight mb-1 text-base">Reboque no<br>Cambão</h3>
        <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Barra Rígida</p>
      </div>
    </button>
    <button class="sv flex flex-col items-start gap-4 p-5 rounded-3xl bg-white dark:bg-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50 dark:border-white/5 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 group" data-type="pane_seca" data-name="Pane Seca">
      <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 group-hover:bg-primary group-hover:text-black transition-colors shadow-inner">
        <span class="material-symbols-outlined text-3xl">local_gas_station</span>
      </div>
      <div class="text-left mt-1">
        <h3 class="font-black text-slate-900 dark:text-white leading-tight mb-1 text-base">Pane <br>Seca</h3>
        <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Combustível</p>
      </div>
    </button>
    <button class="sv flex flex-col items-start gap-4 p-5 rounded-3xl bg-white dark:bg-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50 dark:border-white/5 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 group" data-type="chupeta" data-name="Chupeta">
      <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 group-hover:bg-primary group-hover:text-black transition-colors shadow-inner">
        <span class="material-symbols-outlined text-3xl">battery_charging_full</span>
      </div>
      <div class="text-left mt-1">
        <h3 class="font-black text-slate-900 dark:text-white leading-tight mb-1 text-base">Carga de <br>Bateria</h3>
        <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Partida Auxiliar</p>
      </div>
    </button>
    <button class="sv flex flex-col items-start gap-4 p-5 rounded-3xl bg-white dark:bg-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50 dark:border-white/5 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 group" data-type="pneu" data-name="Troca de Pneu">
      <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 group-hover:bg-primary group-hover:text-black transition-colors shadow-inner">
        <span class="material-symbols-outlined text-3xl">tire_repair</span>
      </div>
      <div class="text-left mt-1">
        <h3 class="font-black text-slate-900 dark:text-white leading-tight mb-1 text-base">Troca de <br>Pneu</h3>
        <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Furado ou Murcho</p>
      </div>
    </button>
  </div>
</main>`;
  d.querySelector('#btn-menu').onclick = openSidebar;
  d.querySelectorAll('.sv').forEach(c => {
    c.onclick = () => {
      if (currentOrder && ['searching', 'accepted', 'assigned', 'arrived', 'in_progress', 'pickup'].includes(currentOrder.status)) {
        if (currentOrder.status === 'searching') nav(searchingView, currentOrder);
        else nav(trackingView, currentOrder);
        return;
      }
      if (c.dataset.type === 'reboque') {
        nav(reboqueQuestionsView, { type: c.dataset.type, name: c.dataset.name });
      } else {
        nav(serviceDetailView, { type: c.dataset.type, name: c.dataset.name });
      }
    };
  });

  return d;
}

// ═══ REBOQUE QUESTIONS (CAMBÃO) ═══
function reboqueQuestionsView({ type, name }) {
  const d = document.createElement('div'); d.className = 'view active bg-slate-50 dark:bg-slate-900';
  d.innerHTML = `
<header class="flex items-center p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
  <button id="bk" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center shadow-sm active:scale-95 transition-transform"><span class="material-symbols-outlined text-black font-bold dark:text-slate-200">arrow_back</span></button>
  <h1 class="flex-1 text-center text-black font-black dark:text-white text-base">Detalhes do Veículo</h1>
  <div class="size-10"></div>
</header>
<main class="flex-1 overflow-y-auto p-5 pb-24">
  <div class="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-6 flex items-start gap-4 shadow-sm animate-[fadeInUp_0.4s_ease-out_forwards]">
    <span class="material-symbols-outlined text-primary text-3xl mt-0.5 shadow-sm">minor_crash</span>
    <div>
      <h2 class="text-lg font-black text-slate-900 dark:text-white leading-tight">Resgate no Cambão</h2>
      <p class="text-xs font-semibold text-slate-500 mt-1">Precisamos de algumas informações do local e do veículo para te salvar rapidamente.</p>
    </div>
  </div>

  <form id="qf" class="flex flex-col gap-6">
    <!-- Q1 -->
    <div class="flex flex-col gap-3 animate-[fadeInUp_0.5s_ease-out_0.1s_forwards] opacity-0">
      <label class="text-slate-900 dark:text-white text-[13px] font-bold tracking-wide uppercase">
        1. As rodas estão travadas?
      </label>
      <div class="grid grid-cols-2 gap-3">
        <label class="relative flex items-center justify-center p-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 cursor-pointer hover:border-primary/50 transition-colors group">
          <input type="radio" name="rodas" value="Sim" class="peer sr-only" required>
          <div class="absolute inset-0 rounded-xl border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 pointer-events-none transition-all"></div>
          <span class="font-bold text-sm text-slate-700 dark:text-slate-300 peer-checked:text-black dark:peer-checked:text-white z-10 transition-colors">Sim</span>
          <span class="material-symbols-outlined absolute top-2 right-2 text-primary opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all text-sm shadow-sm">check_circle</span>
        </label>
        <label class="relative flex items-center justify-center p-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 cursor-pointer hover:border-primary/50 transition-colors group">
          <input type="radio" name="rodas" value="Não" class="peer sr-only" required>
          <div class="absolute inset-0 rounded-xl border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 pointer-events-none transition-all"></div>
          <span class="font-bold text-sm text-slate-700 dark:text-slate-300 peer-checked:text-black dark:peer-checked:text-white z-10 transition-colors">Não</span>
          <span class="material-symbols-outlined absolute top-2 right-2 text-primary opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all text-sm shadow-sm">check_circle</span>
        </label>
      </div>
    </div>

    <!-- Q2 -->
    <div class="flex flex-col gap-3 animate-[fadeInUp_0.5s_ease-out_0.2s_forwards] opacity-0">
      <label class="text-slate-900 dark:text-white text-[13px] font-bold tracking-wide uppercase">
        2. O carro está de fácil acesso?
      </label>
      <div class="flex flex-col gap-3">
        <label class="relative flex items-center p-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 cursor-pointer hover:border-primary/50 transition-colors group">
          <input type="radio" name="acesso" value="Fácil Acesso" class="peer sr-only" required>
          <div class="absolute inset-0 rounded-xl border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 pointer-events-none transition-all"></div>
          <span class="font-bold text-sm text-slate-700 dark:text-slate-300 peer-checked:text-black dark:peer-checked:text-white z-10 transition-colors flex-1">Sim, na rua/estacionamento aberto</span>
          <span class="material-symbols-outlined text-primary opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all shadow-sm">check_circle</span>
        </label>
        <label class="relative flex items-center p-4 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 cursor-pointer hover:border-primary/50 transition-colors group">
          <input type="radio" name="acesso" value="Difícil Acesso" class="peer sr-only" required>
          <div class="absolute inset-0 rounded-xl border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 pointer-events-none transition-all"></div>
          <span class="font-bold text-sm text-slate-700 dark:text-slate-300 peer-checked:text-black dark:peer-checked:text-white z-10 transition-colors flex-1">Não, subsolo ou difícil acesso</span>
          <span class="material-symbols-outlined text-primary opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all shadow-sm">check_circle</span>
        </label>
      </div>
    </div>

    <!-- Q3: Texto -->
    <div class="flex flex-col gap-2 animate-[fadeInUp_0.5s_ease-out_0.3s_forwards] opacity-0">
      <label class="text-slate-900 dark:text-white text-[13px] font-bold tracking-wide uppercase">
        Informações Adicionais (Opcional)
      </label>
      <textarea id="obs" class="w-full rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white p-4 font-semibold text-sm resize-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm transition-all outline-none" rows="3" placeholder="Ex: A alavanca do câmbio travou no P, o pneu traseiro está no chão..."></textarea>
    </div>

    <!-- Submit -->
    <div class="mt-4 animate-[fadeInUp_0.5s_ease-out_0.4s_forwards] opacity-0">
      <button type="submit" class="w-full bg-primary text-black font-black py-4.5 rounded-2xl shadow-[0_8px_20px_-5px_rgba(255,217,0,0.4)] hover:shadow-[0_8px_25px_-5px_rgba(255,217,0,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all text-sm tracking-widest uppercase flex justify-center items-center gap-2">
        Avançar <span class="material-symbols-outlined text-base">arrow_forward</span>
      </button>
    </div>
  </form>
</main>
<style>
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
</style>
  `;
  d.querySelector('#bk').onclick = () => nav(homeView);
  d.querySelector('#qf').onsubmit = (e) => {
    e.preventDefault();
    const rodas = d.querySelector('input[name="rodas"]:checked').value;
    const acesso = d.querySelector('input[name="acesso"]:checked').value;
    const obs = d.querySelector('#obs').value.trim();

    let extraInfo = `Rodas travadas: ${rodas} | Acesso: ${acesso}`;
    if (obs) extraInfo += `\nObs: ${obs}`;

    nav(serviceDetailView, { type, name, extraInfo });
  };
  return d;
}

// ═══ SERVICE DETAIL ═══
function serviceDetailView({ type, name, extraInfo = '' }) {
  const d = document.createElement('div'); d.className = 'view active';
  let cLat, cLon, dLat, dLon, gpsCity = '', destArea = '';
  d.innerHTML = `
<div class="relative flex flex-col bg-slate-200 dark:bg-slate-900" style="height:100dvh">
  <!-- Top Navigation Elements OVER Map -->
  <div class="absolute top-4 left-4 z-10">
    <button id="bk" class="size-10 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"><span class="material-symbols-outlined font-bold">arrow_back</span></button>
  </div>
  <div class="absolute top-4 right-4 z-10">
    <button id="btn-gps" class="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-white/10 text-primary shadow-lg text-sm font-bold active:scale-95 transition-transform"><span class="material-symbols-outlined text-base">my_location</span>Centralizar GPS</button>
  </div>

  <!-- Full/Half Map -->
  <div id="dmap" class="w-full flex-1 z-0 min-h-[40vh]"></div>

  <!-- Bottom Sheet Overlay -->
  <div class="bg-white dark:bg-slate-900 rounded-t-[32px] pt-2 pb-6 px-5 flex flex-col relative z-20 shadow-[0_-15px_40px_rgba(0,0,0,0.12)] border-t border-slate-200 dark:border-white/5 h-[60vh]">
    <!-- Handle bar for visual cue -->
    <div class="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-5 shrink-0"></div>
    
    <div class="flex-1 overflow-y-auto mb-4 hide-scrollbar">
      <h2 class="text-xl font-black text-slate-900 dark:text-white mb-5 line-clamp-1 shrink-0">${name}</h2>
      
      <!-- Input Group -->
      <div class="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 space-y-4 mb-4 relative z-30 shrink-0">
        
        <!-- Origem -->
        <div class="relative">
          <div class="flex items-start gap-3 relative">
            <span class="material-symbols-outlined text-primary text-xl mt-0.5 drop-shadow-sm">my_location</span>
            <div class="flex-1 border-b border-slate-200 dark:border-white/10 pb-3 relative">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Local de Partida</p>
              <input id="addr-street" class="w-full bg-transparent border-none p-0 text-slate-900 font-bold dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none text-[15px] focus:ring-0 leading-tight" placeholder="Buscando seu local..." autocomplete="off"/>
              <!-- Autocomplete Origem -->
              <div id="addr-results" class="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-40 max-h-48 overflow-y-auto hidden"></div>
            </div>
          </div>
        </div>

        <!-- Num & Comp Origem -->
        <div class="flex gap-3 pl-8">
          <div class="flex-1">
            <input id="addr-num" class="w-full bg-slate-200/50 dark:bg-slate-800 border border-slate-200/50 outline-none dark:border-white/5 p-2 px-3 rounded-lg text-slate-900 font-bold dark:text-white placeholder:text-slate-400 text-[13px] focus:ring-0" placeholder="Nº"/>
          </div>
          <div class="flex-[3]">
            <input id="addr-comp" class="w-full bg-slate-200/50 dark:bg-slate-800 border border-slate-200/50 outline-none dark:border-white/5 p-2 px-3 rounded-lg text-slate-900 font-bold dark:text-white placeholder:text-slate-400 text-[13px] focus:ring-0" placeholder="Complemento / Ref."/>
          </div>
        </div>
        
        <!-- Destino -->
        <div class="relative pt-2">
          <div class="flex items-start gap-3 relative">
            <span class="material-symbols-outlined text-red-500 text-xl mt-0.5 drop-shadow-sm">pin_drop</span>
            <div class="flex-1 border-b border-slate-200 dark:border-white/10 pb-3 relative">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Para Onde? (Destino)</p>
              <input id="dest" class="w-full bg-transparent border-none p-0 text-slate-900 font-bold dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none text-[15px] focus:ring-0 leading-tight" placeholder="Digite o destino do veículo" autocomplete="off"/>
              <!-- Autocomplete Destino -->
              <div id="dest-results" class="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-40 max-h-48 overflow-y-auto hidden"></div>
            </div>
          </div>
        </div>

        <!-- Num & Comp Destino -->
        <div class="flex gap-3 pl-8">
          <div class="flex-1">
            <input id="dest-num" class="w-full bg-slate-200/50 dark:bg-slate-800 border border-slate-200/50 outline-none dark:border-white/5 p-2 px-3 rounded-lg text-slate-900 font-bold dark:text-white placeholder:text-slate-400 text-[13px] focus:ring-0" placeholder="Nº"/>
          </div>
          <div class="flex-[3]">
            <input id="dest-comp" class="w-full bg-slate-200/50 dark:bg-slate-800 border border-slate-200/50 outline-none dark:border-white/5 p-2 px-3 rounded-lg text-slate-900 font-bold dark:text-white placeholder:text-slate-400 text-[13px] focus:ring-0" placeholder="Complemento / Ref."/>
          </div>
        </div>
        
        <div id="route-info-detail" class="hidden pl-8 mt-2 text-primary font-black text-xs uppercase tracking-widest flex items-center gap-1"></div>
      </div>

      <textarea id="prob" class="w-full shrink-0 rounded-2xl bg-slate-50 outline-none dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white p-4 text-sm font-semibold resize-none focus:ring-1 focus:ring-primary focus:border-primary shadow-inner" rows="2" placeholder="Descreva brevemente a situação... (Opcional)">${extraInfo}</textarea>
    </div>

    <button id="btn-req" class="shrink-0 w-full bg-primary text-black font-black py-4 rounded-2xl shadow-[0_4px_15px_-4px_rgba(255,217,0,0.4)] hover:bg-[#ffea00] active:scale-[0.98] transition-all text-base tracking-wide">CONFIRMAR RESGATE</button>
  </div>
</div>
<style>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>`;
  d.querySelector('#bk').onclick = () => nav(homeView);

  let pickupMarker = null;
  const streetInput = d.querySelector('#addr-street');
  const numInput = d.querySelector('#addr-num');
  const destInput = d.querySelector('#dest');
  const destNumInput = d.querySelector('#dest-num');
  const resultsEl = d.querySelector('#addr-results');
  const destResultsEl = d.querySelector('#dest-results');

  function buildFullAddress() {
    let parts = [streetInput.value];
    const num = numInput.value.trim();
    if (num) parts.push(num);
    const comp = d.querySelector('#addr-comp').value.trim();
    if (comp) parts.push(comp);
    if (gpsCity) parts.push(gpsCity);
    return parts.join(', ');
  }

  function buildFullDestAddress() {
    let parts = [destInput.value];
    const num = destNumInput.value.trim();
    if (num) parts.push(num);
    const comp = d.querySelector('#dest-comp').value.trim();
    if (comp) parts.push(comp);
    return parts.join(', ');
  }

  // Exact point geocoding when number is added
  let exactDebounce;
  async function updateExactPoint(isOrigin) {
    clearTimeout(exactDebounce);
    exactDebounce = setTimeout(async () => {
      const street = isOrigin ? streetInput.value.trim() : destInput.value.trim();
      const num = isOrigin ? numInput.value.trim() : destNumInput.value.trim();
      const area = isOrigin ? gpsCity : destArea;

      if (!street || !num || street.length < 3) return;

      const query = `${street}, ${num}${area ? ', ' + area : ''}`;
      try {
        const res = await fetch('https://nominatim.openstreetmap.org/search?format=json&countrycodes=br&limit=1&q=' + encodeURIComponent(query));
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          if (isOrigin) {
            setPickupLocation(lat, lon);
          } else {
            dLat = lat; dLon = lon;
            drawRoute();
          }
        }
      } catch (e) { console.warn("Exact geocode failed", e); }
    }, 1000);
  }

  numInput.oninput = () => updateExactPoint(true);
  destNumInput.oninput = () => updateExactPoint(false);

  function setPickupLocation(lat, lon) {
    cLat = lat; cLon = lon;
    if (map) {
      map.flyTo([lat, lon], 18, { duration: 1 });
      if (pickupMarker) map.removeLayer(pickupMarker);
      pickupMarker = L.marker([lat, lon], {
        icon: L.divIcon({ className: '', html: '<div style="position:absolute;left:0;top:0;pointer-events:none"><div style="position:absolute;left:-40px;top:-40px;width:80px;height:80px;border-radius:50%;background:rgba(59,130,246,0.25);animation:pulseSmall 2s ease-out infinite"></div><div style="position:absolute;left:-8px;top:-8px;width:16px;height:16px;border-radius:50%;background:#3b82f6;border:2px solid white;box-shadow:0 0 8px rgba(0,0,0,0.3);z-index:2"></div></div><style>@keyframes pulseSmall{0%{transform:scale(0.5);opacity:1}100%{transform:scale(1);opacity:0}}</style>', iconSize: [0, 0], iconAnchor: [0, 0] })
      }).addTo(map);
    }
  }

  function parseReverseGeocode(data) {
    const a = data.address || {};
    const road = a.road || a.pedestrian || a.footway || '';
    const nb = a.neighbourhood || a.suburb || '';
    const city = a.city || a.town || a.village || '';
    const state = a.state || '';
    gpsCity = [nb, city, state].filter(Boolean).join(', ');
    streetInput.value = road ? road + (nb ? ', ' + nb : '') : (data.display_name || '').split(',').slice(0, 2).join(',');
    numInput.value = a.house_number || '';
    numInput.focus();
  }

  // Debounced autocomplete for origin
  let debounceTimer;
  streetInput.oninput = () => {
    clearTimeout(debounceTimer);
    const q = streetInput.value.trim();
    if (q.length < 3) { resultsEl.classList.add('hidden'); return; }
    debounceTimer = setTimeout(async () => {
      try {
        const query = q.split(',')[0].trim();
        const res = await fetch('https://nominatim.openstreetmap.org/search?format=json&countrycodes=br&limit=5&addressdetails=1&q=' + encodeURIComponent(query));
        const data = await res.json();
        if (!data.length) { resultsEl.innerHTML = '<p class="p-3 text-xs text-slate-500">Nenhum resultado</p>'; resultsEl.classList.remove('hidden'); return; }
        resultsEl.innerHTML = data.map(r => {
          const a = r.address || {};
          const road = a.road || a.pedestrian || (r.display_name || '').split(',')[0];
          const area = [a.neighbourhood || a.suburb, a.city || a.town].filter(Boolean).join(' - ');
          return '<div class="addr-opt flex items-start gap-2 px-3 py-2.5 cursor-pointer hover:bg-primary/5 dark:hover:bg-white/5 border-b border-slate-100 dark:border-white/5 last:border-0" data-lat="' + r.lat + '" data-lon="' + r.lon + '" data-road="' + road + '" data-area="' + area + '" data-num="' + (a.house_number || '') + '"><span class="material-symbols-outlined text-primary text-sm mt-0.5 shrink-0">location_on</span><div class="flex-1 min-w-0"><p class="text-sm font-medium text-black font-bold dark:text-white truncate">' + road + '</p><p class="text-[10px] text-slate-500 truncate">' + area + '</p></div></div>';
        }).join('');
        resultsEl.classList.remove('hidden');
        resultsEl.querySelectorAll('.addr-opt').forEach(el => {
          el.onclick = () => {
            streetInput.value = el.dataset.road;
            numInput.value = el.dataset.num;
            gpsCity = el.dataset.area;
            setPickupLocation(parseFloat(el.dataset.lat), parseFloat(el.dataset.lon));
            resultsEl.classList.add('hidden');
            if (!el.dataset.num) numInput.focus();
            drawRoute();
          };
        });
      } catch { }
    }, 500);
  };

  // Debounced autocomplete for destination
  let destDebounceTimer;
  destInput.oninput = () => {
    clearTimeout(destDebounceTimer);
    const q = destInput.value.trim();
    if (q.length < 3) { destResultsEl.classList.add('hidden'); return; }
    destDebounceTimer = setTimeout(async () => {
      try {
        const query = q.split(',')[0].trim();
        const res = await fetch('https://nominatim.openstreetmap.org/search?format=json&countrycodes=br&limit=5&addressdetails=1&q=' + encodeURIComponent(query));
        const data = await res.json();
        if (!data.length) { destResultsEl.innerHTML = '<p class="p-3 text-xs text-slate-500">Nenhum resultado</p>'; destResultsEl.classList.remove('hidden'); return; }
        destResultsEl.innerHTML = data.map(r => {
          const a = r.address || {};
          const road = a.road || a.pedestrian || (r.display_name || '').split(',')[0];
          const area = [a.neighbourhood || a.suburb, a.city || a.town].filter(Boolean).join(' - ');
          return '<div class="addr-opt flex items-start gap-2 px-3 py-2.5 cursor-pointer hover:bg-primary/5 dark:hover:bg-white/5 border-b border-slate-100 dark:border-white/5 last:border-0" data-lat="' + r.lat + '" data-lon="' + r.lon + '" data-road="' + road + '" data-area="' + area + '" data-num="' + (a.house_number || '') + '"><span class="material-symbols-outlined text-red-500 text-sm mt-0.5 shrink-0">location_on</span><div class="flex-1 min-w-0"><p class="text-sm font-medium text-black font-bold dark:text-white truncate">' + road + '</p><p class="text-[10px] text-slate-500 truncate">' + area + '</p></div></div>';
        }).join('');
        destResultsEl.classList.remove('hidden');
        destResultsEl.querySelectorAll('.addr-opt').forEach(el => {
          el.onclick = () => {
            destInput.value = el.dataset.road;
            destNumInput.value = el.dataset.num;
            destArea = el.dataset.area;
            dLat = parseFloat(el.dataset.lat);
            dLon = parseFloat(el.dataset.lon);
            destResultsEl.classList.add('hidden');
            if (!el.dataset.num) destNumInput.focus();
            drawRoute();
          };
        });
      } catch { }
    }, 500);
  };

  d.addEventListener('click', (e) => {
    if (!e.target.closest('#addr-results') && !e.target.closest('#addr-street')) resultsEl.classList.add('hidden');
    if (!e.target.closest('#dest-results') && !e.target.closest('#dest')) destResultsEl.classList.add('hidden');
  });

  d.querySelector('#btn-gps').onclick = () => {
    streetInput.value = 'Localizando...';
    getCurrentPosition().then(p => {
      fetch('https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=' + p.latitude + '&lon=' + p.longitude)
        .then(r => r.json())
        .then(data => { parseReverseGeocode(data); setPickupLocation(p.latitude, p.longitude); })
        .catch(() => { streetInput.value = 'GPS Indisponivel'; });
    }).catch(() => { streetInput.value = 'GPS Indisponivel'; });
  };

  setTimeout(() => {
    const el = d.querySelector('#dmap'); if (!el) return;
    const initLat = user?.latitude || -23.55, initLon = user?.longitude || -46.63;
    map = L.map(el, { zoomControl: false, attributionControl: false }).setView([initLat, initLon], 18);
    L.tileLayer(tileUrl()).addTo(map);
    getCurrentPosition().then(p => {
      fetch('https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=' + p.latitude + '&lon=' + p.longitude)
        .then(r => r.json())
        .then(data => { parseReverseGeocode(data); setPickupLocation(p.latitude, p.longitude); })
        .catch(() => setPickupLocation(p.latitude, p.longitude));
    }).catch(() => { streetInput.placeholder = 'Digite sua rua...'; });
  }, 100);

  // Distance Haversine formula
  function getDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371; const p = Math.PI / 180;
    const a = 0.5 - Math.cos((lat2 - lat1) * p) / 2 + Math.cos(lat1 * p) * Math.cos(lat2 * p) * (1 - Math.cos((lon2 - lon1) * p)) / 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  let routeLine = null;
  let destMarker = null;

  async function drawRoute() {
    if (!cLat || !cLon || !dLat || !dLon) return;
    try {
      if (destMarker) map.removeLayer(destMarker);
      destMarker = L.marker([dLat, dLon], {
        icon: L.divIcon({ className: '', html: '<div style="width:16px;height:16px;background:#ef4444;border:3px solid white;border-radius:50%;box-shadow:0 0 8px rgba(0,0,0,0.3)"></div>', iconSize: [16, 16], iconAnchor: [8, 8] })
      }).addTo(map);

      const resp = await fetch(`https://router.project-osrm.org/route/v1/driving/${cLon},${cLat};${dLon},${dLat}?overview=full&geometries=geojson`);
      const json = await resp.json();
      if (json.routes && json.routes.length > 0) {
        const coords = json.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        if (routeLine) map.removeLayer(routeLine);
        routeLine = L.polyline(coords, { color: '#ef4444', weight: 4, opacity: 0.8, dashArray: '5, 8' }).addTo(map);
        map.fitBounds(routeLine.getBounds(), { padding: [30, 30] });

        const distKm = (json.routes[0].distance / 1000).toFixed(1);
        d.querySelector('#route-info-detail').innerHTML = `<span class="material-symbols-outlined text-[14px]">route</span> Distância Total: ${distKm} km`;
        d.querySelector('#route-info-detail').classList.remove('hidden');
      }
    } catch (e) { }
  }

  d.querySelector('#btn-req').onclick = async () => {
    if (!cLat) { alert('Clique em "Usar GPS" ou digite seu endereco de origem.'); return; }
    const destVal = d.querySelector('#dest').value.trim();
    if (!destVal) { alert('Informe o endereco de destino.'); d.querySelector('#dest').focus(); return; }

    const btnReq = d.querySelector('#btn-req');
    const oldBtnContent = btnReq.innerHTML;
    btnReq.innerHTML = '<span class="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span> Calculando...';
    btnReq.disabled = true;

    let distKm = getDistance(cLat, cLon, dLat, dLon);
    if (!dLat || distKm === 0) distKm = 10; // Fallback distance if they typed without autocomplete

    try {
      const resp = await fetch(`https://router.project-osrm.org/route/v1/driving/${cLon},${cLat};${dLon},${dLat}?overview=false`);
      const json = await resp.json();
      if (json.routes && json.routes.length > 0) {
        distKm = json.routes[0].distance / 1000;
      }
    } catch (e) { }

    btnReq.innerHTML = oldBtnContent;
    btnReq.disabled = false;

    // Fetch dynamic pricing
    let price = 0;
    let driverPrice = 0;
    try {
      const pData = await Pricing.get();
      const stData = await Pricing.getSettings();

      const svcPricing = (pData.services && pData.services[type]) || { basePrice: pData.basePrice || 50, pricePerKm: pData.pricePerKm || 5 };
      price = svcPricing.basePrice + (distKm * svcPricing.pricePerKm);

      const platformFee = stData.platformFee || 15;
      driverPrice = price * (1 - (platformFee / 100));

      price = parseFloat(price.toFixed(2));
      driverPrice = parseFloat(driverPrice.toFixed(2));
    } catch (e) {
      console.error("Pricing fetch err:", e);
      // Fallback in case of network error
      const baseFee = 80;
      price = baseFee + (distKm * 3.50);
      driverPrice = 60 + (distKm * 2.50);
    }

    const fullAddr = buildFullAddress();
    const fullDestAddr = buildFullDestAddress();
    const orderData = { clientId: user.id, clientName: user.name, serviceType: type, serviceName: name, pickupAddress: fullAddr, pickupLat: cLat, pickupLon: cLon, destinationAddress: fullDestAddr, destinationLat: dLat, destinationLon: dLon, vehicleModel: user.vehicleModel || '', problemDescription: d.querySelector('#prob').value, distanceKm: distKm.toFixed(1), price: price, driverPrice: driverPrice };

    nav(checkoutView, orderData);
  };
  return d;
}

// ═══ CHECKOUT DO PEDIDO ═══
function checkoutView(orderData) {
  const d = document.createElement('div'); d.className = 'view active bg-background-light dark:bg-background-dark';
  const pr = (orderData.price || 0).toFixed(2).replace('.', ',');
  d.innerHTML = '<header class="flex items-center p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10"><button id="bk" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center"><span class="material-symbols-outlined text-black font-bold dark:text-slate-200">arrow_back</span></button><h1 class="flex-1 text-center text-black font-bold dark:text-white text-base font-bold">Resumo do Pedido</h1><div class="size-10"></div></header><main class="flex-1 overflow-y-auto px-4 py-6"><div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-5 mb-5 shadow-sm"><div class="flex items-center gap-3 mb-4"><span class="material-symbols-outlined text-primary text-2xl">build</span><h2 class="text-xl font-bold text-black font-bold dark:text-white">' + orderData.serviceName + '</h2></div><div class="flex flex-col gap-4 relative"><div class="absolute left-[11px] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-white/10"></div><div class="flex items-start gap-4 relative z-10"><div class="size-6 rounded-full bg-white dark:bg-background-dark border-4 border-primary mt-0.5"></div><div><p class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Origem</p><p class="text-black font-bold dark:text-slate-200 text-sm font-medium line-clamp-2">' + orderData.pickupAddress + '</p></div></div><div class="flex items-start gap-4 relative z-10"><div class="size-6 rounded-full bg-white dark:bg-background-dark border-4 border-slate-400 dark:border-slate-500 mt-0.5"></div><div><p class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Destino</p><p class="text-black font-bold dark:text-slate-200 text-sm font-medium line-clamp-2">' + orderData.destinationAddress + '</p></div></div></div></div><div class="grid grid-cols-2 gap-3 mb-5"><div class="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-4 text-center"><p class="text-xs tracking-wider uppercase font-bold text-slate-500 mb-1">Distancia</p><p class="text-lg font-bold text-black font-bold dark:text-white">' + orderData.distanceKm + ' km</p></div><div class="bg-primary/10 rounded-xl border border-primary/20 p-4 text-center"><p class="text-xs tracking-wider uppercase font-bold text-primary mb-1">Total</p><p class="text-lg font-black text-primary">R$ ' + pr + '</p></div></div><div class="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-xl p-4 mb-5 flex items-start gap-3"><span class="material-symbols-outlined text-yellow-600 dark:text-yellow-500 mt-0.5">info</span><p class="text-xs font-medium text-yellow-800 dark:text-yellow-200/80 leading-snug">O valor inclui a taxa de deslocamento e servico basico. <br/><b>Aviso:</b> O cancelamento apos o motorista estar a caminho gerara uma cobrança de uma taxa administrativa de R$ 30,00.</p></div><div class="mb-5"><p class="text-sm font-bold text-black font-bold dark:text-white mb-3">Forma de Pagamento</p><div class="flex flex-col gap-2"><label class="flex items-center justify-between p-4 rounded-xl border border-primary bg-primary/5 cursor-pointer"><div class="flex items-center gap-3"><span class="material-symbols-outlined text-primary">pix</span><span class="font-bold text-black font-bold dark:text-white text-sm">Pix (Rapido)</span></div><input type="radio" name="pay" class="text-primary focus:ring-primary" checked></label><label class="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:border-primary/50 cursor-pointer"><div class="flex items-center gap-3"><span class="material-symbols-outlined text-slate-500">credit_card</span><span class="font-bold text-black font-bold dark:text-white text-sm">Cartao de Credito</span></div><input type="radio" name="pay" class="text-primary focus:ring-primary"></label></div></div><button id="btn-confirm" class="w-full bg-primary hover:bg-primary/90 text-black font-bold py-4 rounded-xl shadow-lg active:scale-[0.98]">Confirmar e Buscar Motorista</button></main>';
  d.querySelector('#bk').onclick = () => nav(homeView);
  d.querySelector('#btn-confirm').onclick = async () => {
    try {
      const o = await Orders.create(orderData);
      currentOrder = o;
      nav(searchingView, o);
    } catch (e) { alert(e.message); }
  };
  return d;
}

// ═══ SEARCHING ═══
function searchingView(order) {
  const d = document.createElement('div'); d.className = 'view active bg-background-light dark:bg-background-dark';
  d.innerHTML = `
<div class="relative flex h-full w-full flex-col overflow-hidden" style="height:100dvh">
  <div id="searchmap" class="absolute inset-0 z-0 bg-slate-200 dark:bg-background-dark/90 text-blue-500"></div>
  <div class="absolute inset-0 z-10 bg-background-light/30 dark:bg-background-dark/30 backdrop-blur-[2px]"></div>
  
  <!-- Searching UI -->
  <div class="relative z-20 flex-1 flex flex-col items-center justify-end pb-12 px-6">
    <div class="bg-white/90 dark:bg-background-dark/95 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl w-full max-max-w-sm flex flex-col items-center text-center">
      <div class="relative size-20 mb-6 flex items-center justify-center">
        <div class="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
        <div class="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
        <span class="material-symbols-outlined text-emerald-500 text-3xl">radar</span>
      </div>
      <h2 class="text-2xl font-black text-black dark:text-white mb-2 tracking-tight">Buscando o Melhor Resgate</h2>
      <p id="search-status" class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 px-4 leading-snug">Sua seguranca e nossa prioridade. Estamos localizando um parceiro Movvi agora.</p>
      <button id="cancel" class="w-full text-red-500 font-black border-2 border-red-500/10 bg-red-50 dark:bg-red-500/5 py-4 rounded-2xl hover:bg-red-500/10 active:scale-95 transition-all outline-none uppercase tracking-widest text-xs">Cancelar Pedido</button>
    </div>
  </div>
</div>`;
  d.querySelector('#cancel').onclick = async () => { try { await Orders.updateStatus(order.id, 'cancelled'); currentOrder = null; nav(homeView); } catch (e) { alert(e.message); } };

  setTimeout(() => {
    const el = d.querySelector('#searchmap'); if (!el) return;
    const sMap = L.map(el, { zoomControl: false, attributionControl: false, dragging: false, scrollWheelZoom: false }).setView([order.pickupLat, order.pickupLon], 14);
    L.tileLayer(tileUrl()).addTo(sMap);
    sMap.flyTo([order.pickupLat, order.pickupLon], 15, { duration: 2 });
    L.marker([order.pickupLat, order.pickupLon], {
      icon: L.divIcon({
        className: '',
        html: `<div style="position:absolute;left:0;top:0;pointer-events:none">
          <div style="position:absolute;left:-400px;top:-400px;width:800px;height:800px;border-radius:50%;background:rgba(59,130,246,0.1);animation:pulseSearch 3s ease-out infinite"></div>
          <div style="position:absolute;left:-250px;top:-250px;width:500px;height:500px;border-radius:50%;background:rgba(59,130,246,0.15);animation:pulseSearch 3s ease-out infinite 0.7s"></div>
          <div style="position:absolute;left:-100px;top:-100px;width:200px;height:200px;border-radius:50%;background:rgba(59,130,246,0.25);animation:pulseSearch 3s ease-out infinite 1.4s"></div>
          <div style="position:absolute;left:-10px;top:-10px;width:20px;height:20px;border-radius:50%;background:#3b82f6;box-shadow:0 0 16px rgba(59,130,246,0.8);z-index:2; border:3px solid white"></div>
        </div>
        <style>@keyframes pulseSearch{0%{transform:scale(0);opacity:1}100%{transform:scale(1.5);opacity:0}}</style>`, iconSize: [0, 0], iconAnchor: [0, 0]
      })
    }).addTo(sMap);
  }, 100);

  return d;
}

// ═══ TRACKING ═══
function trackingView(data) {
  const d = document.createElement('div'); d.className = 'view active bg-slate-200 dark:bg-background-dark';
  d.innerHTML = `<div class="flex flex-col relative overflow-hidden" style="height:100dvh">
  <!-- Status Indicator Overlay -->
  <div class="absolute top-0 left-0 right-0 h-1 z-30 flex gap-0.5">
    <div class="flex-1 h-full bg-emerald-500 animate-pulse"></div>
    <div class="flex-1 h-full bg-emerald-500/30"></div>
    <div class="flex-1 h-full bg-emerald-500/30"></div>
  </div>

  <div id="tmap" class="w-full bg-slate-200 dark:bg-background-dark z-0 transition-all duration-300" style="height:62%"></div>
  
  <div id="tracking-sheet" class="flex-1 bg-white dark:bg-background-dark border-t border-slate-200 dark:border-white/5 rounded-t-[40px] -mt-10 relative z-20 p-6 flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-out">
    <!-- Visual Handle -->
    <div id="tracking-handle" class="w-full py-2 -mt-2 mb-4 cursor-pointer">
      <div class="w-12 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mx-auto transition-all hover:w-20"></div>
    </div>

    <div id="tracking-content" class="flex flex-col flex-1 overflow-hidden transition-all duration-300" style="max-height: 1000px;">

    <!-- Active Service Info (Mini) -->
    <div class="flex items-center gap-2 mb-6 opacity-0 animate-[fadeInUp_0.5s_ease_forwards_0.1s] shrink-0">
      <div class="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
        <span class="material-symbols-outlined text-[18px] animate-pulse">check_circle</span>
      </div>
      <p class="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[2px]">Resgate Confirmado • ${data.serviceName || 'Serviço'}</p>
    </div>

    <!-- Premium Driver Card -->
    <div class="bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-3xl p-5 mb-8 flex-shrink-0 relative overflow-hidden group opacity-0 animate-[fadeInUp_0.5s_ease_forwards_0.2s]">
      <!-- Animated Background Accent -->
      <div class="absolute -right-10 -top-10 size-40 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div class="flex items-center gap-5 relative z-10">
        <!-- Profile Photo -->
        <div class="relative shrink-0">
          <div class="size-20 rounded-[28px] bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary overflow-hidden shadow-2xl transition-transform group-hover:scale-105 duration-500">
            ${data.driverPhoto ? `<img src="${data.driverPhoto}" class="w-full h-full object-cover">` : '<span class="material-symbols-outlined text-4xl">person</span>'}
          </div>
          <div class="absolute -bottom-1 -right-1 size-7 bg-emerald-500 border-4 border-white dark:border-background-dark rounded-full flex items-center justify-center shadow-lg">
             <div class="size-2 bg-white rounded-full animate-ping"></div>
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
             <h3 class="text-black font-black dark:text-white text-xl leading-none tracking-tight">${data.driverName || 'Motorista'}</h3>
             <div class="flex items-center gap-1 bg-primary px-2 py-0.5 rounded-full">
                <span class="material-symbols-outlined text-[12px] text-black">star</span>
                <span class="text-[10px] font-black text-black">${data.driverRating || '5.0'}</span>
             </div>
          </div>
          <div class="flex flex-col gap-0.5">
            <p class="text-slate-500 dark:text-slate-400 text-sm font-bold truncate">${data.driverVehicle || 'Guincho Parceiro'}</p>
            <p class="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 dark:bg-primary/10 py-0.5 px-2 rounded inline-block w-fit mt-1 border border-primary/20">Placa ${data.driverPlate || '--'}</p>
          </div>
        </div>
      </div>

      <!-- Integrated ETA Footer -->
      <div class="mt-5 pt-4 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between">
         <div class="flex flex-col">
            <p class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Previsao de Chegada</p>
            <div class="flex items-center gap-2">
               <span class="material-symbols-outlined text-emerald-500 text-xl font-light">schedule</span>
               <span id="eta-text" class="text-2xl font-black text-black dark:text-white tracking-tighter shadow-sm font-mono whitespace-nowrap">Calculando...</span>
            </div>
         </div>
         <div class="flex flex-col items-end">
             <p class="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Distancia</p>
             <p id="dist-text" class="text-base font-black text-black dark:text-white tracking-tight">-- km</p>
         </div>
      </div>
      
      <!-- Quick Pix Key (Client convenience) -->
      <div id="tracking-pix" class="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between hidden">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-sm">pix</span>
          <p class="text-[9px] font-bold text-slate-500 dark:text-primary uppercase tracking-[0.1em]">Pagar via PIX:</p>
          <p id="tracking-pix-val" class="text-[10px] font-black text-black dark:text-white"></p>
        </div>
        <button id="btn-copy-pix-tracking" class="text-primary hover:text-white transition-colors"><span class="material-symbols-outlined text-sm">content_copy</span></button>
      </div>
    </div>

    <!-- Actions -->
    <div id="default-actions" class="grid grid-cols-2 gap-4 mt-auto mb-2 opacity-0 animate-[fadeInUp_0.5s_ease_forwards_0.3s]">
      <button id="btn-chat" class="bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/5 text-black font-black dark:text-white py-4.5 rounded-[22px] flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-slate-100 dark:hover:bg-white/10 shadow-sm relative">
        <span class="material-symbols-outlined text-xl">forum</span>
        <span class="text-sm">Abrir Chat</span>
      </button>
      <button id="btn-call" class="bg-emerald-500 text-white font-black py-4.5 rounded-[22px] flex items-center justify-center gap-3 shadow-[0_8px_20px_-5px_rgba(16,185,129,0.4)] active:scale-95 transition-all hover:bg-emerald-600">
        <span class="material-symbols-outlined text-xl">call</span>
        <span class="text-sm">Ligar (Dados)</span>
      </button>
    </div>

    <!-- Delay Actions (Hidden by default) -->
    <div id="delay-actions" class="hidden flex-col gap-4 mt-auto opacity-0 animate-[fadeInUp_0.5s_ease_forwards_0.3s]">
      <div class="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
        <span class="material-symbols-outlined text-red-500 mt-0.5 text-lg">error</span>
        <p class="text-xs text-red-700 dark:text-red-400 font-bold leading-snug">O motorista esta com um atraso critico. Gostaria de cancelar sem taxas?</p>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <button id="btn-call-delay" class="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-black font-black dark:text-white py-4 rounded-xl flex items-center justify-center gap-2 text-sm">Ligar</button>
        <button id="btn-cancel" class="bg-red-500 text-white font-black py-4 rounded-xl shadow-lg text-sm active:scale-95">Sair e Cancelar</button>
      </div>
      </div>
    </div>
  </div>

  <style>
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</div>`;

  const sheet = d.querySelector('#tracking-sheet');
  const content = d.querySelector('#tracking-content');
  const handle = d.querySelector('#tracking-handle');
  const tmap = d.querySelector('#tmap');
  let isCollapsed = false;

  function toggleSheet() {
    isCollapsed = !isCollapsed;
    if (isCollapsed) {
      content.style.maxHeight = '0px';
      content.style.opacity = '0';
      content.style.margin = '0';
      sheet.style.transform = 'translateY(calc(100% - 60px))';
      tmap.style.height = '100dvh';
    } else {
      content.style.maxHeight = '1000px';
      content.style.opacity = '1';
      sheet.style.transform = 'translateY(0)';
      tmap.style.height = '62%';
    }
    setTimeout(() => { if (tmapInstance) tmapInstance.invalidateSize(); }, 300);
  }

  handle.onclick = toggleSheet;

  d.querySelector('#btn-chat').onclick = () => {
    const dot = document.getElementById('chat-dot');
    if (dot) dot.remove();
    nav(driverChatView, data);
  };
  const cFn = () => startCall(data.driverId, data.driverName, data.driverPhoto);
  d.querySelector('#btn-call').onclick = cFn;
  const bcd = d.querySelector('#btn-call-delay');
  if (bcd) bcd.onclick = cFn;

  d.querySelector('#btn-cancel').onclick = async () => {
    if (confirm('Tem certeza que deseja cancelar o resgate?')) {
      try {
        await Orders.updateStatus(data.orderId || data.id, 'cancelled');
        currentOrder = null;
        nav(homeView);
      } catch (e) { alert(e.message); }
    }
  };

  let tmapInstance = null, routePolyline = null;
  const etaText = d.querySelector('#eta-text');
  const cLat = data.pickupLat || -23.55, cLon = data.pickupLon || -46.63;

  if (data.status === 'arrived') etaText.innerHTML = '<span class="text-green-500 font-bold">Motorista Chegou!</span>';
  if (data.status === 'in_progress') etaText.innerHTML = '<span class="text-primary font-bold drop-shadow-sm">A caminho do destino</span>';

  let expectedArrivalTime = null;
  const maxDelayMs = 20 * 60 * 1000; // 20 minutes

  // Listen for ETA from driver
  const onEta = ({ orderId, etaMinutes, distanceKm }) => {
    if (orderId === (data.orderId || data.id)) {
      if (currentOrder && (currentOrder.status === 'arrived' || currentOrder.status === 'in_progress')) return;
      const distTxt = d.querySelector('#dist-text');
      etaText.textContent = `~${etaMinutes} min`;
      if (distTxt) distTxt.textContent = `${distanceKm} km`;

      // Update expected time if not set, or if the new ETA extends it
      const newExpected = Date.now() + (etaMinutes * 60 * 1000);
      if (!expectedArrivalTime || newExpected > expectedArrivalTime) {
        expectedArrivalTime = newExpected;
      }
    }
  };
  socket.on('driver:eta', onEta);

  // Check for delays
  const intervalId = setInterval(() => {
    if (expectedArrivalTime && Date.now() > expectedArrivalTime + maxDelayMs) {
      d.querySelector('#default-actions').classList.add('hidden');
      d.querySelector('#delay-actions').classList.remove('hidden');
      d.querySelector('#delay-actions').classList.add('flex');
    }
  }, 10000);

  // Listen for real-time driver location to update the map
  const onDriverLoc = ({ latitude, longitude }) => {
    if (driverMarker) driverMarker.setLatLng([latitude, longitude]);
    if (tmapInstance) tmapInstance.panTo([latitude, longitude]);
    updateRoute(latitude, longitude);
  };
  socket.on('driver:location', onDriverLoc);

  let routeTimeout = null;
  async function updateRoute(dLat, dLon) {
    if (!tmapInstance) return;
    if (routeTimeout) return;
    routeTimeout = setTimeout(() => { routeTimeout = null; }, 10000);

    let tLat = data.pickupLat || -23.55, tLon = data.pickupLon || -46.63;
    if (currentOrder && currentOrder.status === 'in_progress') {
      tLat = currentOrder.destinationLat || tLat;
      tLon = currentOrder.destinationLon || tLon;
    }

    try {
      const resp = await fetch(`https://router.project-osrm.org/route/v1/driving/${dLon},${dLat};${tLon},${tLat}?overview=full&geometries=geojson`);
      const json = await resp.json();
      if (json.routes && json.routes.length > 0) {
        const coords = json.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
        if (routePolyline) tmapInstance.removeLayer(routePolyline);
        routePolyline = L.polyline(coords, { color: '#2563eb', weight: 5, opacity: 0.85 }).addTo(tmapInstance);
        const dur = Math.round(json.routes[0].duration / 60);
        const dist = (json.routes[0].distance / 1000).toFixed(1);
        const distTxt = d.querySelector('#dist-text');
        etaText.textContent = `~${dur} min`;
        if (distTxt) distTxt.textContent = `${dist} km`;

        const newExpected = Date.now() + (dur * 60 * 1000);
        if (!expectedArrivalTime || newExpected > expectedArrivalTime) expectedArrivalTime = newExpected;
        return;
      }
    } catch (e) { /* fallback */ }

    // Straight-line fallback
    if (routePolyline) tmapInstance.removeLayer(routePolyline);
    routePolyline = L.polyline([[dLat, dLon], [cLat, cLon]], { color: '#2563eb', weight: 4, dashArray: '10,8', opacity: 0.7 }).addTo(tmapInstance);
    const lineDist = (Math.sqrt(Math.pow(dLat - cLat, 2) + Math.pow(dLon - cLon, 2)) * 111).toFixed(1);
    const distTxt = d.querySelector('#dist-text');
    if (distTxt) distTxt.textContent = `${lineDist} km`;
    etaText.textContent = '-- min';
  }

  setTimeout(async () => {
    const dLat0 = data.driverLat || cLat, dLon0 = data.driverLon || cLon;
    tmapInstance = L.map(d.querySelector('#tmap'), { zoomControl: false, attributionControl: false }).setView([dLat0, dLon0], 18);
    L.tileLayer(tileUrl()).addTo(tmapInstance);
    driverMarker = L.marker([dLat0, dLon0], { icon: L.divIcon({ className: '', html: '<div style="background:#2563eb;color:#fff;width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 0 15px rgba(37,99,235,0.5)"><span class="material-symbols-outlined" style="font-size:18px">car_repair</span></div>', iconSize: [30, 30], iconAnchor: [15, 15] }) }).addTo(tmapInstance);
    L.marker([cLat, cLon], { icon: L.divIcon({ className: '', html: '<div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center"><div style="position:absolute;width:24px;height:24px;border-radius:50%;background:rgba(59,130,246,0.25);animation:pulseAura 2s ease-out infinite"></div><div style="width:8px;height:8px;border-radius:50%;background:#3b82f6;z-index:2"></div></div><style>@keyframes pulseAura{0%{transform:scale(.5);opacity:.8}100%{transform:scale(1.5);opacity:0}}</style>', iconSize: [24, 24], iconAnchor: [12, 12] }) }).addTo(tmapInstance);

    if (dLat0 !== cLat || dLon0 !== cLon) {
      updateRoute(dLat0, dLon0);
      tmapInstance.fitBounds([[dLat0, dLon0], [cLat, cLon]], { padding: [40, 40] });
    }

    // Fetch Pix Key for quick pay
    try {
      const drId = data.driverId || (data.orderId ? (await Orders.get(data.orderId)).driverId : null);
      if (drId) {
        fetch('/api/drivers/' + drId).then(r => r.json()).then(dr => {
          const pix = dr.pixKey;
          if (pix) {
            const tpx = d.querySelector('#tracking-pix');
            if (tpx) tpx.classList.remove('hidden');
            const tval = d.querySelector('#tracking-pix-val');
            if (tval) tval.textContent = pix;
            const tcopy = d.querySelector('#btn-copy-pix-tracking');
            if (tcopy) tcopy.onclick = () => {
              navigator.clipboard.writeText(pix);
              alert('Chave PIX copiada!');
            };
          }
        }).catch(() => { });
      }
    } catch (e) {
      console.warn('Could not fetch driver ID for Pix key:', e);
    }
  }, 200);

  // Cleanup interval on view change. Assume a global function hook or do it silently if the node disappears
  const checkRemoved = setInterval(() => {
    if (!document.body.contains(d)) {
      clearInterval(intervalId);
      clearInterval(checkRemoved);
    }
  }, 5000);

  return d;
}

// ═══ RATING & PAYMENT ═══
function ratingView(data) {
  const d = document.createElement('div'); d.className = 'view active bg-background-light dark:bg-background-dark';
  let sr = 0; const pr = (data.price || 0).toFixed(2).replace('.', ',');

  d.innerHTML = `
<div class="flex flex-col flex-1 h-full relative" style="max-height: 100dvh;">
  <div class="flex-1 overflow-y-auto pb-32">
    <div class="p-6 pt-12 flex flex-col items-center">
      <div class="size-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
        <span class="material-symbols-outlined text-emerald-500 text-3xl">check_circle</span>
      </div>
      <h1 class="text-2xl font-black text-black dark:text-white mb-1">Operação Finalizada</h1>
      <p class="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-200 dark:border-white/10 w-full text-center">O resgate foi concluído com sucesso.</p>

      <div class="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 mb-8 text-center relative overflow-hidden shadow-sm">
        <div class="absolute inset-0 bg-primary/5 pointer-events-none"></div>
        <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1 relative z-10">Valor a Pagar ao Parceiro</p>
        <p class="text-3xl font-black text-primary relative z-10">R$ ${pr}</p>
      </div>

      <div class="w-full text-left mb-8" id="pix-area">
        <p class="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-3 ml-1">Forma de Pagamento</p>
        <div class="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 flex flex-col gap-4">
          <div class="flex items-start gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
            <span class="material-symbols-outlined text-emerald-500 mt-0.5">payments</span>
            <div class="flex-1">
              <p class="text-sm font-black text-black dark:text-white mb-0.5">Dinheiro Físico</p>
              <p class="text-xs text-slate-500">Pague diretamente ao motorista no local.</p>
            </div>
          </div>
          <div class="flex items-start gap-3 pt-1">
            <span class="material-symbols-outlined text-primary mt-0.5">pix</span>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-black text-black dark:text-white mb-0.5">PIX Direto</p>
              <p class="text-xs text-slate-500 mb-3 leading-snug">O parceiro possui chave PIX cadastrada. Copie e cole em seu banco.</p>
              <div id="pix-loader" class="text-xs text-primary font-bold flex items-center gap-1"><span class="material-symbols-outlined text-xs animate-spin">progress_activity</span> Buscando chave...</div>
              <div id="pix-key-box" class="hidden flex items-center gap-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 p-2.5 rounded-lg w-full">
                 <input type="text" id="pix-key-val" class="bg-transparent text-sm font-bold text-black dark:text-white w-full outline-none" readonly />
                 <button id="btn-copy-pix" class="bg-white dark:bg-slate-700 size-8 rounded shadow-sm border border-slate-200 dark:border-white/10 text-primary flex items-center justify-center shrink-0 active:scale-95"><span class="material-symbols-outlined text-sm">content_copy</span></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full text-center mb-6">
        <p class="text-[10px] font-black tracking-[2px] uppercase text-slate-400 mb-4">Nível do Serviço</p>
        <div class="flex gap-3 justify-center" id="stars">
          <button data-v="1" class="size-12 md:size-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center hover:border-primary transition-colors"><span class="material-symbols-outlined text-[28px] text-slate-300">star</span></button>
          <button data-v="2" class="size-12 md:size-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center hover:border-primary transition-colors"><span class="material-symbols-outlined text-[28px] text-slate-300">star</span></button>
          <button data-v="3" class="size-12 md:size-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center hover:border-primary transition-colors"><span class="material-symbols-outlined text-[28px] text-slate-300">star</span></button>
          <button data-v="4" class="size-12 md:size-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center hover:border-primary transition-colors"><span class="material-symbols-outlined text-[28px] text-slate-300">star</span></button>
          <button data-v="5" class="size-12 md:size-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center hover:border-primary transition-colors"><span class="material-symbols-outlined text-[28px] text-slate-300">star</span></button>
        </div>
      </div>
    </div>
  </div>
  <div class="absolute bottom-0 left-0 right-0 p-5 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-white/10 z-20">
    <button id="done" class="w-full bg-primary text-black font-black py-4.5 rounded-[20px] shadow-lg active:scale-95 transition-transform tracking-wider">Tudo Certo, Concluir</button>
  </div>
</div>`;

  d.querySelectorAll('#stars button').forEach(s => {
    s.onclick = () => {
      sr = parseInt(s.dataset.v);
      d.querySelectorAll('#stars button span').forEach(sp => {
        const v = parseInt(sp.parentElement.dataset.v);
        sp.className = 'material-symbols-outlined text-[28px] transition-colors ' + (v <= sr ? 'text-primary drop-shadow-[0_0_8px_rgba(255,217,0,0.5)]' : 'text-slate-300');
      });
    };
  });
  d.querySelector('#done').onclick = () => { currentOrder = null; nav(homeView); };

  // Load PIX Key
  setTimeout(async () => {
    try {
      const driverId = data.driverId || (data.orderId ? (await Orders.get(data.orderId)).driverId : null);
      if (!driverId) throw new Error('Driver ID not found');
      const uRes = await fetch('/api/drivers/' + driverId).then(r => r.json());
      const loader = d.querySelector('#pix-loader');
      const box = d.querySelector('#pix-key-box');
      const inp = d.querySelector('#pix-key-val');

      loader.classList.add('hidden');
      const pixDest = uRes.pixKey;
      if (pixDest) {
        box.classList.remove('hidden');
        box.classList.add('flex');
        inp.value = pixDest;

        d.querySelector('#btn-copy-pix').onclick = () => {
          navigator.clipboard.writeText(pixDest).then(() => {
            const b = d.querySelector('#btn-copy-pix');
            const origHtml = b.innerHTML;
            b.classList.add('bg-green-500', 'text-white', 'border-green-500');
            b.classList.remove('bg-white', 'text-primary');
            b.innerHTML = '<span class="material-symbols-outlined text-sm">check</span>';
            setTimeout(() => {
              b.innerHTML = origHtml;
              b.classList.remove('bg-green-500', 'text-white', 'border-green-500');
              b.classList.add('bg-white', 'text-primary');
            }, 1500);
          });
        };
      } else {
        loader.classList.remove('hidden');
        loader.classList.remove('text-primary');
        loader.classList.add('text-slate-500');
        loader.innerHTML = 'Chave PIX não cadastrada pelo motorista.';
      }
    } catch (e) { /* ignore */ }
  }, 300);

  return d;
}

// ═══ HISTORY ═══
function historyView() {
  const d = document.createElement('div'); d.className = 'view active bg-background-light dark:bg-background-dark';
  d.innerHTML = '<header class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10"><button id="btn-menu" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-black font-bold dark:text-slate-200"><span class="material-symbols-outlined">menu</span></button><h2 class="font-bold text-black font-bold dark:text-white">Historico</h2><div class="size-10"></div></header><main class="flex-1 overflow-y-auto p-4"><div id="hl"><p class="text-slate-500 text-sm text-center py-8">Carregando...</p></div></main>';
  d.querySelector('#btn-menu').onclick = openSidebar;
  (async () => {
    try {
      const o = await Orders.list({ clientId: user.id }); const el = d.querySelector('#hl');
      if (!o.length) { el.innerHTML = '<p class="text-slate-500 text-sm text-center py-8">Nenhum servico</p>'; return; }
      el.innerHTML = o.map(i => '<div class="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-3"><div class="flex-1"><h4 class="font-semibold text-sm text-black font-bold dark:text-white">' + i.serviceName + '</h4><p class="text-xs text-slate-500">' + (i.pickupAddress || '') + '</p></div><p class="text-xs font-bold ' + (i.status === 'completed' ? 'text-green-500' : 'text-primary') + '">' + i.status + '</p></div>').join('');
    } catch { }
  })();
  return d;
}

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
    <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4">
      <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Veículo Reservado</p>
      <p class="text-black font-bold dark:text-white font-medium text-base">${user.vehicleModel || 'Nao cadastrado'}</p>
    </div>
  </div>
  
  <button id="btn-save" class="w-full bg-primary text-black font-bold py-3.5 rounded-xl shadow-lg mt-8 hidden active:scale-[0.98] transition-all">Salvar Alterações</button>
</main>`;

  d.querySelector('#btn-menu').onclick = () => { unlockAudio(); openSidebar(); };
  const hpb = d.querySelector('#header-profile-btn');
  if (hpb) hpb.onclick = () => { unlockAudio(); nav(profileView); };
  const fInput = d.querySelector('#f-input');
  const btnSave = d.querySelector('#btn-save');
  const iName = d.querySelector('#i-name');
  const bEditName = d.querySelector('#b-edit-name');
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

  btnSave.onclick = async () => {
    const fn = iName.value.trim();
    if (fn) user.name = fn;
    if (newPhoto) user.photo = newPhoto;
    saveUser(user);

    // Update server quietly
    try {
      await fetch('/api/clients/' + user.id, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name, photo: user.photo })
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
      buildSidebar(); // refresh sidebar 
    }, 1500);
  };

  return d;
}

// ═══ DRIVER CHAT (Client -> Driver) ═══
function driverChatView(data) {
  const d = document.createElement('div'); d.className = 'view active bg-background-light dark:bg-background-dark';
  const oId = data.orderId || data.id;
  d.innerHTML = `
<div class="flex flex-col" style="height:100dvh">
<header class="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-white/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10">
  <button id="bk" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center"><span class="material-symbols-outlined text-black dark:text-slate-200">arrow_back</span></button>
  <div class="flex-1 min-w-0">
    <h1 class="text-base font-bold text-black dark:text-white truncate">${data.driverName || 'Motorista'}</h1>
    <p class="text-[10px] text-slate-500">Chat do Pedido</p>
  </div>
  <button id="btn-chat-call" class="size-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center active:scale-95"><span class="material-symbols-outlined text-primary">call</span></button>
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

  d.querySelector('#bk').onclick = () => nav(trackingView, data);
  d.querySelector('#btn-chat-call').onclick = () => startCall(data.driverId, data.driverName, data.driverPhoto);



  const msgsEl = d.querySelector('#chat-msgs');

  function renderMsg(m) {
    const mine = m.from === 'client';
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
    socket.emit('order-chat:client-to-driver', { orderId: oId, driverId: data.driverId, clientId: user.id, message: txt, type: 'text' });
    renderMsg({ from: 'client', message: txt, type: 'text', timestamp: new Date().toISOString() });
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
        socket.emit('order-chat:client-to-driver', { orderId: oId, driverId: data.driverId, clientId: user.id, type: 'audio', audioData });
        renderMsg({ from: 'client', type: 'audio', audioData, timestamp: new Date().toISOString() });
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

// --- INIT ---
// Init is handled inside startApp() when DOM is ready

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
    if (currentOrder) nav(trackingView, currentOrder);
    else nav(homeView);
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
  socket.off('call:rejected').on('call:rejected', () => { cleanup(); if (currentOrder) nav(trackingView, currentOrder); else nav(homeView); });
  socket.off('call:ended').on('call:ended', () => { cleanup(); if (currentOrder) nav(trackingView, currentOrder); else nav(homeView); });

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

async function initApp() {
  connectSocket();
  buildSidebar();
  try {
    const orders = await Orders.list({ clientId: user.id });
    const active = orders.find(o => ['searching', 'accepted', 'assigned', 'arrived', 'in_progress', 'pickup'].includes(o.status));
    if (active) {
      currentOrder = active;
      if (active.status === 'searching') nav(searchingView, active);
      else nav(trackingView, active);
    } else {
      nav(homeView);
    }
  } catch (e) {
    console.error('[INIT] Error listing orders:', e);
    nav(homeView);
  }
}

function startApp() {
  console.log('[DEBUG] startApp executing');
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
    initApp();
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
