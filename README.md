# Banco de Questões CBMPE

App de estudo para o concurso do Corpo de Bombeiros Militar de Pernambuco (banca Instituto AOCP). Funciona no navegador e pode ser instalado no celular como aplicativo (PWA), igual ao Controle de Aulas.

- **Treino rápido:** rodadas de 10 questões, com resposta e comentário na hora. As alternativas são embaralhadas a cada vez.
- **Conteúdos:** checklist do edital e dos índices do TAF.
- **Erros:** caderno de erros automático. A questão sai de lá quando você acerta.
- **Redação:** 100 temas, com sorteio.
- **Progresso:** acertos por matéria, com meta de 75%.
- **Conta (opcional):** usa o mesmo login do Controle de Aulas para levar o progresso entre celular e computador.

## Instalar no celular

- **iPhone (Safari):** abra o link, toque em Compartilhar e depois em "Adicionar à Tela de Início".
- **Android (Chrome):** abra o link, toque no menu ⋮ e depois em "Instalar app" ou "Adicionar à tela inicial".

## Regra do Firestore (uma vez só)

O progresso fica no documento `banco/{uid}` do projeto Firebase `controle-aulas`. No console do Firebase, abra **Firestore Database > Regras** e acrescente este bloco dentro de `match /databases/{database}/documents { ... }`, ao lado da regra de `users` que já existe:

```
match /banco/{uid} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
}
```

Depois toque em **Publicar**. Sem essa regra, o app funciona normalmente, mas o progresso fica salvo só no aparelho.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | O app inteiro (telas e lógica) |
| `questoes.json` | O banco de questões e os temas de redação |
| `nuvem.js` | Login e sincronização com o Firebase |
| `sw.js` | Funciona sem internet e atualiza sozinho |
| `manifest.webmanifest`, `icon-*.png` | Instalação como app |

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
