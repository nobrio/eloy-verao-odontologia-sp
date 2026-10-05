# Eloy Verão Odontologia · Unidade São Paulo · Site

Site da **Eloy Verão Odontologia, Unidade São Paulo**: clínica da família no Jardim Aricanduva desde 2002.
Rua Antônio La Giudice, 345, Jardim Aricanduva, São Paulo (SP), 03456-060.

Estado atual: **demonstração** (marcada `noindex`), não publicada. Estratégia, provisórios e autocrítica em `../estrategia.md`.

## Estrutura

```
index.html            conteúdo, dados da clínica, SEO (title, meta, JSON-LD, Open Graph)
assets/css/site.css   visual; cores, fontes e medidas no bloco :root do topo
assets/js/site.js     WhatsApp da Unidade SP e mensagens prontas (topo), mensuração, menu, barra fixa,
                      montagem das fotos, comparador antes/depois, seletor de convênio, formulário
assets/img/           fotos em WebP (recortadas dos posts da clínica), logo sem fundo, ícones, imagem de compartilhamento
assets/fonts/         Quicksand, Figtree e Sacramento, servidas localmente
```

Sem build e sem dependências. Qualquer servidor estático serve.

## Seções

1. **Capa**: "Dentista da família no Jardim Aricanduva, desde 2002", WhatsApp de SP, 4,7 no Google, foto dos sócios com o selo de 24 anos.
2. **Convênios**: os 12 planos por nome e o seletor que pergunta pelo WhatsApp se o plano cobre o tratamento.
3. **Por onde você quer começar?**: seis entradas na voz do paciente, cada uma com a sua mensagem.
4. **Antes e depois**: clareamento num comparador de arrastar e três pares de casos reais.
5. **Quem cuida de você**: história, frase do fundador, Dra. Giovanna, Dra. Bruna e Luciana.
6. **Avaliações**: 4,7 em 130 e seis avaliações reais do Google.
7. **Antes de marcar**: cinco dúvidas.
8. **Onde fica**: fachada, endereço, horário, telefones e o formulário que monta a mensagem.

O CRO aparece uma vez só, na linha legal do rodapé.

## Dados usados no site (manter atualizados)

| Informação | Onde aparece |
|---|---|
| WhatsApp (11) 96499-9718 (Unidade SP) | `site.js` (constante `WHATSAPP`), capa, contato, `action` dos formulários |
| Fixo (11) 2726-6239 | Contato |
| Endereço e CEP | Contato, rodapé, JSON-LD |
| Horário (provisório) | Dúvidas, contato, JSON-LD |
| Nota e número de avaliações do Google | Capa, título das avaliações |
| CRO do responsável técnico | Rodapé |

**Nunca** usar o WhatsApp da unidade de Dourados (MS).

## Mensuração

Eventos no `dataLayer` (e no `gtag`, se existir): `clique_whatsapp` (tratamento, origem, plano), `envio_formulario`, `clique_telefone`, `clique_rota`, `clique_avaliacoes_google`, `uso_comparador`. Falta instalar a tag (GA4 ou GTM). Detalhes em `../estrategia.md`, seção 7.

## Fotos

Todas são da própria clínica, recortadas dos posts do Instagram (sem texto por cima). Retoques: na foto da Dra. Giovanna e na da Luciana, o arco e os pontos decorativos do post foram trocados pelo fundo desfocado; a logo teve o fundo removido. Os casos clínicos não foram alterados (só recorte). Nenhuma imagem foi gerada por IA. Origem de cada arquivo:

| Arquivo | Origem |
|---|---|
| `socios-*.webp`, `og-eloy-verao.jpg` | `ig-15` |
| `giovanna-*.webp` | `ig-19` |
| `bruna-*.webp` | `ig-18` |
| `luciana-430.webp` | `ig-21` |
| `fachada-486.webp` | `ig-06` |
| `caso-clareamento-*` | `ig-23` |
| `caso-protese-*` | `ig-14` |
| `caso-orto-*` | `ig-29` |
| `caso-toxina-*` | `ig-28` |
| `logo-cor.png`, `logo-branco.png`, favicons | `ig-18` |

## Antes de publicar oficialmente

Resolver as pendências de `../estrategia.md` (seção 4). Depois: tirar o `noindex`, pôr `<link rel="canonical">`, trocar os caminhos do `og:image` e do JSON-LD por URLs absolutas e instalar a mensuração. Publicar com `/publicar-site eloy-verao` (só com o ok do Nicolas).
