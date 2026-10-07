# Eloy Verão Odontologia · Unidade São Paulo · Site

Site da **Eloy Verão Odontologia, Unidade São Paulo**: dentista da família no Jardim Aricanduva desde 2002.
Rua Antônio La Giudice, 345, Jardim Aricanduva, São Paulo (SP), 03456-060.

Estado atual: **demonstração, versão 4** ("Luz de manhã, laço de família"), marcada `noindex, nofollow`, ainda não publicada. A versão no ar em eloy-verao-demo.vercel.app continua a anterior até o ok do Nicolas. A v3 ficou guardada em `../.trabalho/v3-site/` (não estava no git).

Fontes de verdade: `../brief-v4-nicolas.md` e `../brief-v3-nicolas.md` (palavras do Nicolas), `../secoes-porque.md` (o porquê de cada seção), `../direcao-v4.md` (direção de arte), `../conversao.md` (mensagem e eventos), `../DESIGN.md` (sistema visual construído).

## Estrutura

```
index.html            conteúdo, dados da clínica, SEO (title, meta, JSON-LD, Open Graph);
                      dados de cada caso de antes e depois em <template data-caso-dados>
assets/css/site.css   visual; cores, fontes, escala e espaços no bloco :root do topo
assets/js/site.js     WhatsApp de SP e modelo da mensagem (topo), mensuração, menu, lista de planos
                      (resposta + barra fixa), casos e comparador, fitas da equipe, cartas da primeira consulta,
                      componente de mensagem (folha no celular), barra fixa
assets/img/           fotos da clínica em WebP, logo, ícones, imagem de compartilhamento (+ ilustrações quando chegarem)
assets/fonts/         Mona Sans (variável, latim, OFL) e Figtree, servidas localmente
```

Sem build e sem dependências. Sem JS, todos os botões já abrem o WhatsApp de SP com uma mensagem geral e a seção de convênios mostra o link "Perguntar se o meu plano cobre".

## Seções (cada uma com o seu porquê em `../secoes-porque.md`)

1. **Capa**: "Aqui, dentista vira da família.", a dupla (única aparição da foto) sobre a fita do monograma que se desenha, painel com os nomes e selo "24 anos".
2. **Seu plano está aqui?**: os 12 planos + Particular + Outro plano em pílulas tocáveis; a resposta aparece no painel (desktop) ou na barra fixa (celular) e o plano chega marcado na mensagem.
3. **O que a gente faz**: dia a dia da família (consulta, crianças, canal) e o que você vem planejando (implante, aparelho, clareamento, harmonização), com ilustrações e "Imagens ilustrativas.".
4. **Casos de pacientes daqui**: comparador de antes e depois e fila de quatro casos reais.
5. **Quem vai te atender**: cinco retratos em arco, foto, nome e o que faz; a fita abraça o arco no hover ou toque.
6. **O que os pacientes dizem**: 4,7 · 130 avaliações · 24 anos, a fala da Simone e três avaliações com o nome citado marcado.
7. **Como é a primeira consulta** (provisório): três cartas sobrepostas, "Em casa, antes", "Na cadeira", "Em casa, depois".
8. **Antes de marcar**: seis dúvidas.
9. **Conta o que você procura**: componente de mensagem e a fachada (única aparição) com endereço, "Como chegar" e horário.

O CRO aparece uma vez só, na linha legal do rodapé.

## Ilustrações (como trocar)

As 8 ilustrações são geradas no Gemini (`../prompts-gemini.md`). Enquanto não chegam, cada uma ocupa um **espaço reservado** no tamanho exato (4:3, fundo branco, nome do tratamento discreto), marcado `data-provisorio="ilustracao-pendente"`.

1. Salve as imagens em `empresas/eloy-verao-odontologia-sp/materiais/ilustracoes/` com o nome do `prompts-gemini.md`: `ilustra-implante`, `ilustra-checkup`, `ilustra-criancas`, `ilustra-canal`, `ilustra-aparelho`, `ilustra-clareamento`, `ilustra-harmonizacao`, `ilustra-dentista-explica` (`.png`, `.jpg` ou `.webp`). Se refizer, salve como `-v2`, `-v3`: o script usa a versão mais alta.
2. Na raiz do NobriOS, rode:
   `node empresas/eloy-verao-odontologia-sp/projetos/site-institucional/.trabalho/trocar-ilustracoes.mjs`
3. O script converte cada uma para `assets/img/ilustra-<nome>-1200.webp` e `-600.webp` **sem deformar e sem recortar** (se a proporção não for 4:3, sobra branco, nunca corta o objeto), troca o espaço reservado pela `<img>` (com o `alt` que já está no `data-alt` da figura), tira o `data-provisorio` e grava a proveniência em `../.trabalho/proveniencia-img/`. Pode rodar de novo a cada imagem nova.
4. Confira no navegador. Ilustração nunca entra na seção de casos nem no lugar de um antes e depois.

## Dados usados no site (manter atualizados)

| Informação | Onde aparece |
|---|---|
| WhatsApp (11) 96499-9718 (Unidade SP) | `site.js` (constante `WHATSAPP`) e todos os links `wa.me` do `index.html` |
| Modelo da mensagem | `site.js`, função `monta` (segue `../conversao.md`, seção 3); exemplo na carta "Em casa, antes" |
| Fixo (11) 2726-6239 | Formulário, fachada, barra fixa, rodapé |
| Endereço e CEP | Fachada, prova do formulário, rodapé, JSON-LD |
| Horário (provisório) | Dúvidas, fachada, prova do formulário, JSON-LD |
| Nota e número de avaliações do Google | Capa, "O que os pacientes dizem" |
| Convênios (12) | Lista de planos, componente de mensagem |
| CRO do responsável técnico | Rodapé |
| Endereço da demonstração | `og:url`, `og:image` e JSON-LD (trocar pelo domínio da clínica) |

**Nunca** usar o WhatsApp da unidade de Dourados (MS). Itens provisórios estão marcados no HTML com `data-provisorio` e comentário.

## Mensuração

Eventos no `dataLayer` (e no `gtag`, se existir), sem nome nem observação: `abrir_contato` (`area`, `posicao`), `erro_formulario` (`campo`), `envio_formulario`, `clique_whatsapp` (principal: `area`, `posicao`, `tipo`), `copiar_mensagem`, `clique_telefone`, `clique_rota`, `clique_avaliacoes_google`, `uso_comparador` (`caso`). Posições novas: `convenios` (resposta do plano e barra fixa no modo plano), `primeira-consulta`. Interesse novo: `canal`. Falta instalar a tag (GA4 ou GTM).

## Fotos

Fotos da própria clínica (Instagram @eloyveraoodonto.sp), cada uma uma vez: a dupla na capa, os retratos na equipe, a fachada no fechamento, os casos nos casos. Nenhum retoque nos casos clínicos. A proveniência fica fora do site, em `../.trabalho/proveniencia-img/`.
