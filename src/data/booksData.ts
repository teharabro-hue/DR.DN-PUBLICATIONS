export type BookGenre = 'Romantic Love Story' | 'Literary Essays' | 'Short Stories';
export type CurrencyCode = 'LKR' | 'USD';
export type EditionFormat = 'Hardcover' | 'Paperback' | 'eBook';

export interface BookEdition {
  id: string;
  format: EditionFormat;
  label: string;
  priceLKR: number;
  priceUSD: number;
  availability: string;
  bindingDetail: string;
}

export interface Chapter {
  number: string;
  title: string;
  readTime: string;
  paragraphs: string[];
}

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  genre: BookGenre;
  year: string;
  isbn: string;
  edition: string;
  pages: number;
  totalReadTime: string;
  coverImage?: string;
  clothTone: string;
  clothAccent: string;
  synopsis: string;
  pullQuote: string;
  featured?: boolean;
  editions: BookEdition[];
  chapters: Chapter[];
}

export function formatPrice(amountLKR: number, amountUSD: number, currency: CurrencyCode): string {
  if (currency === 'USD') {
    return `$${amountUSD.toFixed(2)}`;
  }
  return `LKR ${amountLKR.toLocaleString('en-US')}`;
}

export const BOOKS_CATALOG: Book[] = [
  {
    id: 'waruni-sanhitthaka-malawa',
    title: 'WARUNI SANHITHAKA MALAWA',
    subtitle: 'An unhurried walk beside the water, where unspoken letters find their voice.',
    author: 'Dr. DN Wickramasinghe',
    genre: 'Romantic Love Story',
    year: '2026',
    isbn: '978-955-8412-01-4',
    edition: 'First Illustrated Edition',
    pages: 184,
    totalReadTime: '42 min read',
    coverImage: '/assets/aistudio/Waruni__A_Romantic_Parkside_Stroll_390b363e.png',
    clothTone: '#881337',
    clothAccent: '#FDE68A',
    synopsis:
      'Set beneath the flowering canopies of a quiet lakeside park, WARUNI SANHITHAKA MALAWA follows two souls who meet in the gentle hour before dusk. Carrying nothing more than a small bouquet of wild blossoms and years of unspoken patience, Waruni and Sanhithaka discover how the simplest walk along a cobbled path can reshape an entire life.',
    pullQuote:
      'Some conversations do not begin with courage; they begin with two people matching their footsteps to the same unhurried pace.',
    featured: true,
    editions: [
      {
        id: 'waruni-hc',
        format: 'Hardcover',
        label: 'Signed Illustrated Hardcover',
        priceLKR: 4200,
        priceUSD: 22.0,
        availability: 'In Stock · Dispatches in 24h',
        bindingDetail: 'Cloth-bound linen spine with bookmark ribbon & archival cream paper',
      },
      {
        id: 'waruni-pb',
        format: 'Paperback',
        label: 'Trade Paperback Edition',
        priceLKR: 2650,
        priceUSD: 14.0,
        availability: 'In Stock · Dispatches in 24h',
        bindingDetail: 'Matte illustrated cover on 100gsm uncoated book paper',
      },
      {
        id: 'waruni-eb',
        format: 'eBook',
        label: 'Digital Edition (EPUB & PDF)',
        priceLKR: 1200,
        priceUSD: 6.5,
        availability: 'Instant Digital Delivery',
        bindingDetail: 'DRM-free EPUB & print-quality PDF sent immediately after order',
      },
    ],
    chapters: [
      {
        number: '01',
        title: 'The Lamp Beside the Cobblestone Path',
        readTime: '7 min',
        paragraphs: [
          'The afternoon light had begun to soften into amber by the time the iron park lamps flickered awake along the water’s edge. Pink bougainvillea spilled over the wrought-iron railing, scattering fresh petals across the warm stone walkway where a single timber bench waited beneath the tamarind boughs.',
          'Waruni arrived first, holding a small bundle of white baby’s breath wrapped simply in brown twine. A white ribbon rested neatly against her dark curls, catching the breeze rolling off the lake. She did not check her watch; after three seasons of exchanging short handwritten notes between library books, waiting a few quiet minutes felt natural.',
          'When Sanhithaka stepped onto the path, his dark hoodie contrasted sharply against the golden foliage behind him. He walked with his hands tucked loosely into his pockets, his expression earnest and slightly guarded until his eyes met hers beside the lamp post.',
          '“You brought the flowers from the corner stall,” he said, matching her stride as they began walking south toward the bend in the lake.',
          '“Only because you once wrote that white blossoms look brighter at dusk than in midday sun,” Waruni replied softly, smiling down at the petals along the cobblestones. For the next hundred paces neither of them hurried, letting the hum of distant city traffic fade behind the rustle of leaves.',
        ],
      },
      {
        number: '02',
        title: 'Notes Left Between Pages',
        readTime: '6 min',
        paragraphs: [
          'Their acquaintance had never belonged to crowded lecture halls or loud cafés. It had grown quietly inside the municipal reading room on Reid Avenue, where both happened to borrow the same weathered volumes of poetry and regional history on alternating Tuesdays.',
          'First it had been an underlined stanza in pencil. Two weeks later, a folded slip of cream stationery tucked inside chapter four, asking whether the previous reader preferred rain-washed evenings or clear October mornings. Neither had signed a name until late November.',
          '“I kept the third note in my jacket pocket for four months,” Sanhithaka admitted as they passed the empty wooden bench overlooking the water. “Every time I thought about speaking to you across the reading table, the silence in that room felt too fragile to break.”',
          'Waruni glanced sideways at him, noticing how carefully he measured his steps so he never walked half a pace ahead of her. “And yet here we are,” she answered, “with an entire park path ahead of us and no librarian asking for quiet.”',
        ],
      },
      {
        number: '03',
        title: 'Golden Reflections on the Water',
        readTime: '8 min',
        paragraphs: [
          'Halfway around the lake, the treeline opened onto a wide expanse of still water reflecting the late-afternoon sky. Swallows skimmed low over the surface, leaving faint silver ripples that dissolved before reaching the stone embankment.',
          'They paused near a cluster of pink hibiscus bushes. Waruni shifted the small bouquet to her left hand, and for the first time her fingers brushed lightly against Sanhithaka’s sleeve. He looked down, surprised by how steady the moment felt, as though the long months of uncertainty had been leading simply to this pause.',
          '“What did you think I would be like,” he asked, “when you only knew my handwriting?”',
          '“Honest,” she said without hesitation. “People rarely write carefully unless they mean what they put on paper. You never rushed a single line.”',
          'Sanhithaka smiled—a quiet, unguarded smile that softened the serious lines around his eyes. Ahead of them, the path curved beneath an arch of flowering branches where warm lamp light pooled onto the stones like spilled honey.',
        ],
      },
      {
        number: '04',
        title: 'A Promise Without Grandeur',
        readTime: '7 min',
        paragraphs: [
          'Neither spoke of grand gestures or distant futures. Instead, they talked about ordinary things that carried extraordinary weight: the sound of early morning rain on tin roofs, the patience required to finish a difficult book, and the comfort of knowing someone was listening without waiting merely for their turn to speak.',
          'As evening settled deeper into the park, the pink petals beneath their white sneakers seemed to glow faintly against the dark stone. A cool breeze lifted the edges of Waruni’s floral dress, and Sanhithaka instinctively stepped closer to shield her from the wind coming off the lake.',
          '“Will you walk this path with me again next Sunday?” he asked as the eastern gate came into view.',
          'Waruni turned toward him beneath the last golden lamp post, holding out a single sprig from her bouquet. “Next Sunday,” she promised, “and bring your notebook—I have three chapters left to ask you about.”',
        ],
      },
      {
        number: '05',
        title: 'Rain Before the Second Sunday',
        readTime: '7 min',
        paragraphs: [
          'The following week brought unseasonal monsoon showers that drummed steadily against classroom windows and library skylights alike. On Thursday afternoon, Waruni found a fresh folded envelope inside her copy of collected short stories—no longer anonymous, addressed clearly in Sanhithaka’s familiar ink.',
          'Inside was a small pressed blossom from the park path and a single sentence: Even if Sunday brings rain, I will wait beneath the shelter near the west gate with two umbrellas.',
          'By Saturday night the clouds broke apart, leaving the air crisp and washed clean of dust. When Sunday afternoon arrived, the lakeside garden smelled of damp earth, jasmine, and sunlit grass.',
          'She found him waiting exactly where he had written—not under the shelter, for the sky had cleared completely, but beside the same timber bench where their first walk had begun.',
        ],
      },
      {
        number: '06',
        title: 'Where the Path Continues',
        readTime: '7 min',
        paragraphs: [
          'Years later, friends who visited their home always noticed the framed pressed blossom resting beside a row of well-read novels on the oak shelf. Few knew it marked the bend in the park where two cautious strangers had finally traded written margins for spoken trust.',
          'Every autumn, when the lakeside bougainvillea blooms heaviest and the evening lamps cast warm circles across the stone walkway, Waruni and Sanhithaka still return for the same unhurried walk.',
          'They no longer carry library slips or folded stationery in their pockets. Yet their steps still fall into that exact quiet rhythm—side by side, unhurried, listening to the gentle cadence of a story that never truly needed an ending.',
        ],
      },
    ],
  },
  {
    id: 'monsoon-over-galle-face',
    title: 'Monsoon Over Galle Face',
    subtitle: 'Five coastal chapters on memory, sea breeze, and returning home.',
    author: 'Dr. DN Wickramasinghe',
    genre: 'Romantic Love Story',
    year: '2025',
    isbn: '978-955-8412-02-1',
    edition: 'Archival Paperback',
    pages: 148,
    totalReadTime: '22 min read',
    clothTone: '#1E3A8A',
    clothAccent: '#DBEAFE',
    synopsis:
      'When an architect returns to Colombo after seven years abroad to restore a heritage seafront veranda, she crosses paths with the violinist she left behind on the promenade.',
    pullQuote:
      'The sea remembers every footstep washed away along the promenade, waiting patiently for the tide to bring familiar voices back.',
    editions: [
      {
        id: 'monsoon-hc',
        format: 'Hardcover',
        label: 'Collector Hardcover',
        priceLKR: 3600,
        priceUSD: 19.0,
        availability: 'In Stock',
        bindingDetail: 'Deep navy buckram boards with stitched signatures',
      },
      {
        id: 'monsoon-pb',
        format: 'Paperback',
        label: 'Archival Paperback',
        priceLKR: 2200,
        priceUSD: 12.0,
        availability: 'In Stock',
        bindingDetail: 'Soft-touch navy cover with deckle-style interior margins',
      },
      {
        id: 'monsoon-eb',
        format: 'eBook',
        label: 'Digital Edition (EPUB & PDF)',
        priceLKR: 950,
        priceUSD: 5.0,
        availability: 'Instant Digital Delivery',
        bindingDetail: 'DRM-free digital download',
      },
    ],
    chapters: [
      {
        number: '01',
        title: 'Salt Air and Blue Shutters',
        readTime: '8 min',
        paragraphs: [
          'By five o’clock, salt mist drifted across the green lawn opposite the Indian Ocean, softening the terracotta roofs and old colonial colonnades into muted watercolour tones.',
          'Nethmi stood on the second-floor balcony with a rolled architectural blueprint tucked under one arm, watching the first dark monsoon clouds gather above the horizon. Down on the stone promenade, street vendors lit small brass lanterns against the rising wind.',
          'She had promised herself that this restoration commission would remain strictly professional—six weeks of structural sketches, timber preservation, and quiet evenings. Yet the sound of a solitary violin rising from the courtyard pavilion below dissolved seven years of careful distance in a single measure.',
        ],
      },
      {
        number: '02',
        title: 'The Unfinished Cadence',
        readTime: '7 min',
        paragraphs: [
          'When the rain finally broke across the seafront, warm and sudden, the pavilion offered the only dry shelter within reach. She stepped beneath the carved eaves just as Kavindu lowered his bow.',
          'Neither spoke while thunder rolled gently offshore. After a long pause, he tilted his head toward the open case beside his chair—where an old brass train ticket to Nanu Oya still sat tucked inside the velvet lining.',
          '“You kept the roof intact,” she murmured, looking up at the dark teak rafters overhead.',
          '“Some structures,” Kavindu replied quietly, “only need someone patient enough to return and finish what was started.”',
        ],
      },
      {
        number: '03',
        title: 'Lanterns After the Squall',
        readTime: '7 min',
        paragraphs: [
          'Once the downpour thinned to a silver drizzle, the horizon cleared into bands of pale rose and slate blue. Together they walked the wet flagstones along the water, listening to waves break softly against the granite wall.',
          'With every step, the seven silent years felt less like an obstacle and more like pages turned in preparation for the chapter now opening ahead of them.',
        ],
      },
    ],
  },
  {
    id: 'letters-from-kandy-road',
    title: 'Letters from the Kandy Road',
    subtitle: 'Quiet reflections on slow reading, tea-country mornings, and human kindness.',
    author: 'Dr. DN Wickramasinghe',
    genre: 'Literary Essays',
    year: '2024',
    isbn: '978-955-8412-03-8',
    edition: 'Collected Essays Vol. II',
    pages: 132,
    totalReadTime: '18 min read',
    clothTone: '#14532D',
    clothAccent: '#DCFCE7',
    synopsis:
      'A sequence of contemplative essays written along early-morning railway journeys through the central highlands, celebrating unhurried reading and careful observation.',
    pullQuote:
      'To read slowly in an impatient century is not an escape from life; it is the surest way to notice its finest details.',
    editions: [
      {
        id: 'kandy-hc',
        format: 'Hardcover',
        label: 'Forest Cloth Hardcover',
        priceLKR: 3400,
        priceUSD: 18.0,
        availability: 'In Stock',
        bindingDetail: 'Forest-green cloth cover with foil-stamped spine',
      },
      {
        id: 'kandy-pb',
        format: 'Paperback',
        label: 'Pocket Paperback',
        priceLKR: 1950,
        priceUSD: 10.5,
        availability: 'In Stock',
        bindingDetail: 'Compact travel trim designed for train and morning reading',
      },
      {
        id: 'kandy-eb',
        format: 'eBook',
        label: 'Digital Edition (EPUB & PDF)',
        priceLKR: 900,
        priceUSD: 4.5,
        availability: 'Instant Digital Delivery',
        bindingDetail: 'DRM-free digital download',
      },
    ],
    chapters: [
      {
        number: '01',
        title: 'On Reading Before Dawn',
        readTime: '6 min',
        paragraphs: [
          'There is a singular stillness between five and six in the morning when mist clings to the valley slopes and the kettle has just begun to sing. Before messages arrive and timetables demand attention, a printed page asks for nothing except presence.',
          'Across decades of busy clinical days and late-night study, I discovered that keeping a small slim volume beside the morning tea cup changes the texture of an entire day. A single paragraph read attentively lingers far longer than a hundred headlines skimmed in haste.',
        ],
      },
      {
        number: '02',
        title: 'The Bookshop Near the Clock Tower',
        readTime: '6 min',
        paragraphs: [
          'Every town worth visiting holds one narrow bookshop where wooden shelves reach nearly to the ceiling and the proprietor remembers which reader prefers biographies over coastal fiction.',
          'Inside such rooms, time behaves differently. Dust motes drift through slanted sunlight, and strangers converse softly in whispers—not out of obligation, but out of shared respect for the quiet worlds stacked beside them.',
        ],
      },
      {
        number: '03',
        title: 'Marginalia as Inheritance',
        readTime: '6 min',
        paragraphs: [
          'A clean book is an object of display; a lightly pencilled book is a conversation spanning generations. When we underline a sentence that steadied us in a difficult season, we leave a lantern lit for the next reader who opens that cover.',
        ],
      },
    ],
  },
  {
    id: 'the-quiet-lantern-keeper',
    title: 'The Quiet Lantern Keeper',
    subtitle: 'Short stories of friendship, resilience, and everyday grace.',
    author: 'Dr. DN Wickramasinghe',
    genre: 'Short Stories',
    year: '2023',
    isbn: '978-955-8412-04-5',
    edition: 'Hardcover Anthology',
    pages: 116,
    totalReadTime: '15 min read',
    clothTone: '#78350F',
    clothAccent: '#FEF3C7',
    synopsis:
      'Three interconnected short stories set in a small riverside town where a retired watchmaker and a young librarian restore a forgotten community reading room.',
    pullQuote:
      'Every neighbourhood needs one well-lit window after sunset where stories remain open to anyone who knocks.',
    editions: [
      {
        id: 'lantern-hc',
        format: 'Hardcover',
        label: 'Anthology Hardcover',
        priceLKR: 3200,
        priceUSD: 17.0,
        availability: 'In Stock',
        bindingDetail: 'Warm umber linen boards with cream endpapers',
      },
      {
        id: 'lantern-pb',
        format: 'Paperback',
        label: 'Standard Paperback',
        priceLKR: 1800,
        priceUSD: 9.5,
        availability: 'In Stock',
        bindingDetail: 'Matte paperback edition',
      },
      {
        id: 'lantern-eb',
        format: 'eBook',
        label: 'Digital Edition (EPUB & PDF)',
        priceLKR: 850,
        priceUSD: 4.5,
        availability: 'Instant Digital Delivery',
        bindingDetail: 'DRM-free digital download',
      },
    ],
    chapters: [
      {
        number: '01',
        title: 'A Key for the Upper Library',
        readTime: '8 min',
        paragraphs: [
          'For eleven winters, the narrow wooden staircase above the post office remained locked behind brass padlocks. Most villagers assumed the old reading room held nothing save damp ledgers and forgotten furniture.',
          'Then one April morning, seventy-two-year-old Ruwan climbed the steps with a tin of linseed oil, two broomsticks, and a fresh box of cedarwood pencils. By dusk, the tall windows stood unlatched, letting river air sweep across three oak tables waiting to be read upon once more.',
        ],
      },
      {
        number: '02',
        title: 'Borrowers of Evening Light',
        readTime: '7 min',
        paragraphs: [
          'By the third week, schoolboys arrived before sunset to trace maps in atlases, while elders sat by the window reading aloud to one another in steady cadences. Ruwan never charged a fee; he asked only that each borrower return a book with one honest sentence written inside the guest ledger.',
        ],
      },
    ],
  },
];
