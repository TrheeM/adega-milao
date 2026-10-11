# Adega Milão — catálogo online

Site-catálogo do Depósito de Bebidas Milão (Lorena/SP). Cada bebida tem o botão **Tem disponível?**, que abre o WhatsApp (12) 98152-0564 com a pergunta pronta.

**No ar:** https://trheem.github.io/adega-milao/

## Editar produtos e preços

Tudo fica em [`assets/js/data.js`](assets/js/data.js):

- `price: 64.99` mostra o preço; `price: null` mostra "Consulte o preço".
- `promo: true` coloca a bebida no filtro **Ofertas** com a etiqueta vermelha.
- Foto: `assets/img/products/<id>.webp`, recortada com fundo transparente (altura ~560 px).
- Destaques do topo: lista `HERO` (cor do fundo, fruta e cor do gelo de sabor).

Depois de editar, faça commit e push: o GitHub Pages publica sozinho em ~1 minuto.

## Rodar localmente

```sh
python3 -m http.server 4321
# abra http://localhost:4321
```

Precisa de servidor (módulos ES e o modelo 3D não abrem via `file://`).

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | Marcação, CSP e SEO |
| `assets/css/main.css` | Estilos |
| `assets/js/main.js` | Catálogo, ofertas, copão, WhatsApp, topo |
| `assets/js/garnish.js` | Gelo, frutas e folhas 3D do topo (Three.js, carregado depois) |
| `assets/fonts/` | Bodoni Moda, Schibsted Grotesk e Courier Prime (woff2, SIL OFL) |
| `assets/vendor/` | GSAP 3.12.5 e Three.js r169 servidos pelo próprio site (do npm) |

## Segurança e desempenho

- Content-Security-Policy sem scripts nem estilos inline; zero requisições a terceiros (fontes, GSAP e Three.js servidos pelo próprio site).
- Links externos com `rel="noopener noreferrer"`; mensagens do WhatsApp com `encodeURIComponent`.
- Fotos em WebP transparente com `loading="lazy"`; a cena 3D só carrega depois da página pronta e pausa fora da tela.
- Respeita `prefers-reduced-motion`.

Fotos de produto: imagens de catálogo das marcas (fundo removido), uso ilustrativo. Gin Ópera recortado do flyer da própria loja.
