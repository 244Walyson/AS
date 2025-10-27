
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AgentState } from "src/@types/agent.type";
import { sanitizeLLMJson } from "src/shared/utils/json.util";

export async function contextualizationAgent(state: AgentState): Promise<Partial<AgentState>> {
  const { text, lang } = state;

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash-exp",
    apiKey: process.env.GOOGLE_API_KEY!,
  });

const prompt = `
        You are the Contextualization Agent.
        Your tasks are:
        1. Detect the language of the input text.
        2. Translate the content into ${lang}, preserving its original meaning, tone, and emotional intent.
        3. Normalize the text by cleaning noise such as excessive punctuation, links, or spam — but **keep emojis**, as they carry emotional information.
        4. Return the result strictly in JSON format.

        Text: """${text}"""

        Respond only with valid JSON in the following format:
        {
          "original_language": "xx",
          "clean_text": "normalized and translated text preserving emotions and tone"
        }

        does not add any extra explanation or text outside the JSON.
        important: ensure the JSON is syntactically valid.
        `;

  const res = await (model as any).invoke(prompt);
  const sanitized = sanitizeLLMJson(res.content);
  console.log('Sanitized JSON:', sanitized);
  const result = JSON.parse(sanitized as string);

  return {
    original_language: result.original_language,
    clean_text: result.clean_text,
    messages: [...(state.messages || []), { role: "contextualization", content: result }]
  };
}