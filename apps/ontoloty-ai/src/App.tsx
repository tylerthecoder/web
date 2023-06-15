import { useState } from 'react'
import './App.css'
import { OpenAIApi, Configuration, ChatCompletionRequestMessage, ChatCompletionResponseMessage } from 'openai'
import * as RDFLib from "rdflib"

const ontology = RDFLib.graph();

const configuration = new Configuration({
  apiKey:import.meta.env.VITE_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const SYSTEM_MESSAGE = { "role": "system", "content": "You are a helpful analytical assistant that builds ontologies for peoples belief systems. You will work in the turtle syntax for owl. Be very formal and logical with your responses. Make sure to define the owl, rdfs and xsd prefixes and only use those prefixes. Also include an ex prefix for all new concepts. Try to break up the ontology into as many classes as you can and be very concise with the definitions. Only make classes, do not make individuals unless explicitly asked to do so." } as const;

const ask = async (prompt: string, messages: ChatCompletionRequestMessage[] = []) => {
  console.log("Asking")
  const data = await openai.createChatCompletion({
    model: "gpt-4-0613",
    functions: [{
      name: "create",
        description: "Use this function to create an ontology. Output should be owl code with the turtle syntax",
        parameters: {
            type: "object",
            properties: {
                ontology: {
                    type: "string",
                    description: "The owl ontology that describes the ontology to make"
                }
            },
            required: ["ontology"]
        }

    }],
    messages: [
      SYSTEM_MESSAGE,
      ...messages,
      { "role": "user", "content": prompt },
    ],

  });
  const message = data.data.choices[0].message;

  if (!message) {
      throw new Error("No message");
  }

console.log("Got meesage", message);

  const {content, function_call} = message;


    if (function_call) {
        const funcName = function_call.name;

        console.log(function_call);
    }


  return message;
}

// PROMPTS
const createPrompt = (statement: string) => `You will be given a plain english statement. You will create an ontology by calling your function. Here is the prompt: ${statement}`
const updatePrompt = (ontology: string, update: string) => `You will be given an ontology and a plain english sentence that you will interpret to make a new ontology. You will output this ontology by calling your function. Make sure not to remove any information from the original ontoloty. Here is the ontology ${ontology}. Here is the update ${update}`
const reasonPrompt = (ontology: string, question: string) => `You will be given an ontology in the owl language with turtle syntax. You will be asked to answer a question about the ontology. Here is the ontology: ${ontology}. Here is the question: ${question}`
const clarifyPrompt = (ontology: string) => `You will be given an ontology in the owl language with turtle syntax. I want you to read it and ask a single clarifying question that could make the ontology more robust. Give 2 possible answers that could be implemented. Here is the ontology: ${ontology}`
const compressPrompt = (ontology: string) => `You will be given an ontology. I want you to read it and compress it into a more consice ontology by calling your function. This could be noticing redundancies and removing them or abstracting some concept. Here is the ontology: ${ontology}`


const acceptSuggestion = (number: 1 | 2) => `Implement the suggestion using the turtle syntax make sure to include the prefixes ${number}`

const extractOntology = (text: string): string => {
  RDFLib.parse(text, ontology, "http://example.org/", "text/turtle");
  console.log(ontology);
  return text;
}

function App() {
  const [response, setResponse] = useState("");
  const [message, setMessage] = useState("");
  const [clairfyText, setClairfyText] = useState<string | null>(null);



    async function handle(prompt: string) {
        const message = await ask(prompt);

        const func = message.function_call

        if (!func || !func.arguments)
            return

        const data = JSON.parse(func.arguments);

        if (func.name === "create") {
            const ontology = extractOntology(data.ontology);
            setResponse(ontology);
        }
    }



  const add = async () => {
      handle(createPrompt(message));
  }

  const update = async () => {
      handle(updatePrompt(response, message));
  }

  const reason = async () => {
    const r = await ask(reasonPrompt(response, message));
    alert(r);
  }

  const compress = async () => {
      handle(compressPrompt(response));
  }

  const clarify = async () => {
    const r = await ask(clarifyPrompt(response));
    // setClairfyText(r);

  }

  const clarifyOption1 = async () => {
    if (!clairfyText) {
      throw new Error("No clarify text");
    }
    const res = await ask(acceptSuggestion(1), [
      { role: "assistant", content: clairfyText },
      { "role": "user", "content": message },
    ]);
    // const ont = extractOntology(res);
    // setClairfyText(null);
    // setResponse(ont);
  }

  const clarifyOption2 = async () => {
    if (!clairfyText) {
      throw new Error("No clarify text");
    }
    const res = await ask(acceptSuggestion(2), [
      { role: "assistant", content: clairfyText },
      { "role": "user", "content": message },
    ]);
    // setClairfyText(null);
    // const ont = extractOntology(res);
    // setResponse(ont);
  }

  return (
    <div className="App">
      <p className='whitespace-pre-line' > {response} </p>
      <input className='p-1 m-5 text-white border-2 border-white' type="text" onChange={(e) => setMessage(e.target.value)} />
      <button onClick={() => add()}> Enter </button>
      <button onClick={() => update()}> Update </button>
      <button onClick={() => reason()}> Reason </button>
      <button onClick={() => clarify()}> Clarify </button>
      <button onClick={() => compress()}> Compress </button>
      {clairfyText && <div>
        <p className='whitespace-pre-line'> {clairfyText} </p>
        <button onClick={() => clarifyOption1()}> Option 1 </button>
        <button onClick={() => clarifyOption2()}> Option 2 </button>
      </div>}

    </div >
  )
}

export default App
