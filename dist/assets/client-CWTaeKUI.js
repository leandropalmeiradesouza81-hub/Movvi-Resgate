import{O as B,A as ne}from"./api-ttBfcqYz.js";import{i as fe,g as oe}from"./geo-Dl6lxGpH.js";console.log("[DEBUG] main.js loaded");let K,F,U,m,n,p,z,J,ie;const $=new Audio("https://www.myinstants.com/media/sounds/incoming-call-sound.mp3");$.loop=!0;$.volume=1;function X(){$.play().then(()=>{$.pause(),$.currentTime=0})}function Y(e){n=e,localStorage.setItem("movvi_client",JSON.stringify(e))}function ge(){try{return JSON.parse(localStorage.getItem("movvi_client"))}catch{return null}}function c(e,t){te(),K.innerHTML="";const a=e(t);K.appendChild(a),a.classList.add("fade-in")}function he(){return document.documentElement.classList.contains("dark")}function Q(){return"https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"}var G=localStorage.getItem("movvi_client_theme")||"light";function ve(e){G=e,e==="light"?(document.documentElement.classList.remove("dark"),localStorage.setItem("movvi_client_theme","light")):e==="dark"?(document.documentElement.classList.add("dark"),localStorage.setItem("movvi_client_theme","dark")):localStorage.removeItem("movvi_client_theme"),Z()}function Z(){var a;let e=((a=n==null?void 0:n.name)==null?void 0:a.split(" ")[0])||"Cliente";e=e.replace(/\uFFFD/g,"ã").replace(/Joo/i,"João").replace(/Jo.?o/i,"João"),he();const t=n.photo||"";F.innerHTML=`<div class="px-5 pt-12 pb-6 flex items-center justify-between border-b border-slate-200 dark:border-white/10"><div class="flex items-center gap-3"><div class="size-11 overflow-hidden rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center text-primary shadow-sm">${t?`<img src="${t}" class="w-full h-full object-cover">`:'<span class="material-symbols-outlined">person</span>'}</div><div><p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest mb-0.5">Ola, ${e}</p><h1 class="text-base font-black text-black dark:text-white leading-tight">Movvi</h1></div></div><button class="sidebar-close size-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-primary transition-colors"><span class="material-symbols-outlined text-base">close</span></button></div><nav class="flex-1 overflow-y-auto pt-4 px-3"><a data-nav="home" class="flex items-center gap-3 px-3 py-3 rounded-xl text-black font-bold dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary cursor-pointer transition-colors group"><span class="material-symbols-outlined text-slate-400 group-hover:text-primary" style="font-variation-settings:'FILL' 1">home</span><span class="text-sm font-bold">Inicio</span></a><a data-nav="history" class="flex items-center gap-3 px-3 py-3 rounded-xl text-black font-bold dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary cursor-pointer transition-colors group"><span class="material-symbols-outlined text-slate-400 group-hover:text-primary">history</span><span class="text-sm font-bold">Historico</span></a><a data-nav="profile" class="flex items-center gap-3 px-3 py-3 rounded-xl text-black font-bold dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary cursor-pointer transition-colors group"><span class="material-symbols-outlined text-slate-400 group-hover:text-primary">person</span><span class="text-sm font-bold">Perfil</span></a><div class="mt-4 px-3 py-3"><p class="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-widest">Aparencia</p><div class="flex gap-1 bg-slate-100 dark:bg-white/10 rounded-xl p-1"><button data-theme="light" class="flex-1 text-[10px] py-1.5 rounded-lg font-bold transition-all ${G==="light"?"bg-white dark:bg-white/20 text-primary shadow-sm":"text-slate-500"}">CLARO</button><button data-theme="dark" class="flex-1 text-[10px] py-1.5 rounded-lg font-bold transition-all ${G==="dark"?"bg-white dark:bg-white/20 text-primary shadow-sm":"text-slate-500"}">ESCURO</button><button data-theme="auto" class="flex-1 text-[10px] py-1.5 rounded-lg font-bold transition-all ${G==="auto"?"bg-white dark:bg-white/20 text-primary shadow-sm":"text-slate-500"}">AUTO</button></div></div></nav><div class="px-5 pb-8 pt-4 border-t border-slate-200 dark:border-white/10"><a data-nav="logout" class="flex items-center gap-3 text-red-500 hover:text-red-400 cursor-pointer font-bold text-sm"><span class="material-symbols-outlined text-base">logout</span>Sair da Conta</a></div>`,F.querySelectorAll("[data-nav]").forEach(s=>{s.onclick=()=>{const i=s.dataset.nav;i==="home"?c(A):i==="history"?c(Se):i==="profile"?c(ce):i==="logout"&&(localStorage.removeItem("movvi_client"),m==null||m.disconnect(),c(re))}}),F.querySelectorAll("[data-theme]").forEach(s=>{s.onclick=()=>ve(s.dataset.theme)}),F.querySelector(".sidebar-close").onclick=te}function ee(){F.classList.add("open"),U.classList.add("open")}function te(){F.classList.remove("open"),U.classList.remove("open")}function ae(){m=io(),m.on("connect",()=>m.emit("register:client",n.id)),m.on("order:searching",({message:e})=>{const t=document.getElementById("search-status");t&&(t.textContent=e)}),m.on("order:accepted",e=>{p={...p,...e,orderId:e.id||e.orderId,status:"accepted"},c(O,p)}),m.on("order:status",({orderId:e,status:t})=>{if(p&&(p.id===e||p.orderId===e)){if(p.status=t,t==="completed"){const a=p;p=null,c(Le,a)}if(t==="arrived"){const a=document.getElementById("eta-text");a&&(a.innerHTML='<span class="text-emerald-500 font-black animate-pulse">Motorista Chegou!</span>');const s=document.getElementById("dist-text");s&&(s.textContent="0 km")}if(t==="in_progress"){const a=document.getElementById("eta-text");a&&(a.innerHTML='<span class="text-primary font-black">Em Trânsito</span>')}}}),m.on("order-chat:new-message",e=>{const t=document.getElementById("btn-chat");t&&!document.getElementById("chat-msgs")&&(t.classList.add("animate-pulse","border-red-500","bg-red-50"),document.getElementById("chat-dot")||t.insertAdjacentHTML("beforeend",'<div id="chat-dot" class="absolute -top-1 -right-1 size-4 bg-red-500 rounded-full border-2 border-white dark:border-background-dark animate-pulse shadow-md"></div>'))}),m.on("driver:location",({latitude:e,longitude:t})=>{J&&J.setLatLng([e,t]),z&&z.panTo([e,t])}),ie||(ie=fe(({latitude:e,longitude:t})=>{m.emit("client:location",{clientId:n.id,latitude:e,longitude:t})}))}function re(){const e=document.createElement("div");return e.className="view active bg-background-light dark:bg-background-dark",e.innerHTML='<div class="flex-1 flex flex-col items-center justify-center p-4"><div class="w-full max-w-md flex flex-col gap-8"><div class="flex flex-col items-center text-center gap-4 pt-8"><div class="w-20 h-20 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center"><span class="material-symbols-outlined text-primary text-4xl">car_repair</span></div><div><h1 class="text-black font-bold dark:text-slate-100 text-3xl font-bold tracking-tight">Movvi Reboque</h1><p class="text-slate-600 dark:text-slate-400 text-base mt-1">Seu parceiro de confianca na estrada.</p></div></div><form id="lf" class="flex flex-col gap-5 w-full bg-white dark:bg-white/5 p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm"><div class="flex flex-col gap-2"><label class="text-black font-bold dark:text-slate-200 text-sm font-medium">Email</label><div class="relative"><span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"><span class="material-symbols-outlined text-[20px]">mail</span></span><input class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-slate-100 placeholder-slate-400 focus:border-primary focus:ring-primary pl-10 py-3" id="le" type="email" placeholder="exemplo@email.com" value="cliente@movvi.com"/></div></div><div class="flex flex-col gap-2"><div class="flex justify-between items-center"><label class="text-black font-bold dark:text-slate-200 text-sm font-medium">Senha</label><a class="text-sm text-primary font-medium" href="#">Esqueceu?</a></div><div class="relative"><span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"><span class="material-symbols-outlined text-[20px]">lock</span></span><input class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-slate-100 placeholder-slate-400 focus:border-primary focus:ring-primary pl-10 py-3" id="lp" type="password" placeholder="Senha" value="123456"/></div></div><div id="le-err" class="text-red-500 text-xs font-medium hidden"></div><button type="submit" class="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3.5 px-4 rounded-lg shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"><span>Entrar</span><span class="material-symbols-outlined text-[20px]">arrow_forward</span></button></form><div class="text-center pb-8"><p class="text-slate-600 dark:text-slate-400">Nao tem conta? <a id="go-reg" class="text-primary font-bold hover:underline cursor-pointer">Criar conta</a></p></div></div></div>',e.querySelector("#lf").onsubmit=async t=>{t.preventDefault();try{const{user:a}=await ne.loginClient(e.querySelector("#le").value,e.querySelector("#lp").value);Y(a),le()}catch(a){const s=e.querySelector("#le-err");s.textContent=a.message,s.classList.remove("hidden")}},e.querySelector("#go-reg").onclick=()=>c(ke),e}function ke(){const e=document.createElement("div");return e.className="view active bg-background-light dark:bg-background-dark",e.innerHTML='<header class="flex items-center p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10"><button id="bk" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center"><span class="material-symbols-outlined text-black font-bold dark:text-slate-200">arrow_back</span></button><h1 class="flex-1 text-center text-black font-bold dark:text-white text-base font-bold">Criar Conta</h1><div class="size-10"></div></header><main class="flex-1 p-5 pb-24"><form id="rf" class="flex flex-col gap-4 bg-white dark:bg-white/5 p-6 rounded-xl border border-slate-200 dark:border-white/10"><div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">Nome Completo</label><input id="rn" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3" required/></div><div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">E-mail</label><input id="re" type="email" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3" required/></div><div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">Telefone</label><input id="rph" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3"/></div><div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">Veiculo</label><input id="rv" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3" placeholder="Ex: Honda Civic 2022"/></div><div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">Senha</label><input id="rp" type="password" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3" required/></div><div id="re-err" class="text-red-500 text-xs font-medium hidden"></div><button type="submit" class="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3.5 rounded-lg shadow-md mt-2 active:scale-[0.98]">Criar conta</button></form></main>',e.querySelector("#bk").onclick=()=>c(re),e.querySelector("#rf").onsubmit=async t=>{t.preventDefault();try{const a=await ne.registerClient({name:e.querySelector("#rn").value,email:e.querySelector("#re").value,phone:e.querySelector("#rph").value,vehicleModel:e.querySelector("#rv").value,password:e.querySelector("#rp").value});Y(a),le()}catch(a){const s=e.querySelector("#re-err");s.textContent=a.message,s.classList.remove("hidden")}},e}function A(){var a;const e=document.createElement("div");e.className="view active bg-slate-50 dark:bg-background-dark";let t=((a=n.name)==null?void 0:a.split(" ")[0])||"Cliente";return t=t.replace(/\uFFFD/g,"ã").replace(/Joo/i,"João").replace(/Jo.?o/i,"João"),e.innerHTML=`
<header class="flex items-center justify-between px-5 py-4 sticky top-0 bg-slate-50/95 dark:bg-background-dark/95 backdrop-blur-md z-10">
  <div class="flex items-center gap-4">
    <div class="relative group cursor-pointer" id="header-profile-btn">
      <div class="size-14 overflow-hidden rounded-[18px] bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-[0_4px_15px_-3px_rgba(0,0,0,0.1)] border border-slate-200/50 dark:border-white/10 relative z-10">
        ${n.photo?`<img src="${n.photo}" class="w-full h-full object-cover">`:'<span class="material-symbols-outlined text-3xl font-light">account_circle</span>'}
      </div>
      <div class="absolute -bottom-1 -right-1 size-5 bg-green-500 border-2 border-slate-50 dark:border-background-dark rounded-full z-20"></div>
    </div>
    <div class="flex flex-col justify-center">
      <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-0.5">Ola, ${t}</p>
      <h1 class="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight">Movvi</h1>
    </div>
  </div>
  <button id="btn-menu" class="relative size-12 rounded-[16px] bg-white dark:bg-slate-800 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-200/50 dark:border-white/10 hover:-translate-y-0.5 active:translate-y-0 transition-transform flex items-center justify-center group">
    <span class="material-symbols-outlined text-slate-800 font-medium dark:text-slate-200 group-hover:text-primary transition-colors">notes</span>
  </button>
</header>
<main class="flex-1 overflow-y-auto px-5 py-2 pb-10">
  <div class="bg-primary rounded-3xl p-6 mb-8 text-slate-900 shadow-lg relative overflow-hidden">
    <div class="absolute -right-6 -top-6 opacity-20"><span class="material-symbols-outlined" style="font-size:120px">verified_user</span></div>
    <h2 class="text-2xl font-black mb-1 relative z-10 leading-tight">Precisando de <br>ajuda agora?</h2>
    <p class="text-sm font-semibold opacity-80 relative z-10">Escolha o serviço abaixo e enviamos um resgate na hora.</p>
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
</main>`,e.querySelector("#btn-menu").onclick=ee,e.querySelectorAll(".sv").forEach(s=>{s.onclick=()=>{if(p&&["searching","accepted","assigned","arrived","in_progress","pickup"].includes(p.status)){p.status==="searching"?c(se,p):c(O,p);return}c(ye,{type:s.dataset.type,name:s.dataset.name})}}),e}function ye({type:e,name:t}){const a=document.createElement("div");a.className="view active";let s,i,x,r,f="";a.innerHTML=`
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
      <h2 class="text-xl font-black text-slate-900 dark:text-white mb-5 line-clamp-1 shrink-0">${t}</h2>
      
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

      <textarea id="prob" class="w-full shrink-0 rounded-2xl bg-slate-50 outline-none dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white p-4 text-sm resize-none focus:ring-1 focus:ring-primary focus:border-primary shadow-inner" rows="2" placeholder="Descreva brevemente a situação... (Opcional)"></textarea>
    </div>

    <button id="btn-req" class="shrink-0 w-full bg-primary text-black font-black py-4 rounded-2xl shadow-[0_4px_15px_-4px_rgba(255,217,0,0.4)] hover:bg-[#ffea00] active:scale-[0.98] transition-all text-base tracking-wide">CONFIRMAR RESGATE</button>
  </div>
</div>
<style>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>`,a.querySelector("#bk").onclick=()=>c(A);let _=null;const b=a.querySelector("#addr-street"),y=a.querySelector("#addr-num"),q=a.querySelector("#addr-results");function g(){let l=[b.value];const o=y.value.trim();o&&l.push(o);const w=a.querySelector("#addr-comp").value.trim();return w&&l.push(w),f&&l.push(f),l.join(", ")}function S(){let l=[v.value];const o=a.querySelector("#dest-num").value.trim();o&&l.push(o);const w=a.querySelector("#dest-comp").value.trim();return w&&l.push(w),l.join(", ")}function I(l,o){s=l,i=o,z&&(z.flyTo([l,o],18,{duration:1}),_&&z.removeLayer(_),_=L.marker([l,o],{icon:L.divIcon({className:"",html:'<div style="position:absolute;left:0;top:0;pointer-events:none"><div style="position:absolute;left:-40px;top:-40px;width:80px;height:80px;border-radius:50%;background:rgba(59,130,246,0.25);animation:pulseSmall 2s ease-out infinite"></div><div style="position:absolute;left:-8px;top:-8px;width:16px;height:16px;border-radius:50%;background:#3b82f6;border:2px solid white;box-shadow:0 0 8px rgba(0,0,0,0.3);z-index:2"></div></div><style>@keyframes pulseSmall{0%{transform:scale(0.5);opacity:1}100%{transform:scale(1);opacity:0}}</style>',iconSize:[0,0],iconAnchor:[0,0]})}).addTo(z))}function P(l){const o=l.address||{},w=o.road||o.pedestrian||o.footway||"",u=o.neighbourhood||o.suburb||"",d=o.city||o.town||o.village||"",h=o.state||"";f=[u,d,h].filter(Boolean).join(", "),b.value=w?w+(u?", "+u:""):(l.display_name||"").split(",").slice(0,2).join(","),y.value=o.house_number||"",y.focus()}let D;b.oninput=()=>{clearTimeout(D);const l=b.value.trim();if(l.length<3){q.classList.add("hidden");return}D=setTimeout(async()=>{try{const o=l.split(",")[0].trim(),u=await(await fetch("https://nominatim.openstreetmap.org/search?format=json&countrycodes=br&limit=5&addressdetails=1&q="+encodeURIComponent(o))).json();if(!u.length){q.innerHTML='<p class="p-3 text-xs text-slate-500">Nenhum resultado</p>',q.classList.remove("hidden");return}q.innerHTML=u.map(d=>{const h=d.address||{},E=h.road||h.pedestrian||(d.display_name||"").split(",")[0],H=[h.neighbourhood||h.suburb,h.city||h.town].filter(Boolean).join(" - ");return'<div class="addr-opt flex items-start gap-2 px-3 py-2.5 cursor-pointer hover:bg-primary/5 dark:hover:bg-white/5 border-b border-slate-100 dark:border-white/5 last:border-0" data-lat="'+d.lat+'" data-lon="'+d.lon+'" data-road="'+E+'" data-area="'+H+'" data-num="'+(h.house_number||"")+'"><span class="material-symbols-outlined text-primary text-sm mt-0.5 shrink-0">location_on</span><div class="flex-1 min-w-0"><p class="text-sm font-medium text-black font-bold dark:text-white truncate">'+E+'</p><p class="text-[10px] text-slate-500 truncate">'+H+"</p></div></div>"}).join(""),q.classList.remove("hidden"),q.querySelectorAll(".addr-opt").forEach(d=>{d.onclick=()=>{b.value=d.dataset.road,y.value=d.dataset.num,f=d.dataset.area,I(parseFloat(d.dataset.lat),parseFloat(d.dataset.lon)),q.classList.add("hidden"),d.dataset.num||y.focus(),R()}})}catch{}},500)};const v=a.querySelector("#dest"),k=a.querySelector("#dest-results");let C;v.oninput=()=>{clearTimeout(C);const l=v.value.trim();if(l.length<3){k.classList.add("hidden");return}C=setTimeout(async()=>{try{const o=l.split(",")[0].trim(),u=await(await fetch("https://nominatim.openstreetmap.org/search?format=json&countrycodes=br&limit=5&addressdetails=1&q="+encodeURIComponent(o))).json();if(!u.length){k.innerHTML='<p class="p-3 text-xs text-slate-500">Nenhum resultado</p>',k.classList.remove("hidden");return}k.innerHTML=u.map(d=>{const h=d.address||{},E=h.road||h.pedestrian||(d.display_name||"").split(",")[0],H=[h.neighbourhood||h.suburb,h.city||h.town].filter(Boolean).join(" - ");return'<div class="addr-opt flex items-start gap-2 px-3 py-2.5 cursor-pointer hover:bg-primary/5 dark:hover:bg-white/5 border-b border-slate-100 dark:border-white/5 last:border-0" data-lat="'+d.lat+'" data-lon="'+d.lon+'" data-road="'+E+'" data-area="'+H+'" data-num="'+(h.house_number||"")+'"><span class="material-symbols-outlined text-red-500 text-sm mt-0.5 shrink-0">location_on</span><div class="flex-1 min-w-0"><p class="text-sm font-medium text-black font-bold dark:text-white truncate">'+E+'</p><p class="text-[10px] text-slate-500 truncate">'+H+"</p></div></div>"}).join(""),k.classList.remove("hidden"),k.querySelectorAll(".addr-opt").forEach(d=>{d.onclick=()=>{v.value=d.dataset.road,a.querySelector("#dest-num").value=d.dataset.num,x=parseFloat(d.dataset.lat),r=parseFloat(d.dataset.lon),k.classList.add("hidden"),d.dataset.num||a.querySelector("#dest-num").focus(),R()}})}catch{}},500)},a.addEventListener("click",l=>{!l.target.closest("#addr-results")&&!l.target.closest("#addr-street")&&q.classList.add("hidden"),!l.target.closest("#dest-results")&&!l.target.closest("#dest")&&k.classList.add("hidden")}),a.querySelector("#btn-gps").onclick=()=>{b.value="Localizando...",oe().then(l=>{fetch("https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat="+l.latitude+"&lon="+l.longitude).then(o=>o.json()).then(o=>{P(o),I(l.latitude,l.longitude)}).catch(()=>{b.value="GPS Indisponivel"})}).catch(()=>{b.value="GPS Indisponivel"})},setTimeout(()=>{const l=a.querySelector("#dmap");if(!l)return;const o=(n==null?void 0:n.latitude)||-23.55,w=(n==null?void 0:n.longitude)||-46.63;z=L.map(l,{zoomControl:!1,attributionControl:!1}).setView([o,w],18),L.tileLayer(Q()).addTo(z),oe().then(u=>{fetch("https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat="+u.latitude+"&lon="+u.longitude).then(d=>d.json()).then(d=>{P(d),I(u.latitude,u.longitude)}).catch(()=>I(u.latitude,u.longitude))}).catch(()=>{b.placeholder="Digite sua rua..."})},100);function M(l,o,w,u){if(!l||!o||!w||!u)return 0;const d=6371,h=Math.PI/180,E=.5-Math.cos((w-l)*h)/2+Math.cos(l*h)*Math.cos(w*h)*(1-Math.cos((u-o)*h))/2;return 2*d*Math.asin(Math.sqrt(E))}let j=null,N=null;async function R(){if(!(!s||!i||!x||!r))try{N&&z.removeLayer(N),N=L.marker([x,r],{icon:L.divIcon({className:"",html:'<div style="width:16px;height:16px;background:#ef4444;border:3px solid white;border-radius:50%;box-shadow:0 0 8px rgba(0,0,0,0.3)"></div>',iconSize:[16,16],iconAnchor:[8,8]})}).addTo(z);const o=await(await fetch(`https://router.project-osrm.org/route/v1/driving/${i},${s};${r},${x}?overview=full&geometries=geojson`)).json();if(o.routes&&o.routes.length>0){const w=o.routes[0].geometry.coordinates.map(d=>[d[1],d[0]]);j&&z.removeLayer(j),j=L.polyline(w,{color:"#ef4444",weight:4,opacity:.8,dashArray:"5, 8"}).addTo(z),z.fitBounds(j.getBounds(),{padding:[30,30]});const u=(o.routes[0].distance/1e3).toFixed(1);a.querySelector("#route-info-detail").innerHTML=`<span class="material-symbols-outlined text-[14px]">route</span> Distância Total: ${u} km`,a.querySelector("#route-info-detail").classList.remove("hidden")}}catch{}}return a.querySelector("#btn-req").onclick=async()=>{if(!s){alert('Clique em "Usar GPS" ou digite seu endereco de origem.');return}if(!a.querySelector("#dest").value.trim()){alert("Informe o endereco de destino."),a.querySelector("#dest").focus();return}const o=a.querySelector("#btn-req"),w=o.innerHTML;o.innerHTML='<span class="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span> Calculando...',o.disabled=!0;let u=M(s,i,x,r);(!x||u===0)&&(u=10);try{const W=await(await fetch(`https://router.project-osrm.org/route/v1/driving/${i},${s};${r},${x}?overview=false`)).json();W.routes&&W.routes.length>0&&(u=W.routes[0].distance/1e3)}catch{}o.innerHTML=w,o.disabled=!1;const h=80+u*3.5,E=60+u*2.5,H=g(),ue=S(),me={clientId:n.id,clientName:n.name,serviceType:e,serviceName:t,pickupAddress:H,pickupLat:s,pickupLon:i,destinationAddress:ue,destinationLat:x,destinationLon:r,vehicleModel:n.vehicleModel||"",problemDescription:a.querySelector("#prob").value,distanceKm:u.toFixed(1),price:h,driverPrice:E};c(we,me)},a}function we(e){const t=document.createElement("div");t.className="view active bg-background-light dark:bg-background-dark";const a=(e.price||0).toFixed(2).replace(".",",");return t.innerHTML='<header class="flex items-center p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10"><button id="bk" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center"><span class="material-symbols-outlined text-black font-bold dark:text-slate-200">arrow_back</span></button><h1 class="flex-1 text-center text-black font-bold dark:text-white text-base font-bold">Resumo do Pedido</h1><div class="size-10"></div></header><main class="flex-1 overflow-y-auto px-4 py-6"><div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-5 mb-5 shadow-sm"><div class="flex items-center gap-3 mb-4"><span class="material-symbols-outlined text-primary text-2xl">build</span><h2 class="text-xl font-bold text-black font-bold dark:text-white">'+e.serviceName+'</h2></div><div class="flex flex-col gap-4 relative"><div class="absolute left-[11px] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-white/10"></div><div class="flex items-start gap-4 relative z-10"><div class="size-6 rounded-full bg-white dark:bg-background-dark border-4 border-primary mt-0.5"></div><div><p class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Origem</p><p class="text-black font-bold dark:text-slate-200 text-sm font-medium line-clamp-2">'+e.pickupAddress+'</p></div></div><div class="flex items-start gap-4 relative z-10"><div class="size-6 rounded-full bg-white dark:bg-background-dark border-4 border-slate-400 dark:border-slate-500 mt-0.5"></div><div><p class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Destino</p><p class="text-black font-bold dark:text-slate-200 text-sm font-medium line-clamp-2">'+e.destinationAddress+'</p></div></div></div></div><div class="grid grid-cols-2 gap-3 mb-5"><div class="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-4 text-center"><p class="text-xs tracking-wider uppercase font-bold text-slate-500 mb-1">Distancia</p><p class="text-lg font-bold text-black font-bold dark:text-white">'+e.distanceKm+' km</p></div><div class="bg-primary/10 rounded-xl border border-primary/20 p-4 text-center"><p class="text-xs tracking-wider uppercase font-bold text-primary mb-1">Total</p><p class="text-lg font-black text-primary">R$ '+a+'</p></div></div><div class="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-xl p-4 mb-5 flex items-start gap-3"><span class="material-symbols-outlined text-yellow-600 dark:text-yellow-500 mt-0.5">info</span><p class="text-xs font-medium text-yellow-800 dark:text-yellow-200/80 leading-snug">O valor inclui a taxa de deslocamento e servico basico. <br/><b>Aviso:</b> O cancelamento apos o motorista estar a caminho gerara uma cobrança de uma taxa administrativa de R$ 30,00.</p></div><div class="mb-5"><p class="text-sm font-bold text-black font-bold dark:text-white mb-3">Forma de Pagamento</p><div class="flex flex-col gap-2"><label class="flex items-center justify-between p-4 rounded-xl border border-primary bg-primary/5 cursor-pointer"><div class="flex items-center gap-3"><span class="material-symbols-outlined text-primary">pix</span><span class="font-bold text-black font-bold dark:text-white text-sm">Pix (Rapido)</span></div><input type="radio" name="pay" class="text-primary focus:ring-primary" checked></label><label class="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:border-primary/50 cursor-pointer"><div class="flex items-center gap-3"><span class="material-symbols-outlined text-slate-500">credit_card</span><span class="font-bold text-black font-bold dark:text-white text-sm">Cartao de Credito</span></div><input type="radio" name="pay" class="text-primary focus:ring-primary"></label></div></div><button id="btn-confirm" class="w-full bg-primary hover:bg-primary/90 text-black font-bold py-4 rounded-xl shadow-lg active:scale-[0.98]">Confirmar e Buscar Motorista</button></main>',t.querySelector("#bk").onclick=()=>c(A),t.querySelector("#btn-confirm").onclick=async()=>{try{const s=await B.create(e);p=s,c(se,s)}catch(s){alert(s.message)}},t}function se(e){const t=document.createElement("div");return t.className="view active bg-background-light dark:bg-background-dark",t.innerHTML=`
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
</div>`,t.querySelector("#cancel").onclick=async()=>{try{await B.updateStatus(e.id,"cancelled"),p=null,c(A)}catch(a){alert(a.message)}},setTimeout(()=>{const a=t.querySelector("#searchmap");if(!a)return;const s=L.map(a,{zoomControl:!1,attributionControl:!1,dragging:!1,scrollWheelZoom:!1}).setView([e.pickupLat,e.pickupLon],14);L.tileLayer(Q()).addTo(s),s.flyTo([e.pickupLat,e.pickupLon],15,{duration:2}),L.marker([e.pickupLat,e.pickupLon],{icon:L.divIcon({className:"",html:`<div style="position:absolute;left:0;top:0;pointer-events:none">
          <div style="position:absolute;left:-400px;top:-400px;width:800px;height:800px;border-radius:50%;background:rgba(59,130,246,0.1);animation:pulseSearch 3s ease-out infinite"></div>
          <div style="position:absolute;left:-250px;top:-250px;width:500px;height:500px;border-radius:50%;background:rgba(59,130,246,0.15);animation:pulseSearch 3s ease-out infinite 0.7s"></div>
          <div style="position:absolute;left:-100px;top:-100px;width:200px;height:200px;border-radius:50%;background:rgba(59,130,246,0.25);animation:pulseSearch 3s ease-out infinite 1.4s"></div>
          <div style="position:absolute;left:-10px;top:-10px;width:20px;height:20px;border-radius:50%;background:#3b82f6;box-shadow:0 0 16px rgba(59,130,246,0.8);z-index:2; border:3px solid white"></div>
        </div>
        <style>@keyframes pulseSearch{0%{transform:scale(0);opacity:1}100%{transform:scale(1.5);opacity:0}}</style>`,iconSize:[0,0],iconAnchor:[0,0]})}).addTo(s)},100),t}function O(e){const t=document.createElement("div");t.className="view active bg-slate-200 dark:bg-background-dark",t.innerHTML=`<div class="flex flex-col relative overflow-hidden" style="height:100dvh">
  <!-- Status Indicator Overlay -->
  <div class="absolute top-0 left-0 right-0 h-1 z-30 flex gap-0.5">
    <div class="flex-1 h-full bg-emerald-500 animate-pulse"></div>
    <div class="flex-1 h-full bg-emerald-500/30"></div>
    <div class="flex-1 h-full bg-emerald-500/30"></div>
  </div>

  <div id="tmap" class="w-full bg-slate-200 dark:bg-background-dark z-0" style="height:62%"></div>
  
  <div class="flex-1 bg-white dark:bg-background-dark border-t border-slate-200 dark:border-white/5 rounded-t-[40px] -mt-10 relative z-20 p-6 flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
    <!-- Visual Handle -->
    <div class="w-12 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mx-auto mb-6 shrink-0 transition-all hover:w-20"></div>

    <!-- Active Service Info (Mini) -->
    <div class="flex items-center gap-2 mb-6 opacity-0 animate-[fadeInUp_0.5s_ease_forwards_0.1s] shrink-0">
      <div class="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
        <span class="material-symbols-outlined text-[18px] animate-pulse">check_circle</span>
      </div>
      <p class="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[2px]">Resgate Confirmado • ${e.serviceName||"Serviço"}</p>
    </div>

    <!-- Premium Driver Card -->
    <div class="bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-3xl p-5 mb-8 flex-shrink-0 relative overflow-hidden group opacity-0 animate-[fadeInUp_0.5s_ease_forwards_0.2s]">
      <!-- Animated Background Accent -->
      <div class="absolute -right-10 -top-10 size-40 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div class="flex items-center gap-5 relative z-10">
        <!-- Profile Photo -->
        <div class="relative shrink-0">
          <div class="size-20 rounded-[28px] bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary overflow-hidden shadow-2xl transition-transform group-hover:scale-105 duration-500">
            ${e.driverPhoto?`<img src="${e.driverPhoto}" class="w-full h-full object-cover">`:'<span class="material-symbols-outlined text-4xl">person</span>'}
          </div>
          <div class="absolute -bottom-1 -right-1 size-7 bg-emerald-500 border-4 border-white dark:border-background-dark rounded-full flex items-center justify-center shadow-lg">
             <div class="size-2 bg-white rounded-full animate-ping"></div>
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
             <h3 class="text-black font-black dark:text-white text-xl leading-none tracking-tight">${e.driverName||"Motorista"}</h3>
             <div class="flex items-center gap-1 bg-primary px-2 py-0.5 rounded-full">
                <span class="material-symbols-outlined text-[12px] text-black">star</span>
                <span class="text-[10px] font-black text-black">${e.driverRating||"5.0"}</span>
             </div>
          </div>
          <div class="flex flex-col gap-0.5">
            <p class="text-slate-500 dark:text-slate-400 text-sm font-bold truncate">${e.driverVehicle||"Guincho Parceiro"}</p>
            <p class="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 dark:bg-primary/10 py-0.5 px-2 rounded inline-block w-fit mt-1 border border-primary/20">Placa ${e.driverPlate||"--"}</p>
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

  <style>
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</div > `,t.querySelector("#btn-chat").onclick=()=>{const v=document.getElementById("chat-dot");v&&v.remove(),c(Ie,e)};const a=()=>pe(e.driverId,e.driverName,e.driverPhoto);t.querySelector("#btn-call").onclick=a;const s=t.querySelector("#btn-call-delay");s&&(s.onclick=a),t.querySelector("#btn-cancel").onclick=async()=>{if(confirm("Tem certeza que deseja cancelar o resgate?"))try{await B.updateStatus(e.orderId||e.id,"cancelled"),p=null,c(A)}catch(v){alert(v.message)}};let i=null,x=null;const r=t.querySelector("#eta-text"),f=e.pickupLat||-23.55,_=e.pickupLon||-46.63;e.status==="arrived"&&(r.innerHTML='<span class="text-green-500 font-bold">Motorista Chegou!</span>'),e.status==="in_progress"&&(r.innerHTML='<span class="text-primary font-bold drop-shadow-sm">A caminho do destino</span>');let b=null;const y=20*60*1e3,q=({orderId:v,etaMinutes:k,distanceKm:C})=>{if(v===(e.orderId||e.id)){if(p&&(p.status==="arrived"||p.status==="in_progress"))return;const M=t.querySelector("#dist-text");r.textContent=`~${k} min`,M&&(M.textContent=`${C} km`);const j=Date.now()+k*60*1e3;(!b||j>b)&&(b=j)}};m.on("driver:eta",q);const g=setInterval(()=>{b&&Date.now()>b+y&&(t.querySelector("#default-actions").classList.add("hidden"),t.querySelector("#delay-actions").classList.remove("hidden"),t.querySelector("#delay-actions").classList.add("flex"))},1e4),S=({latitude:v,longitude:k})=>{J&&J.setLatLng([v,k]),i&&i.panTo([v,k]),P(v,k)};m.on("driver:location",S);let I=null;async function P(v,k){if(!i||I)return;I=setTimeout(()=>{I=null},1e4);let C=e.pickupLat||-23.55,M=e.pickupLon||-46.63;p&&p.status==="in_progress"&&(C=p.destinationLat||C,M=p.destinationLon||M);try{const l=await(await fetch(`https://router.project-osrm.org/route/v1/driving/${k},${v};${M},${C}?overview=full&geometries=geojson`)).json();if(l.routes&&l.routes.length>0){const o=l.routes[0].geometry.coordinates.map(E=>[E[1],E[0]]);x&&i.removeLayer(x),x=L.polyline(o,{color:"#2563eb",weight:5,opacity:.85}).addTo(i);const w=Math.round(l.routes[0].duration/60),u=(l.routes[0].distance/1e3).toFixed(1),d=t.querySelector("#dist-text");r.textContent=`~${w} min`,d&&(d.textContent=`${u} km`);const h=Date.now()+w*60*1e3;(!b||h>b)&&(b=h);return}}catch{}x&&i.removeLayer(x),x=L.polyline([[v,k],[f,_]],{color:"#2563eb",weight:4,dashArray:"10,8",opacity:.7}).addTo(i);const j=(Math.sqrt(Math.pow(v-f,2)+Math.pow(k-_,2))*111).toFixed(1),N=t.querySelector("#dist-text");N&&(N.textContent=`${j} km`),r.textContent="-- min"}setTimeout(async()=>{const v=e.driverLat||f,k=e.driverLon||_;i=L.map(t.querySelector("#tmap"),{zoomControl:!1,attributionControl:!1}).setView([v,k],18),L.tileLayer(Q()).addTo(i),J=L.marker([v,k],{icon:L.divIcon({className:"",html:'<div style="background:#2563eb;color:#fff;width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 0 15px rgba(37,99,235,0.5)"><span class="material-symbols-outlined" style="font-size:18px">car_repair</span></div>',iconSize:[30,30],iconAnchor:[15,15]})}).addTo(i),L.marker([f,_],{icon:L.divIcon({className:"",html:'<div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center"><div style="position:absolute;width:24px;height:24px;border-radius:50%;background:rgba(59,130,246,0.2);animation:pulseAura 2s ease-out infinite"></div><div style="width:8px;height:8px;border-radius:50%;background:#3b82f6;z-index:2"></div></div><style>@keyframes pulseAura{0%{transform:scale(.5);opacity:.8}100%{transform:scale(1.5);opacity:0}}</style>',iconSize:[24,24],iconAnchor:[12,12]})}).addTo(i),(v!==f||k!==_)&&(P(v,k),i.fitBounds([[v,k],[f,_]],{padding:[40,40]}));try{const C=e.driverId||(e.orderId?(await B.get(e.orderId)).driverId:null);C&&fetch("/api/drivers/"+C).then(M=>M.json()).then(M=>{const j=M.pixKey;if(j){const N=t.querySelector("#tracking-pix");N&&N.classList.remove("hidden");const R=t.querySelector("#tracking-pix-val");R&&(R.textContent=j);const l=t.querySelector("#btn-copy-pix-tracking");l&&(l.onclick=()=>{navigator.clipboard.writeText(j),alert("Chave PIX copiada!")})}}).catch(()=>{})}catch(C){console.warn("Could not fetch driver ID for Pix key:",C)}},200);const D=setInterval(()=>{document.body.contains(t)||(clearInterval(g),clearInterval(D))},5e3);return t}function Le(e){const t=document.createElement("div");t.className="view active bg-background-light dark:bg-background-dark";let a=0;const s=(e.price||0).toFixed(2).replace(".",",");return t.innerHTML=`
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
        <p class="text-3xl font-black text-primary relative z-10">R$ ${s}</p>
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
</div>`,t.querySelectorAll("#stars button").forEach(i=>{i.onclick=()=>{a=parseInt(i.dataset.v),t.querySelectorAll("#stars button span").forEach(x=>{const r=parseInt(x.parentElement.dataset.v);x.className="material-symbols-outlined text-[28px] transition-colors "+(r<=a?"text-primary drop-shadow-[0_0_8px_rgba(255,217,0,0.5)]":"text-slate-300")})}}),t.querySelector("#done").onclick=()=>{p=null,c(A)},setTimeout(async()=>{try{const i=e.driverId||(e.orderId?(await B.get(e.orderId)).driverId:null);if(!i)throw new Error("Driver ID not found");const x=await fetch("/api/drivers/"+i).then(y=>y.json()),r=t.querySelector("#pix-loader"),f=t.querySelector("#pix-key-box"),_=t.querySelector("#pix-key-val");r.classList.add("hidden");const b=x.pixKey;b?(f.classList.remove("hidden"),f.classList.add("flex"),_.value=b,t.querySelector("#btn-copy-pix").onclick=()=>{navigator.clipboard.writeText(b).then(()=>{const y=t.querySelector("#btn-copy-pix"),q=y.innerHTML;y.classList.add("bg-green-500","text-white","border-green-500"),y.classList.remove("bg-white","text-primary"),y.innerHTML='<span class="material-symbols-outlined text-sm">check</span>',setTimeout(()=>{y.innerHTML=q,y.classList.remove("bg-green-500","text-white","border-green-500"),y.classList.add("bg-white","text-primary")},1500)})}):(r.classList.remove("hidden"),r.classList.remove("text-primary"),r.classList.add("text-slate-500"),r.innerHTML="Chave PIX não cadastrada pelo motorista.")}catch{}},300),t}function Se(){const e=document.createElement("div");return e.className="view active bg-background-light dark:bg-background-dark",e.innerHTML='<header class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10"><button id="btn-menu" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-black font-bold dark:text-slate-200"><span class="material-symbols-outlined">menu</span></button><h2 class="font-bold text-black font-bold dark:text-white">Historico</h2><div class="size-10"></div></header><main class="flex-1 overflow-y-auto p-4"><div id="hl"><p class="text-slate-500 text-sm text-center py-8">Carregando...</p></div></main>',e.querySelector("#btn-menu").onclick=ee,(async()=>{try{const t=await B.list({clientId:n.id}),a=e.querySelector("#hl");if(!t.length){a.innerHTML='<p class="text-slate-500 text-sm text-center py-8">Nenhum servico</p>';return}a.innerHTML=t.map(s=>'<div class="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-3"><div class="flex-1"><h4 class="font-semibold text-sm text-black font-bold dark:text-white">'+s.serviceName+'</h4><p class="text-xs text-slate-500">'+(s.pickupAddress||"")+'</p></div><p class="text-xs font-bold '+(s.status==="completed"?"text-green-500":"text-primary")+'">'+s.status+"</p></div>").join("")}catch{}})(),e}function ce(){const e=document.createElement("div");e.className="view active bg-background-light dark:bg-background-dark";const a=(n.name||"").replace(/\uFFFD/g,"ã").replace(/Joo/i,"João").replace(/Jo.?o/i,"João"),s=n.photo||"";e.innerHTML=`
<header class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10 transition-all">
  <button id="btn-menu" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-black font-bold dark:text-slate-200"><span class="material-symbols-outlined">menu</span></button>
  <h2 class="font-bold text-black font-bold dark:text-white">Perfil</h2><div class="size-10"></div>
</header>
<main class="flex-1 p-5 overflow-y-auto">
  <div class="flex flex-col items-center gap-4 mb-8 mt-4 relative">
    <div class="relative group cursor-pointer z-10" id="photo-container">
      <div class="size-28 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-background-dark shadow-xl flex items-center justify-center text-slate-400 overflow-hidden relative">
        ${s?`<img src="${s}" class="w-full h-full object-cover" id="p-img" />`:'<span class="material-symbols-outlined text-[3rem]" id="p-icon">person</span>'}
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
        <input type="text" id="i-name" class="bg-transparent text-black font-bold dark:text-white font-medium text-lg w-full outline-none" value="${a}" readonly />
        <button id="b-edit-name" class="text-primary p-2 -mr-2"><span class="material-symbols-outlined text-sm">edit</span></button>
      </div>
    </div>
    <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4">
      <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Email</p>
      <p class="text-black font-bold dark:text-white font-medium text-base">${n.email||"N/A"}</p>
    </div>
    <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4">
      <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Telefone</p>
      <p class="text-black font-bold dark:text-white font-medium text-base">${n.phone||"N/A"}</p>
    </div>
    <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4">
      <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Veículo Reservado</p>
      <p class="text-black font-bold dark:text-white font-medium text-base">${n.vehicleModel||"Nao cadastrado"}</p>
    </div>
  </div>
  
  <button id="btn-save" class="w-full bg-primary text-black font-bold py-3.5 rounded-xl shadow-lg mt-8 hidden active:scale-[0.98] transition-all">Salvar Alterações</button>
</main>`,e.querySelector("#btn-menu").onclick=()=>{X(),ee()};const i=e.querySelector("#header-profile-btn");i&&(i.onclick=()=>{X(),c(ce)});const x=e.querySelector("#f-input"),r=e.querySelector("#btn-save"),f=e.querySelector("#i-name"),_=e.querySelector("#b-edit-name");let b=null;return e.querySelector("#photo-container").onclick=()=>x.click(),x.onchange=y=>{const q=y.target.files[0];if(q){const g=new FileReader;g.onload=S=>{b=S.target.result;const I=e.querySelector(".size-28");I.innerHTML=`<img src="${b}" class="w-full h-full object-cover relative z-0" />
                       <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"><span class="material-symbols-outlined text-white">photo_camera</span></div>`,r.classList.remove("hidden")},g.readAsDataURL(q)}},_.onclick=()=>{f.removeAttribute("readonly"),f.focus(),f.classList.add("border-b","border-primary","pb-1"),r.classList.remove("hidden")},r.onclick=async()=>{const y=f.value.trim();y&&(n.name=y),b&&(n.photo=b),Y(n);try{await fetch("/api/clients/"+n.id,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:n.name,photo:n.photo})})}catch{}r.textContent="Salvo!",r.classList.remove("bg-primary"),r.classList.add("bg-green-500","text-white"),setTimeout(()=>{r.classList.add("hidden"),r.textContent="Salvar Alterações",r.classList.add("bg-primary"),r.classList.remove("bg-green-500","text-white"),f.setAttribute("readonly","true"),f.classList.remove("border-b","border-primary","pb-1"),Z()},1500)},e}function Ie(e){const t=document.createElement("div");t.className="view active bg-background-light dark:bg-background-dark";const a=e.orderId||e.id;t.innerHTML=`
<div class="flex flex-col" style="height:100dvh">
<header class="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-white/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10">
  <button id="bk" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center"><span class="material-symbols-outlined text-black dark:text-slate-200">arrow_back</span></button>
  <div class="flex-1 min-w-0">
    <h1 class="text-base font-bold text-black dark:text-white truncate">${e.driverName||"Motorista"}</h1>
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
</div>`,t.querySelector("#bk").onclick=()=>c(O,e),t.querySelector("#btn-chat-call").onclick=()=>pe(e.driverId,e.driverName,e.driverPhoto);const s=t.querySelector("#chat-msgs");function i(g){const S=g.from==="client",I=new Date(g.timestamp).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),P=document.createElement("div");P.className=`flex ${S?"justify-end":"justify-start"} `;let D;g.type==="audio"&&g.audioData?D=`<audio controls src="${g.audioData}" style="max-width:220px;height:40px"></audio>`:D=`<p class="text-sm">${g.message}</p>`,P.innerHTML=`<div class="max-w-[80%] px-4 py-2.5 rounded-2xl ${S?"bg-primary text-black rounded-br-md":"bg-slate-100 dark:bg-white/10 text-black dark:text-white rounded-bl-md"}">${D} <p class="text-[9px] mt-1 ${S?"text-black/60":"text-slate-400"} text-right">${I}</p></div>`,s.appendChild(P),s.scrollTop=s.scrollHeight}m.emit("order-chat:get-history",{orderId:a}),m.once("order-chat:history",({messages:g})=>{g&&g.forEach(i)});const x=g=>{g.orderId===a&&i(g)};m.on("order-chat:new-message",x),t.querySelector("#chat-form").onsubmit=g=>{g.preventDefault();const S=t.querySelector("#chat-input"),I=S.value.trim();I&&(m.emit("order-chat:client-to-driver",{orderId:a,driverId:e.driverId,clientId:n.id,message:I,type:"text"}),i({from:"client",message:I,type:"text",timestamp:new Date().toISOString()}),S.value="")};let r=null,f=[];const _=t.querySelector("#btn-audio"),b=t.querySelector("#recording-status"),y=t.querySelector("#btn-stop"),q=t.querySelector("#btn-cancel-audio");return _.onclick=async()=>{try{const g=await navigator.mediaDevices.getUserMedia({audio:!0});r=new MediaRecorder(g),f=[],r.ondataavailable=S=>{S.data.size>0&&f.push(S.data)},r.onstop=()=>{g.getTracks().forEach(S=>S.stop())},r.start(),b.classList.remove("hidden"),_.classList.add("hidden")}catch{alert("Não foi possível acessar o microfone.")}},y.onclick=()=>{!r||r.state!=="recording"||(r.onstop=()=>{r.stream.getTracks().forEach(I=>I.stop());const g=new Blob(f,{type:"audio/webm"}),S=new FileReader;S.onloadend=()=>{const I=S.result;m.emit("order-chat:client-to-driver",{orderId:a,driverId:e.driverId,clientId:n.id,type:"audio",audioData:I}),i({from:"client",type:"audio",audioData:I,timestamp:new Date().toISOString()})},S.readAsDataURL(g),b.classList.add("hidden"),_.classList.remove("hidden")},r.stop())},q.onclick=()=>{r&&r.state==="recording"&&(r.onstop=()=>{r.stream.getTracks().forEach(g=>g.stop())},r.stop()),f=[],b.classList.add("hidden"),_.classList.remove("hidden")},t}let T=null,V=null;function pe(e,t,a){X(),c(be,{targetId:e,targetName:t,targetPhoto:a,incoming:!1})}function be(e){const t=document.createElement("div");t.className="view active bg-slate-900 text-white",t.innerHTML=`
<div class="flex flex-col h-full items-center justify-between p-10 bg-gradient-to-b from-slate-800 to-black">
  <div class="text-center mt-10">
    <div class="size-32 rounded-full overflow-hidden border-4 border-emerald-500 shadow-2xl mb-6 mx-auto">
      ${e.targetPhoto?`<img src="${e.targetPhoto}" class="w-full h-full object-cover">`:'<span class="material-symbols-outlined text-6xl mt-6">person</span>'}
    </div>
    <h2 class="text-2xl font-black mb-2">${e.targetName}</h2>
    <p id="call-status" class="text-emerald-400 font-bold uppercase tracking-widest text-xs animate-pulse">${e.incoming?"Chamada Recebida...":"Chamando..."}</p>
  </div>

  <div class="flex gap-8 mb-20 text-center">
    ${e.incoming?`
      <button id="btn-accept" class="size-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg active:scale-95 transition-all"><span class="material-symbols-outlined text-3xl">call</span></button>
      <button id="btn-hangup" class="size-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg active:scale-95 transition-all"><span class="material-symbols-outlined text-3xl">call_end</span></button>
    `:`
      <button id="btn-hangup" class="size-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg active:scale-95 transition-all"><span class="material-symbols-outlined text-3xl">call_end</span></button>
    `}
  </div>
  <audio id="remote-audio" autoplay class="hidden"></audio>
</div>`;const a=t.querySelector("#call-status"),s=t.querySelector("#remote-audio"),i=()=>{$.pause(),$.currentTime=0,V&&V.getTracks().forEach(r=>r.stop()),T&&T.close(),T=null,V=null},x=async()=>{if(T=new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"}]}),T.onicecandidate=r=>{r.candidate&&m.emit("call:signal",{targetId:e.targetId,signal:{ice:r.candidate}})},T.ontrack=r=>{s.srcObject=r.streams[0],a.textContent="Em Chamada",a.classList.remove("animate-pulse")},V=await navigator.mediaDevices.getUserMedia({audio:!0}),V.getTracks().forEach(r=>T.addTrack(r,V)),!e.incoming){const r=await T.createOffer();await T.setLocalDescription(r),m.emit("call:request",{targetId:e.targetId,userId:n.id,callerName:n.name,callerPhoto:n.photo}),m.emit("call:signal",{targetId:e.targetId,signal:{sdp:r}})}};return e.incoming&&($.play(),t.querySelector("#btn-accept").onclick=async()=>{$.pause(),$.currentTime=0,await x(),m.emit("call:accept",{targetId:e.targetId})}),t.querySelector("#btn-hangup").onclick=()=>{m.emit("call:end",{targetId:e.targetId}),i(),p?c(O,p):c(A)},m.off("call:signal").on("call:signal",async({signal:r})=>{if(T||await x(),r.sdp){if(await T.setRemoteDescription(new RTCSessionDescription(r.sdp)),r.sdp.type==="offer"){const f=await T.createAnswer();await T.setLocalDescription(f),m.emit("call:signal",{targetId:e.targetId,signal:{sdp:f}})}}else r.ice&&await T.addIceCandidate(new RTCIceCandidate(r.ice))}),m.off("call:accepted").on("call:accepted",()=>{a.textContent="Em Chamada",a.classList.remove("animate-pulse")}),m.off("call:rejected").on("call:rejected",()=>{i(),p?c(O,p):c(A)}),m.off("call:ended").on("call:ended",()=>{i(),p?c(O,p):c(A)}),e.incoming||x(),t}function _e(){m.on("call:incoming",e=>{X(),c(be,{targetId:e.fromId,targetName:e.callerName,targetPhoto:e.callerPhoto,incoming:!0})})}const qe=ae;ae=()=>{qe(),_e()};async function le(){ae(),Z();try{const t=(await B.list({clientId:n.id})).find(a=>["searching","accepted","assigned","arrived","in_progress","pickup"].includes(a.status));t?(p=t,t.status==="searching"?c(se,t):c(O,t)):c(A)}catch(e){console.error("[INIT] Error listing orders:",e),c(A)}}function de(){if(console.log("[DEBUG] startApp executing"),K=document.getElementById("app-content"),F=document.getElementById("sidebar"),U=document.getElementById("sidebar-overlay"),!K||!U){console.error("CRITICAL: DOM elements not found.");return}U.onclick=te;const e=ge();e?(n=e,le()):c(re)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",de):de();
