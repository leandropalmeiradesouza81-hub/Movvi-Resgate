import{b as h,D as w,C as S}from"./api-H6lC6YHp.js";const l=t=>document.querySelector(t);let x=null;const u=l("#pages");window.unblockDriver=async t=>{if(confirm("Deseja realmente desbloquear este motorista?"))try{await h.unblockDriver(t),p==="drivers"?b("drivers",!0):p==="chat"&&b("chat",!0)}catch(e){alert(e.message)}};window.resetDriverBalance=async t=>{if(confirm("Deseja quitar o débito deste motorista? O saldo será zerado."))try{await h.resetDriverBalance(t),p==="drivers"?b("drivers",!0):p==="chat"&&b("chat",!0)}catch(e){alert(e.message)}};window.approveDriver=async t=>{if(confirm("Deseja aprovar e liberar o acesso deste motorista na plataforma?"))try{await h.approveDriver(t),p==="drivers"?b("drivers",!0):p==="onboarding"?b("onboarding",!0):p==="chat"&&b("chat",!0)}catch(e){alert(e.message)}};function I(){var e;sessionStorage.getItem("admin_logged")==="true"||localStorage.getItem("movvi_admin_logged")==="true"?(typeof window.hideLoginOverlay=="function"&&window.hideLoginOverlay(),A()):(e=l("#login-overlay"))==null||e.classList.remove("hidden")}l("#admin-login-form").onsubmit=async t=>{t.preventDefault();const e=l("#email").value,s=l("#password").value;try{(await h.login(e,s)).token&&(sessionStorage.setItem("admin_logged","true"),localStorage.setItem("movvi_admin_logged","true"),typeof window.hideLoginOverlay=="function"&&window.hideLoginOverlay(),A())}catch(r){const i=l("#login-error");i.textContent="Acesso Negado: "+(r.message||"Credenciais inválidas"),i.classList.remove("hidden")}};l("#btn-diag").onclick=async()=>{const t=l("#diag-modal"),e=l("#diag-results");t.classList.remove("hidden"),e.innerHTML='<p class="text-primary animate-pulse">> Conectando ao núcleo...</p>';try{const s=await fetch("/api/health").then(i=>i.json()).catch(()=>({status:"error"})),r=await w.list().catch(()=>[]);e.innerHTML+=`<p class="text-white mt-4">[API] Status: ${s.status==="ok"?"REDE ATIVA":"INTERROMPIDA"}</p>`,e.innerHTML+=`<p class="text-white">[DB] Drivers: ${r.length} registros</p>`,e.innerHTML+='<p class="text-signal-green mt-2">> Integridade de sinal verificada.</p>'}catch(s){e.innerHTML+=`<p class="text-signal-red mt-2">> Protocolo de erro: ${s.message}</p>`}};l("#close-diag").onclick=()=>l("#diag-modal").classList.add("hidden");l("#logout-btn").onclick=()=>{sessionStorage.clear(),localStorage.removeItem("movvi_admin_logged"),location.reload()};function A(){x||(x=io(),x.on("connect",()=>{x.emit("register:admin"),p&&b(p)}),x.on("order:new",()=>{p==="dashboard"&&b("dashboard",!0)}),x.on("order:updated",()=>{["dashboard","orders"].includes(p)&&b(p,!0)}),x.on("driver:status",()=>{p==="dashboard"&&b("dashboard",!0)}),x.on("driver:location",t=>{p==="live"&&f&&D[t.driverId]&&D[t.driverId].setLatLng([t.latitude,t.longitude])}),b("dashboard"))}let p="dashboard";async function b(t,e=!1){p=t,document.querySelectorAll(".nav-item").forEach(i=>{i.classList.toggle("active",i.dataset.page===t)});const s={dashboard:"— Visão Geral da Operação",live:"— Monitoramento Global",orders:"— Monitor de Pedidos",onboarding:"— Embarcando Parceiros",drivers:"— Gestão de Frota Parceira",clients:"— Gestão de Base de Clientes",pricing:"— Gestão Financeira",chat:"— Central de Suporte SAC"};l("#page-title").textContent=s[t]||"— Movvi Dashboard",e||(u.innerHTML=`
        <div class="flex flex-col items-center justify-center py-40 gap-6 fade-in">
            <div class="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div class="text-center font-mono">
                <p class="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-1">Building Module</p>
                <p class="text-[8px] text-text-dim uppercase tracking-widest">${t.toUpperCase()} // ATTEMPTING_LINK</p>
            </div>
        </div>`);const r={dashboard:T,live:O,orders:j,onboarding:C,drivers:R,clients:M,pricing:P,chat:E};try{r[t]&&await r[t](e)}catch{u.innerHTML=`
            <div class="saas-card p-12 text-center border-signal-red/20 bg-signal-red/5 mt-10">
                <span class="material-symbols-outlined text-signal-red text-5xl mb-4">error</span>
                <h3 class="text-white font-black uppercase text-sm mb-2">Erro de Link de Dados</h3>
                <p class="text-[11px] font-mono text-text-dim mb-8 uppercase leading-relaxed max-w-sm mx-auto">Não foi possível carregar o subsistema "${t}". Verifique a conexão com o núcleo.</p>
                <button onclick="location.reload()" class="bg-primary text-black px-10 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl">Reiniciar Interface</button>
            </div>`}}document.querySelectorAll(".nav-item").forEach(t=>{t.onclick=()=>b(t.dataset.page)});async function T(t=!1){const e=await h.dashboard(),s=o=>"R$ "+(o||0).toLocaleString("pt-BR",{minimumFractionDigits:2}),i=(await w.list().catch(()=>[])).filter(o=>o.online).slice(0,5),c=i.length?i.map(o=>`
    <div class="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-white/5">
       <div class="size-8 rounded-full bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center text-primary">
          ${o.photo?`<img src="${o.photo}" class="w-full h-full object-cover">`:'<span class="material-symbols-outlined text-sm">person</span>'}
       </div>
       <div class="flex-1 min-w-0">
          <p class="text-xs font-bold text-white truncate">${o.name}</p>
          <p class="text-[9px] text-text-dim uppercase tracking-widest">${o.vehicle||"N/A"}</p>
       </div>
       <span class="size-2 rounded-full bg-signal-green shadow-[0_0_8px_#10b981] animate-pulse"></span>
    </div>
  `).join(""):'<p class="text-xs text-text-dim px-2">Nenhum parceiro online no momento.</p>',n=`
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${t?"":"fade-up"}">
      ${$("reorder","Pedidos Hoje",e.todayOrders,"text-primary","bg-primary/10")}
      ${$("leaderboard","Receita Operacional",s(e.totalPlatformRevenue),"text-signal-green","bg-signal-green/10")}
      ${$("account_balance_wallet","Débito em Frota",s(e.totalDriverDebt),"text-signal-red","bg-signal-red/10")}
      ${$("group","Total Clientes",e.totalClients,"text-signal-blue","bg-signal-blue/10")}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 ${t?"":"fade-up"}" ${t?"":'style="animation-delay: 0.1s"'}>
      <div class="saas-card lg:col-span-2 p-6">
        <div class="flex items-center justify-between mb-6">
            <h3 class="font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-lg">analytics</span> Fluxo Financeiro RRL
            </h3>
            <span class="text-[8px] font-mono text-text-dim uppercase">Live Feed // ${new Date().toLocaleDateString("pt-BR")}</span>
        </div>
        
        <div class="space-y-6">
            <div>
                <p class="text-[9px] font-black text-text-dim uppercase tracking-widest mb-2">Volume Operacional Bruto (GMV)</p>
                <p class="text-2xl font-black text-white">${s(e.totalRevenue)}</p>
                <div class="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
                    <div class="bg-primary h-full" style="width: 100%"></div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                    <p class="text-[8px] font-black text-text-dim uppercase tracking-widest mb-1">Repasse Frota (85%)</p>
                    <p class="text-lg font-black text-signal-blue">${s(e.totalDriverEarnings)}</p>
                </div>
                <div class="p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <p class="text-[8px] font-black text-primary uppercase tracking-widest mb-1">Comissão Movvi (15%)</p>
                    <p class="text-lg font-black text-primary">${s(e.totalPlatformRevenue)}</p>
                </div>
            </div>

            <div class="flex items-end justify-between border-t border-white/5 pt-4">
                <div>
                   <p class="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1">Margem de Operação</p>
                   <p class="text-lg font-black text-white">15.00%</p>
                </div>
                <div class="text-right">
                   <p class="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1">Ganhos em 24h</p>
                   <p class="text-lg font-black text-signal-green">+ ${s(e.todayRevenue||0)}</p>
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
                <p class="text-3xl font-black text-white mb-1">${e.totalDrivers}</p>
                <p class="text-[8px] font-black text-text-dim uppercase tracking-[0.2em]">Parceiros Registrados</p>
            </div>

            <div class="space-y-3">
                <div class="flex justify-between items-center p-3 bg-bg-main rounded-lg border border-white/5">
                    <span class="text-[10px] font-bold text-text-dim uppercase">Online Agora</span>
                    <span class="text-[10px] font-black text-signal-green">${e.onlineDrivers} Units</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-bg-main rounded-lg border border-white/5">
                    <span class="text-[10px] font-bold text-text-dim uppercase">Alerta de Débito</span>
                    <span class="text-[10px] font-black text-signal-red">${e.blockedDrivers||0} Units</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-bg-main rounded-lg border border-white/5">
                    <span class="text-[10px] font-bold text-text-dim uppercase">Clientes Ativos</span>
                    <span class="text-[10px] font-black text-white">${e.totalClients} Profiles</span>
                </div>
            </div>
            
            <div class="mt-8 pt-6 border-t border-white/5">
                <p class="text-[10px] font-black text-text-dim uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm text-signal-green">sensors</span> Parceiros Conectados (Top 5)
                </p>
                <div class="space-y-3">
                   ${c}
                </div>
            </div>
        </div>
      </div>
    </div>`;t&&u.querySelector("#dash-wrapper")?u.querySelector("#dash-wrapper").innerHTML=n:u.innerHTML=`<div id="dash-wrapper" class="w-full">${n}</div>`}function $(t,e,s,r,i){return`
    <div class="saas-card p-5 group">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-[10px] font-black text-text-dim uppercase tracking-widest mb-2">${e}</p>
          <p class="text-2xl font-black text-white tracking-tight">${s}</p>
        </div>
        <div class="size-10 ${i} ${r} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
          <span class="material-symbols-outlined text-[20px]">${t}</span>
        </div>
      </div>
    </div>`}let f=null,D={};async function O(){u.innerHTML='<div id="live-map" class="w-full h-[650px] shadow-2xl fade-up border border-white/10 rounded-2xl overflow-hidden saas-card"></div>';const[t,e,s]=await Promise.all([w.list(),S.list(),h.orders()]);f&&f.remove(),f=L.map("live-map",{zoomControl:!1}).setView([-23.55,-46.63],13),L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png").addTo(f);const r=[];t.forEach(i=>{if(i.latitude&&i.longitude){r.push([i.latitude,i.longitude]);const c=i.online,n=c?"#ffdb00":"#4a4a4a",o=L.divIcon({className:"custom-icon",html:`
          <div class="relative group">
            <div class="size-10 bg-slate-900 border-2 border-[${n}] rounded-2xl flex items-center justify-center text-[${n}] shadow-2xl transition-transform hover:scale-110">
                <span class="material-symbols-outlined text-xl">${c?"local_shipping":"block"}</span>
                ${c?'<div class="absolute -top-1 -right-1 size-3 bg-signal-green rounded-full border-2 border-slate-900 animate-pulse"></div>':""}
            </div>
          </div>`,iconSize:[40,40],iconAnchor:[20,20]}),v=`
        <div class="p-4 w-60">
           <div class="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
              <div class="size-10 bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                 ${i.photo?`<img src="${i.photo}" class="w-full h-full object-cover">`:'<span class="material-symbols-outlined text-text-dim">person</span>'}
              </div>
              <div>
                 <h4 class="font-black text-sm text-white uppercase tracking-tight">${i.name}</h4>
                 <p class="text-[9px] font-black ${c?"text-signal-green":"text-text-dim"} uppercase">${c?"CANAL ATIVO":"SINAL PERDIDO"}</p>
              </div>
           </div>
           <div class="space-y-1.5 mb-4 font-mono text-[9px]">
             <div class="flex justify-between text-text-dim uppercase"><span>Frota:</span><span class="text-white">${i.vehicle||"N/A"}</span></div>
             <div class="flex justify-between text-text-dim uppercase"><span>Rating:</span><span class="text-primary font-bold">★ ${i.rating||"5.0"}</span></div>
           </div>
           ${i.activeOrderId?'<div class="bg-primary text-black p-2 font-black text-center text-[10px] rounded-lg tracking-widest uppercase shadow-lg">MISSÃO EM CURSO</div>':""}
        </div>`;D[i.id]=L.marker([i.latitude,i.longitude],{icon:o}).addTo(f).bindPopup(v,{className:"custom-popup-saas",offset:[0,-10]})}}),r.length>0&&f.fitBounds(r,{padding:[100,100],maxZoom:15})}async function j(){const t=await h.orders();u.innerHTML=`
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
                 <span class="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${_(e.status)}">
                    ${e.status.replace("_"," ")}
                 </span>
              </td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`}function _(t){return["completed","arrived"].includes(t)?"bg-emerald-500/10 text-emerald-500 border-emerald-500/30":["cancelled"].includes(t)?"bg-red-500/10 text-red-500 border-red-500/30":["in_progress","pickup"].includes(t)?"bg-signal-blue/10 text-signal-blue border-signal-blue/30":"bg-primary/10 text-primary border-primary/30"}async function C(){const e=(await w.list()).filter(s=>!s.approved&&s.onboardingStep);u.innerHTML=`
    <div class="saas-card p-10 fade-up">
      <div class="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
        <h3 class="font-black text-base uppercase tracking-widest flex items-center gap-4">
            <span class="material-symbols-outlined text-primary text-2xl">how_to_reg</span> Embarque de Parceiros
            <span class="bg-slate-900 border border-white/5 px-3 py-1 rounded-full text-[10px] text-text-dim font-black">${e.length} AGUARDANDO APROVAÇÃO</span>
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
            ${e.length===0?'<tr><td colspan="5" class="p-10 text-center text-text-dim uppercase">Nenhum parceiro na fila de embarque.</td></tr>':e.map(s=>`
            <tr class="hover:bg-white/[0.02] transition-colors group">
              <td class="p-6">
                <div class="flex items-center gap-3">
                    <div class="size-8 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
                        ${s.photo?'<img src="'+s.photo+'" class="size-full object-cover">':'<span class="material-symbols-outlined text-sm text-text-dim">person</span>'}
                    </div>
                    <div>
                      <span class="text-white block">${s.name}</span>
                      <span class="text-[10px] text-text-dim uppercase">${s.vehicle||"Sem veículo"} ${s.plate?" | "+s.plate:""}</span>
                    </div>
                </div>
              </td>
              <td class="p-6">
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-2 text-[10px] uppercase font-bold ${s.cnhStatus==="submitted"?"text-signal-green":"text-text-dim"}">
                    <span class="material-symbols-outlined text-sm">${s.cnhStatus==="submitted"?"check_circle":"pending"}</span> CNH
                  </div>
                  <div class="flex items-center gap-2 text-[10px] uppercase font-bold ${s.crlvStatus==="submitted"?"text-signal-green":"text-text-dim"}">
                    <span class="material-symbols-outlined text-sm">${s.crlvStatus==="submitted"?"check_circle":"pending"}</span> CRLV
                  </div>
                </div>
              </td>
              <td class="p-6">
                <div class="flex items-center gap-2 text-[10px] uppercase font-bold ${s.kitAcquired?"text-signal-green":"text-text-dim"}">
                   <span class="material-symbols-outlined text-sm">${s.kitAcquired?"inventory_2":"do_not_disturb_on"}</span>
                   ${s.kitAcquired?"KIT PAGO / LIBERADO":"AGUARDANDO PAGTO"}
                </div>
              </td>
              <td class="p-6">
                 <span class="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${s.onboardingStep==="pending_approval"?"bg-primary/20 text-primary border-primary/30":"bg-slate-800 text-text-dim border-slate-700"}">
                    ${s.onboardingStep==="pending_approval"?"APROVAÇÃO FINAL":"PREENCHIMENTO"}
                 </span>
              </td>
              <td class="p-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button class="bg-signal-green/10 text-signal-green hover:bg-signal-green hover:text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all" onclick="approveDriver('${s.id}')">
                    Liberar na Plataforma
                  </button>
                </div>
              </td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`}async function R(){const t=await w.list();u.innerHTML=`
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
                <div class="flex items-center justify-end gap-2">
                  ${e.approved?"":`
                    <button class="bg-signal-green/10 text-signal-green hover:bg-signal-green hover:text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all" onclick="approveDriver('${e.id}')">
                      Liberar Acesso
                    </button>
                  `}
                  ${e.blocked||(e.walletBalance||0)<=-50?`
                    <button class="bg-signal-red/10 text-signal-red hover:bg-signal-red hover:text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all" onclick="resetDriverBalance('${e.id}')">
                      Quitar Débito
                    </button>
                    <button class="bg-primary/10 text-primary hover:bg-primary hover:text-black px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all" onclick="unblockDriver('${e.id}')">
                      Desbloquear
                    </button>
                  `:""}
                  <button class="text-text-dim hover:text-primary p-2 rounded-lg transition-all" onclick="alert('Dados do Motorista: ${e.name}')">
                    <span class="material-symbols-outlined">settings</span>
                  </button>
                </div>
              </td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`}async function M(){const t=await S.list();u.innerHTML=`
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
    </div>`}async function P(){const[t,e]=await Promise.all([fetch("/api/pricing").then(n=>n.json()),fetch("/api/pricing/settings").then(n=>n.json())]);let s=`<div class="p-6">
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
            <button id="toggle-lockdown" class="px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${e.systemLockdown?"bg-signal-red text-white":"bg-slate-800 text-text-dim border border-white/5"}">
              ${e.systemLockdown?"ATIVADO (Site Bloqueado)":"DESATIVADO (Site Aberto)"}
            </button>
            <p class="text-[10px] text-text-dim/60 font-mono uppercase">Status: ${e.systemLockdown?"BLOCKED":"LIVE"}</p>
          </div>
        </div>
        <div>
          <label class="text-xs font-bold text-text-dim uppercase tracking-widest mb-3 block">Data Oficial de Lançamento (Contador)</label>
          <input type="date" id="launch-date" class="w-full bg-slate-950 border border-slate-700/50 rounded-xl px-5 py-3 text-white focus:border-primary outline-none transition-all" value="${e.launchDate||"2026-04-20"}">
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">`;for(const[n,o]of Object.entries(t.services))s+=`
      <div class="saas-card relative overflow-hidden group">
        <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative z-10 p-6">
          <div class="flex items-center gap-3 mb-6">
            <span class="material-symbols-outlined text-primary text-3xl">build_circle</span>
            <h2 class="text-xl font-bold text-white uppercase tracking-widest leading-none">${o.name}</h2>
          </div>
          <div class="space-y-4">
            <div>
              <label class="text-xs font-bold text-text-dim uppercase tracking-widest mb-1 block pl-1">Taxa Base (Deslocamento)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black font-black opacity-50 text-sm">R$</span>
                <input type="number" step="0.01" id="base-${n}" class="w-full bg-slate-50 text-black font-black text-lg py-3 pl-12 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-primary border-transparent transition-all" value="${o.basePrice}">
              </div>
            </div>
            <div>
              <label class="text-xs font-bold text-text-dim uppercase tracking-widest mb-1 block pl-1">Valor por Km (Adicional)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-black font-black opacity-50 text-sm">R$</span>
                <input type="number" step="0.01" id="km-${n}" class="w-full bg-slate-50 text-black font-black text-lg py-3 pl-12 pr-4 rounded-xl outline-none focus:ring-2 focus:ring-primary border-transparent transition-all" value="${o.pricePerKm}">
              </div>
            </div>
          </div>
        </div>
      </div>`;s+="</div></div>",u.innerHTML=s;let r=e.systemLockdown;const i=document.querySelector("#toggle-lockdown");i.onclick=()=>{r=!r,i.className=`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${r?"bg-signal-red text-white":"bg-slate-800 text-text-dim border border-white/5"}`,i.innerText=r?"ATIVADO (Site Bloqueado)":"DESATIVADO (Site Aberto)"};const c=document.querySelector("#save-pricing");c.onclick=async()=>{c.innerHTML='<span class="material-symbols-outlined shrink-0 text-black animate-spin">progress_activity</span> <span class="text-black">Salvando...</span>';const n={services:{}};for(const v of Object.keys(t.services))n.services[v]={basePrice:parseFloat(document.querySelector(`#base-${v}`).value),pricePerKm:parseFloat(document.querySelector(`#km-${v}`).value)};const o={systemLockdown:r,launchDate:document.querySelector("#launch-date").value};try{await Promise.all([fetch("/api/pricing",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}),fetch("/api/pricing/settings",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)})]),c.classList.replace("bg-primary","bg-emerald-500"),c.innerHTML='<span class="material-symbols-outlined shrink-0 text-white">check_circle</span> <span class="text-white">Sincronizado!</span>',setTimeout(()=>{c.classList.replace("bg-emerald-500","bg-primary"),c.innerHTML='<span class="material-symbols-outlined shrink-0 text-black">save</span> <span class="text-black">Salvar Todas as Alterações</span>'},2e3)}catch{alert("Erro ao sincronizar configurações."),c.innerHTML='<span class="material-symbols-outlined shrink-0 text-black">save</span> <span class="text-black">Salvar Todas as Alterações</span>'}}}async function E(){const t=await w.list().catch(()=>[]);let e=null;u.innerHTML=`
    <div class="flex h-[calc(100vh-160px)] gap-6 fade-up">
      <!-- Chat List (Left) -->
      <div class="w-80 saas-card flex flex-col overflow-hidden bg-slate-900/30">
        <div class="p-6 border-b border-white/5">
          <h3 class="font-black text-[10px] uppercase tracking-[0.3em] text-text-dim">Canais de Suporte</h3>
        </div>
        <div id="chat-list" class="flex-1 overflow-y-auto divide-y divide-white/5">
          ${t.length?t.map(a=>`
            <div class="chat-item p-4 hover:bg-white/5 cursor-pointer transition-colors" data-id="${a.id}">
              <div class="flex items-center gap-3">
                <div class="size-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-white/10 overflow-hidden">
                  ${a.photo?`<img src="${a.photo}" class="size-full object-cover">`:'<span class="material-symbols-outlined text-text-dim">person</span>'}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-[11px] font-black text-white truncate uppercase">${a.name}</p>
                  <p class="text-[9px] text-text-dim uppercase tracking-widest truncate">${a.vehicle||"Driver Partner"}</p>
                </div>
                <div id="badge-${a.id}" class="hidden size-2 bg-primary rounded-full shadow-[0_0_8px_#ffdb00]"></div>
              </div>
            </div>
          `).join(""):'<p class="p-6 text-[10px] text-text-dim text-center uppercase tracking-widest">Nenhum canal ativo</p>'}
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
    </div>`;const s=l("#chat-messages"),r=l("#chat-header"),i=l("#chat-form"),c=l("#chat-input"),n=l("#chat-file-input"),o=l("#btn-attach");o&&(o.onclick=()=>n.click());async function v(a){var g;e=a;const d=t.find(m=>m.id===a);(g=l(`#badge-${a}`))==null||g.classList.add("hidden"),r.innerHTML=`
      <div class="flex items-center gap-4">
        <div class="size-10 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
          ${d.photo?`<img src="${d.photo}" class="size-full object-cover">`:'<span class="material-symbols-outlined text-text-dim">person</span>'}
        </div>
        <div>
          <h4 class="text-xs font-black text-white uppercase tracking-tight">${d.name}</h4>
          <p class="text-[9px] text-signal-green font-black uppercase tracking-widest">DRIVER_ID: ${a.slice(0,8)} // LINK_STABLE</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button class="bg-signal-red/10 text-signal-red px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border border-signal-red/20" onclick="resetDriverBalance('${a}')">Zerar Débito</button>
      </div>
    `,i.classList.remove("hidden"),s.innerHTML='<div class="m-auto animate-pulse text-[10px] uppercase font-black text-text-dim tracking-widest">Resgatando Histórico...</div>',x.emit("chat:get-history",{driverId:a}),x.once("chat:history",({messages:m})=>{s.innerHTML="",m.forEach(y),s.scrollTop=s.scrollHeight}),document.querySelectorAll(".chat-item").forEach(m=>{m.classList.toggle("bg-primary/10",m.dataset.id===a),m.classList.toggle("border-primary/20",m.dataset.id===a)})}function y(a){if(a.driverId!==e)return;const d=a.from==="admin",g=new Date(a.timestamp).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),m=document.createElement("div");m.className=`flex ${d?"justify-end":"justify-start"} w-full`;let k="";a.file&&(a.file.startsWith("data:image")?k=`<div class="mb-2 relative group">
          <img src="${a.file}" class="max-w-xs rounded-xl border border-white/10 cursor-zoom-in transition-all group-hover:brightness-110" onclick="window.open('${a.file}')">
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-xl pointer-events-none">
            <span class="material-symbols-outlined text-white">open_in_new</span>
          </div>
        </div>`:k=`<div class="flex items-center gap-3 p-3 bg-white/5 rounded-xl mb-2 border border-white/5">
          <span class="material-symbols-outlined text-primary">description</span>
          <a href="${a.file}" target="_blank" class="text-[10px] font-black uppercase tracking-widest text-primary underline">Ver Documento (Anexo)</a>
        </div>`),a.message&&(k+=`<p class="text-[13px] leading-relaxed font-medium">${a.message}</p>`),m.innerHTML=`
      <div class="max-w-[70%] group">
        <div class="flex items-center gap-2 mb-1 px-1">
           <span class="text-[8px] font-black text-text-dim uppercase">${d?"ADMIN_CMD":"DRIVER_SIG"}</span>
           <span class="text-[8px] font-mono text-text-dim/50">${g}</span>
        </div>
        <div class="p-4 rounded-2xl ${d?"bg-primary text-black rounded-tr-none shadow-[0_4px_15px_-5px_rgba(255,219,0,0.3)]":"bg-slate-800 text-white rounded-tl-none border border-white/5 shadow-xl"} transition-all">
          ${k}
        </div>
      </div>`,s.appendChild(m),s.scrollTop=s.scrollHeight}document.querySelectorAll(".chat-item").forEach(a=>{a.onclick=()=>v(a.dataset.id)}),x.off("chat:new-message").on("chat:new-message",a=>{var d;a.driverId===e?y(a):(d=l(`#badge-${a.driverId}`))==null||d.classList.remove("hidden")}),i.onsubmit=a=>{a.preventDefault();const d=c.value.trim();!d&&!n.files[0]||(x.emit("chat:admin-to-driver",{driverId:e,message:d}),y({from:"admin",driverId:e,message:d,timestamp:new Date().toISOString()}),c.value="")},n.onchange=a=>{const d=a.target.files[0];if(!d)return;const g=new FileReader;g.onload=()=>{x.emit("chat:admin-to-driver",{driverId:e,message:"",file:g.result}),y({from:"admin",driverId:e,message:"",file:g.result,timestamp:new Date().toISOString()}),n.value=""},g.readAsDataURL(d)}}I();
