export default function handler(req, res) {
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