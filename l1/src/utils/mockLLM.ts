// Mock LLM API for generating summaries
export const generateSummary = async (transcript: string): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simple mock summary generation based on transcript length and content
  const words = transcript.trim().split(' ');
  const wordCount = words.length;
  
  if (wordCount < 10) {
    return `Brief note: ${words.slice(0, 5).join(' ')}...`;
  }
  
  // Extract key phrases (simplified mock logic)
  const keyPhrases = [];
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  
  for (let i = 0; i < words.length - 1; i++) {
    const word = words[i].toLowerCase();
    if (!commonWords.includes(word) && word.length > 3) {
      keyPhrases.push(words[i]);
    }
    if (keyPhrases.length >= 3) break;
  }
  
  const summary = `Key topics: ${keyPhrases.join(', ')}. This note contains ${wordCount} words discussing ${keyPhrases[0] || 'various topics'}.`;
  
  return summary;
};