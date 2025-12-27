import { log } from "@/utils/loggerfrontend";
import axios from "axios";
import toast from "react-hot-toast";
//
async function getOpenRouter() {
  const { OpenRouter } = await import("@openrouter/sdk");

  return new OpenRouter({
    apiKey: import.meta.env.VITE_AIKEY,
  });
}
export const generatebog = async (userprompt) => {
  try {
    const openrouter = await getOpenRouter();
    const stream = await openrouter.chat.send({
      model: "mistralai/devstral-2512:free",
      messages: [
        {
          role: "system",
          content:
            "You are a professional blog writer. Write a well-structured, engaging blog post in markdown format.Don't add any images or links in the blog",
        },
        {
          role: "user",
          content: userprompt,
        },
      ],
      stream: true,
    
    });

    let response = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        response += content;
       
      }

    
      if (chunk.usage) {
        log("\nReasoning tokens:", chunk.usage.reasoningTokens);
      }
    }

    return response;
  } catch (error) {
 
    toast.error(error.response?.data?.msg || "Something went wrong");
  }
};
