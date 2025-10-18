// PubMed API Service
// API Documentation: https://www.ncbi.nlm.nih.gov/books/NBK25501/

const PUBMED_BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

export interface PubMedArticle {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  publicationDate: string;
  abstract?: string;
  publicationType: string[];
}

/**
 * Search PubMed for articles
 */
export async function searchPubMed(
  query: string,
  options: {
    maxResults?: number;
    fromYear?: number;
    toYear?: number;
  } = {}
): Promise<string[]> {
  const { maxResults = 200, fromYear, toYear } = options;
  
  let searchQuery = query;
  
  // Add date range if specified
  if (fromYear && toYear) {
    searchQuery += ` AND ${fromYear}:${toYear}[dp]`;
  } else if (fromYear) {
    searchQuery += ` AND ${fromYear}:3000[dp]`;
  }
  
  const url = `${PUBMED_BASE_URL}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(searchQuery)}&retmax=${maxResults}&retmode=json`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`PubMed API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.esearchresult?.idlist || [];
  } catch (error) {
    console.error('Error searching PubMed:', error);
    throw error;
  }
}

/**
 * Search PubMed for articles by author name
 */
export async function searchPubMedByAuthor(
  authorName: string,
  options: {
    maxResults?: number;
    fromYear?: number;
    toYear?: number;
  } = {}
): Promise<string[]> {
  const { maxResults = 200, fromYear, toYear } = options;
  
  // Format author name for PubMed search (LastName FirstInitial[Author])
  let searchQuery = `${authorName}[Author]`;
  
  // Add date range if specified
  if (fromYear && toYear) {
    searchQuery += ` AND ${fromYear}:${toYear}[dp]`;
  } else if (fromYear) {
    searchQuery += ` AND ${fromYear}:3000[dp]`;
  }
  
  const url = `${PUBMED_BASE_URL}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(searchQuery)}&retmax=${maxResults}&retmode=json`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`PubMed API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.esearchresult?.idlist || [];
  } catch (error) {
    console.error('Error searching PubMed by author:', error);
    throw error;
  }
}

/**
 * Fetch article details by PMIDs
 */
export async function fetchArticleDetails(pmids: string[]): Promise<PubMedArticle[]> {
  if (pmids.length === 0) return [];
  
  const url = `${PUBMED_BASE_URL}/esummary.fcgi?db=pubmed&id=${pmids.join(',')}&retmode=json`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`PubMed API error: ${response.status}`);
    }
    
    const data = await response.json();
    const articles: PubMedArticle[] = [];
    
    if (data.result) {
      pmids.forEach((pmid) => {
        const article = data.result[pmid];
        if (article && article.title) {
          articles.push({
            pmid,
            title: article.title,
            authors: article.authors?.map((a: any) => a.name) || [],
            journal: article.fulljournalname || article.source || '',
            publicationDate: article.pubdate || '',
            publicationType: article.pubtype || [],
          });
        }
      });
    }
    
    return articles;
  } catch (error) {
    console.error('Error fetching article details:', error);
    return [];
  }
}

/**
 * Get publications by year from PubMed
 */
export async function getPublicationsByYear(
  query: string,
  fromYear: number = 2020,
  toYear: number = new Date().getFullYear()
): Promise<{ year: number; count: number }[]> {
  try {
    const yearCounts = await Promise.all(
      Array.from({ length: toYear - fromYear + 1 }, (_, i) => {
        const year = fromYear + i;
        return searchPubMed(query, { maxResults: 1, fromYear: year, toYear: year })
          .then((pmids) => ({ year, count: pmids.length }))
          .catch(() => ({ year, count: 0 }));
      })
    );
    
    return yearCounts;
  } catch (error) {
    console.error('Error getting publications by year:', error);
    return [];
  }
}

/**
 * Get publication type breakdown
 */
export async function getPublicationTypeBreakdown(
  query: string
): Promise<{ type: string; count: number }[]> {
  try {
    const pmids = await searchPubMed(query, { maxResults: 200 });
    const articles = await fetchArticleDetails(pmids);
    
    const typeCounts: { [key: string]: number } = {};
    
    articles.forEach((article) => {
      article.publicationType.forEach((type) => {
        // Normalize common types
        let normalizedType = type;
        if (type.toLowerCase().includes('review')) {
          normalizedType = 'Review';
        } else if (type.toLowerCase().includes('clinical trial')) {
          normalizedType = 'Clinical Trial';
        } else if (type.toLowerCase().includes('journal article')) {
          normalizedType = 'Journal Article';
        }
        
        typeCounts[normalizedType] = (typeCounts[normalizedType] || 0) + 1;
      });
    });
    
    return Object.entries(typeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error getting publication type breakdown:', error);
    return [];
  }
}

/**
 * Get total publication count
 */
export async function getTotalPublications(query: string): Promise<number> {
  try {
    const url = `${PUBMED_BASE_URL}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmode=json`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`PubMed API error: ${response.status}`);
    }
    
    const data = await response.json();
    return parseInt(data.esearchresult?.count || '0', 10);
  } catch (error) {
    console.error('Error getting total publications:', error);
    return 0;
  }
}
