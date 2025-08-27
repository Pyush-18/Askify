import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { PlaywrightWebBaseLoader } from "@langchain/community/document_loaders/web/playwright";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import * as cheerio from "cheerio";
import path from "path";

export async function vectorStore(input, type = "pdf") {
  try {
    let docs = [];

    if (type === "pdf") {
      const loader = new PDFLoader(input);
      docs = await loader.load();
    } else if (type === "website") {
      if (!isValidUrl(input)) {
        throw new Error("Invalid website URL");
      }

      // Initial load with Cheerio
      const baseLoader = new CheerioWebBaseLoader(input, { selector: "body" });
      const initialDocs = await baseLoader.load();
      const $ = cheerio.load(initialDocs[0].pageContent);

      // Extract all internal links (no specific path filtering)
      const internalLinks = [];
      $("a").each((i, element) => {
        const href = $(element).attr("href");
        if (href && (href.startsWith("/") || !href.startsWith("http"))) {
          const fullUrl = new URL(href, input).href;
          internalLinks.push(fullUrl);
        }
      });

      // Remove duplicates and include the base URL
      const uniqueLinks = [...new Set([input, ...internalLinks])];

      // Load content from all unique links
      const allDocs = await Promise.all(
        uniqueLinks.map(async (url) => {
          const linkLoader = new CheerioWebBaseLoader(url, { selector: "body" });
          const docs = await linkLoader.load();
          return docs.map((doc) => ({
            ...doc,
            metadata: { ...doc.metadata, source: url },
          }));
        })
      );

      docs = allDocs.flat();

      // Filter docs for course-related content
      const courseKeywords = ["course", "lesson", "training", "learn", "class", "module"];
      docs = docs.filter((doc) =>
        courseKeywords.some((keyword) =>
          doc.pageContent.toLowerCase().includes(keyword.toLowerCase())
        )
      );

      // Fallback to Playwright if no relevant content is found
      if (docs.length === 0) {
        console.warn("No course content found with Cheerio. Trying Playwright...");
        const playwrightLoader = new PlaywrightWebBaseLoader(input, {
          launchOptions: { headless: true },
        });
        const playwrightDocs = await playwrightLoader.load();
        docs = playwrightDocs.map((doc) => ({
          ...doc,
          metadata: { ...doc.metadata, source: input },
        }));

        // Filter Playwright-loaded content
        docs = docs.filter((doc) =>
          courseKeywords.some((keyword) =>
            doc.pageContent.toLowerCase().includes(keyword.toLowerCase())
          )
        );
      }
    } else if (type === "youtube") {
      if (!isValidUrl(input)) {
        throw new Error("Invalid YouTube URL");
      }
      const loader = YoutubeLoader.createFromUrl(input, {
        language: "en",
        addVideoInfo: true,
      });
      docs = await loader.load();
    } else {
      throw new Error("Unsupported input type. Use 'pdf', 'website', or 'youtube'.");
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await splitter.splitDocuments(docs);

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const vectorStore = await QdrantVectorStore.fromDocuments(
      chunks,
      embeddings,
      {
        url: "http://localhost:6333",
        collectionName: "askify-store",
      }
    );

    console.log(`Embeddings for ${type} created successfully.`);
    return { success: true, message: `Successfully indexed ${type} content` };
  } catch (error) {
    console.error(`Error processing ${type}:`, error);
    throw new Error(`Failed to index ${type}: ${error.message}`);
  }
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}