import os
import json
import unicodedata

# --- CONFIGURAÇÃO DE DADOS ---
SERVICES = [
    {"slug": "reboque", "name": "Reboque", "icon": "engineering", "desc": "Serviço de reboque profissional para veículos leves e utilitários."},
    {"slug": "guincho", "name": "Guincho 24h", "icon": "tow_truck", "desc": "Guincho urgente com atendimento imediato e monitoramento real-time."},
    {"slug": "pane-seca", "name": "Socorro para Pane Seca", "icon": "local_gas_station", "desc": "Entrega de combustível e auxílio tático para veículos parados por falta de gasolina."},
    {"slug": "chupeta-bateria", "name": "Carga de Bateria (Chupeta)", "icon": "battery_charging_full", "desc": "Recarga auxiliar de bateria para veículos que não ligam."},
    {"slug": "troca-de-pneu", "name": "Troca de Pneu", "icon": "tire_repair", "desc": "Auxílio técnico para substituição de pneus furados com segurança."},
    {"slug": "assistencia-veicular", "name": "Assistência Veicular", "icon": "support_agent", "desc": "Suporte completo para pequenos reparos e auxílio mecânico emergencial."}
]

LOCATIONS = [
    "Barra da Tijuca", "Recreio dos Bandeirantes", "Copacabana", "Ipanema", "Leblon", "Centro RJ", "Botafogo", "Flamengo", "Tijuca", "Grajaú", "Vila Isabel", "Meier", "Madureira", "Bangu", "Campo Grande", "Santa Cruz", "Jacarepaguá", "Freguesia", "Taquara", "Pechincha", "Curicica", "Vargem Pequena", "Vargem Grande", "Ilha do Governador", "Penha", "Bonsucesso", "Olaria", "Pavuna", "Irajá", "Realengo", "Padre Miguel", "Senador Camará", "Guaratiba", "Sepetiba",
    "Duque de Caxias", "Nova Iguaçu", "São João de Meriti", "Belford Roxo", "Nilópolis", "Mesquita", "Queimados", "Japeri", "Magé", "Itaguaí",
    "Icaraí", "Santa Rosa", "Centro Niterói", "Piratininga", "Itaipu", "Fonseca", "Barreto", "São Gonçalo Centro", "Alcântara", "Neves", "Porto da Pedra", "Colubandê", "Mutuá",
    "Avenida Brasil", "Linha Vermelha", "Linha Amarela", "Ponte Rio-Niterói", "Rodovia Dutra", "Rodovia Washington Luiz", "Arco Metropolitano", "Grajaú-Jacarepaguá", "Transolímpica"
]

TEXT_VARIANTS = [
    "Socorro veicular tático com chegada em menos de 20 minutos. Ideal para quem está parado no fluxo intenso e precisa de agilidade.",
    "Solicitação totalmente online sem burocracia. O sistema identifica sua posição exata via GPS e envia a unidade mais próxima.",
    "Pague apenas o preço justo. Transparência total com valor calculado na hora, sem taxas ocultas de guinchos pesados.",
    "Rede de assistência 24 horas monitorada. Atendimento especializado para resolvê-lo rapidamente e tirar você da zona de risco.",
    "Custo disruptivo com agilidade de assistência veicular via carro de passeio. Nossos profissionais chegam rápido onde guinchos tradicionais demoram.",
    "Segurança em primeiro lugar. Profissionais treinados para atendimento emergencial em vias de alta velocidade e perímetros urbanos."
]

# --- TEMPLATE MASTER ---
TEMPLATE = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <title>{TITLE}</title>
    <meta name="description" content="{DESCRIPTION}" />
    <meta name="google-site-verification" content="vWLT2eeqZMPdEGoYw5p_e_809P0_Wp-67Gf67m9IExk" />
    <link rel="canonical" href="https://movviresgate.com.br/seo/{SLUG}.html" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="{TITLE}" />
    <meta property="og:description" content="{DESCRIPTION}" />
    <meta property="og:image" content="https://movviresgate.com.br/movvi_passenger_car_rescue_night_1773604928930.png" />
    <meta property="og:type" content="website" />

    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@300;1&display=swap" rel="stylesheet" />

    <style>
        :root {{
            --primary: #ffd900;
            --bg: #050505;
            --surface: #0a0a0a;
            --text: #ffffff;
            --text-dim: #888888;
        }}
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{
            font-family: 'Inter', sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            min-height: 100vh;
            overflow-x: hidden;
        }}
        h1, h2, h3 {{ font-family: 'Outfit', sans-serif; text-transform: uppercase; font-weight: 950; letter-spacing: -0.05em; }}
        .container {{ max-width: 1200px; margin: 0 auto; padding: 0 24px; }}
        
        /* Nav */
        nav {{ padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 2000; }}
        .logo {{ font-family: 'Outfit'; font-weight: 900; font-size: 20px; color: #fff; text-decoration: none; display: flex; align-items: center; gap: 10px; }}
        .logo img {{ height: 28px; }}

        /* Hero - FULL WIDTH */
        .hero {{ padding: clamp(60px, 15vh, 120px) 0 80px; text-align: center; position: relative; overflow: hidden; }}
        .hero::before {{ content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 100%; height: 100%; background: radial-gradient(circle, rgba(255,217,0,0.05) 0%, transparent 70%); pointer-events: none; }}
        .hero-tag {{ display: inline-block; background: var(--primary); color: #000; padding: 4px 12px; font-size: 10px; font-weight: 900; letter-spacing: 0.2em; border-radius: 2px; margin-bottom: 24px; }}
        .hero h1 {{ font-size: clamp(40px, 8vw, 80px); line-height: 0.9; margin-bottom: 24px; }}
        .hero h1 span {{ color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.3); }}
        .hero p {{ font-size: clamp(16px, 2vw, 20px); color: var(--text-dim); max-width: 700px; margin: 0 auto 40px; }}

        /* Image - CORRIGIDA */
        .visual-section {{ padding: 40px 0; text-align: center; }}
        .visual-section img {{ 
            width: 100%; 
            max-width: 1100px; 
            border-radius: 12px; 
            border: 1px solid rgba(255,255,255,0.1); 
            box-shadow: 0 50px 100px rgba(0,0,0,0.8);
            display: block;
            margin: 0 auto;
        }}

        /* CTA Button */
        .btn-cta {{
            background: var(--primary);
            color: #000;
            text-decoration: none;
            padding: 22px 52px;
            font-family: 'Outfit';
            font-weight: 950;
            display: inline-flex;
            align-items: center;
            gap: 12px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            border-radius: 4px;
            transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 20px 40px rgba(255, 217, 0, 0.25);
        }}
        .btn-cta:hover {{ transform: translateY(-5px) scale(1.02); background: #fff; box-shadow: 0 30px 60px rgba(255, 217, 0, 0.4); }}

        /* Features */
        .features {{ padding: 100px 0; background: var(--surface); }}
        .grid-features {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; }}
        .f-card {{ background: #111; padding: 48px; border: 1px solid rgba(255,255,255,0.03); border-radius: 2px; transition: 0.3s; }}
        .f-card:hover {{ border-color: var(--primary); }}
        .f-icon {{ color: var(--primary); font-size: 40px; margin-bottom: 24px; display: block; }}
        .f-card h3 {{ margin-bottom: 16px; font-size: 18px; }}
        .f-card p {{ color: var(--text-dim); font-size: 14px; }}

        /* FAQ */
        .faq {{ padding: 100px 0; }}
        .faq-grid {{ display: grid; grid-template-columns: 1fr; gap: 60px; }}
        @media (min-width: 992px) {{ .faq-grid {{ grid-template-columns: 1fr 1fr; }} }}
        .faq-item {{ border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 32px; }}
        .faq-item h4 {{ font-size: 16px; margin-bottom: 12px; color: var(--primary); font-weight: 800; }}
        .faq-item p {{ font-size: 14px; color: var(--text-dim); }}

        /* Sticky CTA */
        .sticky-cta {{
            position: fixed;
            bottom: 20px; left: 20px; right: 20px;
            background: var(--primary);
            color: #000;
            padding: 20px;
            text-align: center;
            font-weight: 950;
            text-decoration: none;
            border-radius: 5px;
            box-shadow: 0 15px 45px rgba(255,217,0,0.3);
            z-index: 3000;
            display: none;
            align-items: center;
            justify-content: center;
            gap: 12px;
            font-family: 'Outfit';
            text-transform: uppercase;
        }}
        @media (max-width: 768px) {{ .sticky-cta {{ display: flex; }} }}
    </style>

    <script type="application/ld+json">
    {{
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "{SERVICE_NAME} em {LOCATION}",
        "description": "{DESCRIPTION}",
        "provider": {{
            "@type": "LocalBusiness",
            "name": "Movvi Resgate",
            "image": "https://movviresgate.com.br/assets/images/logo_movvi.png",
            "priceRange": "R$80+",
            "address": {{
                "@type": "PostalAddress",
                "addressLocality": "{LOCATION}",
                "addressRegion": "RJ",
                "addressCountry": "BR"
            }}
        }},
        "areaServed": {{
            "@type": "City",
            "name": "{LOCATION}"
        }}
    }}
    </script>
</head>
<body>
    <nav>
        <div class="container">
            <a href="/" class="logo">
                <img src="/assets/images/logo_movvi.png" alt="Movvi">
                <span>MOVVI_ELITE_SEO</span>
            </a>
        </div>
    </nav>

    <main>
        <section class="hero">
            <div class="container">
                <span class="hero-tag">ATENDIMENTO CRÍTICO 24H</span>
                <h1>{SERVICE_NAME} <span>{LOCATION}</span></h1>
                <p>{VARIANT}</p>
                <a href="/app" class="btn-cta">
                    <span class="material-symbols-outlined">electric_bolt</span>
                    SOLICITAR AGORA
                </a>
            </div>
        </section>

        <section class="visual-section container">
            <img src="/movvi_passenger_car_rescue_night_1773604928930.png" alt="Socorro Veicular Ágil com Carro de Passeio em {LOCATION}">
        </section>

        <section class="features">
            <div class="container">
                <div style="margin-bottom: 60px; text-align: center;">
                    <span class="hero-tag" style="background: rgba(255,255,255,0.05); color: var(--primary);">AGILE MICRO-LOGISTICS</span>
                    <h2 style="font-size: 32px; margin-top: 20px;">TECNOLOGIA DE RESGATE LOCAL</h2>
                </div>
                <div class="grid-features">
                    <div class="f-card">
                        <span class="material-symbols-outlined f-icon">speed</span>
                        <h3>RESPOSTA ULTRA-RÁPIDA</h3>
                        <p>Nossa plataforma conecta você a um parceiro com carro de passeio em {LOCATION} em tempo real. Sem a lentidão e o custo de guinchos pesados.</p>
                    </div>
                    <div class="f-card">
                        <span class="material-symbols-outlined f-icon">gps_fixed</span>
                        <h3>PRECISÃO GPS</h3>
                        <p>Identificamos o ponto exato da sua ocorrência para garantir que o socorro chegue sem erros de rota.</p>
                    </div>
                    <div class="f-card">
                        <span class="material-symbols-outlined f-icon">payments</span>
                        <h3>PREÇO TRANSPARENTE</h3>
                        <p>O algoritmo calcula o valor baseado na distância exata em {LOCATION} para um veículo comum.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="faq container">
            <h2 style="font-size: 32px; margin-bottom: 60px; text-align: center;">PERGUNTAS SOBRE {SERVICE_NAME}</h2>
            <div class="faq-grid">
                <div class="faq-item">
                    <h4>Qual o valor do {SERVICE_NAME} em {LOCATION}?</h4>
                    <p>O valor é calculado na hora pelo Web App. Por usarmos carros de passeio comuns, o custo é drasticamente menor.</p>
                </div>
                <div class="faq-item">
                    <h4>A Movvi atende 24h em {LOCATION}?</h4>
                    <p>Sim, operamos em regime ininterrupto (24/7) garantindo assistência em qualquer via de {LOCATION}.</p>
                </div>
            </div>
        </section>

        <section style="padding: 100px 0; background: linear-gradient(to top, #111, transparent); text-align: center;">
            <div class="container">
                <h2 style="font-size: 40px; margin-bottom: 24px;">NÃO ESPERE NA <span>ZONA DE RISCO</span></h2>
                <p style="color: var(--text-dim); margin-bottom: 48px; max-width: 600px; margin-left: auto; margin-right: auto;">Sua segurança em {LOCATION} é prioridade. Peça agora pelo Web App.</p>
                <a href="/app" class="btn-cta">ACESSAR WEB APP</a>
            </div>
        </section>
    </main>

    <a href="/app" class="sticky-cta">
        <span class="material-symbols-outlined">bolt</span>
        CHAMAR AGORA
    </a>

    <footer style="padding: 60px 0; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; opacity: 0.5; font-size: 11px;">
        <div class="container">
            <p>© 2026 MOVVI TECHNOLOGIES // ELITE SEO ENGINE</p>
            <p style="margin-top: 10px;">Atendimento Ágil com Carros de Passeio em {LOCATION} - Rio de Janeiro.</p>
        </div>
    </footer>
</body>
</html>
"""

def slugify(text):
    text = text.lower().replace(' ', '-')
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
    return text.replace('&', 'e').replace('?', '').replace(',', '')

def generate_seo_system():
    # Caminho corrigido para garantir inclusão no build (Vite copia 'public' para 'dist')
    output_dir = 'public/seo'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Limpar pasta seo para evitar lixo
    for f in os.listdir(output_dir):
        os.remove(os.path.join(output_dir, f))
        
    sitemap_links = []
    total_pages = 0

    print("Gerando páginas SEO ELITE em public/seo (Full-Width)...")
    
    for service in SERVICES:
        for i, loc in enumerate(LOCATIONS):
            slug = f"{slugify(service['slug'])}-{slugify(loc)}"
            file_path = f"{output_dir}/{slug}.html"
            variant = TEXT_VARIANTS[i % len(TEXT_VARIANTS)]
            
            content = TEMPLATE.format(
                TITLE=f"{service['name']} em {loc} | Resgate com Carro de Passeio Movvi",
                DESCRIPTION=f"Socorro emergencial de {service['name'].lower()} em {loc} utilizando carros de passeio ágeis. {variant}",
                SERVICE_NAME=service['name'],
                LOCATION=loc,
                VARIANT=variant,
                SLUG=slug
            )
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            sitemap_links.append(f"https://movviresgate.com.br/seo/{slug}.html")
            total_pages += 1

    PROBLEMS = [
        {"slug": "carro-nao-liga", "name": "Carro Não Liga"},
        {"slug": "bateria-descarregada", "name": "Bateria Descarregada"},
        {"slug": "pneu-furado", "name": "Pneu Furado"},
        {"slug": "fiquei-sem-gasolina", "name": "Fiquei sem Gasolina"}
    ]
    
    for prob in PROBLEMS:
        for i, loc in enumerate(LOCATIONS):
            slug = f"{slugify(prob['slug'])}-{slugify(loc)}"
            file_path = f"{output_dir}/{slug}.html"
            variant = TEXT_VARIANTS[i % len(TEXT_VARIANTS)]
            
            content = TEMPLATE.format(
                TITLE=f"{prob['name']} em {loc}? Resgate Ágil com Carro | Movvi",
                DESCRIPTION=f"{prob['name']} em {loc}? Nossos parceiros chegam rápido. {variant}",
                SERVICE_NAME=prob['name'],
                LOCATION=loc,
                VARIANT=variant,
                SLUG=slug
            )
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            sitemap_links.append(f"https://movviresgate.com.br/seo/{slug}.html")
            total_pages += 1

    print("Gerando Sitemap Master...")
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for link in sitemap_links:
        xml_content += f'  <url>\n    <loc>{link}</loc>\n    <priority>1.0</priority>\n  </url>\n'
    xml_content += '</urlset>'
    
    if not os.path.exists('public'):
        os.makedirs('public')
    with open('public/sitemap-seo.xml', 'w', encoding='utf-8') as f:
        f.write(xml_content)

    print(f"ESTRATÉGIA FINALIZADA! {total_pages} páginas geradas.")

if __name__ == "__main__":
    generate_seo_system()
