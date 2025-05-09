const sentimentLexicon = {
  // Positive words - now with wider range (0.1-3.5)
  good: 1.0, great: 1.5, excellent: 2.2, awesome: 1.8, fantastic: 2.0,
  nice: 0.8, happy: 1.2, joy: 1.5, love: 2.0, liked: 1.0, amazing: 2.2,
  wonderful: 2.0, proud: 1.2, helpful: 1.0, perfect: 3.0,
  superb: 2.3, brilliant: 2.2, stellar: 2.3, favorite: 1.7,
  exceptional: 2.5, outstanding: 2.4, marvelous: 2.0, terrific: 1.9, 
  pleasant: 1.2, enjoyable: 1.4,impressive: 1.7, fortunate: 1.3, lucky: 1.2, 
  blessed: 1.7, cheerful: 1.3, content: 1.1, grateful: 1.5, optimistic: 1.2,
  fun: 1.1, cool: 0.7, loved: 2.0, appreciate: 1.2, satisfying: 1.1,
  incredible: 2.3, exquisite: 3.2, success: 1.5,
  successful: 1.7, achievement: 1.5, accomplished: 1.3, celebrate: 1.3,
  win: 1.3, victory: 1.7, triumph: 2.0, beneficial: 1.2, worthwhile: 1.2,
  valuable: 1.3, special: 1.2, admirable: 1.3, respectable: 1.1,
  commendable: 1.4, praiseworthy: 1.5, effective: 1.0, efficient: 1.0,
  desirable: 1.2, positive: 1.2, supportive: 1.3, encouraging: 1.2,
  reassuring: 1.2, magical: 1.7, inspiring: 1.6, fascinating: 1.4,
  interesting: 0.9, intriguing: 0.8, exciting: 1.4,
  worthy: 1.2, dedicated: 1.0, committed: 0.9, attentive: 1.1,
  quality: 1.2, convenient: 1.0, reliable: 1.2, trustworthy: 1.3,
  honest: 1.2, genuine: 1.2, recommended: 1.3, recommend: 1.3,
  wow: 2.0, fantastic: 2.5, fabulous: 2.4, splendid: 2.3,

  // Feeling related
  bored: -1.0, boring: -1.2, dull: -1.0, tedious: -1.2, tiresome: -1.3,
  weary: -1.2, fatigued: -1.3, exhausted: -1.5, drained: -1.4,
  excited: 1.5, thrilled: 1.8, energized: 1.6, invigorated: 1.7,
  satisfied: 1.4, fulfilled: 1.5, contented: 1.4, relaxed: 1.3,
  delighted: 1.5, euphoric: 2.0, ecstatic: 2.5, blissful: 2.4,
  enthusiastic: 1.5, passionate: 1.6, zealous: 1.7, fervent: 1.6,

  // Beauty related
  beautiful: 1.8, gorgeous: 2.0, stunning: 2.2, pretty: 1.4, lovely: 1.7,
  attractive: 1.5, elegant: 1.6, dazzling: 1.9, radiant: 2.0, glowing: 1.7,
  handsome: 1.6, charming: 1.5, cute: 1.3, picturesque: 1.6, scenic: 1.6,
  aesthetic: 1.4, breathtaking: 2.8, magnificent: 2.9, majestic: 2.5, splendid: 2.4,

  // Nature and flowers
  flower: 1.1, flowers: 1.1, floral: 1.1, blooming: 1.3, blossoming: 1.4,
  garden: 1.2, botanical: 1.0, organic: 0.9, natural: 1.0, nature: 1.3,
  rose: 1.3, lily: 1.2, tulip: 1.2, daisy: 1.2, orchid: 1.3,
  petal: 1.1, bouquet: 1.4, lush: 1.5, verdant: 1.6, flourishing: 1.5,
  meadow: 1.4, rainbow: 1.7, colorful: 1.3, vibrant: 1.5, vivid: 1.4,
  sunlit: 1.5, golden: 1.4, spring: 1.3, summer: 1.3, sunny: 1.4,
  refreshing: 1.5, breezy: 1.2, fresh: 1.3, crisp: 1.2, pure: 1.4,
  
  // Safety related
  safe: 1.4, safety: 1.5, secure: 1.4, protected: 1.3, guarded: 1.2,
  sheltered: 1.3, safeguard: 1.3, shield: 1.2, defense: 1.2, 
  stable: 1.1, steady: 1.1, sound: 1.0, solid: 1.1, sturdy: 1.1,
  dependable: 1.3, assured: 1.2, guaranteed: 1.3, insured: 1.2, careful: 1.1,
  cautious: 1.0, precautious: 1.0, vigilant: 1.1, prepared: 1.1, ready: 1.0,
  wellness: 1.4, wellbeing: 1.5, health: 1.3, healthy: 1.4, wholesome: 1.3,
  harmless: 1.1, innocent: 1.2, benign: 1.1, gentle: 1.2, mild: 1.0,
  
  // Positive emotions and states
  joyful: 1.7, ecstatic: 2.5, euphoric: 2.8, elated: 2.0, blissful: 2.4,
  gleeful: 1.7, jubilant: 1.9, merry: 1.6, jolly: 1.6, jovial: 1.5,
  serene: 1.6, tranquil: 1.7, peaceful: 1.7, calm: 1.4, relaxed: 1.5,
  contented: 1.5, fulfilled: 1.7, gratified: 1.6, pleased: 1.5,
  hopeful: 1.4, confident: 1.4, assured: 1.4,
  brave: 1.5, courageous: 1.6, fearless: 1.7, heroic: 1.9, valiant: 1.7,
  kind: 1.4, generous: 1.5, charitable: 1.6, compassionate: 1.7, benevolent: 1.8,
  friendly: 1.5, sociable: 1.4, amiable: 1.4, cordial: 1.3, affable: 1.4,
  loving: 1.7, caring: 1.6, affectionate: 1.6,
  
  // Professional/achievement related
  expert: 1.6, proficient: 1.5, skilled: 1.5, talented: 1.6, adept: 1.5,
  masterful: 1.9, professional: 1.5, competent: 1.4, capable: 1.4, qualified: 1.3,
  accomplished: 1.6, achieved: 1.5, successful: 1.6, prosperous: 1.8, thriving: 1.8,
  productive: 1.4, efficient: 1.5, effective: 1.4, fruitful: 1.5, profitable: 1.6,
  innovative: 1.6, creative: 1.6, imaginative: 1.5, ingenious: 1.9, clever: 1.5,
  intelligent: 1.5, smart: 1.5, brilliant: 1.9, wise: 1.7, knowledgeable: 1.7,
  insightful: 1.5, perceptive: 1.5, discerning: 1.4, astute: 1.5, shrewd: 1.4,
  
  // Value related
  premium: 1.5, luxury: 1.6, exclusive: 1.5, elite: 1.6, superior: 1.6,
  precious: 1.7, priceless: 2.8, invaluable: 2.8, worthy: 1.5, deserving: 1.4,
  beneficial: 1.5, advantageous: 1.5, useful: 1.4, practical: 1.3, functional: 1.3,
  economical: 1.3, affordable: 1.4, bargain: 1.4, deal: 1.4, worthwhile: 1.4,
  
  // Miscellaneous positive
  authentic: 1.4, genuine: 1.5, real: 1.3, original: 1.4, legitimate: 1.3,
  ethical: 1.5, moral: 1.4, principled: 1.5, virtuous: 1.7, noble: 1.6,
  perfect: 3.0, flawless: 2.8, immaculate: 2.6, pristine: 2.4,
  new: 1.2, modern: 1.2, innovative: 1.6, "cutting-edge": 1.7, advanced: 1.5,
  promising: 1.4, potential: 1.3, prospect: 1.3, opportunity: 1.4,
  balanced: 1.4, harmonious: 1.5, compatible: 1.3, consistent: 1.3, coherent: 1.3,
  significant: 1.3, important: 1.3, essential: 1.4, crucial: 1.5, vital: 1.6,
  renowned: 1.5, famous: 1.4, celebrated: 1.7, acclaimed: 1.7, prestigious: 1.7,

  // Negative words - now with wider range (-0.1 to -3.5)
  bad: -1.2, terrible: -2.2, horrible: -2.0, awful: -2.1, worst: -3.2,
  sad: -1.3, hate: -2.8, angry: -1.6, disappointed: -1.8, boring: -1.2,
  dull: -1.0, useless: -1.8, annoying: -1.9, frustrating: -1.8,
  pathetic: -2.3, waste: -2.0, regrettable: -1.8, disgusting: -2.5,
  irritating: -1.5, overpriced: -1.6, miserable: -2.0,
  depressing: -1.8, tragic: -2.8, unfortunate: -1.5,
  problematic: -1.3, concerning: -1.2, alarming: -1.6, stressful: -1.5,
  anxious: -1.3, worried: -1.2, fearful: -1.5, dreadful: -2.2,
  fault: -1.5, ruined: -1.8, failure: -1.8, disappointing: -1.6,
  flawed: -1.3, defective: -1.5, broken: -1.6, malfunctioning: -1.6,
  ineffective: -1.2, inefficient: -1.2, unprofessional: -1.5,
  rude: -1.8, unhelpful: -1.5, incompetent: -1.8, inadequate: -1.3,
  unacceptable: -1.8, poor: -1.3, mediocre: -1.0, subpar: -1.2,
  insufficient: -1.2, lacking: -1.1, failing: -1.5, failed: -1.5,
  error: -1.3, mistake: -1.2, mess: -1.3, struggle: -1.2,
  difficult: -0.9, trouble: -1.2, problem: -1.2, issue: -0.9,
  drawback: -1.0, disadvantage: -1.2, liability: -1.3,
  unsafisfactory: -1.5, disastrous: -2.5, catastrophic: -3.0,
  horrific: -2.5, atrocious: -2.6, appalling: -2.4, shocking: -1.8,
  distressing: -1.6, outrageous: -1.8, offensive: -1.8,
  unpleasant: -1.3, uncomfortable: -1.2, painful: -1.5,
  inconvenient: -1.1, unreliable: -1.3, untrustworthy: -1.6,
  dishonest: -1.8, deceptive: -1.8, misleading: -1.6,
  confusing: -1.1, complicated: -0.9,
  expensive: -0.9, pricey: -1.0, costly: -1.1,
  dangerous: -1.7, risky: -1.4, threatening: -1.9,
  slow: -0.9, delayed: -1.2, late: -1.0, laggy: -1.1,
  buggy: -1.5, glitchy: -1.4, crashes: -1.8, froze: -1.4,
  unimpressive: -1.0, unremarkable: -0.8,
  tedious: -1.2, tiresome: -1.3, exhausting: -1.5,
  unnecessary: -1.1, redundant: -0.9, worthless: -1.8,
  irrelevant: -1.0, inappropriate: -1.3, unsuitable: -1.2,
  outdated: -1.2, obsolete: -1.3, impractical: -1.2,
  imperfect: -1.0, flawed: -1.3, faulty: -1.5,
  dislike: -1.5, hated: -2.2, loathe: -2.5, despise: -2.8,
  avoid: -1.3, rejection: -1.5, reject: -1.5, refused: -1.3,
  declined: -1.2, denied: -1.3, prevented: -1.2,
  damaged: -1.5, destroyed: -2.4, devastated: -2.5,
  annoyed: -1.3, aggravated: -1.5, agitated: -1.3,
  critical: -1.2, critiqued: -1.0, complaint: -1.2,
  complain: -1.2, complained: -1.2, unsatisfied: -1.5,
  dissatisfied: -1.6, unhappy: -1.5, displeased: -1.5,

  // Danger related (adjusted)
  dangerous: -1.9, hazardous: -1.9, perilous: -2.2, treacherous: -2.4, unsafe: -1.8,
  risky: -1.7, precarious: -1.8, menacing: -2.0, threatening: -2.1, ominous: -1.8,
  harmful: -1.8, damaging: -1.8, destructive: -2.2, deadly: -2.8, lethal: -3.0,
  fatal: -3.0, mortal: -2.8, toxic: -2.2, poisonous: -2.5, venomous: -2.2,
  contaminated: -2.0, polluted: -1.8, infected: -2.0, contagious: -2.0, diseased: -2.2,
  violent: -2.2, aggressive: -2.0, hostile: -2.0, vicious: -2.5, ferocious: -2.2,
  fierce: -2.0, savage: -2.2, brutal: -2.5, cruel: -2.2, malicious: -2.2,
  explosive: -2.0, volatile: -1.8, unstable: -1.8, unpredictable: -1.7, erratic: -1.7,
  
  // Disaster related (adjusted)
  disaster: -2.5, catastrophe: -2.8, calamity: -2.8, tragedy: -2.6, cataclysm: -3.0,
  crisis: -2.2, emergency: -2.0, predicament: -1.8, plight: -2.0, adversity: -2.0,
  destruction: -2.5, devastation: -2.8, demolition: -2.5, ruin: -2.5, havoc: -2.2,
  wreckage: -2.2, debris: -1.8, remains: -1.7, aftermath: -1.8, consequences: -1.7,
  earthquake: -2.2, hurricane: -2.5, tornado: -2.2, tsunami: -2.5, flood: -2.2,
  wildfire: -2.2, drought: -2.0, famine: -2.5, epidemic: -2.5, pandemic: -2.8,
  outbreak: -2.2, eruption: -2.0, explosion: -2.2, collision: -2.0, crash: -2.2,
  accident: -1.8, incident: -1.5, casualty: -2.0, fatality: -2.2, death: -2.5,
  injury: -2.0, wound: -1.8, trauma: -2.0, damage: -1.8, loss: -1.7,
  
  // Pain related (adjusted)
  painful: -1.7, agonizing: -2.8, excruciating: -3.0, torturous: -3.2, unbearable: -2.8,
  hurting: -1.6, hurt: -1.7, sore: -1.5, achy: -1.6,
  throbbing: -1.7, stinging: -1.6, burning: -1.7, stabbing: -2.0, shooting: -1.8,
  sharp: -1.7, severe: -2.0, intense: -1.8, extreme: -2.0, acute: -1.8,
  chronic: -1.8, persistent: -1.7, lingering: -1.7, constant: -1.7, relentless: -2.0,
  uncomfortable: -1.5, discomforting: -1.6, distressing: -1.7, tormenting: -2.1, afflicting: -1.8,
  suffering: -2.0, agony: -2.4, misery: -2.4, torture: -2.8, torment: -2.8,
  
  // Rumors and falsehoods (adjusted)
  rumor: -1.2, gossip: -1.2, hearsay: -1.3, scandal: -1.5, controversy: -1.4,
  lie: -2.0, falsehood: -2.0, untruth: -2.0, fabrication: -1.8, fiction: -1.4,
  deception: -1.8, deceit: -1.8, dishonesty: -2.0, fraud: -2.2, hoax: -1.8,
  fake: -1.7, phony: -1.7, bogus: -1.6, counterfeit: -1.8, forged: -1.7,
  misleading: -1.6, deceptive: -1.7, manipulative: -1.8, disinformation: -2.0, misinformation: -1.8,
  propaganda: -1.7, bias: -1.4, prejudice: -1.5, discrimination: -2.0, stereotype: -1.7,
  slander: -2.0, defamation: -2.0, libel: -2.2, smear: -1.8, accusation: -1.7,
  allegation: -1.6, insinuation: -1.4, innuendo: -1.4, implication: -1.3,
  
  // Negative emotions and states (adjusted)
  afraid: -1.5, scared: -1.7, terrified: -2.2, frightened: -1.7, horror: -2.0,
  dread: -1.8, panic: -2.0, terror: -2.4, fear: -1.8, phobia: -1.8,
  anxious: -1.5, nervous: -1.5, uneasy: -1.4, apprehensive: -1.4, worried: -1.5,
  stressed: -1.7, overwhelmed: -1.8, pressured: -1.5, burdened: -1.7, strained: -1.7,
  depressed: -2.0, gloomy: -1.7, melancholy: -1.8, despondent: -1.8, hopeless: -2.0,
  desperate: -2.0, desolate: -1.8, forlorn: -1.8, abandoned: -1.8, forsaken: -2.0,
  lonely: -1.7, isolated: -1.8, alienated: -1.8, excluded: -1.8, rejected: -1.8,
  ashamed: -1.7, humiliated: -1.8, embarrassed: -1.7, mortified: -1.8, disgraced: -2.0,
  guilty: -1.7, remorseful: -1.5, regretful: -1.5, sorry: -1.4, apologetic: -1.4,
  jealous: -1.5, envious: -1.7, resentful: -1.7, bitter: -1.8, spiteful: -1.8,
  hateful: -2.0, vengeful: -2.0, hostile: -2.2, antagonistic: -2.0, adversarial: -1.8,
  
  // Professional/quality issues (adjusted)
  incompetent: -1.8, inept: -1.8, unskilled: -1.7, amateur: -1.4, novice: -1.3,
  unprofessional: -1.7, unprepared: -1.5, unqualified: -1.7, inadequate: -1.5, inferior: -1.7,
  substandard: -1.7, "low-quality": -1.6, "poor-quality": -1.7, shoddy: -1.8, cheap: -1.4,
  flimsy: -1.5, fragile: -1.4, weak: -1.5, feeble: -1.5, frail: -1.4,
  unreliable: -1.7, undependable: -1.8, inconsistent: -1.5, erratic: -1.7, unpredictable: -1.5,
  malfunctioning: -1.8, defective: -1.8, faulty: -1.8, broken: -1.7, inoperative: -1.8,
  corrupted: -2.0, compromised: -1.8, hacked: -1.8, infected: -1.8, hijacked: -2.0,
  
  // Obsolescence and irrelevance (adjusted)
  obsolete: -0.4, outdated: -0.9, antiquated: -0.3, outmoded: -0.3, primitive: -0.6,
  archaic: -0.4, ancient: -0.8, bygone: -1.1, past: -0.2, "old-fashioned": -1.2,
  irrelevant: -0.5, extraneous: -0.4, superfluous: -0.3, unnecessary: -0.3, redundant: -0.8,
  meaningless: -0.9, pointless: -1.0, purposeless: -1.0, futile: -1.7, vain: -1.5,
  
  // Miscellaneous negative (adjusted)
  failure: -2.0, defeat: -1.8, loss: -1.7, downfall: -1.8, collapse: -2.0,
  bankruptcy: -2.2, recession: -2.0, depression: -2.0, crisis: -2.0, downturn: -1.8,
  poverty: -2.0, destitution: -2.2, hardship: -2.0, struggle: -1.8, difficulty: -1.7,
  challenging: -1.3, demanding: -1.3, tough: -1.4, hard: -1.3, arduous: -1.4,
  impossible: -1.8, unfeasible: -1.7, impractical: -1.5, unrealistic: -1.7, unattainable: -1.8,
  forbidden: -1.5, prohibited: -1.5, banned: -1.7, illegal: -1.7, unlawful: -1.8,
  immoral: -1.8, unethical: -1.8, corrupt: -2.0, wicked: -2.2, evil: -2.8,
  unfair: -1.5, unjust: -1.7, biased: -1.5, prejudiced: -1.7, discriminatory: -1.8,
  controversial: -1.4, disputed: -1.3, contested: -1.3, debatable: -1.2, questionable: -1.4,
  suspicious: -1.5, dubious: -1.5, shady: -1.7, sketchy: -1.5, fishy: -1.5,

  // Contextual modifiers - adjusted for better balance
  but: -0.5, however: -0.6, although: -0.4, despite: -0.3,
  though: -0.3, regardless: -0.2, yet: -0.4, nevertheless: -0.4,
  nonetheless: -0.4, except: -0.4, whereas: -0.3, still: -0.2,
  conversely: -0.6, contrarily: -0.6, alternatively: -0.3,
  rather: -0.3, instead: -0.4, otherwise: -0.3, meanwhile: -0.2,
  while: -0.3, even: -0.2, actually: -0.2, unfortunately: -0.8,
  fortunately: 0.5, luckily: 0.5, happily: 0.6, sadly: -0.6,
  regrettably: -0.6, surprisingly: 0.3, unexpectedly: 0.2, 
  ironically: -0.3, paradoxically: -0.3, incidentally: -0.1,
  
  // Additional contextual modifiers - adjusted
  moreover: 0.3, furthermore: 0.3, additionally: 0.3, also: 0.2, besides: 0.3,
  indeed: 0.4, certainly: 0.4, definitely: 0.5, absolutely: 0.5, undoubtedly: 0.5,
  possibly: 0.1, maybe: 0.1, perhaps: 0.1, supposedly: -0.1, allegedly: -0.1,
  apparently: -0.1, seemingly: -0.1, arguably: -0.1, presumably: -0.1, purportedly: -0.1,
  especially: 0.3, particularly: 0.3, notably: 0.3, specifically: 0.2, considerably: 0.3,
  slightly: -0.1, somewhat: -0.1, partially: -0.1, barely: -0.2, hardly: -0.2,
  rarely: -0.1, seldom: -0.1, occasionally: -0.1, sometimes: -0.1, often: 0.2,
  frequently: 0.2, usually: 0.3, typically: 0.2, generally: 0.2, commonly: 0.2,
  always: 0.4, never: -0.3, ever: 0.2, somehow: 0.1, anyhow: 0.1,
  anyway: 0.1, notwithstanding: 0.2, beyond: 0.2, above: 0.2,
  below: -0.1, beneath: -0.1, under: -0.1, over: 0.1, across: 0.1,
  through: 0.1, throughout: 0.2, amid: 0.1, among: 0.1, within: 0.1,
  without: -0.2, except: -0.1, apart: -0.1, aside: -0.1, away: -0.1,
  toward: 0.1, towards: 0.1, against: -0.1, versus: -0.1, contrary: -0.2,
  opposite: -0.1, unlike: -0.1, like: 0.2, similar: 0.2, resembling: 0.2,
  compared: 0.1, relative: 0.1, respective: 0.1, particular: 0.1, specific: 0.1,
  certain: 0.2, various: 0.1, different: 0.1, diverse: 0.1, several: 0.1,
  many: 0.1, much: 0.2, more: 0.2, most: 0.3, less: -0.1,
  least: -0.2, few: -0.1, little: -0.1, some: 0.1, any: 0.1,
  none: -0.2, no: -0.3, not: -0.3, neither: -0.2, nor: -0.2,
  either: 0.1, or: 0.1, and: 0.1, both: 0.1, all: 0.2
};

// Enhanced negations with expanded patterns
const negations = new Set([
  "not", "never", "no", "hardly", "scarcely", "barely", "seldom", "rarely",
  "didn't", "wasn't", "isn't", "aren't", "couldn't", "cannot",
  "wouldn't", "shouldn't", "don't", "won't", "can't", "nothing",
  "doesn't", "haven't", "hasn't", "hadn't", "mustn't", "none",
  "nowhere", "nobody", "neither", "nor", "without", "lacks", "lacking",
  "fail", "fails", "failed", "failing", "absence", "absent", "miss", "missing",
  "free of", "free from", "void of", "devoid of", "lack of", "void", "devoid"
]);

// Enhanced intensifiers with more variations and better scoring
const intensifiers = {
  very: 1.7, extremely: 2.2, slightly: 0.6, somewhat: 0.8, 
  really: 1.5, incredibly: 2.5, barely: 0.5, totally: 1.8,
  completely: 1.9, absolutely: 2.1, highly: 1.6, ridiculously: 2.3,
  exceptionally: 2.4, remarkably: 1.8, unusually: 1.7, particularly: 1.6,
  especially: 1.5, awfully: 1.9, terribly: 2, insanely: 2.2,
  unbelievably: 2.3, immensely: 2, enormously: 2.1, vastly: 1.8,
  still: 1.3, quite: 1.4, fairly: 1.2, pretty: 1.3,
  relatively: 1.1, moderately: 0.9, mildly: 0.7, 
  impossibly: 2.4, extraordinarily: 2.3, utterly: 2.2,
  profoundly: 2.1, deeply: 1.9, decidedly: 1.7,
  genuinely: 1.6, truly: 1.7, undeniably: 1.8,
  indisputably: 1.9, doubtlessly: 1.7, undoubtedly: 1.8,
  overwhelmingly: 2.2, exceedingly: 2.1, excessively: 2,
  intensely: 1.9, seriously: 1.7, genuinely: 1.6,
  notably: 1.5, significantly: 1.6, substantially: 1.7,
  considerably: 1.6, noticeably: 1.4, markedly: 1.5,
  distinctly: 1.4, certainly: 1.5, definitely: 1.6,
  clearly: 1.4, evidently: 1.3, obviously: 1.5,
  apparently: 1.2, seemingly: 1.1, supposedly: 0.9,
  just: 1.1, simply: 1.2, merely: 0.8, only: 0.9,
  almost: 0.7, nearly: 0.8, practically: 0.9,
  virtually: 1.1, essentially: 1.2, fundamentally: 1.3,
  thoroughly: 1.8, wholly: 1.7, entirely: 1.8,
  all: 1.6, so: 1.4, too: 1.3, such: 1.2,
  most: 1.5, more: 1.1, less: -0.9, least: -1.1,
  rather: 1.2, reasonably: 1, adequately: 0.9,
  sufficiently: 1.1, perfectly: 1.9, ideally: 1.8,
  amazingly: 2.1, astonishingly: 2, shockingly: 1.9,
  surprisingly: 1.8, stunningly: 2, impressively: 1.9,
  dramatically: 1.8, strikingly: 1.7, breathtakingly: 2.2,
  wonderfully: 1.8, marvelously: 1.9,
  weirdly: 1.5, oddly: 1.4, strangely: 1.3,
};

// Expanded idiomatic phrases with improved detection
const idiomaticPhrases = {
  "could have been better": -2.2,
  "not the best": -1.8,
  "nothing to write home about": -1.5,
  "i wouldn't say it was great": -2.5,
  "not terrible": 1.8,
  "not bad": 2.2,
  "wasn't bad": 2.1,
  "didn't hate": 2.5,
  "could be worse": 1.2,
  "nothing special": -1.8,
  "far from perfect": -2.2,
  "less than ideal": -2.1,
  "no complaints": 1.8,
  "can't complain": 1.7,
  "too good to be true": -2.3,
  "left much to be desired": -2.5,
  "not my cup of tea": -1.5,
  "not up to par": -2,
  "not what i expected": -2.2,
  "falls short of expectations": -2.5,
  "leaves something to be desired": -2.3,
  "not living up to the hype": -2.4,
  "not worth the money": -3,
  "not as good as advertised": -2.8,
  "couldn't be happier": 4.5,
  "better than expected": 3.2,
  "exceeded expectations": 3.8,
  "worth every penny": 4,
  "lived up to the hype": 3.5,
  "ruined the experience": -3.2,
  "not very good": -2.5,
  "not very bad": 1.8,
  "not exactly great": -2.2,
  "not completely terrible": 1.5,
  "not particularly helpful": -2,
  "nothing to complain about": 2,
  "not the worst": 1.5,
  "not all bad": 1.8,
  "not as bad as i thought": 2.2,
  "not without its merits": 1.5,
  "not to my liking": -2,
  "not what i was hoping for": -2.5,
  "not the most pleasant": -2.2,
  "not the most enjoyable": -2.2,
  "not the greatest": -2.5,
  "not the most impressive": -2.2,
  "made up for": 2.5,
  "impressed with": 3.2,
  "left a lot to be desired": -3,
  "waste of time": -3.5,
  "waste of money": -3.8,
  "highly recommend": 4,
  "wouldn't recommend": -3.5,
  "blew me away": 4.2,
  "blown away": 4.2,
  "left a bad taste": -3.5,
  "second to none": 4.5,
  "top notch": 4.3,
  "first class": 4,
  "world class": 4.2,
  "state of the art": 3.8,
  "cutting edge": 3.7,
  "ahead of its time": 3.9,
  "behind the times": -2.8,
  "outdated": -2.5,
  "life changing": 4.5,
  "game changer": 4.3,
  "changed my life": 4.5,
  "changed the game": 4.3,
  "revolutionized": 4.2,
  "transformed": 3.8,
  "completely transformed": 4,
  "saved my life": 4.8,
  "saved the day": 4.2,
  "saved me from": 3.8,
  "disappointed with": -3.2,
  "disappointed by": -3.2,
  "let down by": -3,
  "let down": -3,
  "fell short of": -2.8,
  "fell flat": -2.5,
  "missed the mark": -2.7,
  "hit the mark": 3.2,
  "on point": 3.5,
  "spot on": 3.7,
  "dead on": 3.5,
  "right on": 3.2,
  "off the mark": -2.7,
  "way off": -3,
  "completely off": -3.2,
  "totally off": -3.2,
  "on the right track": 2.5,
  "off track": -2.5,
  "off the rails": -3,
  "went wrong": -2.8,
  "went south": -3,
  "went downhill": -3.2,
  "took a turn for the worse": -3.5,
  "took a turn for the better": 3.5,
  "for the better": 3,
  "for the worse": -3,
  "better off": 2.5,
  "worse off": -2.5,
  "at least": 1,
  "nothing but": 2.5,
  "more than": 1.8,
  "less than": -1.8,
  "above and beyond": 4,
  "out of this world": 4.5,
  "mind blowing": 4.7,
  "jaw dropping": 4.6,
  "breathtaking": 4.5,
  "heart breaking": -4.5,
  "soul crushing": -4.8,
  "spirit lifting": 4.2,
  "uplifting": 3.8,
  "depressing": -3.5,
  "devastating": -4.2,
  "crushed it": 4.2,
  "nailed it": 4,
  "knocked it out of the park": 4.3,
  "fell short": -2.8,
  "miss the boat": -2.5,
  "missed the boat": -2.5,
  "missed out": -2.2,
  "out of the park": 4.3,
  "out of the box": 3.5,
  "outside the box": 3.5,
  "thinking outside the box": 3.2,
  "in the box": -1.5,
  "by the book": -1.2,
  "by the numbers": -1.5,
  "cooking with gas": 3.5,
  "firing on all cylinders": 4,
  "firing on all cylinders": 4,
  "hitting on all cylinders": 4,
  "running on fumes": -2.8,
  "out of gas": -3,
  "ran out of steam": -2.8,
  "lost steam": -2.5,
  "gaining steam": 2.8,
  "picking up steam": 3,
  "picking up pace": 3,
  "losing pace": -2.5,
  "slowing down": -2,
  "speeding up": 2.5,
  "took forever": -3,
  "in no time": 3,
  "right away": 2.8,
  "immediately": 2.5,
  "without delay": 2.5,
  "with delay": -2.5,
  "delayed": -2.8,
  "on time": 2.2,
  "ahead of schedule": 3,
  "behind schedule": -2.8,
  "on schedule": 2.2,
  "on budget": 2.5,
  "over budget": -2.8,
  "under budget": 3,
  "break the bank": -3.2,
  "doesn't break the bank": 2.8,
  "won't break the bank": 2.8,
  "arm and a leg": -3.5,
  "costs an arm and a leg": -3.5,
  "worth the price": 3.2,
  "not worth the price": -3.2,
  "bang for your buck": 3.5,
  "bang for the buck": 3.5,
  "value for money": 3.2,
  "money's worth": 3,
  "not money's worth": -3,
  "got my money's worth": 3.2,
  "didn't get my money's worth": -3.2,
  "worth every cent": 4,
  "worth every dollar": 4,
  "worth every dime": 4,
  "not worth a dime": -3.8,
  "not worth a penny": -3.8,
  "penny pincher": -2.5,
  "bargain": 3,
  "steal": 3.5,
  "highway robbery": -3.8,
  "daylight robbery": -3.8,
  "outrageous price": -3.5,
  "ridiculous price": -3.5,
  "sky high prices": -3.5,
  "rock bottom prices": 3.5,
  "dirt cheap": 3.2,
  "cheaply made": -3,
  "poorly made": -3.2,
  "well made": 3.2,
  "well constructed": 3.5,
  "poorly constructed": -3.5,
  "high quality": 3.8,
  "low quality": -3.8,
  "top quality": 4,
  "premium quality": 4,
  "inferior quality": -3.8,
  "superior quality": 3.8,
  "substandard": -3.5,
  "below standard": -3.2,
  "above standard": 3.2,
  "exceeds standards": 3.5,
  "fails to meet standards": -3.5,
  "meets standards": 2.5,
  "up to standard": 2.8,
  "not up to standard": -2.8,
  "below par": -2.5,
  "above par": 2.5,
  "on par": 2,
  "par for the course": 1.5,
  "run of the mill": -1.5,
  "a dime a dozen": -2,
  "one in a million": 4.2,
  "one of a kind": 4,
  "diamond in the rough": 3.5,
  "rough around the edges": -2,
  "polished": 3,
  "unpolished": -2.5,
  "rough": -2.2,
  "smooth": 2.8,
  "seamless": 3.5,
  "without a hitch": 3.2,
  "without issues": 3,
  "without problems": 3,
  "with issues": -2.8,
  "with problems": -2.8,
  "problematic": -2.5,
  "issue free": 3,
  "problem free": 3,
  "trouble free": 3,
  "hassle free": 3.2,
  "headache free": 3.2,
  "stress free": 3.5,
  "painless": 3,
  "painful": -3,
  "agony": -4,
  "bliss": 4,
  "heaven": 4.5,
  "heavenly": 4.5,
  "hellish": -4.5,
  "hell": -4.5,
  "nightmare": -4.2,
  "dream come true": 4.2,
  "dream": 3.8,
  "couldn't be better": 4.5,
  "happier": 3.5,
};

// Improved sarcasm detection with more patterns
const sarcasmPatterns = [
  /(yeah|sure).+(good|great|wonderful)/i,
  /(as if|of course)/i,
  /i('d)? (just )?love to/i,
  /(another|just) (perfect|great) (day|experience)/i,
  /(what|who) (could|would) (possibly|ever) go wrong/i,
  /(right|sure), because that (always|never) works/i,
  /oh (wow|great|fantastic)/i,
  /(best|greatest).+ever/i,
  /(simply|absolutely) (adorable|perfect)/i,
  /(just|exactly) what (i|you) (needed|wanted)/i,
  /big surprise/i,
  /what a shock/i,
  /color me shocked/i,
  /who would have thought/i,
  /i'm so surprised/i,
  /how unexpected/i,
  /tell me something i don't know/i,
  /no way!/i,
  /you don't say/i,
  /well that's original/i,
  /it is all the (.*) fault/i,
  /brilliant!/i,
  /genius!/i,
  /stellar performance/i,
  /outstanding job/i,
  /way to go/i,
  /nice job/i,
  /nailed it/i,
  /just perfect/i,
  /couldn't be better/i,
  /totally worth it/i,
  /money well spent/i,
  /time well spent/i,
  /great success/i,
  /so helpful/i,
  /that'll solve everything/i,
  /problem solved/i,
  /mission accomplished/i,
  /well done/i,
  /good job/i,
  /fantastic work/i,
  /impressive/i,
  /impressive work/i,
  /impressive effort/i,
  /impressive results/i,
  /wow, impressive/i,
  /wow, amazing/i,
  /wow, fantastic/i,
  /wow, brilliant/i,
  /exactly what we need/i,
  /exactly what i expected/i,
  /absolutely shocking/i,
  /shocking revelation/i,
  /earth-shattering news/i,
  /groundbreaking discovery/i,
  /revolutionary idea/i,
  /life-changing experience/i,
  /changed my life/i,
  /completely changed my perspective/i,
  /opened my eyes/i,
  /mind-blowing/i,
  /mind-numbing/i,
  /absolutely riveting/i,
  /edge of my seat/i,
  /couldn't look away/i,
  /couldn't put it down/i,
  /couldn't stop watching/i,
  /couldn't stop reading/i,
  /page-turner/i,
  /must-read/i,
  /must-watch/i,
  /must-see/i,
  /must-have/i,
  /can't live without/i,
  /can't do without/i,
  /essential/i,
  /absolute necessity/i,
  /indispensable/i,
  /lifesaver/i,
  /game-changer/i,
  /changed the game/i,
  /raised the bar/i,
  /set a new standard/i,
  /new benchmark/i,
  /new level/i,
  /next level/i,
  /elevated/i,
  /transcendent/i,
  /sublime/i,
  /peak performance/i,
  /peak experience/i,
  /peak entertainment/i,
  /best ever/i,
  /best of all time/i,
  /greatest of all time/i,
  /masterpiece/i,
  /work of art/i,
  /work of genius/i,
  /stroke of genius/i,
  /moment of brilliance/i,
  /flash of inspiration/i,
  /divine inspiration/i,
  /divinely inspired/i,
  /heaven-sent/i,
  /godsend/i,
  /blessing in disguise/i,
  /mixed blessing/i,
  /silver lining/i,
  /bright side/i,
  /looking on the bright side/i,
  /glass half full/i,
  /glass half empty/i,
  /optimist/i,
  /pessimist/i,
  /realistic/i,
  /pragmatic/i,
  /practical/i,
  /idealistic/i,
  /utopian/i,
  /dystopian/i,
  /apocalyptic/i,
  /end of the world/i,
  /end of days/i,
  /doomsday/i,
  /doom and gloom/i,
  /all doom and gloom/i,
  /all sunshine and rainbows/i,
  /sunshine and roses/i,
  /bed of roses/i,
  /walk in the park/i,
  /piece of cake/i,
  /easy as pie/i,
  /child's play/i,
  /no-brainer/i,
  /rocket science/i,
  /brain surgery/i,
  /not rocket science/i,
  /not brain surgery/i,
  /not exactly rocket science/i,
  /not exactly brain surgery/i,
  /not exactly difficult/i,
  /not exactly easy/i,
  /not exactly simple/i,
  /not exactly straightforward/i,
  /not exactly complicated/i,
  /not exactly complex/i,
  /not exactly challenging/i,
  /not exactly demanding/i,
  /not exactly taxing/i,
  /not exactly strenuous/i,
  /not exactly arduous/i,
  /not exactly laborious/i,
  /not exactly burdensome/i,
  /not exactly onerous/i,
  /not exactly troublesome/i,
  /oh, joy(!|\.|$)/i,
  /oh, goodie(!|\.|$)/i,
  /oh, goody(!|\.|$)/i,
  /oh, boy(!|\.|$)/i,
  /oh, man(!|\.|$)/i,
  /oh, brother(!|\.|$)/i,
  /oh, sister(!|\.|$)/i,
  /oh, please(!|\.|$)/i,
  /oh, come on(!|\.|$)/i,
  /oh, sure(!|\.|$)/i,
  /oh, really(!|\.|$)/i,
  /oh, absolutely(!|\.|$)/i,
  /oh, definitely(!|\.|$)/i,
  /oh, certainly(!|\.|$)/i,
  /oh, without a doubt(!|\.|$)/i,
  /oh, indubitably(!|\.|$)/i,
  /oh, undoubtedly(!|\.|$)/i,
  /oh, unquestionably(!|\.|$)/i,
  /oh, indeed(!|\.|$)/i,
  /oh, truly(!|\.|$)/i,
  /oh, genuinely(!|\.|$)/i,
  /oh, sincerely(!|\.|$)/i,
  /oh, honestly(!|\.|$)/i,
  /oh, frankly(!|\.|$)/i,
  /oh, bluntly(!|\.|$)/i,
  /oh, candidly(!|\.|$)/i,
  /oh, straightforwardly(!|\.|$)/i,
  /oh, directly(!|\.|$)/i,
  /oh, plainly(!|\.|$)/i,
  /oh, simply(!|\.|$)/i,
  /oh, merely(!|\.|$)/i,
  /oh, just(!|\.|$)/i,
  /oh, only(!|\.|$)/i,
  /oh, solely(!|\.|$)/i,
  /oh, exclusively(!|\.|$)/i
];

// Enhanced stop words with more comprehensive coverage
const stopWords = new Set([
  "the", "a", "an", "and", "or", "but", "if", "then", "else", "when", "at", "from", "by", "on", "off", "for", 
  "of", "to", "with", "about", "that", "this", "there", "it", "its",
  "in", "out", "up", "down", "over", "under", "above", "below",
  "through", "during", "before", "after", "since", "until", "while",
  "because", "as", "due", "owing", "regarding", "concerning", "besides",
  "however", "therefore", "thus", "hence", "accordingly", "consequently",
  "my", "your", "his", "her", "its", "our", "their", "mine", "yours", "hers",
  "ours", "theirs", "i", "you", "he", "she", "we", "they", "them", "him", "us",
  "me", "myself", "yourself", "himself", "herself", "ourselves", "themselves",
  "who", "whom", "whose", "which", "what", "where", "when", "why", "how",
  "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
  "having", "do", "does", "did", "doing", "would", "should", "could", "might",
  "must", "can", "will", "shall", "may", "any", "some", "many", "much", "few",
  "little", "most", "more", "less", "several", "each", "every", "all", "both",
  "neither", "either", "other", "another", "such", "no", "nor", "not", "only",
  "own", "same", "so", "than", "too", "very", "just", "also", "like", "even",
  "back", "again", "still", "here", "there", "now", "then", "once", "always", 
  "never", "sometimes", "usually", "often", "rarely", "seldom", "already", "yet",
  "soon", "later", "recently", "formerly", "suddenly", "finally", "eventually",
  "gradually", "slowly", "quickly", "rapidly" ])

// Then check for negation-intensifier-adjective patterns
const negationIntensifierPatterns = [
  /(not|never|no) (very|extremely|really) (good|great|bad|terrible|awful)/gi,
  /(not|never|no) (too|that|particularly) (good|great|bad|terrible|awful)/gi
];

// Context processing parameters
const CONTEXT_WINDOW = 4;
const SARCASTIC_THRESHOLD = 0.35;