import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    // ---------- 1️⃣ Fetch from PubMed ----------
    const pubmedUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(
      query
    )}&retmode=json&retmax=5`;

    const pubmedResponse = await fetch(pubmedUrl);
    const pubmedData = await pubmedResponse.json();

    const ids = pubmedData.esearchresult?.idlist?.join(",") || "";
    let abstracts: string[] = [];

    if (ids) {
      const detailsUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids}&retmode=text&rettype=abstract`;
      const detailsResponse = await fetch(detailsUrl);
      const detailsText = await detailsResponse.text();
      abstracts.push(detailsText);
    }

    // ---------- 2️⃣ Fetch from OpenAlex ----------
    const openalexUrl = `https://api.openalex.org/works?filter=title.search:${encodeURIComponent(
      query
    )}&per-page=5`;

    const openalexResponse = await fetch(openalexUrl);
    const openalexData = await openalexResponse.json();

    const openalexResults =
      openalexData.results?.map((r: any) => ({
        title: r.display_name,
        authors: r.authorships
          ?.map((a: any) => a.author.display_name)
          .join(", "),
        abstract: r.abstract_inverted_index
          ? Object.keys(r.abstract_inverted_index).join(" ")
          : "No abstract available",
        link: r.id,
      })) || [];

    // ---------- 3️⃣ Summarize with Cohere ----------
    const cohereApiKey = process.env.COHERE_API_KEY;
    if (!cohereApiKey) {
      throw new Error("Missing COHERE_API_KEY in environment variables.");
    }

    const cohereResponse = await fetch("https://api.cohere.ai/v1/summarize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cohereApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: abstracts.join("\n") || JSON.stringify(openalexResults),
        length: "medium",
        format: "paragraph",
        model: "command-xlarge-nightly",
      }),
    });

    const cohereSummary = await cohereResponse.json();

    // ---------- 4️⃣ Return Combined Response ----------
    return NextResponse.json({
      query,
      summary: cohereSummary.summary || "No summary generated.",
      sources: {
        pubmed: abstracts,
        openalex: openalexResults,
      },
    });
  } catch (error: any) {
    console.error("Error in /api/search:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
