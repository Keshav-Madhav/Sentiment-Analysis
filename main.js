// Track character count
document.getElementById('textInput').addEventListener('input', function() {
  const charCount = this.value.length;
  document.getElementById('charCount').textContent = `${charCount} character${charCount !== 1 ? 's' : ''}`;
});

function tokenize(text) {
  // Improved tokenization to match only complete words
  // This ensures we don't match parts of words
  return text.match(/\b[\w']+\b/g) || [];
}

function stem(word) {
  // Only apply stemming to complete words, not parts of words
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
  
  phrases.forEach(phraseInfo => {
    const phraseWords = tokenize(phraseInfo.phrase);
    const textLower = text.toLowerCase();
    const phraseLower = phraseInfo.phrase.toLowerCase();
    const startPos = textLower.indexOf(phraseLower);
    
    if (startPos >= 0) {
      // Find which tokens are part of this phrase
      let currentPos = 0;
      for (let i = 0; i < tokens.length; i++) {
        const tokenPos = text.indexOf(tokens[i], currentPos);
        if (tokenPos >= startPos && tokenPos < startPos + phraseLower.length) {
          highlights[i] = { 
            type: phraseInfo.type === 'idiom' ? 'phrase' : 'chain',
            score: phraseInfo.score,
            phraseId: phraseInfo.phrase // Add phrase ID to connect highlights
          };
          currentPos = tokenPos + tokens[i].length;
        }
      }
    }
  });
  
  return highlights;
}

function detectSarcasm(text) {
  const positiveWords = (text.match(/\b(good|great|excellent|wonderful|perfect|amazing|fantastic)\b/gi) || []).length;
  const negativeIndicators = (text.match(/\b(but|however|although|not|never|no)\b/gi) || []).length;
  const punctuationPattern = /(!|\?{2,})/g;
  const excessivePunctuation = (text.match(punctuationPattern) || []).length;
  
  return sarcasmPatterns.some(pattern => pattern.test(text)) || 
         (positiveWords >= 2 && negativeIndicators >= 1) ||
         (positiveWords >= 3 && excessivePunctuation >= 2);
}

function analyze(text) {
  // Reference CONTEXT_WINDOW from config
  const CONTEXT_WINDOW = 3; // Words after modifier that are affected
  
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
  let negationContext = 0;
  let currentIntensity = 1;
  const detectedPhrases = detectPhrases(text);
  const sarcasmDetected = detectSarcasm(text);
  let explanations = [];
  let positiveCount = 0;
  let negativeCount = 0;

  // Process detected phrases first
  if (detectedPhrases.length > 0) {
    const phraseHighlights = highlightPhrases(text, detectedPhrases);
    detectedPhrases.forEach(phrase => {
      sentiment += phrase.score;
      explanations.push(`Found ${phrase.type === 'idiom' ? 'idiomatic phrase' : 'chained expression'} <strong>"${phrase.phrase}"</strong> with score: ${phrase.score > 0 ? '+' : ''}${phrase.score.toFixed(2)}`);
      
      if (phrase.score > 0) positiveCount++;
      else negativeCount++;
    });
    highlights = phraseHighlights.map((h, i) => h || highlights[i]);
  }

  // Process individual tokens with improved chaining
  for (let i = 0; i < tokens.length; i++) {
    const rawToken = tokens[i];
    const token = stem(rawToken);
    
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

    // Handle negations with extended context
    if (negations.has(token)) {
      negationContext = CONTEXT_WINDOW + 1;
      highlights[i] = { type: 'negation' };
      explanations.push(`Found negation word: <strong>"${rawToken}"</strong> - will invert sentiment of following ${CONTEXT_WINDOW} words`);
      modifierStack.push({
        type: 'negation',
        value: -1,
        duration: CONTEXT_WINDOW,
        word: rawToken
      });
      continue;
    }

    // Handle intensifiers with chaining
    if (intensifiers[token]) {
      modifierStack.push({
        type: 'intensifier',
        value: intensifiers[token],
        duration: CONTEXT_WINDOW,
        word: rawToken
      });
      highlights[i] = { type: 'intensifier' };
      explanations.push(`Found intensifier: <strong>"${rawToken}"</strong> (will multiply next ${CONTEXT_WINDOW} sentiment scores by ${intensifiers[token].toFixed(2)})`);
      continue;
    }

    // Process sentiment words with modifier chaining - only exact word matches
    if (sentimentLexicon[token] !== undefined) {
      let wordSentiment = sentimentLexicon[token];
      let explanation = `<strong>"${rawToken}"</strong> base score: ${wordSentiment > 0 ? '+' : ''}${wordSentiment.toFixed(2)}`;
      
      // Apply modifier stack only if within context window
      if (modifierStack.length > 0) {
        modifierStack.forEach(mod => {
          const prevScore = wordSentiment;
          wordSentiment *= mod.value;
          explanation += ` → modified by <strong>${mod.word}</strong> (x${mod.value.toFixed(2)}) to ${wordSentiment > 0 ? '+' : ''}${wordSentiment.toFixed(2)}`;
          mod.duration--;
        });

        // Clean expired modifiers (duration reached 0)
        modifierStack = modifierStack.filter(m => m.duration > 0);
      }

      // Determine highlight type based on final sentiment
      const type = wordSentiment > 0 ? 'positive' : 'negative';
      if (!highlights[i]) highlights[i] = { 
        type, 
        score: wordSentiment  
      };

      sentiment += wordSentiment;
      
      if (wordSentiment > 0) positiveCount++;
      else negativeCount++;
      
      explanations.push(explanation + ` → added to total score`);
    }
    
    // Reduce context for non-sentiment words
    modifierStack.forEach(m => m.duration--);
    modifierStack = modifierStack.filter(m => m.duration > 0);
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
    sarcasm: sarcasmDetected,
    sarcasmConfidence: sarcasmConfidence,
    highlights: highlights,
    explanations: explanations,
    positiveCount: positiveCount,
    negativeCount: negativeCount
  };
}

// ... rest of the code remains the same ...

function highlightText(originalText, highlights) {
  const tokens = tokenize(originalText);
  
  // Group tokens that belong to the same phrase
  const phraseGroups = {};
  highlights.forEach((highlight, index) => {
    if (highlight && highlight.phraseId) {
      if (!phraseGroups[highlight.phraseId]) {
        phraseGroups[highlight.phraseId] = {
          indices: [index],
          type: highlight.type,
          score: highlight.score
        };
      } else {
        phraseGroups[highlight.phraseId].indices.push(index);
      }
    }
  });
  
  // Create a copy of the tokens array for output
  const parts = originalText.split(/(\b[\w']+\b|[^\w\s]+|\s+)/).filter(p => p);
  let output = [];
  let tokenIndex = 0;
  let inPhrase = false;
  let currentPhraseId = null;
  let currentPhraseType = null;
  let skipIndices = new Set();
  
  // Process parts to generate highlighted output
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    // Check if it's a word token
    if (/\b[\w']+\b/.test(part)) {
      // Skip if this token was already processed as part of a phrase
      if (skipIndices.has(tokenIndex)) {
        tokenIndex++;
        output.push(part); // Still add the part to output
        continue;
      }
      
      const highlight = highlights[tokenIndex];
      
      // Check if this token is part of a phrase
      if (highlight && highlight.phraseId) {
        // Start a new phrase span
        const phraseGroup = phraseGroups[highlight.phraseId];
        const highlightClass = highlight.type === 'chain' ? 
          (highlight.score > 0 ? 'positive' : 'negative') : 
          highlight.type;
        
        // Mark all tokens in this phrase as processed
        phraseGroup.indices.forEach(idx => skipIndices.add(idx));
        
        // Find all tokens in this phrase
        const phraseTokens = phraseGroup.indices.map(idx => tokens[idx]);
        const phraseRegex = new RegExp(`\\b${phraseTokens.join('\\b\\s*\\b')}\\b`, 'i');
        
        // Find the phrase in the original text
        const match = originalText.match(phraseRegex);
        if (match) {
          output.push(`<span class="highlight ${highlightClass}" title="${getHighlightTooltip(highlight.type)}">${match[0]}</span>`);
          
          // Skip tokens that are part of this phrase
          tokenIndex += phraseGroup.indices.length;
          
          // Skip parts that are part of this phrase
          let skipCount = phraseGroup.indices.length * 2 - 1; // Number of words + spaces
          i += skipCount - 1; // Adjust for the loop increment
          continue;
        }
      }
      
      // Handle individual token highlighting
      if (highlight) {
        const highlightClass = highlight.type === 'chain' ? 
          (highlights[tokenIndex].score > 0 ? 'positive' : 'negative') : 
          highlight.type;
        
        output.push(`<span class="highlight ${highlightClass}" title="${getHighlightTooltip(highlight.type)}">${part}</span>`);
      } else {
        output.push(part);
      }
      
      tokenIndex++;
    } else {
      // Non-word parts (spaces, punctuation) are preserved as is
      output.push(part);
    }
  }
  
  return output.join('');
}

function getHighlightTooltip(type) {
  const tooltips = {
    'positive': 'Positive word - contributes to positive sentiment',
    'negative': 'Negative word - contributes to negative sentiment',
    'negation': 'Negation word - inverts sentiment of following words',
    'intensifier': 'Intensifier - strengthens sentiment of following words',
    'sarcasm': 'Sarcasm indicator - may reduce sentiment confidence',
    'phrase': 'Idiomatic phrase - carries special sentiment meaning',
    'chain': 'Chained expression - combination of modifiers and sentiment words'
  };
  return tooltips[type] || 'Highlighted element';
}

function getSentimentLabel(score) {
  const absScore = Math.abs(score);
  if (score >= 4.5) return "Extremely Positive 💖🌟";
  if (score >= 3.5) return "Very Positive 😊✨";
  if (score >= 2.5) return "Strongly Positive 😊👍";
  if (score >= 1.5) return "Positive 🙂";
  if (score >= 0.8) return "Mildly Positive 🙂";
  if (score >= 0.3) return "Slightly Positive 🙂";
  if (score <= -4.5) return "Extremely Negative 💢🔥";
  if (score <= -3.5) return "Very Negative 😠👎";
  if (score <= -2.5) return "Strongly Negative 😠";
  if (score <= -1.5) return "Negative 🙁";
  if (score <= -0.8) return "Mildly Negative 😐";
  if (score < -0.3) return "Slightly Negative 😐";
  return "Neutral 😐";
}

function getSentimentColor(score) {
  if (score >= 3.5) return "var(--positive)";
  if (score >= 1.5) return "var(--positive)";
  if (score >= 0.3) return "var(--positive)";
  if (score <= -3.5) return "var(--negative)";
  if (score <= -1.5) return "var(--negative)";
  if (score < -0.3) return "var(--negative)";
  return "var(--neutral)";
}

function runAnalysis() {
  const inputText = document.getElementById('textInput').value;
  const result = analyze(inputText);
  const highlighted = highlightText(inputText, result.highlights);

  // Ensure the marker stays within the bar (clamp to 0-100%)
  const markerPosition = Math.min(Math.max(((result.score + 5) / 10) * 100, 0), 100);
  
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
      <span>-5 (Negative)</span>
      <span>0 (Neutral)</span>
      <span>+5 (Positive)</span>
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