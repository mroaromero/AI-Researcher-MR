import { tavily } from "@tavily/core";

export interface SearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export class SearchService {
  private client: any;

  constructor() {
    const apiKey = process.env.TAVILY_API_KEY;
    if (apiKey) {
      this.client = tavily({ apiKey });
    }
  }

  async search(query: string, maxResults: number = 5): Promise<SearchResult[]> {
    if (!this.client) {
      console.warn("TAVILY_API_KEY is not set. Returning mock results.");
      return [
        {
           title: "Mock Result: " + query,
           url: "https://example.com/mock",
           content: "This is a mock search result because the TAVILY_API_KEY environment variable is not set.",
           score: 1.0
        }
      ] as SearchResult[];
    }


    try {
      const response = await this.client.search(query, {
        searchDepth: "advanced",
        maxResults: maxResults,
        includeAnswer: true, // We might use this later
      });

      return response.results.map((r: any) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        score: r.score
      }));
    } catch (error) {
      console.error("Search failed:", error);
      throw new Error("Failed to execute search query.");
    }
  }
}
