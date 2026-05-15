import OpenAI from 'openai';

const embeddingClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL || undefined,
});

const EMBED_MODEL = process.env.EMBED_MODEL || 'nvidia/nv-embedqa-e5-v5';

export async function createEmbedding(text: string): Promise<number[]> {
  const input = text.slice(0, 500); // nv-embedqa-e5-v5 max 512 tokens (~500 chars safe limit)

  const response = await embeddingClient.embeddings.create({
    model: EMBED_MODEL,
    input,
    encoding_format: 'float',
    input_type: 'query',
  } as any);

  return response.data[0].embedding;
}

async function embedWithRetry(text: string): Promise<number[]> {
  try {
    return await createEmbedding(text);
  } catch (error: any) {
    if (error?.status === 429) {
      await new Promise((r) => setTimeout(r, 2000));
      return await createEmbedding(text);
    }
    throw error;
  }
}

export async function createEmbeddings(
  texts: string[],
  concurrency: number = 2,
): Promise<number[][]> {
  if (texts.length === 0) return [];

  const results: number[][] = new Array(texts.length);

  // Deduplicate: map normalized text → list of original indices
  const uniqueMap = new Map<string, number[]>();
  texts.forEach((t, i) => {
    const key = t.slice(0, 500);
    if (!uniqueMap.has(key)) uniqueMap.set(key, []);
    uniqueMap.get(key)!.push(i);
  });

  const uniqueTexts = [...uniqueMap.keys()];

  // Process in chunks of `concurrency` to limit parallel API calls
  for (let i = 0; i < uniqueTexts.length; i += concurrency) {
    const chunk = uniqueTexts.slice(i, i + concurrency);
    const embeddings = await Promise.all(chunk.map((text) => embedWithRetry(text)));

    chunk.forEach((text, chunkIdx) => {
      const indices = uniqueMap.get(text)!;
      for (const idx of indices) {
        results[idx] = embeddings[chunkIdx];
      }
    });
  }

  return results;
}
