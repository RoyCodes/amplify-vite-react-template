import { defineFunction, secret } from '@aws-amplify/backend';

export const adminTab = defineFunction({
    environment: {
        KNOWLEDGE_BASE_ID: secret('KNOWLEDGE_BASE_ID'),
        DATA_SOURCE_ID: secret('DATA_SOURCE_ID'),
    }
});