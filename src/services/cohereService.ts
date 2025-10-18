// Cohere AI Service for intelligent chatbot responses

import type { ComparativeAnalysis } from './analysisService';

const COHERE_API_KEY = process.env.COHERE_API_KEY || '';
const COHERE_API_URL = 'https://api.cohere.com/v2/chat'; // Updated to v2 endpoint

export interface ChatMessage {
  role: 'USER' | 'CHATBOT';
  message: string;
}

export interface CohereResponse {
  text: string;
  conversationId?: string;
}

/**
 * Generate context from analysis data for the AI
 */
function generateAnalysisContext(analysisData: ComparativeAnalysis): string {
  let context = 'Research Analysis Data:\n\n';
  
  analysisData.results.forEach((result, idx) => {
    context += `Topic ${idx + 1}: ${result.topic}\n`;
    context += `- Total Publications: ${result.totalPublications.toLocaleString()}\n`;
    context += `- Average Citations: ${result.averageCitations.toFixed(1)}\n`;
    
    // Publication trends
    const trends = result.publicationTrends;
    if (trends.length > 0) {
      const firstYear = trends[0];
      const lastYear = trends[trends.length - 1];
      const growth = firstYear.count > 0 
        ? (((lastYear.count - firstYear.count) / firstYear.count) * 100).toFixed(1)
        : 0;
      context += `- Publication Growth (${firstYear.year}-${lastYear.year}): ${growth}%\n`;
      context += `- Yearly Publications: ${trends.map(t => `${t.year}:${t.count}`).join(', ')}\n`;
    }
    
    // Top institutions
    if (result.topInstitutions.length > 0) {
      context += `- Top Institutions: ${result.topInstitutions.slice(0, 3).map(i => i.name).join(', ')}\n`;
    }
    
    // Publication types
    if (result.publicationTypes.length > 0) {
      context += `- Publication Types: ${result.publicationTypes.slice(0, 3).map(p => `${p.type}(${p.count})`).join(', ')}\n`;
    }
    
    context += '\n';
  });
  
  // Combined institutions
  if (analysisData.combinedInstitutions.length > 0) {
    context += 'Top Research Institutions Overall:\n';
    analysisData.combinedInstitutions.slice(0, 5).forEach((inst, idx) => {
      context += `${idx + 1}. ${inst.name} - ${inst.percentage.toFixed(1)}%\n`;
    });
  }
  
  return context;
}

/**
 * Generate intelligent response using Cohere AI
 */
export async function generateChatResponse(
  userMessage: string,
  analysisData: ComparativeAnalysis | null,
  chatHistory: ChatMessage[] = []
): Promise<string> {
  if (!COHERE_API_KEY) {
    console.error('Cohere API key is missing');
    throw new Error('Cohere API key is not configured. Please add COHERE_API_KEY to .env.local');
  }

  console.log('Calling Cohere API with message:', userMessage);

  try {
    // Build the system prompt with analysis context
    let preamble = 'You are a helpful research assistant analyzing scientific publications. ';
    
    if (analysisData) {
      preamble += 'You have access to the following research data:\n\n';
      preamble += generateAnalysisContext(analysisData);
      preamble += '\nAnswer questions about this data accurately and concisely. ';
      preamble += 'Provide specific numbers and insights from the data. ';
      preamble += 'If asked about topics not in the data, politely say you can only answer about the analyzed topics.';
    } else {
      preamble += 'No analysis data is available yet. Ask the user to run an analysis first.';
    }

    // Prepare chat history in Cohere format
    const cohereHistory = chatHistory.map(msg => ({
      role: msg.role,
      message: msg.message
    }));

    // V2 API uses different format
    const messages: any[] = [
      ...cohereHistory.map(msg => ({
        role: msg.role.toLowerCase(),
        content: msg.message
      })),
      {
        role: 'user',
        content: userMessage
      }
    ];

    // Add system message if we have analysis data
    if (analysisData) {
      messages.unshift({
        role: 'system',
        content: preamble
      });
    }

    const requestBody = {
      model: 'command-r-08-2024', // V2 API model
      messages: messages,
      temperature: 0.3,
      max_tokens: 500,
    };

    console.log('Cohere v2 request body:', JSON.stringify(requestBody, null, 2));

    // Call Cohere API
    const response = await fetch(COHERE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Cohere response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cohere API error response:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      throw new Error(`Cohere API error (${response.status}): ${errorData.message || errorText}`);
    }

    const data = await response.json();
    console.log('Cohere response data:', data);
    
    // V2 API returns different structure
    return data.message?.content?.[0]?.text || data.text || 'I apologize, but I could not generate a response.';
  } catch (error) {
    console.error('Error calling Cohere API:', error);
    throw error;
  }
}

/**
 * Generate a summary of the analysis
 */
export async function generateAnalysisSummary(
  analysisData: ComparativeAnalysis
): Promise<string> {
  const context = generateAnalysisContext(analysisData);
  
  const summaryPrompt = `Based on the following research analysis data, provide a brief 2-3 sentence summary of the key findings:\n\n${context}`;
  
  try {
    return await generateChatResponse(summaryPrompt, analysisData, []);
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Analysis complete. Ask me questions about the research data!';
  }
}
