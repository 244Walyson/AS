import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { AgentState } from 'src/@types/agent.type';
import { sanitizeLLMJson } from 'src/shared/utils/json.util';

export async function analysisAgent(
  state: AgentState,
): Promise<Partial<AgentState>> {
  const { clean_text, lang } = state;

  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.0-flash-exp',
    apiKey: process.env.GOOGLE_API_KEY!,
  });

  const prompt = `You are the Analysis Agent.
            Analyze the following text and produce output in JSON format.

            Text: """${clean_text}"""

            Respond **only** in JSON with the following structure:

            {
              "sentiment": "positive|negative|neutral",
              "intensity": "low|moderate|high",
              "emotion": "joy|anger|sadness|fear|surprise",
              "sentiment_value": 0.0 - 1.0,
              "motivation": "short description of what drives this sentiment",
              "context": {
                "tone": "formal|informal|sarcastic",
                "sarcasm": boolean
              },
              "entities": ["list of entities or people mentioned"],
              "hashtags": ["#relatedHashtags"],
              "interaction_type": "feedback|question|criticism",
              "impact": "low|medium|high",
              "feedback": "recommendations or observations if any"
            }

            Make sure the JSON is syntactically valid.
            Respond in ${lang}.
            important: Respond **only** in JSON.
            important: the json keys must be exactly as specified above in english.
          `;

  const res = await (model as any).invoke([{ role: 'user', content: prompt }]);
  const sanitized = sanitizeLLMJson(res.content);
  const analysis = JSON.parse(sanitized);

  return {
    analysis,
    messages: [
      ...(state.messages || []),
      { role: 'analysis', content: analysis },
    ],
  };
}
