import type { CommonsImage } from '../types';

/**
 * Real-world photographs used by the Portal Educativo. Every entry was checked
 * on Wikimedia Commons: NASA and USGS works are in the public domain in the
 * United States; one image is a CC0 dedication. Credits are listed on the
 * portal page and under each banner.
 */
export const images: CommonsImage[] = [
  {
    id: 'blue-marble',
    file: 'The_Earth_seen_from_Apollo_17.jpg',
    commonsPath: '9/97',
    alt: 'La Tierra completa vista desde la nave Apolo 17, con África y la Antártida visibles.',
    author: 'NASA / tripulación del Apolo 17',
    license: 'Dominio público',
  },
  {
    id: 'first-earthrise',
    file: 'AS08-13-2329.jpg',
    commonsPath: '0/09',
    alt: 'La Tierra, pequeña y parcialmente iluminada, sobre el horizonte de la Luna.',
    author: 'NASA / William Anders (Apolo 8)',
    license: 'Dominio público',
  },
  {
    id: 'young-jump',
    file: 'John_W._Young_on_the_Moon.jpg',
    commonsPath: 'b/b3',
    alt: 'El astronauta John Young salta sobre la superficie lunar junto al módulo lunar.',
    author: 'NASA / Charles M. Duke Jr. (Apolo 16)',
    license: 'Dominio público',
  },
  {
    id: 'aldrin',
    file: 'Aldrin_Apollo_11_original.jpg',
    commonsPath: '9/98',
    alt: 'El astronauta Buzz Aldrin de pie sobre la superficie de la Luna.',
    author: 'NASA / Neil Armstrong (Apolo 11)',
    license: 'Dominio público',
  },
  {
    id: 'genesis-rock',
    file: 'Genesis_rock_in_situ_AS15-90-12227.jpg',
    commonsPath: '1/18',
    alt: 'La «Roca Génesis» sobre el suelo lunar, junto a un instrumento de escala.',
    author: 'NASA (Apolo 15); recorte de James Stuby',
    license: 'CC0 1.0',
  },
  {
    id: 'bootprint',
    file: 'Apollo_11_bootprint.jpg',
    commonsPath: '8/89',
    alt: 'Huella de una bota de astronauta en el polvo de la Luna.',
    author: 'NASA / Buzz Aldrin (Apolo 11)',
    license: 'Dominio público',
  },
  {
    id: 'earthrise',
    file: 'NASA-Apollo8-Dec24-Earthrise.jpg',
    commonsPath: 'a/a8',
    alt: '«Salida de la Tierra»: la Tierra aparece sobre el horizonte lunar.',
    author: 'NASA / Bill Anders (Apolo 8)',
    license: 'Dominio público',
  },
  {
    id: 'laser-reflector',
    file: 'Apollo_11_Lunar_Laser_Ranging_Experiment.jpg',
    commonsPath: '0/08',
    alt: 'Retrorreflector láser instalado sobre la superficie lunar por el Apolo 11.',
    author: 'NASA (Apolo 11)',
    license: 'Dominio público',
  },
  {
    id: 'diviner-south-pole',
    file: 'Lunar_south_pole_summer.jpg',
    commonsPath: '9/9b',
    alt: 'Mapa de colores de la temperatura de la superficie en el polo sur de la Luna.',
    author: 'NASA / GSFC / UCLA (instrumento Diviner, LRO)',
    license: 'Dominio público',
  },
  {
    id: 'mexico-from-iss',
    file: 'ISS016-E-23441_-_View_of_Mexico.jpg',
    commonsPath: '0/07',
    alt: 'Territorio de México fotografiado desde la Estación Espacial Internacional.',
    author: 'NASA / Expedición 16 de la Estación Espacial Internacional',
    license: 'Dominio público',
  },
  {
    id: 'barringer',
    file: 'Barringer_Crater_aerial_photo_by_USGS.jpg',
    commonsPath: '0/0c',
    alt: 'Vista aérea del cráter Barringer, un cráter de impacto en el desierto de Arizona.',
    author: 'USGS / D. Roddy',
    license: 'Dominio público',
  },
  {
    id: 'tycho',
    file: 'LRO_Tycho_Central_Peak.jpg',
    commonsPath: 'b/b3',
    alt: 'Pico central del cráter lunar Tycho proyectando una larga sombra al amanecer.',
    author: 'NASA / GSFC / Arizona State University (LRO)',
    license: 'Dominio público',
  },
  {
    id: 'top-of-atmosphere',
    file: 'Top_of_Atmosphere.jpg',
    commonsPath: 'b/be',
    alt: 'Las capas superiores de la atmósfera terrestre vistas desde la órbita, con la Luna al fondo.',
    author: 'NASA Earth Observatory (Estación Espacial Internacional)',
    license: 'Dominio público',
  },
  {
    id: 'iss-sunset',
    file: 'Sunset_from_the_ISS.JPG',
    commonsPath: '1/13',
    alt: 'Atardecer sobre el océano Índico visto desde la Estación Espacial Internacional.',
    author: 'NASA / Expedición 23 de la Estación Espacial Internacional',
    license: 'Dominio público',
  },
  {
    id: 'greenland-iceberg',
    file: 'Iceberg_in_North_Star_Bay,_Greenland.jpg',
    commonsPath: 'e/e6',
    alt: 'Un iceberg atrapado en el hielo marino de una bahía de Groenlandia.',
    author: 'NASA / Jeremy Harbeck (Operación IceBridge)',
    license: 'Dominio público',
  },
  {
    id: 'antarctic-sea-ice',
    file: 'The_ice_covering_the_Bellingshausen_Sea,_off_the_coast_of_Antarctica.jpg',
    commonsPath: '7/72',
    alt: 'Hielo marino que cubre el mar de Bellingshausen, frente a la Antártida.',
    author: 'NASA / Michael Studinger (Operación IceBridge)',
    license: 'Dominio público',
  },
  // Sitios lunares de los pares de Terranauta Playground (mismos archivos que su catálogo).
  {
    id: 'apollo11-lro',
    file: 'LRO_Gets_Additional_View_of_Apollo_11_Landing_Site_(4092985062).jpg',
    commonsPath: 'a/a5',
    alt: 'Vista orbital de la planicie de Mare Tranquillitatis con pequeños cráteres, donde alunizó el Apolo 11.',
    author: 'NASA Goddard Space Flight Center (LRO)',
    license: 'Dominio público',
  },
  {
    id: 'shackleton-lroc',
    file: 'Shackleton_Crater.jpg',
    commonsPath: 'd/d5',
    alt: 'El cráter Shackleton, en el polo sur lunar, con el interior en sombra y el borde iluminado.',
    author: 'Equipos de LROC y ShadowCam (NASA/KARI/ASU)',
    license: 'Dominio público',
  },
  {
    id: 'marius-pit',
    file: 'Marius_hills_pit.png',
    commonsPath: '6/63',
    alt: 'Dos vistas orbitales de un pozo oscuro en la superficie lunar, en Marius Hills.',
    author: 'NASA / equipo LROC, Arizona State University',
    license: 'Dominio público',
  },
  {
    id: 'gruithuisen-apollo15',
    file: 'Gruithuisen_domes_AS15-93-12717.jpg',
    commonsPath: '6/65',
    alt: 'Vista oblicua desde la órbita de los domos volcánicos de Gruithuisen junto a un mar lunar.',
    author: 'James Stuby, a partir de una imagen de NASA (Apolo 15)',
    license: 'Dominio público',
  },
  {
    id: 'linne-lro',
    file: 'Linne_(LRO)_1.png',
    commonsPath: '9/92',
    alt: 'El cráter lunar Linné, circular y en forma de tazón, visto desde la órbita.',
    author: 'NASA (LRO, cámara NAC)',
    license: 'Dominio público',
  },
];

const imageMap = new Map(images.map((image) => [image.id, image]));

export function getImage(id: string): CommonsImage | undefined {
  return imageMap.get(id);
}
