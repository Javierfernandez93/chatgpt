export default {
  functions: [
    {
      name: "get_messagedata",
      description: "Get message data from email",
      parameters: {
        type: "object",
        properties: {
          email_data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", description: "Name of person" },
                amount: { type: "string", description: "Amount paid" },
                payment_status: {
                  type: "string",
                  description: "Payment status",
                },
                policy_number: {
                  type: "string",
                  description: "Number of policy or contract",
                },
              },
            },
          },
        },
        required: ["email_data"],
      },
    },
  ],
};
