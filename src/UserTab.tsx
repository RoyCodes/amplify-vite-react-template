import Container from "@cloudscape-design/components/container";
import ChatBubble from "@cloudscape-design/chat-components/chat-bubble";
// import ButtonGroup from "@cloudscape-design/components/button-group";
// import StatusIndicator from "@cloudscape-design/components/status-indicator";
import Avatar from "@cloudscape-design/chat-components/avatar";
import PromptInput from "@cloudscape-design/components/prompt-input";
import * as React from "react";
import { post } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';

export default function UserTab() {

  type Message = {
    sender: string;
    content: string;
    type: "incoming" | "outgoing";
    timestamp: Date;
    iconName: "gen-ai" | "user-profile";
    ariaLabel: string;
    tooltipText: string;
  };

  // State
  const [value, setValue] = React.useState("");
  const [message, setMessage] = React.useState<Message[]>([
    {
      sender: 'AI',
      content: 'Welcome! How can I assist you today?',
      type: "incoming",
      timestamp: new Date(),
      iconName: "gen-ai",
      ariaLabel: "Generative AI assistant",
      tooltipText: "Generative AI assistant"
    }
  ]);

  // Logic
  async function postItem(detail: string) {
    try {

      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken

      const restOperation = post({
        apiName: 'chatApi',
        path: '/chat',
        options: {
          body: {
            message: detail
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });

      const { body } = await restOperation.response;
      const response = await body.text();

      setMessage((prevMessages) => [
        ...prevMessages,
        {
          sender: "AI",
          content: response,
          type: "incoming",
          timestamp: new Date(),
          iconName: "gen-ai",
          ariaLabel: "Generative AI assistant",
          tooltipText: "Generative AI assistant",
        },
      ]);
      console.log('POST call succeeded');
      console.log(response);
    } catch (error: any) {
      console.log('POST call failed: ', JSON.parse(error.response.body));
    }
  }

  // Render
  return (
    <Container header={<h2>Chat with a generative AI assistant</h2>}>

      <Container>
        {message.map((msg, index) => (
          < ChatBubble
            key={index}
            ariaLabel={`${msg.sender} at ${msg.timestamp.toLocaleDateString()}`}
            type={msg.type}
            avatar={
              <Avatar
                iconName={msg.iconName}
                ariaLabel={msg.ariaLabel}
                tooltipText={msg.tooltipText}
              />
            }
          >
            {msg.content}
          </ChatBubble>
        ))}
      </Container>

      <PromptInput
        onChange={({ detail }) => setValue(detail.value)}
        value={value}
        actionButtonAriaLabel="Send message"
        actionButtonIconName="send"
        ariaLabel="Prompt input with action button"
        placeholder="Ask a question"
        onAction={({ detail }) => {
          postItem(detail.value);
          setMessage((prevMessages) => [
            ...prevMessages,
            {
              sender: "User",
              content: detail.value,
              type: "outgoing",
              timestamp: new Date(),
              iconName: "user-profile",
              ariaLabel: "User",
              tooltipText: "User",
            },
          ]);
          setValue("");
        }}
      />
    </Container>
  );
}