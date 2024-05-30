export default {
  functions: [
    {
      name: "get_order_data",
      description: "Get order data from string",
      parameters: {
        type: "object",
        properties: {
          order_data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                symbol: { type: "string", description: "Symbol of the order" },
                side: { type: "string", description: "Side of the order" },
                type: { type: "string", description: "Type of the order" },
                price: { type: "string", description: "Price of the order" },
                takeProfit: { type: "string", description: "Take profit of the order" },
                stopLoss: { type: "string", description: "Stop loss of the order" },
                quantity: { type: "string", description: "Quantity of the order" },
              },
            },
          },
        },
        required: ["order_data"],
      },
    },
  ],
};
