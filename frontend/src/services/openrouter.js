import axios from "axios";

export const generatebog = async (userprompt) => {
  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "moonshotai/kimi-k2:free",
      messages: [
        {
          role: "system",
          content: "you are helpful AI that generates technical blog post",
        },
        {
          role: "user",
          content: userprompt,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_AIKEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.choices[0].message.content;
};
