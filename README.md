# Meu Ano Escolar

Aplicativo escolar em português para registrar disciplinas, avaliações e notas bimestrais, acompanhar pontos anuais, calcular quanto falta para a meta e simular resultados. É uma SPA estática com modo local e integração opcional com Firebase Authentication e Firestore. Não depende de uma rede escolar específica.

## Estrutura

```text
index.html                 Aplicação SPA e login
login.html                 Atalho para o login da SPA
manifest.json              Metadados para instalação como PWA
service-worker.js          Cache local do shell do aplicativo
firebase-config.example.js Exemplo de configuração Firebase
firebase-config.js         Configuração pública do seu projeto Firebase
firestore.rules            Regras para isolar os dados por UID
css/style.css              Tema, componentes e responsividade
js/app.js                  Navegação, páginas e interações
js/auth.js                 Atalhos de autenticação
js/firebase.js             Inicialização Firebase e persistência
js/firestore.js            Funções de acesso ao Firestore
js/storage.js              Dados locais e backup JSON
js/calculator.js           Cálculos sem dependência de interface
js/simulator.js            Cenários do simulador
js/parser.js               Importação manual e adaptador 7edu
js/charts.js               Gráficos Chart.js
js/dashboard.js            Métricas e alertas do painel
js/subjects.js             Modelo de disciplinas
js/grades.js               Modelo e validação de avaliações
js/settings.js             Preferências padrão
js/ui.js                   Formatação e utilitários visuais
tests/calculator.test.mjs  Casos de cálculo automatizados
```

## Executar localmente

Abra um terminal nesta pasta e inicie um servidor estático:

```bash
python -m http.server 8000
```

Abra `http://localhost:8000`. O modo local não requer configuração Firebase. A primeira tela explica como continuar sem conta; os dados desse modo ficam no navegador atual.

Rode os testes de cálculo com:

```bash
npm test
```

## Configurar Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Adicione um aplicativo Web e copie a configuração pública mostrada pelo Console.
3. Copie `firebase-config.example.js` para `firebase-config.js` e substitua os valores de exemplo. A `apiKey` de Firebase identifica o projeto; ela não é uma senha. Nunca inclua credenciais privadas ou senhas.
4. Em **Authentication → Sign-in method**, ative o provedor **Google**.
5. Em **Authentication → Settings → Authorized domains**, adicione `localhost` para desenvolvimento e o domínio publicado pelo GitHub Pages, por exemplo `seu-usuario.github.io`.
6. Crie o banco Firestore em modo produção.
7. Publique as regras de `firestore.rules` em **Firestore Database → Rules**. Não use regras abertas para produção.
8. Publique `firebase-config.js` junto ao site. A configuração web é pública por natureza; restrinja chaves por API quando aplicável e use as regras Firestore como controle real de acesso.

O login Google usa `GoogleAuthProvider`, `signInWithPopup`, `onAuthStateChanged` e `signOut`. As notas e configurações ficam sob `users/{uid}`. Disciplinas são documentos em `subjects`; bimestres e avaliações ficam nas subcoleções `terms` e `assessments`. As regras verificam que o UID autenticado corresponde ao UID no caminho.

Quando conectado, o aplicativo mantém uma cópia local no `localStorage` e tenta habilitar persistência offline do Firestore. Alterações locais são enviadas quando a conexão volta. O indicador da barra lateral mostra o estado de sincronização. O Firestore e autenticação precisam ser configurados pelo proprietário do projeto antes de usar o modo Google.

## Publicar no GitHub Pages

1. Crie um repositório GitHub para este projeto e envie os arquivos da pasta, incluindo `firebase-config.js` depois de configurá-lo.
2. Abra **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**, selecione `main` e `/ (root)` e salve.
4. Aguarde o deploy e abra a URL indicada pelo GitHub Pages. Para projeto chamado `meu-ano-escolar`, a forma esperada é `https://SEU_USUARIO.github.io/meu-ano-escolar/`.
5. Adicione `SEU_USUARIO.github.io` aos domínios autorizados do Firebase Authentication.

O PWA e service worker funcionam em HTTPS (GitHub Pages) ou `localhost`. A navegação interna usa hash routes, então atualizar uma página não quebra as rotas.

## Como usar

1. Cadastre suas disciplinas e ajuste professor, meta, média mínima, quantidade de bimestres e fórmula.
2. Na página **Notas**, digite notas finais diretamente na tabela, ou registre avaliações com nota, peso, data e bimestre.
3. A página **Quanto preciso?** divide os pontos faltantes igualmente entre os bimestres sem nota. Quando o valor ultrapassa 10, informa que a meta ficou matematicamente fora de alcance.
4. Use **Simulador** para projetar uma nota; os cenários de 0, 5, 7 e 10 pontos são exibidos lado a lado.
5. Consulte **Minha evolução** para comparar bimestres e disciplinas.
6. Em **Configurações**, ajuste metas, fórmulas e tema. Os botões para dados de demonstração adicionam exemplos marcados, que podem ser removidos sem apagar suas disciplinas reais.

## Fórmulas

- Média simples: média aritmética das avaliações do bimestre.
- Média ponderada: soma de nota × peso dividida pela soma dos pesos.
- Nota informada manualmente e soma de pontos: usam a nota final preenchida no bimestre.
- Pontos anuais: soma das notas finais dos bimestres. O padrão da meta é 24 pontos em 4 bimestres.
- Nota necessária: (meta − pontos atuais) ÷ bimestres restantes. O valor real não é limitado a 10; a interface destaca quando ele excede a nota máxima.

Se uma escola usa regra diferente — pesos bimestrais, recuperação, arredondamentos ou média mínima adicional — confirme a fórmula com a escola e ajuste manualmente as metas. O cálculo de recuperação não presume um regulamento escolar específico.

## Importar e fazer backup

Na página **Importar notas**, cole uma linha por disciplina no formato `Matemática | 8,5 | 7,0 | 6,5 | 8,0`. Vírgula, ponto, tabulação e ponto e vírgula são aceitos. Revise a prévia e corrija qualquer valor inválido antes de adicionar.

O botão **Importar do 7edu** somente abre um campo para colagem manual. O sistema não pede senha ou token, não acessa a área autenticada e não faz scraping. O `SevenEduAdapter` retorna “Integração não configurada.” até que exista uma API oficial ou método autorizado.

Em Configurações, **Exportar dados** baixa um backup JSON. Importar backup valida a estrutura e pede confirmação antes de substituir os dados locais. A exclusão dos dados escolares pede confirmação dupla; a conta Google não é removida.

## Privacidade e limitações

Suas notas são utilizadas apenas para calcular seu desempenho. O Meu Ano Escolar não solicita sua senha do 7edu. O modo local não sincroniza entre dispositivos. O PWA mantém o shell da interface disponível offline; login Google, Firestore, Chart.js e fontes externas precisam de rede. O Firebase pode manter cópias offline conforme disponibilidade e configuração do navegador. Exporte backups regularmente.
