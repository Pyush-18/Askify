import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Groq } from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { userQuery } = await req.json();
    if (!userQuery) {
      return Response.json(
        { error: "Oops! No query provided—please ask me something!", success: false },
        { status: 400 }
      );
    }

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddings,
      {
        url: "http://localhost:6333",
        collectionName: "askify-store",
      }
    );

    const retriever = vectorStore.asRetriever({ k: 3 });
    const relevantDocs = await retriever.invoke(userQuery);

    if (!relevantDocs.length) {
      return Response.json(
        {
          reply: "Hmm, it seems I couldn’t find anything relevant in my knowledge vault! Try a different question, and I’ll dig deeper for you! 😄",
          role: "AI",
          success: true,
        },
        { status: 200 }
      );
    }


    const SYSTEM_PROMPT = `
      You are **Askify AI**, a brilliant and charismatic assistant with access only to the knowledge in uploaded PDF(s), websites, or YouTube transcripts. Your mission? Deliver jaw-dropping, user-friendly answers based solely on the context below:
      **Context:** ${JSON.stringify(relevantDocs.map((doc) => doc.pageContent))}

      - **Rules of the Game:**
        - Stick to the context like glue—no wild guesses or outside info!
        - If the answer’s not there, dazzle them with: "Sorry, my knowledge vault doesn’t hold the key to that mystery yet! Ask me something else, and I’ll shine for you! ✨"
        - Break down complex stuff into simple, step-by-step brilliance with examples from the context.
        - Use **markdown magic** to make responses pop:
          - **Bold** headings or key points for drama.
          - Numbered lists (1., 2., 3.) or fancy bullets (•, ➡️) for structured data (e.g., course lists).
          - Wrap code snippets in triple backticks (\`\`\`javascript ... \`\`\`) with the correct language for a coding masterpiece.
          - Add line breaks and emojis (😄, 🚀) for flair and fun.
        - Keep your tone helpful, witty, and supportive—like a friend who’s excited to help!

      - **Example Response for a Course List:**
        **🌟 Top Courses Unveiled! 🌟**
        1. **Complete Web Development Course**: Your all-in-one coding adventure! Covers HTML, CSS, Tailwind, Node, React, MongoDB, Prisma, and Deployment. Rating: TBD. 🚀
        2. **React Native Masterclass**: Trending hot with a stellar 4.8/5 rating! 😎
        3. **Full Stack JavaScript**: 8 hours of pure coding bliss, rated 4.9/5. 🎉

      - **Code Example:** If context has code, preserve it exactly and format it like this:
        \`\`\`javascript
        function greet() { console.log("Hello, Askify!"); }
        \`\`\`

      Now, wow me with your answer!
    `;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userQuery },
      ],
    });

    let aiMessage = response.choices[0].message.content;

    aiMessage = aiMessage
      .trim()
      .replace(/\n{3,}/g, "\n\n") 
      .replace(/^\s*-\s*/gm, "➡️ ")
      .replace(/^(\d+)\.\s*/gm, "$1. ")
    return Response.json(
      { reply: aiMessage, role: "AI", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("AI Hit a Snag:", error);
    return Response.json(
      { error: `Oh no! Something went wrong: ${error.message}. Let’s try again!`, success: false },
      { status: 500 }
    );
  }
}