import { Spa } from '@/types/spa';

export const spaData: Spa[] = [
  {
    id: 1,
    url: 'lodore-falls-spa',
    name: 'Lodore Falls Hotel Spa',
    location: 'Borrowdale',
    address: {
      street: 'Borrowdale',
      locality: 'Keswick',
      region: 'Cumbria',
      postcode: 'CA12 5UX',
      country: 'GB',
    },
    metaDescription:
      'Luxury spa in Borrowdale with infinity-edge outdoor pool overlooking the fells. Three thermal pools and steam room. Perfect for romantic couples.',
    intro: `The Falls Spa at Lodore Falls Hotel offers one of the Lake District's finest spa experiences, featuring an infinity-edge outdoor hydrotherapy pool overlooking Derwentwater and the surrounding fells. Set in Borrowdale near Keswick, this adults-only retreat combines nine thermal experiences with stunning Cumbrian scenery.

The comprehensive thermal suite includes Finnish and herbal saunas with panoramic views, a Roman laconium, salt and aroma steam rooms, plus ice fountain and cold drench bucket for contrast therapy. The outdoor vitality pool features underwater bubble loungers, volcano fountain, and hydromassage neck jets.

Spa access is complimentary for suite bookings (2 hours per night), while standard room guests can add spa sessions for an additional fee. Day spa packages are also available for non-residents. Please note this is an 18+ spa due to the heat experiences.`,
    websiteUrl: 'https://lakedistrictspa.co.uk',
    accessLabels: ['free-for-some-rooms', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_lodore-falls-spa.jpg',
    imageAlt:
      'Luxurious 16-metre outdoor hydrotherapy pool at The Falls Spa at Lodore Falls Hotel in Borrowdale, featuring heated water with neck jets and underwater bubble loungers, surrounded by white sun loungers on slate decking with dramatic Lake District mountain views at sunset, spa access included with suite bookings',
    keyFeatures: [
      'Infinity-edge outdoor hydrotherapy pool',
      'Finnish and herbal saunas',
      'Salt and aroma steam rooms',
      'Ice fountain and cold drench bucket',
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
      {
        name: 'Ice Fountain',
        details: 'Cool down post-sauna, boost circulation',
      },
      { name: 'Cold Drench Bucket', details: 'Outdoor cool down after sauna' },
      {
        name: 'Experience Showers',
        details: 'Forest Rinse, Tropical Rain, Thermal Sensation',
      },
    ],
    poolFeatures: [
      {
        name: 'Infinity-Edge Vitality Pool',
        details:
          'Underwater bubble loungers, volcano fountain, hydromassage neck jets',
      },
    ],
    accessPolicy: [
      {
        name: 'Suites',
        details: 'Spa included - 2hrs complimentary per night',
        accessType: 'hotel',
      },
      {
        name: 'Standard Rooms',
        details: 'Paid access, 2hr slots',
        accessType: 'hotel',
      },
      {
        name: 'Booking',
        details: 'Book slots after room booking',
        accessType: 'general',
      },
      {
        name: 'Age Restriction',
        details: '18+ only (due to heat experiences)',
        accessType: 'age-restriction',
      },
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
    relatedSpas: [5, 2],
  },
  {
    id: 7,
    url: 'low-wood-bay-spa',
    name: 'Low Wood Bay Spa',
    location: 'Windermere',
    address: {
      street: 'Ambleside Road',
      locality: 'Windermere',
      region: 'Cumbria',
      postcode: 'LA23 1LP',
      country: 'GB',
    },
    metaDescription:
      "Windermere's premium spa with two outdoor infinity pools and stunning lake views. Three saunas including infrared cabin. Perfect for luxurious girls' getaways.",
    intro: `The Spa at Low Wood Bay offers one of the Lake District's most impressive spa settings, featuring two outdoor infinity pools with panoramic views across Lake Windermere to the Langdale Pikes. Located on the lake's eastern shore near Ambleside, Low Wood Bay Resort & Spa combines extensive thermal facilities with direct waterfront access.

The spa includes six thermal experiences: three saunas featuring the outdoor Fellside Sauna with fell views, a dry salt sauna, and an infrared cabin for deep tissue relaxation. The coconut steam room and herbal lounge provide gentler heat options, while multiple outdoor hot tubs are perfect for evening stargazing.

Unlike many Lake District spa hotels, spa access is not included with standard room bookings - guests can add spa sessions separately (with 25% off Monday to Thursday). Day spa packages are available for non-residents from 10am to 8pm. This is a 16+ spa.`,
    websiteUrl: 'https://englishlakes.co.uk/hotels/low-wood-bay/the-spa/',
    accessLabels: ['paid-for-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_low-wood-bay.webp',
    imageAlt:
      'Spectacular infinity-edge vitality pool at Low Wood Bay Resort and Spa on the shores of Lake Windermere, featuring panoramic Lake District mountain views, traditional Lakeland dry stone walling, wooden sun loungers, and outdoor relaxation areas perfect for spa days',
    keyFeatures: [
      'Two outdoor infinity pools with lake views',
      'Three saunas including infrared and fellside sauna',
      'Indoor thermal and vitality pool',
      'Multiple outdoor hot tubs',
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
      {
        name: 'Hotel Guests',
        details: 'Spa access NOT included unless booking spa break package',
        accessType: 'hotel',
      },
      {
        name: 'Guest Discount',
        details:
          'Book spa day or treatment separately with 25% discount Mon-Thu',
        accessType: 'general',
      },
      {
        name: 'Day Passes',
        details: 'Available for public, various packages 10am-8pm',
        accessType: 'day-pass',
      },
      {
        name: 'Age Restriction',
        details: '16+ only (no children allowed)',
        accessType: 'age-restriction',
      },
      {
        name: 'Spa Hours',
        details: 'Treatments 9:30am-7:30pm and Spa Days 10am-8pm',
        accessType: 'spa-hours',
      },
      {
        name: 'Footwear',
        details: 'No slippers provided - bring flip flops or purchase on-site',
        accessType: 'general',
      },
      {
        name: 'Pregnancy',
        details: 'No thermal cabins, hot tubs or mud rooms',
        accessType: 'general',
      },
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
    agePolicy: '16+ only',
    relatedSpas: [10, 15],
  },
  {
    id: 14,
    url: 'another-place-the-lake',
    name: 'Another Place, The Lake',
    location: 'Ullswater',
    address: {
      street: 'Watermillock',
      locality: 'Ullswater',
      region: 'Cumbria',
      postcode: 'CA11 0LP',
      country: 'GB',
    },
    metaDescription:
      'Family-friendly Ullswater spa featuring 20m pool with panoramic lake views. Open-air hot tub and thermal experiences.',
    intro: `Another Place, The Lake brings a contemporary, design-led approach to Lake District wellness. The Swim Club sits on the shores of Ullswater at Watermillock, centred around a striking 20-metre pool with floor-to-ceiling glass walls, skylight, and views across the water to the fells beyond.

The pool uses UV-filtered, low-chlorine water and includes a shallow area for children. A Swedish outdoor hot tub and sauna overlook the grounds (both 16+ only). The treatment menu features 18 spa experiences using land&water products, including the signature Fell Walkers Massage designed for tired legs after a day on the fells, plus pregnancy-safe options and side-by-side treatments for couples.

Swim Club access is complimentary for all hotel guests. Day memberships are available for non-residents. Family swim runs 9am to 6pm, with adult-only sessions 7am to 9am and 6pm to 9pm.`,
    websiteUrl: 'https://another.place/the-lake/swim-club/',
    accessLabels: ['free-for-all-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_another-place.jpg',
    imageAlt:
      'Stunning infinity-edge pool at Another Place The Lake on the shores of Ullswater, featuring floor-to-ceiling glass walls with breathtaking Lake District mountain and valley views, modern minimalist design with exposed beams, and seamless indoor-outdoor spa experience in a luxury countryside retreat',
    keyFeatures: [
      'Indoor pool with views of Ullswater lake',
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
      {
        name: 'Hotel Guests',
        details: 'Free access for Hotel guests',
        accessType: 'hotel',
      },
      {
        name: 'Day Passes',
        details: 'Day membership available',
        accessType: 'day-pass',
      },
      {
        name: 'Pool Hours',
        details: '7am-9pm daily',
        accessType: 'spa-hours',
      },
      {
        name: 'Adult Swim Times',
        details: '7am-9am and 6pm-9pm',
        accessType: 'spa-hours',
      },
      {
        name: 'Family Swim Times',
        details: '9am-6pm',
        accessType: 'spa-hours',
      },
      {
        name: 'Age Restriction',
        details: 'Hot tub and sauna 16+ only',
        accessType: 'age-restriction',
      },
      {
        name: 'Treatments',
        details: 'Treatments available',
        accessType: 'general',
      },
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
    agePolicy: '16+ for hot tub and sauna',
    relatedSpas: [2, 11],
  },
  {
    id: 2,
    url: 'armathwaite-hall-hotel-spa',
    name: 'Armathwaite Hall Hotel & Spa',
    location: 'Bassenthwaite',
    address: {
      street: 'Bassenthwaite Lake',
      locality: 'Bassenthwaite',
      region: 'Cumbria',
      postcode: 'CA12 4RE',
      country: 'GB',
    },
    metaDescription:
      'Luxury Bassenthwaite spa with multiple outdoor infinity pools and fell views. Sauna, steam room, and lakeside relaxation. Ideal for couples.',
    intro: `The Spa at Armathwaite Hall Hotel & Spa combines contemporary wellness facilities with a historic Lake District estate setting. Located on the shores of Bassenthwaite Lake near Keswick, within 400 acres of private deer park and woodland, the spa features a 16-metre indoor infinity pool alongside multiple outdoor infinity pools and an outdoor hot tub with views across the surrounding fells.

The thermal suite includes a traditional Finnish sauna and an Amethyst Crystal Cave steam room for deep heat experiences. The treatment menu spans 34 experiences, including the Herbal Sleep Cocoon wrap designed to promote restful sleep after fell walking.

Spa access is complimentary for all hotel guests and Day spa packages are available for non-residents. This is an 18+ spa for bookings and treatments, though under-16s can use the facilities with adult supervision.`,
    websiteUrl: 'https://armathwaite-hall.com/spa',
    accessLabels: ['free-for-all-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_armathwaite-hall.jpg',
    imageAlt:
      'Luxury thermal relaxation suite at Armathwaite Hall Hotel and Spa near Bassenthwaite Lake, featuring heated ceramic loungers with burnt orange throws, ambient candlelit atmosphere with green velvet curtains and contemporary design, offering award-winning spa facilities in a Lake District country estate setting',
    keyFeatures: [
      'Indoor swimming pool',
      'Outdoor infinity pools',
      'Finnish sauna and crystal steam room',
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
      { name: 'Hot Tub', details: 'Hot tub' },
    ],
    accessPolicy: [
      {
        name: 'Hotel Guests',
        details: 'Spa included with room booking',
        accessType: 'hotel',
      },
      {
        name: 'Day Passes',
        details: 'Packages available',
        accessType: 'day-pass',
      },
      {
        name: 'Pre-booking',
        details: 'Recommended',
        accessType: 'general',
      },
      {
        name: 'Age Restriction',
        details: '18+ to book spa experiences.',
        accessType: 'age-restriction',
      },
      {
        name: 'Age Restriction',
        details:
          'Under 16s can use facilities only Monday-Sunday 8:30am-9:30am with adult supervision',
        accessType: 'age-restriction',
      },
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
    agePolicy: '18+ to book spa experiences.',
    relatedSpas: [6, 9],
  },
  {
    id: 3,
    url: 'brimstone-hotel-spa',
    name: 'Brimstone Spa',
    location: 'Great Langdale',
    address: {
      street: 'Great Langdale',
      locality: 'Great Langdale',
      region: 'Cumbria',
      postcode: 'LA22 9NX',
      country: 'GB',
    },
    metaDescription:
      "Great Langdale's tranquil spa features unique swim-through indoor/outdoor pool. Mountain views and thermal suite. Ideal for couples and girls' weekends.",
    websiteUrl: 'https://brimstonehotel.co.uk/rooms/spa-break/',
    intro: `Brimstone Spa brings contemporary Scandinavian-inspired design to Great Langdale, featuring a unique 9-metre swim-through pool that connects indoor relaxation with outdoor fell views. Located on the Langdale Estate in the heart of the Lake District, this adults-only spa combines thermal experiences with Lake District-inspired treatments.

Five thermal facilities include a Finnish sauna, laconium for gentle heat, aroma steam room, ice room, and multi-sensory experience showers. The treatment menu features 27 experiences using exclusive Pure Alchemy products developed from Lake District natural elements, including the signature Fellwalker treatment designed for mountain enthusiasts.

Spa access is complimentary for all Brimstone Hotel guests throughout their stay. The spa is exclusive to hotel guests only – day passes are not available. This is an adults-only environment.`,
    accessLabels: ['free-for-all-guests', 'no-day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_brimstone-hotel.jpg',
    imageAlt:
      'Unique swim-through hydrotherapy pool at Brimstone Hotel and Spa in Langdale featuring iridescent blue mosaic tiles, modern Nordic-inspired design with wooden accents and floor-to-ceiling windows, white heated loungers, and indoor-outdoor connectivity in the heart of the Lake District',
    keyFeatures: [
      'Swim-through indoor/outdoor pool',
      'Finnish sauna, laconium and aroma steam room',
      'Ice room and experience showers',
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
      {
        name: 'Hotel Guests',
        details: 'Spa included with room booking',
        accessType: 'hotel',
      },
      {
        name: 'Day Passes',
        details: 'Not available',
        accessType: 'day-pass',
      },
      {
        name: 'Pre-booking',
        details: 'Guest access automatic',
        accessType: 'general',
      },
      {
        name: 'Age Restriction',
        details: 'Adults only',
        accessType: 'age-restriction',
      },
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
    relatedSpas: [8, 13],
  },
  {
    id: 4,
    url: 'daffodil-hotel-spa',
    name: 'Daffodil Hotel Spa',
    location: 'Grasmere',
    address: {
      street: 'Keswick Road',
      locality: 'Grasmere',
      region: 'Cumbria',
      postcode: 'LA22 9PR',
      country: 'GB',
    },
    metaDescription:
      "Grasmere's contemporary spa with thermal facilities in the village heart. Modern wellness and mountain views. Perfect for village-based escapes.",
    intro: `Daffodil Hotel Spa offers contemporary wellness in the heart of Grasmere village, just a five-minute walk from the village center and on the shores of Grasmere lake. The spa features a 33ft hydrotherapy pool with cascade water features, creating multiple levels of hydromassage.

Thermal facilities include a Finnish sauna, steam room, and tepidarium for gentle warming heat therapy. The spa also features a rasul mud chamber where guests can apply mineral-rich mud in a tranquil tiled room. The treatment menu spans 33 experiences using Germaine De Capuccini and Temple Spa products.

Spa access is complimentary for all hotel guests from 2pm on arrival until midday on departure. Day passes are available for non-residents for two-hour sessions. This is a 16+ spa.`,
    websiteUrl:
      'https://www.crerarhotels.com/collection/daffodil-hotel-and-spa/wellness/the-spa/',
    accessLabels: ['free-for-all-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_daffodil-hotel-and-spa.webp',
    imageAlt:
      'Contemporary hydrotherapy pool at Daffodil Hotel and Spa in Grasmere with dramatic blue and purple ambient lighting, cascade waterfall features, heated lounger seating, and modern minimalist design creating a tranquil Lake District wellness experience',
    keyFeatures: [
      'Indoor hydrotherapy pool with cascade features',
      'Finnish sauna and steam room',
      'Rasul mud chamber',
    ],
    thermalFacilities: [
      { name: 'Finnish Sauna', details: 'Traditional Finnish sauna' },
      { name: 'Steam Room', details: 'Revitalising steam room' },
      { name: 'Tepidarium', details: 'Gentle warming heat therapy' },
      {
        name: 'Rasul Mud Chamber',
        details: 'Mineral-rich mud application in tranquil tiled room',
      },
    ],
    poolFeatures: [
      {
        name: 'Hydrotherapy Pool',
        details:
          '33ft hydrotherapy pool with cascade water features, creating multiple levels of hydromassage',
      },
    ],
    accessPolicy: [
      {
        name: 'Hotel Guests',
        details: 'Free spa access included with room booking',
        accessType: 'hotel',
      },
      {
        name: 'Day Passes',
        details: 'Public day passes available',
        accessType: 'day-pass',
      },
      {
        name: 'Pre-booking',
        details: 'Required: Arrive 30 mins before any treatment',
        accessType: 'general',
      },
      {
        name: 'Age Restriction',
        details: '16+ only',
        accessType: 'age-restriction',
      },
      {
        name: 'Spa Hours',
        details: '8am-8pm daily',
        accessType: 'spa-hours',
      },
      {
        name: 'Treatment Hours',
        details: '10am-6:30pm',
        accessType: 'spa-hours',
      },
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
    relatedSpas: [11, 2],
  },
  {
    id: 5,
    url: 'swan-hotel-spa',
    name: 'Swan Hotel Spa',
    location: 'Newby Bridge',
    address: {
      street: 'Newby Bridge',
      locality: 'Newby Bridge',
      region: 'Cumbria',
      postcode: 'LA12 8NB',
      country: 'GB',
    },
    metaDescription:
      'Newby Bridge spa with outdoor Finnish sauna and cold plunge pool overlooking the River Leven. Traditional wellness experiences. Perfect for rejuvenating spa breaks.',
    intro: `Swan Hotel Spa, known as Holte Spa, brings contemporary thermal wellness to Newby Bridge on the River Leven at the southern tip of Lake Windermere. The spa features a unique swim-through hydrotherapy pool connecting indoor relaxation with heated outdoor bathing, naturally filtered with minimal chlorine.

Five thermal experiences include an authentic outdoor Finnish sauna with river views, indoor Finnish sauna, 100% humidity steam room, cold plunge pool for contrast therapy, and multi-sensory experience showers with tropical rain and monsoon effects. The 28 Temple Spa treatments include pregnancy-safe massage and Gua Sha facial techniques.

Spa access is complimentary for Splendid room bookings and above. Standard room guests and day visitors can add two-hour spa sessions. This is an 18+ spa, though 16-17 year olds can visit with a parent or guardian.`,
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
      {
        name: 'Hotel Guests',
        details: 'Free spa access for Splendid room bookings and above',
        accessType: 'hotel',
      },
      {
        name: 'Standard Rooms',
        details: 'Day pass available',
        accessType: 'hotel',
      },
      {
        name: 'Day Passes',
        details: 'Public day passes available',
        accessType: 'day-pass',
      },
      {
        name: 'Pre-booking',
        details: 'Recommended',
        accessType: 'general',
      },
      {
        name: 'Age Restriction',
        details: '18+ (16-17 with parent/guardian)',
        accessType: 'age-restriction',
      },
      {
        name: 'Spa Hours',
        details: '10am-4pm',
        accessType: 'spa-hours',
      },
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
    relatedSpas: [9, 1],
  },
  {
    id: 8,
    url: 'ambleside-salutation-hotel-spa',
    name: 'Ambleside Salutation Hotel & Spa',
    location: 'Ambleside',
    address: {
      street: 'Lake Road',
      locality: 'Ambleside',
      region: 'Cumbria',
      postcode: 'LA22 0BX',
      country: 'GB',
    },
    metaDescription:
      "Central Ambleside spa featuring infrared sauna and outdoor hydrotherapy fountain. Intimate wellness facilities, ideal for couples' retreats.",
    intro: `Waterfall Spa at Ambleside Salutation Hotel brings contemporary wellness to the heart of Ambleside village, a 350-year-old hotel on Lake Road. The spa features a 13-metre heated pool with a starlit fibre optic ceiling, creating an atmospheric swimming experience alongside an outdoor hydrotherapy fountain spa.

Thermal facilities include an infrared sauna for deep tissue relaxation, steam room, ice fountain for contrast cooling, and a poolside hot tub. The 18 Elemis Expert treatments include the Walkers Leg Massage designed specifically for tired legs after fell walking, plus pregnancy-safe massage.

Spa access is complimentary for all hotel guests throughout their stay. The spa is exclusive to hotel residents only and day passes are not available to the public.`,
    websiteUrl: 'https://www.hotelslakedistrict.com/waterfall-spa/',
    accessLabels: ['free-for-all-guests', 'no-day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_salutation-hotel.jpg',
    imageAlt:
      'Elegant indoor pool at The Salutation Hotel and Spa in Ambleside featuring starlit fibre optic ceiling, suspended designer pod chairs, modern grey loungers, and sophisticated neutral colour palette creating a tranquil spa experience in the heart of the Lake District',
    keyFeatures: [
      'Indoor pool with starlit ceiling',
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
      {
        name: 'Hotel Guests',
        details: 'Free spa access included',
        accessType: 'hotel',
      },
      {
        name: 'Day Passes',
        details: 'Not available to public',
        accessType: 'day-pass',
      },
      {
        name: 'Pre-booking',
        details: 'Required for spa treatments',
        accessType: 'general',
      },
      {
        name: 'Age Restriction',
        details: 'Under 16 must be accompanied by an adult',
        accessType: 'age-restriction',
      },
      {
        name: 'Spa Hours',
        details: '8am-8pm daily',
        accessType: 'spa-hours',
      },
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
    agePolicy: 'Under 16 must be accompanied by an adult',
    relatedSpas: [3, 13],
  },
  {
    id: 9,
    url: 'lakeside-hotel-spa',
    name: 'Lakeside Hotel & Spa',
    location: 'Newby Bridge',
    address: {
      street: 'Lakeside',
      locality: 'Newby Bridge',
      region: 'Cumbria',
      postcode: 'LA12 8AT',
      country: 'GB',
    },
    metaDescription:
      'Romantic Newby Bridge spa with 17m pool overlooking Lake Windermere. Outdoor spa garden with fire pit. Your lakeside wellness escape for a weekend.',
    intro: `Lakeside Hotel & Spa offers is a destination spa on the southern shore of Lake Windermere in Newby Bridge. The spa features a 17-metre heated pool with views across Lake Windermere, incorporating a beach-style shallow area for families.

Thermal facilities include a traditional sauna, steam room, and poolside jacuzzi. The outdoor spa garden provides a tranquil retreat with an open fire pit and heat domes to keep warm while enjoying the lakeside setting. All spa treatments are delivered by skilled therapists using a range of products.

Spa access is complimentary for all hotel guests, including pool, sauna, steam room and gym. Day spa experiences are available for non-residents. The pool welcomes children, making this a family-friendly wellness destination.`,
    websiteUrl: 'https://lakesidehotel.co.uk/spa',
    accessLabels: ['free-for-all-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_lakeside-hotel.webp',
    imageAlt:
      'Contemporary indoor pool at Lakeside Hotel Health Club and Spa on Lake Windermere, featuring distinctive teal and green mosaic tile columns, flowing wave-pattern ceiling design, and spacious swimming area with loungers overlooking the Lake District waterfront',
    keyFeatures: [
      'Indoor pool overlooking Lake Windermere',
      'Traditional sauna and steam room',
      'Outdoor spa garden with fire pit and heat domes',
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
      {
        name: 'Hotel Guests',
        details: 'Free access to pool, gym, sauna and steam room included',
        accessType: 'hotel',
      },
      {
        name: 'Day Passes',
        details: 'Public day passes available',
        accessType: 'day-pass',
      },
      {
        name: 'Children',
        details: 'Pool is suitable for children',
        accessType: 'age-restriction',
      },
      {
        name: 'Spa Garden',
        details: 'Outdoor retreat with fire pit and heat domes',
        accessType: 'general',
      },
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
    relatedSpas: [5, 13],
  },
  {
    id: 11,
    url: 'rothay-garden-by-harbour-hotels',
    name: 'Rothay Garden by Harbour Hotels',
    location: 'Grasmere',
    address: {
      street: 'Broadgate',
      locality: 'Grasmere',
      region: 'Cumbria',
      postcode: 'LA22 9RQ',
      country: 'GB',
    },
    metaDescription:
      "Grasmere's riverside spa featuring hydrotherapy pool with fell views. Infrared heated loungers and peaceful setting. Ideal for wellness-focused groups.",
    intro: `The Riverside Spa at Rothay Garden offers contemporary wellness in the heart of Grasmere village. Nestled within a historic 1856 building with two acres of riverside gardens. The spa features floor-to-ceiling windows overlooking the River Rothay and surrounding fells, creating a tranquil connection with the Lakeland landscape.

The HydroSpa hydrotherapy pool includes sunken loungers for passive relaxation, complemented by a herbal pine sauna, aromatherapy steam room, monsoon experience showers, and infrared heated loungers for deep muscle relaxation. The heated pebble reflexology walk provides a unique sensory experience. Spa treatments can be delivered in-room when booked in advance.

Spa access is complimentary for all hotel guests with no booking required. Day spa experiences are available to the public. This is an 18+ spa for a peaceful, adults-only atmosphere.`,
    websiteUrl:
      'https://www.harbourhotels.co.uk/our-hotels/lake-district/rothay-garden-by-harbour-hotels/riverside-spa',
    accessLabels: ['free-for-all-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_rothay-garden-hotel.jpg',
    imageAlt:
      'Panoramic hydrotherapy pool at Rothay Garden Hotel and Riverside Spa in Grasmere, featuring curved floor-to-ceiling windows with dramatic Lake District fell views, dual cascade water features, bamboo-panelled walls, and intimate circular hot tub design surrounded by nature',
    keyFeatures: [
      'Hydrotherapy pool with riverside and fell views',
      'Infrared heated loungers',
      'Herbal pine sauna and steam room',
    ],
    thermalFacilities: [
      { name: 'Sauna', details: 'Herbal pine sauna' },
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
      {
        name: 'Hotel Guests',
        details: 'Free spa access included, no booking required',
        accessType: 'hotel',
      },
      {
        name: 'Day Passes',
        details: 'Available to public',
        accessType: 'day-pass',
      },
      {
        name: 'Treatments',
        details: 'In-room treatments available when booked in advance',
        accessType: 'general',
      },
      {
        name: 'Age Restriction',
        details: '18+ only, no children permitted',
        accessType: 'age-restriction',
      },
      {
        name: 'Spa Hours',
        details: '8am-8pm daily',
        accessType: 'spa-hours',
      },
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
    agePolicy: '18+ only, no children permitted',
    relatedSpas: [4, 12],
  },
  {
    id: 10,
    url: 'beech-hill-hotel-spa',
    name: 'Beech Hill Hotel & Spa',
    location: 'Windermere',
    address: {
      street: 'Newby Bridge Road',
      locality: 'Windermere',
      region: 'Cumbria',
      postcode: 'LA23 3LR',
      country: 'GB',
    },
    metaDescription:
      'Windermere spa featuring two outdoor vitality pools on lakeside terrace. Panoramic lake views and thermal facilities. Perfect for romantic lakeside getaways.',
    intro: `Built in the early 1900s on the eastern shore of Lake Windermere, Beech Hill Hotel & Spa sits in landscaped gardens with two private jetties offering direct access to England's largest lake. The signature feature is two outdoor vitality spa pools positioned on a lakeside terrace overlooking panoramic Windermere and fell views, rare among Lake District spas.

The 35ft indoor pool features atmospheric lighting and floor-to-ceiling windows maximising lake vistas. Thermal facilities include a Himalayan sauna and aromatic steam room. Outside, the dual vitality spa pools on the dedicated terrace provide alfresco hydrotherapy with uninterrupted views. Secret gate access leads to the lakeshore for open water swimming from the private beach.

Complimentary spa access included for all hotel guests, with day spa packages available to non-residents. Pre-booking required. Spa facilities are 16+ only, though children may use the pool 10am-1pm.`,
    websiteUrl: 'https://beechhillhotel.co.uk/spa',
    accessLabels: ['free-for-all-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_beech-hill-hotel.jpg',
    imageAlt:
      'Botanical-inspired indoor pool at Beech Hill Hotel and Spa near Windermere, featuring natural woven pendant lights, cascading artificial greenery from ceiling, dark slate mosaic walls, turquoise heated pool, and contemporary nature-themed wellness design in the Lake District',
    keyFeatures: [
      'Indoor pool with Lake Windermere views',
      'Himalayan sauna and aromatic steam room',
      'Two outdoor vitality spa pools on terrace',
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
      {
        name: 'Hotel Guests',
        details: 'Complimentary spa access included',
        accessType: 'hotel',
      },
      {
        name: 'Spa Hours',
        details: 'Thu-Sun 9:30am-4pm, Fri-Sat 9:30am-6pm',
        accessType: 'spa-hours',
      },
      {
        name: 'Treatments',
        details: 'Spa access included with all treatments',
        accessType: 'general',
      },
      {
        name: 'Pre-booking',
        details: 'Required',
        accessType: 'general',
      },
      {
        name: 'Age Restriction',
        details: '16+ only for spa',
        accessType: 'age-restriction',
      },
      {
        name: 'Children',
        details: 'Allowed in pool 10am-1pm only',
        accessType: 'age-restriction',
      },
      {
        name: 'Group Size',
        details: 'Maximum 6 people',
        accessType: 'general',
      },
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
    agePolicy:
      '16+ only for spa facilities. Children allowed in pool only 10am-1pm',
    relatedSpas: [7, 6],
  },
  {
    id: 16,
    url: 'netherwood-hotel-spa',
    name: 'Netherwood Hotel & Spa',
    location: 'Grange-over-Sands',
    address: {
      street: 'Lindale Road',
      locality: 'Grange-over-Sands',
      region: 'Cumbria',
      postcode: 'LA11 6ET',
      country: 'GB',
    },
    metaDescription:
      'Grange-over-Sands spa with unique plunge tub experience (hot, warm, cold) and salt inhalation room. Therapeutic wellness facilities. Ideal for friends seeking relaxation.',
    intro: `This Grade II listed Victorian mansion overlooks Morecambe Bay from Grange-over-Sands at the southern gateway to the Lake District. Netherwood Hotel & Spa's signature feature is its plunge tub room, offering hot, warm and cold hydrotherapy circuits for therapeutic muscle relaxation and circulation. Adults-only throughout for a peaceful atmosphere.

Five thermal facilities create a wellness journey: calming salt inhalation room for respiratory health, traditional dry heat sauna, aromatherapy steam room infused with lemongrass and citrus, refreshing ice fountain and thermal shower with massaging jets.

Hotel guests pay separately for Thermal Journey access (daily 10am-5:30pm), with day passes also available to non-residents. Robes, towels and slippers included. Ideal for wellness seekers wanting unique hydrotherapy circuits and therapeutic facilities in a coastal Victorian setting.`,
    websiteUrl: 'https://netherwood-hotel.co.uk/spa-fitness',
    accessLabels: ['paid-for-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_netherwood-hotel.webp',
    imageAlt:
      'Unique circular Kneipp footbath at Netherwood Hotel and Spa in Grange-over-Sands, featuring natural rope-wrapped wooden basin design with dual cascade water features, positioned against authentic Lakeland dry stone walling with designer loungers and orange accent cushions',
    keyFeatures: [
      'Plunge tub room with hot, warm and cold tubs',
      'Salt inhalation room',
      'Dry heat sauna and aroma steam room',
      'Ice fountain',
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
          'Hot, warm and cold hydrotherapy circuits for therapeutic muscle relaxation and circulation',
      },
    ],
    accessPolicy: [
      {
        name: 'Hotel Guests',
        details: 'Must pay separately for Thermal Journey',
        accessType: 'hotel',
      },
      {
        name: 'Day Passes',
        details: 'Day passes available',
        accessType: 'day-pass',
      },
      {
        name: 'Thermal Journey Hours',
        details: 'Mon-Sun 10am-5:30pm',
        accessType: 'spa-hours',
      },
      {
        name: 'Treatment Hours',
        details: '10am-6pm',
        accessType: 'spa-hours',
      },
      {
        name: 'Amenities',
        details: 'Robes, towels and slippers included',
        accessType: 'general',
      },
      {
        name: 'Age Restriction',
        details: 'Adults only',
        accessType: 'age-restriction',
      },
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
    agePolicy: 'Adults only',
    relatedSpas: [17, 15],
  },
  {
    id: 15,
    url: 'appleby-manor-hotel-garden-spa',
    name: 'Appleby Manor Hotel & Garden Spa',
    location: 'Appleby-in-Westmorland',
    address: {
      street: 'Roman Road',
      locality: 'Appleby-in-Westmorland',
      region: 'Cumbria',
      postcode: 'CA16 6JB',
      country: 'GB',
    },
    metaDescription:
      "Appleby Manor's outdoor spa garden with hot tubs, fire pit, and scenic grounds. Traditional spa facilities. Perfect for groups and special celebrations.",
    intro: `The Garden Spa at Appleby Manor Hotel offers contemporary wellness in the Eden Valley on the edge of the Lake District, near Appleby-in-Westmorland. Set within a 19th-century country house hotel with views toward Appleby Castle, the spa features an indoor vitality pool with underwater massage loungers, volcano pads, and shoulder cannons for targeted hydrotherapy.

Thermal experiences include a traditional sauna, aromatherapy steam room, salt inhalation room for respiratory benefits, and rain sky experience showers. The sheltered outdoor spa garden features hot tubs and an open fire pit for year-round relaxation, plus a private hot tub is available for hire with panoramic countryside views.

Hotel guests must book spa access separately and day spa packages are available to the public. This is a 16+ spa, though some treatments require guests to be 18+.`,
    websiteUrl: 'https://applebymanor.co.uk/garden-spa',
    accessLabels: ['paid-for-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_appleby-manor.jpg',
    imageAlt:
      'Contemporary hydrotherapy pool at Appleby Manor Country House Hotel near Appleby-in-Westmorland, featuring dramatic blue LED underwater lighting, natural Lake District pebble stone border detail, modern wicker relaxation seating with tropical palms, and luxury spa facilities in the Eden Valley',
    keyFeatures: [
      'Hydrotherapy pool with underwater massage loungers',
      'Outdoor spa garden with hot tubs and fire pit',
      'Salt inhalation room and sauna',
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
      {
        name: 'Hotel Guests',
        details: 'Must pay separately for spa access',
        accessType: 'hotel',
      },
      {
        name: 'Day Passes',
        details: 'Day passes available',
        accessType: 'day-pass',
      },
      {
        name: 'Spa Breaks',
        details: 'Available with overnight stays',
        accessType: 'general',
      },
      {
        name: 'Age Restriction',
        details: '16+ (treatments may require 18+)',
        accessType: 'age-restriction',
      },
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
    agePolicy: '16+ (treatments may require 18+)',
    relatedSpas: [7, 16],
  },
  {
    id: 12,
    url: 'north-lakes-hotel-spa',
    name: 'North Lakes Hotel & Spa',
    location: 'Penrith',
    address: {
      street: 'Ullswater Road',
      locality: 'Penrith',
      region: 'Cumbria',
      postcode: 'CA11 8QT',
      country: 'GB',
    },
    metaDescription:
      "Penrith's family-friendly spa with dedicated family sessions and thermal facilities. Indoor pool and wellness amenities. Perfect for a group of friends.",
    websiteUrl: 'https://northlakeshotel.com/spa-treatments',
    accessLabels: ['free-for-all-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_north-lakes-hotel.jpg',
    imageAlt:
      'Tranquil thermal relaxation suite at North Lakes Hotel and Spa in Penrith, featuring heated ceramic loungers with plush robes, ambient mood lighting, Lake District landscape artwork, Japanese-inspired sliding screens, and peaceful spa environment for complete relaxation',
    keyFeatures: [
      'Indoor pool',
      'Separate male and female Finnish saunas',
      'Steam room',
      'Hot tub',
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
      {
        name: 'Hotel Guests',
        details: 'Free spa access included',
        accessType: 'hotel',
      },
      {
        name: 'Day Passes',
        details: 'Day passes and memberships available',
        accessType: 'day-pass',
      },
      {
        name: 'Age Restriction',
        details: 'Children welcome during designated times only',
        accessType: 'age-restriction',
      },
      {
        name: 'Spa Hours',
        details: 'Mon-Fri 6am-9:30pm, Sat-Sun 7am-8pm',
        accessType: 'spa-hours',
      },
      {
        name: 'Amenities',
        details: 'Robes and slippers provided',
        accessType: 'general',
      },
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
    relatedSpas: [2, 9],
  },
  {
    id: 6,
    url: 'macdonald-old-england-hotel-spa',
    name: 'Macdonald Old England Hotel & Spa',
    location: 'Bowness-on-Windermere',
    address: {
      street: '23 Church Street',
      locality: 'Bowness-on-Windermere',
      region: 'Cumbria',
      postcode: 'LA23 3DF',
      country: 'GB',
    },
    metaDescription:
      "Historic Bowness spa overlooking Lake Windermere with traditional thermal facilities. Classic elegance in a prime location. Ideal for a day's relaxation by the lake.",
    websiteUrl: 'https://macdonaldhotels.co.uk/old-england/spa-leisure/spa',
    accessLabels: ['free-for-all-guests', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_old-england-hotel.jpg',
    imageAlt:
      'Modern indoor swimming pool at Macdonald Old England Hotel and Spa in Bowness-on-Windermere, featuring deep blue mosaic tiling, contemporary black and white interior design, underwater lighting, and heated pool facilities in a luxurious Lake District spa setting',
    keyFeatures: [
      'Indoor pool with Lake Windermere views',
      'Thermal suite with sauna, steam and ice room',
      'Aromatherapy experience showers',
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
      {
        name: 'Hotel Guests',
        details: 'Free access to pool and thermal suite',
        accessType: 'hotel',
      },
      {
        name: 'Spa Day Packages',
        details: 'Spa day packages available',
        accessType: 'general',
      },
      {
        name: 'Pool & Gym Hours',
        details: '7am-6:30pm',
        accessType: 'spa-hours',
      },
      {
        name: 'Children Swim Times',
        details: '10am-5pm',
        accessType: 'spa-hours',
      },
      {
        name: 'Age Restriction',
        details:
          '18+ for thermal suite, children allowed in pool during designated times',
        accessType: 'age-restriction',
      },
      {
        name: 'Pre-booking',
        details: 'Required for spa day packages with treatments',
        accessType: 'general',
      },
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
    relatedSpas: [7, 10],
  },
  {
    id: 17,
    url: 'grange-hotel',
    name: 'Grange Hotel',
    location: 'Grange-over-Sands',
    address: {
      street: 'Station Road',
      locality: 'Grange-over-Sands',
      region: 'Cumbria',
      postcode: 'LA11 6EJ',
      country: 'GB',
    },
    metaDescription:
      'Elegant Grange-over-Sands spa with thermal pool and traditional wellness facilities. Edwardian grandeur meets modern relaxation. Ideal for refined spa breaks.',
    websiteUrl: 'https://grange-hotel.co.uk/the-spa/',
    accessLabels: ['free-for-some-rooms', 'day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_grange-hotel.jpg',
    imageAlt:
      'Luxury facial treatment at The Grange Boutique Hotel and Restaurant in Grange-over-Sands, featuring professional spa therapies with skilled hands performing rejuvenating skincare treatments in an intimate, serene environment overlooking Morecambe Bay in the southern Lake District',
    keyFeatures: ['Indoor pool', 'Traditional sauna and steam room', 'Jacuzzi'],
    thermalFacilities: [
      { name: 'Sauna', details: 'Traditional sauna' },
      { name: 'Steam Room', details: 'Steam room' },
    ],
    poolFeatures: [
      { name: 'Indoor Pool', details: 'Heated indoor pool' },
      { name: 'Jacuzzi', details: 'Jacuzzi' },
    ],
    accessPolicy: [
      {
        name: 'Hotel Guests',
        details:
          'Spa access additional charge (some overnight packages include access)',
        accessType: 'hotel',
      },
      {
        name: 'Spa Day Packages',
        details: 'Available with treatment and facility access',
        accessType: 'general',
      },
      {
        name: 'Amenities',
        details: 'Robes and slippers provided',
        accessType: 'general',
      },
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
    relatedSpas: [16, 5],
  },
  {
    id: 13,
    url: 'whitewater-hotel-leisure-club',
    name: 'Whitewater Hotel & Leisure Club',
    location: 'Backbarrow',
    address: {
      street: 'The Lakeland Village',
      locality: 'Backbarrow',
      region: 'Cumbria',
      postcode: 'LA12 8PX',
      country: 'GB',
    },
    metaDescription:
      "Backbarrow's riverside spa with outdoor jacuzzi overlooking River Leven. Peaceful natural setting and intimate wellness. Ideal for secluded couples' retreats.",
    websiteUrl: 'https://whitewater-hotel.co.uk/spa-fitness/',
    accessLabels: ['free-for-all-guests', 'no-day-passes-available'],
    imageSrc: '/images/spas/lake-district-spas_whitewater-hotel.jpg',
    imageAlt:
      'Expansive leisure pool at Whitewater Hotel Country Club near Newby Bridge, featuring multi-level design with mosaic-tiled stepping stones, burgundy and cream decorative columns, spacious swimming area, and grand architectural poolside complex in the Lake District',
    keyFeatures: [
      'Outdoor jacuzzi overlooking River Leven',
      'Turkish Hamam aromatherapy steam room',
      'Indoor swimming pool',
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
      {
        name: 'Hotel Guests',
        details: 'Free spa access included, 10% discount on treatments',
        accessType: 'hotel',
      },
      {
        name: 'Day Passes',
        details: 'Not available to public',
        accessType: 'day-pass',
      },
      {
        name: 'Pre-booking',
        details: 'Required for spa treatments',
        accessType: 'general',
      },
      {
        name: 'Age Restriction',
        details: '18+ only (no one under 18 allowed for spa treatments)',
        accessType: 'age-restriction',
      },
      {
        name: 'Amenities',
        details: 'Robes and towels provided',
        accessType: 'general',
      },
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
    agePolicy: '18+ only (no one under 18 allowed for spa treatments)',
    relatedSpas: [9, 3],
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
