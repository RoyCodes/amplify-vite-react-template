import Container from "@cloudscape-design/components/container";
import Button from "@cloudscape-design/components/button";
import FormField from "@cloudscape-design/components/form-field";

export default function FirstTab() {
  return (
    <Container header={<h2>Upload Files</h2>}>
      <div style={{ marginBottom: "20px" }}>
        <Container header={<h3>File Browser Upload</h3>}>
          <FormField label="Select a file">
          </FormField>
          <Button variant="primary">
            Upload File
          </Button>
        </Container>
      </div>
      <div>
        <Container header={<h3>Upload via URI</h3>}>
          <FormField label="S3 URI">
          </FormField>
          <Button variant="primary">
            Submit URI
          </Button>
        </Container>
      </div>
    </Container>
  );
}