/* Configuración central editable del sitio GSM. */

export const SITE = {
  name: 'GSM',
  full: 'GSM — Game · Set...Match',
  tagline: 'Game · Set...Match',
  description:
    'GSM es la agencia chilena de gestión deportiva integral. Representación de atletas, alto rendimiento, programas educativos y financiamiento de proyectos en Chile y Latinoamérica.',
  url: 'https://gsm.cl',
  locale: 'es-CL',
  country: 'CL',
  region: 'Santiago',
  address: {
    streetAddress: 'Av. Apoquindo 4501',
    addressLocality: 'Las Condes',
    addressRegion: 'Región Metropolitana',
    postalCode: '7550000',
    addressCountry: 'CL',
  },
  contact: {
    email: 'contacto@gsm.cl',
    phone: '+56 9 0000 0000', // placeholder reemplazable
    whatsapp: '56900000000',
    hours: 'Lun a Vie · 09:00 – 19:00 CLT',
  },
  social: {
    instagram: 'https://instagram.com/gsm.gamesetmatch',
    linkedin: 'https://linkedin.com/company/gsm-gamesetmatch',
    youtube: 'https://youtube.com/@gsm',
  },
  openGraph: {
    image: '/og-image.jpg',
    imageAlt: 'GSM — Game · Set...Match. Agencia deportiva chilena.',
  },
};

export const NAV = [
  { label: 'Servicios', href: '/servicios' },
  { label: 'Instituciones', href: '/#instituciones' },
  { label: 'Atletas', href: '/atletas' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
];

export const SERVICES = [
  {
    slug: 'sport-performance',
    code: '01',
    title: 'Sport Performance',
    subtitle: 'Clubes · Federaciones · Organizaciones',
    summary:
      'Capa estratégica que integra gestión institucional, alto rendimiento, tecnología y desarrollo comercial. Diagnóstico, plan deportivo y estructura para sostener talento en el tiempo.',
    eyebrow: 'Para instituciones',
    image: '/images/action/rugby-scrum.jpg',
  },
  {
    slug: 'athlete-management',
    code: '02',
    title: 'Athlete Management',
    subtitle: 'Deportistas · Familias',
    summary:
      'Convertimos el talento en carrera sostenible: roadmap deportivo, marca personal, búsqueda de patrocinadores, visibilidad mediática y representación integral.',
    eyebrow: 'Para deportistas',
    image: '/images/action/tennis-serve.jpg',
  },
  {
    slug: 'educacion',
    code: '03',
    title: 'GSM Educación',
    subtitle: 'Colegios · Universidades',
    summary:
      'Ayudamos a colegios y universidades a ordenar, profesionalizar y medir su programa deportivo. Formación por etapa, detección de talento y hábitos saludables.',
    eyebrow: 'Para instituciones educativas',
    image: '/images/action/hockey-grass.jpg',
  },
  {
    slug: 'funding-projects',
    code: '04',
    title: 'Funding & Projects',
    subtitle: 'Clubes · Fundaciones · Federaciones',
    summary:
      'Diseñamos, ordenamos y valorizamos proyectos deportivos para conectarlos con marcas, fondos y donantes. Convertimos ideas en proyectos financiables y medibles.',
    eyebrow: 'Para proyectos',
    image: '/images/detail/stadium-night.jpg',
  },
];

export const STATS = [
  { value: 4,   suffix: '',  label: 'Líneas de servicio', sub: 'Performance, gestión, educación y fondos' },
  { value: 20,  suffix: '+', label: 'Años de trayectoria', sub: 'Experiencia acumulada del equipo fundador' },
  { value: 5,   suffix: '',  label: 'Pasos del método GSM', sub: 'Diagnóstico, estrategia, implementación, seguimiento, resultados' },
  { value: 100, suffix: '%', label: 'Foco en Chile', sub: 'Acompañamiento en cada etapa de la carrera' },
];

export const WHATSAPP_MESSAGES = {
  default: 'Hola, quiero conversar con el equipo GSM.',
  hero: 'Hola GSM, vi el sitio y quiero conocer lo que hacen.',
  servicios: 'Hola GSM, me interesa conocer más sobre sus servicios.',
  athletes: 'Hola GSM, me interesa información sobre representación de atletas.',
  contacto: 'Hola GSM, quiero coordinar una reunión.',
  prevention: 'Hola GSM, me interesa el módulo de prevención que están desarrollando.',
  institucional: 'Hola GSM, represento a un club / federación / fundación y quiero conversar sobre una consultoría.',
};

export function waLink(message: string = WHATSAPP_MESSAGES.default) {
  return `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
