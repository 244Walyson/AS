import { END, START, StateGraph } from "@langchain/langgraph";
import { AgentStateAnnotation } from "src/@types/agent.type";
import { analysisAgent } from "./analysis.agent";
import { contextualizationAgent } from "./contextualization.agent";



export function initializeLangGraph() {

  const graph = new StateGraph<typeof AgentStateAnnotation>(AgentStateAnnotation)
  .addNode("contextualize", contextualizationAgent)
  .addNode("analyze", analysisAgent)
  .addEdge(START, "contextualize")
  .addEdge("contextualize", "analyze")
  .addEdge("analyze", END)
  .compile();

  return graph;
}