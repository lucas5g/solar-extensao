# Solar - Filtro de erros de peticionamento

Extensao para Chrome e Edge que melhora a pagina
`/processo/peticionamento/buscar/` do Solar.

## Recursos

- Mostra a descricao completa abaixo do selo `Erro` na coluna de situacao.
- Detecta automaticamente os tipos de erro presentes na tabela.
- Filtra os processos por descricao do erro.
- Mantem a linha de documentos vinculada ao processo durante a filtragem.
- Atualiza o filtro quando a tabela muda por busca, paginacao ou AJAX.
- Permite habilitar ou desabilitar os recursos pelo icone da extensao.

## Agrupamento de erros

O filtro agrupa mensagens que diferem apenas no sufixo `[Identificador: ...]`
ou no numero da frase `O expediente {número} não pode ser respondido`.
Cada opcao mostra a quantidade total de registros do grupo. Motivos diferentes
e outros numeros de processo ou documento continuam separados.

A descricao completa, incluindo o numero do expediente e o identificador,
continua visivel em cada linha e no tooltip. `Todos os erros` conta registros.

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
