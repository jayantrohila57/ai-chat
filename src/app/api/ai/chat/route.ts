import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { ollama } from "ollama-ai-provider-v2";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const model = "phi:2.7b";

  const result = streamText({
    model: ollama(model),
    providerOptions: { ollama: { think: true } },
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
