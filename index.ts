import ollama from "ollama";
import { toolsString, executeFunction } from "./tools";

const promptandanswer = async (prompt: string) => {
  const response = await ollama.generate({
    model: "llama3.1",
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
