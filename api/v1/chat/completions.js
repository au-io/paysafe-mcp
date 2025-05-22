export default async function handler(req, res) {
  const { messages, functions } = req.body;

  const latest = messages[messages.length - 1];
  const fnCall = latest.function_call;

  let response;
  if (fnCall?.name === "create_payment_link") {
    const args = JSON.parse(fnCall.arguments);
    response = {
      role: "function",
      name: "create_payment_link",
      content: JSON.stringify({
        url: `https://pay.paysafe.com/link/${Math.floor(Math.random() * 1000000)}`,
        amount: args.amount,
        currency: args.currency,
        expires_in: "10m",
      }),
    };
  } else if (fnCall?.name === "refund_payment") {
    const args = JSON.parse(fnCall.arguments);
    response = {
      role: "function",
      name: "refund_payment",
      content: JSON.stringify({
        status: "success",
        refunded_id: args.transaction_id,
        message: "Refund issued",
      }),
    };
  } else {
    response = {
      role: "assistant",
      content: "Please use one of the supported functions.",
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
        finish_reason: "stop",
      },
    ],
  });
}