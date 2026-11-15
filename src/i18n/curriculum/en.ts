import type { CurriculumText } from './types';

/** Teaching texts for the nine axes (English, same shape as `es.ts`). */
export const curriculumEn: CurriculumText = {
  axes: {
    slope: {
      student: {
        tagline: 'Where is it safe to land?',
        overview:
          'A spacecraft or a vehicle needs almost flat ground: on a hillside it can tip over or slide. In this axis you will learn what slope is and how it is measured from space with elevation models.\n\nThen you will apply it to two real pairs: a dry lakebed in Baja California that resembles the plain where Apollo 11 landed, and a mountain range that shows where not to land.',
      },
      teacher: {
        tagline: 'Slope: the first criterion for choosing a landing site',
        overview:
          'The module takes the group from the concept of slope to its measurement with digital elevation models, and ends with two pairs: Laguna Salada ↔ Mare Tranquillitatis (safe terrain) and Sierra Cucapá ↔ Shackleton rim (risk counterexample).',
        objectives: [
          'Define slope and relate it to the safety of a landing.',
          'Explain how slope is obtained from an elevation model and why it depends on scale.',
          'Compare a Baja California site with a lunar one using the slope criterion.',
        ],
      },
      concept: {
        introduction:
          'Imagine you have to park a spacecraft somewhere nobody has ever stepped. The first thing you need to know is whether the ground is flat or tilted. That tilt is called slope.',
        concepts: [
          { term: 'Slope', definition: 'How steep the ground is compared with the horizontal; it is given in degrees.' },
          {
            term: 'Digital elevation model (DEM)',
            definition: 'A map in which each pixel stores the height of the ground; slope is calculated from it.',
          },
          {
            term: 'Safety threshold',
            definition: 'The slope below which an area is considered safe for landing; this axis uses 10°.',
          },
        ],
        activity: {
          title: 'Cardboard ramps',
          description:
            'Tilt a board or a piece of cardboard at different angles and put a toy car on it. Notice at what tilt it starts to roll or tip over, and explain what would happen to a landing module.',
          type: 'model',
        },
        discussion: ['Why did Apollo 11 choose a plain to land?', 'What are the risks of landing on a slope?'],
      },
    },
    roughness: {
      student: {
        tagline: 'Smooth, rocky or rugged',
        overview:
          'Two pieces of ground can be equally flat and yet one can be covered in loose rocks. Roughness describes those small irregularities, from centimeters to meters.\n\nYou will see how a radar signal bouncing off the surface reveals roughness, and compare lava fields and mountain ranges of the region with sites on the Moon.',
      },
      teacher: {
        tagline: 'Roughness: what the slope map does not show',
        overview:
          'Roughness is distinguished from slope, radar detection of rocky surfaces is explained qualitatively, and so is why percentiles are compared when the instruments differ. It is applied to Pinacate ↔ Marius Hills and Sierra Cucapá ↔ Shackleton.',
        objectives: [
          'Distinguish between the slope and the roughness of a surface.',
          'Explain qualitatively how radar detects rocky surfaces.',
          'Justify why percentiles are compared when each body is measured with a different instrument.',
        ],
      },
      concept: {
        introduction:
          'If you run your hand over a table and then over a gravel path, you feel the difference even though both are flat. That difference is roughness.',
        concepts: [
          {
            term: 'Roughness',
            definition: 'Small-scale irregularities of a surface (from centimeters to meters), such as rocks and loose blocks.',
          },
          {
            term: 'Radar',
            definition: 'An instrument that sends radio waves and measures the signal that comes back; a rough surface scatters more of that signal.',
          },
          {
            term: 'Percentile',
            definition: 'The position of a value within its group, from 0 to 1: a percentile of 0.9 means the value is higher than 90% of the group.',
          },
        ],
        activity: {
          title: 'Grazing light',
          description:
            'Light a smooth sheet of paper and a tray of gravel with a lamp from one side. Compare the shadows and relate what you see to the way a rough surface scatters a radar signal.',
          type: 'observation',
        },
        discussion: [
          'Why can a vehicle have trouble on ground that is flat but rocky?',
          'What is the advantage of comparing percentiles instead of raw values?',
        ],
      },
    },
    mineralogy: {
      student: {
        tagline: 'Dark rocks, light rocks',
        overview:
          'Rocks keep the story of how a place formed. You will learn the difference between mafic rocks, like the dark basalt of the lunar maria, and felsic rocks, rich in silica.\n\nYou will also see how satellites recognize composition without touching the ground, and why Baja California and Sonora have volcanoes that help us understand the Moon.',
      },
      teacher: {
        tagline: 'Composition: together with slope, the heaviest axis',
        overview:
          'The module works with the felsic–mafic scale, reading composition with sensors from orbit, and its application to three pairs: El Elegante ↔ Linné, Pinacate ↔ Marius Hills and Cerro Prieto ↔ Gruithuisen.',
        objectives: [
          'Classify rocks as mafic or felsic according to their composition.',
          'Explain that composition can be estimated from space with sensors.',
          'Relate composition to the resources and the geological history of a site.',
        ],
      },
      concept: {
        introduction:
          'Not all rocks are the same: some are dark and heavy, others light and rich in silica. Knowing what a rock is made of tells us how it formed and what resources it can offer.',
        concepts: [
          { term: 'Mafic rock', definition: 'A rock rich in iron and magnesium, usually dark; basalt is the most common example.' },
          { term: 'Felsic rock', definition: 'A rock rich in silica and feldspar, usually light; granite and dacite are examples.' },
          {
            term: 'Anorthosite',
            definition: 'A light, feldspar-rich rock that forms the lunar highlands; there is none in Baja California or Sonora.',
          },
        ],
        activity: {
          title: 'Sort your rocks',
          description:
            'Collect rocks from around you, or photos of rocks, and sort them from lightest to darkest. Find out which could be basalt and explain how they resemble the lunar maria.',
          type: 'observation',
        },
        discussion: [
          'Why do the lunar maria look dark from Earth?',
          'What does rock composition tell us about the resources a base could use?',
        ],
      },
    },
    albedo: {
      student: {
        tagline: 'How much light does the ground reflect?',
        overview:
          'From Earth we see the Moon with light and dark patches: that is albedo, the fraction of light each surface reflects. You will learn what it is and how it is calculated with satellite images.\n\nThen you will see why a bright salt flat and a dark lunar mare can be alike in other axes even though their albedo is very different.',
      },
      teacher: {
        tagline: 'Albedo: light, temperature and composition',
        overview:
          'Albedo is defined as the fraction of reflected light (from 0 to 1), related to surface heating and to composition, and the pairs where it matches and where it does not are analyzed, such as Laguna Salada ↔ Mare Tranquillitatis.',
        objectives: [
          'Define albedo as the fraction of sunlight a surface reflects.',
          'Relate albedo to how much a surface heats up.',
          'Recognize when two sites are alike in one axis but not in albedo.',
        ],
      },
      concept: {
        introduction:
          'A white T-shirt and a black one do not heat up the same in the sun. The difference is how much light each one reflects: that is albedo.',
        concepts: [
          { term: 'Albedo', definition: 'The fraction of sunlight a surface reflects; it goes from 0 (none) to 1 (all).' },
          { term: 'Reflectance', definition: 'The proportion of light a surface reflects in a specific color or band.' },
          { term: 'Spectral band', definition: 'A range of colors or wavelengths recorded by a satellite sensor.' },
        ],
        activity: {
          title: 'White versus black',
          description:
            'Put two glasses of water in the sun, one wrapped in white paper and the other in black paper. After a while compare their temperature (by touch or with a thermometer) and relate the result to albedo.',
          type: 'observation',
        },
        discussion: [
          'Why does a dark surface heat up more than a light one under the same Sun?',
          'Can a site be a good lunar analog even if its albedo is different?',
        ],
      },
    },
    thermal: {
      student: {
        tagline: 'Scorching days, freezing nights',
        overview:
          'In the Sonoran Desert days are hot and nights are cool, but on the Moon the difference is much larger because there is no atmosphere to hold the heat.\n\nYou will learn what thermal amplitude is, how it is measured from orbit and why this axis is compared with a ratio instead of a subtraction.',
      },
      teacher: {
        tagline: 'Thermal amplitude: the role of the atmosphere',
        overview:
          'The module connects thermal amplitude with the atmosphere, presents its measurement with MODIS on Earth and Diviner on the Moon, and uses the El Elegante ↔ Linné pair, whose values for this axis are still provisional estimates.',
        objectives: [
          'Define thermal amplitude as the difference in temperature between day and night.',
          'Explain the role of the atmosphere in the temperature of a surface.',
          'Justify why this axis is compared with a logarithmic ratio.',
        ],
      },
      concept: {
        introduction:
          'After a sunny day, a stone is still warm at dusk and cools down little by little. On the Moon, with no air or clouds, that cooling is far more extreme.',
        concepts: [
          { term: 'Thermal amplitude', definition: 'The difference between the surface temperature at noon and before dawn.' },
          { term: 'Kelvin (K)', definition: 'A unit of temperature used in science; a change of 1 K equals a change of 1 °C.' },
          {
            term: 'Atmosphere',
            definition: 'A layer of gases around a planet that spreads heat around; the Moon has no atmosphere that does this.',
          },
        ],
        activity: {
          title: 'Temperature diary',
          description:
            'Measure the temperature of a stone or of the schoolyard at noon and early the next morning. Work out the difference and discuss what would happen without an atmosphere.',
          type: 'observation',
        },
        discussion: [
          'What would happen to the temperature of the Earth if it had no atmosphere?',
          'What would a lunar habitat need to withstand those temperature changes?',
        ],
      },
    },
    aridity: {
      student: {
        tagline: 'A lifeless world',
        overview:
          'The Moon has no plants, no liquid water and no life. That is why the best analogs on Earth are the driest places with the least vegetation.\n\nYou will learn to measure vegetation from space with the NDVI index and why this axis barely tells deserts apart.',
      },
      teacher: {
        tagline: 'Aridity: measuring vegetation with NDVI',
        overview:
          'NDVI is presented as a measure of vegetation, together with the lunar reference value (NDVI = 0) and why the axis has the lowest weight in the index, using the Laguna Salada ↔ Mare Tranquillitatis case.',
        objectives: [
          'Explain why the absence of life is a feature of the Moon.',
          'Interpret NDVI as a measure of the amount of vegetation.',
          'Argue why this axis barely tells desert sites apart.',
        ],
      },
      concept: {
        introduction:
          'From the Moon, the Earth looks blue, white, green and brown. The Moon, instead, is gray: there are no plants to color its surface.',
        concepts: [
          { term: 'Aridity', definition: 'A lack of water in a place, which limits vegetation and life.' },
          {
            term: 'NDVI',
            definition: 'A vegetation index calculated from the red and infrared light that plants reflect; it goes from −1 to 1.',
          },
          { term: 'Near infrared', definition: 'Light we cannot see that healthy plants reflect very strongly.' },
        ],
        activity: {
          title: 'Green map',
          description:
            'Find a satellite image of your city or region. Mark the areas with vegetation and the desert areas, and explain which ones would be most like the Moon.',
          type: 'exploration',
        },
        discussion: [
          'Why can vegetation confuse the measurements of other axes?',
          'Why does almost any desert resemble the Moon in this axis?',
        ],
      },
    },
    volatiles: {
      student: {
        tagline: 'Hidden water',
        overview:
          'On Earth, water is in rivers, seas, glaciers and the soil. On the Moon it can only survive as ice in very cold places, inside polar craters that never get sunlight.\n\nYou will learn how water is searched for from space and why the sites in the region are dry, while there may be stable ice at the lunar south pole.',
      },
      teacher: {
        tagline: 'Subsurface ice: the resource that motivates a lunar base',
        overview:
          'The module works with the moisture classes (from 0, dry, to 3, stable ice), the idea of a cold trap and “similarity by absence”, using the Sierra Cucapá ↔ Shackleton contrast.',
        objectives: [
          'Describe where water is found on Earth and where there may be ice on the Moon.',
          'Explain what a cold trap is and why it preserves ice.',
          'Recognize that two dry sites are alike without providing information (“similarity by absence”).',
        ],
      },
      concept: {
        introduction:
          'Water is the most valuable thing for a lunar base: it can be drunk, split to get oxygen or used to make fuel. Where could we find it?',
        concepts: [
          {
            term: 'Volatile',
            definition: 'A substance that easily turns into gas, such as water; on the Moon it only survives frozen in very cold places.',
          },
          { term: 'Cold trap', definition: 'A permanently shadowed area inside polar craters, so cold that ice can last.' },
          { term: 'Soil moisture', definition: 'The amount of water in the soil; on Earth it is measured from satellites.' },
        ],
        activity: {
          title: 'Ice in the shade',
          description:
            'Place two identical ice cubes, one in the sun and the other somewhere always in the shade. Compare how long they take to melt and relate it to the craters at the lunar south pole.',
          type: 'observation',
        },
        discussion: ['Why is lunar ice searched for at the poles and not at the equator?', 'What does it mean that two dry sites are “similar by absence”?'],
      },
    },
    dust: {
      student: {
        tagline: 'Dust that sticks to everything',
        overview:
          'The Apollo footprints are still marked in the lunar dust, a soil of very fine grains. You will learn what regolith is and how the fine-dust fraction of a soil is measured.\n\nThen you will compare the dust of Laguna Salada with the Moon’s: how they are alike and what moves the dust in each place.',
      },
      teacher: {
        tagline: 'Fine regolith: a useful axis for discussion',
        overview:
          'Regolith and the fine fraction are defined, their sources are presented (soil models on Earth and Apollo samples on the Moon), and the group discusses why the axis has low confidence, using the Laguna Salada ↔ Mare Tranquillitatis case.',
        objectives: [
          'Define regolith and the fine fraction of a soil.',
          'Explain why lunar dust is a hazard for suits and equipment.',
          'Compare what moves dust on Earth and on the Moon.',
        ],
      },
      concept: {
        introduction:
          'When astronauts walked on the Moon, the dust stuck to their suits and got into their equipment. That dust is part of the regolith.',
        concepts: [
          { term: 'Regolith', definition: 'A layer of rock fragments and loose dust that covers the surface of the Moon.' },
          { term: 'Fine fraction', definition: 'The part of a soil made of very small particles (silt and clay), the size of dust.' },
          {
            term: 'Electrostatic charge',
            definition: 'Electricity built up on particles, which makes lunar dust cling to surfaces.',
          },
        ],
        activity: {
          title: 'Sift your soil',
          description:
            'Pass a soil sample through sieves of different sizes and separate the sand from the fine dust. Compare how much there is of each and relate the result to lunar regolith.',
          type: 'model',
        },
        discussion: ['Why is lunar dust so abrasive?', 'What moves dust in a desert, and what moves it on the Moon?'],
      },
    },
    craters: {
      student: {
        tagline: 'The shape tells a story',
        overview:
          'The Moon is covered in craters, and Sonora has volcanic craters about the size of some lunar ones. You will learn how a crater forms and how its shape is measured with the depth/diameter ratio.\n\nThen you will see why El Elegante and Linné look so alike even though their origins are opposite.',
      },
      teacher: {
        tagline: 'Crater morphology: measuring d/D',
        overview:
          'Impact and volcanic craters are compared, the d/D ratio is calculated from published dimensions and applied to El Elegante ↔ Linné (the only pair with published data at both sites), Pinacate ↔ Marius Hills and Cerro Prieto ↔ Gruithuisen.',
        objectives: [
          'Tell an impact crater from a volcanic one.',
          'Calculate the depth/diameter ratio (d/D) of a crater.',
          'Explain why craters are better preserved on the Moon than on Earth.',
        ],
      },
      concept: {
        introduction:
          'If you drop a stone into sand, it makes a hole with a raised rim. Many craters on the Moon formed in a similar way, but from meteorites travelling very fast.',
        concepts: [
          { term: 'Impact crater', definition: 'A depression that forms when a meteorite hits the surface.' },
          {
            term: 'Maar',
            definition: 'A volcanic crater that forms when magma touches groundwater and causes a steam explosion.',
          },
          {
            term: 'd/D ratio',
            definition: 'The depth of a crater divided by its diameter; it shows how deep it is compared with its size.',
          },
        ],
        activity: {
          title: 'Craters in a tray',
          description:
            'Fill a tray with flour and cover it with a thin layer of cocoa. Drop marbles from different heights, measure the diameter and depth of each crater and calculate its d/D ratio.',
          type: 'model',
        },
        discussion: ['Why does the Moon keep more craters than the Earth?', 'How can a volcanic crater look like an impact crater?'],
      },
    },
  },

  templates: {
    blocks: {
      measures: 'What does this axis measure?',
      why: 'Why does it matter on the Moon?',
      earth: 'How it is measured on Earth',
      moon: 'How it is measured on the Moon',
      notes: 'Precautions when comparing',
      breaks: 'Where the analogy breaks:',
    },
    concept: {
      facts: (n, total, pairs) => [
        `This is axis ${n} of the ${total} that the Lunar Similarity Index uses to compare the Earth and the Moon.`,
        pairs === 1
          ? 'One pair of Baja California and Sonora sites with the Moon is studied in this axis (you will see it in the third submodule).'
          : `${pairs} pairs of Baja California and Sonora sites with the Moon are studied in this axis (you will see them in the third submodule).`,
      ],
      conclusion: (axis) =>
        `Now you know what the “${axis}” axis describes and why it matters for exploring the Moon. In the next submodule you will see how it is measured on each body.`,
      objectives: (axis, terms) => [
        `Explain in their own words what the “${axis}” axis measures.`,
        'Argue why this axis matters for exploring the Moon.',
        `Use these terms correctly: ${terms}.`,
      ],
      assessment: [
        'Ask each student to explain in their own words what the axis measures and to give an example.',
        'Review the record and conclusions of the activity.',
      ],
      outcomes: (axis) => [
        `The group describes what the “${axis}” axis measures with examples from the Earth and the Moon.`,
        'The group relates the axis to at least one challenge of lunar exploration.',
      ],
    },
    measurement: {
      introduction: (axis) =>
        `To compare the Earth and the Moon in the “${axis}” axis, each site needs a value. Each body uses different instruments and data, so first we need to understand where each value comes from and how they are compared.`,
      metric: 'Axis metric',
      formulas: {
        linear: {
          term: 'Linear comparison',
          definition:
            'The difference between the Earth value and the Moon value is calculated: similarity drops from 100 to 0 as that difference approaches the axis tolerance.',
        },
        log: {
          term: 'Logarithmic ratio',
          definition:
            'It compares how many times larger one value is than the other, because the magnitudes differ by orders of magnitude: if one is 10 times the other, similarity is 0.',
        },
      },
      tolerance: {
        term: 'Tolerance (R)',
        definition: (value) => `The difference at which similarity reaches 0. For this axis, R = ${value}.`,
      },
      confidence: {
        term: (level) => `Confidence ${level}`,
        definition: (meaning) => meaning,
      },
      facts: {
        weight: (weight, total) => `In the Lunar Similarity Index this axis has a weight of ${weight}, out of a total weight of ${total}.`,
        absence: (weight) =>
          `If both sites are dry, similarity comes out as 100 but carries no information; in that case the weight of the axis drops to ${weight}.`,
      },
      activity: (axis) => ({
        title: 'Instrument table',
        description: `Make a table with two columns, Earth and Moon, and write down which instrument or data is used on each body for the “${axis}” axis. Then explain in your own words why the same one is not used on both.`,
      }),
      conclusion:
        'Now you know where the data for this axis come from and what precautions to take when comparing them. In the next submodule you will apply them to real sites in Baja California and Sonora.',
      objectives: (axis, metric) => [
        `Identify which data or instrument is used on the Earth and on the Moon for the “${axis}” axis.`,
        `Interpret the axis metric: ${metric}.`,
        'Explain why scale and calibration matter when comparing data from two bodies.',
      ],
      discussion: (level) => [
        'Why can’t the same instrument be used on the Earth and on the Moon?',
        `What does it mean that this axis has confidence ${level}? How sure can we be of a comparison?`,
      ],
      assessment: [
        'Review each team’s instrument table.',
        'Ask each team to explain one precaution to take when comparing the data.',
      ],
      outcomes: (level) => [
        'The group distinguishes the data sources used on each body.',
        `The group explains what the axis’ confidence ${level} implies for interpreting a comparison.`,
      ],
    },
    analogs: {
      introduction: (axis, n) =>
        `Now it is time to apply the “${axis}” axis to real sites. ${
          n === 1
            ? 'This pair of Baja California and Sonora sites with the Moon is studied in this axis: you will see'
            : `These ${n} pairs of Baja California and Sonora sites with the Moon are studied in this axis: for each one you will see`
        } how the sites are alike and where the analogy breaks.`,
      none: (axis) => `There are no site pairs associated with the “${axis}” axis yet.`,
      concepts: [
        {
          term: 'Terrestrial analog',
          definition: 'A place on Earth that resembles one on another body in some features and is used to study it or to train.',
        },
        { term: 'Expected strong axis', definition: 'An axis in which a pair of sites is expected to show higher similarity.' },
        {
          term: 'Where the analogy breaks',
          definition: 'An important difference between the two sites that limits what can be concluded by comparing them.',
        },
      ],
      facts: {
        strong: (pair, axis) => `In the ${pair} pair, “${axis}” is an expected strong axis.`,
        published: (pair, earth, moon) => `${pair}: published values at both sites — Earth ${earth}, Moon ${moon}.`,
        provisional: (pair, earth, moon) =>
          `${pair}: there are only provisional estimates (Earth ${earth}, Moon ${moon}); they stay out of the index until they are measured.`,
      },
      questionTitle: (pair) => `Question: ${pair}`,
      playground: (axis) => ({
        title: 'Explore in Starman Playground',
        description: `Open Starman Playground, filter by the “${axis}” axis and compare the photos and the sheet of the sites in this submodule.`,
      }),
      conclusion: (axis) =>
        `With these pairs you saw that the “${axis}” axis helps compare the Earth and the Moon, but no analogy is perfect: you always have to check where it breaks.`,
      explanation: (axis) =>
        `Present each pair from the “${axis}” axis: what the two sites have in common and which differences limit the comparison.`,
      discussion: (axis) => [
        `In which pair are the sites most alike in the “${axis}” axis? Why?`,
        'Which difference between the Earth and the Moon explains each break in the analogy?',
        'What data would be needed to confirm the comparison?',
      ],
      objectives: [
        'Apply the axis to real pairs of Baja California and Sonora sites with the Moon.',
        'Identify how the sites are alike and where the analogy breaks.',
        'Formulate research questions from a pair of sites.',
      ],
      assessment: [
        'Ask each team for a sheet on one pair: how the sites are alike and where the analogy breaks.',
        'Assess the quality of the answers to each pair’s question.',
      ],
      outcomes: [
        'The group compares a site in the region with a lunar one using the axis.',
        'The group recognizes at least one limitation of each analogy.',
      ],
    },
    teacherPlayground: (axis, stage) => ({
      title: 'Guided exploration in Starman Playground',
      description:
        stage === 'analogs'
          ? `Project Starman Playground, turn on the “${axis}” filter and go through the associated pairs with the group: select each area by its number and discuss how the sites are alike.`
          : `To close the session, project Starman Playground with the “${axis}” filter on to show which sites of the region will be studied in this axis.`,
    }),
  },
};
