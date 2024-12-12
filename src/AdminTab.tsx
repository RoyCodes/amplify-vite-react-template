import * as React from "react";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Container from "@cloudscape-design/components/container";
import Button from "@cloudscape-design/components/button";
import FileUpload from "@cloudscape-design/components/file-upload";
import FormField from "@cloudscape-design/components/form-field";
import { uploadData } from '@aws-amplify/storage';

export default function AdminTab() {

  // State
  const [value, setValue] = React.useState<File[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [uploadStatus, setUploadStatus] = React.useState<string | null>(null);

  // Logic
  const handleSubmit = async () => {
    setUploading(true);
    setUploadStatus(null);

    try {
      for (const file of value) {
        const path = `knowledge-base-raw-files/${file.name}`;

        console.log(`Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}`);

        await uploadData({
          path: path,
          data: file,
          options: {
            contentType: file.type, // Specify MIME type
          },
        });
      }

      setUploadStatus("Files uploaded successfully.");
    } catch (error) {
      console.error("File upload failed:", error);
      setUploadStatus("File upload failed. Please try again.");
    } finally {
      setUploading(false);
      setValue([]);
    }
  };

  return (
    <SpaceBetween direction="vertical" size="m">
      <Header variant="h1">Upload files to Knowledge Base</Header>
      <Container>
        <FormField
          label="Form field label"
          description="Description"
        >
          <FileUpload
            onChange={({ detail }) => setValue(detail.value)}
            value={value}
            i18nStrings={{
              uploadButtonText: e =>
                e ? "Choose files" : "Choose file",
              dropzoneText: e =>
                e
                  ? "Drop files to upload"
                  : "Drop file to upload",
              removeFileAriaLabel: e =>
                `Remove file ${e + 1}`,
              limitShowFewer: "Show fewer files",
              limitShowMore: "Show more files",
              errorIconAriaLabel: "Error",
              warningIconAriaLabel: "Warning"
            }}
            showFileLastModified
            showFileSize
            showFileThumbnail
            tokenLimit={3}
            constraintText="Hint text for file requirements"
          />
        </FormField>
        <Button
          onClick={handleSubmit}
        >Upload
        </Button>
      </Container>
    </SpaceBetween>
  );
}