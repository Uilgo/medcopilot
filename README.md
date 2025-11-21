# 🏥 MedCopilot

> Assistente de IA para Saúde - Transformando consultas médicas com inteligência artificial

Sistema completo de gestão de consultas médicas com transcrição em tempo real, análise por IA e registro detalhado de atendimentos.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8.svg)](https://tailwindcss.com/)

---

## 📋 Índice

- [Sobre](#-sobre)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Arquitetura](#-arquitetura)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Sobre

O **MedCopilot** é uma plataforma moderna de gestão de consultas médicas que oferece:

- 🎤 **Transcrição em tempo real** usando Web Speech API do navegador
- 🤖 **Análise de IA** para sugerir diagnósticos, exames e medicamentos
- � **Registro completo de consultas** com transcrição e análise
- � **Gestãor de pacientes** com histórico médico detalhado
- 📊 **Dashboard com estatísticas** e visualizações

---

## ✨ Funcionalidades

### 🏥 Gestão de Consultas

- ✅ Captura de consultas com gravação de áudio
- ✅ Transcrição em tempo real via Web Speech API (navegador)
- ✅ Chat interativo médico-paciente
- ✅ Análise de IA (backend) com sugestões de:
  - Diagnóstico principal
  - CID-10
  - Sintomas identificados
  - Exames recomendados
  - Medicamentos sugeridos
- ✅ Registro completo da consulta (transcrição + análise)

### 👥 Gestão de Pacientes

- ✅ Cadastro completo de pacientes
- ✅ Histórico médico detalhado
- ✅ Busca e filtros avançados
- ✅ Importação em lote (CSV)

### 📊 Dashboard & Relatórios

- ✅ Estatísticas em tempo real
- ✅ Gráficos de consultas por período
- ✅ Consultas recentes
- ✅ Ações rápidas

### 👨‍⚕️ Gestão de Equipe

- ✅ Convites por email
- ✅ Controle de permissões (Admin/Médico/Assistente)
- ✅ Gerenciamento de membros

### ⚙️ Configurações

- ✅ Personalização do workspace
- ✅ Upload de logo
- ✅ Tema claro/escuro
- ✅ Configurações de perfil

---

## 🛠 Tecnologias

### Core

- **[React 19](https://react.dev/)** - Biblioteca UI
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Tipagem estática
- **[Vite 7](https://vitejs.dev/)** - Build tool e dev server

### Styling

- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Lucide React](https://lucide.dev/)** - Ícones modernos
- **[Recharts](https://recharts.org/)** - Gráficos e visualizações

### State Management

- **[Zustand](https://zustand-demo.pmnd.rs/)** - Estado global
- **[TanStack Query](https://tanstack.com/query)** - Cache e sincronização de dados
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[Zod](https://zod.dev/)** - Validação de schemas

### Backend & Database

- **[Supabase](https://supabase.com/)** - Backend as a Service (Auth, Database, Storage)
- **[Axios](https://axios-http.com/)** - Cliente HTTP

### Routing & Navigation

- **[React Router 7](https://reactrouter.com/)** - Roteamento SPA

### UI Components

- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[Browser Image Compression](https://www.npmjs.com/package/browser-image-compression)** - Compressão de imagens

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recomendado) ou npm/yarn
- **Git**

### Instalando pnpm

```bash
npm install -g pnpm
```

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/medcopilot.git
cd medcopilot
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais:

```env
# API Backend
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica_aqui
```

### 4. Inicie o servidor de desenvolvimento

```bash
pnpm dev
```

O aplicativo estará disponível em `http://localhost:5173`

---

## ⚙️ Configuração

### Supabase Setup

1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie a URL e a chave pública (anon key)
4. Configure as tabelas necessárias (veja `docs/database-schema.sql`)

### Backend API

O MedCopilot requer um backend Node.js separado para:

- Processamento de áudio
- Análise de IA
- Integração com serviços externos

Veja o repositório do backend: [medcopilot-backend](https://github.com/Uilgo/api-medcopilot)

---

## 💻 Uso

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
pnpm dev

# Verificar erros de TypeScript
pnpm build

# Executar linter
pnpm lint

# Corrigir problemas de lint automaticamente
pnpm lint:fix

# Formatar código com Prettier
pnpm format

# Verificar formatação
pnpm format:check
```

### Produção

```bash
# Build para produção
pnpm build

# Preview do build
pnpm preview
```

---

## 📁 Estrutura do Projeto

```
medcopilot/
├── public/              # Arquivos estáticos
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   └── ui/         # Componentes de UI base
│   ├── contexts/       # React Contexts
│   ├── features/       # Features modulares
│   │   ├── admin/      # Layouts e componentes admin
│   │   ├── auth/       # Autenticação
│   │   ├── consultation/ # Consultas e transcrição
│   │   ├── dashboard/  # Dashboard e estatísticas
│   │   ├── history/    # Histórico de consultas
│   │   ├── onboarding/ # Onboarding de novos usuários
│   │   ├── patients/   # Gestão de pacientes
│   │   ├── settings/   # Configurações
│   │   └── team/       # Gestão de equipe
│   ├── hooks/          # Custom hooks globais
│   ├── layouts/        # Layouts de página
│   ├── lib/            # Configurações e utilitários
│   ├── pages/          # Páginas da aplicação
│   ├── routes/         # Configuração de rotas
│   ├── schemas/        # Schemas de validação Zod
│   ├── services/       # Serviços de API
│   ├── store/          # Estado global (Zustand)
│   ├── types/          # Tipos TypeScript
│   ├── App.tsx         # Componente raiz
│   ├── main.tsx        # Entry point
│   └── index.css       # Estilos globais e tema
├── .env.example        # Template de variáveis de ambiente
├── .gitignore
├── eslint.config.js    # Configuração ESLint
├── index.html
├── package.json
├── tsconfig.json       # Configuração TypeScript
├── vite.config.ts      # Configuração Vite
└── README.md
```

### Organização por Features

O projeto segue uma arquitetura **feature-based**, onde cada feature contém:

```
features/[feature-name]/
├── components/         # Componentes específicos da feature
├── hooks/             # Hooks específicos da feature
├── types/             # Tipos específicos da feature
└── api/               # Chamadas de API específicas (opcional)
```

---

## 📜 Scripts Disponíveis

| Script              | Descrição                                   |
| ------------------- | ------------------------------------------- |
| `pnpm dev`          | Inicia o servidor de desenvolvimento        |
| `pnpm build`        | Compila o projeto para produção             |
| `pnpm preview`      | Preview do build de produção                |
| `pnpm lint`         | Executa o ESLint                            |
| `pnpm lint:fix`     | Corrige problemas do ESLint automaticamente |
| `pnpm format`       | Formata o código com Prettier               |
| `pnpm format:check` | Verifica formatação sem modificar           |

---

## 🏗 Arquitetura

### Design System

O MedCopilot utiliza um design system customizado com paleta de cores focada em saúde:

- **Medical** (Verde) - Ações primárias
- **Accent** (Roxo) - Inovação e IA
- **Health** (Esmeralda) - Sucesso
- **Alert** (Âmbar) - Avisos
- **Critical** (Vermelho) - Erros
- **Clinical** (Cinza) - Neutro

### State Management

- **Zustand** - Estado global (auth, page info)
- **TanStack Query** - Cache de dados do servidor
- **React Hook Form** - Estado de formulários
- **Context API** - Estado de UI (sidebar)

### Padrões de Código

- ✅ TypeScript strict mode
- ✅ ESLint para linting
- ✅ Prettier para formatação
- ✅ Componentes funcionais com hooks
- ✅ Props bem tipadas
- ✅ Imports absolutos com `@/`
- ✅ Sem barrel exports (imports diretos)
- ✅ Convenções de código consistentes

### Qualidade de Código

O projeto utiliza ferramentas automatizadas para garantir qualidade:

**ESLint + Prettier**

- Linting automático com ESLint
- Formatação consistente com Prettier
- Integração entre ambas as ferramentas

**Husky + lint-staged**

- Git hooks configurados com Husky
- Lint e formatação automática em arquivos staged
- Validação antes de cada commit
- Garante que código não conforme não seja commitado

---

## 🤝 Contribuindo

Este é um projeto de desafio técnico. Contribuições não são aceitas no momento.

---

## 📄 Licença

Este projeto foi desenvolvido como parte de um desafio técnico para processo seletivo.

---

## 👨‍💻 Autor

Desenvolvido para o desafio **DevClub - HealthTech**

---

**Nota:** Este é o frontend do projeto **Médico Copilot**. O backend está em desenvolvimento separado.

---

<div align="center">
  <strong>MedCopilot</strong> - Transformando consultas médicas com IA
  <br />
  <sub>© 2025 MedCopilot. Projeto de desafio técnico.</sub>
</div>
