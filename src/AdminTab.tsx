import * as React from "react";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Container from "@cloudscape-design/components/container";
import Button from "@cloudscape-design/components/button";
import FileUpload from "@cloudscape-design/components/file-upload";
import FormField from "@cloudscape-design/components/form-field";
import Flashbar from "@cloudscape-design/components/flashbar";
import { uploadData } from '@aws-amplify/storage';

export default function AdminTab() {

  // State
  type FlashbarItem = {
    type: "success" | "error" | "info" | "warning";
    dismissible: boolean;
    dismissLabel: string;
    onDismiss: () => void;
    content: string;
    id: string;
  };
  const [value, setValue] = React.useState<File[]>([]);
  const [flashItems, setFlashItems] = React.useState<FlashbarItem[]>([]);

  // Logic
  const handleSubmit = async () => {
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

      setFlashItems([
        {
          type: "success",
          dismissible: true,
          dismissLabel: "Dismiss message",
          onDismiss: () => setFlashItems([]),
          content: "Upload successful!",
          id: "upload_success",
        },
      ]);



    } catch (error) {
      console.error("File upload failed:", error);

      setFlashItems([
        {
          type: "error",
          dismissible: true,
          dismissLabel: "Dismiss message",
          onDismiss: () => setFlashItems([]),
          content: "Upload error, please try again.",
          id: "upload_error",
        },
      ]);
    } finally {
      setValue([]); // Clear selected files
    }
  };

  return (
    <SpaceBetween direction="vertical" size="m">
      <Header variant="h1">Amazon Bedrock Knowledge Base Management</Header>
      <Container>
        <SpaceBetween direction="vertical" size="s">
        <FormField
          label="Amazon Bedrock Knowledge Base Uploader"
          description="Upload files to your Amazon Bedrock Knowledge Base. They will be converted into vector embeddings for inclusion in converstaions with the Gen AI Assistant"
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
            constraintText="Supported file types are audio: (mp3, wav, flac) and text: (txt, md, html, doc/docx, csv, xls/xlsx, pdf)"
          />
        </FormField>
        <Button
          onClick={handleSubmit}
        >Upload
        </Button>
        <Flashbar items={flashItems} />
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}