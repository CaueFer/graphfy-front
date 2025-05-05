## Projeto: GRAPHFY - Gráficos com IA
**Integrante**: Caue Fernandes

---

### Visão Geral
O **GRAPHFY** é uma aplicação web inteligente que permite a leitura e análise de planilhas para geração automatizada de gráficos, com auxílio de IA (LLaMA 3). A arquitetura do sistema segue o modelo cliente-servidor:

- O **front-end** é desenvolvido com **Next.js 14**.
- O **back-end** é implementado em **Python** com **FastAPI**, usando o modelo LLaMA 3 como LLM.
- O banco de dados principal é **PostgreSQL**, garantindo a persistência de dados.
- A autenticação é feita via **JWT**, proporcionando segurança nas operações de login e controle de acesso.

---

### Requisitos Funcionais

- Upload de Planilhas: O sistema deve permitir que o usuário envie arquivos no formato .xlsx ou .csv através da interface web.

- Leitura de Dados: Após o upload, o sistema deve processar e exibir os dados contidos na planilha em formato tabular.

- Geração de Gráficos com IA: O sistema deve interpretar os dados da planilha e gerar visualizações gráficas com auxílio de IA para sugerir os tipos de gráfico mais relevantes (ex: pizza, barras, linha).

- Autenticação de Usuários: O sistema deve permitir que usuários se registrem, façam login e acessem suas planilhas e gráficos de forma segura.

- Histórico de Arquivos e Gráficos: O sistema deve armazenar os uploads e gráficos gerados por cada usuário autenticado, permitindo consulta posterior.

### Requisitos Não Funcionais
- Segurança: A aplicação deve proteger os dados dos usuários com autenticação JWT e comunicação via HTTPS.

- Performance: A leitura da planilha deve ser feita de forma assíncrona — para otimização dos recursos do computador do usuário.

- Escalabilidade: A aplicação deve ser capaz de escalar horizontalmente para atender a múltiplos usuários simultâneos.

- Compatibilidade: A interface deve funcionar corretamente nos navegadores modernos (Chrome, Edge, Safari).

- Usabilidade: A aplicação deve ter uma interface intuitiva, com feedback visual claro para ações como upload, geração de gráficos e autenticação.
---

### Arquitetura
**API RESTful** baseada em uma **Arquitetura em Camadas**:

- **Monolítica**, por baixo custo e tempo para desenvolvimento.
- Divisão em camadas:
  - **Front-end:** Interface interativa para usuários.
  - **Back-end:** Processamento de lógica de negócios.
  - **Banco de Dados:** Persistência das informações.

![image](https://github.com/user-attachments/assets/ea1bc5d0-935e-421a-86e9-3a4034f7ce4a)



- **Front-end (Next.js 14)**  
  Interface web interativa para os usuários.

- **Back-end (FastAPI + Python + LLaMA 3)**  
  Processamento da lógica de negócio, leitura de planilhas e comunicação com o modelo de linguagem.

- **Banco de Dados (PostgreSQL)**  
  Armazenamento de usuários, planilhas e resultados processados.

---

### Tecnologias Utilizadas

#### Front-end
- Next.js 14 (App Router)
- React Query ou SWR
- Tailwind CSS
- Axios
- NextAuth.js

#### Back-end
- Python com FastAPI
- LLaMA 3 (llm)
- JWT
- Pydantic (validação de dados)
- TortoiseORM
- PostgreSQL

#### Banco de Dados
- PostgreSQL

---

### Infraestrutura
- **Front-end**: Vercel
- **Back-end**: Railway
- **Banco de Dados**: Railway

### Repositório

  Github - graphfy v1.3

