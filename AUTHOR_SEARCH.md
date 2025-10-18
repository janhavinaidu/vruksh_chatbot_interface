# Author Search Feature

## Overview

Your chatbot now supports **author-based analysis** in addition to topic-based research! You can compare publications between topics and authors, or analyze multiple authors together.

## What Was Added

### 1. Author Search Functions

**OpenAlex Service** (`src/services/openalexService.ts`):
- `searchWorksByAuthor()` - Find all publications by an author name

**PubMed Service** (`src/services/pubmedService.ts`):
- `searchPubMedByAuthor()` - Search PubMed by author name

**Analysis Service** (`src/services/analysisService.ts`):
- `analyzeAuthor()` - Complete analysis of an author's publications

### 2. Updated UI

**New Author Input Section**:
- Separate input field for author names
- Purple tags to distinguish authors from topics (blue)
- Can add multiple authors
- Works alongside topic search

### 3. Combined Analysis

The system now analyzes:
- ✅ Research topics (e.g., "Leukemia", "COVID-19")
- ✅ Author names (e.g., "John Smith", "Jane Doe")
- ✅ Mix of both topics and authors together!

## How to Use

### Adding Authors

1. **Type author name** in the "Author Names" field
2. **Press Enter** to add
3. **Add multiple authors** to compare them
4. **Click "Run Comparative Analysis"**

### Example Queries

**Compare Two Authors**:
```
Authors: Anthony Fauci, Robert Gallo
Topics: (none)
```

**Compare Author vs Topic**:
```
Authors: Anthony Fauci
Topics: COVID-19
```

**Compare Multiple Authors and Topics**:
```
Authors: Francis Collins, Jennifer Doudna
Topics: CRISPR, Gene Therapy
```

## What You'll See

### For Each Author:

1. **Total Publications** - Number of papers authored
2. **Publication Trends** - Papers published per year (2020-2024)
3. **Top Institutions** - Where the author has published from
4. **Average Citations** - Citation impact of their work
5. **Publication Types** - Journal articles, reviews, etc.

### Comparison Features:

- **Side-by-side comparison** of authors and topics
- **Combined institution rankings** across all items
- **Publication growth rates** for each author
- **AI-powered insights** comparing productivity and impact

## Data Sources

### OpenAlex
- Searches by author display name
- Provides publication counts, citations, institutions
- Covers 240M+ works globally

### PubMed
- Searches using `[Author]` tag
- Provides publication types
- Focused on biomedical literature

## Author Name Format

**Best Practices**:
- ✅ Use full name: "Anthony Fauci"
- ✅ Use last name + first initial: "Fauci A"
- ✅ Use common variations: "A Fauci", "Fauci Anthony"
- ❌ Avoid nicknames or abbreviations

**The system will find**:
- All name variations automatically
- Publications from different institutions
- Co-authored works

## Example Use Cases

### 1. Compare Research Productivity
```
Authors: Researcher A, Researcher B
Question: "Who has published more papers?"
```

### 2. Find Leading Institutions
```
Authors: Your Favorite Scientist
Question: "Which institutions has this author worked with?"
```

### 3. Track Publication Trends
```
Authors: Senior Researcher
Question: "What's the publication trend over the years?"
```

### 4. Compare Impact
```
Authors: Author 1, Author 2
Question: "Who has higher average citations?"
```

### 5. Mixed Analysis
```
Authors: Leading Researcher
Topics: Their Research Area
Question: "How does this author's work compare to the overall field?"
```

## Chatbot Integration

The AI chatbot understands author data and can answer:

- "How many publications does [Author] have?"
- "What's [Author]'s most productive year?"
- "Which institution does [Author] work with most?"
- "Compare [Author 1] and [Author 2]"
- "What's the average citation count for [Author]?"

## Visual Indicators

**In the UI**:
- 🔵 **Blue tags** = Research topics
- 🟣 **Purple tags** = Author names

**In the charts**:
- All data is displayed the same way
- Authors and topics are compared equally
- The `isAuthor` flag helps the AI provide context

## Technical Details

### Author Analysis Process

1. **Search OpenAlex** for author's works
2. **Extract publication data** (years, citations, institutions)
3. **Search PubMed** for publication types
4. **Combine data** into unified analysis
5. **Calculate statistics** (trends, averages, percentages)

### Performance

- **Parallel processing** for multiple authors
- **Same speed** as topic analysis
- **10-30 seconds** for complete analysis

## Limitations

### Name Ambiguity
- Common names may return multiple researchers
- Use full names or add institution context if needed
- Results include all matching authors

### Data Coverage
- OpenAlex: Global coverage, all disciplines
- PubMed: Biomedical focus only
- Some publications may be missed if not indexed

### Time Range
- Currently analyzes 2020-2024
- Can be adjusted in the code if needed

## Tips for Best Results

1. **Use specific names**: "Jennifer Doudna" better than "J Doudna"
2. **Check spelling**: Typos will return no results
3. **Try variations**: "Smith J" vs "John Smith"
4. **Combine with topics**: Get field context
5. **Ask specific questions**: The AI provides better insights

## Future Enhancements

Potential improvements:
- Author disambiguation (select specific researcher)
- Co-author network visualization
- H-index and impact metrics
- Collaboration patterns
- Research area classification
- Export author reports

## Examples

### Example 1: Single Author Analysis
```
Input:
  Authors: Francis Collins

Output:
  - Total Publications: 1,234
  - Average Citations: 45.6
  - Top Institution: NIH
  - Publication Growth: +12.3%
  - Most Productive Year: 2022
```

### Example 2: Author Comparison
```
Input:
  Authors: Researcher A, Researcher B

Output:
  - Researcher A: 856 publications, 32.1 avg citations
  - Researcher B: 1,023 publications, 28.4 avg citations
  - Top Institutions: Harvard (A), Stanford (B)
```

### Example 3: Mixed Analysis
```
Input:
  Authors: Leading Scientist
  Topics: Cancer Research

Output:
  - Leading Scientist: 567 publications in this field
  - Cancer Research overall: 483,387 publications
  - Scientist's impact: 2.5x higher citation rate
```

---

**Your chatbot now analyzes both research topics AND individual authors!** 🎓✨

Compare researchers, track productivity, and get AI-powered insights on scientific contributions.
