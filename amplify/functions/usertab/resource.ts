import { defineFunction, secret } from '@aws-amplify/backend';

export const userTab = defineFunction({
    environment: {
        ALIAS_ID: secret('ALIAS_ID'),
        AGENT_ID: secret('AGENT_ID'),
    }
});