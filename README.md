# SpaceTattoo 🌌

> **SpaceTattoo** é um aplicativo mobile moderno desenvolvido em **React Native** com **Expo**, focado em conectar tatuadores (prestadores de serviço) e clientes. A plataforma funciona como um ecossistema completo onde artistas podem publicar portfólios, serviços e flash tattoos, e clientes podem pesquisar, filtrar anúncios e negociar diretamente por meio de um chat integrado em tempo real.

---

## 🚀 Funcionalidades Principais

*   🔑 **Autenticação Completa**: Fluxo de Login e Registro seguro com integração ao Supabase Auth e persistência de sessão de usuário local via `AsyncStorage`.
*   🎨 **Criação de Anúncios**: Tatuadores podem publicar flash tattoos e serviços anexando detalhes como título, descrição, valor e até 3 imagens (armazenadas e processadas de forma eficiente).
*   🔍 **Busca e Filtros no Header**: Barra de pesquisa integrada no cabeçalho que permite buscas por termo/nome e filtros avançados colapsáveis por:
    *   **Tipo de Serviço** (Todos, Serviços ou Locais).
    *   **Preço Máximo** em tempo real com conversão inteligente de formatos numéricos.
*   💬 **Chat em Tempo Real**: Chat direto entre clientes e tatuadores para agendamentos e negociações com ajuste de layout dinâmico (`KeyboardAvoidingView` e `SafeAreaView`) para que o teclado do dispositivo não cubra as mensagens ou a caixa de texto.
*   👤 **Perfil do Usuário**: Espaço dedicado para o usuário gerenciar seus dados e verificar suas informações de conta.

---

## 🛠️ Tecnologias Utilizadas

O projeto utiliza um conjunto de tecnologias modernas e robustas para garantir desempenho, escalabilidade e uma excelente experiência de usuário:

*   **Framework**: [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/) (SDK 54/55)
*   **Linguagem**: [TypeScript](https://www.typescriptlang.org/) para tipagem estática e maior segurança de código
*   **Banco de Dados & Autenticação**: [Supabase](https://supabase.com/) (PostgreSQL com suporte a tipos binários/bytea para imagens e canais em tempo real)
*   **Estilização**: CSS Flexbox integrado ao `StyleSheet` nativo
*   **Ícones**: [Lucide React Native](https://lucide.dev/)
*   **Armazenamento Local**: `@react-native-async-storage/async-storage` para persistência de dados de sessão
*   **Gerenciador de Navegação**: `@react-navigation/native` com Stack Navigator nativo

---

## 📐 Arquitetura do Projeto (Padrão MVC)

O projeto está organizado seguindo o padrão de projeto **MVC (Model-View-Controller)** para separar a lógica de negócios da interface gráfica:

```text
PJ_SpaceTattoo/
├── SpaceTattoo/
│   ├── app/                 # Configurações de rotas e ponto de entrada da aplicação (App.tsx)
│   ├── view/                # Componentes visuais e telas do app (Views)
│   │   ├── LoginApp.tsx
│   │   ├── RegisterApp.tsx
│   │   ├── AnnouncementApp.tsx
│   │   ├── SelectAnnouncementApp.tsx
│   │   ├── TalkChatApp.tsx
│   │   └── ...
│   ├── controllers/         # Hooks personalizados que gerenciam a lógica de estado e requisições (Controllers)
│   │   ├── useLoginController.tsx
│   │   ├── useAnnouncementController.tsx
│   │   ├── useTalkChatController.tsx
│   │   └── ...
│   ├── lib/                 # Conexões e instâncias de clientes externos (supabase.js)
│   ├── (tabs)/              # Folhas de estilo compartilhadas (StylesApp.ts)
│   ├── assets/              # Imagens e recursos estáticos
│   └── model/               # Modelos de dados
└── package.json             # Dependências globais do workspace
```

---

## 💻 Como Executar o Projeto

### Pré-requisitos

1.  Ter o **Node.js** instalado na máquina.
2.  Ter o aplicativo **Expo Go** instalado no seu celular (Android ou iOS) para testar, ou um emulador configurado.

### Passos para Inicialização

1. Clone o repositório para o seu ambiente local:
    ```bash
    git clone https://github.com/seu-usuario/PJ_SpaceTattoo.git
    cd PJ_SpaceTattoo/SpaceTattoo
    ```

2. Instale as dependências necessárias do projeto:
    ```bash
    npm install
    ```

3. Inicie o servidor de desenvolvimento do Expo:
    ```bash
    npm run start
    ```
    *ou, se preferir rodar direcionado:*
    ```bash
    npm run android   # Para Android
    npm run ios       # Para iOS
    ```

4. Escaneie o **QR Code** gerado no terminal usando a câmera do seu celular (iOS) ou o aplicativo **Expo Go** (Android).

---

## 👥 Autores

Desenvolvido como projeto acadêmico para o curso de Tecnologia da Informação / Engenharia de Software.
