// OpenAlex API Service
// API Documentation: https://docs.openalex.org/

export interface OpenAlexWork {
  id: string;
  title: string;
  publication_year: number;
  publication_date: string;
  cited_by_count: number;
  type: string;
  authorships: Array<{
    author: {
      display_name: string;
    };
    institutions: Array<{
      display_name: string;
      country_code: string;
    }>;
  }>;
  primary_location?: {
    source?: {
      display_name: string;
    };
  };
}

export interface OpenAlexResponse {
  results: OpenAlexWork[];
  meta: {
    count: number;
    per_page: number;
  };
}

const BASE_URL = 'https://api.openalex.org';
// Support both client-side (NEXT_PUBLIC_) and server-side environment variables
const EMAIL = process.env.NEXT_PUBLIC_OPENALEX_EMAIL || process.env.OPENALEX_EMAIL || '';

/**
 * Search for works (publications) by topic/keyword
 */
export async function searchWorks(
  query: string,
  options: {
    perPage?: number;
    page?: number;
    fromYear?: number;
    toYear?: number;
  } = {}
): Promise<OpenAlexResponse> {
  const { perPage = 200, page = 1, fromYear, toYear } = options;
  
  let url = `${BASE_URL}/works?search=${encodeURIComponent(query)}&per-page=${perPage}&page=${page}`;
  
  // Add year filter if specified
  if (fromYear && toYear) {
    url += `&filter=publication_year:${fromYear}-${toYear}`;
  } else if (fromYear) {
    url += `&filter=publication_year:>${fromYear - 1}`;
  }
  
  // Add email for polite pool (faster rate limits)
  if (EMAIL) {
    url += `&mailto=${EMAIL}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OpenAlex API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching from OpenAlex:', error);
    throw error;
  }
}

/**
 * Search for works by author name
 */
export async function searchWorksByAuthor(
  authorName: string,
  options: {
    perPage?: number;
    page?: number;
    fromYear?: number;
    toYear?: number;
  } = {}
): Promise<OpenAlexResponse> {
  const { perPage = 200, page = 1, fromYear, toYear } = options;
  
  let url = `${BASE_URL}/works?filter=authorships.author.display_name.search:${encodeURIComponent(authorName)}&per-page=${perPage}&page=${page}`;
  
  // Add year filter if specified
  if (fromYear && toYear) {
    url += `,publication_year:${fromYear}-${toYear}`;
  } else if (fromYear) {
    url += `,publication_year:>${fromYear - 1}`;
  }
  
  // Add email for polite pool
  if (EMAIL) {
    url += `&mailto=${EMAIL}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OpenAlex API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching author works from OpenAlex:', error);
    throw error;
  }
}

/**
 * Get publications grouped by year
 */
export async function getPublicationsByYear(
  query: string,
  fromYear: number = 2020,
  toYear: number = new Date().getFullYear()
): Promise<{ year: number; count: number }[]> {
  try {
    const response = await searchWorks(query, { perPage: 200, fromYear, toYear });
    
    // Group by year
    const yearCounts: { [key: number]: number } = {};
    
    response.results.forEach((work) => {
      const year = work.publication_year;
      if (year >= fromYear && year <= toYear) {
        yearCounts[year] = (yearCounts[year] || 0) + 1;
      }
    });
    
    // Convert to array and fill missing years with 0
    const result = [];
    for (let year = fromYear; year <= toYear; year++) {
      result.push({
        year,
        count: yearCounts[year] || 0,
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error getting publications by year:', error);
    return [];
  }
}

/**
 * Get top institutions for a topic
 */
export async function getTopInstitutions(
  query: string,
  limit: number = 10
): Promise<{ name: string; count: number; percentage: number }[]> {
  try {
    const response = await searchWorks(query, { perPage: 200 });
    
    // Count institutions
    const institutionCounts: { [key: string]: number } = {};
    let totalWithInstitutions = 0;
    
    response.results.forEach((work) => {
      const institutions = new Set<string>();
      work.authorships.forEach((authorship) => {
        authorship.institutions.forEach((inst) => {
          if (inst.display_name) {
            institutions.add(inst.display_name);
          }
        });
      });
      
      if (institutions.size > 0) {
        totalWithInstitutions++;
        institutions.forEach((inst) => {
          institutionCounts[inst] = (institutionCounts[inst] || 0) + 1;
        });
      }
    });
    
    // Sort and get top institutions
    const sorted = Object.entries(institutionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit);
    
    return sorted.map(([name, count]) => ({
      name,
      count,
      percentage: totalWithInstitutions > 0 ? (count / totalWithInstitutions) * 100 : 0,
    }));
  } catch (error) {
    console.error('Error getting top institutions:', error);
    return [];
  }
}

/**
 * Get publication statistics
 */
export async function getPublicationStats(query: string): Promise<{
  totalPublications: number;
  totalCitations: number;
  averageCitationsPerPaper: number;
  publicationTypes: { [key: string]: number };
}> {
  try {
    const response = await searchWorks(query, { perPage: 200 });
    
    let totalCitations = 0;
    const publicationTypes: { [key: string]: number } = {};
    
    response.results.forEach((work) => {
      totalCitations += work.cited_by_count;
      const type = work.type || 'unknown';
      publicationTypes[type] = (publicationTypes[type] || 0) + 1;
    });
    
    const totalPublications = response.results.length;
    
    return {
      totalPublications,
      totalCitations,
      averageCitationsPerPaper: totalPublications > 0 ? totalCitations / totalPublications : 0,
      publicationTypes,
    };
  } catch (error) {
    console.error('Error getting publication stats:', error);
    return {
      totalPublications: 0,
      totalCitations: 0,
      averageCitationsPerPaper: 0,
      publicationTypes: {},
    };
  }
}
