import { api } from '../shared/api.js';

const $ = (s) => document.querySelector(s);
let partner = null;

// ─── AUTH LOGIC ───────────────────────────────────────
async function checkAuth() {
    const loggedStr = localStorage.getItem('movvi_partner');
    if (loggedStr) {
        partner = JSON.parse(loggedStr);
        showApp();
    }
}

function showApp() {
    $('#login-overlay').classList.add('hidden');
    $('#main-app').classList.remove('opacity-0');
    $('#partner-name').textContent = partner.name || 'Parceiro';
    $('#partner-company').textContent = partner.companyName || 'Empresa';
    renderNewRequest();
}

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
        showApp();
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
function renderNewRequest() {
    $('#view-title').textContent = '— Solicitar Resgate Comercial';
    const container = $('#content');
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
                                <option value="tow">Reboque / Guincho</option>
                                <option value="charge">Carga de Bateria</option>
                                <option value="tire">Troca de Pneu</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-4 pt-4 border-t border-white/5">
                        <div>
                            <label class="text-[10px] font-black uppercase text-text-dim mb-2 block ml-1">Endereço de Origem (Onde está o carro)</label>
                            <input type="text" id="addr-orig" required class="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-3 text-white outline-none focus:border-primary transition-all" placeholder="Rua, Número, Bairro, Cidade">
                        </div>
                        <div>
                            <label class="text-[10px] font-black uppercase text-text-dim mb-2 block ml-1">Endereço de Destino (Pranching/Oficina)</label>
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
                              <span id="price-display" class="text-3xl font-black text-primary italic">110,00</span>
                           </div>
                        </div>
                    </div>

                    <button type="submit" class="w-full bg-primary hover:brightness-110 text-black font-black uppercase py-5 rounded-2xl shadow-xl active:scale-95 transition-all text-sm tracking-widest flex items-center justify-center gap-3">
                        Gerar Ordem e Link PIX <span class="material-symbols-outlined font-black">qr_code_2</span>
                    </button>
                </form>
            </div>

            <!-- Tabela de Preços e Info -->
            <div class="space-y-6">
                <div class="saas-card p-8 bg-black/20 border-white/5">
                    <h4 class="text-white font-black text-xs uppercase mb-6 tracking-widest">Tabela de Preços Acordada</h4>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                           <span class="text-xs font-bold text-text-dim uppercase tracking-widest">Até 30km (Total)</span>
                           <span class="text-white font-black">R$ 110,00</span>
                        </div>
                        <div class="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                           <span class="text-xs font-bold text-text-dim uppercase tracking-widest">31km a 40km</span>
                           <span class="text-white font-black">R$ 145,00</span>
                        </div>
                        <div class="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                           <span class="text-xs font-bold text-text-dim uppercase tracking-widest">41km a 55km</span>
                           <span class="text-white font-black">R$ 170,00</span>
                        </div>
                    </div>
                    <p class="mt-8 text-[10px] text-text-dim font-medium uppercase tracking-[0.2em] leading-relaxed italic">Valores brutos. O pagamento via PIX é necessário para a ativação imediata do parceiro na rede.</p>
                </div>
            </div>
        </div>
    `;

    // Pricing Update Logic
    const distInp = $('#dist-km');
    const priceDisplay = $('#price-display');
    const updatePrice = () => {
        const km = parseFloat(distInp.value);
        let p = 110;
        if (km > 30 && km <= 40) p = 145;
        else if (km > 40) p = 170;
        priceDisplay.textContent = p.toFixed(2).replace('.', ',');
    };
    distInp.oninput = updatePrice;

    // Form Submit
    $('#order-form').onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const oldHtml = btn.innerHTML;
        btn.innerHTML = '<div class="size-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>';
        
        const payload = {
            serviceType: $('#svc-type').value,
            customerName: $('#cust-name').value,
            customerPlate: $('#cust-plate').value,
            origin: { address: $('#addr-orig').value },
            destination: { address: $('#addr-dest').value },
            distance: parseFloat($('#dist-km').value),
            duration: 0
        };

        try {
            const res = await api(`/partners/${partner.id}/order`, { method: 'POST', body: payload });
            showPixModal(res.pixCode, res.price);
        } catch (err) {
            alert(err.message);
        } finally {
            btn.innerHTML = oldHtml;
        }
    };
}

function showPixModal(code, price) {
    let modal = $('#pix-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'pix-modal';
        modal.className = 'fixed inset-0 z-[3000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6';
        modal.innerHTML = `
            <div class="saas-card w-full max-w-sm p-10 bg-slate-900 border-2 border-slate-800 flex flex-col items-center text-center">
                <div class="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                    <span class="material-symbols-outlined text-4xl font-black">bolt</span>
                </div>
                <h3 class="text-white font-black text-xl uppercase italic">Ativar Chamado</h3>
                <p class="text-[10px] text-text-dim uppercase font-bold tracking-widest mt-2 mb-8">Pagamento para o banco C6 Bank</p>
                
                <div class="bg-white p-4 rounded-3xl mb-8 shadow-inner">
                    <img id="pix-img" class="size-56">
                </div>

                <div class="w-full bg-black/40 p-4 rounded-xl border border-white/5 mb-6 text-xs text-primary font-mono select-all truncate">
                    ${code}
                </div>

                <div class="space-y-3 w-full">
                    <button id="copy-pix" class="w-full bg-primary text-black font-black py-4 rounded-xl text-xs uppercase tracking-widest shadow-xl">Copiar Código</button>
                    <button id="close-pix" class="w-full text-text-dim font-black py-4 text-xs uppercase tracking-widest opacity-60">Fechar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    $('#pix-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(code)}`;
    $('#copy-pix').onclick = () => {
        navigator.clipboard.writeText(code);
        alert('Copiado!');
    };
    $('#close-pix').onclick = () => {
        modal.remove();
        renderHistory();
    };
    modal.classList.remove('hidden');
}

function renderHistory() {
    $('#view-title').textContent = '— Histórico de Atendimentos';
    $('#content').innerHTML = `
        <div class="saas-card p-8">
            <p class="text-center text-text-dim uppercase text-[10px] font-black tracking-widest py-20">Você ainda não possui atendimentos registrados.</p>
        </div>
    `;
}

function renderBilling() {
    $('#view-title').textContent = '— Extrato Financeiro B2B';
    $('#content').innerHTML = `
        <div class="saas-card p-8">
            <p class="text-center text-text-dim uppercase text-[10px] font-black tracking-widest py-20">Extrato detalhado em fase de desenvolvimento.</p>
        </div>
    `;
}

checkAuth();
