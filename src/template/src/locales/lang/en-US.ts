import antdEnUS from 'ant-design-vue/es/locale-provider/en_US'
const momentEU = require('moment/locale/eu')

const components = {
  antLocale: antdEnUS,
  momentName: 'eu',
  momentLocale: momentEU,
}

const locale = {
  // common
  'default.search': 'Find in ',
  'default.refresh': 'Refresh ',

  // profile menu components
  'profilemenu.Hello': 'Heloo, ',
  'profilemenu.LoggedInAs': 'Logged in as ',
  'profilemenu.ChangePassword': 'Change password',
  'profilemenu.Logout': 'Logout',

  // menu
  'menu.Overview': 'Overview',
  'menu.Setting': 'Setting',
  'menu.Menu': 'Navigation menu',
  'menu.User': 'User',
  'menu.List': 'List',
  'menu.Group': 'Group',
  'menu.Permission': 'Permission',

  // login page
  'views.login.SignIn': 'SignIn',
  'views.login.ToGraphue': 'to Graphue',
  'views.login.Email': 'Email',
  'views.login.Password': 'Password',
  'views.login.EmailIsRequired': 'Please input your email!',
  'views.login.PasswordIsRequired': 'Please input your password!',
  'views.login.ForgotPassword': 'Forgot password?',
  'views.login.SignInWithGoogle': 'Sign in with Google',
}

export default {
  ...components,
  ...locale,
}
