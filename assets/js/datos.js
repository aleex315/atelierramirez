/* ============================================================
   DATOS DE LA WEB: este es el archivo que se edita para cambiar
   teléfono, reseñas, horarios, productos y precios.
   La lógica está en app.js; normalmente no hace falta tocarla.
   ============================================================ */

/* ====== CONTACTO ====== */
const TEL = '34634194705';

/* ====== RESEÑAS ======
   GOOGLE_URL: enlace a tu ficha de Google. GOOGLE_RESENA_URL: el enlace "Pedir reseñas" de tu Perfil de Empresa (para que escriban su reseña).
   RESENAS: reseñas que añades a mano. Copia una línea como esta dentro de la lista y rellénala:
   { nombre: 'María', detalle: 'Moño a medida', texto: 'Escribe aquí su opinión.', estrellas: 5, fuente: 'Google' },
*/
const GOOGLE_URL = 'https://www.google.com/maps/search/?api=1&query=Atelier%20Ramirez%20Alaqu%C3%A0s%20Valencia';
const GOOGLE_RESENA_URL = '';
const RESENAS = [

];

/* ====== FORMULARIOS ====== */
const NEEDS = ['Entregar un moño (para arreglar)', 'Recoger mi moño', 'Encargar un moño, rodete o trenza a medida', 'Reservar un peinado de fallera', 'Información sobre formaciones', 'Otra consulta'];
const PRODS = ['Moño a medida', 'Rodete', 'Pack moño + rodete', 'Trenzas', 'Peinado de fallera', 'Formación', 'Otro'];

/* ====== CALENDARIO DE CITAS ======
   CITAS_URL: pega aquí la dirección de tu Google Apps Script para enlazar con tu Google Calendar.
   Mientras esté vacía, el calendario funciona en "modo solicitud": la clienta elige día y hora y se abre WhatsApp con la petición. */
const CITAS_URL = '';
const CFG = { horario: { 1: [[600, 840], [960, 1140]], 2: [[600, 840], [960, 1140]], 3: [[600, 840], [960, 1140]], 4: [[600, 840], [960, 1140]], 5: [[600, 840], [960, 1140]] }, avisoH: 24, maxDias: 90 };
const BLOQUEOS = []; // días cerrados a mano, por ejemplo '2026-12-25'
const DUR = [[60, '1 hora'], [90, '1 h 30 min'], [120, '2 horas']];

/* ====== TIENDA ======
   img: nombre de la foto en assets/img (sin la extensión .webp). */
const TONOS = [['Negro', '#1d1a18'], ['Castaño oscuro', '#3a2a20'], ['Castaño', '#5a3d2b'], ['Castaño claro', '#85613f'], ['Rubio oscuro', '#a88a5c'], ['Rubio', '#cdb27a']];
const SHOP = [
  { id: 'monos', chip: 'Moños', n: 'Moños', em: 'hechos a medida', img: 'c_monos', alt: 'Detalle trasero de un moño de fallera con peineta dorada', desde: 'Desde 79,99 €',
    intro: 'Moños de fallera elaborados a mano y a tu medida, en la tonalidad que mejor combine contigo.', cta: 'Pedir por WhatsApp',
    sec: [{ tag: 'Fibra', t: 'Moño a medida de fibra', d: 'Elaborado a mano en fibra, en distintas tonalidades.', p: 'Desde 79,99 € hasta 99,99 €', tonos: 1 },
          { tag: 'Pelo natural', t: 'Moño a medida de pelo natural', d: 'Elaborado a mano con pelo natural, en distintas tonalidades.', p: 'Desde 79,99 € hasta 99,99 €', tonos: 1 }] },
  { id: 'rodetes', chip: 'Rodetes', n: 'Rodetes', em: 'de 7 a 10 cm', img: 'c_rodetes', alt: 'Rodete de fallera elaborado a mano', desde: 'Desde 19,99 €',
    intro: 'Rodetes hechos a mano en distintos tamaños y tonalidades, para que encajen con tu peinado.', cta: 'Pedir por WhatsApp',
    sec: [{ tag: 'Fibra', t: 'Rodete de fibra', d: 'De 7 a 10 cm de diámetro y en distintas tonalidades.', p: '19,99 € (7 cm) · 29,99 € (10 cm)', tonos: 1 },
          { tag: 'Pelo natural', t: 'Rodete de pelo natural', d: 'De 7 a 10 cm de diámetro y en distintas tonalidades.', p: '19,99 € (7 cm) · 29,99 € (10 cm)', tonos: 1 }] },
  { id: 'packs', chip: 'Packs', n: 'Packs', em: 'moño + rodete', img: 's1', alt: 'Trenzas y rodetes elaborados a mano sobre la mesa de trabajo', desde: 'Desde 99,99 €',
    intro: 'Moño y rodete a juego, personalizados en tamaño y en color.', cta: 'Pedir por WhatsApp',
    sec: [{ tag: 'Pack', t: 'Pack moño + rodete personalizado', d: 'Un conjunto a juego, elaborado a mano y personalizado tanto en tamaño como en color.', p: 'Desde 99,99 € hasta 149,99 €', tonos: 1 }] },
  { id: 'trenzas', chip: 'Trenzas', n: 'Trenzas', em: 'a tu medida', img: 'c_trenzas', alt: 'Trenzas artesanales y rodetes sobre la mesa de trabajo', desde: 'Desde 69,99 €',
    intro: 'Trenzas en medidas personalizadas para cada clienta.', cta: 'Pedir por WhatsApp',
    sec: [{ tag: 'Fibra', t: 'Trenzas de fibra', d: 'En la medida que necesites.', p: 'Desde 69,99 €' },
          { tag: 'Pelo natural', t: 'Trenzas de pelo natural', d: 'En la medida que necesites.', p: 'Desde 69,99 €' }] },
  { id: 'peinados', chip: 'Peinados', n: 'Peinados', em: 'de fallera', img: 'g3', alt: 'Peinado de fallera con moño, peinetas y pendientes dorados', desde: 'Desde 25,00 €',
    intro: 'Peinados de fallera realizados en nuestras instalaciones de Alaquàs, con cita previa.', cta: 'Reservar cita', go: 1,
    sec: [{ tag: 'Cosido', t: 'Peinado de fallera cosido', d: 'Realizado en nuestras instalaciones.', p: 'Desde 25,00 € hasta 40,00 €' },
          { tag: 'Manual', t: 'Peinado de fallera manual', d: 'Realizado en nuestras instalaciones.', p: 'Desde 25,00 € hasta 40,00 €' }] },
  { id: 'formacion', chip: 'Formaciones', n: 'Formaciones', em: 'de peinado valenciano', img: 's2', alt: 'Detalle de un moño de fallera con agujas y peineta dorada', desde: 'Precio por WhatsApp',
    intro: 'Aprende a realizar peinados de valenciana, tanto cosidos como manuales. Sujeto a la disponibilidad del docente.', cta: 'Preguntar precio',
    sec: [{ tag: 'Cosido', t: 'Formación en peinado cosido', d: 'Aprende a realizar peinados de valenciana cosidos.', p: 'Consulta el precio por WhatsApp' },
          { tag: 'Manual', t: 'Formación en peinado manual', d: 'Aprende a realizar peinados de valenciana manuales.', p: 'Consulta el precio por WhatsApp' }] }
];
['monos', 'rodetes', 'packs', 'trenzas'].forEach(id => SHOP.find(c => c.id === id).plazo = 1);
