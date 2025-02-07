const RESTRICTED_WORDS = {
  explicit: [
    "nsfw", "nude", "naked", "xxx", "porn", "pornographic", "adult content",
    "explicit", "18+", "adult only", "mature content"
  ],
  bodyParts: [
    "breasts", "boobs", "tits", "nipples", "cleavage",
    "penis", "dick", "cock", "phallus",
    "vagina", "pussy", "cunt",
    "ass", "butt", "buttocks", "anus",
    "genitals", "genitalia", "private parts",
    "armpit", "crotch", "groin"
  ],
  actions: [
    "sex", "sexy", "sexual", "erotic", "aroused", "arousing",
    "fucking", "fuck", "fucked",
    "masturbate", "masturbation",
    "orgasm", "cum", "cumming",
    "horny", "lewd",
    "strip", "striptease", "undress"
  ],
  clothing: [
    "lingerie", "thong", "bikini", "underwear",
    "topless", "bottomless", "half-naked",
    "revealing", "see-through"
  ],
  inappropriate: [
    "slutty", "whore", "bitch",
    "kinky", "bondage", "bdsm",
    "seductive", "sensual"
  ],
  ageRelated: [
    "small girl", "young girl", "little girl",
    "underage", "minor", "teen", "teenage",
    "loli", "shotacon", "jailbait"
  ],
  violence: [
    "gore", "blood", "bloody",
    "mutilation", "dismember",
    "torture", "abuse"
  ]
};

const RESTRICTED_PHRASES = [
  "take off clothes",
  "remove clothing",
  "without clothes",
  "no clothes",
  "barely covered",
  "barely dressed",
  "scantily clad",
  "not wearing",
  "fully naked",
  "get naked",
  "show skin",
  "remove dress",
  "take clothes",
  "wearing nothing"
];

const RESTRICTED_PATTERNS = [
  /n+\s*[s5]\s*f+\s*w+/i,      // Matches "nsfw" variations
  /p+\s*[o0]\s*r+\s*n+/i,      // Matches "porn" variations
  /s+\s*[e3]\s*x+/i,           // Matches "sex" variations
  /n+\s*[u4]\s*d+\s*[e3]/i,    // Matches "nude" variations
  /b+\s*[o0]{2,}\s*b+s*/i,     // Matches "boobs" variations
  /\b(no|without)\s+(clothes|clothing|dress)\b/i,
  /\b(un)(dressed|clothed)\b/i,
  /\b(bare|naked|nude)\s+(body|skin|flesh|person)\b/i,
  /\b(show|showing|reveal|revealing)\s+(skin|body|flesh)\b/i,
  /\b(pose|posing)\s+(suggestively|seductively)\b/i,
  /\b(semi|partially|fully)\s+(naked|nude|exposed)\b/i,
  /\b(private|intimate)\s+(parts|areas|regions)\b/i,
  /\b(nsfw|porn|xxx|adult|explicit)\s*(content|material|image|picture)\b/i,
  /\b(person|woman|man|girl|boy)\s+(without|no)\s+\w+/i
];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function containsRestrictedContent(text: string): {
  isRestricted: boolean;
  matches: string[];
} {
  const normalizedText = normalizeText(text);
  const matches = new Set<string>();

  // Check all restricted words from categories
  Object.values(RESTRICTED_WORDS).flat().forEach(word => {
    if (normalizedText.includes(word.toLowerCase())) {
      matches.add(word);
    }
  });

  // Check phrases
  RESTRICTED_PHRASES.forEach(phrase => {
    if (normalizedText.includes(phrase.toLowerCase())) {
      matches.add(phrase);
    }
  });

  // Check patterns
  RESTRICTED_PATTERNS.forEach(pattern => {
    if (pattern.test(normalizedText)) {
      matches.add(pattern.toString().slice(1, -2));
    }
  });

  // Check word combinations (3-word window)
  const words = normalizedText.split(' ');
  for (let i = 0; i < words.length - 2; i++) {
    const threeWordPhrase = words.slice(i, i + 3).join(' ');
    if (
      threeWordPhrase.includes('person without clothes') ||
      threeWordPhrase.includes('without any clothes') ||
      threeWordPhrase.includes('not wearing any') ||
      threeWordPhrase.match(/\b(remove|removing|removed)\s+\w+\s*(clothes|clothing)\b/i)
    ) {
      matches.add(threeWordPhrase);
    }
  }

  // Additional safety checks
  const hasNumbers = /\d{2,}[+]?/.test(text); // Removed unnecessary escape before +
  const hasSuspiciousChars = /[!@#$%^&*]/.test(text); // Check for suspicious characters

  return {
    isRestricted: matches.size > 0 || hasNumbers || hasSuspiciousChars,
    matches: Array.from(matches)
  };
}
