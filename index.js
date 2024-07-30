import { Ollama } from "ollama";
import { toolsString, executeFunction } from "./tools";

console.log(`Connecting to Ollama at ${process.env.OLLAMA_HOST}`);

const ollama = new Ollama({
  host: process.env.OLLAMA_HOST,
  fetch: (url, options = {}) => {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
    };
    return fetch(url, options);
  },
});

const promptandanswer = async (prompt) => {
  const response = await ollama.generate({
    model: "llama3",
    system: systemPrompt,
    prompt: prompt,
    stream: false,
    format: "json",
  });

  console.log(`\n${prompt}\n`);
  // console.log(response.response.trim())
  const responseObject = JSON.parse(response.response.trim());
  console.log("Response Json: ", responseObject);
  // executeFunction(responseObject.functionName, responseObject.parameters)
};

const systemPrompt = `You are a helpful bartender assistant that takes a request and finds the most appropriate tool to execute and make a cocktail, along with the parameters required to run the tool. Respond as JSON using the following schema: 
{
  "functionName": "function name",
  "parameters": [
    {
      "parameterName": "name of parameter",
      "parameterValue": "value of parameter"
    }
  ]
}. 
The tools are: ${toolsString}`;

await promptandanswer("Make me an old fashion cocktail");

// await promptandanswer("What is the weather at 41.881832, -87.640406?");
// await promptandanswer("what is located at 41.881832, -87.640406?");
