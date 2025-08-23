import OpenAI from "openai";
import { GPT_KEY } from "./constants";


const openAI = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: GPT_KEY, 
  dangerouslyAllowBrowser:true,
});


export default openAI;