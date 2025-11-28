import axios from "axios";
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
      model: "x-ai/grok-4.1-fast:free",
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
      streamOptions: {
        includeUsage: true,
      },
    });

    let response = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        response += content;
       
      }

    
      if (chunk.usage) {
        console.log("\nReasoning tokens:", chunk.usage.reasoningTokens);
      }
    }

    return response;
  } catch (error) {
    console.log("AI generation error:", error);
  }
};
