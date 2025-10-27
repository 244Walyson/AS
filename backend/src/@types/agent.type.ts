import { Annotation, END, START } from "@langchain/langgraph";

export const AgentStateAnnotation = Annotation.Root({
  text: Annotation<string>,
  lang: Annotation<string>,
  original_language: Annotation<string | undefined>,
  clean_text: Annotation<string | undefined>,
  analysis: Annotation<any>,
  messages: Annotation<Array<{ role: string; content: any }>>({
    reducer: (current, update) => (current || []).concat(update || []),
    default: () => []
  })
});

export type AgentState = typeof AgentStateAnnotation.State;

export type NodeNames = typeof START | typeof END | "contextualize" | "analyze";