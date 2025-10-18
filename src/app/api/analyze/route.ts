// API Route for running analysis server-side
import { NextRequest, NextResponse } from 'next/server';
import { runComparativeAnalysis, analyzeTopic, analyzeAuthor } from '@/services/analysisService';

export async function POST(request: NextRequest) {
  console.log('=== Analysis API Route Called ===');
  
  try {
    const body = await request.json();
    const { topics, authors } = body;

    console.log('Received topics:', topics);
    console.log('Received authors:', authors);

    // Combine topics and authors into a single analysis
    const items = [];
    
    if (topics && Array.isArray(topics)) {
      items.push(...topics.map((t: string) => ({ type: 'topic', value: t })));
    }
    
    if (authors && Array.isArray(authors)) {
      items.push(...authors.map((a: string) => ({ type: 'author', value: a })));
    }

    console.log('Total items to analyze:', items.length);

    if (items.length === 0) {
      console.error('No items to analyze');
      return NextResponse.json(
        { error: 'At least one topic or author is required' },
        { status: 400 }
      );
    }

    // Analyze each item (topic or author)
    console.log('Starting analysis for:', items.map(i => `${i.type}: ${i.value}`).join(', '));
    
    const results = await Promise.all(
      items.map(async (item, index) => {
        console.log(`Analyzing ${index + 1}/${items.length}: ${item.type} - ${item.value}`);
        try {
          if (item.type === 'author') {
            const result = await analyzeAuthor(item.value);
            console.log(`✓ Author analysis complete for ${item.value}`);
            return result;
          } else {
            const result = await analyzeTopic(item.value);
            console.log(`✓ Topic analysis complete for ${item.value}`);
            return result;
          }
        } catch (error) {
          console.error(`✗ Failed to analyze ${item.type} "${item.value}":`, error);
          throw error;
        }
      })
    );

    console.log('All analyses complete, combining results...');

    // Combine institutions from all results
    const institutionMap = new Map<string, number>();
    results.forEach((result) => {
      result.topInstitutions.forEach((inst) => {
        const current = institutionMap.get(inst.name) || 0;
        institutionMap.set(inst.name, current + inst.count);
      });
    });

    const totalInstitutionMentions = Array.from(institutionMap.values()).reduce(
      (sum, count) => sum + count,
      0
    );

    const combinedInstitutions = Array.from(institutionMap.entries())
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / totalInstitutionMentions) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const analysisData = {
      topics: items.map(i => i.value),
      results,
      combinedInstitutions,
      timestamp: new Date(),
    };

    console.log('✓ Analysis complete! Returning data...');
    console.log('Total results:', results.length);
    console.log('Combined institutions:', combinedInstitutions.length);

    return NextResponse.json(analysisData);
  } catch (error) {
    console.error('=== Analysis API Error ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: `Failed to run analysis: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
