import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { vectorStore } from "@/app/services/rag";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files"); 
    const type = formData.get("type") || "pdf"; 
    const url = formData.get("url"); 

    if (type === "pdf" && (!files || files.length === 0)) {
      return Response.json(
        { error: "No files provided for PDF indexing", success: false },
        { status: 400 }
      );
    }
    if (type !== "pdf" && !url) {
      return Response.json(
        { error: "No URL provided for website or YouTube indexing", success: false },
        { status: 400 }
      );
    }

    const tempDir = path.join(process.cwd(), "app", "temp");
    await fs.mkdir(tempDir, { recursive: true });

    if (type === "pdf") {
      const allowedExtensions = [".pdf"];
      for (const file of files) {
        const ext = path.extname(file.name).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
          return Response.json(
            { error: `Unsupported file type: ${file.name}`, success: false },
            { status: 400 }
          );
        }

        const uniqueFileName = `${uuidv4()}${ext}`;
        const tempPath = path.join(tempDir, uniqueFileName);
        const normalizedPath = path.normalize(tempPath);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(normalizedPath, buffer);

        try {
          await vectorStore(normalizedPath, "pdf");
          await fs.unlink(normalizedPath);
        } catch (vectorError) {
          console.error(`Error indexing file ${file.name}:`, vectorError);
          await fs.unlink(normalizedPath).catch(() => {});
        }
      }
    } else {
      await vectorStore(url, type);
    }

    return Response.json(
      { message: `${type} content indexed successfully`, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return Response.json(
      { error: `Error while indexing content`, success: false },
      { status: 500 }
    );
  }
}