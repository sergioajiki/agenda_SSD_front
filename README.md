# Agenda SSD

Aplicação de agendamento de reuniões da **Superintendência de Saúde Digital (SSD)** — Governo do Estado de Mato Grosso do Sul. Permite marcar, editar e acompanhar reuniões em três salas (**Apoio**, **CIEGES** e **Sala Web**), com visão mensal e semanal do calendário.

## Funcionalidades

- **Calendário mensal e semanal**, alternados por um controle segmentado na barra superior.
- **Três salas com cor própria** (vermelho / azul / teal), com legenda fixa acima do calendário.
- **Filtro por sala** — clicar numa sala da legenda mostra só as reuniões dela, mantendo indicadores visuais de que há reuniões em outras salas naquele dia/horário.
- **Agendamento em modal** ("+ Agendar"), com validação de horário e bloqueio para usuários não autenticados.
- **Edição e exclusão de reunião**, restritas ao dono da reunião ou a administradores, com confirmação antes de excluir.
- **Densidade adaptativa nas células do mês**: com 1–2 reuniões no dia o título quebra em várias linhas; com 3 ou mais, cada uma fica numa linha só com efeito de letreiro (desliza ao passar o mouse quando o texto não cabe).
- **Atualização automática** das reuniões a cada 30s, com aviso discreto na tela.
- **Painel de monitoramento** (`/monitoring`, uso administrativo) com o histórico de alterações (criação/edição/exclusão), ordenado por data.

## Stack

- [Next.js 15](https://nextjs.org) (App Router, Turbopack) + React 19 + TypeScript
- [Axios](https://axios-http.com) para chamadas à API
- CSS puro por componente (sem Tailwind/CSS Modules) — cada componente importa seu próprio arquivo `.css`

## Como rodar localmente

Pré-requisito: uma instância da API backend acessível (este repositório é só o front-end).

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure a URL da API em `.env.local`:

   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

3. Suba o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Acesse [http://localhost:3000/calendar](http://localhost:3000/calendar) — a agenda é o ponto de entrada real da aplicação (a rota `/` ainda é a página padrão do `create-next-app` e não foi customizada).

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o servidor de desenvolvimento (Turbopack) |
| `npm run build` | Gera o build de produção |
| `npm run start` | Roda o build de produção já gerado |
| `npm run lint` | Roda o ESLint |

## Estrutura do projeto

```
src/
├─ app/
│  ├─ calendar/     # página principal — a agenda em si
│  ├─ monitoring/   # painel de auditoria (uso administrativo)
│  └─ about/        # status/health da API
├─ components/
│  ├─ calendar-layout/   # TopBar, RoomLegend + navegação do mês, CenterPanel, RightPanel, modal de reunião
│  ├─ MonthlyView.tsx / WeeklyView.tsx   # as duas visões do calendário
│  ├─ MeetingCard.tsx / MeetingForm.tsx  # cartão de reunião e formulário de agendamento
│  └─ MarqueeTitle.tsx   # efeito de letreiro para títulos longos
├─ hooks/           # useAuth, useMeetings, useFloatingMessage
├─ services/         # chamadas à API (meetingService, authService, healthService)
├─ models/           # tipos TypeScript compartilhados
└─ utils/            # roomStyles (mapeamento cor/sala) e utilitários de data
```

## Salas e cores

O mapeamento entre sala e cor fica centralizado em `src/utils/roomStyles.ts` — para adicionar uma nova sala, basta uma entrada ali (mais a cor correspondente nos arquivos CSS que ainda usam valores fixos: `WeeklyView.css` e `MeetingCard.css`).
