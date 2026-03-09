# Movvi Resgate

Um sistema web completo para solicitação e gestão de serviços de guincho e assistência rodoviária.

## Visão Geral

O projeto **Movvi Resgate** é dividido em três módulos principais para atender a diferentes necessidades da logística de resgate veicular:

1. **Cliente Final (WebApp):** Interface ágil para solicitação de guinchos. Formato de requisição dinâmico com cálculo de preços em tempo real baseado na distância final.
2. **App do Motorista Parceiro:** Aplicativo para os guincheiros receberem alertas, gerenciarem chamados e atualizarem status (como online/offline). Possui funcionalidades customizadas como um radar giratório de busca de pedidos focado em usabilidade e estilo.
3. **Painel de Controle (Admin):** Interface administrativa que fornece uma visão global de todos os motoristas online e clientes ativos em um mapa, exibindo fluxos financeiros diários e gerindo diretamente as taxas fixas e valores adicionais de todos os chamados.

## Tecnologias Utilizadas

- **Frontend:** HTML5, CSS Nativo (Tailwind adaptado), JavaScript ES6.
- **Backend:** Node.js, Express.
- **Banco de Dados (Local):** NeDB (para rápida prototipagem e desenvolvimento local sem servidores fixos atrelados).
- **Integrações de Mapa e Eventos:** Leaflet.js e Socket.IO (Tempo Real).

## Como Executar

### Pré-requisitos
- Ter o Node.js e NPM instalados no computador.

### Setup de Desenvolvimento

1. No terminal aberto desta pasta, instale os pacotes e dependências listadas no `package.json`:
   ```bash
   npm install
   ```

2. Inicialize as instâncias do servidor em segundo plano rodando:
   ```bash
   npm run dev
   ```

3. Seu sistema estará disponível e servido nas rotas do IP host `http://localhost:5173`. Para acessar os painéis isolados:
   - Root (`http://localhost:5173/`): Acesso do Cliente Web.
   - Admin (`http://localhost:5173/admin.html`): Painel de Monitoramento (senha controlada).

## Configurações Financeiras

Todos os preços por km rodado e de acesso base para o serviço podem ser gerenciados e salvos online no Painel de Admin em "Gestão Financeira". Estes valores são refletidos instântaneamente para todo cliente na etapa inicial de compra.
