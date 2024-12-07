import { useState } from "react";
import Container from "@cloudscape-design/components/container";
import Input from "@cloudscape-design/components/input";
import Button from "@cloudscape-design/components/button";
import FormField from "@cloudscape-design/components/form-field";
import Box from "@cloudscape-design/components/box";

type Message = {
  content: string;
  sender: "user" | "bot";
  timestamp: string;
};

export default function UserTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user's message
    const userMessage: Message = {
      content: input,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate response from a model like Amazon Bedrock
    const botResponse: Message = {
      content: `Echo: ${input}`, // Replace this with your model's response
      sender: "bot",
      timestamp: new Date().toISOString(),
    };
    setTimeout(() => setMessages((prev) => [...prev, botResponse]), 1000);
  };

  return (
    <Container header={<h2>Chat with Bedrock Model</h2>}>
      <div style={{ height: "400px", overflowY: "auto", marginBottom: "16px", border: "1px solid #d1d5db", borderRadius: "4px", padding: "8px" }}>
        {messages.map((message, index) => (
          <Box key={index} margin={{ bottom: "s" }}>
            <div>
              <strong>{message.sender === "user" ? "You" : "AI"}:</strong>{" "}
              <span>{message.content}</span>
            </div>
            <small style={{ color: "#6b7280" }}>{new Date(message.timestamp).toLocaleTimeString()}</small>
          </Box>
        ))}
      </div>
      <FormField label="Your Message">
        <Input
          value={input}
          onChange={({ detail }) => setInput(detail.value)}
          placeholder="Type your message..."
        />
      </FormField>
      <Button onClick={handleSendMessage} variant="primary">
        Send
      </Button>
    </Container>
  );
}
