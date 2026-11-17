export const ENV = {
  dp7: {
    baseUrl: 'https://dp7.lab.daegi.dev',
    authUrl: 'https://auth.dp7.lab.daegi.dev',
    managementUrl: 'https://management.dp7.lab.daegi.dev',
  },
  lab: {
    baseUrl: 'https://dp7.lab.daegi.dev',
    authUrl: 'https://auth.dp7.lab.daegi.dev',
    managementUrl: 'https://management.dp7.lab.daegi.dev',
  },
  naufalans: {
    baseUrl: 'https://fe.naufalans.me',
    authUrl: 'https://auth.naufalans.me',
    managementUrl: 'https://management.naufalans.me',
  },
};

const activeKey = (__ENV && (__ENV.APP_ENV || (__ENV.APP_URL && __ENV.APP_URL.includes('naufalans') ? 'naufalans' : 'dp7'))) || 'dp7';
export const CURRENT_ENV = ENV[activeKey] || ENV.dp7;
