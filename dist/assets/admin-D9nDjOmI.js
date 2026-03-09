import{b as u,D as g,C as f}from"./api-ttBfcqYz.js";const l=t=>document.querySelector(t);let o=null;const r=l("#pages");function w(){(sessionStorage.getItem("admin_logged")==="true"||localStorage.getItem("movvi_admin_logged")==="true")&&(typeof window.hideLoginOverlay=="function"?window.hideLoginOverlay():(l("#login-overlay").classList.add("opacity-0","pointer-events-none"),setTimeout(()=>l("#login-overlay").style.display="none",500)),h())}l("#admin-login-form").onsubmit=async t=>{t.preventDefault();const e=l("#email").value,a=l("#password").value;try{(await u.login(e,a)).token&&(sessionStorage.setItem("admin_logged","true"),localStorage.setItem("movvi_admin_logged","true"),typeof window.hideLoginOverlay=="function"?window.hideLoginOverlay():(l("#login-overlay").classList.add("opacity-0","pointer-events-none"),setTimeout(()=>l("#login-overlay").style.display="none",500)),h())}catch(i){const s=l("#login-error");s.textContent="Acesso Negado: "+(i.message||"Credenciais inválidas"),s.classList.remove("hidden")}};l("#btn-diag").onclick=async()=>{const t=l("#diag-modal"),e=l("#diag-results");t.classList.remove("hidden"),e.innerHTML='<p class="text-primary animate-pulse">> Conectando ao núcleo...</p>';try{const a=await fetch("/api/health").then(s=>s.json()).catch(()=>({status:"error"})),i=await g.list().catch(()=>[]);e.innerHTML+=`<p class="text-white mt-4">[API] Status: ${a.status==="ok"?"REDE ATIVA":"INTERROMPIDA"}</p>`,e.innerHTML+=`<p class="text-white">[DB] Drivers: ${i.length} registros</p>`,e.innerHTML+='<p class="text-signal-green mt-2">> Integridade de sinal verificada.</p>'}catch(a){e.innerHTML+=`<p class="text-signal-red mt-2">> Protocolo de erro: ${a.message}</p>`}};l("#close-diag").onclick=()=>l("#diag-modal").classList.add("hidden");l("#logout-btn").onclick=()=>{sessionStorage.clear(),localStorage.removeItem("movvi_admin_logged"),location.reload()};function h(){o||(o=io(),o.on("connect",()=>{o.emit("register:admin"),c&&x(c)}),o.on("order:new",()=>{c==="dashboard"&&x("dashboard",!0)}),o.on("order:updated",()=>{["dashboard","orders"].includes(c)&&x(c,!0)}),o.on("driver:status",()=>{c==="dashboard"&&x("dashboard",!0)}),o.on("driver:location",t=>{c==="live"&&p&&v[t.driverId]&&v[t.driverId].setLatLng([t.latitude,t.longitude])}),x("dashboard"))}let c="dashboard";async function x(t,e=!1){c=t,document.querySelectorAll(".nav-item").forEach(s=>{s.classList.toggle("active",s.dataset.page===t)});const a={dashboard:"— Visão Geral da Operação",live:"— Monitoramento Global",orders:"— Monitor de Pedidos",drivers:"— Gestão de Frota Parceira",clients:"— Gestão de Base de Clientes",pricing:"— Gestão Financeira",chat:"— Central de Suporte SAC"};l("#page-title").textContent=a[t]||"— Movvi Dashboard",e||(r.innerHTML=`
        <div class="flex flex-col items-center justify-center py-40 gap-6 fade-in">
            <div class="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div class="text-center font-mono">
                <p class="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-1">Building Module</p>
                <p class="text-[8px] text-text-dim uppercase tracking-widest">${t.toUpperCase()} // ATTEMPTING_LINK</p>
            </div>
        </div>`);const i={dashboard:k,live:$,orders:S,drivers:D,clients:T,pricing:O,chat:I};try{i[t]&&await i[t](e)}catch{r.innerHTML=`
            <div class="saas-card p-12 text-center border-signal-red/20 bg-signal-red/5 mt-10">
                <span class="material-symbols-outlined text-signal-red text-5xl mb-4">error</span>
                <h3 class="text-white font-black uppercase text-sm mb-2">Erro de Link de Dados</h3>
                <p class="text-[11px] font-mono text-text-dim mb-8 uppercase leading-relaxed max-w-sm mx-auto">Não foi possível carregar o subsistema "${t}". Verifique a conexão com o núcleo.</p>
                <button onclick="location.reload()" class="bg-primary text-black px-10 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl">Reiniciar Interface</button>
            </div>`}}document.querySelectorAll(".nav-item").forEach(t=>{t.onclick=()=>x(t.dataset.page)});async function k(t=!1){const e=await u.dashboard(),a=n=>"R$ "+(n||0).toLocaleString("pt-BR",{minimumFractionDigits:2}),s=(await g.list().catch(()=>[])).filter(n=>n.online).slice(0,5),d=s.length?s.map(n=>`
    <div class="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-white/5">
       <div class="size-8 rounded-full bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center text-primary">
          ${n.photo?`<img src="${n.photo}" class="w-full h-full object-cover">`:'<span class="material-symbols-outlined text-sm">person</span>'}
       </div>
       <div class="flex-1 min-w-0">
          <p class="text-xs font-bold text-white truncate">${n.name}</p>
          <p class="text-[9px] text-text-dim uppercase tracking-widest">${n.vehicle||"N/A"}</p>
       </div>
       <span class="size-2 rounded-full bg-signal-green shadow-[0_0_8px_#10b981] animate-pulse"></span>
    </div>
  `).join(""):'<p class="text-xs text-text-dim px-2">Nenhum parceiro online no momento.</p>',b=`
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 ${t?"":"fade-up"}">
      ${m("reorder","Pedidos Hoje",e.todayOrders,"text-primary","bg-primary/10")}
      ${m("leaderboard","Receita Operacional",a(e.totalPlatformRevenue),"text-signal-green","bg-signal-green/10")}
      ${m("account_balance_wallet","Débito em Frota",a(e.totalDriverDebt),"text-signal-red","bg-signal-red/10")}
      ${m("sensors","Nós Ativos",e.onlineDrivers,"text-signal-blue","bg-signal-blue/10")}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 ${t?"":"fade-up"}" ${t?"":'style="animation-delay: 0.1s"'}>
      <div class="saas-card lg:col-span-2 p-10">
        <div class="flex items-center justify-between mb-10">
            <h3 class="font-black text-sm uppercase tracking-widest flex items-center gap-3">
                <span class="material-symbols-outlined text-primary">analytics</span> Fluxo Financeiro RRL
            </h3>
            <span class="text-[9px] font-mono text-text-dim uppercase">Live Feed // ${new Date().toLocaleDateString("pt-BR")}</span>
        </div>
        
        <div class="space-y-12">
            <div>
                <p class="text-[10px] font-black text-text-dim uppercase tracking-widest mb-4">Volume Operacional Bruto (GMV)</p>
                <p class="text-4xl font-black text-white">${a(e.totalRevenue)}</p>
                <div class="w-full bg-slate-800 h-1 mt-6 rounded-full overflow-hidden">
                    <div class="bg-primary h-full" style="width: 100%"></div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-10">
                <div class="p-6 bg-slate-900/50 rounded-2xl border border-white/5">
                    <p class="text-[9px] font-black text-text-dim uppercase tracking-widest mb-2">Repasse Frota (85%)</p>
                    <p class="text-xl font-black text-signal-blue">${a(e.totalDriverEarnings)}</p>
                </div>
                <div class="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                    <p class="text-[9px] font-black text-primary uppercase tracking-widest mb-2">Comissão Movvi (15%)</p>
                    <p class="text-xl font-black text-primary">${a(e.totalPlatformRevenue)}</p>
                </div>
            </div>

            <div class="flex items-end justify-between border-t border-white/5 pt-10">
                <div>
                   <p class="text-[10px] font-black text-text-dim uppercase tracking-widest mb-2">Margem de Operação</p>
                   <p class="text-2xl font-black text-white">15.00%</p>
                </div>
                <div class="text-right">
                   <p class="text-[10px] font-black text-text-dim uppercase tracking-widest mb-2">Ganhos em 24h</p>
                   <p class="text-2xl font-black text-signal-green">+ ${a(e.todayRevenue||0)}</p>
                </div>
            </div>
        </div>
      </div>

      <div class="saas-card p-10 bg-slate-900/30">
        <h3 class="font-black text-sm uppercase tracking-widest flex items-center gap-3 mb-8">
            <span class="material-symbols-outlined text-signal-green">group</span> Frota Disponível
        </h3>
        
        <div class="space-y-8">
            <div class="text-center py-10 border-b border-white/5">
                <p class="text-5xl font-black text-white mb-2">${e.totalDrivers}</p>
                <p class="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">Parceiros Registrados</p>
            </div>

            <div class="space-y-4">
                <div class="flex justify-between items-center p-4 bg-bg-main rounded-xl border border-white/5">
                    <span class="text-xs font-bold text-text-dim uppercase">Online Agora</span>
                    <span class="text-xs font-black text-signal-green">${e.onlineDrivers} Units</span>
                </div>
                <div class="flex justify-between items-center p-4 bg-bg-main rounded-xl border border-white/5">
                    <span class="text-xs font-bold text-text-dim uppercase">Alerta de Débito</span>
                    <span class="text-xs font-black text-signal-red">${e.blockedDrivers||0} Units</span>
                </div>
                <div class="flex justify-between items-center p-4 bg-bg-main rounded-xl border border-white/5">
                    <span class="text-xs font-bold text-text-dim uppercase">Clientes Ativos</span>
                    <span class="text-xs font-black text-white">${e.totalClients} Profiles</span>
                </div>
            </div>
            
            <div class="mt-8 pt-6 border-t border-white/5">
                <p class="text-[10px] font-black text-text-dim uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm text-signal-green">sensors</span> Parceiros Conectados (Top 5)
                </p>
                <div class="space-y-3">
                   ${d}
                </div>
            </div>
        </div>
      </div>
    </div>`;t&&r.querySelector("#dash-wrapper")?r.querySelector("#dash-wrapper").innerHTML=b:r.innerHTML=`<div id="dash-wrapper" class="w-full">${b}</div>`}function m(t,e,a,i,s){return`
    <div class="saas-card p-8 group">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-[10px] font-black text-text-dim uppercase tracking-widest mb-3">${e}</p>
          <p class="text-3xl font-black text-white tracking-tight">${a}</p>
        </div>
        <div class="size-12 ${s} ${i} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
          <span class="material-symbols-outlined">${t}</span>
        </div>
      </div>
    </div>`}let p=null,v={};async function $(){r.innerHTML='<div id="live-map" class="w-full h-[650px] shadow-2xl fade-up border border-white/10 rounded-2xl overflow-hidden saas-card"></div>';const[t,e,a]=await Promise.all([g.list(),f.list(),u.orders()]);p&&p.remove(),p=L.map("live-map",{zoomControl:!1}).setView([-23.55,-46.63],13),L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png").addTo(p);const i=[];t.forEach(s=>{if(s.latitude&&s.longitude){i.push([s.latitude,s.longitude]);const d=s.online,b=d?"#ffdb00":"#4a4a4a",n=L.divIcon({className:"custom-icon",html:`
          <div class="relative group">
            <div class="size-10 bg-slate-900 border-2 border-[${b}] rounded-2xl flex items-center justify-center text-[${b}] shadow-2xl transition-transform hover:scale-110">
                <span class="material-symbols-outlined text-xl">${d?"local_shipping":"block"}</span>
                ${d?'<div class="absolute -top-1 -right-1 size-3 bg-signal-green rounded-full border-2 border-slate-900 animate-pulse"></div>':""}
            </div>
          </div>`,iconSize:[40,40],iconAnchor:[20,20]}),y=`
        <div class="p-4 w-60">
           <div class="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
              <div class="size-10 bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                 ${s.photo?`<img src="${s.photo}" class="w-full h-full object-cover">`:'<span class="material-symbols-outlined text-text-dim">person</span>'}
              </div>
              <div>
                 <h4 class="font-black text-sm text-white uppercase tracking-tight">${s.name}</h4>
                 <p class="text-[9px] font-black ${d?"text-signal-green":"text-text-dim"} uppercase">${d?"CANAL ATIVO":"SINAL PERDIDO"}</p>
              </div>
           </div>
           <div class="space-y-1.5 mb-4 font-mono text-[9px]">
             <div class="flex justify-between text-text-dim uppercase"><span>Frota:</span><span class="text-white">${s.vehicle||"N/A"}</span></div>
             <div class="flex justify-between text-text-dim uppercase"><span>Rating:</span><span class="text-primary font-bold">★ ${s.rating||"5.0"}</span></div>
           </div>
           ${s.activeOrderId?'<div class="bg-primary text-black p-2 font-black text-center text-[10px] rounded-lg tracking-widest uppercase shadow-lg">MISSÃO EM CURSO</div>':""}
        </div>`;v[s.id]=L.marker([s.latitude,s.longitude],{icon:n}).addTo(p).bindPopup(y,{className:"custom-popup-saas",offset:[0,-10]})}}),i.length>0&&p.fitBounds(i,{padding:[100,100],maxZoom:15})}async function S(){const t=await u.orders();r.innerHTML=`
    <div class="saas-card p-10 fade-up">
      <div class="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
        <h3 class="font-black text-base uppercase tracking-widest flex items-center gap-4">
            <span class="material-symbols-outlined text-primary text-2xl">receipt_long</span> Log de Operações
            <span class="bg-slate-900 border border-white/5 px-3 py-1 rounded-full text-[10px] text-text-dim font-black">${t.length} TICKETS</span>
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
            ${t.map(e=>`
            <tr class="hover:bg-white/[0.02] transition-colors group">
              <td class="p-6 font-mono text-text-dim text-[10px] uppercase">${e.id.slice(0,8)}</td>
              <td class="p-6 text-white group-hover:text-primary transition-colors">${e.clientName}</td>
              <td class="p-6 text-slate-300">${e.driverName||'<span class="text-signal-red animate-pulse italic">LOCALIZANDO...</span>'}</td>
              <td class="p-6 text-text-dim truncate max-w-[150px]">${e.serviceName}</td>
              <td class="p-6 text-primary font-black">R$ ${(e.price||0).toLocaleString("pt-BR",{minimumFractionDigits:2})}</td>
              <td class="p-6">
                 <span class="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${A(e.status)}">
                    ${e.status.replace("_"," ")}
                 </span>
              </td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`}function A(t){return["completed","arrived"].includes(t)?"bg-emerald-500/10 text-emerald-500 border-emerald-500/30":["cancelled"].includes(t)?"bg-red-500/10 text-red-500 border-red-500/30":["in_progress","pickup"].includes(t)?"bg-signal-blue/10 text-signal-blue border-signal-blue/30":"bg-primary/10 text-primary border-primary/30"}async function D(){const t=await g.list();r.innerHTML=`
    <div class="saas-card p-10 fade-up">
      <div class="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
        <h3 class="font-black text-base uppercase tracking-widest flex items-center gap-4">
            <span class="material-symbols-outlined text-primary text-2xl">local_shipping</span> Intelligence: Frota Parceira
            <span class="bg-slate-900 border border-white/5 px-3 py-1 rounded-full text-[10px] text-text-dim font-black">${t.length} NÓS ATIVOS</span>
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
            ${t.map(e=>`
            <tr class="hover:bg-white/[0.02] transition-colors group">
              <td class="p-6 font-mono text-text-dim text-[10px] uppercase">${e.id.slice(0,8)}</td>
              <td class="p-6">
                <div class="flex items-center gap-3">
                    <div class="size-8 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden">
                        ${e.photo?`<img src="${e.photo}" class="size-full object-cover">`:'<span class="material-symbols-outlined text-sm text-text-dim">person</span>'}
                    </div>
                    <span class="text-white">${e.name}</span>
                </div>
              </td>
              <td class="p-6 text-slate-300">
                <p class="mb-0.5">${e.vehicle||"N/A"}</p>
                <p class="text-[10px] font-mono text-text-dim uppercase">${e.plate||"---"}</p>
              </td>
              <td class="p-6">
                <span class="${(e.walletBalance||0)<0?"text-signal-red":"text-signal-green"} font-black text-sm">
                    R$ ${(e.walletBalance||0).toLocaleString("pt-BR",{minimumFractionDigits:2})}
                </span>
                ${(e.walletBalance||0)<=-50?'<div class="text-[8px] text-signal-red uppercase font-black tracking-widest mt-1">SINAL BLOQUEADO</div>':""}
              </td>
              <td class="p-6">
                 <span class="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${e.approved?"bg-signal-green/10 text-signal-green border-signal-green/30":"bg-slate-800 text-text-dim border-slate-700"}">
                    ${e.approved?"AUTORIZADO":"AGUARDANDO"}
                 </span>
              </td>
              <td class="p-6 text-right">
                <button class="text-primary hover:bg-primary/10 p-2 rounded-lg transition-all" onclick="alert('Funcionalidade em desenvolvimento: Edição de Driver')">
                    <span class="material-symbols-outlined">settings</span>
                </button>
              </td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`}async function T(){const t=await f.list();r.innerHTML=`
    <div class="saas-card p-10 fade-up">
      <div class="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
        <h3 class="font-black text-base uppercase tracking-widest flex items-center gap-4">
            <span class="material-symbols-outlined text-primary text-2xl">group</span> Intelligence: Base de Clientes
            <span class="bg-slate-900 border border-white/5 px-3 py-1 rounded-full text-[10px] text-text-dim font-black">${t.length} PERFIS REGISTRADOS</span>
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
            ${t.map(e=>`
            <tr class="hover:bg-white/[0.02] transition-colors group">
              <td class="p-6 font-mono text-text-dim text-[10px] uppercase">${e.id.slice(0,8)}</td>
              <td class="p-6">
                <div class="flex items-center gap-3">
                    <div class="size-8 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden">
                        ${e.photo?`<img src="${e.photo}" class="size-full object-cover">`:'<span class="material-symbols-outlined text-sm text-text-dim">account_circle</span>'}
                    </div>
                    <span class="text-white">${e.name}</span>
                </div>
              </td>
              <td class="p-6 text-slate-300 font-mono text-[11px]">${e.email}<br><span class="text-text-dim">${e.phone||"N/A"}</span></td>
              <td class="p-6">
                 <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-sm">history</span>
                    <span class="text-white font-black">${e.totalOrders||0} Chamados</span>
                 </div>
              </td>
              <td class="p-6 text-right">
                <button class="text-text-dim hover:text-white transition-colors" onclick="alert('Log detalhado do cliente ID: ${e.id}')">
                    <span class="material-symbols-outlined">open_in_new</span>
                </button>
              </td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`}async function O(){const t=await fetch("/api/pricing").then(i=>i.json());let e=`<div class="p-6">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-black text-white font-space tracking-tight">Gestão de Preços</h1>
        <p class="text-text-dim text-sm uppercase tracking-widest mt-1">Configure os valores por serviço</p>
      </div>
      <button id="save-pricing" class="bg-primary hover:bg-primary/90 text-black font-black px-6 py-3 rounded-xl shadow-lg hover:-translate-y-1 transition-transform flex items-center gap-2">
        <span class="material-symbols-outlined shrink-0 text-black">save</span>
        <span class="text-black">Salvar Alterações</span>
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">`;for(const[i,s]of Object.entries(t.services))e+=`
      <div class="saas-card relative overflow-hidden group">
        <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-6">
            <span class="material-symbols-outlined text-primary text-3xl">build_circle</span>
            <h2 class="text-xl font-bold text-white uppercase tracking-widest leading-none">${s.name}</h2>
          </div>
          <div class="space-y-4">
            <div>
              <label class="text-xs font-bold text-text-dim uppercase tracking-widest mb-1 block pl-1">Taxa Base (Deslocamento)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black font-black opacity-50">R$</span>
                <input type="number" step="0.01" id="base-${i}" class="w-full bg-slate-50 text-black font-black text-lg py-3 pl-12 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-primary border-transparent transition-all" value="${s.basePrice}">
              </div>
            </div>
            <div>
              <label class="text-xs font-bold text-text-dim uppercase tracking-widest mb-1 block pl-1">Valor por Km (Adicional)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black font-black opacity-50">R$</span>
                <input type="number" step="0.01" id="km-${i}" class="w-full bg-slate-50 text-black font-black text-lg py-3 pl-12 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-primary border-transparent transition-all" value="${s.pricePerKm}">
              </div>
            </div>
          </div>
        </div>
      </div>`;e+="</div></div>",r.innerHTML=e;const a=document.querySelector("#save-pricing");a.onclick=async()=>{a.innerHTML='<span class="material-symbols-outlined shrink-0 text-black animate-spin">progress_activity</span> <span class="text-black">Salvando...</span>';const i={services:{}};for(const s of Object.keys(t.services))i.services[s]={basePrice:parseFloat(document.querySelector(`#base-${s}`).value),pricePerKm:parseFloat(document.querySelector(`#km-${s}`).value)};try{await fetch("/api/pricing",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}),a.classList.replace("bg-primary","bg-green-500"),a.innerHTML='<span class="material-symbols-outlined shrink-0 text-white">check_circle</span> <span class="text-white">Salvo!</span>',setTimeout(()=>{a.classList.replace("bg-green-500","bg-primary"),a.innerHTML='<span class="material-symbols-outlined shrink-0 text-black">save</span> <span class="text-black">Salvar Alterações</span>'},2e3)}catch{alert("Erro ao atualizar preços."),a.innerHTML='<span class="material-symbols-outlined shrink-0 text-black">save</span> <span class="text-black">Salvar Alterações</span>'}}}async function I(){r.innerHTML='<div class="text-center py-40 saas-card"><span class="material-symbols-outlined text-signal-blue text-4xl mb-6">support_agent</span><p class="text-text-dim font-black uppercase text-xs tracking-widest">Terminal de Suporte: Links de Comunicação Offline...</p></div>'}w();window.addEventListener("load",j);function j(){const t=l("#real-time-clock");t&&setInterval(()=>{const e=new Date;t.textContent=e.toLocaleTimeString("pt-BR",{hour12:!1})},1e3)}
