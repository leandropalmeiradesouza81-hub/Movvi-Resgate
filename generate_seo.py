import os
import json

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
    # Rio de Janeiro - Zonas
    "Barra da Tijuca", "Recreio dos Bandeirantes", "Copacabana", "Ipanema", "Leblon", "Centro RJ", "Botafogo", "Flamengo", "Tijuca", "Grajaú", "Vila Isabel", "Meier", "Madureira", "Bangu", "Campo Grande", "Santa Cruz", "Jacarepaguá", "Freguesia", "Taquara", "Pechincha", "Curicica", "Vargem Pequena", "Vargem Grande", "Ilha do Governador", "Penha", "Bonsucesso", "Olaria", "Pavuna", "Irajá", "Realengo", "Padre Miguel", "Senador Camará", "Guaratiba", "Sepetiba",
    # Baixada Fluminense
    "Duque de Caxias", "Nova Iguaçu", "São João de Meriti", "Belford Roxo", "Nilópolis", "Mesquita", "Queimados", "Japeri", "Magé",
    # Niterói & São Gonçalo
    "Icaraí", "Santa Rosa", "Centro Niterói", "Piratininga", "Itaipu", "Fonseca", "Barreto", "São Gonçalo Centro", "Alcântara", "Neves", "Porto da Pedra", "Colubandê", "Mutuá"
]

# Variações de texto para evitar conteúdo duplicado
TEXT_VARIANTS = [
    "Atendimento tático realizado por especialistas em menos de 25 minutos.",
    "Solicitação 100% online com rastreamento do motorista em tempo real pelo mapa.",
    "O valor do serviço é calculado na hora e exibido antes de você confirmar.",
    "Rede de assistência 24h conectada via satélite para garantir o socorro mais rápido da região.",
    "Não pague por guinchos pesados sem necessidade. Nossas unidades táticas resolvem 70% dos problemas no local."
]

# --- TEMPLATE MASTER ---
TEMPLATE = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <title>{TITLE}</title>
    <meta name="description" content="{DESCRIPTION}" />
    <link rel="canonical" href="https://movviresgate.com.br/seo/{SLUG}.html" />
    
    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@300,1&display=swap" rel="stylesheet" />

    <style>
        :root {{
            --primary: #ffd900;
            --bg: #050505;
            --surface: #0a0a0a;
            --text: #ffffff;
            --text-dim: #888888;
            --signal-green: #10b981;
        }}
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{
            font-family: 'Inter', sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }}
        h1, h2, h3 {{ font-family: 'Outfit', sans-serif; text-transform: uppercase; font-weight: 950; letter-spacing: -0.05em; }}
        .container {{ max-width: 1200px; margin: 0 auto; padding: 0 24px; }}
        
        /* Nav */
        nav {{ padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }}
        .logo {{ font-family: 'Outfit'; font-weight: 900; font-size: 20px; color: #fff; text-decoration: none; display: flex; align-items: center; gap: 10px; }}
        .logo img {{ height: 28px; }}

        /* Hero */
        .hero {{ padding: 100px 0 60px; text-align: center; }}
        .hero-tag {{ display: inline-block; background: var(--primary); color: #000; padding: 4px 12px; font-size: 10px; font-weight: 900; letter-spacing: 0.2em; border-radius: 2px; margin-bottom: 24px; }}
        .hero h1 {{ font-size: clamp(40px, 8vw, 80px); line-height: 0.9; margin-bottom: 24px; }}
        .hero h1 span {{ color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.3); }}
        .hero p {{ font-size: 18px; color: var(--text-dim); max-width: 700px; margin: 0 auto 40px; }}

        /* CTA Button */
        .btn-cta {{
            background: var(--primary);
            color: #000;
            text-decoration: none;
            padding: 20px 48px;
            font-family: 'Outfit';
            font-weight: 900;
            display: inline-flex;
            align-items: center;
            gap: 12px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            border-radius: 4px;
            transition: 0.3s;
            box-shadow: 0 20px 40px rgba(255, 217, 0, 0.2);
        }}
        .btn-cta:hover {{ transform: scale(1.05); background: #fff; }}

        /* Steps */
        .steps {{ padding: 80px 0; background: var(--surface); }}
        .grid-steps {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; margin-top: 40px; }}
        .step-card {{ background: #111; padding: 40px; border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; }}
        .step-num {{ font-family: 'Outfit'; font-size: 40px; font-weight: 900; color: var(--primary); opacity: 0.3; margin-bottom: 20px; display: block; }}
        .step-card h3 {{ font-size: 14px; margin-bottom: 12px; }}
        .step-card p {{ font-size: 13px; color: var(--text-dim); }}

        /* FAQ */
        .faq {{ padding: 80px 0; }}
        .faq-item {{ margin-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 24px; }}
        .faq-item h4 {{ font-size: 16px; margin-bottom: 12px; color: var(--primary); }}
        .faq-item p {{ font-size: 14px; color: var(--text-dim); }}

        /* Bottom Fixed CTA */
        .sticky-cta {{
            position: fixed;
            bottom: 20px; left: 20px; right: 20px;
            background: var(--primary);
            color: #000;
            padding: 16px;
            text-align: center;
            font-weight: 900;
            text-decoration: none;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            z-index: 1000;
            display: none;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-family: 'Outfit';
        }}
        @media (max-width: 768px) {{ .sticky-cta {{ display: flex; }} .hero {{ padding-top: 60px; }} }}
    </style>

    <!-- Schema Markup -->
    <script type="application/ld+json">
    {{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Movvi Resgate - {SERVICE_NAME} {LOCATION}",
        "image": "https://movviresgate.com.br/assets/images/logo_movvi.png",
        "url": "https://movviresgate.com.br/seo/{SLUG}.html",
        "telephone": "",
        "address": {{
            "@type": "PostalAddress",
            "addressLocality": "{LOCATION}",
            "addressRegion": "RJ",
            "addressCountry": "BR"
        }},
        "geo": {{
            "@type": "GeoCoordinates",
            "latitude": "-22.9068",
            "longitude": "-43.1729"
        }},
        "openingHoursSpecification": {{
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
            ],
            "opens": "00:00",
            "closes": "23:59"
        }}
    }}
    </script>
</head>
<body>
    <nav>
        <div class="container">
            <a href="/" class="logo">
                <img src="/assets/images/logo_movvi.png" alt="Movvi">
                <span>MOVVI_RESGATE</span>
            </a>
        </div>
    </nav>

    <main>
        <section class="hero">
            <div class="container">
                <span class="hero-tag">ASSISTÊNCIA TÁTICA 24H</span>
                <h1>{SERVICE_NAME} EM <span>{LOCATION}</span></h1>
                <p>{VARIANT}</p>
                <a href="/app" class="btn-cta">
                    <span class="material-symbols-outlined">bolt</span>
                    Solicitar Resgate Agora
                </a>
            </div>
        </section>

        <section class="steps">
            <div class="container">
                <h2 style="font-size: 24px; text-align: center;">Como funciona o atendimento</h2>
                <div class="grid-steps">
                    <div class="step-card">
                        <span class="step-num">01</span>
                        <h3>Pedido Online</h3>
                        <p>Acesse nossa plataforma e solicite {SERVICE_NAME} para sua localização em {LOCATION}.</p>
                    </div>
                    <div class="step-card">
                        <span class="step-num">02</span>
                        <h3>Busca Inteligente</h3>
                        <p>Nossa rede localiza automaticamente o motorista tático mais próximo de você.</p>
                    </div>
                    <div class="step-card">
                        <span class="step-num">03</span>
                        <h3>Preço na Tela</h3>
                        <p>Veja o valor real do serviço antes de confirmar. Sem surpresas no faturamento.</p>
                    </div>
                    <div class="step-card">
                        <span class="step-num">04</span>
                        <h3>Socorro Médio</h3>
                        <p>Acompanhe o deslocamento em tempo real no mapa até a sua chegada em {LOCATION}.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="faq">
            <div class="container">
                <h2 style="font-size: 24px; margin-bottom: 40px;">Dúvidas Frequentes</h2>
                <div class="faq-item">
                    <h4>Como solicitar {SERVICE_NAME} em {LOCATION}?</h4>
                    <p>Basta clicar no botão "Solicitar Resgate", informar sua localização e o tipo de problema. O sistema cuidará de todo o resto automaticamente.</p>
                </div>
                <div class="faq-item">
                    <h4>Quanto tempo demora o atendimento em {LOCATION}?</h4>
                    <p>Nosso SLA médio em perímetros urbanos como {LOCATION} é de 15 a 25 minutos, devido às nossas unidades táticas usarem motocicletas preparadas.</p>
                </div>
                <div class="faq-item">
                    <h4>Os profissionais são certificados?</h4>
                    <p>Sim, todos os motoristas da rede Movvi passam por rigorosa auditoria de documentação e treinamento de micro-logística de resgate.</p>
                </div>
            </div>
        </section>
    </main>

    <a href="/app" class="sticky-cta">
        <span class="material-symbols-outlined">electric_bolt</span>
        SOLICITAR AGORA
    </a>

    <footer style="padding: 60px 0; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; opacity: 0.5; font-size: 11px;">
        <div class="container">
            <p>© 2026 MOVVI TECHNOLOGIES // ROAD TO 2027</p>
            <p style="margin-top: 10px;">{SERVICE_NAME} - Atendimento emergencial em {LOCATION} e região metropolitana do Rio de Janeiro.</p>
        </div>
    </footer>
</body>
</html>
"""

def generate_seo_system():
    if not os.path.exists('seo'):
        os.makedirs('seo')
    
    sitemap_links = []
    total_pages = 0

    print("Gerando páginas SEO...")
    
    for service in SERVICES:
        for i, loc in enumerate(LOCATIONS):
            slug = f"{service['slug']}-{loc.lower().replace(' ', '-').replace('&', 'e')}"
            file_path = f"seo/{slug}.html"
            
            # Varia o texto baseado no índice da localização
            variant = TEXT_VARIANTS[i % len(TEXT_VARIANTS)]
            
            content = TEMPLATE.format(
                TITLE=f"{service['name']} em {loc} | Movvi Resgate 24h",
                DESCRIPTION=f"Precisa de {service['name'].lower()} em {loc}? Atendimento via app em 20 minutos. Veja o preço antes de pedir. {variant}",
                SERVICE_NAME=service['name'],
                LOCATION=loc,
                VARIANT=variant,
                SLUG=slug
            )
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            sitemap_links.append(f"https://movviresgate.com.br/seo/{slug}.html")
            total_pages += 1

    # Adicionar páginas complementares de "Problemas"
    PROBLEMS = [
        {"slug": "carro-nao-liga", "name": "Carro Não Liga", "icon": "block"},
        {"slug": "bateria-descarregada", "name": "Bateria Descarregada", "icon": "battery_alert"},
        {"slug": "pneu-furado", "name": "Pneu Furado", "icon": "no_crash"},
        {"slug": "fiquei-sem-gasolina", "name": "Fiquei sem Gasolina", "icon": "gas_meter"}
    ]
    
    for prob in PROBLEMS:
        for i, loc in enumerate(LOCATIONS[:20]): # Apenas as 20 primeiras cidades para esses termos
            slug = f"{prob['slug']}-{loc.lower().replace(' ', '-')}"
            file_path = f"seo/{slug}.html"
            variant = TEXT_VARIANTS[i % len(TEXT_VARIANTS)]
            
            content = TEMPLATE.format(
                TITLE=f"{prob['name']} em {loc}? Resolva Agora | Movvi Resgate",
                DESCRIPTION=f"Está com {prob['name'].lower()} em {loc}? Nossas unidades táticas chegam rápido para socorrer você. Preço justo garantido.",
                SERVICE_NAME=prob['name'],
                LOCATION=loc,
                VARIANT=variant,
                SLUG=slug
            )
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            sitemap_links.append(f"https://movviresgate.com.br/seo/{slug}.html")
            total_pages += 1

    # --- SITEMAP XML ---
    print("Gerando Sitemap...")
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for link in sitemap_links:
        xml_content += f'  <url>\n    <loc>{link}</loc>\n    <priority>0.8</priority>\n  </url>\n'
    xml_content += '</urlset>'
    
    with open('public/sitemap-seo.xml', 'w', encoding='utf-8') as f:
        f.write(xml_content)

    print(f"Sucesso! {total_pages} páginas geradas e Sitemap criado.")

if __name__ == "__main__":
    generate_seo_system()
