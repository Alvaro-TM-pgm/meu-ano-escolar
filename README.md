# Meu Ano Escolar

Um painel simples para organizar disciplinas, registrar notas e acompanhar as metas do ano. **Não há login nem conta externa:** o site abre direto e guarda os dados no navegador em uso.

## Começar

Abra [Meu Ano Escolar](https://alvaro-tm-pgm.github.io/meu-ano-escolar/). Na primeira visita, aparece um guia rápido. Também é possível abrir **Como usar** no menu a qualquer momento.

1. Em **Disciplinas**, cadastre cada matéria e a meta anual.
2. Em **Notas**, digite a nota final de cada bimestre ou registre provas e trabalhos.
3. Em **Quanto preciso?**, veja a nota necessária nos bimestres restantes.
4. Em **Simulador** e **Minha evolução**, explore projeções e gráficos.
5. Em **Configurações**, ajuste as regras escolares e baixe seu backup.

O padrão é uma meta de 24 pontos em 4 bimestres. Ajuste esses valores conforme as regras da sua escola.

## Seus dados e backups

Disciplinas, notas e preferências ficam no armazenamento local deste navegador. Eles não são enviados para uma conta e não aparecem automaticamente em outros dispositivos. Para guardar ou transferir o boletim, use **Configurações → Baixar backup JSON** e depois **Importar backup** no outro dispositivo. A importação substitui os dados locais atuais.

Não limpe os dados do navegador sem antes baixar um backup. Para apagar o conteúdo do boletim, use **Configurações → Apagar meus dados**. O aplicativo pede confirmação antes de remover os registros.

## Preencher manualmente ou importar

Você pode digitar as notas diretamente na tabela da página **Notas**. Para colar várias disciplinas de uma vez, use **Importar notas** e o formato:

```text
Matemática | 8,5 | 7,0 | 6,5 | 8,0
Português | 9,0 | 8,5 | 7,5 | 9,0
```

O importador também aceita ponto decimal, tabulação e ponto e vírgula. Revise a prévia antes de adicionar. A opção 7edu é somente para colar manualmente as notas copiadas do portal oficial; o site nunca pede a senha nem acessa a conta.

## Fórmulas

- Média simples: média aritmética das avaliações de um bimestre.
- Média ponderada: notas multiplicadas pelos pesos e divididas pela soma dos pesos.
- Nota digitada por bimestre: considera cada valor informado como nota final.
- Pontos anuais: soma das notas finais dos bimestres.
- Nota necessária: pontos que faltam divididos pelos bimestres sem nota. Se o resultado passar de 10, a meta não pode ser alcançada apenas com as etapas restantes.

Confira se a regra de cálculo corresponde ao regulamento da sua escola, especialmente em caso de recuperação ou arredondamento.

## Rodar localmente

Requer Python 3 para iniciar um servidor estático:

```bash
python -m http.server 8000
```

Abra `http://localhost:8000`. O app também pode ser instalado como PWA. Os gráficos usam Chart.js e as fontes visuais são carregadas pela internet; o restante do armazenamento e lançamento de notas é local.

Rode os testes de cálculo com:

```bash
npm test
```
