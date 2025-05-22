# 🧠 Paysafe MCP Server (Vercel-Compatible)

This is a lightweight, **MCP-compatible server** designed to work with the **OpenAI Playground** and simulate Stripe-style payment functions like:

- `create_payment_link`
- `refund_payment`

Built with:
- 🟢 Serverless functions (Vercel)
- 📦 Plain JavaScript (`/api` structure)
- 🌐 Full MCP + Function Calling support

---

## ✅ Features

- `GET /v1/models`: exposes available model(s)
- `POST /v1/chat/completions`: handles chat and function calls
- 🎯 Supports OpenAI-style function calling (e.g., GPT triggers `create_payment_link`)
- 🛡️ Mocked responses — ideal for prototyping and demo

---

## 📁 Project Structure

```

.
├── api/
│   └── v1/
│       ├── models.js
│       └── chat/
│           └── completions.js
├── vercel.json
├── package.json
└── README.md

````

---

## 🚀 Local Dev (with Cursor or Vercel CLI)

1. **Install dependencies (if needed):**
   ```bash
   npm install
````

2. **Run locally (if using Vercel CLI):**

   ```bash
   vercel dev
   ```

3. **Test endpoints manually:**

   * List models:

     ```bash
     curl http://localhost:3000/v1/models
     ```

   * Test chat completion:

     ```bash
     curl -X POST http://localhost:3000/v1/chat/completions \
       -H "Content-Type: application/json" \
       -d '{
         "model": "paysafe-gpt",
         "messages": [{
           "role": "user",
           "content": "Create a payment link for $20"
         }]
       }'
     ```

---

## 🌐 Deploy to Vercel

1. Upload this project at [vercel.com/new](https://vercel.com/new)
2. Choose **"Other"** as the framework preset
3. Deploy and note your live base URL

Example deployed endpoints:

```
GET https://your-app.vercel.app/v1/models
POST https://your-app.vercel.app/v1/chat/completions
```

---

## 🔌 Connect to OpenAI Playground

1. Go to: [https://platform.openai.com/playground](https://platform.openai.com/playground)
2. Click model dropdown → "Add Model"
3. Fill:

   * **Base URL**: your deployed Vercel URL (e.g., `https://your-app.vercel.app`)
   * **Model ID**: `paysafe-gpt`
   * **Auth Token**: *(Leave blank unless auth is added)*
4. Add function definitions like below.

---

## 📚 Example Function Definitions

```json
[
  {
    "name": "create_payment_link",
    "description": "Create a payment link for a customer",
    "parameters": {
      "type": "object",
      "properties": {
        "amount": { "type": "number" },
        "currency": { "type": "string" },
        "customer_email": { "type": "string" }
      },
      "required": ["amount", "currency", "customer_email"]
    }
  },
  {
    "name": "refund_payment",
    "description": "Refund a completed payment",
    "parameters": {
      "type": "object",
      "properties": {
        "transaction_id": { "type": "string" },
        "reason": { "type": "string" }
      },
      "required": ["transaction_id"]
    }
  }
]
```

---

## 🛠 TODO

* [ ] Add real payments backend integration (Stripe, Paysafe, etc.)
* [ ] Add logging & metrics
* [ ] Optional: Token-based auth using env variables

---

## 👋 Author

Built for internal experimentation and developer AI agents.

MIT License.

