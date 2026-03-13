import { Admin, Drivers, Clients, Orders } from '../shared/api.js';

const $ = (s) => document.querySelector(s);
let socket = null;
const pages = $('#pages');

// Global Admin Actions
window.unblockDriver = async (id) => {
  if (!confirm('Deseja realmente desbloquear este motorista?')) return;
  try {
    await Admin.unblockDriver(id);
    if (currentPage === 'drivers') loadPage('drivers', true);
    else if (currentPage === 'chat') loadPage('chat', true);
  } catch (err) { alert(err.message); }
};

window.resetDriverBalance = async (id) => {
  if (!confirm('Deseja quitar o débito deste motorista? O saldo será zerado.')) return;
  try {
    await Admin.resetDriverBalance(id);
    if (currentPage === 'drivers') loadPage('drivers', true);
    else if (currentPage === 'chat') loadPage('chat', true);
  } catch (err) { alert(err.message); }
};

window.approveDriver = async (id) => {
  if (!confirm('Deseja aprovar e liberar o acesso deste motorista na plataforma?')) return;
  try {
    await Admin.approveDriver(id);
    const modal = $('#doc-modal');
    if (modal) modal.classList.add('hidden');
    if (currentPage === 'drivers') loadPage('drivers', true);
    else if (currentPage === 'onboarding') loadPage('onboarding', true);
    else if (currentPage === 'chat') loadPage('chat', true);
  } catch (err) { alert(err.message); }
};

window.viewDocuments = async (id) => {
  const drivers = await Drivers.list();
  const d = drivers.find(drv => drv.id === id);
  if (!d) return alert('Motorista não encontrado');

  let modal = $('#doc-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'doc-modal';
    modal.className = 'fixed inset-0 z-[2000] bg-black/95 backdrop-blur-xl hidden flex items-center justify-center p-6';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="saas-card w-full max-w-5xl bg-slate-900 border-2 border-slate-800 shadow-2xl flex flex-col h-[90vh]">
        <div class="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
            <div>
                <h3 class="text-white font-black uppercase text-sm flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary">verified_user</span> 
                    Triagem Operacional: ${d.name}
                </h3>
                <p class="text-[9px] text-text-dim uppercase tracking-widest mt-1">Verificação de identidade e frota</p>
            </div>
            <button onclick="document.getElementById('doc-modal').classList.add('hidden')" class="text-text-dim hover:text-white transition-colors">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        
        <div class="flex-1 overflow-y-auto p-10 custom-scrollbar">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Foto de Perfil -->
                <div class="space-y-4">
                    <p class="text-[10px] font-black text-primary uppercase tracking-widest text-center">FOTO DE PERFIL</p>
                    <div class="aspect-square bg-black rounded-2xl border-2 border-white/5 overflow-hidden shadow-2xl group cursor-zoom-in">
                        ${d.photo ? `<img src="${d.photo}" class="w-full h-full object-cover transition-transform group-hover:scale-110" onclick="window.open(this.src)">` : '<div class="w-full h-full flex items-center justify-center text-text-dim uppercase text-[10px]">Não enviada</div>'}
                    </div>
                </div>
                
                <!-- CNH -->
                <div class="space-y-4">
                    <p class="text-[10px] font-black text-primary uppercase tracking-widest text-center">CARTEIRA (CNH)</p>
                    <div class="aspect-[3/4] bg-black rounded-2xl border-2 border-white/5 overflow-hidden shadow-2xl group cursor-zoom-in">
                        ${d.cnhPhoto || d.onboardingDocuments?.cnh ? `<img src="${d.cnhPhoto || d.onboardingDocuments?.cnh}" class="w-full h-full object-cover transition-transform group-hover:scale-110" onclick="window.open(this.src)">` : '<div class="w-full h-full flex items-center justify-center text-text-dim uppercase text-[10px]">Não enviada</div>'}
                    </div>
                </div>

                <!-- CRLV -->
                <div class="space-y-4">
                    <p class="text-[10px] font-black text-primary uppercase tracking-widest text-center">DOCUMENTO (CRLV)</p>
                    <div class="aspect-[3/4] bg-black rounded-2xl border-2 border-white/5 overflow-hidden shadow-2xl group cursor-zoom-in">
                        ${d.crlvPhoto || d.onboardingDocuments?.crlv ? `<img src="${d.crlvPhoto || d.onboardingDocuments?.crlv}" class="w-full h-full object-cover transition-transform group-hover:scale-110" onclick="window.open(this.src)">` : '<div class="w-full h-full flex items-center justify-center text-text-dim uppercase text-[10px]">Não enviada</div>'}
                    </div>
                </div>
            </div>

            <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                <div class="p-6 bg-slate-800/50 rounded-2xl border border-white/10">
                    <h4 class="text-[10px] font-black text-text-dim uppercase tracking-widest mb-4">Dados Técnicos</h4>
                    <div class="space-y-3 font-mono text-xs">
                        <div class="flex justify-between border-b border-white/5 pb-2">
                           <span class="text-text-dim">VEÍCULO:</span>
                           <span class="text-white">${d.vehicle || 'N/A'}</span>
                        </div>
                        <div class="flex justify-between border-b border-white/5 pb-2">
                           <span class="text-text-dim">PLACA:</span>
                           <span class="text-white uppercase">${d.plate || '---'}</span>
                        </div>
                        <div class="flex justify-between">
                           <span class="text-text-dim">CPF/CNH:</span>
                           <span class="text-white">${d.cpf || d.cnh || '---'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="flex flex-col justify-center gap-4">
                    <button class="w-full bg-signal-green text-black font-black uppercase py-5 rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3" onclick="approveDriver('${d.id}')">
                        Aprovar e Ativar Parceiro <span class="material-symbols-outlined">check_circle</span>
                    </button>
                    <button class="w-full bg-slate-800 text-signal-red font-black uppercase py-4 rounded-2xl border border-signal-red/30 hover:bg-signal-red/10 transition-all flex items-center justify-center gap-3" onclick="alert('Funcionalidade de reprovação será implementada em breve. Por favor, contate o motorista manualmente.')">
                        Sinalizar Irregularidade <span class="material-symbols-outlined">report</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  `;
  modal.classList.remove('hidden');
};

// ─── AUTHENTICATION ───────────────────────────────────
function checkAdminAuth() {
  const logged = sessionStorage.getItem('admin_logged') === 'true' || localStorage.getItem('movvi_admin_logged') === 'true';
  if (logged) {
    if (typeof window.hideLoginOverlay === 'function') {
      window.hideLoginOverlay();
    }
    initAdmin();
  } else {
    $('#login-overlay')?.classList.remove('hidden');
  }
}

$('#admin-login-form').onsubmit = async (e) => {
  e.preventDefault();
  const email = $('#email').value;
  const password = $('#password').value;

  try {
    const res = await Admin.login(email, password);
    if (res.token) {
      sessionStorage.setItem('admin_logged', 'true');
      localStorage.setItem('movvi_admin_logged', 'true');
      if (typeof window.hideLoginOverlay === 'function') {
        window.hideLoginOverlay();
      }
      initAdmin();
    }
  } catch (err) {
    const errEl = $('#login-error');
    errEl.textContent = 'Acesso Negado: ' + (err.message || 'Credenciais inválidas');
    errEl.classList.remove('hidden');
  }
};

// ─── DIAGNOSTICS & LOGOUT ────────────────────────────
$('#btn-diag').onclick = async () => {
  const modal = $('#diag-modal');
  const results = $('#diag-results');
  modal.classList.remove('hidden');
  results.innerHTML = '<p class="text-primary animate-pulse">> Conectando ao núcleo...</p>';

  try {
    const health = await fetch('/api/health').then(r => r.json()).catch(() => ({ status: 'error' }));
    const drivers = await Drivers.list().catch(() => []);
    results.innerHTML += `<p class="text-white mt-4">[API] Status: ${health.status === 'ok' ? 'REDE ATIVA' : 'INTERROMPIDA'}</p>`;
    results.innerHTML += `<p class="text-white">[DB] Drivers: ${drivers.length} registros</p>`;
    results.innerHTML += `<p class="text-signal-green mt-2">> Integridade de sinal verificada.</p>`;
  } catch (e) {
    results.innerHTML += `<p class="text-signal-red mt-2">> Protocolo de erro: ${e.message}</p>`;
  }
};

$('#close-diag').onclick = () => $('#diag-modal').classList.add('hidden');
$('#logout-btn').onclick = () => {
  sessionStorage.clear();
  localStorage.removeItem('movvi_admin_logged');
  location.reload();
};

// ─── INITIALIZATION ──────────────────────────────────
function initAdmin() {
  if (socket) return;
  socket = io();
  socket.on('connect', () => {
    socket.emit('register:admin');
    if (currentPage) loadPage(currentPage);
  });

  socket.on('order:new', () => { if (currentPage === 'dashboard') loadPage('dashboard', true); });
  socket.on('order:updated', () => { if (['dashboard', 'orders'].includes(currentPage)) loadPage(currentPage, true); });
  socket.on('driver:status', () => { if (currentPage === 'dashboard') loadPage('dashboard', true); });
  socket.on('driver:location', (data) => {
    if (currentPage === 'live' && liveMap && driverMarkers[data.driverId]) {
      driverMarkers[data.driverId].setLatLng([data.latitude, data.longitude]);
    }
  });

  socket.on('driver:new_registration', () => {
    const btn = document.querySelector('.nav-item[data-page="onboarding"]');
    if (btn) btn.classList.add('blink-notification');
    if (currentPage === 'onboarding') loadPage('onboarding', true);
  });

  loadPage('dashboard');
}

// ─── NAVIGATION ─────────────────────────────────────
let currentPage = 'dashboard';
async function loadPage(page, isUpdate = false) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
    if (page === 'onboarding' && el.dataset.page === 'onboarding') {
      el.classList.remove('blink-notification');
    }
  });

  const titleMap = {
    dashboard: '— Visão Geral da Operação',
    live: '— Monitoramento Global',
    orders: '— Monitor de Pedidos',
    onboarding: '— Embarcando Parceiros',
    drivers: '— Gestão de Frota Parceira',
    clients: '— Gestão de Base de Clientes',
    pricing: '— Gestão Financeira',
    chat: '— Central de Suporte SAC'
  };
  $('#page-title').textContent = titleMap[page] || '— Movvi Dashboard';

  if (!isUpdate) {
    pages.innerHTML = `
        <div class="flex flex-col items-center justify-center py-40 gap-6 fade-in">
            <div class="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div class="text-center font-mono">
                <p class="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-1">Building Module</p>
                <p class="text-[8px] text-text-dim uppercase tracking-widest">${page.toUpperCase()} // ATTEMPTING_LINK</p>
            </div>
        </div>`;
  }

  const renderers = {
    dashboard: renderDashboard,
    live: renderLive,
    orders: renderOrders,
    onboarding: renderOnboarding,
    drivers: renderDrivers,
    clients: renderClients,
    pricing: renderPricing,
    chat: renderChat
  };

  try {
    if (renderers[page]) await renderers[page](isUpdate);
  } catch (err) {
    pages.innerHTML = `
            <div class="saas-card p-12 text-center border-signal-red/20 bg-signal-red/5 mt-10">
                <span class="material-symbols-outlined text-signal-red text-5xl mb-4">error</span>
                <h3 class="text-white font-black uppercase text-sm mb-2">Erro de Link de Dados</h3>
                <p class="text-[11px] font-mono text-text-dim mb-8 uppercase leading-relaxed max-w-sm mx-auto">Não foi possível carregar o subsistema "${page}". Verifique a conexão com o núcleo.</p>
                <button onclick="location.reload()" class="bg-primary text-black px-10 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl">Reiniciar Interface</button>
            </div>`;
  }
}

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.onclick = () => loadPage(btn.dataset.page);
});

// ─── DASHBOARD ──────────────────────────────────────
async function renderDashboard(isUpdate = false) {
  const stats = await Admin.dashboard();
  const formatBRL = (v) => 'R$ ' + (v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  const drivers = await Drivers.list().catch(() => []);
  const onlineDrivers = drivers.filter(d => d.online).slice(0, 5);

  const onlineListHtml = onlineDrivers.length ? onlineDrivers.map(d => `
    <div class="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-white/5">
       <div class="size-8 rounded-full bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center text-primary">
          ${d.photo ? `<img src="${d.photo}" class="w-full h-full object-cover">` : '<span class="material-symbols-outlined text-sm">person</span>'}
       </div>
       <div class="flex-1 min-w-0">
          <p class="text-xs font-bold text-white truncate">${d.name}</p>
          <p class="text-[9px] text-text-dim uppercase tracking-widest">${d.vehicle || 'N/A'}</p>
       </div>
       <span class="size-2 rounded-full bg-signal-green shadow-[0_0_8px_#10b981] animate-pulse"></span>
    </div>
  `).join('') : '<p class="text-xs text-text-dim px-2">Nenhum parceiro online no momento.</p>';

  const contentHtml = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${isUpdate ? '' : 'fade-up'}">
      ${statCard('reorder', 'Pedidos Hoje', stats.todayOrders, 'text-primary', 'bg-primary/10')}
      ${statCard('leaderboard', 'Receita Operacional', formatBRL(stats.totalPlatformRevenue), 'text-signal-green', 'bg-signal-green/10')}
      ${statCard('account_balance_wallet', 'Débito em Frota', formatBRL(stats.totalDriverDebt), 'text-signal-red', 'bg-signal-red/10')}
      ${statCard('group', 'Total Clientes', stats.totalClients, 'text-signal-blue', 'bg-signal-blue/10')}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 ${isUpdate ? '' : 'fade-up'}" ${isUpdate ? '' : 'style="animation-delay: 0.1s"'}>
      <div class="saas-card lg:col-span-2 p-6">
        <div class="flex items-center justify-between mb-6">
            <h3 class="font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-lg">analytics</span> Fluxo Financeiro RRL
            </h3>
            <span class="text-[8px] font-mono text-text-dim uppercase">Live Feed // ${new Date().toLocaleDateString('pt-BR')}</span>
        </div>
        
        <div class="space-y-6">
            <div>
                <p class="text-[9px] font-black text-text-dim uppercase tracking-widest mb-2">Volume Operacional Bruto (GMV)</p>
                <p class="text-2xl font-black text-white">${formatBRL(stats.totalRevenue)}</p>
                <div class="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
                    <div class="bg-primary h-full" style="width: 100%"></div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                    <p class="text-[8px] font-black text-text-dim uppercase tracking-widest mb-1">Repasse Frota (85%)</p>
                    <p class="text-lg font-black text-signal-blue">${formatBRL(stats.totalDriverEarnings)}</p>
                </div>
                <div class="p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <p class="text-[8px] font-black text-primary uppercase tracking-widest mb-1">Comissão Movvi (15%)</p>
                    <p class="text-lg font-black text-primary">${formatBRL(stats.totalPlatformRevenue)}</p>
                </div>
            </div>

            <div class="flex items-end justify-between border-t border-white/5 pt-4">
                <div>
                   <p class="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1">Margem de Operação</p>
                   <p class="text-lg font-black text-white">15.00%</p>
                </div>
                <div class="text-right">
                   <p class="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1">Ganhos em 24h</p>
                   <p class="text-lg font-black text-signal-green">+ ${formatBRL(stats.todayRevenue || 0)}</p>
                </div>
            </div>
        </div>
      </div>

      <div class="saas-card p-6 bg-slate-900/30">
        <h3 class="font-black text-[11px] uppercase tracking-widest flex items-center gap-2 mb-6">
            <span class="material-symbols-outlined text-signal-green text-lg">group</span> Frota Disponível
        </h3>
        
        <div class="space-y-4">
            <div class="text-center py-4 border-b border-white/5">
                <p class="text-3xl font-black text-white mb-1">${stats.totalDrivers}</p>
                <p class="text-[8px] font-black text-text-dim uppercase tracking-[0.2em]">Parceiros Registrados</p>
            </div>

            <div class="space-y-3">
                <div class="flex justify-between items-center p-3 bg-bg-main rounded-lg border border-white/5">
                    <span class="text-[10px] font-bold text-text-dim uppercase">Online Agora</span>
                    <span class="text-[10px] font-black text-signal-green">${stats.onlineDrivers} Units</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-bg-main rounded-lg border border-white/5">
                    <span class="text-[10px] font-bold text-text-dim uppercase">Alerta de Débito</span>
                    <span class="text-[10px] font-black text-signal-red">${stats.blockedDrivers || 0} Units</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-bg-main rounded-lg border border-white/5">
                    <span class="text-[10px] font-bold text-text-dim uppercase">Clientes Ativos</span>
                    <span class="text-[10px] font-black text-white">${stats.totalClients} Profiles</span>
                </div>
            </div>
            
            <div class="mt-8 pt-6 border-t border-white/5">
                <p class="text-[10px] font-black text-text-dim uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm text-signal-green">sensors</span> Parceiros Conectados (Top 5)
                </p>
                <div class="space-y-3">
                   ${onlineListHtml}
                </div>
            </div>
        </div>
      </div>
    </div>`;

  if (isUpdate && pages.querySelector('#dash-wrapper')) {
    pages.querySelector('#dash-wrapper').innerHTML = contentHtml;
  } else {
    pages.innerHTML = `<div id="dash-wrapper" class="w-full">${contentHtml}</div>`;
  }
}

function statCard(icon, label, value, color, bg) {
  return `
    <div class="saas-card p-5 group">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-[10px] font-black text-text-dim uppercase tracking-widest mb-2">${label}</p>
          <p class="text-2xl font-black text-white tracking-tight">${value}</p>
        </div>
        <div class="size-10 ${bg} ${color} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
          <span class="material-symbols-outlined text-[20px]">${icon}</span>
        </div>
      </div>
    </div>`;
}

// ─── LIVE MONITOR ──────────────────────────────────
let liveMap = null, driverMarkers = {}, clientMarkers = {};
async function renderLive() {
  pages.innerHTML = `<div id="live-map" class="w-full h-[650px] shadow-2xl fade-up border border-white/10 rounded-2xl overflow-hidden saas-card"></div>`;

  const [drivers, clients, orders] = await Promise.all([Drivers.list(), Clients.list(), Admin.orders()]);

  if (liveMap) liveMap.remove();
  liveMap = L.map('live-map', { zoomControl: false }).setView([-23.55, -46.63], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png').addTo(liveMap);

  const allCoords = [];
  drivers.forEach(d => {
    if (d.latitude && d.longitude) {
      allCoords.push([d.latitude, d.longitude]);
      const isOnline = d.online;
      const color = isOnline ? '#ffdb00' : '#4a4a4a';

      const icon = L.divIcon({
        className: 'custom-icon',
        html: `
          <div class="relative group">
            <div class="size-10 bg-slate-900 border-2 border-[${color}] rounded-2xl flex items-center justify-center text-[${color}] shadow-2xl transition-transform hover:scale-110">
                <span class="material-symbols-outlined text-xl">${isOnline ? 'local_shipping' : 'block'}</span>
                ${isOnline ? `<div class="absolute -top-1 -right-1 size-3 bg-signal-green rounded-full border-2 border-slate-900 animate-pulse"></div>` : ''}
            </div>
          </div>`,
        iconSize: [40, 40], iconAnchor: [20, 20]
      });

      const popupHtml = `
        <div class="p-4 w-60">
           <div class="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
              <div class="size-10 bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                 ${d.photo ? `<img src="${d.photo}" class="w-full h-full object-cover">` : `<span class="material-symbols-outlined text-text-dim">person</span>`}
              </div>
              <div>
                 <h4 class="font-black text-sm text-white uppercase tracking-tight">${d.name}</h4>
                 <p class="text-[9px] font-black ${isOnline ? 'text-signal-green' : 'text-text-dim'} uppercase">${isOnline ? 'CANAL ATIVO' : 'SINAL PERDIDO'}</p>
              </div>
           </div>
           <div class="space-y-1.5 mb-4 font-mono text-[9px]">
             <div class="flex justify-between text-text-dim uppercase"><span>Frota:</span><span class="text-white">${d.vehicle || 'N/A'}</span></div>
             <div class="flex justify-between text-text-dim uppercase"><span>Rating:</span><span class="text-primary font-bold">★ ${d.rating || '5.0'}</span></div>
           </div>
           ${d.activeOrderId ? `<div class="bg-primary text-black p-2 font-black text-center text-[10px] rounded-lg tracking-widest uppercase shadow-lg">MISSÃO EM CURSO</div>` : ''}
        </div>`;

      driverMarkers[d.id] = L.marker([d.latitude, d.longitude], { icon })
        .addTo(liveMap)
        .bindPopup(popupHtml, { className: 'custom-popup-saas', offset: [0, -10] });
    }
  });

  if (allCoords.length > 0) {
    liveMap.fitBounds(allCoords, { padding: [100, 100], maxZoom: 15 });
  }
}

// ─── ORDERS ─────────────────────────────────────────
async function renderOrders() {
  const orders = await Admin.orders();
  pages.innerHTML = `
    <div class="saas-card p-10 fade-up">
      <div class="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
        <h3 class="font-black text-base uppercase tracking-widest flex items-center gap-4">
            <span class="material-symbols-outlined text-primary text-2xl">receipt_long</span> Log de Operações
            <span class="bg-slate-900 border border-white/5 px-3 py-1 rounded-full text-[10px] text-text-dim font-black">${orders.length} TICKETS</span>
        </h3>
      </div>

      <div class="overflow-hidden rounded-2xl border border-white/5">
        <table class="w-full text-left bg-slate-900/20">
          <thead class="bg-slate-900 border-b border-white/5">
            <tr class="text-[10px] text-text-dim uppercase font-black tracking-widest">
              <th class="p-6">UID_Protocol</th><th class="p-6">Sujeito</th><th class="p-6">Operador</th>
              <th class="p-6">Serviço</th><th class="p-6">Créditos</th><th class="p-6">Status</th>
            </tr>
          </thead>
          <tbody class="text-xs font-bold divide-y divide-white/5">
            ${orders.map(o => `
            <tr class="hover:bg-white/[0.02] transition-colors group">
              <td class="p-6 font-mono text-text-dim text-[10px] uppercase">${o.id.slice(0, 8)}</td>
              <td class="p-6 text-white group-hover:text-primary transition-colors">${o.clientName}</td>
              <td class="p-6 text-slate-300">${o.driverName || '<span class="text-signal-red animate-pulse italic">LOCALIZANDO...</span>'}</td>
              <td class="p-6 text-text-dim truncate max-w-[150px]">${o.serviceName}</td>
              <td class="p-6 text-primary font-black">R$ ${(o.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              <td class="p-6">
                 <span class="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusPillClass(o.status)}">
                    ${o.status.replace('_', ' ')}
                 </span>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

function getStatusPillClass(status) {
  if (['completed', 'arrived'].includes(status)) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
  if (['cancelled'].includes(status)) return 'bg-red-500/10 text-red-500 border-red-500/30';
  if (['in_progress', 'pickup'].includes(status)) return 'bg-signal-blue/10 text-signal-blue border-signal-blue/30';
  return 'bg-primary/10 text-primary border-primary/30';
}

// ─── ONBOARDING ───────────────────────────────────────
async function renderOnboarding() {
  const allDrivers = await Drivers.list();
  const pendingDrivers = allDrivers.filter(d => !d.approved && d.onboardingStep);
  pages.innerHTML = `
    <div class="saas-card p-10 fade-up">
      <div class="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
        <h3 class="font-black text-base uppercase tracking-widest flex items-center gap-4">
            <span class="material-symbols-outlined text-primary text-2xl">how_to_reg</span> Embarque de Parceiros
            <span class="bg-slate-900 border border-white/5 px-3 py-1 rounded-full text-[10px] text-text-dim font-black">${pendingDrivers.length} AGUARDANDO APROVAÇÃO</span>
        </h3>
      </div>

      <div class="overflow-hidden rounded-2xl border border-white/5">
        <table class="w-full text-left bg-slate-900/20">
          <thead class="bg-slate-900 border-b border-white/5">
            <tr class="text-[10px] text-text-dim uppercase font-black tracking-widest">
              <th class="p-6">Operador</th>
              <th class="p-6">Documentação</th>
              <th class="p-6">Kit Operacional</th>
              <th class="p-6">Status Embarque</th>
              <th class="p-6 text-right">Ação</th>
            </tr>
          </thead>
          <tbody class="text-xs font-bold divide-y divide-white/5">
            ${pendingDrivers.length === 0 ? '<tr><td colspan="5" class="p-10 text-center text-text-dim uppercase">Nenhum parceiro na fila de embarque.</td></tr>' :
      pendingDrivers.map(d => `
            <tr class="hover:bg-white/[0.02] transition-colors group">
              <td class="p-6">
                <div class="flex items-center gap-3">
                    <div class="size-8 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
                        ${d.photo ? '<img src="' + d.photo + '" class="size-full object-cover">' : '<span class="material-symbols-outlined text-sm text-text-dim">person</span>'}
                    </div>
                    <div>
                      <span class="text-white block">${d.name}</span>
                      <span class="text-[10px] text-text-dim uppercase">${d.vehicle || 'Sem veículo'} ${d.plate ? ' | ' + d.plate : ''}</span>
                    </div>
                </div>
              </td>
              <td class="p-6">
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-2 text-[10px] uppercase font-bold ${d.cnhStatus === 'submitted' ? 'text-signal-green' : 'text-text-dim'}">
                    <span class="material-symbols-outlined text-sm">${d.cnhStatus === 'submitted' ? 'check_circle' : 'pending'}</span> CNH
                  </div>
                  <div class="flex items-center gap-2 text-[10px] uppercase font-bold ${d.crlvStatus === 'submitted' ? 'text-signal-green' : 'text-text-dim'}">
                    <span class="material-symbols-outlined text-sm">${d.crlvStatus === 'submitted' ? 'check_circle' : 'pending'}</span> CRLV
                  </div>
                </div>
              </td>
              <td class="p-6">
                <div class="flex items-center gap-2 text-[10px] uppercase font-bold ${d.kitAcquired ? 'text-signal-green' : 'text-text-dim'}">
                   <span class="material-symbols-outlined text-sm">${d.kitAcquired ? 'inventory_2' : 'do_not_disturb_on'}</span>
                   ${d.kitAcquired ? 'KIT PAGO / LIBERADO' : 'AGUARDANDO PAGTO'}
                </div>
              </td>
              <td class="p-6">
                 <span class="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${d.onboardingStep === 'pending_approval' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-slate-800 text-text-dim border-slate-700'}">
                    ${d.onboardingStep === 'pending_approval' ? 'APROVAÇÃO FINAL' : 'PREENCHIMENTO'}
                 </span>
              </td>
              <td class="p-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button class="bg-primary/10 text-primary hover:bg-primary hover:text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2" onclick="viewDocuments('${d.id}')">
                    <span class="material-symbols-outlined text-sm">visibility</span>
                    Avaliar Perfil
                  </button>
                </div>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

// ─── DRIVERS ────────────────────────────────────────
async function renderDrivers() {
  const drivers = await Drivers.list();
  pages.innerHTML = `
    <div class="saas-card p-10 fade-up">
      <div class="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
        <h3 class="font-black text-base uppercase tracking-widest flex items-center gap-4">
            <span class="material-symbols-outlined text-primary text-2xl">local_shipping</span> Intelligence: Frota Parceira
            <span class="bg-slate-900 border border-white/5 px-3 py-1 rounded-full text-[10px] text-text-dim font-black">${drivers.length} NÓS ATIVOS</span>
        </h3>
        <div class="flex gap-4">
            <button class="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-700 transition-all">Exportar Log</button>
        </div>
      </div>

      <div class="overflow-hidden rounded-2xl border border-white/5">
        <table class="w-full text-left bg-slate-900/20">
          <thead class="bg-slate-900 border-b border-white/5">
            <tr class="text-[10px] text-text-dim uppercase font-black tracking-widest">
              <th class="p-6">Identificador</th><th class="p-6">Operador</th><th class="p-6">Frota/Unit</th>
              <th class="p-6">Wallet Balance</th><th class="p-6">Selo Operação</th><th class="p-6 text-right">Ação</th>
            </tr>
          </thead>
          <tbody class="text-xs font-bold divide-y divide-white/5">
            ${drivers.map(d => `
            <tr class="hover:bg-white/[0.02] transition-colors group">
              <td class="p-6 font-mono text-text-dim text-[10px] uppercase">${d.id.slice(0, 8)}</td>
              <td class="p-6">
                <div class="flex items-center gap-3">
                    <div class="size-8 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden">
                        ${d.photo ? `<img src="${d.photo}" class="size-full object-cover">` : '<span class="material-symbols-outlined text-sm text-text-dim">person</span>'}
                    </div>
                    <span class="text-white">${d.name}</span>
                </div>
              </td>
              <td class="p-6 text-slate-300">
                <p class="mb-0.5">${d.vehicle || 'N/A'}</p>
                <p class="text-[10px] font-mono text-text-dim uppercase">${d.plate || '---'}</p>
              </td>
              <td class="p-6">
                <span class="${(d.walletBalance || 0) < 0 ? 'text-signal-red' : 'text-signal-green'} font-black text-sm">
                    R$ ${(d.walletBalance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                ${(d.walletBalance || 0) <= -50 ? '<div class="text-[8px] text-signal-red uppercase font-black tracking-widest mt-1">SINAL BLOQUEADO</div>' : ''}
              </td>
              <td class="p-6">
                 <span class="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${d.approved ? 'bg-signal-green/10 text-signal-green border-signal-green/30' : 'bg-slate-800 text-text-dim border-slate-700'}">
                    ${d.approved ? 'AUTORIZADO' : 'AGUARDANDO'}
                 </span>
              </td>
              <td class="p-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  ${!d.approved ? `
                    <button class="bg-signal-green/10 text-signal-green hover:bg-signal-green hover:text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all" onclick="approveDriver('${d.id}')">
                      Liberar Acesso
                    </button>
                  ` : ''}
                  ${d.blocked || (d.walletBalance || 0) <= -50 ? `
                    <button class="bg-signal-red/10 text-signal-red hover:bg-signal-red hover:text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all" onclick="resetDriverBalance('${d.id}')">
                      Quitar Débito
                    </button>
                    <button class="bg-primary/10 text-primary hover:bg-primary hover:text-black px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all" onclick="unblockDriver('${d.id}')">
                      Desbloquear
                    </button>
                  ` : ''}
                  <button class="text-text-dim hover:text-primary p-2 rounded-lg transition-all" onclick="alert('Dados do Motorista: ${d.name}')">
                    <span class="material-symbols-outlined">settings</span>
                  </button>
                </div>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;

  // No need to attach here anymore, moved to global scope
}

// ─── CLIENTS ────────────────────────────────────────
async function renderClients() {
  const clients = await Clients.list();
  pages.innerHTML = `
    <div class="saas-card p-10 fade-up">
      <div class="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
        <h3 class="font-black text-base uppercase tracking-widest flex items-center gap-4">
            <span class="material-symbols-outlined text-primary text-2xl">group</span> Intelligence: Base de Clientes
            <span class="bg-slate-900 border border-white/5 px-3 py-1 rounded-full text-[10px] text-text-dim font-black">${clients.length} PERFIS REGISTRADOS</span>
        </h3>
      </div>

      <div class="overflow-hidden rounded-2xl border border-white/5">
        <table class="w-full text-left bg-slate-900/20">
          <thead class="bg-slate-900 border-b border-white/5">
            <tr class="text-[10px] text-text-dim uppercase font-black tracking-widest">
              <th class="p-6">ProfileID</th><th class="p-6">Usuário</th><th class="p-6">Contato</th>
              <th class="p-6">Histórico Sessão</th><th class="p-6 text-right">Controle</th>
            </tr>
          </thead>
          <tbody class="text-xs font-bold divide-y divide-white/5">
            ${clients.map(c => `
            <tr class="hover:bg-white/[0.02] transition-colors group">
              <td class="p-6 font-mono text-text-dim text-[10px] uppercase">${c.id.slice(0, 8)}</td>
              <td class="p-6">
                <div class="flex items-center gap-3">
                    <div class="size-8 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden">
                        ${c.photo ? `<img src="${c.photo}" class="size-full object-cover">` : '<span class="material-symbols-outlined text-sm text-text-dim">account_circle</span>'}
                    </div>
                    <span class="text-white">${c.name}</span>
                </div>
              </td>
              <td class="p-6 text-slate-300 font-mono text-[11px]">${c.email}<br><span class="text-text-dim">${c.phone || 'N/A'}</span></td>
              <td class="p-6">
                 <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-sm">history</span>
                    <span class="text-white font-black">${c.totalOrders || 0} Chamados</span>
                 </div>
              </td>
              <td class="p-6 text-right">
                <button class="text-text-dim hover:text-white transition-colors" onclick="alert('Log detalhado do cliente ID: ${c.id}')">
                    <span class="material-symbols-outlined">open_in_new</span>
                </button>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

// ─── PLACEHOLDERS ────────────────────────────────────
async function renderPricing() {
  const [pr, settings] = await Promise.all([
    fetch('/api/pricing').then(r => r.json()),
    fetch('/api/pricing/settings').then(r => r.json())
  ]);

  let html = `<div class="p-6">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-black text-white font-space tracking-tight">Configurações Globais</h1>
        <p class="text-text-dim text-sm uppercase tracking-widest mt-1">Configure o sistema e valores operacionais</p>
      </div>
      <button id="save-pricing" class="bg-primary hover:bg-primary/90 text-black font-black px-6 py-3 rounded-xl shadow-lg hover:-translate-y-1 transition-transform flex items-center gap-2">
        <span class="material-symbols-outlined shrink-0 text-black">save</span>
        <span class="text-black">Salvar Todas as Alterações</span>
      </button>
    </div>

    <!-- System Settings Section -->
    <div class="saas-card p-8 mb-8 border-primary/20 bg-primary/5">
      <div class="flex items-center gap-3 mb-8">
        <span class="material-symbols-outlined text-primary text-3xl">settings_input_component</span>
        <h2 class="text-xl font-bold text-white uppercase tracking-widest leading-none">Status do Sistema (Lockdown)</h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label class="text-xs font-bold text-text-dim uppercase tracking-widest mb-3 block">Modo Pré-Lançamento (Bloqueia o Site)</label>
          <div class="flex items-center gap-4">
            <button id="toggle-lockdown" class="px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${settings.systemLockdown ? 'bg-signal-red text-white' : 'bg-slate-800 text-text-dim border border-white/5'}">
              ${settings.systemLockdown ? 'ATIVADO (Site Bloqueado)' : 'DESATIVADO (Site Aberto)'}
            </button>
            <p class="text-[10px] text-text-dim/60 font-mono uppercase">Status: ${settings.systemLockdown ? 'BLOCKED' : 'LIVE'}</p>
          </div>
        </div>
        <div>
          <label class="text-xs font-bold text-text-dim uppercase tracking-widest mb-3 block">Data Oficial de Lançamento (Contador)</label>
          <input type="date" id="launch-date" class="w-full bg-slate-950 border border-slate-700/50 rounded-xl px-5 py-3 text-white focus:border-primary outline-none transition-all" value="${settings.launchDate || '2026-04-20'}">
        </div>
        <div>
          <label class="text-xs font-bold text-text-dim uppercase tracking-widest mb-3 block">Total de Vagas - Fase 01</label>
          <input type="number" id="total-spots" class="w-full bg-slate-950 border border-slate-700/50 rounded-xl px-5 py-3 text-white focus:border-primary outline-none transition-all font-black text-xl" value="${settings.totalSpotsPhase1 || 100}">
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">`;

  for (const [key, svc] of Object.entries(pr.services)) {
    html += `
      <div class="saas-card relative overflow-hidden group">
        <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative z-10 p-6">
          <div class="flex items-center gap-3 mb-6">
            <span class="material-symbols-outlined text-primary text-3xl">build_circle</span>
            <h2 class="text-xl font-bold text-white uppercase tracking-widest leading-none">${svc.name}</h2>
          </div>
          <div class="space-y-4">
            <div>
              <label class="text-xs font-bold text-text-dim uppercase tracking-widest mb-1 block pl-1">Taxa Base (Deslocamento)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black font-black opacity-50 text-sm">R$</span>
                <input type="number" step="0.01" id="base-${key}" class="w-full bg-slate-50 text-black font-black text-lg py-3 pl-12 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-primary border-transparent transition-all" value="${svc.basePrice}">
              </div>
            </div>
            <div>
              <label class="text-xs font-bold text-text-dim uppercase tracking-widest mb-1 block pl-1">Valor por Km (Adicional)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black font-black opacity-50 text-sm">R$</span>
                <input type="number" step="0.01" id="km-${key}" class="w-full bg-slate-50 text-black font-black text-lg py-3 pl-12 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-primary border-transparent transition-all" value="${svc.pricePerKm}">
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  html += `</div></div>`;
  pages.innerHTML = html;

  let isLocked = settings.systemLockdown;
  const btnLock = document.querySelector('#toggle-lockdown');
  btnLock.onclick = () => {
    isLocked = !isLocked;
    btnLock.className = `px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${isLocked ? 'bg-signal-red text-white' : 'bg-slate-800 text-text-dim border border-white/5'}`;
    btnLock.innerText = isLocked ? 'ATIVADO (Site Bloqueado)' : 'DESATIVADO (Site Aberto)';
  };

  const btnSave = document.querySelector('#save-pricing');
  btnSave.onclick = async () => {
    btnSave.innerHTML = '<span class="material-symbols-outlined shrink-0 text-black animate-spin">progress_activity</span> <span class="text-black">Salvando...</span>';
    
    // Save Pricing
    const pricingPayload = { services: {} };
    for (const key of Object.keys(pr.services)) {
      pricingPayload.services[key] = {
        basePrice: parseFloat(document.querySelector(`#base-${key}`).value),
        pricePerKm: parseFloat(document.querySelector(`#km-${key}`).value)
      };
    }

    // Save Settings
    const settingsPayload = {
      systemLockdown: isLocked,
      launchDate: document.querySelector('#launch-date').value,
      totalSpotsPhase1: parseInt(document.querySelector('#total-spots').value) || 100
    };

    try {
      await Promise.all([
        fetch('/api/pricing', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pricingPayload)
        }),
        fetch('/api/pricing/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settingsPayload)
        })
      ]);

      btnSave.classList.replace('bg-primary', 'bg-emerald-500');
      btnSave.innerHTML = '<span class="material-symbols-outlined shrink-0 text-white">check_circle</span> <span class="text-white">Sincronizado!</span>';
      setTimeout(() => {
        btnSave.classList.replace('bg-emerald-500', 'bg-primary');
        btnSave.innerHTML = '<span class="material-symbols-outlined shrink-0 text-black">save</span> <span class="text-black">Salvar Todas as Alterações</span>';
      }, 2000);
    } catch {
      alert('Erro ao sincronizar configurações.');
      btnSave.innerHTML = '<span class="material-symbols-outlined shrink-0 text-black">save</span> <span class="text-black">Salvar Todas as Alterações</span>';
    }
  };
}
async function renderChat() {
  const drivers = await Drivers.list().catch(() => []);
  let activeDriverId = null;

  pages.innerHTML = `
    <div class="flex h-[calc(100vh-160px)] gap-6 fade-up">
      <!-- Chat List (Left) -->
      <div class="w-80 saas-card flex flex-col overflow-hidden bg-slate-900/30">
        <div class="p-6 border-b border-white/5">
          <h3 class="font-black text-[10px] uppercase tracking-[0.3em] text-text-dim">Canais de Suporte</h3>
        </div>
        <div id="chat-list" class="flex-1 overflow-y-auto divide-y divide-white/5">
          ${drivers.length ? drivers.map(d => `
            <div class="chat-item p-4 hover:bg-white/5 cursor-pointer transition-colors" data-id="${d.id}">
              <div class="flex items-center gap-3">
                <div class="size-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-white/10 overflow-hidden">
                  ${d.photo ? `<img src="${d.photo}" class="size-full object-cover">` : '<span class="material-symbols-outlined text-text-dim">person</span>'}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-[11px] font-black text-white truncate uppercase">${d.name}</p>
                  <p class="text-[9px] text-text-dim uppercase tracking-widest truncate">${d.vehicle || 'Driver Partner'}</p>
                </div>
                <div id="badge-${d.id}" class="hidden size-2 bg-primary rounded-full shadow-[0_0_8px_#ffdb00]"></div>
              </div>
            </div>
          `).join('') : '<p class="p-6 text-[10px] text-text-dim text-center uppercase tracking-widest">Nenhum canal ativo</p>'}
        </div>
      </div>

      <!-- Chat Area (Right) -->
      <div class="flex-1 saas-card flex flex-col overflow-hidden bg-slate-900/30 relative">
        <div id="chat-header" class="p-6 border-b border-white/5 flex items-center justify-between">
           <p class="text-[11px] font-black text-text-dim uppercase tracking-widest">Selecione um canal para iniciar</p>
        </div>
        
        <div id="chat-messages" class="flex-1 overflow-y-auto p-8 space-y-6 flex flex-col">
           <div class="m-auto text-center opacity-20">
              <span class="material-symbols-outlined text-6xl mb-4">forum</span>
              <p class="text-[10px] font-black uppercase tracking-widest">Terminal de Comunicação Criptografado</p>
           </div>
        </div>

        <form id="chat-form" class="p-6 bg-slate-900/50 border-t border-white/5 hidden">
            <div class="flex items-center gap-4 bg-slate-800/50 p-2 rounded-2xl border border-white/5">
                <button type="button" id="btn-attach" class="size-12 rounded-xl flex items-center justify-center text-text-dim hover:text-primary hover:bg-white/5 transition-all">
                    <span class="material-symbols-outlined">attach_file</span>
                </button>
                <input type="file" id="chat-file-input" class="hidden" accept="image/*,.pdf">
                <input id="chat-input" class="flex-1 bg-transparent border-none text-white text-sm outline-none px-2 font-medium" placeholder="Digite uma resposta..." autocomplete="off">
                <button type="submit" class="bg-primary text-black size-12 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
                    <span class="material-symbols-outlined">send</span>
                </button>
            </div>
        </form>
      </div>
    </div>`;

  const messagesPanel = $('#chat-messages');
  const chatHeader = $('#chat-header');
  const chatForm = $('#chat-form');
  const chatInput = $('#chat-input');
  const fileInput = $('#chat-file-input');
  const btnAttach = $('#btn-attach');

  if (btnAttach) btnAttach.onclick = () => fileInput.click();

  async function selectDriver(id) {
    activeDriverId = id;
    const driver = drivers.find(d => d.id === id);
    $(`#badge-${id}`)?.classList.add('hidden');

    chatHeader.innerHTML = `
      <div class="flex items-center gap-4">
        <div class="size-10 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
          ${driver.photo ? `<img src="${driver.photo}" class="size-full object-cover">` : '<span class="material-symbols-outlined text-text-dim">person</span>'}
        </div>
        <div>
          <h4 class="text-xs font-black text-white uppercase tracking-tight">${driver.name}</h4>
          <p class="text-[9px] text-signal-green font-black uppercase tracking-widest">DRIVER_ID: ${id.slice(0, 8)} // LINK_STABLE</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button class="bg-signal-red/10 text-signal-red px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border border-signal-red/20" onclick="resetDriverBalance('${id}')">Zerar Débito</button>
      </div>
    `;

    chatForm.classList.remove('hidden');
    messagesPanel.innerHTML = '<div class="m-auto animate-pulse text-[10px] uppercase font-black text-text-dim tracking-widest">Resgatando Histórico...</div>';

    socket.emit('chat:get-history', { driverId: id });
    socket.once('chat:history', ({ messages }) => {
      messagesPanel.innerHTML = '';
      messages.forEach(renderMsg);
      messagesPanel.scrollTop = messagesPanel.scrollHeight;
    });

    document.querySelectorAll('.chat-item').forEach(el => {
      el.classList.toggle('bg-primary/10', el.dataset.id === id);
      el.classList.toggle('border-primary/20', el.dataset.id === id);
    });
  }

  function renderMsg(m) {
    if (m.driverId !== activeDriverId) return;
    const mine = m.from === 'admin';
    const time = new Date(m.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const div = document.createElement('div');
    div.className = `flex ${mine ? 'justify-end' : 'justify-start'} w-full`;

    let content = '';
    if (m.file) {
      if (m.file.startsWith('data:image')) {
        content = `<div class="mb-2 relative group">
          <img src="${m.file}" class="max-w-xs rounded-xl border border-white/10 cursor-zoom-in transition-all group-hover:brightness-110" onclick="window.open('${m.file}')">
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-xl pointer-events-none">
            <span class="material-symbols-outlined text-white">open_in_new</span>
          </div>
        </div>`;
      } else {
        content = `<div class="flex items-center gap-3 p-3 bg-white/5 rounded-xl mb-2 border border-white/5">
          <span class="material-symbols-outlined text-primary">description</span>
          <a href="${m.file}" target="_blank" class="text-[10px] font-black uppercase tracking-widest text-primary underline">Ver Documento (Anexo)</a>
        </div>`;
      }
    }
    if (m.message) {
      content += `<p class="text-[13px] leading-relaxed font-medium">${m.message}</p>`;
    }

    div.innerHTML = `
      <div class="max-w-[70%] group">
        <div class="flex items-center gap-2 mb-1 px-1">
           <span class="text-[8px] font-black text-text-dim uppercase">${mine ? 'ADMIN_CMD' : 'DRIVER_SIG'}</span>
           <span class="text-[8px] font-mono text-text-dim/50">${time}</span>
        </div>
        <div class="p-4 rounded-2xl ${mine ? 'bg-primary text-black rounded-tr-none shadow-[0_4px_15px_-5px_rgba(255,219,0,0.3)]' : 'bg-slate-800 text-white rounded-tl-none border border-white/5 shadow-xl'} transition-all">
          ${content}
        </div>
      </div>`;

    messagesPanel.appendChild(div);
    messagesPanel.scrollTop = messagesPanel.scrollHeight;
  }

  document.querySelectorAll('.chat-item').forEach(el => {
    el.onclick = () => selectDriver(el.dataset.id);
  });

  socket.off('chat:new-message').on('chat:new-message', (msg) => {
    if (msg.driverId === activeDriverId) {
      renderMsg(msg);
    } else {
      $(`#badge-${msg.driverId}`)?.classList.remove('hidden');
    }
  });

  chatForm.onsubmit = (e) => {
    e.preventDefault();
    const txt = chatInput.value.trim();
    if (!txt && !fileInput.files[0]) return;

    socket.emit('chat:admin-to-driver', { driverId: activeDriverId, message: txt });
    renderMsg({ from: 'admin', driverId: activeDriverId, message: txt, timestamp: new Date().toISOString() });
    chatInput.value = '';
  };

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      socket.emit('chat:admin-to-driver', { driverId: activeDriverId, message: '', file: reader.result });
      renderMsg({ from: 'admin', driverId: activeDriverId, message: '', file: reader.result, timestamp: new Date().toISOString() });
      fileInput.value = '';
    };
    reader.readAsDataURL(file);
  };
}


checkAdminAuth();
