import { environment } from '../../environments/environment';

// TODO: update URLs
const apiUrl = 'https://<INSERT API CF LINK HERE>';
export const ServerDetails = {
  baseUrl: environment.production ? apiUrl : 'http://localhost:3000',
  analytics: false,
  routerConfig: {
    withCredentials: true,
  },
};

export const SsoConfig = {
  clientId: 'ebd42110-12bc-4b5a-a9a8-789742e37969',
  responseType: 'code',
  redirectUri: environment.production ? 'https://<INSERT UI CF LINK HERE>/auth' : 'http://localhost:4200/auth',
  scope: 'openid%20profile%20email%20User.Read',
  domainHint: 'comcast.com',
};
