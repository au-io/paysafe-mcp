export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://platform.openai.com");
  res.setHeader("Access-Control-Allow-Headers", "*");

  const { messages, functions } = req.body;

  const latest = messages[messages.length - 1];
  const toolCall = latest.tool_calls?.[0];

  let response;
  if (toolCall?.function?.name === "create_payment_link") {
    const args = JSON.parse(toolCall.function.arguments);
    response = {
      role: "assistant",
      content: null,
      tool_calls: [{
        id: toolCall.id,
        type: "function",
        function: {
          name: "create_payment_link",
          arguments: JSON.stringify({
            url: `https://pay.paysafe.com/link/${Math.floor(Math.random() * 1000000)}`,
            amount: args.amount,
            currency: args.currency,
            expires_in: "10m",
          })
        }
      }]
    };
  } else if (toolCall?.function?.name === "refund_payment") {
    const args = JSON.parse(toolCall.function.arguments);
    response = {
      role: "assistant",
      content: null,
      tool_calls: [{
        id: toolCall.id,
        type: "function",
        function: {
          name: "refund_payment",
          arguments: JSON.stringify({
            status: "success",
            refunded_id: args.transaction_id,
            message: "Refund issued",
          })
        }
      }]
    };
  } else {
    response = {
      role: "assistant",
      content: "Please use one of the supported tools.",
    };
  }

  res.status(200).json({
    id: "chatcmpl-mock",
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: "paysafe-gpt",
    choices: [
      {
        index: 0,
        message: response,
        finish_reason: "tool_calls",
      },
    ],
    tools: functions || []
  });
}