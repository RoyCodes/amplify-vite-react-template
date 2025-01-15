import { Authenticator } from "@aws-amplify/ui-react";
import "@cloudscape-design/global-styles/index.css";
import "@aws-amplify/ui-react/styles.css";
import "./index.css"
import Tabs from "@cloudscape-design/components/tabs";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Container from "@cloudscape-design/components/container";
import Button from "@cloudscape-design/components/button";
import SpaceBetween from "@cloudscape-design/components/space-between";
import AdminTab from "./AdminTab"
import UserTab from "./UserTab"

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <ContentLayout>
            <Container header={<h1>Welcome, {user?.username || "User"}!</h1>}>
              <SpaceBetween size="l" direction="vertical">
                <Tabs
                  tabs={[
                    {
                      label: "Admin",
                      id: "first",
                      content: (
                        <AdminTab />
                      ),
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
              </SpaceBetween>
            </Container>
          </ContentLayout>
        </main>
      )}
    </Authenticator>
  );
}

export default App;