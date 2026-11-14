export interface AboutSection {
  id: string;
  title: string;
  paragraphs: string[];
}

/** Editable copy for the "Sobre Nosotros" page. */
export const ABOUT_CONTENT: { title: string; lead: string; sections: AboutSection[] } = {
  title: 'Sobre Nosotros',
  lead: 'Starman nace para acercar la astronomía a estudiantes y docentes.',
  sections: [
    {
      id: 'mision',
      title: 'Nuestra Misión',
      paragraphs: [
        'Hacer la astronomía más accesible mediante recursos educativos claros y confiables, que conecten los conceptos científicos con los entornos de la vida cotidiana.',
      ],
    },
    {
      id: 'vision',
      title: 'Nuestra Visión',
      paragraphs: [
        'Lograr que la educación astronómica sea más atractiva y accesible gracias al aprendizaje interactivo y a experiencias educativas prácticas, dentro y fuera del aula.',
      ],
    },
    {
      id: 'enfoque',
      title: 'Nuestro Enfoque',
      paragraphs: [
        'Relacionamos tres elementos: la información astronómica de la Tierra y la Luna, las características geográficas de lugares reales y las actividades que se pueden realizar en el salón de clases.',
        'Toda la información proviene de fuentes científicas reconocidas, que pueden consultarse en la sección de Recursos.',
      ],
    },
  ],
};
