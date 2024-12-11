import Container from "@cloudscape-design/components/container";
import ChatBubble from "@cloudscape-design/chat-components/chat-bubble";
import ButtonGroup from "@cloudscape-design/components/button-group";
import StatusIndicator from "@cloudscape-design/components/status-indicator";
import Avatar from "@cloudscape-design/chat-components/avatar";
import PromptInput from "@cloudscape-design/components/prompt-input";
import * as React from "react";
import { post } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth';

export default function UserTab() {
  const [value, setValue] = React.useState("");

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
      const response = await body.json();

      console.log('POST call succeeded');
      console.log(response);
    } catch (error: any) {
      console.log('POST call failed: ', JSON.parse(error.response.body));
    }
  }



  return (
    <Container header={<h2>Chat with a generative AI assistant</h2>}>

      <ChatBubble
        ariaLabel="Generative AI assistant at 6:35:10pm"
        type="incoming"
        actions={
          <ButtonGroup
            ariaLabel="Chat bubble actions"
            variant="icon"
            items={[
              {
                type: "group",
                text: "Feedback",
                items: [
                  {
                    type: "icon-toggle-button",
                    id: "helpful",
                    iconName: "thumbs-up",
                    pressedIconName: "thumbs-up-filled",
                    text: "Helpful",
                    pressed: true
                  },
                  {
                    type: "icon-toggle-button",
                    id: "not-helpful",
                    iconName: "thumbs-down",
                    pressedIconName: "thumbs-down-filled",
                    text: "Not helpful",
                    pressed: false,
                    disabled: true
                  }
                ]
              },
              {
                type: "icon-button",
                id: "copy",
                iconName: "copy",
                text: "Copy",
                popoverFeedback: (
                  <StatusIndicator type="success">
                    Message copied
                  </StatusIndicator>
                )
              }
            ]}
          />
        }
        avatar={
          <Avatar
            color="gen-ai"
            iconName="gen-ai"
            ariaLabel="Generative AI assistant"
            tooltipText="Generative AI assistant"
          />
        }
      >
        Amazon S3 is built using AWS's highly available and
        reliable infrastructure. Our distributed DNS servers
        ensure that you can consistently route your end
        users to your application.
      </ChatBubble>

      <ChatBubble
        ariaLabel="John Doe at 5:29:02pm"
        type="outgoing"
        avatar={
          <Avatar
            ariaLabel="John Doe"
            tooltipText="John Doe"
            initials="JD"
          />
        }
      >
        What can I do with Amazon S3?
      </ChatBubble>

      <PromptInput
        onChange={({ detail }) => setValue(detail.value)}
        value={value}
        actionButtonAriaLabel="Send message"
        actionButtonIconName="send"
        ariaLabel="Prompt input with action button"
        placeholder="Ask a question"
        onAction={({ detail }) => {postItem(detail.value)}}
      />

    </Container>
  );
}