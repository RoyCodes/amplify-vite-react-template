import { defineFunction, secret } from '@aws-amplify/backend';

export const userTab = defineFunction({
    environment: {
        KNOWLEDGE_BASE_ID: secret('KNOWLEDGE_BASE_ID'),
        MODEL_ID: secret('MODEL_ID'),
    }
});