/* =========================================================
   Adega Milão — dados do catálogo
   Este é o único arquivo que precisa mudar para editar produtos.
   - price: número (ex.: 64.99) ou null => aparece "Consulte o preço"
   - promo: true => entra no filtro "Ofertas" e ganha a etiqueta
   - Foto: assets/img/products/<id>.webp (PNG/WebP transparente)
   ========================================================= */
export const WHATSAPP = '5512981520564';

export const CATEGORIES = [
    { id: 'whisky', name: 'Whisky' },
    { id: 'gin', name: 'Gin' },
    { id: 'vodka', name: 'Vodka' },
    { id: 'tequila', name: 'Tequila e licores' },
    { id: 'cachaca', name: 'Cachaça e rum' },
    { id: 'cerveja', name: 'Cervejas' },
    { id: 'energetico', name: 'Energéticos' },
    { id: 'gelo', name: 'Gelo e mixers' },
    { id: 'combo', name: 'Combos' },
];

export const PRODUCTS = [
    // Whisky
    { id: 'white-horse', cat: 'whisky', name: 'White Horse', size: '1 L', style: 'Blended Scotch', price: 64.99, promo: true },
    { id: 'red-label', cat: 'whisky', name: 'Johnnie Walker Red Label', size: '1 L', style: 'Blended Scotch', price: null },
    { id: 'black-label', cat: 'whisky', name: 'Johnnie Walker Black Label', size: '1 L', style: '12 anos', price: null },
    { id: 'old-parr', cat: 'whisky', name: 'Old Parr', size: '1 L', style: '12 anos', price: null },
    { id: 'jack-daniels', cat: 'whisky', name: "Jack Daniel's Old No. 7", size: '1 L', style: 'Tennessee Whiskey', price: null },
    { id: 'jack-honey', cat: 'whisky', name: "Jack Daniel's Honey", size: '1 L', style: 'Licor de whiskey e mel', price: null },
    { id: 'ballantines', cat: 'whisky', name: "Ballantine's Finest", size: '1 L', style: 'Blended Scotch', price: null },
    { id: 'passport', cat: 'whisky', name: 'Passport', size: '1 L', style: 'Blended Scotch', price: null },
    { id: 'chivas-12', cat: 'whisky', name: 'Chivas Regal 12', size: '1 L', style: '12 anos', price: null },
    { id: 'jameson', cat: 'whisky', name: 'Jameson', size: '1 L', style: 'Irish Whiskey', price: null },
    // Gin
    { id: 'tanqueray', cat: 'gin', name: 'Tanqueray London Dry', size: '750 ml', style: 'London Dry Gin', price: null },
    { id: 'gordons', cat: 'gin', name: "Gordon's", size: '750 ml', style: 'London Dry Gin', price: null },
    { id: 'beefeater', cat: 'gin', name: 'Beefeater', size: '750 ml', style: 'London Dry Gin', price: null },
    { id: 'bombay', cat: 'gin', name: 'Bombay Sapphire', size: '750 ml', style: 'London Dry Gin', price: null },
    { id: 'gin-opera', cat: 'gin', name: 'Gin Ópera Frutas Tropicais', size: '', style: 'Gin saborizado', price: null },
    // Vodka
    { id: 'smirnoff', cat: 'vodka', name: 'Smirnoff', size: '998 ml', style: 'Vodka', price: null },
    { id: 'absolut', cat: 'vodka', name: 'Absolut', size: '1 L', style: 'Vodka', price: null },
    { id: 'ciroc', cat: 'vodka', name: 'Cîroc', size: '750 ml', style: 'Vodka', price: null },
    { id: 'skyy', cat: 'vodka', name: 'Skyy', size: '980 ml', style: 'Vodka', price: null },
    { id: 'askov', cat: 'vodka', name: 'Askov', size: '900 ml', style: 'Vodka', price: null },
    // Tequila e licores
    { id: 'ballena', cat: 'tequila', name: 'Ballena Original Cream Tequila', size: '750 ml', style: 'Licor cremoso', price: 99.0, promo: true },
    { id: 'jose-cuervo', cat: 'tequila', name: 'José Cuervo Especial', size: '750 ml', style: 'Tequila ouro', price: null },
    { id: 'jagermeister', cat: 'tequila', name: 'Jägermeister', size: '700 ml', style: 'Licor de ervas', price: null },
    { id: 'baileys', cat: 'tequila', name: 'Baileys', size: '750 ml', style: 'Licor de creme irlandês', price: null },
    // Cachaça e rum
    { id: 'cachaca-51', cat: 'cachaca', name: 'Cachaça 51', size: '965 ml', style: 'Cachaça', price: null },
    { id: 'velho-barreiro', cat: 'cachaca', name: 'Velho Barreiro', size: '910 ml', style: 'Cachaça', price: null },
    { id: 'bacardi', cat: 'cachaca', name: 'Bacardí Carta Blanca', size: '980 ml', style: 'Rum', price: null },
    // Cervejas
    { id: 'heineken-ln', cat: 'cerveja', name: 'Heineken long neck', size: '330 ml', style: 'Puro malte', price: null },
    { id: 'heineken-lata', cat: 'cerveja', name: 'Heineken lata', size: '350 ml', style: 'Puro malte', price: null },
    { id: 'spaten', cat: 'cerveja', name: 'Spaten lata', size: '350 ml', style: 'Munich Helles', price: null },
    { id: 'budweiser', cat: 'cerveja', name: 'Budweiser lata', size: '350 ml', style: 'American Lager', price: null },
    { id: 'brahma', cat: 'cerveja', name: 'Brahma Duplo Malte lata', size: '350 ml', style: 'Puro malte', price: null },
    { id: 'amstel', cat: 'cerveja', name: 'Amstel lata', size: '350 ml', style: 'Puro malte', price: null },
    { id: 'original', cat: 'cerveja', name: 'Antarctica Original lata', size: '350 ml', style: 'Pilsen', price: null },
    { id: 'skol', cat: 'cerveja', name: 'Skol lata', size: '350 ml', style: 'Pilsen', price: null },
    { id: 'corona', cat: 'cerveja', name: 'Corona long neck', size: '330 ml', style: 'Extra', price: null },
    { id: 'stella', cat: 'cerveja', name: 'Stella Artois long neck', size: '330 ml', style: 'Puro malte', price: null },
    // Energéticos
    { id: 'red-bull', cat: 'energetico', name: 'Red Bull', size: '250 ml', style: 'Energético', price: null },
    { id: 'monster', cat: 'energetico', name: 'Monster Energy', size: '473 ml', style: 'Energético', price: null },
    { id: 'baly-2l', cat: 'energetico', name: 'Baly Tradicional', size: '2 L', style: 'Energético', price: null },
    { id: 'hitpower-2l', cat: 'energetico', name: 'Hits Power Original', size: '2 L', style: 'Energético com taurina', price: null },
    // Gelo e mixers
    { id: 'gelo-coco', cat: 'gelo', name: 'Gelo de coco', size: '190 g', style: 'Gelo de sabor', price: null },
    { id: 'gelo-maracuja', cat: 'gelo', name: 'Gelo de maracujá', size: '190 g', style: 'Gelo de sabor', price: null },
    { id: 'gelo-melancia', cat: 'gelo', name: 'Gelo de melancia', size: '190 g', style: 'Gelo de sabor', price: null },
    { id: 'gelo-morango', cat: 'gelo', name: 'Gelo de morango', size: '190 g', style: 'Gelo de sabor', price: null },
    { id: 'gelo-limao', cat: 'gelo', name: 'Gelo de limão', size: '190 g', style: 'Gelo de sabor', price: null },
    { id: 'gelo-maca-verde', cat: 'gelo', name: 'Gelo de maçã verde', size: '190 g', style: 'Gelo de sabor', price: null },
    { id: 'gelo-cubo', cat: 'gelo', name: 'Gelo em cubo', size: '5 kg', style: 'Saco de gelo', price: null },
    { id: 'tonica', cat: 'gelo', name: 'Água tônica Schweppes', size: '350 ml', style: 'Mixer', price: null },
    { id: 'coca-2l', cat: 'gelo', name: 'Coca-Cola', size: '2 L', style: 'Refrigerante', price: null },
    // Combos (parts = fotos usadas na composição)
    { id: 'combo-top', cat: 'combo', name: 'Combo Top', size: '', style: '1 whisky White Horse + 1 energético Baly 2 L', price: 79.99, promo: true,
      parts: ['baly-2l', 'white-horse'] },
    { id: 'combo-gin', cat: 'combo', name: 'Combo Gin', size: '', style: '1 Gin Ópera Frutas Tropicais + 1 energético Hits Power 2 L + 4 gelos de sabor sortidos', price: 29.9, promo: true,
      parts: ['hitpower-2l', 'gin-opera', 'gelo-limao', 'gelo-morango', 'gelo-maracuja', 'gelo-melancia'] },
];

/* Destaques do topo: cor do fundo, fruta e cor do gelo de sabor que flutuam */
export const HERO = [
    { id: 'white-horse', theme: ['#9a6416', '#4a2a0a', '#120a04'], fruit: 'orange', ice: '#f2b81f', glow: 'rgba(255, 181, 71, .55)' },
    { id: 'tanqueray', theme: ['#13744f', '#073823', '#020e08'], fruit: 'lime', ice: '#8fd14f', glow: 'rgba(125, 255, 192, .4)' },
    { id: 'ballena', theme: ['#a3305f', '#4a1029', '#12040b'], fruit: 'cherry', ice: '#ef3d5a', glow: 'rgba(255, 156, 204, .5)' },
];

export const OFFERS = ['white-horse', 'combo-top', 'ballena', 'combo-gin'];

export const COPAO = {
    bebida: [
        { id: 'white-horse', label: 'White Horse', color: '#c47318' },
        { id: 'red-label', label: 'Red Label', color: '#b5621a' },
        { id: 'jack-daniels', label: "Jack Daniel's", color: '#a85a14' },
        { id: 'tanqueray', label: 'Tanqueray', color: '#dfeee4' },
        { id: 'gin-opera', label: 'Gin Ópera Tropical', color: '#f6e3a0' },
        { id: 'smirnoff', label: 'Smirnoff', color: '#eef3f6' },
        { id: 'askov', label: 'Askov', color: '#eef3f6' },
    ],
    energetico: [
        { id: 'red-bull', label: 'Red Bull', color: '#f2c94c' },
        { id: 'monster', label: 'Monster', color: '#a7d65a' },
        { id: 'baly-2l', label: 'Baly', color: '#f0c33c' },
        { id: 'hitpower-2l', label: 'Hits Power', color: '#e2553e' },
        { id: 'tonica', label: 'Água tônica', color: '#f4f2dc' },
    ],
    gelo: [
        { id: 'gelo-coco', label: 'Coco', color: '#e9f1f2' },
        { id: 'gelo-maracuja', label: 'Maracujá', color: '#f2c230' },
        { id: 'gelo-melancia', label: 'Melancia', color: '#f0566c' },
        { id: 'gelo-morango', label: 'Morango', color: '#e0283e' },
        { id: 'gelo-limao', label: 'Limão', color: '#86cc45' },
        { id: 'gelo-maca-verde', label: 'Maçã verde', color: '#b4dc3c' },
    ],
};
