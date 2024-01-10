export class User {
  messages = [];
  total_tokens = null;
  MAX_TOKENS = 10000;
  id = null;
  constructor(id) {
    this.id = id;
    this.messages = [];
    this.total_tokens = 0
    this.MAX_TOKENS = 10000
  }
  setId(id) {
    this.id = id;
  }
  getId() {
    return this.id;
  }
  isExceded() {
    return this.total_tokens >= this.MAX_TOKENS;
  }
  getMessages() {
    return this.messages;
  }
  clearMessages() {
    console.log("clearing messages...");
    this.messages = [];
  }
  appendMessage = async (message = null) => {
    if (message != undefined) {
      this.messages.push(message);
    }
  };
  appendPrompt =  (prompts = null) => {
    if (prompts != undefined) {
      prompts.map((_prompt) => {
        this.messages.push(_prompt);
      });
    }
  };
}
