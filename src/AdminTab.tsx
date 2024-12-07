import React, { useState } from "react";
import Container from "@cloudscape-design/components/container";
import Input from "@cloudscape-design/components/input";
import Button from "@cloudscape-design/components/button";
import FormField from "@cloudscape-design/components/form-field";
import Alert from "@cloudscape-design/components/alert";

export default function FirstTab() {
  const [file, setFile] = useState<File | null>(null);
  const [uri, setUri] = useState<string>("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleFileUpload = async () => {
    try {
      if (!file) {
        setMessage({ type: "error", text: "No file selected" });
        return;
      }
      // Call backend logic for S3 file upload
      setMessage({ type: "success", text: `File "${file.name}" uploaded successfully!` });
    } catch (error) {
      setMessage({ type: "error", text: "Error uploading file" });
    }
  };

  const handleUriUpload = async () => {
    try {
      if (!uri) {
        setMessage({ type: "error", text: "URI cannot be empty" });
        return;
      }
      // Call backend logic for S3 URI processing
      setMessage({ type: "success", text: "File from URI processed successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Error processing URI" });
    }
  };

  return (
    <Container header={<h2>Upload Files</h2>}>
      {message && (
        <Alert type={message.type} dismissible onDismiss={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}
      <div style={{ marginBottom: "20px" }}>
        <Container header={<h3>File Browser Upload</h3>}>
          <FormField label="Select a file">
            <Input
              type="file"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
          </FormField>
          <Button onClick={handleFileUpload} variant="primary">
            Upload File
          </Button>
        </Container>
      </div>
      <div>
        <Container header={<h3>Upload via URI</h3>}>
          <FormField label="S3 URI">
            <Input
              value={uri}
              onChange={({ detail }) => setUri(detail.value)}
              placeholder="Enter the URI of your S3 file"
            />
          </FormField>
          <Button onClick={handleUriUpload} variant="primary">
            Submit URI
          </Button>
        </Container>
      </div>
    </Container>
  );
}
