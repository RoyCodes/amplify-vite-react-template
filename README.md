## Amazon Bedrock Knowledge Base Management

![Amplify](https://img.shields.io/badge/AWS-Amplify-orange?style=flat-square) ![React](https://img.shields.io/badge/React-v17-blue?style=flat-square) ![License](https://img.shields.io/github/license/RoyCodes/bedrock-kb-prototype?style=flat-square)

## Overview

This Gen AI prototype allows users to upload audio and text into a private knowledge base that augments their chats with the Gen AI assistant. It's built with an Amazon Bedrock Knowledge Base using AWS Amplify (Gen 2), Cloudscape Design System, TypeScript, and React. 

It was built using the AWS Amplify React+Vite Starter Template

## Demo

![Prototype Demo](src/assets/bedrock-kb-prototype-demo.gif)

## Features

- **Chatbot Interaction**: Enables conversations with a Gen AI assistant via Amazon Bedrock Foundation Models.
- **File Uploads**: Supports audio (mp3, wav, flac) and text (txt, md, html, docx, pdf) file uploads to S3.
- **Real-time Transcription**: Converts audio via Amazon Transcribe speech-to-text and uploads the results to S3.
- **Knowledge Base Integration**: Processed text is then uploaded into an Amazon Bedrock Knowledge base for augmenting user inquiries. 
- **Responsive Design**: Built with Cloudscape components for a seamless user experience that's familiar to AWS users.

## Architecture

![Architecture Diagram](src/assets/reference-architecture.png)

### Components:

1. **Frontend**: React app styled with Cloudscape Design System.
2. **Backend**: Serverless architecture using AWS Amplify and CDK.
3. **AI Services**:
   - Amazon Bedrock for generative AI and knowledge base.
   - Amazon Transcribe for audio transcription.
4. **Authentication**: Amazon Cognito for user authentication.
5. **Storage**: Amazon S3 for raw and processed files.

## Getting Started

### Prerequisites

- AWS account
- Node.js and npm
- Amplify CLI

### Installation

1. Create a new project in AWS Amplify
- Remember to choose a region that supports all of the Amazon Bedrock features that you wish to use.

2. Clone the repository:
   ```bash
   git clone https://github.com/username/repo-name.git
   cd repo-name
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Initialize Amplify:
   ```bash
   amplify init
   amplify push
   ```

### Configuration

Set up Amazon Bedrock
- Request access to models
- Create Knowledge Base
- Warning - leaving a Knowledge base up and running provisions resources that accrue ongoing costs.

Set the following environment variables within your Amplify project:
- `KNOWLEDGE_BASE_ID`
- `DATA_SOURCE_ID`

## Usage

### Upload Files

1. Navigate to the Admin tab.
2. Upload supported files.
3. View success or error notifications via Flashbar.
4. The file is sent to a folder in an S3 bucket called "raw-files". On that PUT event, the admintab AWS Lambda Function will be triggered and begin processing the file. If its audio, it will be sent to Amazon Transcribem where a Job will be created to perform speech-to-text on the file. This will output a TXT file to a folder called "processed-files" within the S3 bucket. PUT events to the "processed-files" folder trigger a refresh of the Amazon Bedrock Knowledge Base.

### Chatbot Interaction

1. Switch to the User tab.
2. Start chatting with the generative AI assistant.
3. From the frontend, user text is sent to the usertab AWS Lambda Function, where the input is sent to the Knowledge Base to be enriched with relevant uploaded data. The endriched input is then sent to the Amazon Bedrock model before returning the reply to the user.
3. Observe responses tailored to the knowledge base.

## Tech Stack

- **Frontend**: Typescript, React, Cloudscape Design System
- **Backend**: AWS Amplify, AWS Lambda, AWS API Gateway, AWS CDK
- **AI**: Amazon Bedrock, Amazon Transcribe
- **Authentication**: Amazon Cognito
- **Storage**: Amazon S3

## Lessons Learned

- **Amplify Gen 2**: Streamlined backend workflows and seamless deployment. The Gen 2 interface and feature set is very well packaged and is motivating me to move my Gen 1 projects over.
- **Cloudscape**: Simplified component-based UI design. The documentation and sample playground are robust and made learning easy. Also, the Figma integration helped me to mock up my ideas before I started implementing the features.
- **Amazon Bedrock**: Practical integration of generative AI with knowledge bases. Trying out different foundation models and experimenting with prompting is very approachable.

## License
This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.