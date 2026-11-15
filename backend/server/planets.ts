import type { Planet } from '../src/lib/spaceApiTypes';

export const planets: Planet[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    summary: 'Mercury is the smallest planet and the closest to the Sun.',
    funFact: 'A year on Mercury lasts just 88 Earth days.',
    sourceUrl: 'https://science.nasa.gov/mercury/facts/',
  },
  {
    id: 'venus',
    name: 'Venus',
    summary: 'Venus is the hottest planet because its thick atmosphere traps heat.',
    funFact: 'On Venus, the Sun rises in the west because Venus spins the opposite way from Earth.',
    sourceUrl: 'https://science.nasa.gov/venus/venus-facts/',
  },
  {
    id: 'earth',
    name: 'Earth',
    summary: 'Earth is our rocky home planet. Oceans cover most of its surface.',
    funFact: 'Earth takes about 365 days and 6 hours to travel once around the Sun.',
    sourceUrl: 'https://science.nasa.gov/earth/facts/',
  },
  {
    id: 'mars',
    name: 'Mars',
    summary: 'Mars is a rocky planet covered in rusty dust that makes it look red.',
    funFact: 'Mars has the largest volcano in the solar system. It is called Olympus Mons.',
    sourceUrl: 'https://science.nasa.gov/mars/facts/',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    summary: 'Jupiter is the largest planet. Bands of clouds wrap around this gas giant.',
    funFact: 'Jupiter’s Great Red Spot is a giant spinning storm.',
    sourceUrl: 'https://science.nasa.gov/jupiter/jupiter-facts/',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    summary: 'Saturn is a gas giant surrounded by bright rings.',
    funFact: 'The rings are made of billions of pieces of ice and rock.',
    sourceUrl: 'https://science.nasa.gov/saturn/facts/',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    summary: 'Uranus is a very cold planet with faint rings.',
    funFact: 'Uranus spins on its side, like a ball rolling around the Sun.',
    sourceUrl: 'https://science.nasa.gov/uranus/facts/',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    summary: 'Neptune is a cold, windy planet and the farthest from the Sun.',
    funFact: 'A year on Neptune lasts about 165 Earth years.',
    sourceUrl: 'https://science.nasa.gov/neptune/neptune-facts/',
  },
];
