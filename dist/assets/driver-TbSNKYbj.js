import{O as Se,D as se,a as be,A as we}from"./api-H6lC6YHp.js";import{g as Me,i as Oe}from"./geo-Dl6lxGpH.js";let me,P,le,b,a,H,O,xe,re,Ee=null,Y=localStorage.getItem("movvi_weather")!=="off",G=localStorage.getItem("movvi_traffic")!=="off",q=localStorage.getItem("movvi_map_traffic")!=="off",K=localStorage.getItem("movvi_news")!=="off";const Ue="https://www.myinstants.com/media/sounds/uber.mp3",Ye="https://actions.google.com/sounds/v1/communications/incoming_phone_call.ogg",$=new Audio(Ue);$.loop=!0;$.volume=1;const U=new Audio(Ye);U.loop=!0;U.volume=1;function ie(){(()=>{$.play().then(()=>{$.pause(),$.currentTime=0,console.log("Audio unlocked")}).catch(t=>console.log("Audio unlock failed",t)),U.play().then(()=>{U.pause(),U.currentTime=0}).catch(()=>{})})()}const fe=()=>{ie(),document.removeEventListener("click",fe),document.removeEventListener("touchstart",fe)};document.addEventListener("click",fe,{once:!0});document.addEventListener("touchstart",fe,{once:!0});function Ge(){const e=new Date().getHours(),t=new Date().getDay(),s=t===0||t===6;let n,l,i;return s?e>=10&&e<=14?(n="moderado",l="Trânsito Moderado",i="Saídas para lazer podem causar lentidão"):e>=17&&e<=20?(n="moderado",l="Trânsito Moderado",i="Retorno do fim de semana"):(n="livre",l="Trânsito Livre",i="Vias com bom fluxo"):e>=7&&e<=9?(n="intenso",l="Trânsito Intenso",i="Horário de pico matutino"):e>=11&&e<=13?(n="moderado",l="Trânsito Moderado",i="Horário de almoço"):e>=17&&e<=19?(n="intenso",l="Trânsito Intenso",i="Horário de pico vespertino"):e>=20&&e<=22?(n="moderado",l="Trânsito Moderado",i="Fluxo moderado noturno"):(n="livre",l="Trânsito Livre",i="Vias com bom fluxo"),{level:n,label:l,tip:i,color:{livre:"#22c55e",moderado:"#eab308",intenso:"#ef4444"}[n]}}function R(e){a=e,localStorage.setItem("movvi_driver",JSON.stringify(e))}function Je(){try{return JSON.parse(localStorage.getItem("movvi_driver"))}catch{return null}}function x(e,t){Le(),Ee=e,me.innerHTML="";const s=e(t);me.appendChild(s),s.classList.add("fade-in")}function ge(){return`https://mt{s}.google.com/vt/lyrs=${q?"m,traffic":"m"}&x={x}&y={y}&z={z}`}function Ke(e){document.documentElement.classList.remove("dark"),localStorage.setItem("movvi_theme","light"),P&&V()}function _e(){const e=ge();O&&O.eachLayer(t=>{t instanceof L.TileLayer&&t.setUrl(e)})}Ke();const Xe={0:"Céu limpo",1:"Parcialmente limpo",2:"Parcialmente nublado",3:"Nublado",45:"Nevoeiro",48:"Nevoeiro gelado",51:"Garoa leve",53:"Garoa moderada",55:"Garoa densa",61:"Chuva leve",63:"Chuva moderada",65:"Chuva forte",71:"Neve leve",73:"Neve moderada",75:"Neve intensa",80:"Pancadas leves",81:"Pancadas moderadas",82:"Pancadas fortes",95:"Trovoada",96:"Trovoada com granizo leve",99:"Trovoada com granizo forte"};async function We(e,t){try{return await(await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${e}&longitude=${t}&current_weather=true&hourly=temperature_2m,weathercode&forecast_days=1&timezone=America%2FSao_Paulo`)).json()}catch{return null}}function V(){var r;let e=((r=a==null?void 0:a.name)==null?void 0:r.split(" ")[0])||"Motorista";e=e.replace(/\uFFFD/g,"ã").replace(/Joo/i,"João").replace(/Jo.?o/i,"João").replace(/Cambao/i,"Cambão"),P.innerHTML=`
    <div class="px-5 pt-12 pb-6 flex items-center justify-between border-b border-slate-200 dark:border-white/10">
      <div class="flex items-center gap-3">
        <div class="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30 overflow-hidden">
          ${a!=null&&a.photo?`<img src="${a.photo}" class="w-full h-full object-cover">`:'<span class="material-symbols-outlined text-lg">person</span>'}
        </div>
        <div>
          <h2 class="text-sm font-bold text-black font-bold dark:text-white">${e}</h2>
          <div class="flex items-center gap-2">
            <p class="text-[10px] ${(a.walletBalance||0)<0?"text-red-500":"text-slate-500"} font-black uppercase tracking-tighter">Saldo: R$ ${(a.walletBalance||0).toFixed(2).replace(".",",")}</p>
            ${a.blocked?'<span class="size-1.5 rounded-full bg-red-500 animate-pulse"></span>':""}
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
          <button id="weather-toggle" class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${Y?"bg-primary":"bg-slate-400 dark:bg-slate-600"}">
            <span class="${Y?"translate-x-4":"translate-x-0"} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200"></span>
          </button>
        </div>
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2 text-black font-bold dark:text-slate-300"><span class="material-symbols-outlined text-base">traffic</span><span class="text-xs font-semibold">Widget Info Trânsito</span></div>
          <button id="traffic-toggle" class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${G?"bg-primary":"bg-slate-400 dark:bg-slate-600"}">
            <span class="${G?"translate-x-4":"translate-x-0"} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200"></span>
          </button>
        </div>
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2 text-black font-bold dark:text-slate-300"><span class="material-symbols-outlined text-base">layers</span><span class="text-xs font-semibold">Camada Trânsito (Mapa)</span></div>
          <button id="map-traffic-toggle" class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${q?"bg-primary":"bg-slate-400 dark:bg-slate-600"}">
            <span class="${q?"translate-x-4":"translate-x-0"} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200"></span>
          </button>
        </div>
        <div class="flex items-center justify-between px-2 py-2">
          <div class="flex items-center gap-2 text-black font-bold dark:text-slate-300"><span class="material-symbols-outlined text-base">newspaper</span><span class="text-xs font-semibold">Notícias da Cidade</span></div>
          <button id="news-toggle" class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${K?"bg-primary":"bg-slate-400 dark:bg-slate-600"}">
            <span class="${K?"translate-x-4":"translate-x-0"} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200"></span>
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
    </div>`,P.querySelectorAll("[data-nav]").forEach(c=>{c.onclick=()=>{ie();const o=c.dataset.nav;o==="dash"?x(I):o==="earn"?x(Re):o==="history"?x(Qe):o==="profile"?x(et):o==="support"?x(tt):o==="logout"&&(b==null||b.emit("driver:offline",a.id),b==null||b.disconnect(),localStorage.removeItem("movvi_driver"),x(ve))}}),P.querySelector(".sidebar-close").onclick=Le;const t=P.querySelector("#weather-toggle");t&&(t.onclick=()=>{Y=!Y,localStorage.setItem("movvi_weather",Y?"on":"off"),V()});const s=P.querySelector("#traffic-toggle");s&&(s.onclick=()=>{G=!G,localStorage.setItem("movvi_traffic",G?"on":"off"),V()});const n=P.querySelector("#map-traffic-toggle");n&&(n.onclick=()=>{q=!q,localStorage.setItem("movvi_map_traffic",q?"on":"off"),V(),_e()});const l=P.querySelector("#news-toggle");l&&(l.onclick=()=>{K=!K,localStorage.setItem("movvi_news",K?"on":"off"),V()});const i=P.querySelector("#btn-sound-test");i&&(i.onclick=()=>{$.currentTime=0,$.play().then(()=>{setTimeout(()=>{$.pause(),$.currentTime=0},2e3)}).catch(()=>alert("Áudio bloqueado! Clique em qualquer lugar e tente novamente."))})}function Ae(){const e=document.createElement("div");e.id="debt-modal-overlay",e.className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in",e.innerHTML=`
    <div class="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-white/10 animate-scale-up">
      <div class="flex flex-col items-center text-center">
        <div class="size-20 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-6 shadow-inner">
          <span class="material-symbols-outlined text-4xl">account_balance_wallet</span>
        </div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-2 italic">SALDO BLOQUEADO</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
          Sua conta atingiu o limite de débito operacional de <span class="text-red-500 font-bold">R$ -50,00</span>.
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
          <button id="modal-pay" class="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-sm uppercase tracking-widest border border-white/5">
            Pagar via PIX Agora
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
  `,document.body.appendChild(e),e.querySelector("#modal-request-release").onclick=()=>{b.emit("chat:driver-to-admin",{driverId:a.id,message:`⚠️ *SOLICITAÇÃO DE LIBERAÇÃO*

Por favor, peço a liberação do meu acesso na ferramenta após pagamento do débito pendente.`});const t=e.querySelector("#modal-request-release");t.innerHTML='<span class="material-symbols-outlined text-[18px]">check_circle</span> Solicitação Enviada',t.classList.add("opacity-70","pointer-events-none")},e.querySelector("#modal-check").onclick=async()=>{const t=e.querySelector("#modal-check");t.innerHTML='<div class="size-5 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>';try{const s=await se.get(a.id);a.blocked=s.blocked,a.walletBalance=s.walletBalance,R(a),!a.blocked&&a.walletBalance>-50?(e.remove(),x(I)):(t.innerHTML="Ainda Bloqueado",setTimeout(()=>t.innerHTML="Verificar Novamente",2e3))}catch{t.innerHTML="Erro ao Sincronizar",setTimeout(()=>t.innerHTML="Verificar Novamente",2e3)}},e.querySelector("#modal-pay").onclick=()=>{e.remove(),x(Re)},e.querySelector("#modal-close").onclick=()=>{e.remove()}}function de(){P.classList.add("open"),le.classList.add("open")}function Le(){P.classList.remove("open"),le.classList.remove("open")}function ce(){b||(b=io(),b.on("connect",()=>{a&&(b.emit("register:driver",a.id),a.online&&(b.emit("driver:online",a.id),Pe()))}),b.on("driver:online:error",e=>{e.error==="DEBT_BLOCK"&&(a.online=!1,a.blocked=!0,R(a),Ae(),x(I))}),b.on("driver:data-updated",e=>{console.log("[Socket] Driver data updated from server:",e),a.blocked=e.blocked,a.walletBalance=e.walletBalance,R(a);const t=document.getElementById("debt-modal-overlay");!a.blocked&&(a.walletBalance||0)>-50&&t&&(t.remove(),Ee===I&&x(I))}),setInterval(()=>{b&&b.connected&&a&&a.online&&(b.emit("driver:online",a.id),Me().then(e=>{b.emit("driver:location",{driverId:a.id,latitude:e.latitude,longitude:e.longitude})}).catch(()=>{}))},1e4),b.on("order:incoming",e=>{H||x(Ze,e)}),b.on("order:timeout",()=>{clearInterval(re),$.pause(),$.currentTime=0,H||x(I)}),b.on("order:status",({orderId:e,status:t})=>{t==="cancelled"?($.pause(),$.currentTime=0,clearInterval(re),H=null,x(I)):H&&(H.orderId===e||H.id===e)&&(H.status=t,t==="completed"&&x(Ne,H))}),b.on("order-chat:new-message",e=>{const t=document.getElementById("btn-chat");t&&!document.getElementById("chat-msgs")&&(document.getElementById("chat-dot")||(t.style.position="relative",t.innerHTML+='<div id="chat-dot" class="absolute -top-1 -right-1 size-3.5 bg-red-500 rounded-full border-2 border-white dark:border-background-dark animate-pulse"></div>'))}),Oe(({latitude:e,longitude:t})=>{a.online&&b.emit("driver:location",{driverId:a.id,latitude:e,longitude:t}),xe&&xe.setLatLng([e,t]),O&&O.panTo([e,t])}))}async function Pe(){try{const e=await Se.list({driverId:a.id,status:"accepted,pickup,in_progress"});if(e&&e.length>0){const t=e[0];H={orderId:t.id,...t},x(Ce,H)}else x(I)}catch(e){console.error("Erro checkActiveOrder:",e)}}function ve(){const t=new URLSearchParams(window.location.search).get("invite")==="pioneer",s=document.createElement("div");return s.className="view active",s.style.background="#FFD900",s.innerHTML=`
<div class="flex flex-col relative overflow-hidden" style="min-height:100dvh;font-family:Outfit,Inter,sans-serif">
  <!-- Yellow brand hero top -->
  <div class="bg-[#FFD900] relative overflow-hidden px-6 pt-14 pb-12 flex flex-col items-center text-center" style="animation:fadeUpIn 0.5s ease-out forwards">
    <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(135deg,rgba(0,0,0,0.03) 0%,transparent 50%,rgba(255,255,255,0.06) 100%)"></div>
    ${t?'<div class="bg-black/10 backdrop-blur-sm border border-black/20 rounded-full py-1.5 px-4 mb-6 text-[9px] font-black uppercase tracking-[0.2em] text-black">Fase 01: Parceiro Pioneiro</div>':""}
    <img src="/assets/images/logo_movvi.png" alt="Movvi Resgate" class="w-64 h-auto object-contain relative z-10 mb-2 drop-shadow-lg">
    <h1 class="text-[#1a1400] text-xl font-black italic uppercase tracking-[0.15em] relative z-10 mt-1">Motorista Parceiro</h1>
    <p class="text-[#1a1400]/40 text-[11px] font-bold uppercase tracking-widest relative z-10 mt-1">Conectando você a novos resgates</p>
  </div>

  <!-- Form section -->
  <div class="flex-1 bg-[#fafaf7] dark:bg-[#111] rounded-t-[40px] -mt-8 relative z-10 px-6 pt-12 pb-8 flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.1)]" style="animation:fadeUpIn 0.5s ease-out 0.1s forwards;opacity:0">
    <form id="lf" class="flex flex-col gap-6 w-full max-w-sm mx-auto flex-1">
      <div class="flex flex-col gap-2">
        <label class="text-[#1a1400] dark:text-white/70 text-[11px] font-black uppercase tracking-widest pl-1">Acesso à Plataforma</label>
        <div class="relative group">
          <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-[#1a1400]/30 dark:text-white/20 transition-colors group-focus-within:text-primary"><span class="material-symbols-outlined text-[20px]">mail</span></span>
          <input class="form-input w-full bg-white dark:bg-white/[0.03] border-2 border-[#eee] dark:border-white/5 text-[#1a1400] dark:text-white placeholder-[#aaa] dark:placeholder-white/10 pl-12 py-4 text-[15px] font-semibold rounded-2xl focus:border-primary focus:ring-0 outline-none transition-all shadow-sm" id="le" type="email" placeholder="motorista@movvi.com" />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex justify-between items-center">
          <label class="text-[#1a1400] dark:text-white/70 text-[11px] font-black uppercase tracking-widest pl-1">Sua Senha</label>
          <a id="forgot-pw" class="text-[11px] text-primary font-black uppercase tracking-wider cursor-pointer hover:underline transition-all pr-1">Esqueceu?</a>
        </div>
        <div class="relative group">
          <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-[#1a1400]/30 dark:text-white/20 transition-colors group-focus-within:text-primary"><span class="material-symbols-outlined text-[20px]">lock</span></span>
          <input class="form-input w-full bg-white dark:bg-white/[0.03] border-2 border-[#eee] dark:border-white/5 text-[#1a1400] dark:text-white placeholder-[#aaa] dark:placeholder-white/10 pl-12 py-4 text-[15px] font-semibold rounded-2xl focus:border-primary focus:ring-0 outline-none transition-all shadow-sm" id="lp" type="password" placeholder="••••••" />
        </div>
      </div>
      <div id="le-err" class="text-red-500 text-[11px] font-bold hidden bg-red-50 p-3 rounded-lg border border-red-100 italic"></div>
      <button type="submit" class="w-full bg-[#1a1400] text-white font-black py-5 text-[14px] uppercase tracking-[0.1em] rounded-2xl shadow-xl hover:shadow-[#1a1400]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-2">
        <span>Acessar Painel</span>
        <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
      </button>
    </form>

    <div class="text-center mt-10" style="animation:fadeUpIn 0.5s ease-out 0.25s forwards;opacity:0">
      <p class="text-[#1a1400]/40 dark:text-white/20 text-[13px] font-bold uppercase tracking-wider">Ainda não é parceiro? <br><a id="go-reg" class="text-primary font-black text-base cursor-pointer hover:underline underline-offset-4 transition-all mt-2 block">Solicitar Cadastro</a></p>
    </div>
  </div>
</div>
<style>
  @keyframes fadeUpIn { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
</style>`,s.querySelector("#lf").onsubmit=async n=>{n.preventDefault(),ie();try{const{user:l}=await we.loginDriver(s.querySelector("#le").value,s.querySelector("#lp").value);R(l),ce(),V(),!l.approved&&l.onboardingStep!=="approved"?x(ne):x(I)}catch(l){const i=s.querySelector("#le-err");i.textContent=l.message,i.classList.remove("hidden")}},s.querySelector("#go-reg").onclick=()=>x(He),s.querySelector("#forgot-pw").onclick=async()=>{const n=window.prompt("Para redefinir sua senha, informe seu email:");if(n)try{await we.forgotPasswordDriver(n),window.alert(`Um link de recuperação de senha foi enviado para ${n}. Verifique sua caixa de entrada.`)}catch(l){window.alert(l.message||"Erro ao tentar redefinir senha.")}},s}function He(){const e=document.createElement("div");return e.className="view active bg-white dark:bg-[#111]",e.innerHTML=`
<div class="flex flex-col relative overflow-hidden" style="min-height:100dvh;font-family:Outfit,Inter,sans-serif">
  <header class="flex items-center p-6 border-b border-slate-100 dark:border-white/5 sticky top-0 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md z-10">
    <button id="bk" class="size-11 rounded-2xl bg-[#FFD900]/10 flex items-center justify-center text-primary active:scale-90 transition-all shadow-sm"><span class="material-symbols-outlined font-black">arrow_back</span></button>
    <div class="flex-1 text-center">
      <h1 class="text-[#1a1400] dark:text-white text-base font-black italic uppercase tracking-widest pl-4">Novo Parceiro</h1>
      <p class="text-[9px] text-[#aaa] font-bold uppercase tracking-widest pl-4">Fase 01 Pionerismos</p>
    </div>
    <div class="size-11"></div>
  </header>
  <main class="flex-1 p-6 pb-24 max-w-sm mx-auto w-full">
    <div class="mb-8 p-5 bg-primary/5 border-2 border-primary/20 rounded-[2rem] relative overflow-hidden">
      <div class="absolute top-0 right-0 p-4 opacity-10">
        <span class="material-symbols-outlined text-4xl">trending_up</span>
      </div>
      <p class="text-[12px] text-[#1a1400]/80 dark:text-primary/80 font-bold leading-relaxed relative z-10">
        Entre para o grupo de elite que vai atender <span class="text-primary dark:text-primary font-black">1.200 chamados diários</span> no Rio. 
        <strong class="text-[#1a1400] dark:text-white block mt-2 text-[10px] uppercase tracking-widest bg-primary/20 py-1 px-3 rounded-full w-fit">Vagas Limitadas: 14/100</strong>
      </p>
    </div>

    <form id="rf" class="flex flex-col gap-5">
      <div class="flex flex-col gap-1.5 focus-within:translate-x-1 transition-transform">
        <label class="text-[#1a1400]/40 dark:text-white/30 text-[10px] font-black uppercase tracking-widest pl-1">Identificação Pessoal</label>
        <div class="relative group">
          <input id="rn" class="form-input w-full rounded-2xl bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/5 text-[#1a1400] dark:text-white py-4 px-4 font-bold text-sm focus:border-primary transition-all shadow-sm" placeholder="Nome Completo" required/>
        </div>
      </div>
      
      <div class="flex flex-col gap-1.5 focus-within:translate-x-1 transition-transform">
        <label class="text-[#1a1400]/40 dark:text-white/30 text-[10px] font-black uppercase tracking-widest pl-1">Contato e Pagamento</label>
        <div class="grid grid-cols-2 gap-3">
          <input id="re" type="email" class="form-input w-full rounded-2xl bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/5 text-[#1a1400] dark:text-white py-4 px-4 font-bold text-sm focus:border-primary transition-all shadow-sm" placeholder="E-mail" required/>
          <input id="rph" class="form-input w-full rounded-2xl bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/5 text-[#1a1400] dark:text-white py-4 px-4 font-bold text-sm focus:border-primary transition-all shadow-sm" placeholder="WhatsApp"/>
        </div>
        <input id="rpix" class="form-input w-full rounded-2xl bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/5 text-[#1a1400] dark:text-white py-4 px-4 font-bold text-sm focus:border-primary transition-all shadow-sm mt-1" placeholder="Chave PIX (Para Recebimentos)"/>
      </div>

      <div class="flex flex-col gap-1.5 focus-within:translate-x-1 transition-transform">
        <label class="text-[#1a1400]/40 dark:text-white/30 text-[10px] font-black uppercase tracking-widest pl-1">Informações do Veículo</label>
        <div class="grid grid-cols-2 gap-3">
          <input id="rv" class="form-input w-full rounded-2xl bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/5 text-[#1a1400] dark:text-white py-4 px-4 font-bold text-sm focus:border-primary transition-all shadow-sm" placeholder="Modelo (Ex: Spin)" required/>
          <input id="rpl" class="form-input w-full rounded-2xl bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/5 text-[#1a1400] dark:text-white py-4 px-4 font-bold text-sm focus:border-primary transition-all shadow-sm" placeholder="Placa" required/>
        </div>
      </div>

      <div class="flex flex-col gap-1.5 focus-within:translate-x-1 transition-transform">
        <label class="text-[#1a1400]/40 dark:text-white/30 text-[10px] font-black uppercase tracking-widest pl-1">Segurança</label>
        <input id="rp" type="password" class="form-input w-full rounded-2xl bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/5 text-[#1a1400] dark:text-white py-4 px-4 font-bold text-sm focus:border-primary transition-all shadow-sm" placeholder="Crie uma Senha Forte" required/>
      </div>

      <div id="re-err" class="text-red-500 text-[11px] font-bold hidden bg-red-50 p-3 rounded-xl border border-red-100 italic"></div>
      
      <button type="submit" class="w-full bg-[#1a1400] text-white font-black py-5 rounded-2xl shadow-xl shadow-[#1a1400]/10 mt-4 active:scale-[0.98] transition-all uppercase tracking-widest text-[14px] flex items-center justify-center gap-3">
        <span>Criar Minha Conta</span>
        <span class="material-symbols-outlined text-[20px]">how_to_reg</span>
      </button>
    </form>
    
    <p class="text-center text-[11px] text-[#aaa] font-semibold mt-10 px-4">
      Ao se registrar, você concorda com nossos <a class="text-[#1a1400] dark:text-white underline">Termos de Uso</a> e <a class="text-[#1a1400] dark:text-white underline">Políticas</a> de parceiro pioneiro.
    </p>
  </main>
</div>`,e.querySelector("#bk").onclick=()=>x(ve),e.querySelector("#rf").onsubmit=async t=>{t.preventDefault();try{const{user:s}=await we.registerDriver({name:e.querySelector("#rn").value,email:e.querySelector("#re").value,phone:e.querySelector("#rph").value,pixKey:e.querySelector("#rpix").value,vehicle:e.querySelector("#rv").value,plate:e.querySelector("#rpl").value,password:e.querySelector("#rp").value});R(s),ce(),V(),!s.approved&&s.onboardingStep!=="approved"?x(ne):x(I)}catch(s){const n=e.querySelector("#re-err");n.textContent=s.message,n.classList.remove("hidden")}},e}function ne(){const e=document.createElement("div");e.className="view active bg-background-light dark:bg-background-dark";const t=a.onboardingStep||"documents",s=()=>`
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
  `,n=()=>`
    <div class="animate-fade-in">
      <div class="flex items-center gap-3 mb-6">
        <div class="size-12 rounded-2xl bg-primary flex items-center justify-center text-black shadow-lg shadow-primary/20">
          <span class="material-symbols-outlined font-black">inventory_2</span>
        </div>
        <div>
          <h2 class="text-xl font-black text-[#1a1400] dark:text-white uppercase italic tracking-tighter">O Kit Oficial</h2>
          <p class="text-[10px] text-primary font-black uppercase tracking-widest leading-none">Fase Pioneira 01</p>
        </div>
      </div>

      <p class="text-sm text-[#1a1400]/60 dark:text-slate-400 font-bold mb-6 leading-relaxed">Para iniciar suas operações e garantir a segurança dos resgates, você precisa adquirir o <span class="text-[#1a1400] dark:text-white underline underline-offset-2">Kit Movvi Heavy Duty</span>.</p>
      
      <div class="bg-white dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/5 p-6 rounded-[2rem] mb-8 shadow-sm">
         <h3 class="font-black text-[11px] uppercase tracking-widest text-[#1a1400]/40 dark:text-white/30 mb-4 border-b border-slate-50 dark:border-white/5 pb-3">Hardwares Inclusos:</h3>
         <ul class="flex flex-col gap-4 mb-8">
           <li class="flex items-start gap-3">
              <div class="size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5 shrink-0"><span class="material-symbols-outlined text-sm font-black">check</span></div>
              <div>
                <p class="text-[13px] font-black text-[#1a1400] dark:text-white leading-none mb-1">Cambão Articulado</p>
                <p class="text-[10px] text-[#aaa] font-bold">Aço Carbono reforçado (padrão reboque)</p>
              </div>
           </li>
           <li class="flex items-start gap-3">
              <div class="size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5 shrink-0"><span class="material-symbols-outlined text-sm font-black">check</span></div>
              <div>
                <p class="text-[13px] font-black text-[#1a1400] dark:text-white leading-none mb-1">Cabos Heavy Duty</p>
                <p class="text-[10px] text-[#aaa] font-bold">Para transferência de carga entre baterias</p>
              </div>
           </li>
           <li class="flex items-start gap-3">
              <div class="size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5 shrink-0"><span class="material-symbols-outlined text-sm font-black">check</span></div>
              <div>
                <p class="text-[13px] font-black text-[#1a1400] dark:text-white leading-none mb-1">Reparador & Galão</p>
                <p class="text-[10px] text-[#aaa] font-bold">Spray para furos e bombona de combustível</p>
              </div>
           </li>
         </ul>
         
         <div class="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-black rounded-3xl border border-slate-100 dark:border-white/5">
           <span class="text-[9px] uppercase font-black text-[#aaa] mb-2 tracking-[0.2em]">Investimento Vitalício</span>
           <div class="flex items-baseline gap-1">
             <span class="text-sm font-bold text-[#1a1400] dark:text-white opacity-40">R$</span>
             <span class="text-4xl font-black text-[#1a1400] dark:text-white tracking-tighter">399,00</span>
           </div>
           <p class="text-[9px] text-primary font-black uppercase mt-3">Taxa Única • Sem Mensalidade</p>
         </div>
      </div>

      <button id="btn-pay" class="w-full bg-[#1a1400] text-white font-black py-5 flex flex-col items-center justify-center rounded-2xl shadow-2xl shadow-[#1a1400]/20 active:scale-[0.98] transition-all group overflow-hidden relative">
        <div class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <span class="uppercase tracking-widest text-[14px] mb-0.5 flex items-center gap-2 relative z-10"><span class="material-symbols-outlined text-[18px]">bolt</span> Adquirir via PIX</span>
        <span class="text-[9px] opacity-50 font-bold uppercase tracking-widest relative z-10">Liberação imediata em sistema</span>
      </button>
      
      <p class="text-center text-[10px] font-bold text-[#aaa] mt-6 px-4 uppercase tracking-tighter">
        Ao adquirir, você também garante sua <span class="text-[#1a1400] dark:text-white">Homologação Vitalícia</span> como motorista de resgate.
      </p>
    </div>
    
    <!-- Modal do PIX -->
    <div id="pix-modal" class="hidden fixed inset-0 z-50 bg-[#1a1400]/95 backdrop-blur-xl flex items-center justify-center p-6 transition-all duration-300">
      <div id="pix-modal-content" class="bg-white dark:bg-[#111] w-full max-w-sm rounded-[3rem] p-8 flex flex-col items-center text-center scale-95 transition-transform duration-300 shadow-2xl">
        <div class="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
          <span class="material-symbols-outlined text-3xl font-black">qr_code_2</span>
        </div>
        <h3 class="font-black text-2xl text-[#1a1400] dark:text-white mb-2 uppercase italic tracking-tighter">Pagamento Seguro</h3>
        <p class="text-xs font-bold text-slate-400 mb-8 max-w-[240px]">Escaneie o QR Code abaixo no app do seu banco ou use a chave Copia e Cola.</p>
        
        <div class="bg-white p-6 rounded-[2rem] mb-8 flex justify-center w-full shadow-inner border border-slate-50">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126460014BR.GOV.BCB.PIX011112345678900209Kit%20Movvi5204000053039865406399.005802BR5913Movvi%20Resgate6009Sao%20Paulo62070503***6304" alt="QR Code PIX" class="w-48 h-48 rounded-2xl">
        </div>

        <div class="flex flex-col gap-3 w-full">
          <button id="btn-copy-pix" class="w-full bg-primary text-black font-black py-4 rounded-2xl active:scale-95 transition-all text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20">Copiar Código PIX</button>
          <button id="btn-cancel-pix" class="w-full text-red-500 font-bold py-3 text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Cancelar Operação</button>
        </div>
      </div>
    </div>
  `,l=()=>`
    <div class="flex flex-col items-center justify-center text-center py-12 px-2">
      <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-6">
        <span class="material-symbols-outlined text-[40px]">check</span>
      </div>
      <h2 class="text-2xl font-black text-[#1a1400] dark:text-white mb-3">Tudo Certo!</h2>
      <p class="text-[15px] font-medium text-[#1a1400]/60 dark:text-slate-400 mb-8 leading-relaxed">O pagamento do seu Kit Resgate foi confirmado via <strong class="text-primary">C6 Bank Webhook</strong>. <strong class="text-[#1a1400] dark:text-white">Seu acesso será liberado assim que o Kit for entregue, conforme as regras da plataforma.</strong></p>
      <button id="btn-refresh" class="w-full bg-[#fafaf7] dark:bg-[#201d10] border-2 border-slate-200 dark:border-white/10 text-[#1a1400] dark:text-white font-bold py-4 rounded-xl active:scale-[0.98] transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2"><span class="material-symbols-outlined text-[18px]">refresh</span> Atualizar Status</button>
      <button id="btn-logout" class="mt-6 text-sm font-bold text-red-500">Sair ou Entrar com outra conta</button>
    </div>
  `;return e.innerHTML=`
    <header class="flex items-center justify-center p-5 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-white/80 dark:bg-[#1a1706]/80 backdrop-blur-md z-10 w-full">
      <img src="/assets/images/logo_movvi.png" alt="Movvi Resgate" class="h-6 object-contain drop-shadow-sm">
    </header>
    <main class="w-full max-w-md mx-auto p-6 pb-24 flex flex-col items-stretch" id="ob-container">
      ${t==="documents"?s():t==="kit"?n():l()}
    </main>
  `,setTimeout(()=>{t==="documents"?e.querySelector("#docs-form").onsubmit=async i=>{i.preventDefault();try{await se.update(a.id,{onboardingStep:"kit",cnhStatus:"submitted",crlvStatus:"submitted"}),a.onboardingStep="kit",R(a),x(ne)}catch(r){alert(r.message)}}:t==="kit"?(e.querySelector("#btn-pay").onclick=async()=>{const i=e.querySelector("#btn-pay"),r=i.innerHTML;i.innerHTML='<div class="size-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>';try{const c=await be(`/drivers/${a.id}/pix/generate`,"POST",{amount:399,reason:"kit"}),o=e.querySelector("#pix-modal");o.querySelector("img").src=`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(c.pixCopiaECola)}`,o.classList.remove("hidden"),setTimeout(()=>o.querySelector("#pix-modal-content").classList.replace("scale-95","scale-100"),10),o.querySelector("#btn-copy-pix").onclick=()=>{navigator.clipboard.writeText(c.pixCopiaECola);const v=o.querySelector("#btn-copy-pix");v.textContent="Chave PIX Copiada!",v.classList.add("opacity-50"),setTimeout(()=>{v.textContent="Copiar Código PIX",v.classList.remove("opacity-50")},2e3)}}catch{alert("Erro ao gerar pagamento. Verifique sua conexão.")}finally{i.innerHTML=r}},e.querySelector("#btn-cancel-pix").onclick=()=>e.querySelector("#pix-modal").classList.add("hidden")):(e.querySelector("#btn-refresh").onclick=async()=>{try{const i=await se.get(a.id);R(i),i.approved?x(I):(alert("Sua conta ainda está em análise. Fique de olho, em breve você estará online!"),x(ne))}catch{}},e.querySelector("#btn-request-release").onclick=()=>{b.emit("chat:driver-to-admin",{driverId:a.id,message:`⚠️ *NOVO CANDIDATO - SOLICITAÇÃO DE LIBERAÇÃO*

Já paguei pelo Kit Resgate e estou aguardando a liberação na plataforma.`});const i=e.querySelector("#btn-request-release");i.innerHTML='<span class="material-symbols-outlined text-[18px]">check_circle</span> Solicitação Enviada',i.classList.add("opacity-70","pointer-events-none")},e.querySelector("#btn-logout").onclick=()=>{localStorage.removeItem("movvi_driver"),a=null,x(ve)})},0),e}function I(){const e=document.createElement("div");e.className="view active";const t=a.online||!1;e.innerHTML=`
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
          <div class="size-9 rounded-xl ${t?"bg-green-100 dark:bg-green-500/20":"bg-primary/10 dark:bg-primary/20"} flex items-center justify-center ${t?"text-green-600 dark:text-green-400":"text-primary"}">
            <span class="material-symbols-outlined text-lg">${t?"radar":"car_repair"}</span>
          </div>
          <div>
            <p id="city-name" class="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Localizando...</p>
            <p class="text-sm font-black text-slate-900 dark:text-white leading-tight">${t?"Buscando Resgate":"Sem chamados"}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span id="sheet-arrow" class="material-symbols-outlined text-slate-300 text-sm transition-transform duration-300">expand_more</span>
          <div class="h-2.5 w-2.5 rounded-full ${t?"bg-green-500 dark:bg-green-400":"bg-primary"} animate-pulse"></div>
        </div>
      </div>

      <!-- Collapsible Content -->
      <div id="sheet-details">
        <!-- Info Cards Row -->
        <div id="info-cards" class="grid gap-2.5" style="grid-template-columns: ${G&&Y?"1fr 1fr":"1fr"};">
          ${G?`
          <div id="traffic-card" class="relative overflow-hidden rounded-2xl p-4" style="background:linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%);">
            <div class="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10" style="background:radial-gradient(circle,#22c55e,transparent);transform:translate(30%,-30%)"></div>
            <div class="flex items-center gap-1.5 mb-2">
              <div id="traffic-indicator" class="size-2 rounded-full bg-green-500 animate-pulse"></div>
              <span class="text-[8px] font-black uppercase tracking-[0.2em] text-green-700/60">Trânsito Agora</span>
            </div>
            <div class="flex items-baseline gap-1.5">
              <span id="traffic-emoji" class="text-lg leading-none">🟢</span>
              <p id="traffic-level" class="text-sm font-black text-green-800 leading-none">Livre</p>
            </div>
            <p id="traffic-tip" class="text-[10px] font-semibold text-green-700/70 mt-1.5 leading-snug line-clamp-2">Vias com bom fluxo</p>
            <div class="mt-2.5 h-1 rounded-full bg-green-200/60 overflow-hidden">
              <div id="traffic-fill" class="h-full rounded-full transition-all duration-700" style="width:33%;background:linear-gradient(90deg,#22c55e,#4ade80)"></div>
            </div>
          </div>`:""}

          ${Y?`
          <div id="weather-card" class="relative overflow-hidden rounded-2xl p-4" style="background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);">
            <div class="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10" style="background:radial-gradient(circle,#3b82f6,transparent);transform:translate(30%,-30%)"></div>
            <div class="flex items-center gap-1.5 mb-2">
              <span id="weather-icon-emoji" class="text-sm leading-none">⛅</span>
              <span class="text-[8px] font-black uppercase tracking-[0.2em] text-blue-700/60">Clima</span>
            </div>
            <div class="flex items-baseline gap-1">
              <p id="weather-temp" class="text-2xl font-black text-blue-900 leading-none tracking-tighter" style="font-feature-settings:'tnum'">--°</p>
            </div>
            <p id="weather-desc" class="text-[10px] font-bold text-blue-700/70 mt-1 leading-snug">Carregando...</p>
            <div id="weather-extra" class="flex items-center gap-2.5 mt-2">
              <div class="flex items-center gap-1 text-blue-600/50">
                <span class="material-symbols-outlined text-[11px]">air</span>
                <span id="weather-wind" class="text-[9px] font-bold">-- km/h</span>
              </div>
              <div id="weather-forecast" class="flex items-center gap-1.5 text-blue-600/50" style="scrollbar-width:none"></div>
            </div>
          </div>`:""}

          ${!G&&!Y?`
          <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50">
            <span class="material-symbols-outlined text-slate-300 text-lg">widgets</span>
            <p class="text-xs font-semibold text-slate-400">${t?"Aguardando solicitações...":"Ative os widgets no menu lateral"}</p>
          </div>`:""}
        </div>

        ${K?`
        <div id="news-section" class="mt-3">
          <div class="flex items-center gap-2 mb-2 px-0.5">
            <div class="bg-red-500 rounded-md px-1.5 py-0.5"><span class="text-[9px] font-black text-white tracking-wide">G1</span></div>
            <span class="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">Notícias de Hoje</span>
            <div class="flex-1"></div>
            <div id="news-loading" class="size-3 border border-slate-300 border-t-red-500 rounded-full animate-spin"></div>
            <span id="news-counter" class="text-[8px] font-bold text-slate-300 hidden">1/1</span>
          </div>
          <div id="news-ticker" class="relative overflow-hidden" style="min-height:48px">
            <div id="news-item" class="transition-all duration-500 ease-out" style="opacity:1;transform:translateY(0)">
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-100"><p class="text-[11px] text-slate-400 font-semibold">Carregando notícias...</p></div>
            </div>
          </div>
        </div>`:""}
      </div>
    </div>
  </section>
</div>`,e.querySelector("#btn-menu").onclick=de,e.querySelector("#bottom-sheet");const s=e.querySelector("#sheet-details"),n=e.querySelector("#sheet-arrow"),l=e.querySelector("#sheet-handle");let i=!1;function r(){i=!0,s&&(s.style.maxHeight="0px",s.style.opacity="0",s.style.overflow="hidden"),n&&(n.style.transform="rotate(180deg)")}function c(){i=!1,s&&(s.style.maxHeight="600px",s.style.opacity="1",s.style.overflow="visible"),n&&(n.style.transform="rotate(0deg)")}if(l){let m=0,f=!1;const u=d=>{m=d.touches?d.touches[0].clientY:d.clientY,f=!0},p=d=>{if(!f)return;f=!1;const S=(d.changedTouches?d.changedTouches[0].clientY:d.clientY)-m;S>30?r():S<-30&&c()};l.addEventListener("touchstart",u,{passive:!0}),l.addEventListener("touchend",p,{passive:!0}),l.addEventListener("mousedown",u),l.addEventListener("mouseup",p),l.onclick=()=>{i?c():r()}}s&&(s.style.maxHeight="600px",s.style.transition="max-height 0.3s ease, opacity 0.3s ease"),e.querySelector("#toggle").onclick=async()=>{ie();try{const m=await se.get(a.id);a.blocked=m.blocked,a.walletBalance=m.walletBalance,R(a)}catch{}if(!a.online&&(a.blocked||(a.walletBalance||0)<=-50)){Ae();return}a.online=!a.online,R(a),b.emit(a.online?"driver:online":"driver:offline",a.id),window.location.reload()},setTimeout(()=>{const m=e.querySelector("#dmap");if(!m)return;const f=(a==null?void 0:a.latitude)||-23.55,u=(a==null?void 0:a.longitude)||-46.63,p=t?15:13;O=L.map(m,{zoomControl:!1,attributionControl:!1}).setView([f,u],p),L.tileLayer(ge(),{subdomains:["0","1","2","3"]}).addTo(O),Me().then(d=>{O.flyTo([d.latitude,d.longitude],p,{duration:1.5}),fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${d.latitude}&lon=${d.longitude}&addressdetails=1`).then(k=>k.json()).then(k=>{const y=k.address||{},M=y.city||y.town||y.village||y.municipality||"Rio de Janeiro",C=y.neighbourhood||y.suburb||"";o=M;const E=e.querySelector("#city-name");E&&(E.textContent=[C,M].filter(Boolean).join(" • ")||"Região desconhecida"),K&&v()}).catch(()=>{const k=e.querySelector("#city-name");k&&(k.textContent="GPS ativo"),o="Rio de Janeiro",K&&v()});const h=t?`<div style="position:absolute;left:0;top:0;pointer-events:none">
            <div style="position:absolute;left:-200px;top:-200px;width:400px;height:400px;border-radius:50%;background:rgba(59,130,246,0.06);animation:pulseRadar 3s ease-out infinite"></div>
            <div style="position:absolute;left:-125px;top:-125px;width:250px;height:250px;border-radius:50%;background:rgba(59,130,246,0.10);animation:pulseRadar 3s ease-out infinite 0.7s"></div>
            <div style="position:absolute;left:-60px;top:-60px;width:120px;height:120px;border-radius:50%;background:rgba(59,130,246,0.15);animation:pulseRadar 3s ease-out infinite 1.4s"></div>
            <div style="position:absolute;left:-8px;top:-8px;width:16px;height:16px;border-radius:50%;background:#3b82f6;box-shadow:0 0 10px rgba(59,130,246,0.8);z-index:2; border:2px solid white"></div>
          </div>
            <style>
              @keyframes pulseRadar { 0% { transform: scale(0); opacity: 1; } 100% { transform:scale(1.5);opacity:0; } }
            </style>`:`<div style="position:absolute;left:0;top:0;pointer-events:none">
            <div style="position:absolute;left:-8px;top:-8px;width:16px;height:16px;border-radius:50%;background:#94a3b8;border:3px solid white;box-shadow:0 0 8px rgba(0,0,0,0.15);z-index:2"></div>
           </div>`;xe=L.marker([d.latitude,d.longitude],{icon:L.divIcon({className:"",html:h,iconSize:[0,0],iconAnchor:[0,0]})}).addTo(O),e.querySelector("#btn-recenter").onclick=()=>{const k=xe.getLatLng();O.flyTo(k,p,{duration:.8})};const S=e.querySelector("#btn-traffic-dash");if(S&&(S.onclick=()=>{q=!q,localStorage.setItem("movvi_map_traffic",q?"on":"off"),S.innerHTML=`<span class="material-symbols-outlined">${q?"traffic":"layers"}</span>`,S.className=`bg-white/90 dark:bg-background-dark/80 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-300 dark:border-primary/20 transition-all ${q?"text-blue-500":"text-slate-400"}`,_e(),P&&V()}),G){const k=Ge(),y=e.querySelector("#traffic-card"),M=e.querySelector("#traffic-level"),C=e.querySelector("#traffic-tip"),E=e.querySelector("#traffic-indicator"),j=e.querySelector("#traffic-emoji"),B=e.querySelector("#traffic-fill"),D={livre:{emoji:"🟢",bg:"linear-gradient(135deg,#f0fdf4,#dcfce7)",dotColor:"#22c55e",fillBg:"linear-gradient(90deg,#22c55e,#4ade80)",width:"33%",labelCls:"text-sm font-black text-green-800 leading-none",tipCls:"text-[10px] font-semibold text-green-700/70 mt-1.5 leading-snug line-clamp-2"},moderado:{emoji:"🟡",bg:"linear-gradient(135deg,#fefce8,#fef9c3)",dotColor:"#eab308",fillBg:"linear-gradient(90deg,#eab308,#facc15)",width:"66%",labelCls:"text-sm font-black text-yellow-800 leading-none",tipCls:"text-[10px] font-semibold text-yellow-700/70 mt-1.5 leading-snug line-clamp-2"},intenso:{emoji:"🔴",bg:"linear-gradient(135deg,#fef2f2,#fecaca)",dotColor:"#ef4444",fillBg:"linear-gradient(90deg,#ef4444,#f87171)",width:"100%",labelCls:"text-sm font-black text-red-800 leading-none",tipCls:"text-[10px] font-semibold text-red-700/70 mt-1.5 leading-snug line-clamp-2"}},T=D[k.level]||D.livre;y&&(y.style.background=T.bg),j&&(j.textContent=T.emoji),M&&(M.textContent=k.label,M.className=T.labelCls),C&&(C.textContent=k.tip,C.className=T.tipCls),E&&(E.style.background=T.dotColor),B&&(B.style.background=T.fillBg,B.style.width=T.width),t&&L.circleMarker([d.latitude,d.longitude],{radius:60,color:k.color,fillColor:k.color,fillOpacity:.08,weight:1,opacity:.3}).addTo(O)}Y&&We(d.latitude,d.longitude).then(k=>{if(!k||!k.current_weather)return;const y=k.current_weather,M=Xe[y.weathercode]||"Desconhecido",C=Math.round(y.temperature),E=Math.round(y.windspeed),j=y.weathercode,B=e.querySelector("#weather-temp"),D=e.querySelector("#weather-desc"),T=e.querySelector("#weather-wind"),z=e.querySelector("#weather-icon-emoji"),oe=e.querySelector("#weather-forecast"),F=e.querySelector("#weather-card");if(B&&(B.textContent=C+"°"),D&&(D.textContent=M),T&&(T.textContent=E+" km/h"),j===0||j===1?(z&&(z.textContent="☀️"),F&&(F.style.background="linear-gradient(135deg,#fffbeb,#fef3c7)")):j>=45&&j<=48?z&&(z.textContent="🌫️"):j>=51&&j<=67?(z&&(z.textContent="🌧️"),F&&(F.style.background="linear-gradient(135deg,#f0f9ff,#cfe2ff)")):j>=80&&j<=82?(z&&(z.textContent="⛈️"),F&&(F.style.background="linear-gradient(135deg,#eef2ff,#c7d2fe)")):j>=95&&z&&(z.textContent="⚡"),oe&&k.hourly){const X=new Date().getHours();let pe="";for(let g=X+1;g<Math.min(X+4,(k.hourly.time||[]).length);g++){const w=new Date(k.hourly.time[g]).getHours(),W=Math.round(k.hourly.temperature_2m[g]);pe+=`<span class="text-[9px] font-bold whitespace-nowrap bg-white/60 px-1.5 py-0.5 rounded-md">${w}h ${W}°</span>`}oe.innerHTML=pe}}).catch(()=>{})}).catch(()=>{})},100);let o="Rio de Janeiro";function v(){let m=[],f=0;const u=e.querySelector("#news-item"),p=e.querySelector("#news-loading"),d=e.querySelector("#news-counter");function h(y){return`<div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
        <div class="bg-red-500 rounded-md px-1.5 py-1 shrink-0 mt-0.5"><span class="text-[9px] font-black text-white leading-none">G1</span></div>
        <div class="flex-1 min-w-0">
          <p class="text-[11px] font-bold text-slate-800 leading-snug line-clamp-2">${y.title}</p>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-[9px] font-black text-red-500">${y.source||"G1"}</span>
            ${y.timeAgo?`<span class="text-[9px] font-semibold text-slate-400">• ${y.timeAgo}</span>`:""}
          </div>
        </div>
      </div>`}function S(){!u||m.length===0||(u.style.opacity="0",u.style.transform="translateY(6px)",setTimeout(()=>{u.innerHTML=h(m[f]),u.style.opacity="1",u.style.transform="translateY(0)",d&&m.length>1&&(d.textContent=`${f+1}/${m.length}`,d.classList.remove("hidden"))},250))}function k(){console.log("[News] Fetching for:",o),p&&(p.style.display=""),fetch(`/api/news?city=${encodeURIComponent(o)}`).then(y=>y.json()).then(y=>{if(p&&(p.style.display="none"),!y.items||y.items.length===0){u&&(u.innerHTML='<div class="p-3 rounded-xl bg-slate-50 border border-slate-100"><p class="text-[11px] text-slate-400 font-semibold">Sem notícias de hoje</p></div>');return}m=y.items,f=0,S()}).catch(()=>{p&&(p.style.display="none"),u&&(u.innerHTML='<div class="p-3 rounded-xl bg-slate-50 border border-slate-100"><p class="text-[11px] text-slate-400 font-semibold">Falha ao carregar</p></div>')})}k(),setInterval(()=>{m.length>1&&(f=(f+1)%m.length,S()),f===0&&m.length>0&&k()},4e4)}return e}function Ze(e){const t=document.createElement("div");t.className="view active bg-background-light dark:bg-background-dark";const s=(e.driverPrice||e.price||0).toFixed(2).replace(".",",");let n=Math.floor((e.timeout||15e3)/1e3);t.innerHTML=`
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
          <span id="tt" class="text-5xl font-black text-slate-900 dark:text-white leading-none tracking-tighter transition-colors duration-500" style="font-family: 'JetBrains Mono', monospace;">${n}</span>
          <span id="tt-lbl" class="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-0.5 transition-colors duration-500">SEG</span>
        </div>
      </div>
    </div>
    <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-2 text-center leading-tight tracking-tight">${e.vehicleModel||"Veículo"}</h2>
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
      <div class="text-center"><p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Ganho (Líquido)</p><p class="text-primary font-black text-lg">R$ ${s}</p></div>
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
</div > `;const l=t.querySelector("#tc"),i=(e.timeout||15e3)/1e3,r=t.querySelector("#tt"),c=t.querySelector("#tt-lbl"),o=t.querySelector("#glow-ring"),v=()=>{l.style.strokeDashoffset=264*(1-n/i);const f=n/i;f<=.3?(l.style.stroke="#ef4444",r.style.color="#ef4444",c.style.color="#ef4444",o.classList.remove("bg-primary/30","bg-[#f97316]/30"),o.classList.add("bg-[#ef4444]/40","animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite]")):f<=.6&&(l.style.stroke="#f97316",r.style.color="#f97316",c.style.color="#f97316",o.classList.remove("bg-primary/30"),o.classList.add("bg-[#f97316]/30"))},m=()=>{try{$.pause(),$.currentTime=0}catch{}};try{$.currentTime=0,$.play().catch(f=>console.log("Audio blocked",f))}catch{}return v(),re=setInterval(()=>{n--,n<0&&(n=0),r.textContent=n,v(),n<=0&&(clearInterval(re),m())},1e3),t.querySelector("#ba").onclick=()=>{m(),clearInterval(re),b.emit("order:accept",{driverId:a.id,orderId:e.orderId}),H=e,x(Ce,e)},t.querySelector("#bd").onclick=()=>{m(),clearInterval(re),b.emit("order:decline",{driverId:a.id,orderId:e.orderId}),x(I)},t}function Ce(e){const t=document.createElement("div");t.className="view active",t.innerHTML=`
<div class="relative flex flex-col" style="height:100dvh">
  <div class="absolute top-4 left-4 z-[60]"><button id="btn-menu" class="size-10 rounded-lg bg-background-dark/80 backdrop-blur-md border border-primary/20 text-primary flex items-center justify-center"><span class="material-symbols-outlined">menu</span></button></div>
  <div class="absolute top-4 right-4 z-[60] flex gap-2">
      <div class="flex flex-col gap-2">
        <button id="btn-recenter" class="bg-white/90 dark:bg-background-dark/80 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-300 dark:border-primary/20 text-primary active:scale-95 transition-all"><span class="material-symbols-outlined">my_location</span></button>
        <button id="btn-traffic-dash" class="bg-white/90 dark:bg-background-dark/80 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-300 dark:border-primary/20 transition-all ${q?"text-blue-500":"text-slate-400"}"><span class="material-symbols-outlined">${q?"traffic":"layers"}</span></button>
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
    <button id="btn-traffic-job" class="size-11 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all ${q?"text-blue-500":"text-slate-400"}">
      <span class="material-symbols-outlined text-[24px]">${q?"traffic":"layers"}</span>
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
      <div class="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 mb-2 p-4 relative">
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
        <div id="route-info" class="flex items-center justify-center gap-2 text-xs text-slate-500 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mt-3"><span class="material-symbols-outlined text-sm animate-spin text-blue-500">progress_activity</span><span class="text-blue-500 font-black uppercase tracking-widest text-[10px]">Calculando Trajeto...</span></div>
    </div>
  </section>
  <div class="absolute bottom-0 left-0 right-0 p-6 pt-4 border-t border-slate-200 dark:border-white/5 w-full z-40 bg-white dark:bg-background-dark pb-8">
    <button id="btn-start-nav" class="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-[0_4px_15px_rgba(37,99,235,0.4)] active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-wide transition-all"><span class="material-symbols-outlined">explore</span> Iniciar Trajeto</button>
    <button id="b1" class="w-full bg-primary text-black font-bold py-4 rounded-xl shadow-[0_4px_15px_rgba(255,217,0,0.4)] active:scale-[0.98] hidden relative z-50 uppercase tracking-widest transition-all">Cheguei ao Local</button>
    <button id="b2" class="w-full bg-primary/10 border border-primary text-primary font-bold py-4 rounded-xl hidden relative z-50 uppercase tracking-widest">Embarque Confirmado</button>
    <button id="b3" class="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hidden relative z-50 uppercase tracking-widest">Concluir Viagem</button>
  </div>
</div>`,t.querySelector("#btn-menu").onclick=de,t.querySelector("#btn-chat").onclick=()=>{const g=document.getElementById("chat-dot");g&&g.remove(),x(at,e)},t.querySelector("#btn-call").onclick=()=>rt(e.clientId,e.clientName,e.clientPhoto);const s=t.querySelector("#b1"),n=t.querySelector("#b2"),l=t.querySelector("#b3"),i=t.querySelector("#btn-start-nav"),r=t.querySelector("#job-sheet-content"),c=t.querySelector("#job-sheet-handle");let o=!1;function v(){o=!0,r&&(r.style.maxHeight="0px",r.style.opacity="0",r.style.padding="0")}function m(){o=!1,r&&(r.style.maxHeight="600px",r.style.opacity="1",r.style.paddingBottom="0.5rem",r.style.paddingLeft="1.5rem",r.style.paddingRight="1.5rem")}if(c){let g=0,w=!1;const W=N=>{g=N.touches?N.touches[0].clientY:N.clientY,w=!0},Z=N=>{if(!w)return;w=!1;const J=(N.changedTouches?N.changedTouches[0].clientY:N.clientY)-g;J>30?v():J<-30&&m()};c.addEventListener("touchstart",W,{passive:!0}),c.addEventListener("touchend",Z,{passive:!0}),c.addEventListener("mousedown",W),c.addEventListener("mouseup",Z),c.onclick=()=>{o?m():v()}}r&&(r.style.maxHeight="600px"),i.onclick=()=>{i.classList.add("hidden"),s.classList.remove("hidden"),v(),C=!0,h&&h.invalidateSize(),T(),X(y,M)},e.status==="pickup"?(i.classList.add("hidden"),n.classList.remove("hidden")):e.status==="in_progress"&&(i.classList.add("hidden"),l.classList.remove("hidden"),v());let f=null;const u=()=>{f&&navigator.geolocation.clearWatch(f)};s.onclick=()=>{b.emit("order:arrived",{orderId:e.orderId}),s.classList.add("hidden"),n.classList.remove("hidden"),m()},n.onclick=()=>{b.emit("order:start",{orderId:e.orderId}),n.classList.add("hidden"),l.classList.remove("hidden"),v();const g=t.querySelector("#dest-dot");g&&g.classList.replace("border-slate-400","border-primary"),t.querySelector("#route-info").innerHTML='<span class="text-primary font-bold leading-tight drop-shadow-sm">Em viagem para o destino final</span>',X(y,M)},l.onclick=()=>{u(),b.emit("order:complete",{orderId:e.orderId}),H=null,x(Ne,e)};const p=e.pickupLat||-23.55,d=e.pickupLon||-46.63;let h=null,S=null,k=null,y=a.latitude||p,M=a.longitude||d,C=!0,E=2,j=null,B=null,D=0;function T(){const g=t.querySelector("#jmap"),w=t.querySelector("#compass-icon");if(g){if(w&&(w.style.transform=`rotate(${-D}deg)`),!C){g.style.transform="rotateX(0deg) rotateZ(0deg) scale(1) translateY(0%)";return}E===2?g.style.transform=`rotateX(62deg) rotateZ(${-D}deg) scale(6) translateY(32%)`:E===1?g.style.transform="rotateX(62deg) rotateZ(0deg) scale(6) translateY(32%)":g.style.transform="rotateX(0deg) rotateZ(0deg) scale(1) translateY(0%)"}}t.querySelector("#btn-perspective").onclick=()=>{C=!0,E=(E+1)%3,T()};const z=t.querySelector("#btn-traffic-job");z&&(z.onclick=()=>{q=!q,localStorage.setItem("movvi_map_traffic",q?"on":"off"),z.innerHTML=`<span class="material-symbols-outlined text-[24px]">${q?"traffic":"layers"}</span>`,z.className=`size-11 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all ${q?"text-blue-500":"text-slate-400"}`;const g=ge();h&&h.eachLayer(w=>{w instanceof L.TileLayer&&w.setUrl(g)}),P&&V()});function oe(g){const w=C&&E===2?0:g;return L.divIcon({className:"",html:`
        <div style="transform: rotate(${w}deg); transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; align-items: center; justify-content: center; width: 60px; height: 60px;">
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
      `,iconSize:[40,40],iconAnchor:[20,20]})}t.querySelector("#btn-recenter").onclick=()=>{C=!0,E=2,t.querySelector("#btn-recenter").classList.replace("text-slate-600","text-primary"),h.setView([y||a.latitude,M||a.longitude],18),T()};let F=null;async function X(g,w){if(j&&B){const J=g-j,_=(w-B)*Math.cos(g*Math.PI/180);(Math.abs(_)>1e-5||Math.abs(J)>1e-5)&&(D=Math.atan2(_,J)*180/Math.PI)}j=g,B=w,y=g,M=w;const W=t.querySelector("#route-info");let Z=p,N=d;if(H&&H.status==="in_progress"&&(Z=e.destinationLat||p,N=e.destinationLon||d),k?(k.setLatLng([g,w]),k.setIcon(oe(C?0:D))):k=L.marker([g,w],{icon:oe(C?0:D)}).addTo(h),C&&(h.setView([g,w],h.getZoom()>16?h.getZoom():18,{animate:!1}),T()),b.emit("driver:location",{driverId:a.id,latitude:g,longitude:w}),F)return;F=setTimeout(()=>{F=null},5e3);try{const _=await(await fetch(`https://router.project-osrm.org/route/v1/driving/${w},${g};${N},${Z}?overview=full&geometries=geojson&steps=true`)).json();if(_.routes&&_.routes.length>0){const Ve=_.routes[0].geometry.coordinates.map(Q=>[Q[1],Q[0]]);S&&h.removeLayer(S),S=L.polyline(Ve,{color:"#3b82f6",weight:6,opacity:.9}).addTo(h);const Ie=Math.round(_.routes[0].duration/60),Te=(_.routes[0].distance/1e3).toFixed(1);W.innerHTML=`<span class="material-symbols-outlined text-sm text-blue-500">navigation</span><span class="text-blue-500 font-black uppercase tracking-widest text-[11px]">~${Ie} min • ${Te}km</span>`;const ue=t.querySelector("#nav-instructions");C?(ue.classList.remove("opacity-0","-translate-y-40","pointer-events-none"),ue.classList.add("opacity-100","translate-y-0")):(ue.classList.remove("opacity-100","translate-y-0"),ue.classList.add("opacity-0","-translate-y-40","pointer-events-none"));const he=_.routes[0].legs[0].steps[0],$e=_.routes[0].legs[0].steps[1];if($e||he){const Q=$e||he,ye=Q.maneuver.modifier||"straight",je=Q.maneuver.type||"";let ee="Siga em frente",te="straight";ye.includes("left")?(ee="Vire à esquerda",te="turn_left"):ye.includes("right")?(ee="Vire à direita",te="turn_right"):ye.includes("uturn")&&(ee="Faça o retorno",te="u_turn_left"),je.includes("arrive")?(ee="Chegando ao destino",te="location_on"):je.includes("roundabout")&&(ee="Na rotatória",te="roundabout_right");const Be=Q.name?` na ${Q.name}`:"",ke=he.distance||0,Fe=ke>1e3?(ke/1e3).toFixed(1)+" km":Math.round(ke)+" m";t.querySelector("#nav-dist").textContent=`EM ${Fe}`,t.querySelector("#nav-desc").textContent=ee+Be,t.querySelector("#nav-icon").textContent=te}b.emit("driver:eta",{orderId:e.orderId,clientId:e.clientId,etaMinutes:Ie,distanceKm:parseFloat(Te)});return}}catch(J){console.error("OSRM Nav Error:",J);const _=t.querySelector("#nav-instructions");_&&C&&(_.classList.remove("opacity-0","-translate-y-40","pointer-events-none"),_.classList.add("opacity-100","translate-y-0"),t.querySelector("#nav-dist").textContent="NAVEGANDO",t.querySelector("#nav-desc").textContent="Siga o trajeto no mapa",t.querySelector("#nav-icon").textContent="navigation")}S&&h.removeLayer(S),S=L.polyline([[g,w],[Z,N]],{color:"#3b82f6",weight:4,dashArray:"10,8",opacity:.7}).addTo(h);const qe=(Math.sqrt(Math.pow(g-Z,2)+Math.pow(w-N,2))*111).toFixed(1);W.innerHTML=`<span class="material-symbols-outlined text-sm text-blue-500">navigation</span><span class="text-blue-500 font-black uppercase tracking-widest text-[11px]">~${qe}km (linha reta)</span>`}setTimeout(()=>{h=L.map(t.querySelector("#jmap"),{zoomControl:!1,attributionControl:!1}).setView([p,d],15),L.tileLayer(ge(),{subdomains:["0","1","2","3"]}).addTo(h),h.invalidateSize(),L.marker([p,d],{icon:L.divIcon({className:"",html:'<div style="width:20px;height:20px;background:#ffd900;border:3px solid #000;border-radius:50%"></div>',iconSize:[20,20],iconAnchor:[10,10]})}).addTo(h),h.on("dragstart touchstart mousedown",()=>{C&&(C=!1,T())}),h.on("zoomstart",()=>{C&&(C=!1,T())}),X(y,M),navigator.geolocation&&navigator.geolocation.watchPosition&&(f=navigator.geolocation.watchPosition(g=>X(g.coords.latitude,g.coords.longitude),()=>{},{enableHighAccuracy:!0,timeout:5e3,maximumAge:0}))},300);const pe=setInterval(()=>{document.body.contains(t)||(u(),clearInterval(pe))},5e3);return t}function Ne(e){const t=document.createElement("div");t.className="view active bg-background-light dark:bg-background-dark";let s=0;const n=(e.driverPrice||e.price||0).toFixed(2).replace(".",",");return t.innerHTML=`
<div class="flex-1 flex flex-col items-center p-6 pt-16">
  <div class="size-16 bg-primary/20 rounded-full flex items-center justify-center mb-6"><span class="material-symbols-outlined text-primary text-3xl">check</span></div>
  <h1 class="text-2xl font-black text-black font-bold dark:text-white mb-1">Viagem Concluída!</h1>
  <p class="text-slate-500 text-sm mb-8">Pagamento: R$ ${n}</p>
  <p class="text-slate-500 text-xs font-medium uppercase tracking-wider mb-4">Como foi o cliente?</p>
  <div class="flex gap-2 mb-8" id="stars">${[1,2,3,4,5].map(l=>`<button data-v="${l}" class="size-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center hover:border-primary"><span class="material-symbols-outlined text-2xl text-slate-300">star</span></button>`).join("")}</div>
  <button id="done" class="w-full bg-primary text-black font-bold py-4 rounded-xl shadow-lg mt-auto">Concluir</button>
</div>`,t.querySelectorAll("#stars button").forEach(l=>{l.onclick=async()=>{s=parseInt(l.dataset.v),t.querySelectorAll("#stars button span").forEach(i=>{const r=parseInt(i.parentElement.dataset.v);i.className=`material - symbols - outlined text - 2xl ${r<=s?"text-primary":"text-slate-300"} `});try{await Se.rate(e.orderId||e.id,s,"driver")}catch{}}}),t.querySelector("#done").onclick=()=>x(I),t}function Re(){const e=document.createElement("div");e.className="view active bg-background-light dark:bg-background-dark",e.innerHTML=`
    <header class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-20">
      <button id="btn-menu-init" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-black font-bold dark:text-slate-200"><span class="material-symbols-outlined">menu</span></button>
      <h2 class="font-bold text-black font-bold dark:text-white">Carteira</h2><div class="size-10"></div>
    </header>
    <main id="wallet-main" class="flex-1 overflow-y-auto pb-24">
      <div class="flex flex-col items-center justify-center py-20 animate-pulse">
        <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Carregando carteira...</p>
      </div>
    </main>`;const t=e.querySelector("#btn-menu-init");t&&(t.onclick=de);const s=async()=>{try{if(!a||!a.id)return;const l=await be("/drivers/"+a.id+"/wallet"),i=l.balance||0,r=l.transactions||[],c=await se.get(a.id);a.walletBalance=i,a.blocked=c.blocked,R(a);const o=(i||0).toFixed(2).replace(".",","),v=(i||0)<0,m=e.querySelector("#wallet-main");m.innerHTML=`
        <div class="p-6 pb-4 bg-white dark:bg-surface-dark/30 border-b border-slate-200 dark:border-white/5 shadow-sm">
          <div class="flex items-start justify-between mb-4">
            <div>
              <p class="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Saldo na Plataforma</p>
              <h2 class="text-4xl font-black ${(i||0)<0?"text-red-500 dark:text-red-400":"text-emerald-500"}">R$ ${o}</h2>
            </div>
            <div>
              ${a.blocked?'<span class="px-2 py-1 bg-red-500 text-white text-[9px] font-black rounded uppercase animate-pulse tracking-tighter">Conta Bloqueada</span>':""}
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
              <input type="text" id="wallet-pix-input" placeholder="CPF, Email, Telefone..." value="${a.pixKey||""}" class="flex-1 bg-white dark:bg-background-dark border border-slate-300 dark:border-white/20 rounded-lg px-3 py-2.5 text-sm text-black dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary transition-colors font-medium">
              <button id="btn-save-pix-wallet" class="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg px-4 py-2.5 text-xs font-black uppercase tracking-wider active:scale-95 transition-transform flex items-center justify-center min-w-[80px]">Salvar</button>
            </div>
          </div>

          <button id="btn-pay-pix" class="w-full ${v?"bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900":"bg-primary text-black"} font-black py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 tracking-wide text-sm">
            ${v?"QUITAR DÍVIDA / PAGAR":"ADICIONAR CRÉDITOS"} <span class="material-symbols-outlined text-base">qr_code_2</span>
          </button>
        </div>

            <div class="p-4">
              <div class="flex items-center justify-between mb-4 px-2">
                <h3 class="text-xs font-black text-slate-500 uppercase tracking-widest">Extrato Detalhado</h3>
                <span class="material-symbols-outlined text-slate-400 text-sm">history</span>
              </div>

              <div id="tx-list" class="space-y-3">
                ${r.length?r.map(d=>{const h=d.type==="fee",S=(d.amount||0).toFixed(2).replace(".",","),k=d.orderValue?`R$ ${d.orderValue.toFixed(2).replace(".",",")}`:"",y=new Date(d.createdAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"});return`
        <div class="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col gap-2">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs font-bold text-slate-900 dark:text-white">${d.description}</p>
              <p class="text-[10px] text-slate-400 font-medium">${y}</p>
            </div>
            <p class="${h?"text-red-500":"text-green-500"} font-black text-sm">${h?"":"+"}${S}</p>
          </div>
          ${h?`<div class="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-2 mt-1">
            <p class="text-[9px] text-slate-400 uppercase font-bold">Valor Total Serv.</p>
            <p class="text-[9px] text-slate-600 dark:text-slate-300 font-bold">${k}</p>
          </div>`:""}
          <div class="flex items-center justify-between">
            <p class="text-[9px] text-slate-400 uppercase font-bold">Saldo Resultante</p>
            <p class="text-[9px] font-black text-slate-500">R$ ${d.balanceAfter.toFixed(2).replace(".",",")}</p>
          </div>
        </div>`}).join(""):'<div class="py-12 text-center"><span class="material-symbols-outlined text-slate-200 text-5xl mb-2">payments</span><p class="text-slate-400 text-xs font-bold">Nenhuma transação registrada</p></div>'}
              </div>
            </div>`;const f=e.querySelector("#btn-pay-pix");f&&(f.onclick=()=>n(v?Math.abs(i):0));const u=e.querySelector("#btn-save-pix-wallet"),p=e.querySelector("#wallet-pix-input");u&&p&&(u.onclick=async()=>{const d=p.value.trim();u.innerHTML='<div class="size-4 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin"></div>';try{await be("/drivers/"+a.id,"PUT",{pixKey:d}),a.pixKey=d,R(a),u.innerHTML='<span class="material-symbols-outlined text-sm">check</span>',setTimeout(()=>u.innerHTML="Salvar",2e3)}catch{u.innerHTML="ERRO",setTimeout(()=>u.innerHTML="Salvar",2e3)}})}catch(l){console.error("Wallet Error:",l);const i=l.message||"Erro de conexão";e.querySelector("#wallet-main").innerHTML=`
        <div class="p-20 text-center">
          <p class="text-red-500 text-sm font-black mb-4">${i}</p>
          <button id="retry-wallet" class="px-6 py-2 bg-primary rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">Tentar Novamente</button>
        </div>`;const r=e.querySelector("#retry-wallet");r&&(r.onclick=s)}},n=async l=>{let i=l>0?l:20;const r=async p=>{try{return(await be(`/drivers/${a.id}/pix/generate`,"POST",{amount:p,reason:"wallet"})).pixCopiaECola}catch{return alert("Erro ao conectar com o serviço de pagamentos. Tente novamente."),null}};let c=await r(i);if(!c)return;const o=document.createElement("div");o.className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300",o.innerHTML=`
      <div class="w-full max-w-sm bg-white dark:bg-background-dark rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl slide-in-from-bottom duration-500 animate-in relative overflow-hidden">
        <div class="absolute -right-10 -top-10 size-32 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="flex items-center justify-between mb-6">
          <div class="flex flex-col">
            <h3 class="font-black text-slate-900 dark:text-white text-lg uppercase tracking-tight">Pagamento das Taxas</h3>
            <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Regularização Instantânea</p>
          </div>
          <button id="close-modal-pix" class="size-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500"><span class="material-symbols-outlined text-sm">close</span></button>
        </div>

        <div class="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-4 mb-6 text-center">
            <p class="text-[10px] text-indigo-400 uppercase font-black tracking-widest mb-1">Beneficiário</p>
            <p class="text-lg font-black text-indigo-900 dark:text-indigo-200 uppercase">Movvi Resgate</p>
        </div>

        <div class="flex flex-col items-center gap-4 mb-6">
          <div class="bg-white p-4 rounded-3xl shadow-xl border-4 border-slate-50 relative">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(c)}" class="w-44 h-44 rounded-xl" />
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div class="size-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-primary">
                 <img src="/assets/images/logo_movvi.png" class="w-6 h-auto" />
               </div>
            </div>
          </div>
          
          <div class="w-full mt-2">
            <div class="flex items-center justify-between mb-1.5 px-1">
              <label class="text-[10px] text-slate-400 uppercase font-black tracking-widest">Valor do Pagamento</label>
              <div class="flex items-center gap-1"><span class="size-1.5 rounded-full bg-emerald-500"></span><span class="text-[9px] text-emerald-500 font-bold uppercase">Valor Dinâmico</span></div>
            </div>
            <div class="relative">
              <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">R$</div>
              <input id="pix-amount" type="number" step="0.01" value="${i.toFixed(2)}" class="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 text-2xl font-black text-slate-900 dark:text-white outline-none focus:border-primary transition-all" />
            </div>
          </div>
          <p class="text-[10px] text-slate-400 font-bold uppercase text-center -mt-2">Clique no valor para alterar</p>
        </div>

        <div class="space-y-3">
          <button id="btn-update-pix" class="hidden w-full bg-primary text-black font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-wider">
            Atualizar QR Code <span class="material-symbols-outlined text-base">refresh</span>
          </button>
          <button id="btn-copy-pix" class="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-wider">
            Copiar Código PIX <span class="material-symbols-outlined text-base">content_copy</span>
          </button>
          <button id="btn-check-pix" class="w-full bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2">
            PAGUEI, VERIFICAR <span class="material-symbols-outlined text-base">sync</span>
          </button>
        </div>
        
        <p class="text-[9px] text-center text-slate-400 mt-6 px-4 leading-relaxed">O sistema identificará o pagamento automaticamente via <strong class="text-primary">Webhook C6 Bank</strong> e atualizará seu saldo na hora.</p>
      </div>`,document.body.appendChild(o);const v=o.querySelector("#pix-amount"),m=o.querySelector("#btn-update-pix"),f=o.querySelector("img");v.oninput=()=>{m.classList.remove("hidden")},m.onclick=async()=>{const p=parseFloat(v.value);if(isNaN(p)||p<1){alert("Valor mínimo para recarga é R$ 1,00");return}m.innerHTML='<div class="size-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>';const d=await r(p);d?(c=d,f.src=`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(c)}`,m.classList.add("hidden"),m.innerHTML='Atualizar QR Code <span class="material-symbols-outlined text-base">refresh</span>'):m.innerHTML="Erro, Tente de novo"};const u=()=>{o.classList.remove("animate-in"),o.classList.add("animate-out","fade-out","duration-300"),o.querySelector("div").classList.add("slide-out-to-bottom"),setTimeout(()=>o.remove(),300)};o.querySelector("#close-modal-pix").onclick=u,o.querySelector("#btn-check-pix").onclick=async()=>{const p=o.querySelector("#btn-check-pix");p.innerHTML='<div class="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>';try{const d=await se.get(a.id);d.walletBalance>-50&&!d.blocked&&(amount===0||d.kitAcquired)?(u(),d.approved?x(I):x(ne)):(p.innerHTML="Aguardando Banco...",setTimeout(()=>p.innerHTML='VERIFICAR NOVAMENTE <span class="material-symbols-outlined text-base">sync</span>',2e3))}catch{p.innerHTML='VERIFICAR NOVAMENTE <span class="material-symbols-outlined text-base">sync</span>'}},o.querySelector("#btn-copy-pix").onclick=()=>{navigator.clipboard.writeText(c);const p=o.querySelector("#btn-copy-pix"),d=p.innerHTML;p.innerHTML='Código Copiado! <span class="material-symbols-outlined text-base">check_circle</span>',p.classList.replace("bg-slate-900","bg-emerald-600"),setTimeout(()=>{p.innerHTML=d,p.classList.replace("bg-emerald-600","bg-slate-900")},2e3)}};return s(),e}function Qe(){const e=document.createElement("div");return e.className="view active bg-background-light dark:bg-background-dark",e.innerHTML=`
<header class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10">
  <button id="btn-menu" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-black font-bold dark:text-slate-200"><span class="material-symbols-outlined">menu</span></button>
  <h2 class="font-bold text-black font-bold dark:text-white">Histórico</h2><div class="size-10"></div>
</header>
            <main class="flex-1 overflow-y-auto p-4"><div id="hl"><p class="text-slate-500 text-sm text-center py-8">Carregando...</p></div></main>`,e.querySelector("#btn-menu").onclick=de,(async()=>{try{const t=await Se.list({driverId:a.id}),s=e.querySelector("#hl");if(!t.length){s.innerHTML='<p class="text-slate-500 text-sm text-center py-8">Nenhuma corrida</p>';return}s.innerHTML=t.map(n=>`<div class="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-3"><div class="size-12 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400"><span class="material-symbols-outlined">minor_crash</span></div><div class="flex-1"><h4 class="font-semibold text-sm text-black font-bold dark:text-white">${n.serviceName}</h4><p class="text-xs text-slate-500">${n.pickupAddress||"Local"}</p></div><div class="text-right"><p class="text-xs font-bold ${n.status==="completed"?"text-green-500":n.status==="cancelled"?"text-red-500":"text-primary"}">${n.status}</p></div></div>`).join("")}catch{}})(),e}function et(){const e=document.createElement("div");e.className="view active bg-background-light dark:bg-background-dark";const s=(a.name||"").replace(/\uFFFD/g,"ã").replace(/Joo/i,"João").replace(/Jo.?o/i,"João"),n=a.photo||"";e.innerHTML=`
<header class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10 transition-all">
  <button id="btn-menu" class="size-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-black font-bold dark:text-slate-200"><span class="material-symbols-outlined">menu</span></button>
  <h2 class="font-bold text-black font-bold dark:text-white">Perfil</h2><div class="size-10"></div>
</header>
            <main class="flex-1 p-5 overflow-y-auto">
              <div class="flex flex-col items-center gap-4 mb-8 mt-4 relative">
                <div class="relative group cursor-pointer z-10" id="photo-container">
                  <div class="size-28 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-background-dark shadow-xl flex items-center justify-center text-slate-400 overflow-hidden relative">
                    ${n?`<img src="${n}" class="w-full h-full object-cover" id="p-img" />`:'<span class="material-symbols-outlined text-[3rem]" id="p-icon">person</span>'}
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
                    <input type="text" id="i-name" class="bg-transparent text-black font-bold dark:text-white font-medium text-lg w-full outline-none" value="${s}" readonly />
                    <button id="b-edit-name" class="text-primary p-2 -mr-2"><span class="material-symbols-outlined text-sm">edit</span></button>
                  </div>
                </div>
                <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4">
                  <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Email</p>
                  <p class="text-black font-bold dark:text-white font-medium text-base">${a.email||"N/A"}</p>
                </div>
                <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4">
                  <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Telefone</p>
                  <p class="text-black font-bold dark:text-white font-medium text-base">${a.phone||"N/A"}</p>
                </div>
                <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 relative group">
                  <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Chave PIX (Para Recebimentos)</p>
                  <div class="flex items-center justify-between">
                    <input type="text" id="i-pix" class="bg-transparent text-black font-bold dark:text-white font-medium text-base w-full outline-none placeholder-slate-400" placeholder="Sua chave PIX" value="${a.pixKey||""}" readonly />
                    <button id="b-edit-pix" class="text-primary p-2 -mr-2"><span class="material-symbols-outlined text-sm">edit</span></button>
                  </div>
                </div>
                <div class="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4">
                  <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Veículo Reservado</p>
                  <p class="text-black font-bold dark:text-white font-medium text-base">${a.vehicle||"N/A"} - ${a.plate||"N/A"}</p>
                </div>
              </div>

              <button id="btn-save" class="w-full bg-primary text-black font-bold py-3.5 rounded-xl shadow-lg mt-8 hidden active:scale-[0.98] transition-all">Salvar Alterações</button>
            </main>`,e.querySelector("#btn-menu").onclick=de;const l=e.querySelector("#f-input"),i=e.querySelector("#btn-save"),r=e.querySelector("#i-name"),c=e.querySelector("#b-edit-name"),o=e.querySelector("#i-pix"),v=e.querySelector("#b-edit-pix");let m=null;return e.querySelector("#photo-container").onclick=()=>l.click(),l.onchange=f=>{const u=f.target.files[0];if(u){const p=new FileReader;p.onload=d=>{m=d.target.result;const h=e.querySelector(".size-28");h.innerHTML=`<img src="${m}" class="w-full h-full object-cover" id="p-img" />
                       <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"><span class="material-symbols-outlined text-white">photo_camera</span></div>`,i.classList.remove("hidden")},p.readAsDataURL(u)}},c.onclick=()=>{r.removeAttribute("readonly"),r.focus(),r.classList.add("border-b","border-primary","pb-1"),i.classList.remove("hidden")},v.onclick=()=>{o.removeAttribute("readonly"),o.focus(),o.classList.add("border-b","border-primary","pb-1"),i.classList.remove("hidden")},i.onclick=async()=>{const f=r.value.trim();f&&(a.name=f);const u=o.value.trim();a.pixKey=u,m&&(a.photo=m),R(a);try{await fetch("/api/drivers/"+a.id,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:a.name,photo:a.photo,pixKey:a.pixKey})})}catch{}i.textContent="Salvo!",i.classList.remove("bg-primary"),i.classList.add("bg-green-500","text-white"),setTimeout(()=>{i.classList.add("hidden"),i.textContent="Salvar Alterações",i.classList.add("bg-primary"),i.classList.remove("bg-green-500","text-white"),r.setAttribute("readonly","true"),r.classList.remove("border-b","border-primary","pb-1"),o.setAttribute("readonly","true"),o.classList.remove("border-b","border-primary","pb-1"),V()},1500)},e}function tt(){const e=document.createElement("div");e.className="view active bg-background-light dark:bg-background-dark",e.innerHTML=`
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
    </form>`,e.querySelector("#bk").onclick=()=>x(I);const t=e.querySelector("#chat-msgs"),s=e.querySelector("#chat-file-input"),n=e.querySelector("#btn-attach");n.onclick=()=>s.click();function l(c){const o=c.from==="driver",v=new Date(c.timestamp).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),m=document.createElement("div");m.className=`flex ${o?"justify-end":"justify-start"} `;let f="";c.file&&(c.file.startsWith("data:image")?f=`<img src="${c.file}" class="max-w-full rounded-lg mb-1 border border-black/10 cursor-pointer" onclick="window.open('${c.file}')" />`:f=`<div class="flex items-center gap-2 p-2 bg-black/5 rounded-lg mb-1"><span class="material-symbols-outlined">description</span><a href="${c.file}" target="_blank" class="text-xs underline">Documento</a></div>`),c.message&&(f+=`<p class="text-sm">${c.message}</p>`),m.innerHTML=`<div class="max-w-[80%] px-4 py-2.5 rounded-2xl ${o?"bg-primary text-black font-bold rounded-br-md shadow-sm":"bg-slate-100 dark:bg-white/10 text-black font-bold dark:text-white rounded-bl-md shadow-sm"}">${f} <p class="text-[9px] mt-1 ${o?"text-black/60":"text-slate-400"} text-right">${v}</p></div>`,t.appendChild(m),t.scrollTop=t.scrollHeight}b.emit("chat:get-history",{driverId:a.id}),b.once("chat:history",({messages:c})=>{t.innerHTML="",c.forEach(l)});const i=c=>{c.driverId===a.id&&c.from==="admin"&&l(c)};b.on("chat:new-message",i);const r=async(c,o=null)=>{b.emit("chat:driver-to-admin",{driverId:a.id,driverName:a.name,message:c,file:o}),l({from:"driver",message:c,file:o,timestamp:new Date().toISOString()})};return e.querySelector("#chat-form").onsubmit=c=>{c.preventDefault();const o=e.querySelector("#chat-input"),v=o.value.trim();v&&(r(v),o.value="")},s.onchange=async c=>{const o=c.target.files[0];if(!o)return;const v=new FileReader;v.onload=()=>{r("",v.result),s.value=""},v.readAsDataURL(o)},e}function at(e){const t=document.createElement("div");t.className="view active bg-background-light dark:bg-background-dark";const s=e.orderId||e.id;t.innerHTML=`
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
</div>`,t.querySelector("#bk").onclick=()=>x(Ce,e);const n=t.querySelector("#chat-msgs");function l(u){const p=u.from==="driver",d=new Date(u.timestamp).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),h=document.createElement("div");h.className=`flex ${p?"justify-end":"justify-start"} `;let S;u.type==="audio"&&u.audioData?S=`<audio controls src="${u.audioData}" style="max-width:220px;height:40px"></audio>`:S=`<p class="text-sm">${u.message}</p>`,h.innerHTML=`<div class="max-w-[80%] px-4 py-2.5 rounded-2xl ${p?"bg-primary text-black rounded-br-md":"bg-slate-100 dark:bg-white/10 text-black dark:text-white rounded-bl-md"}">${S} <p class="text-[9px] mt-1 ${p?"text-black/60":"text-slate-400"} text-right">${d}</p></div>`,n.appendChild(h),n.scrollTop=n.scrollHeight}b.emit("order-chat:get-history",{orderId:s}),b.once("order-chat:history",({messages:u})=>{u&&u.forEach(l)});const i=u=>{u.orderId===s&&l(u)};b.on("order-chat:new-message",i),t.querySelector("#chat-form").onsubmit=u=>{u.preventDefault();const p=t.querySelector("#chat-input"),d=p.value.trim();d&&(b.emit("order-chat:driver-to-client",{orderId:s,clientId:e.clientId,driverId:a.id,message:d,type:"text"}),l({from:"driver",message:d,type:"text",timestamp:new Date().toISOString()}),p.value="")};let r=null,c=[];const o=t.querySelector("#btn-audio"),v=t.querySelector("#recording-status"),m=t.querySelector("#btn-stop"),f=t.querySelector("#btn-cancel-audio");return o.onclick=async()=>{try{const u=await navigator.mediaDevices.getUserMedia({audio:!0});r=new MediaRecorder(u),c=[],r.ondataavailable=p=>{p.data.size>0&&c.push(p.data)},r.onstop=()=>{u.getTracks().forEach(p=>p.stop())},r.start(),v.classList.remove("hidden"),o.classList.add("hidden")}catch{alert("Não foi possível acessar o microfone.")}},m.onclick=()=>{!r||r.state!=="recording"||(r.onstop=()=>{r.stream.getTracks().forEach(d=>d.stop());const u=new Blob(c,{type:"audio/webm"}),p=new FileReader;p.onloadend=()=>{const d=p.result;b.emit("order-chat:driver-to-client",{orderId:s,clientId:e.clientId,driverId:a.id,type:"audio",audioData:d}),l({from:"driver",type:"audio",audioData:d,timestamp:new Date().toISOString()})},p.readAsDataURL(u),v.classList.add("hidden"),o.classList.remove("hidden")},r.stop())},f.onclick=()=>{r&&r.state==="recording"&&(r.onstop=()=>{r.stream.getTracks().forEach(u=>u.stop())},r.stop()),c=[],v.classList.add("hidden"),o.classList.remove("hidden")},t}function ze(){if(me=document.getElementById("app-content"),P=document.getElementById("sidebar"),le=document.getElementById("sidebar-overlay"),!me||!le){console.error("CRITICAL: DOM elements not found.");return}const t=new URLSearchParams(window.location.search).get("invite")==="pioneer";le.onclick=Le;const s=Je();s?(a=s,ce(),V(),Pe()):x(t?He:ve)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ze):ze();let A=null,ae=null;function rt(e,t,s){ie(),x(De,{targetId:e,targetName:t,targetPhoto:s,incoming:!1})}function De(e){const t=document.createElement("div");t.className="view active bg-slate-900 text-white",t.innerHTML=`
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
</div>`;const s=t.querySelector("#call-status"),n=t.querySelector("#remote-audio"),l=()=>{U.pause(),U.currentTime=0,ae&&ae.getTracks().forEach(r=>r.stop()),A&&A.close(),A=null,ae=null},i=async()=>{if(A=new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"}]}),A.onicecandidate=r=>{r.candidate&&b.emit("call:signal",{targetId:e.targetId,signal:{ice:r.candidate}})},A.ontrack=r=>{n.srcObject=r.streams[0],s.textContent="Em Chamada",s.classList.remove("animate-pulse")},ae=await navigator.mediaDevices.getUserMedia({audio:!0}),ae.getTracks().forEach(r=>A.addTrack(r,ae)),!e.incoming){const r=await A.createOffer();await A.setLocalDescription(r),b.emit("call:request",{targetId:e.targetId,userId:a.id,callerName:a.name,callerPhoto:a.photo}),b.emit("call:signal",{targetId:e.targetId,signal:{sdp:r}})}};return e.incoming&&(U.play(),t.querySelector("#btn-accept").onclick=async()=>{U.pause(),U.currentTime=0,await i(),b.emit("call:accept",{targetId:e.targetId})}),t.querySelector("#btn-hangup").onclick=()=>{b.emit("call:end",{targetId:e.targetId}),l(),x(I)},b.off("call:signal").on("call:signal",async({signal:r})=>{if(A||await i(),r.sdp){if(await A.setRemoteDescription(new RTCSessionDescription(r.sdp)),r.sdp.type==="offer"){const c=await A.createAnswer();await A.setLocalDescription(c),b.emit("call:signal",{targetId:e.targetId,signal:{sdp:c}})}}else r.ice&&await A.addIceCandidate(new RTCIceCandidate(r.ice))}),b.off("call:accepted").on("call:accepted",()=>{s.textContent="Em Chamada",s.classList.remove("animate-pulse")}),b.off("call:rejected").on("call:rejected",()=>{l(),x(I)}),b.off("call:ended").on("call:ended",()=>{l(),x(I)}),e.incoming||i(),t}function st(){b.on("call:incoming",e=>{ie(),x(De,{targetId:e.fromId,targetName:e.callerName,targetPhoto:e.callerPhoto,incoming:!0})})}const it=ce;ce=()=>{it(),st()};
