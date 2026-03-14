import { api } from '../shared/api.js';

const $ = (s) => document.querySelector(s);
let partner = null;

// ─── SOCKET LOGIC ──────────────────────────────────────
const socket = io();

socket.on('order:searching', (data) => {
    if ($('#status-msg')) {
        $('#status-msg').textContent = data.message;
    }
});

socket.on('order:accepted', (order) => {
    alert(`Motorista ${order.driverName} aceitou seu chamado!`);
    renderHistory();
});

socket.on('order:status', (data) => {
    renderHistory();
});

// ─── AUTH LOGIC ───────────────────────────────────────
async function checkAuth() {
    const loggedStr = localStorage.getItem('movvi_partner');
    if (loggedStr) {
        try {
            const storedPartner = JSON.parse(loggedStr);
            // Verify status with server
            const res = await api(`/partners/${storedPartner.id}/profile`);
            if (!res.active) {
                throw new Error('Conta aguardando aprovação');
            }
            partner = res;
            localStorage.setItem('movvi_partner', JSON.stringify(partner));
            socket.emit('join', `client_${partner.id}`);
            showApp();
        } catch (err) {
            console.error('Auth verification failed:', err);
            localStorage.removeItem('movvi_partner');
            $('#login-overlay').classList.remove('hidden');
        }
    }
}

function showApp() {
    $('#login-overlay').classList.add('hidden');
    $('#main-app').classList.remove('opacity-0');
    $('#partner-name').textContent = partner.name || 'Parceiro';
    $('#partner-company').textContent = partner.companyName || 'Empresa';
    renderNewRequest();
}

// Switch UI
$('#show-register').onclick = (e) => {
    e.preventDefault();
    $('#login-form').classList.add('hidden');
    $('#register-form').classList.remove('hidden');
    $('#auth-title').textContent = 'Credenciamento';
};

$('#show-login').onclick = (e) => {
    e.preventDefault();
    $('#register-form').classList.add('hidden');
    $('#login-form').classList.remove('hidden');
    $('#auth-title').textContent = 'Acesso Business';
};

$('#login-form').onsubmit = async (e) => {
    e.preventDefault();
    const email = $('#email').value;
    const password = $('#password').value;
    const errEl = $('#login-error');
    errEl.classList.add('hidden');

    try {
        const res = await api('/auth/login/partner', { method: 'POST', body: { email, password } });
        partner = res.user;
        localStorage.setItem('movvi_partner', JSON.stringify(partner));
        socket.emit('join', `client_${partner.id}`);
        showApp();
    } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.remove('hidden');
    }
};

$('#register-form').onsubmit = async (e) => {
    e.preventDefault();
    const errEl = $('#reg-error');
    errEl.classList.add('hidden');

    const payload = {
        companyName: $('#reg-company').value,
        name: $('#reg-name').value,
        email: $('#reg-email').value,
        phone: $('#reg-phone').value,
        password: $('#reg-password').value
    };

    try {
        await api('/auth/register/partner', { method: 'POST', body: payload });
        $('#register-form').classList.add('hidden');
        $('#pending-reg').classList.remove('hidden');
        $('#auth-title').textContent = 'Solicitação Enviada';
    } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.remove('hidden');
    }
};

$('#logout-btn').onclick = () => {
    localStorage.removeItem('movvi_partner');
    location.reload();
};

// ─── NAVIGATION ─────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(item => {
    item.onclick = () => {
        document.querySelectorAll('.nav-item').forEach(v => v.classList.remove('active'));
        item.classList.add('active');
        const view = item.dataset.content;
        if (view === 'new-request') renderNewRequest();
        else if (view === 'history') renderHistory();
        else if (view === 'billing') renderBilling();
    };
});

// ─── VIEWS ──────────────────────────────────────────
async function renderNewRequest() {
    $('#view-title').textContent = '— Solicitar Resgate Comercial';
    const container = $('#content');
    
    // Fetch dynamic pricing
    const pricing = await api('/pricing').catch(() => ({ b2bTiers: { tier1: 110, tier2: 145, tier3: 170 } }));
    const tiers = pricing.b2bTiers || { tier1: 110, tier2: 145, tier3: 170 };

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl">
            <!-- Form Card -->
            <div class="saas-card p-10 bg-slate-900/40">
                <div class="flex items-center gap-4 mb-8">
                   <div class="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                       <span class="material-symbols-outlined text-primary">add_road</span>
                   </div>
                   <div>
                       <h3 class="text-white font-black uppercase text-sm">Dados do Atendimento</h3>
                       <p class="text-[10px] text-text-dim uppercase tracking-widest mt-1">Insira os detalhes do segurado e local</p>
                   </div>
                </div>

                <form id="order-form" class="space-y-6">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2">
                            <label class="text-[10px] font-black uppercase text-text-dim mb-2 block ml-1">Segurado / Proprietário</label>
                            <input type="text" id="cust-name" required class="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-white outline-none focus:border-primary transition-all" placeholder="Nome completo">
                        </div>
                        <div class="col-span-1">
                            <label class="text-[10px] font-black uppercase text-text-dim mb-2 block ml-1">Placa do Veículo</label>
                            <input type="text" id="cust-plate" required class="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-white outline-none focus:border-primary transition-all uppercase" placeholder="ABC-1234">
                        </div>
                        <div class="col-span-1">
                            <label class="text-[10px] font-black uppercase text-text-dim mb-2 block ml-1">Tipo de Serviço</label>
                            <select id="svc-type" class="w-full bg-black border border-white/5 rounded-xl px-5 py-3 text-white outline-none focus:border-primary transition-all">
                                <option value="tow">Reboque no Cambão</option>
                                <option value="battery">Chupeta / Bateria</option>
                                <option value="fuel">Pane Seca (Combustível)</option>
                                <option value="tire">Reparo em Pneu</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-4 pt-4 border-t border-white/5">
                        <div>
                            <label class="text-[10px] font-black uppercase text-text-dim mb-2 block ml-1">Endereço de Origem</label>
                            <input type="text" id="addr-orig" required class="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-white outline-none focus:border-primary transition-all" placeholder="Rua, Número, Bairro, Cidade">
                        </div>
                        <div>
                            <label class="text-[10px] font-black uppercase text-text-dim mb-2 block ml-1">Endereço de Destino</label>
                            <input type="text" id="addr-dest" required class="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-white outline-none focus:border-primary transition-all" placeholder="Local de entrega">
                        </div>
                    </div>

                    <div class="bg-primary/5 p-6 rounded-2xl border border-primary/20">
                        <div class="flex items-center justify-between mb-2">
                           <span class="text-[10px] font-black text-primary uppercase">Estimativa KM</span>
                           <input type="number" id="dist-km" value="10" step="1" class="w-20 bg-transparent text-right font-black text-white outline-none">
                        </div>
                        <div class="flex items-baseline justify-between">
                           <span class="text-xs font-bold text-white uppercase">Valor do Resgate</span>
                           <div class="text-right">
                              <span class="text-xs font-bold text-primary">R$</span>
                              <span id="price-display" class="text-3xl font-black text-primary italic">${tiers.tier1.toFixed(2).replace('.', ',')}</span>
                           </div>
                        </div>
                    </div>

                    <button type="submit" class="w-full bg-primary hover:brightness-110 text-black font-black uppercase py-5 rounded-2xl shadow-xl active:scale-95 transition-all text-sm tracking-widest flex items-center justify-center gap-3">
                        Solicitar Agora <span class="material-symbols-outlined font-black">send</span>
                    </button>
                </form>
            </div>

            <!-- Preços e Busca Ativa -->
            <div class="space-y-6">
                <div class="saas-card p-8 bg-black/20 border-white/5">
                    <h4 class="text-white font-black text-xs uppercase mb-6 tracking-widest">Tabela de Preços</h4>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                           <span class="text-xs font-bold text-text-dim uppercase tracking-widest">Até 30km</span>
                           <span class="text-white font-black">R$ ${tiers.tier1.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div class="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                           <span class="text-xs font-bold text-text-dim uppercase tracking-widest">31km a 40km</span>
                           <span class="text-white font-black">R$ ${tiers.tier2.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div class="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                           <span class="text-xs font-bold text-text-dim uppercase tracking-widest">41km a 55km</span>
                           <span class="text-white font-black">R$ ${tiers.tier3.toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>
                </div>

                <div id="active-search" class="hidden saas-card p-8 border-primary/20 animate-pulse">
                    <div class="flex items-center gap-4">
                        <div class="size-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        <div>
                            <p class="text-xs font-black text-white uppercase italic">Buscando Motorista...</p>
                            <p id="status-msg" class="text-[9px] text-text-dim uppercase tracking-widest mt-1">Aguarde, estamos notificando a rede.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Pricing logic
    const distInp = $('#dist-km');
    const priceDisplay = $('#price-display');
    const updatePrice = () => {
        const km = parseFloat(distInp.value);
        let p = tiers.tier1;
        if (km > 30 && km <= 40) p = tiers.tier2;
        else if (km > 40) p = tiers.tier3;
        priceDisplay.textContent = p.toFixed(2).replace('.', ',');
    };
    distInp.oninput = updatePrice;

    $('#order-form').onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        btn.disabled = true;
        
        const payload = {
            serviceType: $('#svc-type').value,
            customerName: $('#cust-name').value,
            customerPlate: $('#cust-plate').value,
            origin: { address: $('#addr-orig').value, lat: -22.9068, lng: -43.1729 }, // Rio de Janeiro Default
            destination: { address: $('#addr-dest').value, lat: -22.9068, lng: -43.1729 },
            distance: parseFloat($('#dist-km').value),
            duration: 0
        };

        try {
            await api(`/partners/${partner.id}/order`, { method: 'POST', body: payload });
            $('#active-search').classList.remove('hidden');
            btn.innerHTML = 'Solicitação Enviada';
            setTimeout(() => renderHistory(), 2000);
        } catch (err) {
            alert(err.message);
            btn.disabled = false;
        }
    };
}

async function renderHistory() {
    $('#view-title').textContent = '— Histórico de Atendimentos';
    const container = $('#content');
    container.innerHTML = '<div class="text-center py-20 text-text-dim">Carregando seus pedidos...</div>';

    try {
        const orders = await api(`/orders?clientId=${partner.id}`);
        if (orders.length === 0) {
            container.innerHTML = `<div class="saas-card p-10 text-center text-text-dim uppercase text-[10px] font-black tracking-widest py-20">Nenhum pedido encontrado.</div>`;
            return;
        }

        container.innerHTML = `
            <div class="grid grid-cols-1 gap-6">
                ${orders.map(o => `
                    <div class="saas-card p-6 bg-slate-900/40 border border-white/5">
                        <div class="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h4 class="text-white font-black text-sm uppercase">${o.metadata?.customerPlate || '---'}</h4>
                                <p class="text-[10px] text-text-dim uppercase font-bold tracking-widest mt-1">${o.serviceType} • ${o.distance}km</p>
                            </div>
                            <div class="flex items-center gap-3">
                                ${['searching', 'accepted', 'pickup'].includes(o.status) ? `
                                    <button onclick="window.cancelOrder('${o.id}')" class="px-3 py-1 bg-signal-red/10 border border-signal-red/20 text-signal-red rounded-full text-[9px] font-black uppercase hover:bg-signal-red hover:text-white transition-all">
                                        Cancelar
                                    </button>
                                ` : ''}
                                <span class="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase text-slate-300">
                                    ${o.status.replace('_', ' ')}
                                </span>
                                <span class="text-primary font-black text-sm">R$ ${o.price.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>

                        ${o.status === 'searching' ? `
                            <div class="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-3">
                                <div class="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <p class="text-[10px] text-primary font-black uppercase tracking-widest">Buscando profissional na rede...</p>
                            </div>
                        ` : ''}

                        ${o.driverId ? `
                            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                                <div class="flex items-center gap-4">
                                    <div class="size-12 bg-slate-800 rounded-xl overflow-hidden">
                                        ${o.driverPhoto ? `<img src="${o.driverPhoto}" class="size-full object-cover">` : `<div class="size-full flex items-center justify-center font-black text-slate-500">${o.driverName[0]}</div>`}
                                    </div>
                                    <div>
                                        <p class="text-[10px] text-text-dim uppercase font-black uppercase mb-1">Motorista</p>
                                        <p class="text-xs font-black text-white italic">${o.driverName}</p>
                                        <p class="text-[10px] text-text-dim font-bold mt-1">${o.driverPlate}</p>
                                    </div>
                                </div>
                                
                                <div class="bg-primary/10 p-4 rounded-2xl border border-primary/20">
                                    <div class="flex items-center justify-between mb-4">
                                        <p class="text-[9px] text-primary font-black uppercase tracking-widest">Pagamento Direto (PIX Motorista)</p>
                                        <span class="material-symbols-outlined text-primary text-sm">bolt</span>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <div class="flex-1 bg-black/40 p-3 rounded-lg border border-primary/20 text-center font-mono text-[10px] text-white select-all truncate">
                                            ${o.driverPixKey || 'Chave não informada'}
                                        </div>
                                        <button onclick="navigator.clipboard.writeText('${o.driverPixKey}'); alert('Chave Copiada!')" class="size-10 bg-primary/20 text-primary rounded-lg flex items-center justify-center hover:bg-primary hover:text-black transition-all">
                                            <span class="material-symbols-outlined text-sm">content_copy</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    } catch (err) {
        container.innerHTML = `<div class="saas-card p-10 text-center text-red-500 uppercase text-[10px] font-black tracking-widest py-20">Erro: ${err.message}</div>`;
    }
}

window.cancelOrder = async (id) => {
    if (!confirm('Deseja realmente cancelar este chamado?')) return;
    try {
        await api(`/orders/${id}/status`, { method: 'PUT', body: { status: 'cancelled' } });
        renderHistory();
    } catch (err) {
        alert(err.message);
    }
};

function renderBilling() {
    $('#view-title').textContent = '— Extrato Financeiro B2B';
    $('#content').innerHTML = `
        <div class="saas-card p-10 text-center py-20">
            <span class="material-symbols-outlined text-4xl text-text-dim/20 mb-4">account_balance_wallet</span>
            <p class="text-[10px] text-text-dim font-black uppercase tracking-widest">Extrato detalhado em fase de desenvolvimento.</p>
        </div>
    `;
}

checkAuth();
