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
