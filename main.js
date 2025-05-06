// Track character count
document.getElementById('textInput').addEventListener('input', function() {
  const charCount = this.value.length;
  document.getElementById('charCount').textContent = `${charCount} character${charCount !== 1 ? 's' : ''}`;
});

function tokenize(text) {
  // Match sequences of word chars, %, ., / that are:
  // 1. At start of string followed by whitespace/punctuation
  // 2. Between whitespace
  // 3. Before end of string
  return text.match(/(?:^|\s)([a-zA-Z0-9'%./]+)(?=\s|$|[.,;:!?])/g)?.map(m => m.trim()) || [];
}

function stem(word) {
  // Skip stemming if the word contains % (e.g., "50%")
  if (word.includes('%')) return word.toLowerCase();
  
  // Skip stemming if it's a number, fraction, or decimal
  if (word.match(/^[\d./]+$/)) return word;
  
  // Default stemming for regular words
  return word.toLowerCase().replace(/\b(ing|ly|ed|ious|ies|s|'s|')$/g, "");
}

function detectPhrases(text) {
  const lowerText = text.toLowerCase().replace(/[^\w\s]/g, '');
  const detectedPhrases = [];
  
  // First check for multi-word idiomatic phrases
  for (const [phrase, score] of Object.entries(idiomaticPhrases)) {
    const cleanPhrase = phrase.toLowerCase().replace(/[^\w\s]/g, '');
    if (lowerText.includes(cleanPhrase)) {
      detectedPhrases.push({
        phrase: phrase,
        score: score,
        start: lowerText.indexOf(cleanPhrase),
        end: lowerText.indexOf(cleanPhrase) + cleanPhrase.length,
        type: 'idiom'
      });
    }
  }
  
  negationIntensifierPatterns.forEach(pattern => {
    const matches = [...text.matchAll(pattern)];
    matches.forEach(match => {
      const fullPhrase = match[0];
      const adjective = match[3].toLowerCase();
      let score = 0;
      
      // Calculate combined score based on pattern
      if (sentimentLexicon[adjective]) {
        const baseScore = sentimentLexicon[adjective];
        // "not very good" should be less negative than "not good"
        score = -baseScore * 0.7; // Reduced negation effect
        
        detectedPhrases.push({
          phrase: fullPhrase,
          score: score,
          start: match.index,
          end: match.index + fullPhrase.length,
          type: 'chain'
        });
      }
    });
  });
  
  return detectedPhrases;
}

function highlightPhrases(text, phrases) {
  const tokens = tokenize(text);
  let highlights = new Array(tokens.length).fill(null);
  
  // Sort phrases by length (longest first) to handle overlapping phrases correctly
  const sortedPhrases = [...phrases].sort((a, b) => 
    b.phrase.length - a.phrase.length
  );
  
  sortedPhrases.forEach(phraseInfo => {
    const phraseWords = tokenize(phraseInfo.phrase);
    const textLower = text.toLowerCase();
    const phraseLower = phraseInfo.phrase.toLowerCase();
    
    // Find all occurrences of the phrase
    let startPos = 0;
    let phrasePos;
    
    while ((phrasePos = textLower.indexOf(phraseLower, startPos)) !== -1) {
      // Ensure we're at word boundaries
      const beforeChar = phrasePos > 0 ? textLower[phrasePos - 1] : ' ';
      const afterChar = phrasePos + phraseLower.length < textLower.length ? 
                       textLower[phrasePos + phraseLower.length] : ' ';
                       
      const isAtWordBoundary = !/\w/.test(beforeChar) && !/\w/.test(afterChar);
      
      if (isAtWordBoundary) {
        // Find which tokens are part of this phrase
        let currentPos = 0;
        for (let i = 0; i < tokens.length; i++) {
          const tokenPos = text.indexOf(tokens[i], currentPos);
          
          // Check if token is within phrase boundaries
          if (tokenPos >= phrasePos && tokenPos < phrasePos + phraseLower.length) {
            highlights[i] = { 
              type: phraseInfo.type === 'idiom' ? 'phrase' : 'chain',
              score: phraseInfo.score,
              phraseId: phraseInfo.phrase // Add phrase ID to connect highlights
            };
            currentPos = tokenPos + tokens[i].length;
          } else if (tokenPos > phrasePos + phraseLower.length) {
            // Optimization: stop checking once we're past the phrase
            break;
          } else {
            currentPos = tokenPos + tokens[i].length;
          }
        }
      }
      
      startPos = phrasePos + 1;
    }
  });
  
  return highlights;
}

function detectSarcasm(text) {
  const positiveWords = (text.match(/\b(good|great|excellent|wonderful|perfect|amazing|fantastic)\b/gi) || []).length;
  const negativeIndicators = (text.match(/\b(but|however|although|not|never|no)\b/gi) || []).length;
  const punctuationPattern = /(!|\?{2,})/g;
  const excessivePunctuation = (text.match(punctuationPattern) || []).length;
  
  // Check for emoji contradictions
  const positiveEmojis = (text.match(/😊|😄|👍|❤️|😁|🙂|😍/g) || []).length;
  const negativeContext = (text.match(/\b(terrible|awful|horrible|bad|worst)\b/gi) || []).length;
  
  // Check for dramatic capitalization patterns
  const dramaticCapitalization = /\b[a-z]+[A-Z][a-z]*\b/.test(text) || 
                                /\b[A-Z]{3,}\b/.test(text);
  
  // Check for quotes that might indicate sarcasm
  const quotedPositives = (text.match(/"(good|great|excellent|wonderful|perfect|amazing)"/gi) || []).length;
  
  const existingScore = 
    (sarcasmPatterns.some(pattern => pattern.test(text)) ? 0.5 : 0) +
    (positiveWords >= 2 && negativeIndicators >= 1 ? 0.3 : 0) +
    (positiveWords >= 3 && excessivePunctuation >= 2 ? 0.3 : 0) +
    (positiveEmojis > 0 && negativeContext > 0 ? 0.4 : 0) +
    (dramaticCapitalization ? 0.3 : 0) +
    (quotedPositives > 0 ? 0.3 : 0);
  
  const features = {
    // Contrast between positive/negative words
    sentimentContrast: calculateSentimentContrast(text),
    
    // Presence of hyperbole markers
    hyperbole: (text.match(/\b(absolutely|completely|totally|literally|definitely)\b/gi) || []).length,
    
    // Mixed case patterns (e.g., "sUuUuRe")
    mixedCase: (text.match(/\b[a-z]+[A-Z][a-z]+[A-Z][a-z]+\b/g) || []).length,
    
    // Ellipsis usage
    ellipsis: (text.match(/\.{3,}/g) || []).length,
    
    // Quoted text - often indicates sarcastic tone
    quotedText: (text.match(/["'].*?["']/g) || []).length
  };
  
  // Weight features and combine scores
  const combinedScore = existingScore * 0.6 + 
                        features.sentimentContrast * 0.15 +
                        Math.min(features.hyperbole * 0.05, 0.1) +
                        Math.min(features.mixedCase * 0.1, 0.1) +
                        Math.min(features.ellipsis * 0.05, 0.1) +
                        Math.min(features.quotedText * 0.05, 0.1);
  
  return {
    detected: combinedScore > 0.6,
    confidence: Math.min(combinedScore, 1.0),
    features: features // Return features for explanation
  };
}

function calculateSentimentContrast(text) {
  const tokens = tokenize(text);
  let positiveTokens = 0;
  let negativeTokens = 0;
  
  tokens.forEach(token => {
    const stemmed = stem(token);
    if (sentimentLexicon[stemmed] > 0) positiveTokens++;
    if (sentimentLexicon[stemmed] < 0) negativeTokens++;
  });
  
  // Higher contrast = higher potential for sarcasm
  return (positiveTokens > 0 && negativeTokens > 0) ? 
    Math.min(positiveTokens, negativeTokens) / Math.max(positiveTokens, negativeTokens) : 0;
}

const numberModifierWords = new Set([
  "half", "quarter", "third", "twice", "once", "thrice",
  "double", "triple", "single", "one", "two", "three",
  "four", "five", "six", "seven", "eight", "nine", "ten",
]);

function detectNumberModifiers(text, currentIndex, tokens) {
  console.log(text, currentIndex, tokens);
  const contextWindow = CONTEXT_WINDOW;

  const verbalFractions = {
    "half": 0.5,
    "a half": 0.5,
    "quarter": 0.25,
    "a quarter": 0.25,
    "one third": 1 / 3,
    "two thirds": 2 / 3,
    "three quarters": 3 / 4,
    "twice": 2,
    "once": 1,
    "thrice": 3
  };

  function matchNumberPattern(token) {
    token = token.trim();
    let match;
  
    // Handle percentage patterns (50% or 50 percent)
    if ((match = token.match(/^(\d+)%$/))) {
      return { value: parseInt(match[1]) / 100, token };
    } 
    else if ((match = token.match(/^(\d+)\s*percent$/i))) {
      return { value: parseInt(match[1]) / 100, token };
    } 
    // Handle fractions (1/2 or 3/4)
    else if ((match = token.match(/^(\d+)\/(\d+)$/))) {
      return { value: parseInt(match[1]) / parseInt(match[2]), token };
    }
    // Handle decimals (0.5 or 1.25)
    else if ((match = token.match(/^\d+\.\d+$/))) {
      return { value: parseFloat(token), token };
    }
    // Handle multipliers (2x or 3 times)
    else if ((match = token.match(/^(\d+)x$/i))) {
      return { value: parseInt(match[1]), token };
    }
    else if ((match = token.match(/^(\d+)\s*times$/i))) {
      return { value: parseInt(match[1]), token };
    }
    // Handle plain integers
    else if ((match = token.match(/^\d+$/))) {
      return { value: parseInt(token), token };
    }
  
    return null;
  }

  function matchVerbalModifier(start, end, direction) {
    const phrase = tokens.slice(start, end).join(" ").toLowerCase();
    if (verbalFractions[phrase]) {
      return {
        value: verbalFractions[phrase],
        token: phrase,
        position: start,
        direction
      };
    }
    return null;
  }

  // Check previous tokens
  const prevStart = Math.max(0, currentIndex - contextWindow);
  for (let i = currentIndex - 1; i >= prevStart; i--) {
    const token = tokens[i];
    if (numberModifierWords.has(token.toLowerCase())) continue;

    // Try matching phrase-based modifiers: e.g., "half as", "twice as"
    const phraseMod = matchVerbalModifier(i, currentIndex, "before");
    if (phraseMod) return phraseMod;

    const result = matchNumberPattern(token);
    if (result) {
      return { ...result, position: i, direction: 'before' };
    }
  }

  // Check next tokens
  const nextEnd = Math.min(tokens.length, currentIndex + contextWindow + 1);
  for (let i = currentIndex + 1; i < nextEnd; i++) {
    const token = tokens[i];

    const result = matchNumberPattern(token);
    if (result) {
      return { ...result, position: i, direction: 'after' };
    }

    // Check for forward phrases like "as good as", "three times as"
    const phraseMod = matchVerbalModifier(currentIndex + 1, i + 1, "after");
    if (phraseMod) return phraseMod;
  }

  return null;
}

// Improved analyze function with better modifiers handling
function analyze(text) {
  if (!text.trim()) return {
    score: 0,
    sentiment: "Neutral 😐",
    sarcasm: false,
    highlights: [],
    explanations: ["No text provided for analysis"]
  };

  const tokens = tokenize(text);
  let highlights = new Array(tokens.length).fill(null);
  let sentiment = 0;
  let modifierStack = [];
  const detectedPhrases = detectPhrases(text);
  const sarcasmDetected = detectSarcasm(text);
  let explanations = [];
  let positiveCount = 0;
  let negativeCount = 0;
  
  // Cache stemmed tokens to avoid redundant processing
  const stemCache = new Map();
  const getStemmedToken = (token) => {
    if (!stemCache.has(token)) {
      stemCache.set(token, stem(token));
    }
    return stemCache.get(token);
  };

  // Process detected phrases first
  if (detectedPhrases.length > 0) {
    const phraseHighlights = highlightPhrases(text, detectedPhrases);
    detectedPhrases.forEach(phrase => {
      sentiment += phrase.score;
      explanations.push(`Found ${phrase.type === 'idiom' ? 'idiomatic phrase' : 'chained expression'} <strong>"${phrase.phrase}"</strong> with score: ${phrase.score > 0 ? '+' : ''}${phrase.score.toFixed(2)}`);
      
      if (phrase.score > 0) positiveCount++;
      else if (phrase.score < 0) negativeCount++;
    });
    
    // More efficiently merge highlights
    highlights = highlights.map((h, i) => phraseHighlights[i] || h);
  }

  // Process individual tokens with improved chaining
  for (let i = 0; i < tokens.length; i++) {
    const rawToken = tokens[i];
    const token = getStemmedToken(rawToken);
    
    // Skip if this token is part of a phrase we already processed
    if (highlights[i] && (highlights[i].type === 'phrase' || highlights[i].type === 'chain')) {
      continue;
    }
    
    if (stopWords.has(token)) {
      if (['but', 'however', 'although', 'yet'].includes(token.toLowerCase())) {
        highlights[i] = { type: 'negation' };
        explanations.push(`Found contrast word: <strong>"${rawToken}"</strong> - may indicate sentiment shift`);
      }
      continue;
    }

    // Handle number modifiers before processing sentiment words
    let numberModifier = null;
    if (sentimentLexicon[token] !== undefined) {
      numberModifier = detectNumberModifiers(text, i, tokens);
    }

    // Handle negations with extended context
    if (negations.has(token)) {
      highlights[i] = { type: 'negation' };
      explanations.push(`Found negation word: <strong>"${rawToken}"</strong> - will invert sentiment of following words within ${CONTEXT_WINDOW} tokens`);
      modifierStack.push({
        type: 'negation',
        value: -1,
        startPos: i, // Track starting position
        endPos: i + CONTEXT_WINDOW, // Track absolute end position
        word: rawToken
      });
      continue;
    }

    // Handle intensifiers with chaining
    if (intensifiers[token]) {
      modifierStack.push({
        type: 'intensifier',
        value: intensifiers[token],
        startPos: i, // Track starting position
        endPos: i + CONTEXT_WINDOW, // Track absolute end position
        word: rawToken
      });
      highlights[i] = { type: 'intensifier' };
      explanations.push(`Found intensifier: <strong>"${rawToken}"</strong> (will multiply sentiment scores within next ${CONTEXT_WINDOW} tokens`);
      continue;
    }

    // Clean up expired modifiers before processing current token
    modifierStack = modifierStack.filter(m => i < m.endPos);

    if (sentimentLexicon[token] !== undefined) {
      let wordSentiment = sentimentLexicon[token];
      let explanation = `<strong>"${rawToken}"</strong> base score: ${wordSentiment > 0 ? '+' : ''}${wordSentiment.toFixed(2)}`;
      
      let modifierEffect = 1;
      let modifierExplanation = '';
      
      // Apply number modifier if found
      if (numberModifier) {
        const multiplier = numberModifier.value;
        wordSentiment *= multiplier;
        explanation += ` → modified by number <strong>"${numberModifier.token}"</strong> (x${multiplier.toFixed(2)}) to ${wordSentiment > 0 ? '+' : ''}${wordSentiment.toFixed(2)}`;
        
        // Highlight the number that modified this word
        highlights[numberModifier.position] = { 
          type: 'number-modifier',
          value: multiplier,
          direction: numberModifier.direction
        };
        
        // If the number comes after, we should mark this token as being modified
        if (numberModifier.direction === 'after') {
          highlights[i] = highlights[i] || {};
          highlights[i].modifiedBy = numberModifier.position;
        }
      }
      
      // Apply modifiers from the stack
      if (modifierStack.length > 0) {
        modifierStack.forEach(mod => {
          modifierEffect *= mod.value;
          modifierExplanation += ` → modified by <strong>${mod.word}</strong> (x${mod.value.toFixed(2)})`;
        });
        
        wordSentiment *= modifierEffect;
        explanation += modifierExplanation + ` to ${wordSentiment > 0 ? '+' : ''}${wordSentiment.toFixed(2)}`;
      }

      // Determine highlight type based on final sentiment
      const type = wordSentiment > 0 ? 'positive' : 'negative';
      if (!highlights[i]) highlights[i] = { 
        type, 
        score: wordSentiment  
      };

      sentiment += wordSentiment;
      
      if (wordSentiment > 0) positiveCount++;
      else if (wordSentiment < 0) negativeCount++;
      
      explanations.push(explanation + ` → added to total score`);
    }
  }

  // Detect sarcasm based on multiple factors
  let sarcasmConfidence = 0;
  if (sarcasmDetected) {
    sarcasmConfidence += Math.min(0.2 * positiveCount, 0.6);
    sarcasmConfidence += Math.min(0.1 * modifierStack.filter(m => m.type === 'negation').length, 0.3);
    const excessivePunctuation = (text.match(/(!|\?{2,})/g) || []).length;
    sarcasmConfidence += Math.min(0.05 * excessivePunctuation, 0.2);
    sarcasmConfidence = Math.min(sarcasmConfidence, 1.0);
    
    const originalScore = sentiment;
    sentiment *= (1 - sarcasmConfidence * 0.65);
    explanations.push(`Sarcasm detected with ${Math.round(sarcasmConfidence * 100)}% confidence! Score adjusted from ${originalScore > 0 ? '+' : ''}${originalScore.toFixed(2)} to ${sentiment > 0 ? '+' : ''}${sentiment.toFixed(2)}`);
  }

  return {
    score: sentiment,
    sentiment: getSentimentLabel(sentiment),
    sarcasm: sarcasmDetected.detected,
    sarcasmConfidence: sarcasmConfidence,
    highlights: highlights,
    explanations: explanations,
    positiveCount: positiveCount,
    negativeCount: negativeCount
  };
}

function highlightText(originalText, highlights) {
  const tokens = tokenize(originalText);
  
  // Group tokens that belong to the same phrase using a more efficient Map
  const phraseGroups = new Map();
  highlights.forEach((highlight, index) => {
    if (highlight && highlight.phraseId) {
      if (!phraseGroups.has(highlight.phraseId)) {
        phraseGroups.set(highlight.phraseId, {
          indices: [index],
          type: highlight.type,
          score: highlight.score
        });
      } else {
        phraseGroups.get(highlight.phraseId).indices.push(index);
      }
    }
  });
  
  // Pre-compute token positions for efficiency
  const tokenPositions = [];
  let pos = 0;
  for (const token of tokens) {
    const tokenPos = originalText.indexOf(token, pos);
    tokenPositions.push(tokenPos);
    pos = tokenPos + token.length;
  }
  
  // Build output using document fragment approach (conceptually)
  let output = [];
  let processedIndices = new Set();
  
  // First handle phrases for better cohesion
  for (const [phraseId, group] of phraseGroups.entries()) {
    // Sort indices to ensure we process them in order
    const sortedIndices = [...group.indices].sort((a, b) => a - b);
    const firstIndex = sortedIndices[0];
    const lastIndex = sortedIndices[sortedIndices.length - 1];
    
    // Ensure sequential indices (phrase components should be adjacent)
    let isSequential = true;
    for (let i = 1; i < sortedIndices.length; i++) {
      if (sortedIndices[i] !== sortedIndices[i-1] + 1) {
        isSequential = false;
        break;
      }
    }
    
    if (isSequential) {
      // Extract phrase text directly
      const startPos = tokenPositions[firstIndex];
      const endPos = tokenPositions[lastIndex] + tokens[lastIndex].length;
      const phraseText = originalText.substring(startPos, endPos);
      
      const highlight = highlights[firstIndex];
      const highlightClass = highlight.type === 'chain' ? 
        (highlight.score > 0 ? 'positive' : 'negative') : 
        highlight.type;
      
      // Mark as processed
      sortedIndices.forEach(idx => processedIndices.add(idx));
      
      // Add span for the entire phrase
      output.push({
        pos: startPos,
        text: `<span class="highlight ${highlightClass}" title="${getHighlightTooltip(highlight.type)}">${phraseText}</span>`
      });
    }
  }
  
  // Handle individual tokens
  for (let i = 0; i < tokens.length; i++) {
    if (processedIndices.has(i)) continue;
    
    const token = tokens[i];
    const tokenPos = tokenPositions[i];
    
    if (highlights[i]) {
      const highlight = highlights[i];
      const highlightClass = highlight.type === 'chain' ? 
        (highlight.score > 0 ? 'positive' : 'negative') : 
        highlight.type;
      
      output.push({
        pos: tokenPos,
        text: `<span class="highlight ${highlightClass}" title="${getHighlightTooltip(highlight.type)}">${token}</span>`
      });
    } else {
      output.push({
        pos: tokenPos,
        text: token
      });
    }
  }
  
  // Add remaining text
  let lastPos = 0;
  let finalOutput = [];
  
  // Sort output pieces by position
  output.sort((a, b) => a.pos - b.pos);
  
  for (const piece of output) {
    // Add text between last piece and current piece
    if (piece.pos > lastPos) {
      finalOutput.push(originalText.substring(lastPos, piece.pos));
    }
    finalOutput.push(piece.text);
    lastPos = piece.pos + piece.text.replace(/<[^>]*>/g, '').length;
  }
  
  // Add any remaining text
  if (lastPos < originalText.length) {
    finalOutput.push(originalText.substring(lastPos));
  }
  
  return finalOutput.join('');
}

// Update getHighlightTooltip to include number modifiers
function getHighlightTooltip(type) {
  const tooltips = {
    'positive': 'Positive word - contributes to positive sentiment',
    'negative': 'Negative word - contributes to negative sentiment',
    'negation': 'Negation word - inverts sentiment of following words',
    'intensifier': 'Intensifier - strengthens sentiment of following words',
    'sarcasm': 'Sarcasm indicator - may reduce sentiment confidence',
    'phrase': 'Idiomatic phrase - carries special sentiment meaning',
    'chain': 'Chained expression - combination of modifiers and sentiment words',
    'number-modifier': 'Number modifier - scales the sentiment value'
  };
  return tooltips[type] || 'Highlighted element';
}

function getSentimentLabel(score) {
  if (score >= 10) return "Extremely Positive 💖🌟";
  if (score >= 7) return "Very Positive 😊✨";
  if (score >= 4) return "Strongly Positive 😊👍";
  if (score >= 2) return "Positive 🙂";
  if (score >= 1) return "Mildly Positive 🙂";
  if (score >= 0.5) return "Slightly Positive 🙂";
  if (score <= -10) return "Extremely Negative 💢🔥";
  if (score <= -7) return "Very Negative 😠👎";
  if (score <= -4) return "Strongly Negative 😠";
  if (score <= -2) return "Negative 🙁";
  if (score <= -1) return "Mildly Negative 😐";
  if (score < -0.5) return "Slightly Negative 😐";
  return "Neutral 😐";
}

function getSentimentColor(score) {
  if (score >= 8) return "var(--positive-strong)";
  if (score >= 1) return "var(--positive)";
  if (score <= -8) return "var(--negative-strong)";
  if (score < -1) return "var(--negative)";
  return "var(--neutral)";
}

function highlightText(originalText, highlights) {
  const tokens = tokenize(originalText);
  
  // Group tokens that belong to the same phrase using a more efficient Map
  const phraseGroups = new Map();
  highlights.forEach((highlight, index) => {
    if (highlight && highlight.phraseId) {
      if (!phraseGroups.has(highlight.phraseId)) {
        phraseGroups.set(highlight.phraseId, {
          indices: [index],
          type: highlight.type,
          score: highlight.score
        });
      } else {
        phraseGroups.get(highlight.phraseId).indices.push(index);
      }
    }
  });
  
  // Pre-compute token positions for efficiency
  const tokenPositions = [];
  let pos = 0;
  for (const token of tokens) {
    const tokenPos = originalText.indexOf(token, pos);
    tokenPositions.push(tokenPos);
    pos = tokenPos + token.length;
  }
  
  // Build output using document fragment approach (conceptually)
  let output = [];
  let processedIndices = new Set();
  
  // First handle phrases for better cohesion
  for (const [phraseId, group] of phraseGroups.entries()) {
    // Sort indices to ensure we process them in order
    const sortedIndices = [...group.indices].sort((a, b) => a - b);
    const firstIndex = sortedIndices[0];
    const lastIndex = sortedIndices[sortedIndices.length - 1];
    
    // Ensure sequential indices (phrase components should be adjacent)
    let isSequential = true;
    for (let i = 1; i < sortedIndices.length; i++) {
      if (sortedIndices[i] !== sortedIndices[i-1] + 1) {
        isSequential = false;
        break;
      }
    }
    
    if (isSequential) {
      // Extract phrase text directly
      const startPos = tokenPositions[firstIndex];
      const endPos = tokenPositions[lastIndex] + tokens[lastIndex].length;
      const phraseText = originalText.substring(startPos, endPos);
      
      const highlight = highlights[firstIndex];
      const highlightClass = highlight.type === 'chain' ? 
        (highlight.score > 0 ? 'positive' : 'negative') : 
        highlight.type;
      
      // Mark as processed
      sortedIndices.forEach(idx => processedIndices.add(idx));
      
      // Add span for the entire phrase
      output.push({
        pos: startPos,
        text: `<span class="highlight ${highlightClass}" title="${getHighlightTooltip(highlight.type)}">${phraseText}</span>`
      });
    }
  }
  
  // Handle individual tokens
  for (let i = 0; i < tokens.length; i++) {
    if (processedIndices.has(i)) continue;
    
    const token = tokens[i];
    const tokenPos = tokenPositions[i];
    
    if (highlights[i]) {
      const highlight = highlights[i];
      const highlightClass = highlight.type === 'chain' ? 
        (highlight.score > 0 ? 'positive' : 'negative') : 
        highlight.type;
      
      output.push({
        pos: tokenPos,
        text: `<span class="highlight ${highlightClass}" title="${getHighlightTooltip(highlight.type)}">${token}</span>`
      });
    } else {
      output.push({
        pos: tokenPos,
        text: token
      });
    }
  }
  
  // Add remaining text
  let lastPos = 0;
  let finalOutput = [];
  
  // Sort output pieces by position
  output.sort((a, b) => a.pos - b.pos);
  
  for (const piece of output) {
    // Add text between last piece and current piece
    if (piece.pos > lastPos) {
      finalOutput.push(originalText.substring(lastPos, piece.pos));
    }
    finalOutput.push(piece.text);
    lastPos = piece.pos + piece.text.replace(/<[^>]*>/g, '').length;
  }
  
  // Add any remaining text
  if (lastPos < originalText.length) {
    finalOutput.push(originalText.substring(lastPos));
  }
  
  return finalOutput.join('');
}

// Optimized runAnalysis function with performance improvements
function runAnalysis() {
  const inputText = document.getElementById('textInput').value;
  
  // Add debouncing or throttling for better performance on rapid input
  clearTimeout(window.analysisTimer);
  window.analysisTimer = setTimeout(() => {
    // Show loading state
    document.getElementById('output').innerHTML = '<div class="loading">Analyzing...</div>';
    
    // Use requestAnimationFrame to avoid blocking the UI
    requestAnimationFrame(() => {
      const result = analyze(inputText);
      const highlighted = highlightText(inputText, result.highlights);
      
      // Update UI with results
      updateUI(result, highlighted);
    });
  }, 300); // 300ms debounce time
}

function updateUI(result, highlighted) {
  // Ensure the marker stays within the bar (clamp to 0-100%)
  const markerPosition = Math.min(Math.max(((result.score + 10) / 20) * 100, 0), 100);
  
  let explanationHTML = '';
  if (result.explanations.length > 0) {
    explanationHTML = `
      <div class="explanation">
        <div class="explanation-title">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Analysis Breakdown
        </div>
        <ul class="explanation-list">
          ${result.explanations.map(exp => `<li class="explanation-item">${exp}</li>`).join('')}
          <li class="explanation-item">
            Final sentiment score: <strong>${result.score > 0 ? '+' : ''}${result.score.toFixed(2)}</strong>
            (${result.positiveCount} positive, ${result.negativeCount} negative elements)
          </li>
          ${result.sarcasm ? `
          <li class="explanation-item">
            Sarcasm detected with <strong>${Math.round(result.sarcasmConfidence * 100)}% confidence</strong>, 
            reducing score impact by ${Math.round(result.sarcasmConfidence * 65)}%
          </li>` : ''}
        </ul>
      </div>
    `;
  }

  document.getElementById('output').innerHTML = `
    <div class="sentiment-header">
      <div class="sentiment-score" style="color: ${getSentimentColor(result.score)}">
        ${result.sentiment}
      </div>
      <div>
        Score: <strong>${result.score > 0 ? '+' : ''}${result.score.toFixed(2)}</strong>
      </div>
    </div>
    
    <div class="score-bar">
      <div class="score-marker" style="left: ${markerPosition}%"></div>
    </div>
    <div class="score-labels">
      <span>-10 (Negative)</span>
      <span>0 (Neutral)</span>
      <span>+10 (Positive)</span>
    </div>
    
    <div class="details">
      <div class="details-title">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Text Analysis
      </div>
      <div><strong>Sarcasm Detected:</strong> ${result.sarcasm ? 'Yes 😏' : 'No 🙃'}</div>
      <div><strong>Positive Elements:</strong> ${result.positiveCount}</div>
      <div><strong>Negative Elements:</strong> ${result.negativeCount}</div>
    </div>
    
    <div class="details" style="margin-top: 16px;">
      <div class="details-title">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Highlighted Text
      </div>
      <div class="highlighted-text">${highlighted}</div>
    </div>
    
    ${explanationHTML}
  `;
}