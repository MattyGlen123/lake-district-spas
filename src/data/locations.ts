/**
 * Single source of truth for all location pages (`/location/spas-in-{slug}`).
 *
 * Each entry drives: metadata, hero, intro copy, featured-spas section,
 * FAQ subtitle, and related-locations list for one location. Consumed by
 * `src/app/location/[slug]/page.tsx` (the page template) and by
 * `src/lib/locationPages.ts` (which derives the legacy `locationPageSlugs` /
 * `locationMetadata` exports used by LocationsGrid, FeaturedLocations,
 * Breadcrumbs and LocationHeader).
 *
 * Add a new location by adding an entry here — no other registry to update.
 */

export interface RelatedLocationEntry {
  name: string;
  slug: string;
  distance: string;
  image: string;
}

export interface LocationPageConfig {
  /** Must match `Spa.location` in src/data/spas.ts exactly. */
  name: string;
  /** Short slug — page URL is /location/spas-in-{slug}. */
  slug: string;
  /** Hero image + LocationsGrid/FeaturedLocations card image. */
  image: string;
  /** LocationsGrid / FeaturedLocations card subtitle. */
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  heroBadge: string;
  heroDescription: string;
  heroImageAlt: string;
  introContent: string;
  spaSectionTitle: string;
  faqSubtitle: string;
  relatedLocations: RelatedLocationEntry[];
}

export const locationPageConfigs: LocationPageConfig[] = [
  {
    name: 'Windermere',
    slug: 'windermere',
    image: '/images/locations/windermere-lake-district-spa-breaks.jpg',
    tagline: "England's largest lake, with world-class spas to match",
    metaTitle: 'Spas in Windermere | Lake District Spas',
    metaDescription:
      "Discover luxury spas in Windermere, England's largest lake. Compare facilities, prices, and book your perfect Lake District spa break.",
    heroBadge: 'Windermere Spas',
    heroDescription:
      "England's largest lake meets world-class wellness. From infinity pools overlooking the water to thermal suites with fell views, Windermere offers the Lake District's finest concentration of luxury spa hotels.",
    heroImageAlt:
      "Still waters of Lake Windermere reflecting green fells and mature woodland on a summer morning, the scenic backdrop for spa hotels along England's largest lake in the Lake District National Park",
    introContent: `Windermere has drawn visitors seeking restoration for over two centuries. The Victorians arrived by railway to take the waters, today's travellers come for infinity pools that seem to merge with England's largest lake and thermal suites where steam rises against a backdrop of Lakeland fells.

The town's position at the heart of the Lake District makes it the region's most accessible spa destination. Direct trains from Manchester connect in under two hours, while the M6 places Windermere within easy reach of the North West. For couples planning a Lake District wellness escape, Windermere offers two distinct spa experiences on the shores of England's largest lake.

Low Wood Bay delivers the full resort experience. Hotel guests get complimentary use of the Resort Leisure Area (indoor pool, infrared sauna, jacuzzi, and steam room) during the morning and evening hours opening times. The paid thermal journey unlocks the full estate: two outdoor infinity pools gazing across to the Langdale Pikes, an indoor infinity pool, the outdoor Fellside Sauna with lake views, dry salt sauna, steam cabin, and herbal lounge. Hotel guests get 25% off the thermal journey Monday to Thursday. The adventurous can combine spa time with sailing or paddleboarding on the lake itself.

Beech Hill offers an intimate experience. The 1900s hotel sits in landscaped gardens with private jetties and a 35ft indoor pool with atmospheric lighting. A large outdoor hot tub on the lakeside terrace provides panoramic Windermere views, while a secret gate leads directly to a private beach for wild swimming between spa sessions. The Himalayan sauna and aromatic steam room provide the thermal heat, while Caudalie treatments bring French vineyard skincare to the lakeside setting. Crucially, spa access is included for all hotel guests.

Both spas are adults-only in their thermal areas, creating the peaceful atmosphere couples seek. The setting does the rest, spa terraces look across the water as the sun drops behind Claife Heights, and treatment rooms frame views that elsewhere would be the main attraction.`,
    spaSectionTitle: 'Lake Windermere Spas',
    faqSubtitle: 'Frequently asked questions about spas in Windermere.',
    relatedLocations: [
      {
        name: 'Bowness on Windermere',
        slug: 'bowness-on-windermere',
        distance: '1 mile south',
        image:
          '/images/locations/bowness-on-windermere-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Ambleside',
        slug: 'ambleside',
        distance: '6 miles north',
        image: '/images/locations/ambleside-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Newby Bridge',
        slug: 'newby-bridge',
        distance: '6 miles south',
        image: '/images/locations/newby-bridge-lake-district-spa-breaks.jpg',
      },
    ],
  },
  {
    name: 'Ambleside',
    slug: 'ambleside',
    image: '/images/locations/ambleside-lake-district-spa-breaks.jpg',
    tagline: 'A charming fell-side town with tranquil spa retreats',
    metaTitle: 'Spas in Ambleside | Lake District Spas',
    metaDescription:
      "Discover the exclusive spa in Ambleside, the Lake District's walking capital. Waterfall Spa offers intimate wellness for hotel guests.",
    heroBadge: 'Ambleside Spa',
    heroDescription:
      "The Lake District's walking capital meets village wellness. An intimate spa retreat in the heart of one of Lakeland's most beloved villages.",
    heroImageAlt:
      'Panoramic summer view across green fields and dry stone walls toward Ambleside village nestled beside the lake, with Lakeland fells rising on both sides of the valley in the Lake District National Park',
    introContent: `Ambleside sits where lake meets fell, a slate-grey village at the head of Windermere that has drawn walkers and romantics for generations. The fells rise directly from the village streets, including Loughrigg, Wansfell, and the Fairfield Horseshoe, making this the natural base for couples who want to combine spa relaxation with Lakeland exploration.

The village itself rewards wandering. Independent shops line the narrow streets, centuries-old pubs serve local ales, and the waterfall at Stock Ghyll Force tumbles through ancient woodland just minutes from the centre. Lake Windermere's northern shore lies a short stroll away, with steamers departing for Bowness and beyond.

For spa seekers, Ambleside offers something different: exclusivity. The Waterfall Spa at Ambleside Salutation Hotel is reserved entirely for hotel guests. No day visitors, no crowds, just quiet relaxation in a 350-year-old coaching inn on Lake Road. The 13-metre pool features a starlit fibre optic ceiling that transforms evening swims into something atmospheric. An outdoor hydrotherapy pool brings even more fresh air to the spa experience.

The thermal facilities include an infrared sauna for deep tissue relaxation, particularly welcome after a day on the fells, plus steam room, ice fountain, and poolside hot tub. The treatment menu features 18 Elemis therapies including the Walkers Leg Massage, designed specifically for tired legs after fell walking. It's a spa that understands its location.

For couples seeking a Lake District escape that balances activity with indulgence, Ambleside delivers. Walk to Rydal Water in the morning, lunch in the village, spa in the afternoon, dinner at one of the excellent local restaurants. The compact geography means everything is within reach without needing a car.`,
    spaSectionTitle: 'Village Spa',
    faqSubtitle: 'Frequently asked questions about spas in Ambleside.',
    relatedLocations: [
      {
        name: 'Windermere',
        slug: 'windermere',
        distance: '6 miles south',
        image: '/images/locations/windermere-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Grasmere',
        slug: 'grasmere',
        distance: '4 miles north',
        image: '/images/locations/grasmere-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Great Langdale',
        slug: 'great-langdale',
        distance: '5 miles west',
        image: '/images/locations/great-langdale-lake-district-spa-breaks.jpg',
      },
    ],
  },
  {
    name: 'Bowness-on-Windermere',
    slug: 'bowness-on-windermere',
    image:
      '/images/locations/bowness-on-windermere-lake-district-spa-breaks.jpg',
    tagline: 'Lakeside village with boutique wellness escapes',
    metaTitle: 'Spas in Bowness-on-Windermere | Lake District Spas',
    metaDescription:
      'Two spas in Bowness-on-Windermere at the heart of Lake Windermere. Historic lakeside elegance at the Old England or poolside prosecco at the Lakes Hotel.',
    heroBadge: 'Bowness-on-Windermere Spas',
    heroDescription:
      "The Lake District's beating heart, where lake cruises depart and two very different spas await. Historic lakeside elegance or poolside prosecco - Bowness offers both.",
    heroImageAlt:
      'Aerial view of a tree-covered island surrounded by calm blue water on Lake Windermere near Bowness, with wooded shores and rolling Lakeland fells stretching into the distance on a summer morning',
    introContent: `Bowness-on-Windermere sits at the centre of everything. The piers here have launched lake cruises since Victorian times, ferrying visitors to Ambleside, Lakeside and the islands that dot England's largest lake. The village itself bustles with independent shops, restaurants and the World of Beatrix Potter attraction. This is the Lake District at its most accessible. Trains connect to Windermere station a mile uphill, coaches arrive daily, and the A591 brings traffic from every direction.

For couples seeking spa time alongside their Lake District exploration, Bowness delivers genuine choice. Two spa hotels occupy prime positions here, each with its own distinct character and appeal.

The Macdonald Old England Hotel represents the classic Lake District experience. This historic property stands directly on the lake shore, its mature gardens running down to private jetties where guests can moor boats or simply watch the water. The 20-metre indoor pool frames panoramic Windermere views through floor-to-ceiling windows. A traditional thermal suite includes Finnish sauna, aromatherapy steam room, ice room for contrast therapy, and experience showers. Spa access comes complimentary for hotel guests, while day visitors can book packages from £109 including treatments and lunch with lake views.

The Lakes Hotel & Spa takes an entirely different approach. This is spa as theatre - atmospheric mood lighting transforms the pool area after dark, and a poolside bar means you can genuinely sip prosecco while soaking in one of two feature hot tubs. The main pool has a signature "secret button" that makes the entire surface bubble, adding playfulness to proceedings. A cold plunge pool provides the contrast to sauna and steam room sessions. The spa operates extended hours until 10:30pm, making it ideal for evening relaxation. Access is exclusive to hotel guests, ensuring a more intimate atmosphere.

The village location means a trip to the spa slots easily into wider Lake District plans. Walk the shoreline promenade, take a cruise to Ambleside, explore Beatrix Potter's world, then return for thermal relaxation as the sun sets over the fells. Bowness puts you at the heart of the action while offering genuine retreat.`,
    spaSectionTitle: 'Bowness-on-Windermere Spas',
    faqSubtitle:
      'Frequently asked questions about spas in Bowness-on-Windermere.',
    relatedLocations: [
      {
        name: 'Windermere',
        slug: 'windermere',
        distance: '1 mile north',
        image: '/images/locations/windermere-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Ambleside',
        slug: 'ambleside',
        distance: '5 miles north',
        image: '/images/locations/ambleside-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Newby Bridge',
        slug: 'newby-bridge',
        distance: '7 miles south',
        image: '/images/locations/newby-bridge-lake-district-spa-breaks.jpg',
      },
    ],
  },
  {
    name: 'Grasmere',
    slug: 'grasmere',
    image: '/images/locations/grasmere-lake-district-spa-breaks.jpg',
    tagline: "Wordsworth's village, surrounded by dramatic fells",
    metaTitle: 'Spas in Grasmere | Lake District Spas',
    metaDescription:
      "Spas in Grasmere, Wordsworth's beloved Lake District village. Two spa hotels with thermal pools, saunas and treatments between literary sites and fell walks.",
    heroBadge: 'Grasmere Spas',
    heroDescription:
      "Wordsworth's beloved village in the heart of the Lakes, where two spa hotels offer relaxation between literary pilgrimages and classic fell walks.",
    heroImageAlt:
      'Aerial view of Grasmere village beside its lake with a tree-covered island in the foreground, green fields and mature woodland leading up to rounded Lakeland fells under a clear summer sky in the Lake District',
    introContent: `Grasmere sits in a bowl of fells at the geographic heart of the Lake District, a village that William Wordsworth famously called "the loveliest spot that man hath found". Visitors come for the literary pilgrimage, the cottage, the museum, his grave in St Oswald's churchyard, but they stay for the landscape that inspired him.

The village itself is a compact cluster of slate cottages, galleries and tea rooms gathered around the church. The famous Grasmere Gingerbread Shop occupies the old schoolhouse where Wordsworth once taught, while the Heaton Cooper Studio continues a century-long tradition of Lake District landscape painting. Beyond the village, Grasmere lake curves beneath Helm Crag's distinctive rocky summit, and the paths that radiate outward lead to Easedale Tarn, Loughrigg Terrace, Rydal Water and the high fells beyond. Rowing boats can be hired at Faeryland on the lake's shore during summer months.

Two spa hotels serve Grasmere, each with a distinct character. The Daffodil Hotel & Spa occupies the only lakeside position in the village, with the lake-view dining room and terrace making the most of that waterfront setting. The spa itself includes a 10-metre thermal pool, sauna, steam room, tepidarium and a Moroccan-style mud rasul, with treatments using TEMPLESPA products. Hotel guests have complimentary access, while day visitors can book two-hour sessions from £30 per person on weekdays.

Rothay Garden by Harbour Hotels takes a different approach, nestled in two acres of riverside gardens on the edge of the village where the River Rothay flows beneath the fells. The original building dates from 1856, and the feel remains traditional country house despite recent refurbishment. The Riverside Spa offers a hydrotherapy pool with sunken loungers, herbal pine sauna, aromatherapy room, monsoon showers and heated infrared loungers, a compact but well-considered thermal circuit. The 2 AA Rosette Garden Restaurant emphasises local seasonal produce, and the hotel welcomes dogs throughout.

For visitors combining spa time with walking, Grasmere offers an ideal base. The classic circuit around the lake takes under an hour, while the path to Easedale Tarn and back fills a morning. More ambitious routes climb Helm Crag's rocky howff or traverse to Fairfield. After a day on the fells, both spas provide a compelling reason to linger.`,
    spaSectionTitle: 'Village Spas',
    faqSubtitle: 'Frequently asked questions about spas in Grasmere.',
    relatedLocations: [
      {
        name: 'Ambleside',
        slug: 'ambleside',
        distance: '4 miles south',
        image: '/images/locations/ambleside-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Windermere',
        slug: 'windermere',
        distance: '9 miles south',
        image: '/images/locations/windermere-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Borrowdale',
        slug: 'borrowdale',
        distance: '8 miles north',
        image:
          '/images/locations/borrowdale-valley-lake-district-spa-breaks.jpg',
      },
    ],
  },
  {
    name: 'Borrowdale',
    slug: 'borrowdale',
    image: '/images/locations/borrowdale-valley-lake-district-spa-breaks.jpg',
    tagline: 'A secluded valley of ancient oak woods and quiet spas',
    metaTitle: 'Spas in Borrowdale | Lake District Spas',
    metaDescription:
      "Discover Borrowdale spas in the Lake District's most dramatic valley. Lodore Falls Hotel features a 16-metre infinity pool overlooking Derwentwater.",
    heroBadge: 'Borrowdale Spa',
    heroDescription:
      "One of the Lake District's most dramatic valleys, home to an infinity-edge spa overlooking Derwentwater and the fells beyond.",
    heroImageAlt:
      'Traditional wooden gate and dry stone wall opening onto wildflower meadows in Borrowdale valley, with steep green fells and wooded hillsides rising into summer clouds in the heart of the Lake District',
    introContent: `Borrowdale cuts deep into the heart of the Lake District, a glacier-carved valley where towering fells rise steeply from the shores of Derwentwater. This is walking country at its finest, ancient oakwoods cloak the lower slopes, the River Derwent winds through valley-bottom meadows, and at the Jaws of Borrowdale the landscape narrows dramatically between Castle Crag and King's How. It's a place that has drawn visitors since Georgian times, when the Picturesque movement sent tourists in search of wild, romantic scenery.

The Falls Spa at Lodore Falls Hotel occupies a striking position at the northern end of Borrowdale, where the hotel's namesake waterfall cascades down behind the property. The spa building itself is a contemporary addition, designed to frame the landscape through floor-to-ceiling glass. Its 16-metre outdoor infinity-edge vitality pool is the undisputed centrepiece, one of the largest in the region, with underwater bubble loungers, hydromassage neck jets, and views that stretch across Derwentwater to Catbells and the northwestern fells.

Inside, the thermal suite offers twelve distinct heat experiences. A glass-fronted Finnish sauna looks out over the grounds, while a Roman laconium, salt steam room, aroma steam room, and herbal sauna provide gentler warmth. An ice fountain and cold drench bucket offer contrast therapy, and heated loungers line the relaxation areas.

The four-person Rasul chamber brings Moroccan bathing traditions to Cumbria, complete with mineral-rich muds and atmospheric lighting. Five treatment rooms deliver therapies from Elemis and ishga, with a Champagne bar for refreshments between sessions.

Suite guests enjoy two hours of complimentary spa access per night of their stay, while those in standard rooms can book two-hour sessions from £35 per person on weekdays or £40 at weekends.

Day spa packages are also available for non-residents, making this an accessible retreat even without an overnight stay. For those seeking a spa escape surrounded by some of England's most celebrated mountain scenery, Borrowdale delivers a dramatic backdrop that few locations can match.`,
    spaSectionTitle: 'Valley Spa',
    faqSubtitle: 'Frequently asked questions about spas in Borrowdale.',
    relatedLocations: [
      {
        name: 'Bassenthwaite',
        slug: 'bassenthwaite',
        distance: '8 miles northwest',
        image: '/images/locations/bassenthwaite-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Ullswater',
        slug: 'ullswater',
        distance: '12 miles east',
        image: '/images/locations/ullswater-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Grasmere',
        slug: 'grasmere',
        distance: '7 miles south',
        image: '/images/locations/grasmere-lake-district-spa-breaks.jpg',
      },
    ],
  },
  {
    name: 'Great Langdale',
    slug: 'great-langdale',
    image: '/images/locations/great-langdale-lake-district-spa-breaks.jpg',
    tagline: 'Wild fell country at the heart of the Lake District',
    metaTitle: 'Spas in Great Langdale | Lake District Spas',
    metaDescription:
      "Brimstone Spa in Great Langdale, the Lake District's premier walking valley. Seven thermal experiences beneath the Langdale Pikes, exclusive to estate guests.",
    heroBadge: 'Great Langdale Spas',
    heroDescription:
      "The Lake District's premier walking valley, where the Langdale Pikes dominate the skyline and one exceptional spa rewards tired legs after days on the fells.",
    heroImageAlt:
      'Stunning view down Great Langdale valley with steep craggy fells rising either side, patchwork green fields divided by dry stone walls and scattered farmsteads stretching toward the Langdale Pikes under dramatic clouds',
    introContent: `Great Langdale is where the Lake District gets serious. The valley runs west from Ambleside beneath some of the most dramatic mountain scenery in England, the Langdale Pikes rise in a sudden vertical surge from the valley floor, their rocky summits instantly recognisable from as far away as Windermere's eastern shore. Walkers have been coming here for generations, drawn by terrain that Alfred Wainwright described as stirring both imagination and emotion.

Brimstone Spa occupies the 35-acre Langdale Estate, a former Victorian gunpowder works where millstones, a waterwheel and old cannon hint at industrial history now absorbed into woodland and waterways. The spa takes its design cues from the surrounding landscape, burnished metallic tiles against reclaimed brick, long windows framing fell views from the outdoor Finnish sauna. Seven thermal experiences follow a guided sequence, lava sauna and herbal sauna, mineral steam bath and Himalayan salt room, ice fountain and experience showers, with a 9-metre indoor and outdoor pool as the centrepiece. The outdoor terrace has a log fire for warming up between sessions while watching the weather move across the Pikes.

Crucially for walkers, the estate includes a fully stocked bootroom where guests can borrow quality walking gear, boots, waterproofs, everything needed for a day on the fells. The arrangement works both ways, spend the morning climbing Harrison Stickle, then the afternoon recovering in the thermal suite. Brimstone Spa is exclusive to guests of the Langdale Estate, staying at the Langdale Hotel, Brimstone Hotel or self-catering lodges, so there is no day spa option here. The tradeoff is a quieter, more considered experience that matches the valley's character, remote, dramatic, and earned rather than easily accessed.`,
    spaSectionTitle: 'Valley Spa',
    faqSubtitle: 'Frequently asked questions about spas in Great Langdale.',
    relatedLocations: [
      {
        name: 'Ambleside',
        slug: 'ambleside',
        distance: '5 miles east',
        image: '/images/locations/ambleside-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Grasmere',
        slug: 'grasmere',
        distance: '7 miles northeast',
        image: '/images/locations/grasmere-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Windermere',
        slug: 'windermere',
        distance: '10 miles southeast',
        image: '/images/locations/windermere-lake-district-spa-breaks.jpg',
      },
    ],
  },
  {
    name: 'Ullswater',
    slug: 'ullswater',
    image: '/images/locations/ullswater-lake-district-spa-breaks.jpg',
    tagline: "England's most beautiful lake and outstanding spa destinations",
    metaTitle: 'Spas in Ullswater | Lake District Spas',
    metaDescription:
      "Discover Another Place, The Lake on England's second largest lake. Wild swimming, paddleboarding and a 20-metre pool with fell views on the shores of Ullswater.",
    heroBadge: 'Ullswater Spas',
    heroDescription:
      "England's most beautiful lake, where Wordsworth found his daffodils and a contemporary lakeside hotel invites you to swim in the water rather than just look at it.",
    heroImageAlt:
      'Ullswater stretching into the distance between steep green fells with a wooded headland jutting into the calm blue water, fell reflections mirrored on the still lake surface on a clear summer evening in the Lake District',
    introContent: `Ullswater winds for nine miles through the northern Lake District, its elongated Z-shape carved by three glaciers that retreated ten thousand years ago. Many consider it England's most beautiful lake, Wordsworth certainly thought so, describing it as "the happiest combination of beauty and grandeur which any of the Lakes affords". It was here at Glencoyne Bay in April 1802 that he and his sister Dorothy encountered the daffodils that would inspire the most famous poem in the English language. Those same daffodils still bloom each spring along the shoreline.

Another Place, The Lake occupies 18 acres of parkland at Watermillock on the western shore, its grounds running down to a private jetty. The hotel opened in 2017 in a restored Georgian building with a contemporary wing added, and its ethos centres on getting outdoors rather than simply admiring the view from inside. The spa, called Swim Club, reflects this philosophy, a 20-metre indoor pool with floor-to-ceiling glass walls that blur the boundary between inside and lake. An outdoor Swedish-style hot tub looking towards Arthur's Pike, and a sauna with glass doors framing fell views. Ultraviolet filtration keeps the pool low on chlorine. Two treatment rooms and a treatment snug offer therapies.

Hotel guests have complimentary access to Swim Club throughout their stay. Day visitors can book memberships that include pool, hot tub and sauna. Three restaurants provide fuel, Rampsbeck for contemporary dining with lake views, The Living Space for all-day casual eating, and The Glasshouse for wood-fired pizza in a Victorian-style lakeside building. Families benefit from an Ofsted-registered Kids' Zone included free for guests.`,
    spaSectionTitle: 'Lakeside Spa',
    faqSubtitle: 'Frequently asked questions about spas in Ullswater.',
    relatedLocations: [
      {
        name: 'Penrith',
        slug: 'penrith',
        distance: '5 miles northeast',
        image: '/images/locations/penrith-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Borrowdale',
        slug: 'borrowdale',
        distance: '20 miles west',
        image:
          '/images/locations/borrowdale-valley-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Appleby-in-Westmorland',
        slug: 'appleby-in-westmorland',
        distance: '18 miles southeast',
        image:
          '/images/locations/appleby-in-westmorland-lake-district-spa-breaks.jpg',
      },
    ],
  },
  {
    name: 'Bassenthwaite',
    slug: 'bassenthwaite',
    image: '/images/locations/bassenthwaite-lake-district-spa-breaks.jpg',
    tagline: 'Remote lakeside tranquillity in the northern Lakes',
    metaTitle: 'Spas in Bassenthwaite | Lake District Spas',
    metaDescription:
      'Armathwaite Hall Spa on Bassenthwaite Lake. Outdoor infinity pools, Amethyst Crystal Cave steam room, and 400 acres of deer park in the northern Lake District.',
    heroBadge: 'Bassenthwaite Spa',
    heroDescription:
      "Country estate grandeur on England's only true lake. A 400-acre deer park, outdoor infinity pools, and an Amethyst Crystal Cave steam room await.",
    heroImageAlt:
      'Dramatic fell reflected in the mirror-still waters of Bassenthwaite Lake on a clear summer day, with native woodland along the shoreline in the northern Lake District near Keswick',
    introContent: `Bassenthwaite Lake holds a quiet distinction: it is the only body of water in the Lake District officially named a lake, the others being meres, waters and tarns. This northern reach of the national park trades the busier shores of Windermere for something more secluded, ancient woodland, osprey nesting sites, and the kind of stillness that draws those seeking genuine escape.

The lake sits in the shadow of Skiddaw, England's fourth highest peak, with the market town of Keswick a short drive south. Walkers know this area for the Coledale Horseshoe and the quieter fells of the northern Lakes. Couples know it for one of the region's most impressive spa estates.

The turreted Victorian mansion has been welcoming guests since the 1800s, but the spa brings contemporary luxury to this historic setting. Multiple outdoor infinity pools gaze across manicured parkland to the fells beyond, their edges seeming to merge with the landscape. An outdoor hot tub offers the same views with the added pleasure of thermal warmth.

Inside, a 16-metre indoor infinity pool anchors the wellness facilities, while the thermal suite delivers genuine distinctiveness. The Amethyst Crystal Cave steam room takes its name seriously, this is not merely a marketing flourish but an immersive crystal-lined chamber designed for deep heat experiences. A traditional Finnish sauna provides the classic counterpoint.

The treatment menu spans 34 experiences, with thoughtful touches that acknowledge the setting. The Herbal Sleep Cocoon wrap is designed specifically to promote restful sleep after fell walking, the kind of detail that suggests a spa genuinely integrated with its landscape rather than simply positioned within it.

Spa access comes complimentary for hotel guests, while day visitors can choose from packages starting at £70 for a morning Sunrise Spa through to full-day experiences with treatments and lunch. For couples seeking the combination of country house grandeur and contemporary wellness, Bassenthwaite offers something the busier central Lakes cannot match: space, silence, and the rare pleasure of deer grazing outside your window.`,
    spaSectionTitle: 'Country Estate Spa',
    faqSubtitle: 'Frequently asked questions about spas in Bassenthwaite.',
    relatedLocations: [
      {
        name: 'Ullswater',
        slug: 'ullswater',
        distance: '20 miles east',
        image: '/images/locations/ullswater-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Borrowdale',
        slug: 'borrowdale',
        distance: '10 miles south',
        image:
          '/images/locations/borrowdale-valley-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Penrith',
        slug: 'penrith',
        distance: '18 miles east',
        image: '/images/locations/penrith-lake-district-spa-breaks.jpg',
      },
    ],
  },
  {
    name: 'Penrith',
    slug: 'penrith',
    image: '/images/locations/penrith-lake-district-spa-breaks.jpg',
    tagline: 'The gateway to the Lake District, close to Ullswater',
    metaTitle: 'Spas in Penrith | Lake District Spas',
    metaDescription:
      'North Lakes Hotel & Spa in Penrith, gateway to Ullswater and the northern Lake District. Pool, thermal facilities and Caudalie treatments just off the M6.',
    heroBadge: 'Penrith Spas',
    heroDescription:
      'The historic market town on the edge of the Lake District, where a four star spa hotel offers easy access to Ullswater and the northern fells from the doorstep of the M6.',
    heroImageAlt:
      'Wide panoramic view from the hilltop above Penrith looking west across the Eden Valley toward the northern Lake District fells and a distant lake, with green farmland and the town visible below on a summer day',
    introContent: `Penrith occupies an unusual position, a substantial market town sitting just outside the Lake District National Park boundary, yet serving as the gateway to Ullswater and the northern fells. The town's history runs deeper than most visitors realise. In the 9th and 10th centuries this was the capital of Cumbria, a semi independent state that formed part of the Kingdom of Strathclyde. The ruins of Penrith Castle, begun in 1399 and later a royal fortress for Richard Duke of Gloucester, stand opposite the railway station.

The North Lakes Hotel & Spa sits just off the M6, a position that makes it one of the most accessible spa hotels in the Lake District. Built in 1985 in traditional hunting lodge style, the hotel uses local stone, natural wood and open log fires to create something that feels considerably older than its years. The spa occupies a space with exposed wooden beams and a relaxed country house atmosphere. Facilities centre on a 13 metre swimming pool, hot tub, sauna and steam room, with six treatment rooms offering therapies using Caudalie products. Day visitors receive three hours of facility access, while hotel guests booking direct get complimentary use of the spa, gym and pool throughout their stay.

The location works well for those wanting to combine spa time with exploration. Ullswater lies just ten minutes away by car, with the Ullswater Steamers running between Pooley Bridge, Howtown and Glenridding. For walkers, Helvellyn rises to 950 metres at the southern end of the lake, England's third highest peak and home to the famous Striding Edge scramble.`,
    spaSectionTitle: 'Gateway Spa',
    faqSubtitle: 'Frequently asked questions about spas in Penrith.',
    relatedLocations: [
      {
        name: 'Ullswater',
        slug: 'ullswater',
        distance: '6 miles west',
        image: '/images/locations/ullswater-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Borrowdale',
        slug: 'borrowdale',
        distance: '17 miles west',
        image:
          '/images/locations/borrowdale-valley-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Appleby-in-Westmorland',
        slug: 'appleby-in-westmorland',
        distance: '13 miles southeast',
        image:
          '/images/locations/appleby-in-westmorland-lake-district-spa-breaks.jpg',
      },
    ],
  },
  {
    name: 'Newby Bridge',
    slug: 'newby-bridge',
    image: '/images/locations/newby-bridge-lake-district-spa-breaks.jpg',
    tagline: 'Where the southern Lakes meet open countryside',
    metaTitle: 'Spas in Newby Bridge | Lake District Spas',
    metaDescription:
      'Spas in Newby Bridge at the southern tip of Lake Windermere. Outdoor thermal bathing, indoor pools and Elemis treatments where lake meets the River Leven.',
    heroBadge: 'Newby Bridge Spas',
    heroDescription:
      'Where Lake Windermere meets the River Leven, two spa hotels offer a quieter gateway to the southern Lakes with steam trains, lake cruises and fell walks on the doorstep.',
    heroImageAlt:
      'Water cascading over a broad weir on the River Leven at Newby Bridge with a traditional stone arch bridge beyond, surrounded by lush green woodland and gentle fells at the southern tip of Lake Windermere',
    introContent: `Newby Bridge sits at the point where England's largest lake empties into the River Leven, a small hamlet that takes its name from the five arched stone bridge built here in 1651. This is the quieter end of Windermere, away from the crowds of Bowness and Ambleside, yet perfectly positioned as a gateway to the southern Lake District. Steam trains on the Lakeside and Haverthwaite Railway pull into the station on their way to the lakeside pier, where cruises depart northward up the full length of Windermere.

Two spa hotels anchor the hamlet, each making the most of its waterside setting. The Swan Hotel sits on the banks of the River Leven, its grounds running right down to the water. It opened in 2022 and earned a five bubble rating from the Good Spa Guide within two years. The emphasis here is on outdoor thermal bathing, with a hydrotherapy pool and an outdoor Finnish sauna looking across the grounds. There's also an ice bucket for contrast therapy, and The Bothy, a retreat with log burner and salt lamps. Inside, the health club adds a indoor pool, sauna, steam room and jacuzzi. Day visitors can book thermal sessions from around £40 for two hours.

A short distance up the shore, the Lakeside Hotel occupies a prime position directly on Windermere's southern edge, where the water stretches north towards the central fells. The building began life as a 17th century coaching inn and still shows its history in oak panelling, beams and open fires. The spa takes a more traditional approach, with a 17 metre heated indoor pool framed by panoramic windows, a steam room, sauna and poolside jacuzzi, plus three treatment rooms offering Elemis therapies. An outdoor spa garden provides somewhere to sit when the weather cooperates, and pool and thermal facilities are included in the room rate for guests.

The location suits walkers seeking a quieter base. Gummer's How rises directly behind the hamlet, offering one of the finest viewpoints over the length of Windermere for relatively little effort. The combination of accessible spa facilities, lake cruises, heritage railways and easy road access from the M6 makes Newby Bridge particularly appealing for both short breaks and family visits.`,
    spaSectionTitle: 'Riverside and Lakeside Spas',
    faqSubtitle: 'Frequently asked questions about spas in Newby Bridge.',
    relatedLocations: [
      {
        name: 'Windermere',
        slug: 'windermere',
        distance: '8 miles north',
        image: '/images/locations/windermere-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Grange-over-Sands',
        slug: 'grange-over-sands',
        distance: '6 miles south',
        image:
          '/images/locations/grange-over-sands-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Backbarrow',
        slug: 'backbarrow',
        distance: '1 mile west',
        image: '/images/locations/backbarrow-lake-district-spa-breaks.jpg',
      },
    ],
  },
  {
    name: 'Backbarrow',
    slug: 'backbarrow',
    image: '/images/locations/backbarrow-lake-district-spa-breaks.jpg',
    tagline: 'A quiet corner of the Furness Fells, near Windermere',
    metaTitle: 'Spas in Backbarrow | Lake District Spas',
    metaDescription:
      "Discover riverside spa relaxation at Whitewater Hotel in Backbarrow. The Lake District's only Rasul Mud Temple and an outdoor jacuzzi overlooking River Leven.",
    heroBadge: 'Backbarrow Spa',
    heroDescription:
      'Riverside wellness where the River Leven flows from Windermere to the sea. An intimate spa retreat featuring a Rasul Mud Temple and outdoor jacuzzi overlooking the water.',
    heroImageAlt:
      'The River Leven flowing over rocky shallows beneath a footbridge at Backbarrow, with dense green woodland rising steeply on both banks in the Leven Valley south of Lake Windermere in the Lake District',
    introContent: `Backbarrow sits where the River Leven begins its journey from Lake Windermere to Morecambe Bay, a quiet hamlet that most visitors pass without stopping. Once an industrial village, its 17th-century blast furnace produced iron for centuries. Today it offers something rarer: riverside tranquility just a mile from England's largest lake, yet entirely removed from the tourist bustle.

The setting shapes the spa experience here. The Whitewater Hotel occupies a peaceful stretch of the Leven's banks within Lakeland Village, its outdoor jacuzzi overlooking water that still runs clear and fast toward the coast. Inside, the Cascades pool creates an unexpected sense of space, with stepping stones crossing the water beneath vaulted ceilings.

What makes this spa genuinely distinctive is the Rasul Mud Temple. This Arabian-inspired thermal experience involves applying mineral-rich muds in a private steam chamber, a deeply cleansing ritual that feels worlds away from standard spa treatments. The Turkish Hamam aromatherapy steam room continues the theme, offering something more exotic than the typical sauna-and-steam circuit.

Day spa packages welcome visitors alongside hotel guests, with Elemis treatments completing the wellness offering. The quieter southern Lakes location means you're unlikely to encounter crowds even at peak times.

Backbarrow works particularly well as part of a southern Lakes itinerary. Newby Bridge lies a mile north with its historic bridge and lake steamers. The market town of Ulverston, birthplace of Stan Laurel, sits a few miles south, while Cartmel and its famous priory are within easy reach. It's a quieter corner of the Lake District that rewards those who venture beyond the honeypot villages.`,
    spaSectionTitle: 'Riverside Spa',
    faqSubtitle: 'Frequently asked questions about spas in Backbarrow.',
    relatedLocations: [
      {
        name: 'Newby Bridge',
        slug: 'newby-bridge',
        distance: '1 mile north',
        image: '/images/locations/newby-bridge-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Windermere',
        slug: 'windermere',
        distance: '6 miles north',
        image: '/images/locations/windermere-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Grange-over-Sands',
        slug: 'grange-over-sands',
        distance: '8 miles south',
        image:
          '/images/locations/grange-over-sands-lake-district-spa-breaks.jpg',
      },
    ],
  },
  {
    name: 'Grange-over-Sands',
    slug: 'grange-over-sands',
    image: '/images/locations/grange-over-sands-lake-district-spa-breaks.jpg',
    tagline: 'An elegant Edwardian resort town on Morecambe Bay',
    metaTitle: 'Spas in Grange-over-Sands | Lake District Spas',
    metaDescription:
      'Spas in Grange-over-Sands, an Edwardian town on Morecambe Bay. Two Victorian spa hotels with pools, thermal suites and treatments with bay views.',
    heroBadge: 'Grange-over-Sands Spas',
    heroDescription:
      'An Edwardian coastal town on the edge of Morecambe Bay, where two Victorian spa hotels offer relaxation with sweeping views across the sands to the Lakeland fells.',
    heroImageAlt:
      'Sweeping view across the sandy channels and tidal flats of Morecambe Bay at low tide from Grange-over-Sands, with gentle green hills and rocky headlands visible across the estuary on a calm evening',
    introContent: `Grange-over-Sands occupies a unique position on the Cartmel Peninsula, where the Lake District meets Morecambe Bay. This elegant Edwardian town grew up around its railway station, which brought Victorian visitors seeking the mild climate and sea air. The famous promenade still curves along the edge of the salt marshes, backed by ornamental gardens planted with palms and semi-tropical shrubs, a legacy of those gentler winters that made this corner of Cumbria a favoured retreat.

The bay dominates everything here. At low tide, the sands stretch for miles towards Lancaster, and the light shifts constantly across the mudflats where curlews, oystercatchers and pink-footed geese feed. The walk along the promenade to the historic Lido site reveals views north to the Lakeland fells, while the climb to Hampsfell Hospice, a stone shelter built in 1846, offers panoramas from the Old Man of Coniston to Blackpool Tower on clear days. The medieval village of Cartmel lies just two miles inland, its 12th-century priory still standing watch over a cluster of pubs, artisan shops and the famous racecourse.

Two Victorian hotels anchor the spa scene in Grange-over-Sands, each taking full advantage of those bay views. The Grange Hotel, built in 1866, offers a leisure suite with indoor swimming pool, hot tub, sauna and steam room, facilities included for all hotel guests. Their treatment rooms use Tropic Skincare products, and day visitors can book spa packages that combine pool access with treatments and lunch. The hotel's Carriages Restaurant serves British cuisine crafted from local produce, with Morecambe Bay shrimps and Holker saltmarsh lamb featuring prominently.

Netherwood Hotel & Spa takes a different approach, housing its adults-only thermal suite in a Grade II listed Victorian mansion set within 15 acres of woodland and gardens. The thermal journey includes wooden hot tubs, a cold plunge pool, aroma steam room, salt inhalation room, ice fountain and monsoon shower. Three treatment rooms offer Germaine de Capuccini therapies, and the floor-to-ceiling windows in the dining room frame those sweeping bay views. Spa access is bookable separately from accommodation, with thermal sessions starting at £20 per person for 90 minutes.

Both hotels sit within easy reach of the railway station, making Grange-over-Sands one of the most accessible spa destinations in the region for car-free visitors. The Furness Line connects to Lancaster and the West Coast Main Line, placing London just three hours away, yet the pace here feels entirely removed from city life.`,
    spaSectionTitle: 'Coastal Spas',
    faqSubtitle: 'Frequently asked questions about spas in Grange-over-Sands.',
    relatedLocations: [
      {
        name: 'Newby Bridge',
        slug: 'newby-bridge',
        distance: '8 miles north',
        image: '/images/locations/newby-bridge-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Backbarrow',
        slug: 'backbarrow',
        distance: '6 miles north',
        image: '/images/locations/backbarrow-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Windermere',
        slug: 'windermere',
        distance: '10 miles north',
        image: '/images/locations/windermere-lake-district-spa-breaks.jpg',
      },
    ],
  },
  {
    name: 'Appleby-in-Westmorland',
    slug: 'appleby-in-westmorland',
    image:
      '/images/locations/appleby-in-westmorland-lake-district-spa-breaks.jpg',
    tagline: 'A historic market town on the edge of the Lakes',
    metaTitle: 'Spas in Appleby-in-Westmorland - Lake District Spas',
    metaDescription:
      'Discover the Garden Spa at Appleby Manor in the Eden Valley. Outdoor hot tubs, fire pit, and country house tranquility on the edge of the Lake District.',
    heroBadge: 'Appleby Spa',
    heroDescription:
      'Eden Valley tranquility on the edge of the Lake District. A country house spa escape where outdoor hot tubs meet fire pits and historic England awaits.',
    heroImageAlt:
      'Historic sandstone bridge spanning the River Eden at Appleby-in-Westmorland on a summer evening, with mature trees lining the riverbanks and traditional stone buildings of the market town visible beyond in the Eden Valley',
    introContent: `Appleby-in-Westmorland offers something the central Lake District cannot: space, quiet, and the unhurried pace of a historic market town that most visitors drive straight past. Sitting in the Eden Valley on the national park's eastern edge, this former county town of Westmorland trades fell-top drama for gentle riverside walks and centuries of history written in red sandstone.

The town itself deserves exploration. Appleby Castle dominates the skyline, its Norman keep watching over a broad main street that climbs from the River Eden to the church of St Lawrence. The annual Horse Fair, held each June, draws Travellers from across Britain in a tradition stretching back to 1685. For the rest of the year, Appleby belongs to those who appreciate England's quieter corners.

The Garden Spa at Appleby Manor brings contemporary wellness to this pastoral setting. A 19th-century country house hotel with views toward the castle, it centres on an indoor vitality pool with underwater massage loungers and targeted hydrotherapy jets. But the signature experience lies outside: a sheltered spa garden where hot tubs steam beneath open skies and flames flicker in the fire pit year-round.

The thermal journey includes traditional sauna, aromatherapy steam room, and a salt inhalation room for respiratory wellness, a thoughtful addition that speaks to the spa's focus on genuine therapeutic benefit. For special occasions, a private hot tub can be hired with panoramic countryside views stretching across the Eden Valley.

Unlike the busier Lake District destinations, Appleby rewards those willing to venture beyond the obvious. Day spa packages welcome visitors from £45, making this an accessible escape for couples seeking relaxation without the crowds. Combine it with a walk along the river to the Millennium Bridge, lunch in one of the town's coaching inns, and you have a day that feels genuinely restorative rather than simply scenic.`,
    spaSectionTitle: 'Eden Valley Spa',
    faqSubtitle:
      'Frequently asked questions about spas in Appleby-in-Westmorland.',
    relatedLocations: [
      {
        name: 'Penrith',
        slug: 'penrith',
        distance: '12 miles north',
        image: '/images/locations/penrith-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Ullswater',
        slug: 'ullswater',
        distance: '15 miles northwest',
        image: '/images/locations/ullswater-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Bassenthwaite',
        slug: 'bassenthwaite',
        distance: '30 miles northwest',
        image: '/images/locations/bassenthwaite-lake-district-spa-breaks.jpg',
      },
    ],
  },
  {
    name: 'Keswick',
    slug: 'keswick',
    // NOTE: no dedicated Keswick asset exists yet under public/images/locations/ —
    // this reuses the same missing filename the (pre-existing, already-live)
    // spas-in-keswick page referenced. Pre-existing gap, not introduced here.
    image: '/images/locations/keswick-lake-district-spa-breaks.jpg',
    tagline: 'Gateway to Skiddaw and Derwentwater in the northern Lakes',
    metaTitle: 'Spas in Keswick | Lake District Spas',
    metaDescription:
      'Discover spas near Keswick in the Lake District. Underscar offers a 13-metre heated pool, hydrotherapy jacuzzi, sauna, and steam room on the slopes of Skiddaw above Derwentwater.',
    heroBadge: 'Keswick Spa',
    heroDescription:
      'The northern hub of the Lake District, gateway to Skiddaw and Derwentwater, with a luxury cottage spa retreat on the sheltered slopes above the town.',
    heroImageAlt:
      'View across Derwentwater from the slopes of Skiddaw above Keswick, showing the lake and surrounding fells in autumn colours with the town visible on the shoreline in the northern Lake District',
    introContent: `Keswick sits at the northern end of Derwentwater, where the lake's wooded shoreline gives way to an expansive market town that has served as the gateway to the northern fells for over two centuries. Surrounded by some of the Lake District's most recognisable summits — Skiddaw to the north, Blencathra to the east, Catbells and the Derwent Fells to the west — Keswick draws walkers, climbers, and those simply in search of dramatic Cumbrian scenery in equal measure.

The town itself is well equipped with independent shops, restaurants, and the famous Pencil Museum, but it is the landscape that defines the experience. The Borrowdale valley stretches south towards Honister Pass, and the ridge walk from Catbells across to Maiden Moor is among the most popular routes in the national park. The northern circuit of Derwentwater is a gentler option, tracing the wooded shores past landing stages where rowing boats and motor launches make use of the same water that has been drawing visitors since the Picturesque painters arrived in the 18th century.

The Spa at Underscar sits above Keswick on the sheltered slopes of Skiddaw, set within a five-star self-catering cottage estate converted from a 19th-century coach house and walled garden. The spa's 13-metre indoor heated pool looks across towards Derwentwater, and the hydrotherapy jacuzzi, eucalyptus sauna, and steam room provide a complete thermal experience for guests staying in the 25 cottages on the estate.

Spa access is included with all cottage bookings, giving guests an unhurried base from which to explore the northern fells before returning to the water and warmth. Germaine de Capuccini and NEOM Organics treatments are available to book in the softly lit treatment rooms, and day visitors can access the spa through bookable day packages ranging from an evening Twilight session to a full eight-hour spa day with treatments and High Tea.

For those wanting further spa options in the wider area, the Borrowdale valley lies five miles to the south, where The Falls Spa at Lodore Falls Hotel offers a 16-metre outdoor infinity pool with thermal suite. Armathwaite Hall Hotel and Spa in Bassenthwaite, five miles to the northwest, provides another full spa destination within easy reach of Keswick.`,
    spaSectionTitle: 'Keswick Spa',
    faqSubtitle: 'Frequently asked questions about spas near Keswick.',
    relatedLocations: [
      {
        name: 'Borrowdale',
        slug: 'borrowdale',
        distance: '5 miles south',
        image:
          '/images/locations/borrowdale-valley-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Bassenthwaite',
        slug: 'bassenthwaite',
        distance: '5 miles northwest',
        image: '/images/locations/bassenthwaite-lake-district-spa-breaks.jpg',
      },
      {
        name: 'Ullswater',
        slug: 'ullswater',
        distance: '15 miles east',
        image: '/images/locations/ullswater-lake-district-spa-breaks.jpg',
      },
    ],
  },
];

export function getLocationPageConfig(
  name: string
): LocationPageConfig | undefined {
  return locationPageConfigs.find((c) => c.name === name);
}

export function getLocationPageConfigBySlug(
  slug: string
): LocationPageConfig | undefined {
  // slug here is the short slug (e.g. 'keswick'), not the full 'spas-in-keswick' path segment.
  return locationPageConfigs.find((c) => c.slug === slug);
}
