import{O as B,A as se,P as xe}from"./api-H6lC6YHp.js";import{i as Le,g as fe}from"./geo-Dl6lxGpH.js";console.log("[DEBUG] main.js loaded");let ee,O,K,g,d,x,A,Y,he;const D=new Audio("https://www.myinstants.com/media/sounds/incoming-call-sound.mp3");D.loop=!0;D.volume=1;function te(){D.play().then(()=>{D.pause(),D.currentTime=0})}function oe(e){d=e,localStorage.setItem("movvi_client",JSON.stringify(e))}function _e(){try{return JSON.parse(localStorage.getItem("movvi_client"))}catch{return null}}function c(e,t){de(),ee.innerHTML="";const r=e(t);ee.appendChild(r),r.classList.add("fade-in")}function Ie(){return document.documentElement.classList.contains("dark")}function le(){return"https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"}var Z=localStorage.getItem("movvi_client_theme")||"light";function qe(e){Z=e,e==="light"?(document.documentElement.classList.remove("dark"),localStorage.setItem("movvi_client_theme","light")):e==="dark"?(document.documentElement.classList.add("dark"),localStorage.setItem("movvi_client_theme","dark")):localStorage.removeItem("movvi_client_theme"),ie()}function ie(){var r;let e=((r=d==null?void 0:d.name)==null?void 0:r.split(" ")[0])||"Cliente";e=e.replace(/\uFFFD/g,"ã").replace(/Joo/i,"João").replace(/Jo.?o/i,"João"),Ie();const t=d.photo||"";O.innerHTML=`<div class="px-5 pt-12 pb-6 flex items-center justify-between border-b border-slate-200 dark:border-white/10"><div class="flex items-center gap-3"><div class="size-11 overflow-hidden rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center text-primary shadow-sm">${t?`<img src="${t}" class="w-full h-full object-cover">`:'<span class="material-symbols-outlined">person</span>'}</div><div><p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest mb-0.5">Ola, ${e}</p><h1 class="text-base font-black text-black dark:text-white leading-tight">Movvi Resgate</h1></div></div><button class="sidebar-close size-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:text-primary transition-colors"><span class="material-symbols-outlined text-base">close</span></button></div><nav class="flex-1 overflow-y-auto pt-4 px-3"><a data-nav="home" class="flex items-center gap-3 px-3 py-3 rounded-xl text-black font-bold dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary cursor-pointer transition-colors group"><span class="material-symbols-outlined text-slate-400 group-hover:text-primary" style="font-variation-settings:'FILL' 1">home</span><span class="text-sm font-bold">Inicio</span></a><a data-nav="history" class="flex items-center gap-3 px-3 py-3 rounded-xl text-black font-bold dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary cursor-pointer transition-colors group"><span class="material-symbols-outlined text-slate-400 group-hover:text-primary">history</span><span class="text-sm font-bold">Historico</span></a><a data-nav="profile" class="flex items-center gap-3 px-3 py-3 rounded-xl text-black font-bold dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary cursor-pointer transition-colors group"><span class="material-symbols-outlined text-slate-400 group-hover:text-primary">person</span><span class="text-sm font-bold">Perfil</span></a><div class="mt-4 px-3 py-3"><p class="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-widest">Aparencia</p><div class="flex gap-1 bg-slate-100 dark:bg-white/10 rounded-xl p-1"><button data-theme="light" class="flex-1 text-[10px] py-1.5 rounded-lg font-bold transition-all ${Z==="light"?"bg-white dark:bg-white/20 text-primary shadow-sm":"text-slate-500"}">CLARO</button><button data-theme="dark" class="flex-1 text-[10px] py-1.5 rounded-lg font-bold transition-all ${Z==="dark"?"bg-white dark:bg-white/20 text-primary shadow-sm":"text-slate-500"}">ESCURO</button><button data-theme="auto" class="flex-1 text-[10px] py-1.5 rounded-lg font-bold transition-all ${Z==="auto"?"bg-white dark:bg-white/20 text-primary shadow-sm":"text-slate-500"}">AUTO</button></div></div></nav><div class="px-5 pb-8 pt-4 border-t border-slate-200 dark:border-white/10"><a data-nav="logout" class="flex items-center gap-3 text-red-500 hover:text-red-400 cursor-pointer font-bold text-sm"><span class="material-symbols-outlined text-base">logout</span>Sair da Conta</a></div>`,O.querySelectorAll("[data-nav]").forEach(a=>{a.onclick=()=>{const p=a.dataset.nav;p==="home"?c(N):p==="history"?c(Ee):p==="profile"?c(ke):p==="logout"&&(localStorage.removeItem("movvi_client"),g==null||g.disconnect(),c(pe))}}),O.querySelectorAll("[data-theme]").forEach(a=>{a.onclick=()=>qe(a.dataset.theme)}),O.querySelector(".sidebar-close").onclick=de}function ne(){O.classList.add("open"),K.classList.add("open")}function de(){O.classList.remove("open"),K.classList.remove("open")}function ce(){g=io(),g.on("connect",()=>{d&&g.emit("register:client",d.id)}),g.on("order:searching",({message:e})=>{const t=document.getElementById("search-status");t&&(t.textContent=e)}),g.on("order:accepted",e=>{x={...x,...e,orderId:e.id||e.orderId,status:"accepted"},c(U,x)}),g.on("order:status",({orderId:e,status:t})=>{if(x&&(x.id===e||x.orderId===e)){if(x.status=t,t==="completed"){const r=x;x=null,c(je,r)}if(t==="arrived"){const r=document.getElementById("eta-text");r&&(r.innerHTML='<span class="text-emerald-500 font-black animate-pulse">Motorista Chegou!</span>');const a=document.getElementById("dist-text");a&&(a.textContent="0 km")}if(t==="in_progress"){const r=document.getElementById("eta-text");r&&(r.innerHTML='<span class="text-primary font-black">Em Trânsito</span>')}}}),g.on("order-chat:new-message",e=>{const t=document.getElementById("btn-chat");t&&!document.getElementById("chat-msgs")&&(t.classList.add("animate-pulse","border-red-500","bg-red-50"),document.getElementById("chat-dot")||t.insertAdjacentHTML("beforeend",'<div id="chat-dot" class="absolute -top-1 -right-1 size-4 bg-red-500 rounded-full border-2 border-white dark:border-background-dark animate-pulse shadow-md"></div>'))}),g.on("driver:location",({latitude:e,longitude:t})=>{Y&&Y.setLatLng([e,t]),A&&A.panTo([e,t])}),he||(he=Le(({latitude:e,longitude:t})=>{g.emit("client:location",{clientId:d.id,latitude:e,longitude:t})}))}function pe(){const e=document.createElement("div");return e.className="view active",e.style.background="#FFD900",e.innerHTML=`
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
</style>`,e.querySelector("#lf").onsubmit=async t=>{t.preventDefault();try{const{user:r}=await se.loginClient(e.querySelector("#le").value,e.querySelector("#lp").value);oe(r),ue()}catch(r){const a=e.querySelector("#le-err");a.textContent=r.message,a.classList.remove("hidden")}},e.querySelector("#go-reg").onclick=()=>c(Te),e.querySelector("#forgot-pw").onclick=async()=>{const t=window.prompt("Para redefinir sua senha, informe seu email:");if(t)try{await se.forgotPasswordClient(t),window.alert(`Um link de recuperação de senha foi enviado para ${t}. Verifique sua caixa de entrada.`)}catch(r){window.alert(r.message||"Erro ao tentar redefinir senha.")}},e}function Te(){const e=document.createElement("div");return e.className="view active bg-slate-50 dark:bg-slate-900",e.innerHTML='<header class="flex items-center p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md z-10"><button id="bk" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center"><span class="material-symbols-outlined text-black font-bold dark:text-slate-200">arrow_back</span></button><h1 class="flex-1 text-center text-black font-bold dark:text-white text-base font-bold">Criar Conta</h1><div class="size-10"></div></header><main class="flex-1 p-5 pb-24"><form id="rf" class="flex flex-col gap-4 bg-white dark:bg-white/5 p-6 rounded-xl border border-slate-200 dark:border-white/10"><div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">Nome Completo</label><input id="rn" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3" required/></div><div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">E-mail</label><input id="re" type="email" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3" required/></div><div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">Telefone</label><input id="rph" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3"/></div><div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">Veiculo</label><input id="rv" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3" placeholder="Ex: Honda Civic 2022"/></div><div class="flex flex-col gap-1"><label class="text-black font-bold dark:text-slate-300 text-sm font-medium">Senha</label><input id="rp" type="password" class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-3" required/></div><div id="re-err" class="text-red-500 text-xs font-medium hidden"></div><button type="submit" class="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3.5 rounded-lg shadow-md mt-2 active:scale-[0.98]">Criar conta</button></form></main>',e.querySelector("#bk").onclick=()=>c(pe),e.querySelector("#rf").onsubmit=async t=>{t.preventDefault();try{const r=await se.registerClient({name:e.querySelector("#rn").value,email:e.querySelector("#re").value,phone:e.querySelector("#rph").value,vehicleModel:e.querySelector("#rv").value,password:e.querySelector("#rp").value});oe(r),ue()}catch(r){const a=e.querySelector("#re-err");a.textContent=r.message,a.classList.remove("hidden")}},e}function N(){var r;const e=document.createElement("div");e.className="view active bg-slate-50 dark:bg-slate-900";let t=((r=d.name)==null?void 0:r.split(" ")[0])||"Cliente";return t=t.replace(/\uFFFD/g,"ã").replace(/Joo/i,"João").replace(/Jo.?o/i,"João"),e.innerHTML=`
<header class="flex items-center justify-between px-5 py-4 sticky top-0 bg-slate-50/95 dark:bg-background-dark/95 backdrop-blur-md z-10">
  <div class="flex items-center gap-4">
    <div class="relative group cursor-pointer" id="header-profile-btn">
      <div class="size-14 overflow-hidden rounded-[18px] bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-[0_4px_15px_-3px_rgba(0,0,0,0.1)] border border-slate-200/50 dark:border-white/10 relative z-10">
        ${d.photo?`<img src="${d.photo}" class="w-full h-full object-cover">`:'<span class="material-symbols-outlined text-3xl font-light">account_circle</span>'}
      </div>
      <div class="absolute -bottom-1 -right-1 size-5 bg-green-500 border-2 border-slate-50 dark:border-background-dark rounded-full z-20"></div>
    </div>
    <div class="flex flex-col justify-center">
      <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-0.5">Ola, ${t}</p>
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
</main>`,e.querySelector("#btn-menu").onclick=ne,e.querySelectorAll(".sv").forEach(a=>{a.onclick=()=>{if(x&&["searching","accepted","assigned","arrived","in_progress","pickup"].includes(x.status)){x.status==="searching"?c(be,x):c(U,x);return}a.dataset.type==="reboque"?c(ze,{type:a.dataset.type,name:a.dataset.name}):c(ve,{type:a.dataset.type,name:a.dataset.name})}}),e}function ze({type:e,name:t}){const r=document.createElement("div");return r.className="view active bg-slate-50 dark:bg-slate-900",r.innerHTML=`
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
  `,r.querySelector("#bk").onclick=()=>c(N),r.querySelector("#qf").onsubmit=a=>{a.preventDefault();const p=r.querySelector('input[name="rodas"]:checked').value,v=r.querySelector('input[name="acesso"]:checked').value,s=r.querySelector("#obs").value.trim();let f=`Rodas travadas: ${p} | Acesso: ${v}`;s&&(f+=`
Obs: ${s}`),c(ve,{type:e,name:t,extraInfo:f})},r}function ve({type:e,name:t,extraInfo:r=""}){const a=document.createElement("div");a.className="view active";let p,v,s,f,T="",q="";a.innerHTML=`
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

      <textarea id="prob" class="w-full shrink-0 rounded-2xl bg-slate-50 outline-none dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white p-4 text-sm font-semibold resize-none focus:ring-1 focus:ring-primary focus:border-primary shadow-inner" rows="2" placeholder="Descreva brevemente a situação... (Opcional)">${r}</textarea>
    </div>

    <button id="btn-req" class="shrink-0 w-full bg-primary text-black font-black py-4 rounded-2xl shadow-[0_4px_15px_-4px_rgba(255,217,0,0.4)] hover:bg-[#ffea00] active:scale-[0.98] transition-all text-base tracking-wide">CONFIRMAR RESGATE</button>
  </div>
</div>
<style>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>`,a.querySelector("#bk").onclick=()=>c(N);let b=null;const w=a.querySelector("#addr-street"),n=a.querySelector("#addr-num"),h=a.querySelector("#dest"),k=a.querySelector("#dest-num"),_=a.querySelector("#addr-results"),j=a.querySelector("#dest-results");function ae(){let l=[w.value];const o=n.value.trim();o&&l.push(o);const y=a.querySelector("#addr-comp").value.trim();return y&&l.push(y),T&&l.push(T),l.join(", ")}function re(){let l=[h.value];const o=k.value.trim();o&&l.push(o);const y=a.querySelector("#dest-comp").value.trim();return y&&l.push(y),l.join(", ")}let Q;async function V(l){clearTimeout(Q),Q=setTimeout(async()=>{const o=l?w.value.trim():h.value.trim(),y=l?n.value.trim():k.value.trim(),u=l?T:q;if(!o||!y||o.length<3)return;const i=`${o}, ${y}${u?", "+u:""}`;try{const z=await(await fetch("https://nominatim.openstreetmap.org/search?format=json&countrycodes=br&limit=1&q="+encodeURIComponent(i))).json();if(z&&z.length>0){const M=parseFloat(z[0].lat),W=parseFloat(z[0].lon);l?F(M,W):(s=M,f=W,R())}}catch(m){console.warn("Exact geocode failed",m)}},1e3)}n.oninput=()=>V(!0),k.oninput=()=>V(!1);function F(l,o){p=l,v=o,A&&(A.flyTo([l,o],18,{duration:1}),b&&A.removeLayer(b),b=L.marker([l,o],{icon:L.divIcon({className:"",html:'<div style="position:absolute;left:0;top:0;pointer-events:none"><div style="position:absolute;left:-40px;top:-40px;width:80px;height:80px;border-radius:50%;background:rgba(59,130,246,0.25);animation:pulseSmall 2s ease-out infinite"></div><div style="position:absolute;left:-8px;top:-8px;width:16px;height:16px;border-radius:50%;background:#3b82f6;border:2px solid white;box-shadow:0 0 8px rgba(0,0,0,0.3);z-index:2"></div></div><style>@keyframes pulseSmall{0%{transform:scale(0.5);opacity:1}100%{transform:scale(1);opacity:0}}</style>',iconSize:[0,0],iconAnchor:[0,0]})}).addTo(A))}function X(l){const o=l.address||{},y=o.road||o.pedestrian||o.footway||"",u=o.neighbourhood||o.suburb||"",i=o.city||o.town||o.village||"",m=o.state||"";T=[u,i,m].filter(Boolean).join(", "),w.value=y?y+(u?", "+u:""):(l.display_name||"").split(",").slice(0,2).join(","),n.value=o.house_number||"",n.focus()}let S;w.oninput=()=>{clearTimeout(S);const l=w.value.trim();if(l.length<3){_.classList.add("hidden");return}S=setTimeout(async()=>{try{const o=l.split(",")[0].trim(),u=await(await fetch("https://nominatim.openstreetmap.org/search?format=json&countrycodes=br&limit=5&addressdetails=1&q="+encodeURIComponent(o))).json();if(!u.length){_.innerHTML='<p class="p-3 text-xs text-slate-500">Nenhum resultado</p>',_.classList.remove("hidden");return}_.innerHTML=u.map(i=>{const m=i.address||{},z=m.road||m.pedestrian||(i.display_name||"").split(",")[0],M=[m.neighbourhood||m.suburb,m.city||m.town].filter(Boolean).join(" - ");return'<div class="addr-opt flex items-start gap-2 px-3 py-2.5 cursor-pointer hover:bg-primary/5 dark:hover:bg-white/5 border-b border-slate-100 dark:border-white/5 last:border-0" data-lat="'+i.lat+'" data-lon="'+i.lon+'" data-road="'+z+'" data-area="'+M+'" data-num="'+(m.house_number||"")+'"><span class="material-symbols-outlined text-primary text-sm mt-0.5 shrink-0">location_on</span><div class="flex-1 min-w-0"><p class="text-sm font-medium text-black font-bold dark:text-white truncate">'+z+'</p><p class="text-[10px] text-slate-500 truncate">'+M+"</p></div></div>"}).join(""),_.classList.remove("hidden"),_.querySelectorAll(".addr-opt").forEach(i=>{i.onclick=()=>{w.value=i.dataset.road,n.value=i.dataset.num,T=i.dataset.area,F(parseFloat(i.dataset.lat),parseFloat(i.dataset.lon)),_.classList.add("hidden"),i.dataset.num||n.focus(),R()}})}catch{}},500)};let I;h.oninput=()=>{clearTimeout(I);const l=h.value.trim();if(l.length<3){j.classList.add("hidden");return}I=setTimeout(async()=>{try{const o=l.split(",")[0].trim(),u=await(await fetch("https://nominatim.openstreetmap.org/search?format=json&countrycodes=br&limit=5&addressdetails=1&q="+encodeURIComponent(o))).json();if(!u.length){j.innerHTML='<p class="p-3 text-xs text-slate-500">Nenhum resultado</p>',j.classList.remove("hidden");return}j.innerHTML=u.map(i=>{const m=i.address||{},z=m.road||m.pedestrian||(i.display_name||"").split(",")[0],M=[m.neighbourhood||m.suburb,m.city||m.town].filter(Boolean).join(" - ");return'<div class="addr-opt flex items-start gap-2 px-3 py-2.5 cursor-pointer hover:bg-primary/5 dark:hover:bg-white/5 border-b border-slate-100 dark:border-white/5 last:border-0" data-lat="'+i.lat+'" data-lon="'+i.lon+'" data-road="'+z+'" data-area="'+M+'" data-num="'+(m.house_number||"")+'"><span class="material-symbols-outlined text-red-500 text-sm mt-0.5 shrink-0">location_on</span><div class="flex-1 min-w-0"><p class="text-sm font-medium text-black font-bold dark:text-white truncate">'+z+'</p><p class="text-[10px] text-slate-500 truncate">'+M+"</p></div></div>"}).join(""),j.classList.remove("hidden"),j.querySelectorAll(".addr-opt").forEach(i=>{i.onclick=()=>{h.value=i.dataset.road,k.value=i.dataset.num,q=i.dataset.area,s=parseFloat(i.dataset.lat),f=parseFloat(i.dataset.lon),j.classList.add("hidden"),i.dataset.num||k.focus(),R()}})}catch{}},500)},a.addEventListener("click",l=>{!l.target.closest("#addr-results")&&!l.target.closest("#addr-street")&&_.classList.add("hidden"),!l.target.closest("#dest-results")&&!l.target.closest("#dest")&&j.classList.add("hidden")}),a.querySelector("#btn-gps").onclick=()=>{w.value="Localizando...",fe().then(l=>{fetch("https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat="+l.latitude+"&lon="+l.longitude).then(o=>o.json()).then(o=>{X(o),F(l.latitude,l.longitude)}).catch(()=>{w.value="GPS Indisponivel"})}).catch(()=>{w.value="GPS Indisponivel"})},setTimeout(()=>{const l=a.querySelector("#dmap");if(!l)return;const o=(d==null?void 0:d.latitude)||-23.55,y=(d==null?void 0:d.longitude)||-46.63;A=L.map(l,{zoomControl:!1,attributionControl:!1}).setView([o,y],18),L.tileLayer(le()).addTo(A),fe().then(u=>{fetch("https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat="+u.latitude+"&lon="+u.longitude).then(i=>i.json()).then(i=>{X(i),F(u.latitude,u.longitude)}).catch(()=>F(u.latitude,u.longitude))}).catch(()=>{w.placeholder="Digite sua rua..."})},100);function P(l,o,y,u){if(!l||!o||!y||!u)return 0;const i=6371,m=Math.PI/180,z=.5-Math.cos((y-l)*m)/2+Math.cos(l*m)*Math.cos(y*m)*(1-Math.cos((u-o)*m))/2;return 2*i*Math.asin(Math.sqrt(z))}let C=null,$=null;async function R(){if(!(!p||!v||!s||!f))try{$&&A.removeLayer($),$=L.marker([s,f],{icon:L.divIcon({className:"",html:'<div style="width:16px;height:16px;background:#ef4444;border:3px solid white;border-radius:50%;box-shadow:0 0 8px rgba(0,0,0,0.3)"></div>',iconSize:[16,16],iconAnchor:[8,8]})}).addTo(A);const o=await(await fetch(`https://router.project-osrm.org/route/v1/driving/${v},${p};${f},${s}?overview=full&geometries=geojson`)).json();if(o.routes&&o.routes.length>0){const y=o.routes[0].geometry.coordinates.map(i=>[i[1],i[0]]);C&&A.removeLayer(C),C=L.polyline(y,{color:"#ef4444",weight:4,opacity:.8,dashArray:"5, 8"}).addTo(A),A.fitBounds(C.getBounds(),{padding:[30,30]});const u=(o.routes[0].distance/1e3).toFixed(1);a.querySelector("#route-info-detail").innerHTML=`<span class="material-symbols-outlined text-[14px]">route</span> Distância Total: ${u} km`,a.querySelector("#route-info-detail").classList.remove("hidden")}}catch{}}return a.querySelector("#btn-req").onclick=async()=>{if(!p){alert('Clique em "Usar GPS" ou digite seu endereco de origem.');return}if(!a.querySelector("#dest").value.trim()){alert("Informe o endereco de destino."),a.querySelector("#dest").focus();return}const o=a.querySelector("#btn-req"),y=o.innerHTML;o.innerHTML='<span class="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span> Calculando...',o.disabled=!0;let u=P(p,v,s,f);(!s||u===0)&&(u=10);try{const J=await(await fetch(`https://router.project-osrm.org/route/v1/driving/${v},${p};${f},${s}?overview=false`)).json();J.routes&&J.routes.length>0&&(u=J.routes[0].distance/1e3)}catch{}o.innerHTML=y,o.disabled=!1;let i=0,m=0;try{const H=await xe.get(),J=await xe.getSettings(),me=H.services&&H.services[e]||{basePrice:H.basePrice||50,pricePerKm:H.pricePerKm||5};i=me.basePrice+u*me.pricePerKm;const Se=J.platformFee||15;m=i*(1-Se/100),i=parseFloat(i.toFixed(2)),m=parseFloat(m.toFixed(2))}catch(H){console.error("Pricing fetch err:",H),i=80+u*3.5,m=60+u*2.5}const z=ae(),M=re(),W={clientId:d.id,clientName:d.name,serviceType:e,serviceName:t,pickupAddress:z,pickupLat:p,pickupLon:v,destinationAddress:M,destinationLat:s,destinationLon:f,vehicleModel:d.vehicleModel||"",problemDescription:a.querySelector("#prob").value,distanceKm:u.toFixed(1),price:i,driverPrice:m};c(Ce,W)},a}function Ce(e){const t=document.createElement("div");t.className="view active bg-background-light dark:bg-background-dark";const r=(e.price||0).toFixed(2).replace(".",",");return t.innerHTML='<header class="flex items-center p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10"><button id="bk" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center"><span class="material-symbols-outlined text-black font-bold dark:text-slate-200">arrow_back</span></button><h1 class="flex-1 text-center text-black font-bold dark:text-white text-base font-bold">Resumo do Pedido</h1><div class="size-10"></div></header><main class="flex-1 overflow-y-auto px-4 py-6"><div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-5 mb-5 shadow-sm"><div class="flex items-center gap-3 mb-4"><span class="material-symbols-outlined text-primary text-2xl">build</span><h2 class="text-xl font-bold text-black font-bold dark:text-white">'+e.serviceName+'</h2></div><div class="flex flex-col gap-4 relative"><div class="absolute left-[11px] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-white/10"></div><div class="flex items-start gap-4 relative z-10"><div class="size-6 rounded-full bg-white dark:bg-background-dark border-4 border-primary mt-0.5"></div><div><p class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Origem</p><p class="text-black font-bold dark:text-slate-200 text-sm font-medium line-clamp-2">'+e.pickupAddress+'</p></div></div><div class="flex items-start gap-4 relative z-10"><div class="size-6 rounded-full bg-white dark:bg-background-dark border-4 border-slate-400 dark:border-slate-500 mt-0.5"></div><div><p class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Destino</p><p class="text-black font-bold dark:text-slate-200 text-sm font-medium line-clamp-2">'+e.destinationAddress+'</p></div></div></div></div><div class="grid grid-cols-2 gap-3 mb-5"><div class="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-4 text-center"><p class="text-xs tracking-wider uppercase font-bold text-slate-500 mb-1">Distancia</p><p class="text-lg font-bold text-black font-bold dark:text-white">'+e.distanceKm+' km</p></div><div class="bg-primary/10 rounded-xl border border-primary/20 p-4 text-center"><p class="text-xs tracking-wider uppercase font-bold text-primary mb-1">Total</p><p class="text-lg font-black text-primary">R$ '+r+'</p></div></div><div class="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-xl p-4 mb-5 flex items-start gap-3"><span class="material-symbols-outlined text-yellow-600 dark:text-yellow-500 mt-0.5">info</span><p class="text-xs font-medium text-yellow-800 dark:text-yellow-200/80 leading-snug">O valor inclui a taxa de deslocamento e servico basico. <br/><b>Aviso:</b> O cancelamento apos o motorista estar a caminho gerara uma cobrança de uma taxa administrativa de R$ 30,00.</p></div><div class="mb-5"><p class="text-sm font-bold text-black font-bold dark:text-white mb-3">Forma de Pagamento</p><div class="flex flex-col gap-2"><label class="flex items-center justify-between p-4 rounded-xl border border-primary bg-primary/5 cursor-pointer"><div class="flex items-center gap-3"><span class="material-symbols-outlined text-primary">pix</span><span class="font-bold text-black font-bold dark:text-white text-sm">Pix (Rapido)</span></div><input type="radio" name="pay" class="text-primary focus:ring-primary" checked></label><label class="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:border-primary/50 cursor-pointer"><div class="flex items-center gap-3"><span class="material-symbols-outlined text-slate-500">credit_card</span><span class="font-bold text-black font-bold dark:text-white text-sm">Cartao de Credito</span></div><input type="radio" name="pay" class="text-primary focus:ring-primary"></label></div></div><button id="btn-confirm" class="w-full bg-primary hover:bg-primary/90 text-black font-bold py-4 rounded-xl shadow-lg active:scale-[0.98]">Confirmar e Buscar Motorista</button></main>',t.querySelector("#bk").onclick=()=>c(N),t.querySelector("#btn-confirm").onclick=async()=>{try{const a=await B.create(e);x=a,c(be,a)}catch(a){alert(a.message)}},t}function be(e){const t=document.createElement("div");return t.className="view active bg-background-light dark:bg-background-dark",t.innerHTML=`
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
</div>`,t.querySelector("#cancel").onclick=async()=>{try{await B.updateStatus(e.id,"cancelled"),x=null,c(N)}catch(r){alert(r.message)}},setTimeout(()=>{const r=t.querySelector("#searchmap");if(!r)return;const a=L.map(r,{zoomControl:!1,attributionControl:!1,dragging:!1,scrollWheelZoom:!1}).setView([e.pickupLat,e.pickupLon],14);L.tileLayer(le()).addTo(a),a.flyTo([e.pickupLat,e.pickupLon],15,{duration:2}),L.marker([e.pickupLat,e.pickupLon],{icon:L.divIcon({className:"",html:`<div style="position:absolute;left:0;top:0;pointer-events:none">
          <div style="position:absolute;left:-400px;top:-400px;width:800px;height:800px;border-radius:50%;background:rgba(59,130,246,0.1);animation:pulseSearch 3s ease-out infinite"></div>
          <div style="position:absolute;left:-250px;top:-250px;width:500px;height:500px;border-radius:50%;background:rgba(59,130,246,0.15);animation:pulseSearch 3s ease-out infinite 0.7s"></div>
          <div style="position:absolute;left:-100px;top:-100px;width:200px;height:200px;border-radius:50%;background:rgba(59,130,246,0.25);animation:pulseSearch 3s ease-out infinite 1.4s"></div>
          <div style="position:absolute;left:-10px;top:-10px;width:20px;height:20px;border-radius:50%;background:#3b82f6;box-shadow:0 0 16px rgba(59,130,246,0.8);z-index:2; border:3px solid white"></div>
        </div>
        <style>@keyframes pulseSearch{0%{transform:scale(0);opacity:1}100%{transform:scale(1.5);opacity:0}}</style>`,iconSize:[0,0],iconAnchor:[0,0]})}).addTo(a)},100),t}function U(e){const t=document.createElement("div");t.className="view active bg-slate-200 dark:bg-background-dark",t.innerHTML=`<div class="flex flex-col relative overflow-hidden" style="height:100dvh">
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
  </div>

  <style>
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</div>`;const r=t.querySelector("#tracking-sheet"),a=t.querySelector("#tracking-content"),p=t.querySelector("#tracking-handle"),v=t.querySelector("#tmap");let s=!1;function f(){s=!s,s?(a.style.maxHeight="0px",a.style.opacity="0",a.style.margin="0",r.style.transform="translateY(calc(100% - 60px))",v.style.height="100dvh"):(a.style.maxHeight="1000px",a.style.opacity="1",r.style.transform="translateY(0)",v.style.height="62%"),setTimeout(()=>{b&&b.invalidateSize()},300)}p.onclick=f,t.querySelector("#btn-chat").onclick=()=>{const S=document.getElementById("chat-dot");S&&S.remove(),c(Me,e)};const T=()=>ye(e.driverId,e.driverName,e.driverPhoto);t.querySelector("#btn-call").onclick=T;const q=t.querySelector("#btn-call-delay");q&&(q.onclick=T),t.querySelector("#btn-cancel").onclick=async()=>{if(confirm("Tem certeza que deseja cancelar o resgate?"))try{await B.updateStatus(e.orderId||e.id,"cancelled"),x=null,c(N)}catch(S){alert(S.message)}};let b=null,w=null;const n=t.querySelector("#eta-text"),h=e.pickupLat||-23.55,k=e.pickupLon||-46.63;e.status==="arrived"&&(n.innerHTML='<span class="text-green-500 font-bold">Motorista Chegou!</span>'),e.status==="in_progress"&&(n.innerHTML='<span class="text-primary font-bold drop-shadow-sm">A caminho do destino</span>');let _=null;const j=20*60*1e3,ae=({orderId:S,etaMinutes:I,distanceKm:P})=>{if(S===(e.orderId||e.id)){if(x&&(x.status==="arrived"||x.status==="in_progress"))return;const C=t.querySelector("#dist-text");n.textContent=`~${I} min`,C&&(C.textContent=`${P} km`);const $=Date.now()+I*60*1e3;(!_||$>_)&&(_=$)}};g.on("driver:eta",ae);const re=setInterval(()=>{_&&Date.now()>_+j&&(t.querySelector("#default-actions").classList.add("hidden"),t.querySelector("#delay-actions").classList.remove("hidden"),t.querySelector("#delay-actions").classList.add("flex"))},1e4),Q=({latitude:S,longitude:I})=>{Y&&Y.setLatLng([S,I]),b&&b.panTo([S,I]),F(S,I)};g.on("driver:location",Q);let V=null;async function F(S,I){if(!b||V)return;V=setTimeout(()=>{V=null},1e4);let P=e.pickupLat||-23.55,C=e.pickupLon||-46.63;x&&x.status==="in_progress"&&(P=x.destinationLat||P,C=x.destinationLon||C);try{const o=await(await fetch(`https://router.project-osrm.org/route/v1/driving/${I},${S};${C},${P}?overview=full&geometries=geojson`)).json();if(o.routes&&o.routes.length>0){const y=o.routes[0].geometry.coordinates.map(M=>[M[1],M[0]]);w&&b.removeLayer(w),w=L.polyline(y,{color:"#2563eb",weight:5,opacity:.85}).addTo(b);const u=Math.round(o.routes[0].duration/60),i=(o.routes[0].distance/1e3).toFixed(1),m=t.querySelector("#dist-text");n.textContent=`~${u} min`,m&&(m.textContent=`${i} km`);const z=Date.now()+u*60*1e3;(!_||z>_)&&(_=z);return}}catch{}w&&b.removeLayer(w),w=L.polyline([[S,I],[h,k]],{color:"#2563eb",weight:4,dashArray:"10,8",opacity:.7}).addTo(b);const $=(Math.sqrt(Math.pow(S-h,2)+Math.pow(I-k,2))*111).toFixed(1),R=t.querySelector("#dist-text");R&&(R.textContent=`${$} km`),n.textContent="-- min"}setTimeout(async()=>{const S=e.driverLat||h,I=e.driverLon||k;b=L.map(t.querySelector("#tmap"),{zoomControl:!1,attributionControl:!1}).setView([S,I],18),L.tileLayer(le()).addTo(b),Y=L.marker([S,I],{icon:L.divIcon({className:"",html:'<div style="background:#2563eb;color:#fff;width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 0 15px rgba(37,99,235,0.5)"><span class="material-symbols-outlined" style="font-size:18px">car_repair</span></div>',iconSize:[30,30],iconAnchor:[15,15]})}).addTo(b),L.marker([h,k],{icon:L.divIcon({className:"",html:'<div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center"><div style="position:absolute;width:24px;height:24px;border-radius:50%;background:rgba(59,130,246,0.25);animation:pulseAura 2s ease-out infinite"></div><div style="width:8px;height:8px;border-radius:50%;background:#3b82f6;z-index:2"></div></div><style>@keyframes pulseAura{0%{transform:scale(.5);opacity:.8}100%{transform:scale(1.5);opacity:0}}</style>',iconSize:[24,24],iconAnchor:[12,12]})}).addTo(b),(S!==h||I!==k)&&(F(S,I),b.fitBounds([[S,I],[h,k]],{padding:[40,40]}));try{const P=e.driverId||(e.orderId?(await B.get(e.orderId)).driverId:null);P&&fetch("/api/drivers/"+P).then(C=>C.json()).then(C=>{const $=C.pixKey;if($){const R=t.querySelector("#tracking-pix");R&&R.classList.remove("hidden");const l=t.querySelector("#tracking-pix-val");l&&(l.textContent=$);const o=t.querySelector("#btn-copy-pix-tracking");o&&(o.onclick=()=>{navigator.clipboard.writeText($),alert("Chave PIX copiada!")})}}).catch(()=>{})}catch(P){console.warn("Could not fetch driver ID for Pix key:",P)}},200);const X=setInterval(()=>{document.body.contains(t)||(clearInterval(re),clearInterval(X))},5e3);return t}function je(e){const t=document.createElement("div");t.className="view active bg-background-light dark:bg-background-dark";let r=0;const a=(e.price||0).toFixed(2).replace(".",",");return t.innerHTML=`
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
        <p class="text-3xl font-black text-primary relative z-10">R$ ${a}</p>
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
</div>`,t.querySelectorAll("#stars button").forEach(p=>{p.onclick=()=>{r=parseInt(p.dataset.v),t.querySelectorAll("#stars button span").forEach(v=>{const s=parseInt(v.parentElement.dataset.v);v.className="material-symbols-outlined text-[28px] transition-colors "+(s<=r?"text-primary drop-shadow-[0_0_8px_rgba(255,217,0,0.5)]":"text-slate-300")})}}),t.querySelector("#done").onclick=()=>{x=null,c(N)},setTimeout(async()=>{try{const p=e.driverId||(e.orderId?(await B.get(e.orderId)).driverId:null);if(!p)throw new Error("Driver ID not found");const v=await fetch("/api/drivers/"+p).then(b=>b.json()),s=t.querySelector("#pix-loader"),f=t.querySelector("#pix-key-box"),T=t.querySelector("#pix-key-val");s.classList.add("hidden");const q=v.pixKey;q?(f.classList.remove("hidden"),f.classList.add("flex"),T.value=q,t.querySelector("#btn-copy-pix").onclick=()=>{navigator.clipboard.writeText(q).then(()=>{const b=t.querySelector("#btn-copy-pix"),w=b.innerHTML;b.classList.add("bg-green-500","text-white","border-green-500"),b.classList.remove("bg-white","text-primary"),b.innerHTML='<span class="material-symbols-outlined text-sm">check</span>',setTimeout(()=>{b.innerHTML=w,b.classList.remove("bg-green-500","text-white","border-green-500"),b.classList.add("bg-white","text-primary")},1500)})}):(s.classList.remove("hidden"),s.classList.remove("text-primary"),s.classList.add("text-slate-500"),s.innerHTML="Chave PIX não cadastrada pelo motorista.")}catch{}},300),t}function Ee(){const e=document.createElement("div");return e.className="view active bg-background-light dark:bg-background-dark",e.innerHTML='<header class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10"><button id="btn-menu" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-black font-bold dark:text-slate-200"><span class="material-symbols-outlined">menu</span></button><h2 class="font-bold text-black font-bold dark:text-white">Historico</h2><div class="size-10"></div></header><main class="flex-1 overflow-y-auto p-4"><div id="hl"><p class="text-slate-500 text-sm text-center py-8">Carregando...</p></div></main>',e.querySelector("#btn-menu").onclick=ne,(async()=>{try{const t=await B.list({clientId:d.id}),r=e.querySelector("#hl");if(!t.length){r.innerHTML='<p class="text-slate-500 text-sm text-center py-8">Nenhum servico</p>';return}r.innerHTML=t.map(a=>'<div class="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-3"><div class="flex-1"><h4 class="font-semibold text-sm text-black font-bold dark:text-white">'+a.serviceName+'</h4><p class="text-xs text-slate-500">'+(a.pickupAddress||"")+'</p></div><p class="text-xs font-bold '+(a.status==="completed"?"text-green-500":"text-primary")+'">'+a.status+"</p></div>").join("")}catch{}})(),e}function ke(){const e=document.createElement("div");e.className="view active bg-background-light dark:bg-background-dark";const r=(d.name||"").replace(/\uFFFD/g,"ã").replace(/Joo/i,"João").replace(/Jo.?o/i,"João"),a=d.photo||"";e.innerHTML=`
<header class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10 transition-all">
  <button id="btn-menu" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-black font-bold dark:text-slate-200"><span class="material-symbols-outlined">menu</span></button>
  <h2 class="font-bold text-black font-bold dark:text-white">Perfil</h2><div class="size-10"></div>
</header>
<main class="flex-1 p-5 overflow-y-auto">
  <div class="flex flex-col items-center gap-4 mb-8 mt-4 relative">
    <div class="relative group cursor-pointer z-10" id="photo-container">
      <div class="size-28 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-background-dark shadow-xl flex items-center justify-center text-slate-400 overflow-hidden relative">
        ${a?`<img src="${a}" class="w-full h-full object-cover" id="p-img" />`:'<span class="material-symbols-outlined text-[3rem]" id="p-icon">person</span>'}
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
        <input type="text" id="i-name" class="bg-transparent text-black font-bold dark:text-white font-medium text-lg w-full outline-none" value="${r}" readonly />
        <button id="b-edit-name" class="text-primary p-2 -mr-2"><span class="material-symbols-outlined text-sm">edit</span></button>
      </div>
    </div>
    <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4">
      <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Email</p>
      <p class="text-black font-bold dark:text-white font-medium text-base">${d.email||"N/A"}</p>
    </div>
    <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4">
      <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Telefone</p>
      <p class="text-black font-bold dark:text-white font-medium text-base">${d.phone||"N/A"}</p>
    </div>
    <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4">
      <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Veículo Reservado</p>
      <p class="text-black font-bold dark:text-white font-medium text-base">${d.vehicleModel||"Nao cadastrado"}</p>
    </div>
  </div>
  
  <button id="btn-save" class="w-full bg-primary text-black font-bold py-3.5 rounded-xl shadow-lg mt-8 hidden active:scale-[0.98] transition-all">Salvar Alterações</button>
</main>`,e.querySelector("#btn-menu").onclick=()=>{te(),ne()};const p=e.querySelector("#header-profile-btn");p&&(p.onclick=()=>{te(),c(ke)});const v=e.querySelector("#f-input"),s=e.querySelector("#btn-save"),f=e.querySelector("#i-name"),T=e.querySelector("#b-edit-name");let q=null;return e.querySelector("#photo-container").onclick=()=>v.click(),v.onchange=b=>{const w=b.target.files[0];if(w){const n=new FileReader;n.onload=h=>{q=h.target.result;const k=e.querySelector(".size-28");k.innerHTML=`<img src="${q}" class="w-full h-full object-cover relative z-0" />
                       <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"><span class="material-symbols-outlined text-white">photo_camera</span></div>`,s.classList.remove("hidden")},n.readAsDataURL(w)}},T.onclick=()=>{f.removeAttribute("readonly"),f.focus(),f.classList.add("border-b","border-primary","pb-1"),s.classList.remove("hidden")},s.onclick=async()=>{const b=f.value.trim();b&&(d.name=b),q&&(d.photo=q),oe(d);try{await fetch("/api/clients/"+d.id,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:d.name,photo:d.photo})})}catch{}s.textContent="Salvo!",s.classList.remove("bg-primary"),s.classList.add("bg-green-500","text-white"),setTimeout(()=>{s.classList.add("hidden"),s.textContent="Salvar Alterações",s.classList.add("bg-primary"),s.classList.remove("bg-green-500","text-white"),f.setAttribute("readonly","true"),f.classList.remove("border-b","border-primary","pb-1"),ie()},1500)},e}function Me(e){const t=document.createElement("div");t.className="view active bg-background-light dark:bg-background-dark";const r=e.orderId||e.id;t.innerHTML=`
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
</div>`,t.querySelector("#bk").onclick=()=>c(U,e),t.querySelector("#btn-chat-call").onclick=()=>ye(e.driverId,e.driverName,e.driverPhoto);const a=t.querySelector("#chat-msgs");function p(n){const h=n.from==="client",k=new Date(n.timestamp).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),_=document.createElement("div");_.className=`flex ${h?"justify-end":"justify-start"} `;let j;n.type==="audio"&&n.audioData?j=`<audio controls src="${n.audioData}" style="max-width:220px;height:40px"></audio>`:j=`<p class="text-sm">${n.message}</p>`,_.innerHTML=`<div class="max-w-[80%] px-4 py-2.5 rounded-2xl ${h?"bg-primary text-black rounded-br-md":"bg-slate-100 dark:bg-white/10 text-black dark:text-white rounded-bl-md"}">${j} <p class="text-[9px] mt-1 ${h?"text-black/60":"text-slate-400"} text-right">${k}</p></div>`,a.appendChild(_),a.scrollTop=a.scrollHeight}g.emit("order-chat:get-history",{orderId:r}),g.once("order-chat:history",({messages:n})=>{n&&n.forEach(p)});const v=n=>{n.orderId===r&&p(n)};g.on("order-chat:new-message",v),t.querySelector("#chat-form").onsubmit=n=>{n.preventDefault();const h=t.querySelector("#chat-input"),k=h.value.trim();k&&(g.emit("order-chat:client-to-driver",{orderId:r,driverId:e.driverId,clientId:d.id,message:k,type:"text"}),p({from:"client",message:k,type:"text",timestamp:new Date().toISOString()}),h.value="")};let s=null,f=[];const T=t.querySelector("#btn-audio"),q=t.querySelector("#recording-status"),b=t.querySelector("#btn-stop"),w=t.querySelector("#btn-cancel-audio");return T.onclick=async()=>{try{const n=await navigator.mediaDevices.getUserMedia({audio:!0});s=new MediaRecorder(n),f=[],s.ondataavailable=h=>{h.data.size>0&&f.push(h.data)},s.onstop=()=>{n.getTracks().forEach(h=>h.stop())},s.start(),q.classList.remove("hidden"),T.classList.add("hidden")}catch{alert("Não foi possível acessar o microfone.")}},b.onclick=()=>{!s||s.state!=="recording"||(s.onstop=()=>{s.stream.getTracks().forEach(k=>k.stop());const n=new Blob(f,{type:"audio/webm"}),h=new FileReader;h.onloadend=()=>{const k=h.result;g.emit("order-chat:client-to-driver",{orderId:r,driverId:e.driverId,clientId:d.id,type:"audio",audioData:k}),p({from:"client",type:"audio",audioData:k,timestamp:new Date().toISOString()})},h.readAsDataURL(n),q.classList.add("hidden"),T.classList.remove("hidden")},s.stop())},w.onclick=()=>{s&&s.state==="recording"&&(s.onstop=()=>{s.stream.getTracks().forEach(n=>n.stop())},s.stop()),f=[],q.classList.add("hidden"),T.classList.remove("hidden")},t}let E=null,G=null;function ye(e,t,r){te(),c(we,{targetId:e,targetName:t,targetPhoto:r,incoming:!1})}function we(e){const t=document.createElement("div");t.className="view active bg-slate-900 text-white",t.innerHTML=`
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
</div>`;const r=t.querySelector("#call-status"),a=t.querySelector("#remote-audio"),p=()=>{D.pause(),D.currentTime=0,G&&G.getTracks().forEach(s=>s.stop()),E&&E.close(),E=null,G=null},v=async()=>{if(E=new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"}]}),E.onicecandidate=s=>{s.candidate&&g.emit("call:signal",{targetId:e.targetId,signal:{ice:s.candidate}})},E.ontrack=s=>{a.srcObject=s.streams[0],r.textContent="Em Chamada",r.classList.remove("animate-pulse")},G=await navigator.mediaDevices.getUserMedia({audio:!0}),G.getTracks().forEach(s=>E.addTrack(s,G)),!e.incoming){const s=await E.createOffer();await E.setLocalDescription(s),g.emit("call:request",{targetId:e.targetId,userId:d.id,callerName:d.name,callerPhoto:d.photo}),g.emit("call:signal",{targetId:e.targetId,signal:{sdp:s}})}};return e.incoming&&(D.play(),t.querySelector("#btn-accept").onclick=async()=>{D.pause(),D.currentTime=0,await v(),g.emit("call:accept",{targetId:e.targetId})}),t.querySelector("#btn-hangup").onclick=()=>{g.emit("call:end",{targetId:e.targetId}),p(),x?c(U,x):c(N)},g.off("call:signal").on("call:signal",async({signal:s})=>{if(E||await v(),s.sdp){if(await E.setRemoteDescription(new RTCSessionDescription(s.sdp)),s.sdp.type==="offer"){const f=await E.createAnswer();await E.setLocalDescription(f),g.emit("call:signal",{targetId:e.targetId,signal:{sdp:f}})}}else s.ice&&await E.addIceCandidate(new RTCIceCandidate(s.ice))}),g.off("call:accepted").on("call:accepted",()=>{r.textContent="Em Chamada",r.classList.remove("animate-pulse")}),g.off("call:rejected").on("call:rejected",()=>{p(),x?c(U,x):c(N)}),g.off("call:ended").on("call:ended",()=>{p(),x?c(U,x):c(N)}),e.incoming||v(),t}function Ae(){g.on("call:incoming",e=>{te(),c(we,{targetId:e.fromId,targetName:e.callerName,targetPhoto:e.callerPhoto,incoming:!0})})}const Pe=ce;ce=()=>{Pe(),Ae()};async function ue(){ce(),ie();try{const t=(await B.list({clientId:d.id})).find(r=>["searching","accepted","assigned","arrived","in_progress","pickup"].includes(r.status));t?(x=t,t.status==="searching"?c(be,t):c(U,t)):c(N)}catch(e){console.error("[INIT] Error listing orders:",e),c(N)}}function ge(){if(console.log("[DEBUG] startApp executing"),ee=document.getElementById("app-content"),O=document.getElementById("sidebar"),K=document.getElementById("sidebar-overlay"),!ee||!K){console.error("CRITICAL: DOM elements not found.");return}K.onclick=de;const e=_e();e?(d=e,ue()):c(pe)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ge):ge();
