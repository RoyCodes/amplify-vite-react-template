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
    <Authenticator
      components={{
        SignIn: {
          Header() {
            return <h1 style={{ textAlign: "center" }}>Sign In</h1>;
          },
          Footer() {
            return <div style={{ textAlign: "center" }}>Need help? Contact support.</div>;
          },
        },
        SignUp: {
          Header() {
            return <h1 style={{ textAlign: "center" }}>Create a New Account</h1>;
          },
          Footer() {
            return <div style={{ textAlign: "center" }}>Welcome to the platform!</div>;
          },
        },
      }}
    >
      {({ signOut, user }) => (
        <main>
          <ContentLayout>
            <Container header={<h1>Welcome, {user?.username || "User"}!</h1>}>
              <Tabs
                tabs={[
                  {
                    label: "Admin",
                    id: "first",
                    content: (
                      <div>
                        <button onClick={createTodo}>+ new</button>
                        <ul>
                          {todos.map((todo) => (
                            <li key={todo.id}>{todo.content}</li>
                          ))}
                        </ul>
                        <div>
                          🥳 App successfully hosted. Try creating a new todo.
                          <br />
                          <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
                            Review next step of this tutorial.
                          </a>
                        </div>
                      </div>
                    ),
                  },
                  {
                    label: "User",
                    id: "second",
                    content: "Second tab content area"
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