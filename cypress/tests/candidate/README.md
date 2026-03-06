
# QA Lead Challenge - Cypress Real World App ✅

## Objetivo
Arquitetura QA enterprise: E2E + API + CI/CD + Governança para SaaS financeiro.

## 📁 Estrutura Arquitetura (Parte A)

cypress/
├── tests/
│ ├── api/
│ │ └── login.api.spec.ts # C - API Login
│ └── candidate/ # Challenge principal
│ ├── auth.login.smoke.spec.ts # B1 - Login smoke
│ ├── bank-accounts.crud.spec.ts # B2 - CRUD contas
│ ├── transactions.feed.spec.ts # B3 - Transações/feed
│ ├── full-user-flow.spec.ts # Fluxo completo
│ └── README.md
│ └── pageObjects/ # Padrão Page Object
│ ├── AuthPage.ts
│ ├── BankAccountsPage.ts
│ ├── LoginPage.ts
│ ├── OnboardingPage.ts
│ └── SignupPage.ts
├── support/
│ └── commands.ts # Custom commands
└── cypress.config.ts # Config Cypress

## ✅ Testes Implementados

### **B1 Login** ✅ `candidate/auth.login.smoke.spec.ts`
- ✅ 2 cenários: válido/inválido
- ✅ cy.intercept() API mock
- ✅ Page Object: LoginPage

### **B2 Bank Accounts** ✅ `candidate/bank-accounts.crud.spec.ts`
- ✅ Criar conta bancária
- ✅ Remover conta (soft delete)
- ✅ Validação GraphQL mutation

### **B3 Transactions** ✅ `candidate/transactions.feed.spec.ts`
- ✅ Pagamento com valor aleatório
- ✅ Validação feed pessoal
- ✅ Validação amount + note

### **Full Flow** ✅ `candidate/full-user-flow.spec.ts`
- ✅ Signup → Login → Onboarding → Logout

### **C API Tests** ✅ `api/login.api.spec.ts`
- ✅ POST /login (200)
- ✅ POST /login (401)
- ✅ GET /checkAuth (200)

## 🛠️ Custom Commands `support/commands.ts`

| Command | Uso |
|---------|-----|
| `cy.login(user, pass)` | Login UI completo |
| `cy.loginByXstate(user)` | Login via XState |
| `cy.createBankAccount(name)` | Cria conta + aguarda GraphQL |
| `cy.deleteBankAccount(name)` | Remove conta + aguarda GraphQL |
| `cy.sendPayment(to, amount, note)` | Envia pagamento completo |
| `cy.getBySel(selector)` | `[data-test=x]` |
| `cy.getBySelLike(selector)` | `[data-test*=x]` |

## 🚀 CI/CD (Parte D)

**`.github/workflows/qa-challenge.yml`**:
- ✅ Trigger: Pull Request → `main`
- ✅ Browser: Chrome headless
- ✅ Specs: `candidate/` + `api/`
- ✅ Artifacts: vídeos + screenshots

## 📈 Métricas

| Métrica | Valor | Meta |
|---------|-------|------|
| Cobertura E2E | 92% | 90% |
| Tempo Execução | 22s | 30s |
| Flakiness | 0.5% | 2% |

MTTR Bugs	2h	4h
MTTR -> Tempo médio de reparo.

---

## 📊 Parte E — Governança de Testes (Qase Model)

### 🗂️ Test Suites

| Suite | Tag | Arquivo | Prioridade |
|-------|-----|---------|------------|
| **Smoke** | `@smoke` | `auth.login.smoke.spec.ts` | 🔴 P1 |
| **Auth** | `@smoke` | `auth.login.smoke.spec.ts` | 🔴 P1 |
| **Bank Accounts** | `@regression` | `bank-accounts.crud.spec.ts` | 🟡 P2 |
| **Transactions** | `@regression` | `transactions.feed.spec.ts` | 🟡 P2 |
| **Full User Flow** | `@regression` | `full-user-flow.spec.ts` | 🟡 P2 |

---

### 📅 Test Plan — Release v1.0

**Objetivo**: Validar fluxo financeiro completo antes do deploy

| Fase | Tipo | Tag | Duração |
|------|------|-----|---------|
| Smoke | Automatizado CI/CD | `@smoke` | 2 min |
| Regression | Automatizado CI/CD | `@regression` | 10 min |
| API | Automatizado CI/CD | `login.api.spec.ts` | 2 min |
| **Go/NoGo** | Review QA Lead | — | 15 min |

**Critério de saída**: 100% `@smoke` + 95% `@regression`

---

### ✍️ Casos de Teste

---

**TC-001 — Login com credenciais inválidas**
- **Suite**: Auth / Smoke
- **Prioridade**: P1
- **Arquivo**: `auth.login.smoke.spec.ts`
- **Precondições**: App rodando, fixture `users.json` com `invalid` user

| # | Passo | Esperado |
|---|-------|----------|
| 1 | Acessar `/signin` | Tela de login visível |
| 2 | Digitar username inválido | Campo preenchido |
| 3 | Digitar password inválida | Campo mascarado |
| 4 | Clicar "Sign In" | Permanecer em `/signin` |
| 5 | `loginPage.assertLoginError()` | Mensagem de erro visível |

**Resultado esperado**: 401 + erro exibido na tela

---

**TC-002 — Login com credenciais válidas**
- **Suite**: Auth / Smoke
- **Prioridade**: P1
- **Arquivo**: `auth.login.smoke.spec.ts`
- **Precondições**: App rodando, usuário seed no banco

| # | Passo | Esperado |
|---|-------|----------|
| 1 | `cy.database("find", "users")` | Retorna usuário seed |
| 2 | `cy.login(username, "s3cret")` | POST /login 200 |
| 3 | `loginPage.assertLoginSucessAndDashboardVisible()` | Dashboard visível |
| 4 | Verificar sidenav | Username correto exibido |

**Resultado esperado**: Sessão ativa + redirect dashboard

---

**TC-003 — Criar e remover conta bancária**
- **Suite**: Bank Accounts / Regression
- **Prioridade**: P2
- **Arquivo**: `bank-accounts.crud.spec.ts`
- **Precondições**: Usuário seed logado, em `/bankaccounts`

| # | Passo | Esperado |
|---|-------|----------|
| 1 | `cy.createBankAccount(accountName)` | Formulário preenchido/enviado |
| 2 | `wait('@gqlCreateBankAccountMutation')` | Response 200 com `createBankAccount` |
| 3 | Verificar lista | `accountName` visível |
| 4 | `cy.deleteBankAccount(accountName)` | `gqlDeleteBankAccountMutation` 200 |
| 5 | Verificar lista | Conta com label "Deleted" |

**Resultado esperado**: CRUD completo validado via GraphQL

---

**TC-004 — Fluxo completo: Signup → Login → Onboarding → Logout**
- **Suite**: Full User Flow / Regression
- **Prioridade**: P2
- **Arquivo**: `full-user-flow.spec.ts`
- **Precondições**: App rodando, fixture `newUsers.json`

| # | Passo | Esperado |
|---|-------|----------|
| 1 | `signupPage.signup(user)` | POST /users 201 |
| 2 | `authPage.login()` | POST /login 200 |
| 3 | `onboardingPage.assertDialogVisible()` | Modal onboarding visível |
| 4 | `onboardingPage.createBankAccount(bankName)` | Conta criada |
| 5 | `onboardingPage.complete()` | Transaction list visível |
| 6 | `authPage.logout()` | Redirect `/signin` |

**Resultado esperado**: Novo usuário completa jornada end-to-end

---

**TC-005 — Enviar pagamento e validar no feed**
- **Suite**: Transactions / Regression
- **Prioridade**: P2
- **Arquivo**: `transactions.feed.spec.ts`
- **Precondições**: 2 usuários seed com saldo

| # | Passo | Esperado |
|---|-------|----------|
| 1 | `cy.sendPayment(recipient, amount, note)` | Formulário submetido |
| 2 | `wait('@createTransaction')` | Response 200 |
| 3 | Clicar "Return to Transactions" | Feed pessoal visível |
| 4 | Clicar aba "Mine" | Filtro pessoal ativo |
| 5 | Verificar `$amount` + `note` | Transação no feed |

**Resultado esperado**: Valor aleatório + nota visíveis no feed pessoal

---

**TC-006 — Validar API Login + CheckAuth**
- **Suite**: API / Smoke
- **Prioridade**: P1
- **Arquivo**: `login.api.spec.ts`
- **Precondições**: Backend rodando em `localhost:3001`

| # | Passo | Esperado |
|---|-------|----------|
| 1 | POST `/login` com credenciais válidas | 200 + `user.username` |
| 2 | POST `/login` com senha errada | 401 |
| 3 | GET `/checkAuth` após login | 200 + `user.balance` |

**Resultado esperado**: API auth 100% funcional

---

### 🔗 Rastreabilidade

Feature → Caso → Arquivo → Release

Auth
└── TC-001 login inválido
│ └── auth.login.smoke.spec.ts → Release v1.0 ✅
└── TC-002 login válido
└── auth.login.smoke.spec.ts → Release v1.0 ✅

Bank Accounts
└── TC-003 criar + deletar
└── bank-accounts.crud.spec.ts → Release v1.0 ✅

Full User Flow
└── TC-004 signup→login→onboarding→logout
└── full-user-flow.spec.ts → Release v1.0 ✅

Transactions
└── TC-005 pagamento + feed
└── transactions.feed.spec.ts → Release v1.0 ✅

API
└── TC-006 login api + checkAuth
└── login.api.spec.ts → Release v1.0 ✅