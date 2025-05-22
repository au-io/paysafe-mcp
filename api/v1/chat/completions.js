export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://platform.openai.com");
  res.setHeader("Access-Control-Allow-Headers", "*");

  const { messages, tools } = req.body;

  const latest = messages[messages.length - 1];
  const toolCall = latest.tool_calls?.[0];

  let response;

  // 1️⃣ If OpenAI is calling the tool (second round)
  if (toolCall?.function?.name === "create_payment_link") {
    const args = JSON.parse(toolCall.function.arguments);

    response = {
      role: "tool",
      tool_call_id: toolCall.id,
      content: JSON.stringify({
        url: `https://pay.paysafe.com/link/${Math.floor(Math.random() * 1000000)}`,
        amount: args.amount,
        currency: args.currency,
        expires_in: "10m"
      })
    };

  } else if (toolCall?.function?.name === "refund_payment") {
    const args = JSON.parse(toolCall.function.arguments);

    response = {
      role: "tool",
      tool_call_id: toolCall.id,
      content: JSON.stringify({
        status: "success",
        refunded_id: args.transaction_id,
        message: "Refund issued"
      })
    };

  } else {
    // 2️⃣ If this is the user's first message (first round)
    const userMessage = messages.find(m => m.role === "user")?.content.toLowerCase() || "";

    if (userMessage.includes("create a payment link")) {
      response = {
        role: "assistant",
        content: null,
        tool_calls: [
          {
            id: "toolcall-create-payment",
            type: "function",
            function: {
              name: "create_payment_link",
              arguments: JSON.stringify({
                amount: 2000,
                currency: "USD",
                customer_email: "test@example.com"
              })
            }
          }
        ]
      };
    } else if (userMessage.includes("refund")) {
      response = {
        role: "assistant",
        content: null,
        tool_calls: [
          {
            id: "toolcall-refund-payment",
            type: "function",
            function: {
              name: "refund_payment",
              arguments: JSON.stringify({
                transaction_id: "txn_123456",
                reason: "requested_by_customer"
              })
            }
          }
        ]
      };
    } else {
      response = {
        role: "assistant",
        content: "Please specify if you want to create a payment link or issue a refund."
      };
    }
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
        finish_reason: toolCall ? "stop" : (response.tool_calls ? "tool_calls" : "stop")
      }
    ],
    tools: tools || []
  });
}
