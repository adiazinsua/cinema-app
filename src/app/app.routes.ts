export const routes = {
  login: () => 'login',
  createAccount: () => 'create-account',
  home: () => '',
  passwordRecovery: () => 'password-recovery',
  detail: (id: string) => `movie/${id}`,
  changeAvatar: () => 'change-avatar'
};
