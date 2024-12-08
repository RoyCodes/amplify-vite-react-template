import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { userTab } from './functions/usertab/resource';

defineBackend({
  auth,
  data,
  userTab,
});
