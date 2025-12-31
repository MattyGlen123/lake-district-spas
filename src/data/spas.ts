import { Spa } from '@/types/spa';

export const spaData: Spa[] = [
  {
    id: 'lodore-falls-spa',
    name: 'Lodore Falls Hotel Spa',
    location: 'Borrowdale',
    websiteUrl: 'https://lakedistrictspa.co.uk',
    accessLabels: ['free-for-some-rooms', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_lodore-falls-spa.jpg',
    imageAlt:
      'Luxurious 16-metre outdoor hydrotherapy pool at The Falls Spa at Lodore Falls Hotel in Borrowdale, featuring heated water with neck jets and underwater bubble loungers, surrounded by white sun loungers on slate decking with dramatic Lake District mountain views at sunset, spa access included with suite bookings',
    keyFeatures: [
      '16m infinity-edge outdoor hydrotherapy pool',
      'Multtiple thermal facilities',
      '5 treatment rooms & relaxation lounge',
      '4-person mud rasul',
    ],
    thermalFacilities: [
      {
        name: 'Finnish Sauna',
        details: 'Panoramic views over Derwentwater, 85°C',
      },
      {
        name: 'Herbal Sauna',
        details: '65-75°C infused with herbs',
      },
      { name: 'Laconium', details: 'Roman bath style' },
      {
        name: 'Aroma Steam Room',
        details: '45°C at 95% humidity, essential oils',
      },
      {
        name: 'Salt Steam Room',
        details: '40°C at 95% humidity, halotherapy',
      },
      { name: 'Heated Loungers', details: 'Relaxation in thermal suite' },
    ],
    poolFeatures: [
      {
        name: 'Infinity-Edge Vitality Pool',
        details:
          ' underwater bubble loungers, volcano fountain, hydromassage neck jets',
      },
      {
        name: 'Experience Showers',
        details: 'Forest Rinse, Tropical Rain, Thermal Sensation',
      },
      {
        name: 'Ice Fountain',
        details: 'Cool down post-sauna, boost circulation',
      },
      { name: 'Cold Drench Bucket', details: 'Outdoor cool down after sauna' },
    ],
    accessPolicy: [
      'Suites: Spa included - 2hrs complimentary per night',
      'Paid access for other rooms: 2hr slots',
      'Book slots after room booking',
      'Age restriction: 18+ only (due to heat experiences)',
    ],
    facilities: {
      infraredSauna: false,
      coldPlunge: false,
      sauna: true,
      steamRoom: true,
      iceRoom: true,
      hotTub: true,
      indoorPool: false,
      outdoorPool: true,
      thermalSuite: true,
    },
    agePolicy: '18+ only (due to heat experiences)',
  },
  {
    id: 'armathwaite-hall-hotel-spa',
    name: 'Armathwaite Hall Hotel & Spa',
    location: 'Bassenthwaite',
    websiteUrl: 'https://armathwaite-hall.com/spa',
    accessLabels: ['free-for-all-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_armathwaite-hall.jpg',
    imageAlt:
      'Luxury thermal relaxation suite at Armathwaite Hall Hotel and Spa near Bassenthwaite Lake, featuring heated ceramic loungers with burnt orange throws, ambient candlelit atmosphere with green velvet curtains and contemporary design, offering award-winning spa facilities in a Lake District country estate setting',
    keyFeatures: [
      'Indoor swimming pool',
      'Outdoor infinity pools',
      'Multiple treatment rooms',
    ],
    thermalFacilities: [
      { name: 'Finnish Sauna', details: 'Traditional Finnish sauna' },
      {
        name: 'Crystal Steam Room',
        details: 'Amethyst Crystal Cave steam room',
      },
    ],
    poolFeatures: [
      { name: 'Indoor Pool', details: 'Indoor swimming pool' },
      { name: 'Outdoor Pool', details: 'Multiple outdoor infinity pools' },
      { name: 'Hot Tub', details: 'Hot tub or jacuzzi' },
    ],
    accessPolicy: [
      'Spa included with room booking',
      'Day passes: Packages available',
      'Pre-booking: Recommended',
      'Age restriction: Adults only',
    ],
    facilities: {
      infraredSauna: false,
      coldPlunge: false,
      sauna: true,
      steamRoom: true,
      iceRoom: false,
      hotTub: true,
      indoorPool: true,
      outdoorPool: true,
      thermalSuite: true,
    },
  },
  {
    id: 'brimstone-hotel-spa',
    name: 'Brimstone Spa',
    location: 'Great Langdale',
    websiteUrl: 'https://brimstonehotel.co.uk/rooms/spa-break/',
    accessLabels: ['free-for-all-guests', 'no-day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_brimstone-hotel.jpg',
    imageAlt:
      'Unique swim-through hydrotherapy pool at Brimstone Hotel and Spa in Langdale featuring iridescent blue mosaic tiles, modern Nordic-inspired design with wooden accents and floor-to-ceiling windows, white heated loungers, and indoor-outdoor connectivity in the heart of the Lake District',
    keyFeatures: [
      'Swim-through indoor/outdoor pool',
      'Sauna and steam room',
      'Ice Room and Experience Showers',
    ],
    thermalFacilities: [
      { name: 'Finnish Sauna', details: 'Traditional Finnish sauna' },
      { name: 'Laconium', details: 'Gentle heat therapy' },
      { name: 'Aroma Steam Room', details: 'Aromatherapy steam room' },
      { name: 'Ice Room', details: 'Cool down experience' },
      {
        name: 'Experience Showers',
        details: 'Multi-sensory shower experience',
      },
    ],
    poolFeatures: [
      { name: 'Indoor Pool', details: '9m pool' },
      { name: 'Outdoor Pool', details: 'Swim-through indoor/outdoor' },
      { name: 'Swim-Through Pool', details: '9m indoor/outdoor' },
      { name: 'Hot Tub', details: 'Hot tub or jacuzzi' },
    ],
    accessPolicy: [
      'Spa included with room booking',
      'Day passes: Not available',
      'Pre-booking: Guest access automatic',
      'Age restriction: Adults only',
    ],
    facilities: {
      infraredSauna: false,
      coldPlunge: false,
      sauna: true,
      steamRoom: true,
      iceRoom: true,
      hotTub: true,
      indoorPool: true,
      outdoorPool: true,
      thermalSuite: true,
    },
    agePolicy: 'Adults only',
  },
  {
    id: 'daffodil-hotel-spa',
    name: 'Daffodil Hotel Spa',
    location: 'Grasmere',
    websiteUrl:
      'https://www.crerarhotels.com/collection/daffodil-hotel-and-spa/wellness/the-spa/',
    accessLabels: ['free-for-all-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_daffodil-hotel-and-spa.webp',
    imageAlt:
      'Contemporary hydrotherapy pool at Daffodil Hotel and Spa in Grasmere with dramatic blue and purple ambient lighting, cascade waterfall features, heated lounger seating, and modern minimalist design creating a tranquil Lake District wellness experience',
    keyFeatures: [
      'Indoor hydrotherapy pool',
      'Sauna and steam room',
      'Rasul mud chamber',
    ],
    thermalFacilities: [
      { name: 'Finnish Sauna', details: 'Traditional Finnish sauna' },
      { name: 'Steam Room', details: 'Revitalising steam room' },
    ],
    poolFeatures: [
      {
        name: 'Hydrotherapy Pool',
        details: 'Hydrotherapy pool with cascade features',
      },
    ],
    accessPolicy: [
      'Free spa access included with room booking',
      'Public day passes available',
      'Pre-booking required: Arrive 30 mins before any treatment',
      'Age restriction: 16+ only',
      'Spa hours: 8am-8pm daily',
      'Treatment hours: 10am-6:30pm',
    ],
    facilities: {
      infraredSauna: false,
      coldPlunge: false,
      sauna: true,
      steamRoom: true,
      iceRoom: false,
      hotTub: false,
      indoorPool: false,
      outdoorPool: false,
      thermalSuite: true,
    },
    agePolicy: '16+ only',
  },
  {
    id: 'swan-hotel-spa',
    name: 'Swan Hotel Spa',
    location: 'Newby Bridge',
    websiteUrl: 'https://swanhotel.com/spa/',
    accessLabels: ['free-for-some-rooms', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_swan-hotel.webp',
    imageAlt:
      'Illuminated outdoor hydrotherapy pool at Swan Hotel and Spa in Newby Bridge at twilight, featuring swim-through access connecting indoor relaxation areas with heated outdoor pool, blue underwater lighting, and glass walls showcasing integrated spa facilities in the Lake District',
    keyFeatures: [
      'Unique indoor/outdoor swim-through pool',
      'Authentic outdoor Finnish sauna',
      'Cold plunge pool',
    ],
    thermalFacilities: [
      {
        name: 'Outdoor Finnish Sauna',
        details: 'Authentic outdoor Finnish sauna',
      },
      {
        name: 'Indoor Finnish Sauna',
        details: 'Finnish-inspired indoor sauna',
      },
      { name: 'Steam Room', details: '100% humidity steam room' },
      {
        name: 'Experience Showers',
        details:
          'Multi-sensory showers with tropical rain, mist, monsoon and cold waterfall effects',
      },
      {
        name: 'Cold Plunge Pool',
        details:
          'For reduced inflammation, improved circulation and mental resilience',
      },
    ],
    poolFeatures: [
      {
        name: 'Indoor/Outdoor Swim-Through Pool',
        details:
          'Unique indoor-to-outdoor hydrotherapy pool, naturally filtered with minimal chlorine',
      },
      {
        name: 'Jacuzzi Pool',
        details:
          '12-seater jacuzzi pool with gentle jets to alleviate tight muscles and tension',
      },
    ],
    accessPolicy: [
      'Hotel guests: Free spa access for Splendid room bookings and above',
      'Standard room guests: Day pass available',
      'Public day passes available',
      'Pre-booking recommended',
      'Age restriction: 18+ (16-17 with parent/guardian)',
      'Spa hours: 10am-4pm',
    ],
    facilities: {
      infraredSauna: false,
      sauna: true,
      steamRoom: true,
      iceRoom: true,
      hotTub: true,
      indoorPool: true,
      outdoorPool: true,
      thermalSuite: true,
      coldPlunge: true,
    },
    agePolicy: '18+ (16-17 with parent/guardian)',
  },
  {
    id: 'macdonald-old-england-hotel-spa',
    name: 'Macdonald Old England Hotel & Spa',
    location: 'Bowness-on-Windermere',
    websiteUrl: 'https://macdonaldhotels.co.uk/old-england/spa-leisure/spa',
    accessLabels: ['free-for-all-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_old-england-hotel.jpg',
    imageAlt:
      'Modern indoor swimming pool at Macdonald Old England Hotel and Spa in Bowness-on-Windermere, featuring deep blue mosaic tiling, contemporary black and white interior design, underwater lighting, and heated pool facilities in a luxurious Lake District spa setting',
    keyFeatures: [
      '20m indoor pool with Lake Windermere views',
      'Thermal suite with sauna, steam and ice room',
      'Ice Room and Experience Showers',
    ],
    thermalFacilities: [
      { name: 'Finnish Sauna', details: 'Traditional Finnish sauna' },
      { name: 'Aroma Steam Room', details: 'Aromatherapy steam room' },
      { name: 'Ice Room', details: 'Cool down experience' },
      { name: 'Experience Showers', details: 'Aromatherapy shower' },
    ],
    poolFeatures: [
      {
        name: 'Indoor Pool',
        details: '20m lakeside pool with Lake Windermere views',
      },
    ],
    accessPolicy: [
      'Hotel guests: Free access to pool and thermal suite',
      'Spa day packages',
      'Pool & gym hours: 7am-6:30pm',
      'Children swim times: 10am-5pm',
      'Age restriction: 18+ for thermal suite, children allowed in pool during designated times',
      'Pre-booking: Required for spa day packages with treatments',
    ],
    facilities: {
      infraredSauna: false,
      coldPlunge: false,
      sauna: true,
      steamRoom: true,
      iceRoom: true,
      hotTub: false,
      indoorPool: true,
      outdoorPool: false,
      thermalSuite: true,
    },
    agePolicy:
      '18+ for thermal suite, children allowed in pool during designated times',
  },
  {
    id: 'low-wood-bay-spa',
    name: 'Low Wood Bay Spa',
    location: 'Windermere',
    websiteUrl: 'https://englishlakes.co.uk/hotels/low-wood-bay/the-spa/',
    accessLabels: ['paid-for-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_low-wood-bay.webp',
    imageAlt:
      'Spectacular infinity-edge vitality pool at Low Wood Bay Resort and Spa on the shores of Lake Windermere, featuring panoramic Lake District mountain views, traditional Lakeland dry stone walling, wooden sun loungers, and outdoor relaxation areas perfect for spa days',
    keyFeatures: [
      'Indoor and outdoor thermal spaces',
      'Outdoor infinity pool with lake views',
      'Indoor thermal & vitality pool',
      'Three saunas including infrared sauna',
    ],
    thermalFacilities: [
      {
        name: 'Dry Salt Sauna',
        details: 'Indoor dry salt sauna with therapeutic benefits',
      },
      {
        name: 'Infrared Sauna',
        details: 'Infrared sauna for deep tissue relaxation',
      },
      {
        name: 'Fellside Sauna',
        details: 'Outdoor sauna with panoramic Lake District views',
      },
      { name: 'Coconut Steam Room', details: 'Coconut-infused steam room' },
      { name: 'Herbal Lounge', details: 'Gentle herbal infusion lounge' },
      {
        name: 'Experience Showers',
        details: 'Multi-sensory shower experiences (indoor and outdoor)',
      },
    ],
    poolFeatures: [
      {
        name: 'Indoor Swimming Pool',
        details: 'Indoor thermal & vitality pool with bubble spa features',
      },
      {
        name: 'Outdoor Infinity Pools',
        details:
          'Two heated outdoor infinity pools with stunning Lake Windermere views',
      },
      {
        name: 'Jacuzzi/Hot Tubs',
        details:
          'Multiple outdoor jacuzzis and hot tubs, perfect for star gazing',
      },
    ],
    accessPolicy: [
      'Hotel guests: Spa access NOT included unless booking spa break package',
      'Hotel guests can book spa day or treatment separately with 25% discount Mon-Thu',
      'Day passes: Available for public, various packages 10am-8pm',
      'Age restriction: 16+ only (no children allowed)',
      'Spa hours: Treatments 9:30am-7:30pm and Spa Days 10am-8pm',
      'No slippers provided - bring flip flops or purchase on-site',
      'Pregnancy restrictions: No thermal cabins, hot tubs or mud rooms',
    ],
    facilities: {
      coldPlunge: false,
      sauna: true,
      steamRoom: true,
      iceRoom: false,
      hotTub: true,
      indoorPool: true,
      outdoorPool: true,
      thermalSuite: true,
      infraredSauna: true,
    },
  },
  {
    id: 'ambleside-salutation-hotel-spa',
    name: 'Ambleside Salutation Hotel & Spa',
    location: 'Ambleside',
    websiteUrl: 'https://www.hotelslakedistrict.com/waterfall-spa/',
    accessLabels: ['free-for-all-guests', 'no-day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_salutation-hotel.jpg',
    imageAlt:
      'Elegant indoor pool at The Salutation Hotel and Spa in Ambleside featuring starlit fibre optic ceiling, suspended designer pod chairs, modern grey loungers, and sophisticated neutral colour palette creating a tranquil spa experience in the heart of the Lake District',
    keyFeatures: [
      '13m indoor pool with starlit ceiling',
      'Outdoor hydrotherapy fountain spa',
      'Infrared sauna and steam room',
    ],
    thermalFacilities: [
      {
        name: 'Infrared Sauna',
        details: 'Infrared sauna for deep tissue relaxation',
      },
      { name: 'Steam Room', details: 'Steam room' },
      { name: 'Ice Fountain', details: 'Ice fountain for cooling down' },
    ],
    poolFeatures: [
      {
        name: 'Indoor Pool',
        details:
          '13m sparkling heated indoor pool with fibre optic starlit ceiling',
      },
      {
        name: 'Outdoor Hydrotherapy Pool',
        details: 'Outdoor fountain spa with hydrotherapy features',
      },
      {
        name: 'Poolside Hot Tub',
        details: 'Poolside hot tub',
      },
    ],
    accessPolicy: [
      'Hotel guests: Free spa access included',
      'Day passes: Not available to public',
      'Pre-booking: Required for spa treatments',
      'Age restriction: Adults only',
      'Spa hours: 8am-8pm daily',
    ],
    facilities: {
      infraredSauna: true,
      coldPlunge: false,
      sauna: true,
      steamRoom: true,
      iceRoom: true,
      hotTub: true,
      indoorPool: true,
      outdoorPool: true,
      thermalSuite: true,
    },
  },
  {
    id: 'lakeside-hotel-spa',
    name: 'Lakeside Hotel & Spa',
    location: 'Newby Bridge',
    websiteUrl: 'https://lakesidehotel.co.uk/spa',
    accessLabels: ['free-for-all-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_lakeside-hotel.webp',
    imageAlt:
      'Contemporary indoor pool at Lakeside Hotel Health Club and Spa on Lake Windermere, featuring distinctive teal and green mosaic tile columns, flowing wave-pattern ceiling design, and spacious swimming area with loungers overlooking the Lake District waterfront',
    keyFeatures: [
      'Free spa access for all hotel guests',
      'Day passes available to public',
      '17m indoor heated pool overlooking Lake Windermere',
    ],
    thermalFacilities: [
      { name: 'Sauna', details: 'Traditional sauna' },
      { name: 'Steam Room', details: 'Relaxing steam room' },
      {
        name: 'Heat Domes',
        details: 'Heat domes in spa garden to stay warm outdoors',
      },
    ],
    poolFeatures: [
      {
        name: 'Indoor Pool',
        details:
          '17m heated indoor pool with views of Lake Windermere and spa garden',
      },
      {
        name: 'Jacuzzi',
        details: 'Relaxing jacuzzi',
      },
    ],
    accessPolicy: [
      'Hotel guests: Free access to pool, gym, sauna and steam room included',
      'Public day passes available',
      'Child-friendly: Pool is suitable for children',
      'Spa garden: Outdoor retreat with fire pit and heat domes',
    ],
    facilities: {
      infraredSauna: false,
      coldPlunge: false,
      sauna: true,
      steamRoom: true,
      iceRoom: false,
      hotTub: true,
      indoorPool: true,
      outdoorPool: false,
      thermalSuite: true,
    },
    agePolicy: 'Pool suitable for children',
  },
  {
    id: 'beech-hill-hotel-spa',
    name: 'Beech Hill Hotel & Spa',
    location: 'Windermere',
    websiteUrl: 'https://beechhillhotel.co.uk/spa',
    accessLabels: ['free-for-all-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_beech-hill-hotel.jpg',
    imageAlt:
      'Botanical-inspired indoor pool at Beech Hill Hotel and Spa near Windermere, featuring natural woven pendant lights, cascading artificial greenery from ceiling, dark slate mosaic walls, turquoise heated pool, and contemporary nature-themed wellness design in the Lake District',
    keyFeatures: [
      '35ft indoor pool',
      'Himalayan sauna',
      'Spa terrace with outdoor vitality pools',
    ],
    thermalFacilities: [
      { name: 'Himalayan Sauna', details: 'Himalayan sauna' },
      { name: 'Aromatic Steam Room', details: 'Aromatic steam room' },
    ],
    poolFeatures: [
      {
        name: 'Indoor Pool',
        details:
          '35ft indoor pool with atmospheric lighting and Lake Windermere views',
      },
      {
        name: 'Outdoor Vitality Spa Pools',
        details: '2 outdoor vitality spa pools on spa terrace with lake views',
      },
    ],
    accessPolicy: [
      'Hotel guests: Complimentary spa access included',
      'Spa access from Thu-Sun 9:30am-4pm, Fri-Sat 9:30am-6pm',
      'Spa access included with all treatments',
      'Pre-booking: Required',
      'Age restriction: 16+ only for spa',
      'Children allowed in pool 10am-1pm only',
      'Maximum group size: 6 people',
    ],
    facilities: {
      infraredSauna: false,
      coldPlunge: false,
      sauna: true,
      steamRoom: true,
      iceRoom: false,
      hotTub: true,
      indoorPool: true,
      outdoorPool: true,
      thermalSuite: true,
    },
  },
  {
    id: 'rothay-garden-by-harbour-hotels',
    name: 'Rothay Garden by Harbour Hotels',
    location: 'Grasmere',
    websiteUrl:
      'https://www.harbourhotels.co.uk/our-hotels/lake-district/rothay-garden-by-harbour-hotels/riverside-spa',
    accessLabels: ['free-for-all-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_rothay-garden-hotel.jpg',
    imageAlt:
      'Panoramic hydrotherapy pool at Rothay Garden Hotel and Riverside Spa in Grasmere, featuring curved floor-to-ceiling windows with dramatic Lake District fell views, dual cascade water features, bamboo-panelled walls, and intimate circular hot tub design surrounded by nature',
    keyFeatures: [
      'Floor-to-ceiling views of riverside and fells',
      'Hydrotherapy pool with sunken loungers',
      'Infrared heated loungers',
    ],
    thermalFacilities: [
      { name: 'Herbal Pine Sauna', details: 'Herbal pine sauna' },
      { name: 'Steam Room', details: 'Aromatherapy steam room' },
      { name: 'Experience Showers', details: 'Monsoon showers' },
      {
        name: 'Infrared Loungers',
        details: 'Heated infrared loungers for muscle relaxation',
      },
    ],
    poolFeatures: [
      {
        name: 'Hydrotherapy Pool',
        details: 'HydroSpa with sunken loungers and riverside views',
      },
      { name: 'Hot Tub', details: 'Hot tub' },
    ],
    accessPolicy: [
      'Hotel guests: Free spa access included, no booking required',
      'Day passes: Available to public',
      'In-room treatments available when booked in advance',
      'Age restriction: 18+ only, no children permitted',
      'Spa hours: 8am-8pm daily',
    ],
    facilities: {
      infraredSauna: false,
      coldPlunge: false,
      sauna: true,
      steamRoom: true,
      iceRoom: false,
      hotTub: true,
      indoorPool: true,
      outdoorPool: false,
      thermalSuite: true,
    },
    agePolicy: 'Children welcome during designated times only',
  },
  {
    id: 'north-lakes-hotel-spa',
    name: 'North Lakes Hotel & Spa',
    location: 'Penrith',
    websiteUrl: 'https://northlakeshotel.com/spa-treatments',
    accessLabels: ['free-for-all-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_north-lakes-hotel.jpg',
    imageAlt:
      'Tranquil thermal relaxation suite at North Lakes Hotel and Spa in Penrith, featuring heated ceramic loungers with plush robes, ambient mood lighting, Lake District landscape artwork, Japanese-inspired sliding screens, and peaceful spa environment for complete relaxation',
    keyFeatures: [
      '13m indoor pool',
      'Separate male and female saunas',
      'Thermal relaxation suite with heated loungers',
    ],
    thermalFacilities: [
      { name: 'Finnish Sauna', details: 'Separate male and female saunas' },
      { name: 'Steam Room', details: 'Steam room' },
    ],
    poolFeatures: [
      { name: 'Indoor Pool', details: '13m pool' },
      { name: 'Hot Tub', details: 'Whirlpool hot tub' },
    ],
    accessPolicy: [
      'Hotel guests: Free spa access included',
      'Day passes and memberships available',
      'Age restriction: Children welcome during designated times only',
      'Spa hours: Mon-Fri 6am-9:30pm, Sat-Sun 7am-8pm',
      'Robes and slippers provided',
    ],
    facilities: {
      infraredSauna: false,
      coldPlunge: false,
      sauna: true,
      steamRoom: true,
      iceRoom: false,
      hotTub: true,
      indoorPool: true,
      outdoorPool: false,
      thermalSuite: true,
    },
    agePolicy: '16+ only for spa, children allowed in pool 10am-1pm only',
  },
  {
    id: 'whitewater-hotel-leisure-club',
    name: 'Whitewater Hotel & Leisure Club',
    location: 'Backbarrow',
    websiteUrl: 'https://whitewater-hotel.co.uk/spa-fitness/',
    accessLabels: ['free-for-all-guests', 'no-day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_whitewater-hotel.jpg',
    imageAlt:
      'Expansive leisure pool at Whitewater Hotel Country Club near Newby Bridge, featuring multi-level design with mosaic-tiled stepping stones, burgundy and cream decorative columns, spacious swimming area, and grand architectural poolside complex in the Lake District',
    keyFeatures: [
      'Outdoor jacuzzi overlooking River Leven',
      'Turkish Hamam aromatherapy steam room',
      'Indoor heated swimming pool',
    ],
    thermalFacilities: [
      { name: 'Sauna', details: 'Traditional sauna' },
      {
        name: 'Turkish Hamam Steam Room',
        details: 'Aromatherapy Turkish Hamam steam room',
      },
      { name: 'Feature Shower', details: 'Multi-sensory feature shower' },
      {
        name: 'Rasul Mud Temple (additional cost)',
        details:
          'Arabian steam room with multiple mud applications for deep cleansing',
      },
    ],
    poolFeatures: [
      { name: 'Indoor Pool', details: 'Heated indoor swimming pool' },
      {
        name: 'Outdoor Jacuzzi',
        details: 'Outdoor hot tub overlooking River Leven with scenic views',
      },
    ],
    accessPolicy: [
      'Hotel guests: Free spa access included, 10% discount on treatments',
      'Day passes: Not available to public',
      'Pre-booking: Required for spa treatments',
      'No age restriction',
      'Robes and towels: Provided',
    ],
    facilities: {
      infraredSauna: false,
      coldPlunge: false,
      sauna: true,
      steamRoom: true,
      iceRoom: false,
      hotTub: true,
      indoorPool: true,
      outdoorPool: false,
      thermalSuite: true,
    },
  },
  {
    id: 'another-place-the-lake',
    name: 'Another Place, The Lake',
    location: 'Ullswater',
    websiteUrl: 'https://another.place/the-lake/swim-club/',
    accessLabels: ['free-for-all-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_another-place.jpg',
    imageAlt:
      'Stunning infinity-edge pool at Another Place The Lake on the shores of Ullswater, featuring floor-to-ceiling glass walls with breathtaking Lake District mountain and valley views, modern minimalist design with exposed beams, and seamless indoor-outdoor spa experience in a luxury countryside retreat',
    keyFeatures: [
      '20m indoor pool with views of Ullswater lake',
      'Outdoor Swedish hot tub overlooking the grounds',
      'Sauna with lake views',
    ],
    thermalFacilities: [
      {
        name: 'Sauna',
        details:
          'Sauna overlooking the grounds with 20 minute session limit when busy, 16+ only',
      },
    ],
    poolFeatures: [
      {
        name: 'Indoor Pool',
        details:
          '20m pool with floor-to-ceiling glass walls, skylight, ultra-violet filtered water (low chlorine), shallow area for children',
      },
      {
        name: 'Outdoor Hot Tub',
        details:
          'Swedish-design heated outdoor hot tub overlooking grounds, 20 minute session limit when busy, 16+ only',
      },
    ],
    accessPolicy: [
      'Free access for Hotel guests',
      'Day membership available',
      'Pool hours: 7am-9pm daily',
      'Adult-only swim times: 7am-9am and 6pm-9pm',
      'Family swim times: 9am-6pm',
      'Age restriction: Hot tub and sauna 16+ only',
      'Treatments available',
    ],
    facilities: {
      infraredSauna: false,
      coldPlunge: false,
      sauna: true,
      steamRoom: false,
      iceRoom: false,
      hotTub: true,
      indoorPool: true,
      outdoorPool: false,
      thermalSuite: false,
    },
    agePolicy: 'No age restriction',
  },
  {
    id: 'appleby-manor-hotel-garden-spa',
    name: 'Appleby Manor Hotel & Garden Spa',
    location: 'Appleby-in-Westmorland',
    websiteUrl: 'https://applebymanor.co.uk/garden-spa',
    accessLabels: ['paid-for-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_appleby-manor.jpg',
    imageAlt:
      'Contemporary hydrotherapy pool at Appleby Manor Country House Hotel near Appleby-in-Westmorland, featuring dramatic blue LED underwater lighting, natural Lake District pebble stone border detail, modern wicker relaxation seating with tropical palms, and luxury spa facilities in the Eden Valley',
    keyFeatures: [
      'Hydrotherapy pool',
      'Outdoor spa garden with hot tubs and fire pit',
      'Salt inhalation room',
    ],
    thermalFacilities: [
      { name: 'Sauna', details: 'Traditional sauna' },
      {
        name: 'Salt Inhalation Room',
        details: 'Salt inhalation room for respiratory benefits',
      },
      { name: 'Steam Room', details: 'Aromatherapy steam room' },
      {
        name: 'Experience Showers',
        details: 'Rain sky experience showers',
      },
    ],
    poolFeatures: [
      {
        name: 'Hydrotherapy Pool',
        details:
          'Indoor vitality pool with underwater massage loungers and water jets',
      },
      {
        name: 'Outdoor Hot Tub',
        details: 'Outdoor spa baths in sheltered spa garden with fire pit',
      },
    ],
    accessPolicy: [
      'Hotel guests: Must pay separately for spa access',
      'Day passes available',
      'Spa breaks: Available with overnight stays',
      'Age restriction: 16+ (treatments may require 18+)',
    ],
    facilities: {
      infraredSauna: false,
      coldPlunge: false,
      sauna: true,
      steamRoom: true,
      iceRoom: false,
      hotTub: true,
      indoorPool: true,
      outdoorPool: false,
      thermalSuite: true,
    },
    agePolicy: undefined,
  },
  {
    id: 'netherwood-hotel-spa',
    name: 'Netherwood Hotel & Spa',
    location: 'Grange-over-Sands',
    websiteUrl: 'https://netherwood-hotel.co.uk/spa-fitness',
    accessLabels: ['paid-for-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_netherwood-hotel.webp',
    imageAlt:
      'Unique circular Kneipp footbath at Netherwood Hotel and Spa in Grange-over-Sands, featuring natural rope-wrapped wooden basin design with dual cascade water features, positioned against authentic Lakeland dry stone walling with designer loungers and orange accent cushions',
    keyFeatures: [
      'Boutique thermal suite',
      'Plunge tub room with hot, warm and cold tubs',
      'Panoramic views of Morecambe Bay',
      'Salt inhalation room',
    ],
    thermalFacilities: [
      {
        name: 'Dry Heat Sauna',
        details: 'Traditional dry heat sauna to ease tension',
      },
      { name: 'Salt Room', details: 'Calming salt inhalation room' },
      {
        name: 'Aroma Steam Room',
        details:
          'Aromatherapy steam room with lemongrass, citrus and cinnamon scents',
      },
      { name: 'Ice Fountain', details: 'Refreshing ice fountain' },
      {
        name: 'Thermal Shower',
        details: 'Thermal shower with mist and massaging jets',
      },
    ],
    poolFeatures: [
      {
        name: 'Plunge Tub Room',
        details:
          'Hot, warm and cold plunge tubs to relax muscles and revive body',
      },
    ],
    accessPolicy: [
      'Hotel guests: Must pay separately for Thermal Journey',
      'Day passes available',
      'Thermal Journey hours: Mon-Sun 10am-5:30pm',
      'Treatment hours: 10am-6pm',
      'Robes, towels and slippers: Included',
    ],
    facilities: {
      infraredSauna: false,
      coldPlunge: true,
      sauna: true,
      steamRoom: true,
      iceRoom: true,
      hotTub: true,
      indoorPool: false,
      outdoorPool: false,
      thermalSuite: true,
    },
    agePolicy: undefined,
  },
  {
    id: 'grange-hotel',
    name: 'Grange Hotel',
    location: 'Grange-over-Sands',
    websiteUrl: 'https://grange-hotel.co.uk/the-spa/',
    accessLabels: ['free-for-some-rooms', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_grange-hotel.jpg',
    imageAlt:
      'Luxury facial treatment at The Grange Boutique Hotel and Restaurant in Grange-over-Sands, featuring professional spa therapies with skilled hands performing rejuvenating skincare treatments in an intimate, serene environment overlooking Morecambe Bay in the southern Lake District',
    keyFeatures: ['Heated indoor pool', 'Sauna and steam room', 'Jacuzzi'],
    thermalFacilities: [
      { name: 'Sauna', details: 'Traditional sauna' },
      { name: 'Steam Room', details: 'Steam room' },
    ],
    poolFeatures: [
      { name: 'Indoor Pool', details: 'Heated indoor pool' },
      { name: 'Jacuzzi', details: 'Jacuzzi' },
    ],
    accessPolicy: [
      'Hotel guests: Spa access additional charge (some overnight packages include access)',
      'Spa Day Packages: Available with treatment and facility access',
      'Robes and slippers: Provided',
    ],
    facilities: {
      infraredSauna: false,
      coldPlunge: false,
      sauna: true,
      steamRoom: true,
      iceRoom: false,
      hotTub: true,
      indoorPool: true,
      outdoorPool: false,
      thermalSuite: true,
    },
    agePolicy: undefined,
  },
];

export const locations = [
  'All Locations',
  'Ambleside',
  'Appleby-in-Westmorland',
  'Backbarrow',
  'Bassenthwaite',
  'Borrowdale',
  'Bowness-on-Windermere',
  'Grange-over-Sands',
  'Grasmere',
  'Great Langdale',
  'Kendal',
  'Newby Bridge',
  'Penrith',
  'Ullswater',
  'Windermere',
];

export const facilityOptions = [
  { key: 'sauna', label: 'Sauna' },
  { key: 'steamRoom', label: 'Steam Room' },
  { key: 'iceRoom', label: 'Ice Room or Cold Plunge' },
  { key: 'hotTub', label: 'Hot Tub' },
  { key: 'indoorPool', label: 'Indoor Pool' },
  { key: 'outdoorPool', label: 'Outdoor Pool' },
  { key: 'thermalSuite', label: 'Thermal Suite' },
] as const;
