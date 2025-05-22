export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://platform.openai.com");
  res.setHeader("Access-Control-Allow-Headers", "*");

  res.status(200).json({
    object: "list",
    data: [
      {
        id: "paysafe-gpt",
        object: "model",
        owned_by: "paysafe",
      },
    ],
  });
}