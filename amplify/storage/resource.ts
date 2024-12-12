import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'knowledgeBase',
    access: (allow) => ({
        'knowledge-base-raw-files/*': [
            allow.authenticated.to(['read', 'write', 'delete'])
        ]
    })
});