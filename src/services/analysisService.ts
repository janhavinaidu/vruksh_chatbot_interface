// Analysis Service - Combines data from multiple sources

import * as OpenAlexService from './openalexService';
import * as PubMedService from './pubmedService';

export interface AnalysisResult {
  topic: string;
  publicationTrends: { year: number; count: number }[];
  topInstitutions: { name: string; count: number; percentage: number }[];
  totalPublications: number;
  publicationTypes: { type: string; count: number }[];
  averageCitations: number;
  isAuthor?: boolean; // Flag to indicate if this is an author analysis
  authorName?: string; // Store the author name if applicable
}

export interface ComparativeAnalysis {
  topics: string[];
  results: AnalysisResult[];
  combinedInstitutions: { name: string; count: number; percentage: number }[];
  timestamp: Date;
}

/**
 * Analyze a single topic using both OpenAlex and PubMed
 */
export async function analyzeTopic(topic: string): Promise<AnalysisResult> {
  const currentYear = new Date().getFullYear();
  const fromYear = 2020;
  
  try {
    // Fetch data from both sources in parallel
    const [
      openAlexTrends,
      openAlexInstitutions,
      openAlexStats,
      pubMedTotal,
      pubMedTypes,
    ] = await Promise.all([
      OpenAlexService.getPublicationsByYear(topic, fromYear, currentYear),
      OpenAlexService.getTopInstitutions(topic, 10),
      OpenAlexService.getPublicationStats(topic),
      PubMedService.getTotalPublications(topic),
      PubMedService.getPublicationTypeBreakdown(topic),
    ]);
    
    return {
      topic,
      publicationTrends: openAlexTrends,
      topInstitutions: openAlexInstitutions,
      totalPublications: Math.max(openAlexStats.totalPublications, pubMedTotal),
      publicationTypes: pubMedTypes,
      averageCitations: openAlexStats.averageCitationsPerPaper,
    };
  } catch (error) {
    console.error(`Error analyzing topic "${topic}":`, error);
    throw error;
  }
}

/**
 * Analyze a single author's publications
 */
export async function analyzeAuthor(authorName: string): Promise<AnalysisResult> {
  const currentYear = new Date().getFullYear();
  const fromYear = 2020;
  
  try {
    // Fetch author data from OpenAlex
    const authorWorks = await OpenAlexService.searchWorksByAuthor(authorName, {
      perPage: 200,
      fromYear,
      toYear: currentYear,
    });
    
    // Calculate publication trends by year
    const yearCounts = new Map<number, number>();
    let totalCitations = 0;
    const institutionCounts = new Map<string, number>();
    
    authorWorks.results.forEach((work) => {
      const year = work.publication_year;
      if (year >= fromYear && year <= currentYear) {
        yearCounts.set(year, (yearCounts.get(year) || 0) + 1);
      }
      
      totalCitations += work.cited_by_count || 0;
      
      // Count institutions
      work.authorships.forEach((authorship) => {
        authorship.institutions.forEach((inst) => {
          const name = inst.display_name;
          institutionCounts.set(name, (institutionCounts.get(name) || 0) + 1);
        });
      });
    });
    
    // Create publication trends array
    const publicationTrends = [];
    for (let year = fromYear; year <= currentYear; year++) {
      publicationTrends.push({
        year,
        count: yearCounts.get(year) || 0,
      });
    }
    
    // Get top institutions
    const totalInstitutions = Array.from(institutionCounts.values()).reduce((sum, count) => sum + count, 0);
    const topInstitutions = Array.from(institutionCounts.entries())
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / totalInstitutions) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Get publication types from PubMed
    const pubMedIds = await PubMedService.searchPubMedByAuthor(authorName, {
      maxResults: 200,
      fromYear,
      toYear: currentYear,
    });
    
    // Get publication type breakdown for the author
    let pubMedTypes: { type: string; count: number }[] = [];
    if (pubMedIds.length > 0) {
      try {
        const articles = await PubMedService.fetchArticleDetails(pubMedIds.slice(0, 50)); // Limit to 50 for performance
        const typeCounts = new Map<string, number>();
        
        articles.forEach(article => {
          article.publicationType.forEach(type => {
            typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
          });
        });
        
        pubMedTypes = Array.from(typeCounts.entries())
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count);
      } catch (error) {
        console.error('Error fetching publication types for author:', error);
        // Continue without publication types
      }
    }
    
    return {
      topic: authorName,
      authorName,
      isAuthor: true,
      publicationTrends,
      topInstitutions,
      totalPublications: authorWorks.meta.count,
      publicationTypes: pubMedTypes,
      averageCitations: authorWorks.results.length > 0 ? totalCitations / authorWorks.results.length : 0,
    };
  } catch (error) {
    console.error(`Error analyzing author "${authorName}":`, error);
    throw error;
  }
}

/**
 * Run comparative analysis for multiple topics
 */
export async function runComparativeAnalysis(topics: string[]): Promise<ComparativeAnalysis> {
  if (topics.length === 0) {
    throw new Error('At least one topic is required');
  }
  
  try {
    // Analyze all topics in parallel
    const results = await Promise.all(
      topics.map((topic) => analyzeTopic(topic))
    );
    
    // Combine institutions from all topics
    const institutionMap = new Map<string, number>();
    results.forEach((result) => {
      result.topInstitutions.forEach((inst) => {
        const current = institutionMap.get(inst.name) || 0;
        institutionMap.set(inst.name, current + inst.count);
      });
    });
    
    // Sort and calculate percentages
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
    
    return {
      topics,
      results,
      combinedInstitutions,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error running comparative analysis:', error);
    throw error;
  }
}

/**
 * Calculate growth rate between years
 */
export function calculateGrowthRate(
  trends: { year: number; count: number }[]
): number {
  if (trends.length < 2) return 0;
  
  const firstYear = trends[0];
  const lastYear = trends[trends.length - 1];
  
  if (firstYear.count === 0) return 0;
  
  return ((lastYear.count - firstYear.count) / firstYear.count) * 100;
}

/**
 * Find the most productive year
 */
export function getMostProductiveYear(
  trends: { year: number; count: number }[]
): { year: number; count: number } | null {
  if (trends.length === 0) return null;
  
  return trends.reduce((max, current) =>
    current.count > max.count ? current : max
  );
}

/**
 * Calculate scientific share of voice (percentage of total publications)
 */
export function calculateShareOfVoice(
  topicPublications: number,
  totalPublications: number
): number {
  if (totalPublications === 0) return 0;
  return (topicPublications / totalPublications) * 100;
}
