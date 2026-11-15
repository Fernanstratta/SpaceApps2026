import type { RoverMissionText } from './rover.es';

/** Mission 01 copy in English. Same shape as `rover.es.ts`. */
export const roverEn: RoverMissionText = {
  meta: {
    code: 'Mission 01',
    lab: 'Mission lab',
    title: 'Where would you test a rover before sending it to the Moon?',
    lead: 'Compare two craters on Earth with a crater on the Moon, choose where to rehearse a rover maneuver, and defend your decision with evidence.',
    ages: 'Ages 12–17',
    badges: ['Free', 'No account', '45-minute class', 'Open data from NASA and other agencies'],
    startCta: 'Start mission',
    teachCta: 'Teach this class',
    studentPageTitle: 'Start mission',
    teacherPageTitle: 'Teach this class',
  },

  challenge: {
    title: 'The challenge',
    intro:
      'An engineering team needs to rehearse a rover maneuver on Earth before sending the rover to the Moon. You decide where.',
    maneuverTitle: 'The maneuver to rehearse',
    maneuver:
      'Drive down the inner wall of a crater and back up to the rim, like the terrain the Apollo 16 lunar rover found at North Ray crater.',
    roverLimit: (deg: number) => `Key fact: the Apollo lunar rover could climb and descend slopes of up to ${deg}°.`,
    panoramaAlt:
      'Panorama of the rim of North Ray crater taken by the Apollo 16 lunar rover’s TV camera; the astronauts are standing near the rim.',
    panoramaCaption: 'Apollo 16 Station 11: the rover next to the rim of North Ray crater.',
  },

  roles: {
    candidate: 'Candidate on Earth',
    reference: 'Lunar reference',
  },

  sites: {
    'el-elegante': {
      name: 'El Elegante crater',
      place: 'Gran Desierto de Altar, Sonora, Mexico',
      kind: 'Volcanic maar',
      photoAlt: 'The walls of El Elegante crater seen from the rim: slopes of volcanic rock and the flat desert floor.',
      facts: [
        { text: 'It is a maar (a volcanic explosion crater) about 1.6 km wide.', source: 'photo-elegante' },
        { text: 'The region served as an early training site for Apollo astronauts in the 1960s.', source: 'nasa-eo-pinacate' },
        { text: 'It is surrounded by the Gran Desierto, one of North America’s largest dune fields.', source: 'nasa-eo-pinacate' },
      ],
    },
    'meteor-crater': {
      name: 'Meteor Crater (Barringer crater)',
      place: 'Arizona, United States',
      kind: 'Impact crater',
      photoAlt: 'Aerial view of Meteor Crater: a circular impact crater with a raised rim on a desert plain.',
      facts: [
        { text: 'It is the best-preserved exposed impact crater on Earth.', source: 'usgs-arizona-training' },
        { text: 'It is one of the northern Arizona sites where Apollo astronauts trained.', source: 'usgs-arizona-training' },
        { text: 'It was formed by a meteorite impact: fragments of the Canyon Diablo meteorite were found there.', source: 'photo-barringer' },
      ],
    },
    'north-ray': {
      name: 'North Ray crater',
      place: 'Moon · Apollo 16 landing area',
      kind: 'Impact crater',
      photoAlt: 'North Ray crater seen from orbit by the Apollo 16 panoramic camera: a circular crater with boulders on its rim.',
      facts: [
        { text: 'It is about 1000–1100 m across and about 230 m deep.', source: 'alsj-north-ray' },
        { text: 'Its inner walls slope at roughly 30–35°.', source: 'alsj-north-ray' },
        { text: 'John Young parked the rover close to the rim. He described the slope as “10 or 15 degrees” at first and then “25- to 30-degree”.', source: 'alsj-north-ray' },
      ],
    },
  },

  steps: {
    labels: ['Challenge', 'Log', 'Proposal', 'Review', 'Final sheet'],
    navLabel: 'Mission steps',
    current: (n: number, total: number) => `Step ${n} of ${total}`,
    back: 'Back',
    restart: 'Start over',
    restartConfirm: 'Erase everything and start over?',
    restartYes: 'Yes, erase',
    restartNo: 'Cancel',
    autosave: 'Saved automatically in this browser.',
    errorsTitle: 'Please check the following:',
  },

  step1: {
    title: 'Step 1 · The challenge',
    teamLabel: 'Team name',
    teamPlaceholder: 'e.g. Team Pinacate',
    chooseLabel: 'Provisional site: where would you rehearse the maneuver?',
    chooseHint: 'Before choosing, look at the photos of the three sites in the viewer.',
    hypothesisLabel: 'Hypothesis',
    hypothesisHint: 'e.g. “We think this site works because the photo shows steep walls like North Ray’s.”',
    errorSite: 'Choose a provisional site.',
    errorHypothesis: 'Write a hypothesis of at least 20 characters.',
    next: 'Explore the evidence',
  },

  step2: {
    title: 'Step 2 · Findings log',
    intro:
      'Explore the viewer and record what you find. A finding says where you looked, what data you read and why it matters.',
    tasks: [
      'Switch the view to “Relief” and turn on the slope layer.',
      'Move the profile cursor along the crater wall and compare with North Ray.',
      'Press “Record finding”: choose a point, the whole path or the photo, and write what you observed and why it matters.',
      'Record findings from more than one site. Findings that contradict your hypothesis count too.',
    ],
    tasksLabel: 'What to do',
    errorFinding: 'Record at least one finding from the viewer.',
    errorFindingNote: 'Each finding needs a note of at least 15 characters. Complete the ones that are missing it.',
    next: 'Build the proposal',
  },

  log: {
    title: 'Findings log',
    none: 'No findings yet. Use “Record finding” in the viewer.',
    count: (n: number, max: number) => `${n} of ${max} findings`,
    edit: 'Edit note',
    save: 'Save note',
    cancel: 'Cancel',
    remove: 'Delete',
    removeConfirm: 'Delete this finding?',
    removeYes: 'Yes, delete',
    removeNo: 'No',
    noteMissing: 'Missing note: what did you observe and why does it matter?',
    noteLabel: 'Finding note',
    source: 'Source',
  },

  step3: {
    title: 'Step 3 · Proposal for review',
    intro: 'Prepare the proposal another team will review.',
    provisional: (site: string) => `Your initial choice was: ${site}.`,
    siteLabel: 'Which site do you propose for rehearsing the maneuver?',
    kept: 'You propose the same site you chose at the start.',
    changed: 'You propose a different site from the one you chose at the start.',
    citeLabel: 'Main finding',
    citeHint: 'The finding from your log that best supports your proposal.',
    explanationLabel: 'Why does that finding support your proposal?',
    explanationHint: 'e.g. “The wall’s mean slope is similar to North Ray’s, so…”.',
    limitationLabel: 'One limitation of the comparison',
    limitationHint: 'Think about gravity, the atmosphere, the type of ground, or the resolution of the data.',
    nextDataLabel: 'Data you would like to investigate next',
    nextDataHint: 'e.g. “How loose the ground is on each crater’s wall.”',
    errorProposal: 'Choose the site you propose.',
    errorCite: 'Choose a main finding.',
    errorExplanation: 'Explain why in at least 30 characters.',
    errorLimitation: 'Write a limitation (at least 15 characters).',
    errorNextData: 'Write which data you would investigate (at least 10 characters).',
    printTitle: 'Sheet for review',
    printHint:
      'Print the sheet or save it as a PDF and hand it to your teacher: another team will receive it and write an objection in the blank space.',
    print: 'Print sheet for review',
    preview: 'View the sheet',
    next: 'Record the review',
  },

  step4: {
    title: 'Step 4 · Another team’s review',
    intro:
      'When your sheet comes back, copy the objection and decide what to do. There is no right answer: what counts is the evidence.',
    reviewerLabel: 'Reviewing team (optional)',
    objectionLabel: 'Objection you received',
    objectionHint: 'Copy it exactly as the other team wrote it.',
    decisionLabel: 'After the review…',
    decisions: {
      keep: 'Keep my proposal',
      change: (site: string) => `Change site (to ${site})`,
      'more-evidence': 'We need more evidence',
    },
    decisionHints: {
      keep: 'The objection does not change what the data shows.',
      change: 'The objection or a new finding favors the other site.',
      'more-evidence': 'With the data you have, you cannot decide yet.',
    },
    supportLabel: 'Finding that supports your decision',
    supportHint: 'You can record a new finding in the viewer to answer the objection.',
    reasonLabel: {
      keep: 'Which data supports keeping your proposal?',
      change: 'Which data led you to change sites?',
      'more-evidence': 'Which data is missing, and how would you get it?',
    },
    reasonHint: {
      keep: 'e.g. “We checked the whole path: the wall’s mean slope is also similar to North Ray’s.”',
      change: 'e.g. “Along the whole path, the other site is closer to North Ray in…”.',
      'more-evidence': 'e.g. “We need to know how loose the ground is; we would look for it in…”.',
    },
    errorObjection: 'Copy the objection (at least 15 characters).',
    errorDecision: 'Choose what you do after the review.',
    errorDecisionFinding: 'Choose the finding that supports your decision.',
    errorDecisionReason: 'Explain your decision in at least 30 characters.',
    next: 'View the final sheet',
  },

  step5: {
    title: 'Step 5 · Final sheet',
    intro: 'The final sheet brings together your initial choice, your main finding, the objection and your revised decision.',
    neutral:
      'Starman does not grade which site you chose: any site, or asking for more evidence, is valid if the argument rests on data.',
    print: 'Print final sheet',
    preview: 'View the sheet',
    ready: 'Print it or save it as a PDF from the print dialog.',
  },

  viewer: {
    title: 'Earth–Moon viewer',
    siteTabsLabel: 'Site shown in the viewer',
    viewLabel: 'View',
    photo: 'Photo',
    relief: 'Relief (elevation data)',
    layersLabel: 'Layers',
    slopeLayer: 'Slope',
    transectLayer: 'Rover path',
    directionLabel: 'Path direction',
    westEast: 'West → East',
    northSouth: 'North → South',
    photoNote: 'The photo is not oriented or to scale. Layers are drawn on the relief, which has coordinates.',
    mapLabel: (site: string) => `Relief map of ${site}, 3 × 3 km, with the rover path`,
    north: 'N',
    scaleBar: '1 km',
    legendTitle: 'Slope',
    legend: {
      gentle: 'under 10°',
      moderate: '10–20°',
      steep: '20–25°',
      'over-limit': 'over 25° (rover limit)',
    },
    profileTitle: (site: string) => `Path profile · ${site}`,
    profileDesc: (site: string, direction: string) =>
      `Chart of height against distance along the ${direction} path at ${site}. Use the slider to read each point.`,
    compareMoon: 'Compare with North Ray (Moon)',
    cursorLabel: 'Cursor position along the path',
    distance: 'Distance',
    height: 'Height above the floor',
    elevation: 'Elevation',
    elevationMoon: 'Elevation (relative to the reference lunar sphere)',
    slope: 'Path slope',
    axisDistance: 'Distance along the path (m)',
    axisHeight: 'Height above the floor (m)',
    roverLimit: (deg: number) => `Lunar rover limit: ${deg}°`,
    overLimit: 'steeper than the rover limit',
    exaggeration: (x: string) => `Height exaggerated ×${x} · same vertical scale for all three sites`,
    stats: {
      depth: 'Depth (from the lower rim)',
      maxSlope: 'Maximum wall slope',
      meanSlope: 'Mean wall slope',
      rimToRim: 'Rim to rim',
    },
    record: 'Record finding',
    recordLimit: (max: number) => `Up to ${max} findings. Delete one from the log to record another.`,
    form: {
      title: 'New finding',
      scopeLabel: 'What are you recording?',
      scope: {
        point: 'This point on the profile',
        transect: 'The whole path (wall statistics)',
        photo: 'What you see in the photo',
      },
      noteLabel: 'What did you observe and why does it matter?',
      noteHint: 'e.g. “Here the wall reaches 43°, more than the rover’s limit: we would need to drive down another way.”',
      refresh: 'Use the viewer’s current reading',
      save: 'Save to the log',
      cancel: 'Discard',
      errorNote: 'Write a note of at least 15 characters.',
    },
    simulated: 'Simulated data',
    dataFrom: 'Data',
    resolution: (m: number) => `original resolution ${m} m`,
    photoCredit: 'Photo',
  },

  finding: {
    where: {
      point: (site: string, direction: string, distance: string) => `${site} · ${direction} path · point at ${distance} m`,
      transect: (site: string, direction: string) => `${site} · whole ${direction} path`,
      photo: (site: string) => `${site} · site photo`,
    },
    point: (height: string, slope: string) => `${height} m above the floor · slope of ${slope}° on that segment`,
    transect: (depth: string, rimToRim: string, max: string, mean: string) =>
      `${depth} m deep · ${rimToRim} m rim to rim · wall slope: maximum ${max}°, mean ${mean}°`,
    photo: 'Visual observation from the photo (no measurement)',
    consulted: 'Consulted',
    layers: {
      photo: 'photo',
      profile: 'terrain profile',
      slope: 'slope layer',
      compared: 'compared with North Ray',
    },
  },

  sheet: {
    reviewHeading: 'Sheet for review',
    finalHeading: 'Final sheet',
    team: 'Team',
    noTeam: 'Unnamed',
    date: 'Date',
    maneuver: 'Maneuver',
    initialChoice: 'Initial choice',
    proposal: 'Proposal',
    hypothesis: 'Initial hypothesis',
    mainFinding: 'Main finding',
    explanation: 'Why it supports the proposal',
    limitation: 'Limitation of the comparison',
    nextData: 'Next data to investigate',
    reviewBox: 'For the reviewing team',
    reviewerTeam: 'Reviewing team',
    objectionPrompt:
      'Objection: a question or a piece of data that tests the proposal. It must be checkable in the viewer.',
    objectionExample: 'Example: “Does the slope you cite apply to the whole route or only to the point you marked?”',
    objection: 'Objection received',
    revisedDecision: 'Revised decision',
    pending: 'No site for now: you need more evidence',
    decisionReason: {
      keep: 'Data that supports the decision',
      change: 'Data that supports the decision',
      'more-evidence': 'Data that is missing',
    },
    supportingFinding: 'Supporting finding',
    neutral:
      'Starman does not grade the chosen site. What matters is that the evidence can be located, that it supports the decision and that the team recognizes what is still missing.',
    reference: 'Lunar reference',
    sources: 'Data sources',
    closing: 'What evidence would make us change our minds?',
  },

  guide: {
    title: 'Teacher guide · 45 minutes',
    intro:
      'A free guide to teach Mission 01 without an account. Teams investigate, compare evidence and defend their own decision: there is no single right answer.',
    print: 'Print guide',
    openStudent: 'Open the student view',
    onThisPage: 'In this guide',
    objectiveTitle: 'Objective',
    objective:
      'Each team chooses a place on Earth to rehearse a lunar rover maneuver and justifies it with topographic evidence, explaining which feature of the lunar terrain it reproduces and what the limitations of the comparison are.',
    audienceTitle: 'Audience',
    audience: 'Middle and high school (ages 12–17). Teams of 3 or 4 students.',
    materialsTitle: 'Materials',
    materials: [
      'One device with a web browser per team (computer, tablet or phone), or a projector for the whole class.',
      'An internet connection for the photos. The elevation data is already included in the app.',
      'Two printouts per team, the sheet for review and the final sheet (or their PDFs).',
      'Optional: protractor and grid paper to draw a profile by hand.',
    ],
    preparationTitle: 'Preparation (10 minutes before)',
    preparation: [
      'Open the mission and try the viewer on the device you will use.',
      'Form the teams and decide who drives the viewer and who writes.',
      'Decide which pairs of teams will review each other (A↔B, C↔D…).',
      'Read “Peer review between teams” and “What the data says” in this guide.',
      'If teams share devices, use “Start over” between groups: progress is saved in the browser.',
    ],
    timelineTitle: 'Lesson sequence',
    timeline: [
      { time: '0–5 min', title: 'Hook', text: 'Project the rover panorama at North Ray and read the challenge aloud. Ask: “What would a place on Earth need to have to rehearse this?”' },
      { time: '5–10 min', title: 'Hypothesis (step 1)', text: 'Teams look at the photos, choose a provisional site and write their hypothesis.' },
      { time: '10–20 min', title: 'Log (step 2)', text: 'They explore the viewer and record at least two findings with a note: where they looked, what data they read and why it matters.' },
      { time: '20–26 min', title: 'Proposal (step 3)', text: 'They choose the site they propose, their main finding, a limitation and the next data. They print the sheet for review.' },
      { time: '26–34 min', title: 'Peer review', text: 'Teams swap sheets; each team writes one objection that can be checked in the viewer and returns the sheet (see “Peer review between teams”).' },
      { time: '34–41 min', title: 'Revised decision (steps 4 and 5)', text: 'They copy the objection, decide to keep, change or ask for more evidence, and say which data supports it. They print the final sheet.' },
      { time: '41–45 min', title: 'Wrap-up', text: 'Final question for the whole class (see below).' },
    ],
    questionsTitle: 'Discussion questions',
    questions: [
      'Which part of your site’s profile looks most like North Ray’s wall? How is it different?',
      'The ALSJ reports 30–35° walls at North Ray. Does that match the profile’s maximum slope? What can data with 59 m pixels not show (boulders, steps, short stretches)?',
      'All three craters have stretches steeper than 25°. Which way would you drive down and back up to stay within the rover’s limit?',
      'Gravity on the Moon is 1/6 of Earth’s. Would climbing the same slope be easier or harder? What else changes with less weight (for example, the wheels’ grip)?',
      'El Elegante is volcanic and Meteor Crater is an impact crater. Does the crater’s origin matter if what you are testing is the slope?',
      'What can no place on Earth reproduce?',
    ],
    rubricTitle: 'Short rubric',
    rubricNote: 'Which site the team chose is not graded: keeping, changing or asking for more evidence are equally valid decisions.',
    rubricLevels: ['Beginning', 'Developing', 'Achieved'],
    rubric: [
      {
        criterion: 'The evidence can be located',
        levels: [
          'It is unclear where the data comes from.',
          'Names the site, but not the path, the point or the source.',
          'Names the site, path or point, layer and source: another team can find it in the viewer.',
        ],
      },
      {
        criterion: 'The evidence supports the decision',
        levels: [
          'The decision is not related to the evidence.',
          'The evidence is related to the decision, but is not enough (for example, a single point to talk about the whole route).',
          'The evidence justifies the revised decision, including when the decision was to ask for more evidence.',
        ],
      },
      {
        criterion: 'Recognizes what is still missing',
        levels: [
          'Does not mention what is missing.',
          'Mentions a general doubt.',
          'Names the specific data that is missing and how they would get it.',
        ],
      },
    ],
    closingTitle: 'Wrap-up question',
    closing: 'What evidence would make you change your mind?',
    reviewTitle: 'Peer review between teams',
    reviewIntro: 'The review happens in class, on paper or PDF: no accounts and no connection between devices needed.',
    reviewSteps: [
      'At the end of step 3, each team prints its “Sheet for review” or saves it as a PDF.',
      'Collect the sheets and give each one to another team (for example, A↔B, C↔D). No one reviews their own sheet.',
      'The reviewing team finds the main finding in the viewer and writes one objection in the blank space (5 min).',
      'Return each sheet to its authors. They copy the objection in step 4 and decide: keep, change site or ask for more evidence.',
      'Each team prints its “Final sheet”.',
    ],
    objectionExampleTitle: 'Example objection that can be checked in the viewer',
    objectionExample: 'Does the slope you cite apply to the whole route or only to the point you marked?',
    objectionCheck:
      'How to check it: choose the same site and path in the viewer and compare that point’s slope with the “Mean wall slope” and the “Maximum wall slope”. In the log, a “whole path” finding answers this objection.',
    objectionMoreTitle: 'Other objections that can be checked',
    objectionMore: [
      'Does the path you cite run in the same direction as the North Ray path you compare it with?',
      'Does the data come from the relief (DEM) or only from what is seen in the photo?',
      'What happens to the slope if the rover drives down the other side of the crater?',
    ],
    answersTitle: 'What the data says (for the teacher)',
    answersIntro:
      'Values measured by Starman with the same data the students see, along each site’s west–east / north–south path. Any site is a valid answer if it is justified with evidence.',
    answersArguments: [
      'For El Elegante: its depth is the closest to the ~230 m the ALSJ reports for North Ray, and it is in Mexico.',
      'For Meteor Crater: it is an impact crater, like North Ray, and its rim-to-rim width is the closest.',
      'Point to discuss: North Ray’s wall is steeper on average than the walls of both Earth sites, although the maximum slopes are similar.',
      'Shared limits: gravity, atmosphere, erosion, vegetation and ground (sand or rock versus lunar regolith). Also, a 59–90 m pixel does not show boulders or steps.',
    ],
    tableSite: 'Site',
    sourcesTitle: 'Sources and licenses',
  },

  data: {
    title: 'About the data',
    verified:
      'Verified: the elevations (DEM), the photos, North Ray’s dimensions, the rover’s slope limit and lunar gravity. Each item links to its source.',
    computed:
      'Computed by Starman: slope, relief and rim-to-rim distance are calculated in the browser from the DEMs, on a 41 × 41 grid with points every 75 m.',
    simulated: 'Simulated data: none. This mission uses no made-up values.',
    resolutionLimit:
      'Important limit: the DEMs have 90 m (Earth) and 59 m (Moon) pixels. They average the terrain, so they do not show boulders, steps or slope changes shorter than that. Compare the computed slopes with the 30–35° the ALSJ reports for North Ray’s wall.',
    attributionEarth:
      'Contains Copernicus DEM GLO-90 data © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved. Retrieved with the Open-Meteo elevation API.',
    attributionMoon:
      'SLDEM2015: Barker et al. (2016), Icarus 273, 346–355. It combines LOLA (LRO, NASA) and the SELENE/Kaguya Terrain Camera (JAXA). Distributed by USGS Astrogeology.',
    downloaded: (date: string) => `DEMs downloaded on ${date} with scripts/fetch-mission-terrain.ts.`,
  },

  callout: {
    learn: {
      eyebrow: 'Mission 01',
      text: 'Put what you learned to the test: choose where to rehearse a lunar rover and defend your decision with real data.',
      cta: 'Start mission',
    },
    teach: {
      eyebrow: 'Mission 01 · 45-min class',
      text: 'A free, printable guide with timings, discussion questions and a rubric. No account needed.',
      cta: 'Teach this class',
    },
  },
};
