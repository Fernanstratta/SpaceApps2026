interface EvidenceImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface EvidenceBase {
  product: string;
  period: string;
  sourceUrl: string;
  sourceLabel: string;
  credit: string;
  detail: string;
}

type Evidence = EvidenceBase & (
  | { kind: 'image'; image: EvidenceImage; scale: string }
  | {
    kind: 'thermal-model';
    quantity: string;
    unit: 'K';
    samples: readonly { latitude: number; longitude: number; value: number }[];
  }
);

interface Comparison {
  id: string;
  title: string;
  earth: { name: string; evidence: Evidence };
  destination: { name: string; evidence: Evidence };
  commonGround: string;
  limitations: string;
}

export const comparisons: readonly Comparison[] = [
  {
    id: 'moon-comparison',
    title: 'What changes near a pole?',
    earth: {
      name: 'McMurdo Dry Valleys, Antarctica',
      evidence: {
        kind: 'image',
        product: 'Terra MODIS Corrected Reflectance (True Color)',
        period: '2024-01-15',
        sourceUrl: 'https://worldview.earthdata.nasa.gov/?v=159,-78.5,167,-76.5&l=MODIS_Terra_CorrectedReflectance_TrueColor&t=2024-01-15',
        sourceLabel: 'Open this date and region in NASA Worldview',
        credit: 'NASA EOSDIS Worldview / GIBS · Terra MODIS',
        scale: '250 m nominal layer resolution',
        detail: 'On this summer day, dark, exposed valleys stand out against bright snow and glacial ice.',
        image: {
          src: '/space/analogs/mcmurdo-2024-01-15.webp',
          alt: 'Exposed rock in the McMurdo Dry Valleys between snow-covered mountains and glaciers',
          width: 800,
          height: 450,
        },
      },
    },
    destination: {
      name: 'Lunar south pole',
      evidence: {
        kind: 'thermal-model',
        product: 'LRO Diviner South Polar Resource Product · DLRE_PRP_SOUTH.TAB',
        period: 'First year of LRO mapping orbit',
        sourceUrl: 'https://doi.org/10.17189/1520650',
        sourceLabel: 'View the Diviner archive product',
        credit: 'NASA PDS Geosciences · LRO Diviner team, UCLA',
        detail: 'Annual maxima from a thermal model fitted to Diviner observations. The two neighboring terrain cells are sampled near the pole. Their peak temperatures may occur at different times.',
        quantity: 'Modeled annual maximum surface temperature',
        unit: 'K',
        samples: [
          { latitude: -89.98755, longitude: 116.56477, value: 214.3 },
          { latitude: -89.97509, longitude: 116.56489, value: 292.0 },
        ],
      },
    },
    commonGround: 'Low-angle sunlight and terrain shape where shadows fall in both polar environments.',
    limitations: 'Snow and ice are visible in the Antarctic image. Diviner measures infrared radiation, and the model estimates how warm the lunar ground gets. These two temperatures provide no direct evidence of ice. The Earth preview supplies neither an air temperature nor a land-surface temperature for comparison.',
  },
  {
    id: 'mars-comparison',
    title: 'What can a dry landscape tell us?',
    earth: {
      name: 'Atacama Desert, Chile',
      evidence: {
        kind: 'image',
        product: 'Terra MODIS Corrected Reflectance (True Color)',
        period: '2024-06-15',
        sourceUrl: 'https://worldview.earthdata.nasa.gov/?v=-70.7,-24.6,-67.5,-22&l=MODIS_Terra_CorrectedReflectance_TrueColor&t=2024-06-15',
        sourceLabel: 'Open this date and region in NASA Worldview',
        credit: 'NASA EOSDIS Worldview / GIBS · Terra MODIS',
        scale: '250 m nominal layer resolution',
        detail: 'A broad view of bare ridges and basins around the Salar de Atacama.',
        image: {
          src: '/space/analogs/atacama-2024-06-15.webp',
          alt: 'Rocky desert ridges, broad basins and bright salt flats in northern Chile',
          width: 800,
          height: 650,
        },
      },
    },
    destination: {
      name: 'Gale Crater, Mars',
      evidence: {
        kind: 'image',
        product: 'MRO HiRISE RDR · ESP_023957_1755_RED',
        period: '2011-09-06 · 14:10 local Mars time',
        sourceUrl: 'https://www.uahirise.org/ESP_023957_1755',
        sourceLabel: 'View the HiRISE PDS product and label',
        credit: 'NASA/JPL-Caltech/UArizona',
        scale: '0.25 m/pixel in the full PDS product',
        detail: 'Grayscale crop of the reduced PDS browse image. The equirectangular product is north-up and uses planetocentric latitude and east-positive longitude.',
        image: {
          src: '/space/analogs/gale-hirise.webp',
          alt: 'Detailed grayscale HiRISE view of ridges and textured ground in Gale Crater',
          width: 800,
          height: 625,
        },
      },
    },
    commonGround: 'Bare terrain makes ridges and basins easier to see. The Atacama gives us a place on Earth to practice reading a dry landscape from orbit.',
    limitations: 'This is a qualitative comparison. The two images cover different areas at very different scales. Visual similarities alone cannot tell us whether water, wind, or another process shaped a feature. The Atacama has Earth’s atmosphere and water cycle. Gale Crater has a thin Martian atmosphere.',
  },
];
