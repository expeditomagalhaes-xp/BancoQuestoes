# Banco de Questões CBMPE

App de estudo para o concurso do Corpo de Bombeiros Militar de Pernambuco (banca Instituto AOCP). Funciona no navegador e pode ser instalado no celular como aplicativo (PWA).

- **Treino rápido:** rodadas de 10 questões, com resposta e comentário na hora. As alternativas são embaralhadas a cada vez.
- **Conteúdos:** tópicos do edital 2026 (Soldado), cada um com um resumo teórico curto, checklist e índices do TAF.
- **Erros:** caderno de erros automático. A questão sai de lá quando você acerta.
- **Redação:** 100 temas, com sorteio.
- **Progresso:** acertos por matéria, com meta de 75%.
- **Sem cadastro:** o progresso fica salvo no próprio aparelho.

## Instalar no celular

- **iPhone (Safari):** abra o link, toque em Compartilhar e depois em "Adicionar à Tela de Início".
- **Android (Chrome):** abra o link, toque no menu ⋮ e depois em "Instalar app" ou "Adicionar à tela inicial".

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | O app inteiro (telas e lógica) |
| `questoes.json` | O banco de questões e os temas de redação |
| `conteudos.json` | Tópicos do edital e resumos teóricos (`r` = lista de frases; `**texto**` vira negrito) |
| `cartoes.json` | Cartões do Tangochō, agrupados por tema (um tema por tópico de `conteudos.json`) |
| `mapas.json` | Mapas mentais: para cada matéria, a ordem de prioridade dos tópicos e a razão de cada um (os cards de cada ramo vêm de `cartoes.json`) |
| `sw.js` | Funciona sem internet e atualiza sozinho |
| `manifest.webmanifest`, `icon-*.png` | Instalação como app |

## Tangochō (cartões de revisão)

O menu inicial tem dois caminhos: **Tangochō** e **Questões** (as abas Treino, Conteúdos, Erros, Redação e Progresso ficam dentro de Questões).

No Tangochō, cada tema é uma argola. Toque no cartão para virar e marque **Lembrei** ou **Rever** (o cartão volta ao fim da pilha). Há filtro "Só as que faltam", Embaralhar e "Misturar todos os temas". Na aba Erros, o botão **Criar cartão** transforma uma questão errada em cartão seu.

O progresso fica no aparelho, na chave `cbmpe-tango-v1`, e entra no código de backup (campo `tg`).

### Como adicionar cartões

Edite `cartoes.json`. Dentro de `temas`, cada tema tem `id` igual ao do tópico em `conteudos.json` (ex.: `DC-1`), `s` (matéria), `t` (título) e a lista `c`:

```json
{ "id": "t-DC-1-7", "p": "Pergunta curta", "r": "Resposta curta", "f": "CF/88, art. 5º, XI" }
```

- `f` (fonte) é opcional, mas use em artigo de lei, súmula e dado atual.
- **Nunca mude nem reaproveite um `id` já publicado**, porque o progresso é guardado por ele. Só acrescente cartões novos ao fim.
- Ao mudar qualquer arquivo, aumente a versão do cache em `sw.js` (`banco-vN`).

## Mapas

A parte **Mapas** mostra um mapa mental por matéria. Cada ramo é um tópico do edital, em ordem de prioridade (alta, média, baixa). Ao abrir um ramo, aparecem os cartões dele: toque em um para ver a resposta. A bolinha cheia indica que você já marcou "Lembrei" no Tangochō; a vazia, que ainda falta. "Só o que falta" esconde o que já foi lembrado, e o botão do ramo abre a pilha do Tangochō. A prioridade é estimativa e fica em `mapas.json`.

## Como adicionar questões

Edite `questoes.json`. Cada questão é um objeto dentro da lista `q`:

```json
{
  "id": "aocp-cbmpe2024-pt-1",
  "s": "PT",
  "g": "cb",
  "f": "CBMPE 2024 · AOCP · Soldado",
  "q": "Enunciado da questão",
  "o": ["alternativa A", "alternativa B", "alternativa C", "alternativa D", "alternativa E"],
  "a": 2,
  "c": "Comentário explicando a resposta"
}
```

- `id`: único, nunca repita nem mude depois (o progresso fica guardado por ele).
- `s`: matéria. Use `PT`, `MAT`, `RL`, `INF`, `FIS`, `BIO`, `DC`, `ATU`, `HPE`, `DA`, `DPEN`, `LPE`, `DPP`, `LEPE`, `EST`, `CONT` ou `ARQ`.
- `g`: `cb` para o banco CBMPE e `x` para extras.
- `f`: de onde veio a questão (aparece embaixo da resposta).
- `a`: posição da resposta certa, começando em 0 (A = 0, B = 1, C = 2…).
- Para certo/errado, use `"t": "ce"`, sem `o`, e `a` = 0 para Certo e 1 para Errado.

## De onde vêm as questões

- 879 questões da Apostila CBM/PE 2026 (estilo AOCP). São questões criadas pela apostila, não de provas anteriores. Gabaritos e comentários são dela.
- 208 extras: apostilas de Direito Constitucional (Carreiras Militares), Direito Penal, Legislação Penal Especial, Processo Penal e PC-PE 2026 (certo/errado no estilo Cebraspe).
- Repetidas foram removidas. A questão 61 de Português tem duas respostas corretas e traz um aviso no comentário.

Para marcar um gabarito suspeito, toque em "Gabarito parece errado?" depois de responder.

## Estudo POO (UP2)

A pasta `poo/` tem um segundo app, independente, para a UP2 de Desenvolvimento Orientado a Objetos (UNIT 2026.2, Prof. Aldo Moura): herança, classe abstrata, polimorfismo e tratamento de exceção. Endereço: `.../BancoQuestoes/poo/`. Detalhes em `poo/README.md`.
