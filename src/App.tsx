import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from "@aws-amplify/ui-react";
import "@cloudscape-design/global-styles/index.css";
import "@aws-amplify/ui-react/styles.css";
import Tabs from "@cloudscape-design/components/tabs";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Container from "@cloudscape-design/components/container";
import Button from "@cloudscape-design/components/button";
import AdminTab from "./AdminTab"
import UserTab from "./UserTab"

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <ContentLayout>
            <Container header={<h1>Welcome, {user?.username || "User"}!</h1>}>
              <Tabs
                tabs={[
                  {
                    label: "Admin",
                    id: "first",
                    content: <AdminTab />

                  },
                  {
                    label: "User",
                    id: "second",
                    content: <UserTab />
                  }
                ]}
                variant="container"
              />
              <Button onClick={signOut}> Sign out </Button>
            </Container>
          </ContentLayout>

        </main>
      )}
    </Authenticator>
  );
}

export default App;