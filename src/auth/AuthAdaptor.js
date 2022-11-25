import Roles from '@eazyrent/Roles';
import themesConfig from 'app/configs/themesConfig';

const genDisplayName = (apiUser) => {
  if (!apiUser.first_name && !apiUser.last_name) {
    return apiUser.email;
  }
  return apiUser.first_name + ' '.concat(apiUser.last_name);
};

function UserAdaptor(apiUser, apiCompany, apiUserConfig) {
  return {
    id: apiUser.id,
    role: apiUser.groups,
    company: apiUser.company,
    loginRedirectUrl: Roles[apiUser.groups[0]].url,
    data: {
      displayName: genDisplayName(apiUser),
      displayRole: Roles[apiUser.groups[0]].name,
      email: apiUser.email,
      settings: {
        theme: {
          main: apiUserConfig?.dark_mode ? themesConfig.defaultDark : themesConfig.default,
          toolbar: apiUserConfig?.dark_mode ? themesConfig.defaultDark : themesConfig.default,
        },
      },
    },
  };
}

export default UserAdaptor;
