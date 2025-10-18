// API Route for chatbot using Cohere AI
import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse, type ChatMessage } from '@/services/cohereService';
import type { ComparativeAnalysis } from '@/services/analysisService';

export async function POST(request: NextRequest) {
  console.log('Chat API route called');
  
  try {
    const body = await request.json();
    const { message, analysisData, chatHistory } = body;

    console.log('Received message:', message);
    console.log('Has analysis data:', !!analysisData);
    console.log('Chat history length:', chatHistory?.length || 0);

    if (!message || typeof message !== 'string') {
      console.error('Invalid message:', message);
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Generate AI response using Cohere
    console.log('Calling generateChatResponse...');
    const response = await generateChatResponse(
      message,
      analysisData as ComparativeAnalysis | null,
      chatHistory as ChatMessage[] || []
    );

    console.log('Generated response:', response);
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to generate response: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
