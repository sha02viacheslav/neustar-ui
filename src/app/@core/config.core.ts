import { environment } from '../../environments/environment';

const apiUrl = 'https://neustar-order-insights-api.ho-g2.cf.comcast.net';
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
  redirectUri: environment.production
    ? 'https://neustar-order-insights-ui.ho-g2.cf.comcast.net/auth'
    : 'http://localhost:4200/auth',
  scope: 'openid%20profile%20email%20User.Read',
  domainHint: 'comcast.com',
};
