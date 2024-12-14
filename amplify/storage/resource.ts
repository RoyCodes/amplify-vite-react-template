import { defineStorage } from '@aws-amplify/backend';
import { adminTab } from '../functions/admintab/resource';

export const knowledgeBaseRawFiles = defineStorage({
    name: 'knowledgeBaseRawFiles',
    triggers: {
        onUpload: adminTab},
    access: (allow) => ({
        'knowledge-base-raw-files/*': [
            allow.authenticated.to(['read', 'write', 'delete'])
        ]
    })
});

export const knowledgeBaseProcessedFiles = defineStorage({
    name: 'knowledgeBaseProcessedFiles',
    access: (allow) => ({
        '*': [
          allow.resource(adminTab).to(['read', 'write']), // Allow Lambda to access this bucket
        ],
      }),
});
