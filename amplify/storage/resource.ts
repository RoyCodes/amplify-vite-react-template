import { defineStorage } from '@aws-amplify/backend';
import { adminTab } from '../functions/admintab/resource';

export const knowledgeBaseRawFiles = defineStorage({
    name: 'knowledgeBaseRawFiles',
    isDefault: true,
    triggers: {
        onUpload: adminTab, },
    access: (allow) => ({
        'knowledge-base-raw-files/*': [
            allow.authenticated.to(['read', 'write', 'delete'])
        ]
    })
});

export const knowledgeBaseProcessedFiles = defineStorage({
    name: 'knowledgeBaseProcessedFiles',
    access: (allow) => ({
        'knowledge-base-processed-files/*': [
          allow.resource(adminTab).to(['read', 'write'])
        ]
      })
});
