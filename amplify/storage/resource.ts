import { defineStorage } from '@aws-amplify/backend';
import { adminTab } from '../functions/admintab/resource';

export const storage = defineStorage({
    name: 'knowledgeBase',
    triggers: {
        onUpload: adminTab, },
    access: (allow) => ({
        'knowledge-base-raw-files/*': [allow.authenticated.to(['read', 'write', 'delete'])],
        'knowledge-base-processed-files/*': [allow.resource(adminTab).to(['read', 'write'])]
    })
});