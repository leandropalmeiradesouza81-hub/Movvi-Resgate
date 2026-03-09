import{O as X,A as se,a as O}from"./api-ttBfcqYz.js";import{g as le,i as pe}from"./geo-Dl6lxGpH.js";let B,q,R,n,r,h,j,J,C;localStorage.getItem("movvi_theme");let z=localStorage.getItem("movvi_weather")!=="off",E=localStorage.getItem("movvi_traffic")!=="off";const ue="https://www.myinstants.com/media/sounds/uber.mp3",me="https://actions.google.com/sounds/v1/communications/incoming_phone_call.ogg",S=new Audio(ue);S.loop=!0;S.volume=1;const T=new Audio(me);T.loop=!0;T.volume=1;function P(){(()=>{S.play().then(()=>{S.pause(),S.currentTime=0,console.log("Audio unlocked")}).catch(t=>console.log("Audio unlock failed",t)),T.play().then(()=>{T.pause(),T.currentTime=0}).catch(()=>{})})()}const U=()=>{P(),document.removeEventListener("click",U),document.removeEventListener("touchstart",U)};document.addEventListener("click",U,{once:!0});document.addEventListener("touchstart",U,{once:!0});function xe(){const e=new Date().getHours(),t=new Date().getDay(),i=t===0||t===6;let s,l,o;return i?e>=10&&e<=14?(s="moderado",l="Trânsito Moderado",o="Saídas para lazer podem causar lentidão"):e>=17&&e<=20?(s="moderado",l="Trânsito Moderado",o="Retorno do fim de semana"):(s="livre",l="Trânsito Livre",o="Vias com bom fluxo"):e>=7&&e<=9?(s="intenso",l="Trânsito Intenso",o="Horário de pico matutino"):e>=11&&e<=13?(s="moderado",l="Trânsito Moderado",o="Horário de almoço"):e>=17&&e<=19?(s="intenso",l="Trânsito Intenso",o="Horário de pico vespertino"):e>=20&&e<=22?(s="moderado",l="Trânsito Moderado",o="Fluxo moderado noturno"):(s="livre",l="Trânsito Livre",o="Vias com bom fluxo"),{level:s,label:l,tip:o,color:{livre:"#22c55e",moderado:"#eab308",intenso:"#ef4444"}[s]}}function M(e){r=e,localStorage.setItem("movvi_driver",JSON.stringify(e))}function fe(){try{return JSON.parse(localStorage.getItem("movvi_driver"))}catch{return null}}function u(e,t){W(),B.innerHTML="";const i=e(t);B.appendChild(i),i.classList.add("fade-in")}function ae(){return document.documentElement.classList.contains("dark")}function oe(){return"https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"}function ge(e){e==="light"?(document.documentElement.classList.remove("dark"),localStorage.setItem("movvi_theme","light")):e==="dark"?(document.documentElement.classList.add("dark"),localStorage.setItem("movvi_theme","dark")):localStorage.removeItem("movvi_theme"),A()}const ve={0:"Céu limpo",1:"Parcialmente limpo",2:"Parcialmente nublado",3:"Nublado",45:"Nevoeiro",48:"Nevoeiro gelado",51:"Garoa leve",53:"Garoa moderada",55:"Garoa densa",61:"Chuva leve",63:"Chuva moderada",65:"Chuva forte",71:"Neve leve",73:"Neve moderada",75:"Neve intensa",80:"Pancadas leves",81:"Pancadas moderadas",82:"Pancadas fortes",95:"Trovoada",96:"Trovoada com granizo leve",99:"Trovoada com granizo forte"};async function he(e,t){try{return await(await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${e}&longitude=${t}&current_weather=true&hourly=temperature_2m,weathercode&forecast_days=1&timezone=America%2FSao_Paulo`)).json()}catch{return null}}function A(){var l;let e=((l=r==null?void 0:r.name)==null?void 0:l.split(" ")[0])||"Motorista";e=e.replace(/\uFFFD/g,"ã").replace(/Joo/i,"João").replace(/Jo.?o/i,"João").replace(/Cambao/i,"Cambão"),q.innerHTML=`
    <div class="px-5 pt-12 pb-6 flex items-center justify-between border-b border-slate-200 dark:border-white/10">
      <div class="flex items-center gap-3">
        <div class="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30 overflow-hidden">
          ${r!=null&&r.photo?`<img src="${r.photo}" class="w-full h-full object-cover">`:'<span class="material-symbols-outlined text-lg">person</span>'}
        </div>
        <div>
          <h2 class="text-sm font-bold text-black font-bold dark:text-white">${e}</h2>
          <div class="flex items-center gap-2">
            <p class="text-[10px] ${(r.walletBalance||0)<0?"text-red-500":"text-slate-500"} font-black uppercase tracking-tighter">Saldo: R$ ${(r.walletBalance||0).toFixed(2).replace(".",",")}</p>
            ${r.blocked?'<span class="size-1.5 rounded-full bg-red-500 animate-pulse"></span>':""}
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
      <div class="mt-4 mx-1 pt-4 border-t border-slate-200 dark:border-white/10">
        <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3 px-2">Aparência</p>
        <div class="flex gap-2 px-2">
          <button data-theme="light" class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${ae()?"bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10":"bg-primary text-black font-bold shadow-md"}"><span class="material-symbols-outlined text-base">light_mode</span>Claro</button>
          <button data-theme="dark" class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${ae()?"bg-primary text-black font-bold shadow-md":"bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"}"><span class="material-symbols-outlined text-base">dark_mode</span>Escuro</button>
        </div>
      </div>
      <div class="mt-3 mx-1 pt-3 border-t border-slate-200 dark:border-white/10">
        <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3 px-2">Preferências</p>
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2 text-black font-bold dark:text-slate-300"><span class="material-symbols-outlined text-base">thermostat</span><span class="text-xs font-semibold">Condições Climáticas</span></div>
          <button id="weather-toggle" class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${z?"bg-primary":"bg-slate-400 dark:bg-slate-600"}">
            <span class="${z?"translate-x-4":"translate-x-0"} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200"></span>
          </button>
        </div>
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2 text-black font-bold dark:text-slate-300"><span class="material-symbols-outlined text-base">traffic</span><span class="text-xs font-semibold">Info Trânsito</span></div>
          <button id="traffic-toggle" class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${E?"bg-primary":"bg-slate-400 dark:bg-slate-600"}">
            <span class="${E?"translate-x-4":"translate-x-0"} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200"></span>
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
    </div>`,q.querySelectorAll("[data-nav]").forEach(o=>{o.onclick=()=>{P();const a=o.dataset.nav;a==="dash"?u(k):a==="earn"?u(Se):a==="history"?u(Ie):a==="profile"?u(Le):a==="support"?u($e):a==="logout"&&(n==null||n.emit("driver:offline",r.id),n==null||n.disconnect(),localStorage.removeItem("movvi_driver"),u(Z))}}),q.querySelector(".sidebar-close").onclick=W,q.querySelectorAll("[data-theme]").forEach(o=>{o.onclick=()=>{ge(o.dataset.theme),u(k)}});const t=q.querySelector("#weather-toggle");t&&(t.onclick=()=>{z=!z,localStorage.setItem("movvi_weather",z?"on":"off"),A()});const i=q.querySelector("#traffic-toggle");i&&(i.onclick=()=>{E=!E,localStorage.setItem("movvi_traffic",E?"on":"off"),A()});const s=q.querySelector("#btn-sound-test");s&&(s.onclick=()=>{S.currentTime=0,S.play().then(()=>{setTimeout(()=>{S.pause(),S.currentTime=0},2e3)}).catch(()=>alert("Áudio bloqueado! Clique em qualquer lugar e tente novamente."))})}function G(){q.classList.add("open"),R.classList.add("open")}function W(){q.classList.remove("open"),R.classList.remove("open")}function D(){n||(n=io(),n.on("connect",()=>{n.emit("register:driver",r.id),r.online&&(n.emit("driver:online",r.id),ke())}),setInterval(()=>{n&&n.connected&&r&&r.online&&(n.emit("driver:online",r.id),le().then(e=>{n.emit("driver:location",{driverId:r.id,latitude:e.latitude,longitude:e.longitude})}).catch(()=>{}))},1e4),n.on("order:incoming",e=>{h||u(we,e)}),n.on("order:timeout",()=>{clearInterval(C),h||u(k)}),n.on("order:status",({orderId:e,status:t})=>{h&&(h.orderId===e||h.id===e)&&(h.status=t,t==="completed"&&u(ie,h),t==="cancelled"&&(h=null,u(k)))}),n.on("order-chat:new-message",e=>{const t=document.getElementById("btn-chat");t&&!document.getElementById("chat-msgs")&&(document.getElementById("chat-dot")||(t.style.position="relative",t.innerHTML+='<div id="chat-dot" class="absolute -top-1 -right-1 size-3.5 bg-red-500 rounded-full border-2 border-white dark:border-background-dark animate-pulse"></div>'))}),pe(({latitude:e,longitude:t})=>{r.online&&n.emit("driver:location",{driverId:r.id,latitude:e,longitude:t}),J&&J.setLatLng([e,t]),j&&j.panTo([e,t])}))}async function ke(){try{const e=await X.list({driverId:r.id,status:"accepted,pickup,in_progress"});if(e&&e.length>0){const t=e[0];h={orderId:t.id,...t},u(K,h)}else u(k)}catch(e){console.error("Erro checkActiveOrder:",e)}}function Z(){const e=document.createElement("div");return e.className="view active bg-background-light dark:bg-background-dark",e.innerHTML=`
<div class="flex-1 flex flex-col items-center justify-center p-4">
  <div class="w-full max-w-md flex flex-col gap-8">
    <div class="flex flex-col items-center text-center gap-4 pt-8">
      <div class="w-20 h-20 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center"><span class="material-symbols-outlined text-primary text-4xl">auto_towing</span></div>
      <div><h1 class="text-black font-bold dark:text-slate-100 text-3xl font-bold tracking-tight">Movvi Reboque</h1>
      <p class="text-slate-600 dark:text-slate-400 text-base mt-1">Painel do Motorista Parceiro</p></div>
    </div>
    <form id="lf" class="flex flex-col gap-5 w-full bg-white dark:bg-white/5 p-6 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
      <div class="flex flex-col gap-2">
        <label class="text-black font-bold dark:text-slate-200 text-sm font-medium">Email</label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"><span class="material-symbols-outlined text-[20px]">mail</span></span>
          <input class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-slate-100 placeholder-slate-400 focus:border-primary focus:ring-primary pl-10 py-3" id="le" type="email" placeholder="motorista@movvi.com" value="motorista@movvi.com"/>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-black font-bold dark:text-slate-200 text-sm font-medium">Senha</label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"><span class="material-symbols-outlined text-[20px]">lock</span></span>
          <input class="form-input w-full rounded-lg bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-slate-100 placeholder-slate-400 focus:border-primary focus:ring-primary pl-10 py-3" id="lp" type="password" placeholder="Senha" value="123456"/>
        </div>
      </div>
      <div id="le-err" class="text-red-500 text-xs font-medium hidden"></div>
      <button type="submit" class="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3.5 px-4 rounded-lg shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"><span>Entrar</span><span class="material-symbols-outlined text-[20px]">arrow_forward</span></button>
    </form>
    <div class="text-center pb-8"><p class="text-slate-600 dark:text-slate-400">Não tem conta? <a id="go-reg" class="text-primary font-bold hover:underline cursor-pointer">Registrar</a></p></div>
  </div>
</div>`,e.querySelector("#lf").onsubmit=async t=>{t.preventDefault(),P();try{const{user:i}=await se.loginDriver(e.querySelector("#le").value,e.querySelector("#lp").value);M(i),D(),A(),u(k)}catch(i){const s=e.querySelector("#le-err");s.textContent=i.message,s.classList.remove("hidden")}},e.querySelector("#go-reg").onclick=()=>u(ye),e}function ye(){const e=document.createElement("div");return e.className="view active bg-background-light dark:bg-background-dark",e.innerHTML=`
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
</main>`,e.querySelector("#bk").onclick=()=>u(Z),e.querySelector("#rf").onsubmit=async t=>{t.preventDefault();try{const i=await se.registerDriver({name:e.querySelector("#rn").value,email:e.querySelector("#re").value,phone:e.querySelector("#rph").value,pixKey:e.querySelector("#rpix").value,vehicle:e.querySelector("#rv").value,plate:e.querySelector("#rpl").value,password:e.querySelector("#rp").value});M(i),D(),A(),u(k)}catch(i){const s=e.querySelector("#re-err");s.textContent=i.message,s.classList.remove("hidden")}},e}function k(){const e=document.createElement("div");e.className="view active";const t=r.online||!1;return e.innerHTML=`
<div class="relative flex h-full w-full flex-col overflow-hidden" style="height:100dvh">
  <div id="dmap" class="absolute inset-0 z-0 bg-slate-200 dark:bg-background-dark/90"></div>
  <header class="relative z-10 flex items-center justify-between p-4">
    <div class="bg-white/90 dark:bg-background-dark/80 backdrop-blur-md p-2 rounded-xl border border-slate-300 dark:border-primary/20 flex items-center gap-3 shadow-lg">
      <span class="text-xs font-bold uppercase tracking-wider ${t?"text-green-600 dark:text-primary":"text-slate-500"} ml-1">${t?"Online":"Offline"}</span>
      <button id="toggle" class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${t?"bg-green-500 dark:bg-primary":"bg-slate-400 dark:bg-slate-600"}">
        <span class="${t?"translate-x-5":"translate-x-0"} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-background-dark shadow ring-0 transition duration-200 ease-in-out"></span>
      </button>
    </div>
    <div class="flex items-center gap-3">
      <button id="btn-menu" class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 dark:bg-background-dark/80 backdrop-blur-md border border-slate-300 dark:border-primary/20 text-black font-bold dark:text-primary shadow-md">
        <span class="material-symbols-outlined">menu</span>
      </button>
    </div>
  </header>
  <div class="relative z-10 flex-1 pointer-events-none"></div>
  <button id="btn-recenter" class="absolute right-4 z-20 size-12 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-primary/20 shadow-xl flex items-center justify-center text-primary pointer-events-auto active:scale-95 transition-transform" style="bottom: 180px;">
    <span class="material-symbols-outlined" style="font-size:24px;">my_location</span>
  </button>
  <section class="relative z-30 bg-white dark:bg-background-dark border-t border-slate-200 dark:border-primary/20 rounded-t-[2rem] shadow-[0_-10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
    <div class="flex h-6 w-full items-center justify-center"><div class="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700"></div></div>
    <div class="px-6 pb-6 pt-2">
      <div class="grid grid-cols-1 gap-3">
        <div class="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
          <div class="h-12 w-12 rounded-full ${t?"bg-green-100 dark:bg-green-500/20":"bg-primary/10 dark:bg-primary/20"} flex items-center justify-center ${t?"text-green-600 dark:text-green-400":"text-primary"}">
            <span class="material-symbols-outlined">${t?"radar":"car_repair"}</span>
          </div>
          <div class="flex-1 overflow-hidden">
            <p class="text-black font-bold dark:text-slate-100 font-semibold" id="status-title">${t?"Buscando Resgate":"Sem chamados ativos"}</p>
            <p class="text-slate-500 dark:text-slate-400 text-xs transition-opacity duration-500" id="status-sub">${t?"Aguardando solicitações...":"Fique online para receber chamados"}</p>
          </div>
          <div class="h-2 w-2 rounded-full ${t?"bg-green-500 dark:bg-green-400":"bg-primary"} animate-pulse"></div>
        </div>
      </div>
    </div>
  </section>
</div>`,e.querySelector("#btn-menu").onclick=G,e.querySelector("#toggle").onclick=()=>{if(P(),!r.online&&r.blocked){alert(`⚠️ Conta Bloqueada por Débito

Seu saldo atual está abaixo do limite permitido (-R$ 50,00). Regularize sua conta na aba "Carteira" para voltar a receber chamados.`);return}r.online=!r.online,M(r),n.emit(r.online?"driver:online":"driver:offline",r.id),window.location.reload()},setTimeout(()=>{const i=e.querySelector("#dmap");if(!i)return;const s=(r==null?void 0:r.latitude)||-23.55,l=(r==null?void 0:r.longitude)||-46.63,o=t?17:14;j=L.map(i,{zoomControl:!1,attributionControl:!1}).setView([s,l],o),L.tileLayer(oe()).addTo(j),le().then(a=>{j.flyTo([a.latitude,a.longitude],o,{duration:1.5});const m=t?`<div style="position:absolute;left:0;top:0;pointer-events:none">
            <div style="position:absolute;left:-200px;top:-200px;width:400px;height:400px;border-radius:50%;background:rgba(59,130,246,0.06);animation:pulseRadar 3s ease-out infinite"></div>
            <div style="position:absolute;left:-125px;top:-125px;width:250px;height:250px;border-radius:50%;background:rgba(59,130,246,0.10);animation:pulseRadar 3s ease-out infinite 0.7s"></div>
            <div style="position:absolute;left:-60px;top:-60px;width:120px;height:120px;border-radius:50%;background:rgba(59,130,246,0.15);animation:pulseRadar 3s ease-out infinite 1.4s"></div>
            <div style="position:absolute;left:-8px;top:-8px;width:16px;height:16px;border-radius:50%;background:#3b82f6;box-shadow:0 0 10px rgba(59,130,246,0.8);z-index:2; border:2px solid white"></div>
          </div>
          <style>
            @keyframes pulseRadar { 0%{transform:scale(0);opacity:1} 100%{transform:scale(1.5);opacity:0} }
          </style>`:`<div style="position:absolute;left:0;top:0;pointer-events:none">
             <div style="position:absolute;left:-8px;top:-8px;width:16px;height:16px;border-radius:50%;background:#94a3b8;border:3px solid white;box-shadow:0 0 8px rgba(0,0,0,0.15);z-index:2"></div>
           </div>`;J=L.marker([a.latitude,a.longitude],{icon:L.divIcon({className:"",html:m,iconSize:[0,0],iconAnchor:[0,0]})}).addTo(j),e.querySelector("#btn-recenter").onclick=()=>{const b=J.getLatLng();j.flyTo(b,o,{duration:.8})};const c=["Buscando Resgate"],x=["Aguardando solicitações na região..."];if(t&&(c.push("⚠️ Atenção ao Trajeto"),x.push("Evite rodovias por longos km.")),E&&t){const b=xe();c.push(b.label),x.push(b.tip),L.circleMarker([a.latitude,a.longitude],{radius:60,color:b.color,fillColor:b.color,fillOpacity:.08,weight:1,opacity:.3}).addTo(j)}z&&t&&he(a.latitude,a.longitude).then(b=>{if(!b||!b.current_weather)return;const d=b.current_weather,p=ve[d.weathercode]||"",v=Math.round(d.temperature)+"°C",I=Math.round(d.windspeed)+" km/h";let $=[];if(b.hourly){const H=new Date().getHours();for(let g=H+1;g<Math.min(H+4,(b.hourly.time||[]).length);g++){const w=new Date(b.hourly.time[g]).getHours();$.push(w+"h "+Math.round(b.hourly.temperature_2m[g])+"°C")}}c.push(p+" · "+v),x.push("Condição atual na região"),c.push("Vento: "+I),x.push("Velocidade do vento agora"),$.length&&(c.push("Próx: "+$.join(" · ")),x.push("Previsão próximas horas")),f()});function f(){if(c.length<=1)return;let b=0;const d=e.querySelector("#status-title"),p=e.querySelector("#status-sub");!d||!p||(d.style.transition="opacity 0.3s ease",p.style.transition="opacity 0.3s ease",setInterval(()=>{b=(b+1)%c.length,d.style.opacity="0",p.style.opacity="0",setTimeout(()=>{d.textContent=c[b],p.textContent=x[b],d.style.opacity="1",p.style.opacity="1"},300)},4e3))}E&&t&&(!z||!t)&&f()}).catch(()=>{})},100),e}function we(e){const t=document.createElement("div");t.className="view active bg-background-light dark:bg-background-dark";const i=(e.driverPrice||e.price||0).toFixed(2).replace(".",",");let s=Math.floor((e.timeout||15e3)/1e3);t.innerHTML=`
<div class="flex flex-col h-full">
  <div class="p-6 text-center border-b border-slate-200 dark:border-white/10">
    <div class="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse"><div class="w-2 h-2 bg-primary rounded-full"></div>Novo Chamado</div>
  </div>
  <div class="flex-1 flex flex-col items-center justify-center p-6">
    <div class="relative mb-6"><svg class="w-24 h-24 -rotate-90" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="4" class="text-slate-200 dark:text-black font-bold"/><circle id="tc" cx="50" cy="50" r="45" fill="none" stroke="#ffd900" stroke-width="4" stroke-dasharray="283" stroke-dashoffset="0" style="transition:all 1s linear"/></svg><span id="tt" class="absolute inset-0 flex items-center justify-center text-3xl font-black text-black font-bold dark:text-white">${s}</span></div>
    <h2 class="text-2xl font-black text-black font-bold dark:text-white mb-1">${e.vehicleModel||"Veículo"}</h2>
    <div class="bg-primary/20 text-primary px-3 py-1 rounded-lg border border-primary/30 mb-4 font-bold flex items-center gap-1"><span class="material-symbols-outlined text-sm">build</span> ${e.serviceName||e.serviceType||"Tipo de Pane Não Informado"}</div>
    
    <div class="w-full flex items-center gap-3 bg-slate-100 dark:bg-white/5 px-4 py-3 rounded-2xl mb-6 border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
      <div class="size-12 rounded-xl border border-primary bg-primary/10 flex items-center justify-center text-primary shrink-0 relative overflow-hidden">
        ${e.clientPhoto?`<img src="${e.clientPhoto}" class="w-full h-full object-cover">`:'<span class="material-symbols-outlined text-2xl">person</span>'}
        <div class="absolute -bottom-1 -right-1 size-4 bg-green-500 rounded-full border-2 border-white dark:border-background-dark shadow-sm"></div>
      </div>
      <div class="text-left flex-1 min-w-0">
        <p class="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-0.5">Cliente Solicitante</p>
        <p class="text-base font-black text-black dark:text-white truncate">${e.clientName||"Cliente"}</p>
      </div>
      <div class="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-200 dark:border-yellow-500/20">
        <span class="text-xs font-black">5.0</span><span class="material-symbols-outlined text-[12px]">star</span>
      </div>
    </div>
    <div class="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 flex justify-around mb-6">
      <div class="text-center"><p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Percurso total</p><p class="text-black font-bold dark:text-white text-lg">${e.distanceKm||"?"} km</p></div>
      <div class="w-px bg-slate-200 dark:bg-white/10"></div>
      <div class="text-center"><p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Ganho (Líquido)</p><p class="text-primary font-black text-lg">R$ ${i}</p></div>
    </div>
    <div class="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 mb-4 flex flex-col gap-3 relative">
      <div class="absolute left-[20px] top-6 bottom-16 w-0.5 bg-slate-200 dark:bg-white/10"></div>
      <div class="flex flex-col gap-1 relative z-10 pl-5">
         <div class="absolute left-[-5px] top-1 bottom-0 size-3 rounded-full bg-white border-2 border-primary"></div>
         <p class="text-[9px] text-slate-500 mb-0.5 uppercase tracking-wider font-bold">Origem (Retirada)</p>
         <p class="text-black font-bold dark:text-white text-sm font-semibold leading-tight line-clamp-2">${e.pickupAddress||"Endereço Indisponível"}</p>
      </div>
      <div class="flex flex-col gap-1 relative z-10 pl-5">
         <div class="absolute left-[-5px] top-1 bottom-0 size-3 rounded-full bg-slate-400 dark:bg-slate-500"></div>
         <p class="text-[9px] text-slate-500 mb-0.5 uppercase tracking-wider font-bold">Destino Final (Entrega)</p>
         <p class="text-black font-bold dark:text-white text-sm font-semibold leading-tight line-clamp-2">${e.destinationAddress||"Endereço Indisponível"}</p>
      </div>
    </div>
  </div>
  <div class="p-5 flex gap-3 border-t border-slate-200 dark:border-white/10">
    <button id="bd" class="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold py-4 rounded-xl hover:text-red-500">Recusar</button>
    <button id="ba" class="flex-[2] bg-primary text-black font-bold py-4 rounded-xl shadow-lg hover:bg-primary/90 active:scale-[0.98]">Aceitar Corrida</button>
  </div>
</div>`;const l=t.querySelector("#tc"),o=(e.timeout||15e3)/1e3,a=t.querySelector("#tt");try{S.currentTime=0,S.play().catch(c=>console.log("Audio blocked - requires user interaction first",c));const m=()=>{S.pause(),S.currentTime=0};C=setInterval(()=>{s--,a.textContent=s,l.style.strokeDashoffset=283*(1-s/o),s<=0&&(clearInterval(C),m())},1e3),t.querySelector("#ba").onclick=()=>{m(),clearInterval(C),n.emit("order:accept",{driverId:r.id,orderId:e.orderId}),h=e,u(K,e)},t.querySelector("#bd").onclick=()=>{m(),clearInterval(C),n.emit("order:decline",{driverId:r.id,orderId:e.orderId}),u(k)}}catch{C=setInterval(()=>{s--,a.textContent=s,l.style.strokeDashoffset=283*(1-s/o),s<=0&&clearInterval(C)},1e3),t.querySelector("#ba").onclick=()=>{clearInterval(C),n.emit("order:accept",{driverId:r.id,orderId:e.orderId}),h=e,u(K,e)},t.querySelector("#bd").onclick=()=>{clearInterval(C),n.emit("order:decline",{driverId:r.id,orderId:e.orderId}),u(k)}}return t}function K(e){const t=document.createElement("div");t.className="view active",t.innerHTML=`
<div class="relative flex flex-col" style="height:100dvh">
  <div class="absolute top-4 left-4 z-10"><button id="btn-menu" class="size-10 rounded-lg bg-background-dark/80 backdrop-blur-md border border-primary/20 text-primary flex items-center justify-center"><span class="material-symbols-outlined">menu</span></button></div>
  <div class="absolute top-4 right-4 z-10 flex gap-2">
    <button id="btn-recenter" class="bg-white/90 dark:bg-background-dark/80 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-300 dark:border-primary/20 text-primary active:scale-95"><span class="material-symbols-outlined">my_location</span></button>
  </div>
  <div id="jmap" class="flex-1 bg-slate-200 dark:bg-background-dark"></div>
  <div class="bg-white dark:bg-background-dark border-t border-primary/20 rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.3)] p-6 -mt-4 relative z-10 flex flex-col flex-shrink-0">
    <div class="flex justify-between items-start mb-4">
      <div class="flex items-center gap-3">
        <div class="size-12 rounded-xl overflow-hidden border border-primary bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-sm">
          ${e.clientPhoto?`<img src="${e.clientPhoto}" class="w-full h-full object-cover">`:'<span class="material-symbols-outlined text-2xl">person</span>'}
        </div>
        <div><p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Cliente</p><h3 class="text-black font-bold dark:text-white text-lg leading-tight">${e.clientName||"Cliente"}</h3></div>
      </div>
      <div class="flex gap-2">
        <button id="btn-chat" class="size-10 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:text-primary"><span class="material-symbols-outlined">chat</span></button>
        <button id="btn-call" class="size-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20"><span class="material-symbols-outlined">call</span></button>
      </div>
    </div>
    <div class="bg-indigo-50 dark:bg-indigo-500/10 rounded-xl p-3 flex items-start gap-3 mb-3 border border-indigo-200 dark:border-indigo-500/20">
      <span class="material-symbols-outlined text-indigo-500 mt-0.5">build</span>
      <div><p class="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-0.5">${e.serviceName||e.serviceType||"Ocorrência"}</p><p class="text-black font-bold dark:text-slate-200 text-sm font-medium line-clamp-2 leading-tight">${e.problemDescription||"Sem detalhes adiconados."}</p></div>
    </div>
    <div class="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 mb-4 p-4 relative">
      <div class="absolute left-[20px] top-6 bottom-16 w-0.5 bg-slate-200 dark:bg-white/10"></div>
      <div class="flex items-start gap-4 relative z-10 mb-4">
        <div class="size-6 rounded-full bg-white dark:bg-background-dark border-4 border-primary shrink-0 mt-0.5"></div>
        <div class="flex-1 min-w-0">
          <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Origem</p>
          <p class="text-black font-bold dark:text-slate-300 text-sm font-semibold leading-tight">${e.pickupAddress||""}</p>
          <a href="https://maps.google.com/?q=${e.pickupLat||"-23.55"},${e.pickupLon||"-46.63"}" target="_blank" class="mt-2 text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-emerald-500 px-2.5 py-1 rounded inline-flex items-center gap-1 active:scale-95 transition-all w-fit"><span class="material-symbols-outlined text-[14px]">explore</span>Navegar (Maps)</a>
        </div>
      </div>
      <div class="flex items-start gap-4 relative z-10">
        <div class="size-6 rounded-full bg-white dark:bg-background-dark border-4 border-slate-400 shrink-0 mt-0.5" id="dest-dot"></div>
        <div class="flex-1 min-w-0">
          <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Destino Final (<span class="text-primary font-black">${e.distanceKm||"?"} km</span> totais)</p>
          <p class="text-black font-bold dark:text-slate-300 text-sm font-semibold leading-tight">${e.destinationAddress||"Não informado"}</p>
          <a id="nav-dest" href="https://maps.google.com/?q=${e.destinationLat||"-23.55"},${e.destinationLon||"-46.63"}" target="_blank" class="mt-2 text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-emerald-500 px-2.5 py-1 rounded inline-flex items-center gap-1 active:scale-95 transition-all w-fit hidden"><span class="material-symbols-outlined text-[14px]">explore</span>Navegar (Maps)</a>
        </div>
      </div>
      <div id="route-info" class="flex items-center justify-center gap-2 text-xs text-slate-500 py-2 border-t border-slate-200 dark:border-white/5 mt-3"><span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>Calculando rota GPS...</div>
    </div>
    <div class="mt-auto">
      <button id="b1" class="w-full bg-primary text-black font-bold py-4 rounded-xl shadow-lg active:scale-[0.98]">Cheguei ao Local</button>
      <button id="b2" class="w-full bg-primary/10 border border-primary text-primary font-bold py-4 rounded-xl mt-2 hidden">Embarque Confirmado</button>
      <button id="b3" class="w-full bg-slate-900 text-white font-bold py-4 rounded-xl mt-2 hidden">Concluir Viagem</button>
    </div>
  </div>
</div>`,t.querySelector("#btn-chat").onclick=()=>{const g=document.getElementById("chat-dot");g&&g.remove(),u(qe,e)},t.querySelector("#btn-call").onclick=()=>Te(e.clientId,e.clientName,e.clientPhoto);const i=t.querySelector("#b1"),s=t.querySelector("#b2"),l=t.querySelector("#b3");let o=null;const a=()=>{o&&navigator.geolocation.clearWatch(o)};i.onclick=()=>{n.emit("order:arrived",{orderId:e.orderId}),i.classList.add("hidden"),s.classList.remove("hidden")},s.onclick=()=>{n.emit("order:start",{orderId:e.orderId}),s.classList.add("hidden"),l.classList.remove("hidden");const g=t.querySelector("#nav-dest");g&&g.classList.remove("hidden");const w=t.querySelector("#dest-dot");w&&w.classList.replace("border-slate-400","border-primary"),t.querySelector("#route-info").innerHTML='<span class="text-primary font-bold leading-tight drop-shadow-sm">Em viagem para o destino final</span>',$(d,p)},l.onclick=()=>{a(),n.emit("order:complete",{orderId:e.orderId}),h=null,u(ie,e)};const m=e.pickupLat||-23.55,c=e.pickupLon||-46.63;let x=null,f=null,b=null,d=r.latitude||m,p=r.longitude||c,v=!0;t.querySelector("#btn-recenter").onclick=()=>{v=!0,x&&x.setView([d,p],17)};let I=null;async function $(g,w){d=g,p=w;const Q=t.querySelector("#route-info");let V=m,F=c;if(h&&h.status==="in_progress"&&(V=e.destinationLat||m,F=e.destinationLon||c),b?b.setLatLng([g,w]):b=L.marker([g,w],{icon:L.divIcon({className:"",html:'<div style="background:#2563eb;color:#fff;width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 0 10px rgba(37,99,235,0.5)"><span class="material-symbols-outlined" style="font-size:16px">car_repair</span></div>',iconSize:[28,28],iconAnchor:[14,14]})}).addTo(x),v&&x.setView([g,w],x.getZoom()>15?x.getZoom():17),n.emit("driver:location",{driverId:r.id,latitude:g,longitude:w}),I)return;I=setTimeout(()=>{I=null},5e3);try{const _=await(await fetch(`https://router.project-osrm.org/route/v1/driving/${w},${g};${F},${V}?overview=full&geometries=geojson`)).json();if(_.routes&&_.routes.length>0){const be=_.routes[0].geometry.coordinates.map(te=>[te[1],te[0]]);f&&x.removeLayer(f),f=L.polyline(be,{color:"#ffd900",weight:6,opacity:.9}).addTo(x);const Y=Math.round(_.routes[0].duration/60),ee=(_.routes[0].distance/1e3).toFixed(1);Q.innerHTML=`<span class="material-symbols-outlined text-sm text-green-600">navigation</span><span class="text-green-600 font-bold">${ee}km • ~${Y} min</span>`,n.emit("driver:eta",{orderId:e.orderId,clientId:e.clientId,etaMinutes:Y,distanceKm:parseFloat(ee)});return}}catch{}f&&x.removeLayer(f),f=L.polyline([[g,w],[V,F]],{color:"#ffd900",weight:4,dashArray:"10,8",opacity:.7}).addTo(x);const de=(Math.sqrt(Math.pow(g-V,2)+Math.pow(w-F,2))*111).toFixed(1);Q.innerHTML=`<span class="material-symbols-outlined text-sm text-amber-500">navigation</span><span class="text-amber-500 font-semibold">~${de}km (linha reta)</span>`}setTimeout(()=>{x=L.map(t.querySelector("#jmap"),{zoomControl:!1,attributionControl:!1}).setView([m,c],17),L.tileLayer(oe()).addTo(x),x.invalidateSize(),L.marker([m,c],{icon:L.divIcon({className:"",html:'<div style="width:20px;height:20px;background:#ffd900;border:3px solid #000;border-radius:50%"></div>',iconSize:[20,20],iconAnchor:[10,10]})}).addTo(x),x.on("dragstart",()=>{v=!1}),$(d,p),navigator.geolocation&&navigator.geolocation.watchPosition&&(o=navigator.geolocation.watchPosition(g=>$(g.coords.latitude,g.coords.longitude),()=>{},{enableHighAccuracy:!0,timeout:5e3,maximumAge:0}))},300);const H=setInterval(()=>{document.body.contains(t)||(a(),clearInterval(H))},5e3);return t}function ie(e){const t=document.createElement("div");t.className="view active bg-background-light dark:bg-background-dark";let i=0;const s=(e.driverPrice||e.price||0).toFixed(2).replace(".",",");return t.innerHTML=`
<div class="flex-1 flex flex-col items-center p-6 pt-16">
  <div class="size-16 bg-primary/20 rounded-full flex items-center justify-center mb-6"><span class="material-symbols-outlined text-primary text-3xl">check</span></div>
  <h1 class="text-2xl font-black text-black font-bold dark:text-white mb-1">Viagem Concluída!</h1>
  <p class="text-slate-500 text-sm mb-8">Pagamento: R$ ${s}</p>
  <p class="text-slate-500 text-xs font-medium uppercase tracking-wider mb-4">Como foi o cliente?</p>
  <div class="flex gap-2 mb-8" id="stars">${[1,2,3,4,5].map(l=>`<button data-v="${l}" class="size-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center hover:border-primary"><span class="material-symbols-outlined text-2xl text-slate-300">star</span></button>`).join("")}</div>
  <button id="done" class="w-full bg-primary text-black font-bold py-4 rounded-xl shadow-lg mt-auto">Concluir</button>
</div>`,t.querySelectorAll("#stars button").forEach(l=>{l.onclick=async()=>{i=parseInt(l.dataset.v),t.querySelectorAll("#stars button span").forEach(o=>{const a=parseInt(o.parentElement.dataset.v);o.className=`material-symbols-outlined text-2xl ${a<=i?"text-primary":"text-slate-300"}`});try{await X.rate(e.orderId||e.id,i,"driver")}catch{}}}),t.querySelector("#done").onclick=()=>u(k),t}function Se(){const e=document.createElement("div");e.className="view active bg-background-light dark:bg-background-dark",e.innerHTML=`
<header class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-20">
  <button id="btn-menu-init" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-black font-bold dark:text-slate-200"><span class="material-symbols-outlined">menu</span></button>
  <h2 class="font-bold text-black font-bold dark:text-white">Carteira</h2><div class="size-10"></div>
</header>
<main id="wallet-main" class="flex-1 overflow-y-auto pb-24">
  <div class="flex flex-col items-center justify-center py-20 animate-pulse">
    <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
    <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Carregando carteira...</p>
  </div>
</main>`,e.querySelector("#btn-menu-init").onclick=G;const t=async()=>{try{if(!r||!r.id)return;const{balance:s,transactions:l}=await O("/drivers/"+r.id+"/wallet");r.walletBalance=s,M(r);const o=(s||0).toFixed(2).replace(".",","),a=(s||0)<0,m=e.querySelector("#wallet-main");m.innerHTML=`
  <div class="p-6 pb-4 bg-white dark:bg-surface-dark/30 border-b border-slate-200 dark:border-white/5 shadow-sm">
    <div class="flex items-start justify-between mb-4">
      <div>
        <p class="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Saldo na Plataforma</p>
        <h2 class="text-4xl font-black ${(s||0)<0?"text-red-500 dark:text-red-400":"text-emerald-500"}">R$ ${o}</h2>
      </div>
      <div>
        ${r.blocked?'<span class="px-2 py-1 bg-red-500 text-white text-[9px] font-black rounded uppercase animate-pulse tracking-tighter">Conta Bloqueada</span>':""}
      </div>
    </div>

    <!-- Explicação do Sistema (Socrática e Bonitinha) -->
    <div class="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-4 mb-5 flex items-start gap-3">
      <span class="material-symbols-outlined text-indigo-500 text-xl mt-0.5">help</span>
      <div>
        <p class="text-[11px] font-black text-indigo-900 dark:text-indigo-400 uppercase tracking-wider mb-1">Como eu pago a taxa?</p>
        <p class="text-xs text-indigo-700/80 dark:text-indigo-300 leading-snug">Você fecha a corrida e recebe <strong class="text-indigo-900 dark:text-indigo-200">100%</strong> do dinheiro do cliente na hora. A taxa de uso (<strong class="text-indigo-900 dark:text-indigo-200">15%</strong>) vira saldo devedor aqui na carteira. Assim, você só paga o app <b>depois</b> de Lucrar.<br/><br/>⚠️ Limite máximo: <strong class="text-red-500">-R$ 50,00</strong> (gera bloqueio de novos chamados).</p>
      </div>
    </div>

    <!-- MINHA CHAVE PIX (Para o cliente pagar o motorista) -->
    <div class="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 rounded-xl p-4 mb-5">
      <div class="flex items-center gap-2 mb-3">
        <span class="material-symbols-outlined text-primary text-xl">pix</span>
        <h3 class="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Minha Chave Pix</h3>
      </div>
      <p class="text-[10px] text-slate-500 mb-3 leading-tight font-medium">Cadastre sua chave PIX para apresentá-la ao cliente na conclusão do serviço.</p>
      <div class="flex items-center gap-2">
        <input type="text" id="wallet-pix-input" placeholder="CPF, Email, Telefone..." value="${r.pixKey||""}" class="flex-1 bg-white dark:bg-background-dark border border-slate-300 dark:border-white/20 rounded-lg px-3 py-2.5 text-sm text-black dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary transition-colors font-medium">
        <button id="btn-save-pix-wallet" class="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg px-4 py-2.5 text-xs font-black uppercase tracking-wider active:scale-95 transition-transform flex items-center justify-center min-w-[80px]">Salvar</button>
      </div>
    </div>

    <button id="btn-pay-pix" class="w-full ${a?"bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900":"bg-primary text-black"} font-black py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 tracking-wide text-sm">
      ${a?"QUITAR DÍVIDA / PAGAR":"ADICIONAR CRÉDITOS"} <span class="material-symbols-outlined text-base">qr_code_2</span>
    </button>
  </div>

  <div class="p-4">
    <div class="flex items-center justify-between mb-4 px-2">
      <h3 class="text-xs font-black text-slate-500 uppercase tracking-widest">Extrato Detalhado</h3>
      <span class="material-symbols-outlined text-slate-400 text-sm">history</span>
    </div>
    
    <div id="tx-list" class="space-y-3">
      ${l.length?l.map(f=>{const b=f.type==="fee",d=(f.amount||0).toFixed(2).replace(".",","),p=f.orderValue?`R$ ${f.orderValue.toFixed(2).replace(".",",")}`:"",v=new Date(f.createdAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"});return`
        <div class="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col gap-2">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs font-bold text-slate-900 dark:text-white">${f.description}</p>
              <p class="text-[10px] text-slate-400 font-medium">${v}</p>
            </div>
            <p class="${b?"text-red-500":"text-green-500"} font-black text-sm">${b?"":"+"}${d}</p>
          </div>
          ${b?`<div class="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-2 mt-1">
            <p class="text-[9px] text-slate-400 uppercase font-bold">Valor Total Serv.</p>
            <p class="text-[9px] text-slate-600 dark:text-slate-300 font-bold">${p}</p>
          </div>`:""}
          <div class="flex items-center justify-between">
            <p class="text-[9px] text-slate-400 uppercase font-bold">Saldo Resultante</p>
            <p class="text-[9px] font-black text-slate-500">R$ ${f.balanceAfter.toFixed(2).replace(".",",")}</p>
          </div>
        </div>`}).join(""):'<div class="py-12 text-center"><span class="material-symbols-outlined text-slate-200 text-5xl mb-2">payments</span><p class="text-slate-400 text-xs font-bold">Nenhuma transação registrada</p></div>'}
    </div>
  </div>`,e.querySelector("#btn-pay-pix").onclick=()=>i(a?Math.abs(s):0);const c=e.querySelector("#btn-save-pix-wallet"),x=e.querySelector("#wallet-pix-input");c&&x&&(c.onclick=async()=>{const f=x.value.trim();c.innerHTML='<div class="size-4 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin"></div>';try{await O("/drivers/"+r.id,"PUT",{pixKey:f}),r.pixKey=f,M(r),c.innerHTML='<span class="material-symbols-outlined text-sm">check</span>',setTimeout(()=>c.innerHTML="Salvar",2e3)}catch{c.innerHTML="ERRO",setTimeout(()=>c.innerHTML="Salvar",2e3)}})}catch(s){console.error("Wallet Error:",s);const l=s.message||"Erro de conexão";e.querySelector("#wallet-main").innerHTML=`
        <div class="p-20 text-center">
          <p class="text-red-500 text-sm font-black mb-4">${l}</p>
          <button id="retry-wallet" class="px-6 py-2 bg-primary rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">Tentar Novamente</button>
        </div>`;const o=e.querySelector("#retry-wallet");o&&(o.onclick=t)}},i=s=>{const l=document.createElement("div");l.className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300",s.toFixed(2).replace(".",","),l.innerHTML=`
    <div class="w-full max-w-sm bg-white dark:bg-background-dark rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl slide-in-from-bottom duration-500 animate-in relative overflow-hidden">
      <div class="absolute -right-10 -top-10 size-32 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div class="flex items-center justify-between mb-8">
        <h3 class="font-black text-slate-900 dark:text-white text-lg uppercase tracking-tight">Pagamento PIX</h3>
        <button id="close-modal-pix" class="size-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500"><span class="material-symbols-outlined text-sm">close</span></button>
      </div>

      <div class="flex flex-col items-center gap-4 mb-6">
        <div class="bg-white p-3 rounded-2xl shadow-inner border-4 border-slate-50 relative group">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126480014br.gov.bcb.pix0111123456789010203Movvi5204000053039865404${s.toFixed(2)}5802BR5913MovviServices6009SaoPaulo62070503***6304CA1E" class="w-40 h-40 rounded" />
          <div class="absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
             <span class="material-symbols-outlined text-primary text-4xl animate-pulse">qr_code_scanner</span>
          </div>
        </div>
        
        <div class="w-full mt-4">
          <label class="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1.5 block">Valor da Recarga/Pagamento (R$)</label>
          <div class="relative">
            <input id="pix-amount" type="number" step="0.01" value="${(s>0?s:20).toFixed(2)}" class="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-lg font-black text-slate-900 dark:text-white outline-none focus:border-primary transition-colors text-center" />
          </div>
          ${s>0?'<p class="text-[10px] text-red-500 font-bold mt-2 text-center">* Sugestão Mínima para cobrir o saldo devedor.</p>':""}
        </div>
      </div>

      <div class="space-y-3">
        <button id="btn-copy-pix" class="w-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 text-sm active:scale-95 transition-all">Copiar Chave PIX <span class="material-symbols-outlined text-sm">content_copy</span></button>
        <button id="btn-confirm-pay" class="w-full bg-primary text-black font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all text-sm uppercase tracking-widest">Já Realizei o Pagamento</button>
      </div>
      
      <p class="text-[9px] text-center text-slate-400 mt-6 px-4">O saldo será atualizado automaticamente após a confirmação do pagamento pela nossa central.</p>
    </div>`,document.body.appendChild(l);const o=()=>{l.classList.remove("animate-in"),l.classList.add("animate-out","fade-out","duration-300"),l.querySelector("div").classList.add("slide-out-to-bottom"),setTimeout(()=>l.remove(),300)};l.querySelector("#close-modal-pix").onclick=o;const a=l.querySelector("#btn-confirm-pay");a&&(a.onclick=async()=>{a.innerHTML='<span class="material-symbols-outlined animate-spin align-middle mr-2">progress_activity</span> CONFIRMANDO...',a.disabled=!0;const m=parseFloat(l.querySelector("#pix-amount").value);if(isNaN(m)||m<=0){alert("Por favor, informe um valor válido maior que zero."),a.innerHTML="Já Realizei o Pagamento",a.disabled=!1;return}try{await O("/drivers/"+r.id+"/pay",{method:"POST",body:JSON.stringify({amount:m})});const c=await O("/drivers/"+r.id);Object.assign(r,c),M(r),o(),t(),alert(`✅ Pagamento Confirmado!
Seu saldo foi zerado e sua conta está regularizada.`)}catch(c){alert("Erro ao confirmar pagamento: "+c.message),a.innerHTML="Já Realizei o Pagamento",a.disabled=!1}})};return t(),e}function Ie(){const e=document.createElement("div");return e.className="view active bg-background-light dark:bg-background-dark",e.innerHTML=`
<header class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10">
  <button id="btn-menu" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-black font-bold dark:text-slate-200"><span class="material-symbols-outlined">menu</span></button>
  <h2 class="font-bold text-black font-bold dark:text-white">Histórico</h2><div class="size-10"></div>
</header>
<main class="flex-1 overflow-y-auto p-4"><div id="hl"><p class="text-slate-500 text-sm text-center py-8">Carregando...</p></div></main>`,e.querySelector("#btn-menu").onclick=G,(async()=>{try{const t=await X.list({driverId:r.id}),i=e.querySelector("#hl");if(!t.length){i.innerHTML='<p class="text-slate-500 text-sm text-center py-8">Nenhuma corrida</p>';return}i.innerHTML=t.map(s=>`<div class="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-3"><div class="size-12 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400"><span class="material-symbols-outlined">minor_crash</span></div><div class="flex-1"><h4 class="font-semibold text-sm text-black font-bold dark:text-white">${s.serviceName}</h4><p class="text-xs text-slate-500">${s.pickupAddress||"Local"}</p></div><div class="text-right"><p class="text-xs font-bold ${s.status==="completed"?"text-green-500":s.status==="cancelled"?"text-red-500":"text-primary"}">${s.status}</p></div></div>`).join("")}catch{}})(),e}function Le(){const e=document.createElement("div");e.className="view active bg-background-light dark:bg-background-dark";const i=(r.name||"").replace(/\uFFFD/g,"ã").replace(/Joo/i,"João").replace(/Jo.?o/i,"João"),s=r.photo||"";e.innerHTML=`
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
        <input type="text" id="i-name" class="bg-transparent text-black font-bold dark:text-white font-medium text-lg w-full outline-none" value="${i}" readonly />
        <button id="b-edit-name" class="text-primary p-2 -mr-2"><span class="material-symbols-outlined text-sm">edit</span></button>
      </div>
    </div>
    <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4">
      <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Email</p>
      <p class="text-black font-bold dark:text-white font-medium text-base">${r.email||"N/A"}</p>
    </div>
    <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4">
      <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Telefone</p>
      <p class="text-black font-bold dark:text-white font-medium text-base">${r.phone||"N/A"}</p>
    </div>
    <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 relative group">
      <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Chave PIX (Para Recebimentos)</p>
      <div class="flex items-center justify-between">
         <input type="text" id="i-pix" class="bg-transparent text-black font-bold dark:text-white font-medium text-base w-full outline-none placeholder-slate-400" placeholder="Sua chave PIX" value="${r.pixKey||""}" readonly />
         <button id="b-edit-pix" class="text-primary p-2 -mr-2"><span class="material-symbols-outlined text-sm">edit</span></button>
      </div>
    </div>
    <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4">
      <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Veículo Reservado</p>
      <p class="text-black font-bold dark:text-white font-medium text-base">${r.vehicle||"N/A"} - ${r.plate||"N/A"}</p>
    </div>
  </div>
  
  <button id="btn-save" class="w-full bg-primary text-black font-bold py-3.5 rounded-xl shadow-lg mt-8 hidden active:scale-[0.98] transition-all">Salvar Alterações</button>
</main>`,e.querySelector("#btn-menu").onclick=G;const l=e.querySelector("#f-input"),o=e.querySelector("#btn-save"),a=e.querySelector("#i-name"),m=e.querySelector("#b-edit-name"),c=e.querySelector("#i-pix"),x=e.querySelector("#b-edit-pix");let f=null;return e.querySelector("#photo-container").onclick=()=>l.click(),l.onchange=b=>{const d=b.target.files[0];if(d){const p=new FileReader;p.onload=v=>{f=v.target.result;const I=e.querySelector(".size-28");I.innerHTML=`<img src="${f}" class="w-full h-full object-cover relative z-0" />
                       <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"><span class="material-symbols-outlined text-white">photo_camera</span></div>`,o.classList.remove("hidden")},p.readAsDataURL(d)}},m.onclick=()=>{a.removeAttribute("readonly"),a.focus(),a.classList.add("border-b","border-primary","pb-1"),o.classList.remove("hidden")},x.onclick=()=>{c.removeAttribute("readonly"),c.focus(),c.classList.add("border-b","border-primary","pb-1"),o.classList.remove("hidden")},o.onclick=async()=>{const b=a.value.trim();b&&(r.name=b);const d=c.value.trim();r.pixKey=d,f&&(r.photo=f),M(r);try{await fetch("/api/drivers/"+r.id,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:r.name,photo:r.photo,pixKey:r.pixKey})})}catch{}o.textContent="Salvo!",o.classList.remove("bg-primary"),o.classList.add("bg-green-500","text-white"),setTimeout(()=>{o.classList.add("hidden"),o.textContent="Salvar Alterações",o.classList.add("bg-primary"),o.classList.remove("bg-green-500","text-white"),a.setAttribute("readonly","true"),a.classList.remove("border-b","border-primary","pb-1"),c.setAttribute("readonly","true"),c.classList.remove("border-b","border-primary","pb-1"),A()},1500)},e}function $e(){const e=document.createElement("div");e.className="view active bg-background-light dark:bg-background-dark",e.innerHTML=`
<header class="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10">
  <button id="bk" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center"><span class="material-symbols-outlined text-black font-bold dark:text-slate-200">arrow_back</span></button>
  <div class="flex-1"><h1 class="text-base font-bold text-black font-bold dark:text-white">Suporte Movvi</h1><p class="text-[10px] text-slate-500">Chat com a plataforma</p></div>
  <div class="size-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center"><span class="material-symbols-outlined text-primary">support_agent</span></div>
</header>
<div id="chat-msgs" class="flex-1 overflow-y-auto p-4 space-y-3" style="max-height:calc(100dvh - 140px)"></div>
<form id="chat-form" class="p-3 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-background-dark sticky bottom-0">
  <div class="flex gap-2 items-center">
    <input id="chat-input" class="form-input flex-1 rounded-xl bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10 text-black font-bold dark:text-white py-3 px-4 text-sm" placeholder="Digite sua mensagem..." autocomplete="off"/>
    <button type="submit" class="size-11 bg-primary rounded-xl flex items-center justify-center text-black font-bold shadow-md hover:bg-primary/90 active:scale-95"><span class="material-symbols-outlined text-lg">send</span></button>
  </div>
</form>`,e.querySelector("#bk").onclick=()=>u(k);const t=e.querySelector("#chat-msgs");function i(l){const o=l.from==="driver",a=new Date(l.timestamp).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),m=document.createElement("div");m.className=`flex ${o?"justify-end":"justify-start"}`,m.innerHTML=`<div class="max-w-[80%] px-4 py-2.5 rounded-2xl ${o?"bg-primary text-black font-bold rounded-br-md":"bg-slate-100 dark:bg-white/10 text-black font-bold dark:text-white rounded-bl-md"}"><p class="text-sm">${l.message}</p><p class="text-[9px] mt-1 ${o?"text-black font-bold/60":"text-slate-400"} text-right">${a}</p></div>`,t.appendChild(m),t.scrollTop=t.scrollHeight}n.emit("chat:get-history",{driverId:r.id}),n.once("chat:history",({messages:l})=>{l.forEach(i)});const s=l=>{l.driverId===r.id&&l.from==="admin"&&i(l)};return n.on("chat:new-message",s),e.querySelector("#chat-form").onsubmit=l=>{l.preventDefault();const o=e.querySelector("#chat-input"),a=o.value.trim();a&&(n.emit("chat:driver-to-admin",{driverId:r.id,driverName:r.name,message:a}),i({from:"driver",message:a,timestamp:new Date().toISOString()}),o.value="")},e}function qe(e){const t=document.createElement("div");t.className="view active bg-background-light dark:bg-background-dark";const i=e.orderId||e.id;t.innerHTML=`
<div class="flex flex-col" style="height:100dvh">
<header class="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-white/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10">
  <button id="bk" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center"><span class="material-symbols-outlined text-black dark:text-slate-200">arrow_back</span></button>
  <div class="flex-1 min-w-0">
    <h1 class="text-base font-bold text-black dark:text-white truncate">${e.clientName||"Cliente"}</h1>
    <p class="text-[10px] text-slate-500">Chat do Pedido</p>
  </div>
  <a href="tel:${e.clientPhone||""}" class="size-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center"><span class="material-symbols-outlined text-primary">call</span></a>
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
</div>`,t.querySelector("#bk").onclick=()=>u(K,e);const s=t.querySelector("#chat-msgs");function l(d){const p=d.from==="driver",v=new Date(d.timestamp).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),I=document.createElement("div");I.className=`flex ${p?"justify-end":"justify-start"}`;let $;d.type==="audio"&&d.audioData?$=`<audio controls src="${d.audioData}" style="max-width:220px;height:40px"></audio>`:$=`<p class="text-sm">${d.message}</p>`,I.innerHTML=`<div class="max-w-[80%] px-4 py-2.5 rounded-2xl ${p?"bg-primary text-black rounded-br-md":"bg-slate-100 dark:bg-white/10 text-black dark:text-white rounded-bl-md"}">${$}<p class="text-[9px] mt-1 ${p?"text-black/60":"text-slate-400"} text-right">${v}</p></div>`,s.appendChild(I),s.scrollTop=s.scrollHeight}n.emit("order-chat:get-history",{orderId:i}),n.once("order-chat:history",({messages:d})=>{d&&d.forEach(l)});const o=d=>{d.orderId===i&&l(d)};n.on("order-chat:new-message",o),t.querySelector("#chat-form").onsubmit=d=>{d.preventDefault();const p=t.querySelector("#chat-input"),v=p.value.trim();v&&(n.emit("order-chat:driver-to-client",{orderId:i,clientId:e.clientId,driverId:r.id,message:v,type:"text"}),l({from:"driver",message:v,type:"text",timestamp:new Date().toISOString()}),p.value="")};let a=null,m=[];const c=t.querySelector("#btn-audio"),x=t.querySelector("#recording-status"),f=t.querySelector("#btn-stop"),b=t.querySelector("#btn-cancel-audio");return c.onclick=async()=>{try{const d=await navigator.mediaDevices.getUserMedia({audio:!0});a=new MediaRecorder(d),m=[],a.ondataavailable=p=>{p.data.size>0&&m.push(p.data)},a.onstop=()=>{d.getTracks().forEach(p=>p.stop())},a.start(),x.classList.remove("hidden"),c.classList.add("hidden")}catch{alert("Não foi possível acessar o microfone.")}},f.onclick=()=>{!a||a.state!=="recording"||(a.onstop=()=>{a.stream.getTracks().forEach(v=>v.stop());const d=new Blob(m,{type:"audio/webm"}),p=new FileReader;p.onloadend=()=>{const v=p.result;n.emit("order-chat:driver-to-client",{orderId:i,clientId:e.clientId,driverId:r.id,type:"audio",audioData:v}),l({from:"driver",type:"audio",audioData:v,timestamp:new Date().toISOString()})},p.readAsDataURL(d),x.classList.add("hidden"),c.classList.remove("hidden")},a.stop())},b.onclick=()=>{a&&a.state==="recording"&&(a.onstop=()=>{a.stream.getTracks().forEach(d=>d.stop())},a.stop()),m=[],x.classList.add("hidden"),c.classList.remove("hidden")},t}function re(){if(B=document.getElementById("app-content"),q=document.getElementById("sidebar"),R=document.getElementById("sidebar-overlay"),!B||!R){console.error("CRITICAL: DOM elements not found.");return}R.onclick=W;const e=fe();e?(r=e,D(),A(),u(k)):u(Z)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",re):re();let y=null,N=null;function Te(e,t,i){P(),u(ne,{targetId:e,targetName:t,targetPhoto:i,incoming:!1})}function ne(e){const t=document.createElement("div");t.className="view active bg-slate-900 text-white",t.innerHTML=`
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
</div>`;const i=t.querySelector("#call-status"),s=t.querySelector("#remote-audio"),l=()=>{T.pause(),T.currentTime=0,N&&N.getTracks().forEach(a=>a.stop()),y&&y.close(),y=null,N=null},o=async()=>{if(y=new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"}]}),y.onicecandidate=a=>{a.candidate&&n.emit("call:signal",{targetId:e.targetId,signal:{ice:a.candidate}})},y.ontrack=a=>{s.srcObject=a.streams[0],i.textContent="Em Chamada",i.classList.remove("animate-pulse")},N=await navigator.mediaDevices.getUserMedia({audio:!0}),N.getTracks().forEach(a=>y.addTrack(a,N)),!e.incoming){const a=await y.createOffer();await y.setLocalDescription(a),n.emit("call:request",{targetId:e.targetId,userId:r.id,callerName:r.name,callerPhoto:r.photo}),n.emit("call:signal",{targetId:e.targetId,signal:{sdp:a}})}};return e.incoming&&(T.play(),t.querySelector("#btn-accept").onclick=async()=>{T.pause(),T.currentTime=0,await o(),n.emit("call:accept",{targetId:e.targetId})}),t.querySelector("#btn-hangup").onclick=()=>{n.emit("call:end",{targetId:e.targetId}),l(),u(k)},n.off("call:signal").on("call:signal",async({signal:a})=>{if(y||await o(),a.sdp){if(await y.setRemoteDescription(new RTCSessionDescription(a.sdp)),a.sdp.type==="offer"){const m=await y.createAnswer();await y.setLocalDescription(m),n.emit("call:signal",{targetId:e.targetId,signal:{sdp:m}})}}else a.ice&&await y.addIceCandidate(new RTCIceCandidate(a.ice))}),n.off("call:accepted").on("call:accepted",()=>{i.textContent="Em Chamada",i.classList.remove("animate-pulse")}),n.off("call:rejected").on("call:rejected",()=>{l(),u(k)}),n.off("call:ended").on("call:ended",()=>{l(),u(k)}),e.incoming||o(),t}function Ce(){n.on("call:incoming",e=>{P(),u(ne,{targetId:e.fromId,targetName:e.callerName,targetPhoto:e.callerPhoto,incoming:!0})})}const je=D;D=()=>{je(),Ce()};
