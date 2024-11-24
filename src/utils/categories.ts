interface CategoryRule {
  category: string;
  patterns: RegExp[];
}

const categoryRules: CategoryRule[] = [
  {
    category: 'Social Media',
    patterns: [
      /facebook\.com/,
      /twitter\.com/,
      /instagram\.com/,
      /linkedin\.com/,
      /reddit\.com/,
      /tiktok\.com/,
    ],
  },
  {
    category: 'Productivity',
    patterns: [
      /github\.com/,
      /gitlab\.com/,
      /notion\.so/,
      /trello\.com/,
      /slack\.com/,
      /google\.com\/docs/,
      /google\.com\/sheets/,
    ],
  },
  {
    category: 'Entertainment',
    patterns: [
      /youtube\.com/,
      /netflix\.com/,
      /spotify\.com/,
      /twitch\.tv/,
      /disney\+/,
      /crunchyroll\.com/,
      /funimation\.com/,
    ],
  },
  {
    category: 'Shopping',
    patterns: [
      /amazon\.com/,
      /ebay\.com/,
      /etsy\.com/,
      /walmart\.com/,
      /shopify\.com/,
    ],
  },
  {
    category: 'News & Media',
    patterns: [
      /cnn\.com/,
      /bbc\.com/,
      /nytimes\.com/,
      /reuters\.com/,
      /medium\.com/,
    ],
  },
  {
    category: 'Learning',
    patterns: [
      /coursera\.org/,
      /udemy\.com/,
      /edx\.org/,
      /stackoverflow\.com/,
      /mdn/,
      /w3schools\.com/,
    ],
  },
];

const videoCategories = [
  { category: 'Gaming', patterns: [/gameplay/i, /playthrough/i, /gaming/i] },
  { category: 'Music', patterns: [/official music video/i, /lyrics/i, /song/i] },
  { category: 'Tutorial', patterns: [/tutorial/i, /how to/i, /guide/i] },
  { category: 'Tech', patterns: [/review/i, /unboxing/i, /tech/i] },
  { category: 'Entertainment', patterns: [/vlog/i, /funny/i, /comedy/i] },
];

export const categorizeUrl = (domain: string): string => {
  for (const rule of categoryRules) {
    if (rule.patterns.some(pattern => pattern.test(domain))) {
      return rule.category;
    }
  }
  return 'Other';
};

export const categorizeVideo = (title: string, url: string) => {
  const videoId = url.includes('youtube.com/watch?v=')
    ? new URLSearchParams(url.split('?')[1]).get('v')
    : url.includes('youtu.be/')
    ? url.split('youtu.be/')[1]
    : null;

  let category = 'Other';
  for (const cat of videoCategories) {
    if (cat.patterns.some(pattern => pattern.test(title))) {
      category = cat.category;
      break;
    }
  }

  return {
    category,
    title: title.replace(/- YouTube$/, '').trim(),
    videoId,
  };
};