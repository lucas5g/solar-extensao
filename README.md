# Solar - Filtro de erros de peticionamento

Extensao para Chrome e Edge que melhora a pagina
`/processo/peticionamento/buscar/` do Solar.

## Recursos

- Mostra a descricao completa abaixo do selo `Erro` na coluna de situacao.
- Detecta automaticamente os tipos de erro presentes na tabela.
- Filtra os processos por descricao do erro.
- Mantem a linha de documentos vinculada ao processo durante a filtragem.
- Atualiza o filtro quando a tabela muda por busca, paginacao ou AJAX.

## Instalacao

1. Abra `chrome://extensions` no Chrome ou `edge://extensions` no Edge.
2. Ative o **Modo do desenvolvedor**.
3. Clique em **Carregar sem compactacao**.
4. Selecione a pasta `/home/lucas/projects/solar-extensao`.
5. Acesse ou recarregue a pagina `/processo/peticionamento/buscar/`.

## Permissoes

A extensao injeta apenas CSS e JavaScript nas paginas HTTP ou HTTPS cujo caminho
comeca com `/processo/peticionamento/buscar/`. Ela nao usa APIs externas, nao
envia dados e nao possui processo em segundo plano.
# solar-extensao
