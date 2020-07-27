import antdEnUS from "ant-design-vue/es/locale-provider/en_US";
const momentEU = require("moment/locale/eu");

const components = {
  antLocale: antdEnUS,
  momentName: "eu",
  momentLocale: momentEU
};

const locale = {
  "views.login.SignIn": "SignIn",
  "views.login.ToGraphue": "to Graphue",
  "views.login.Email": "Email",
  "views.login.Password": "Password",
  "views.login.EmailIsRequired": "Please input your email!",
  "views.login.PasswordIsRequired": "Please input your password!",
  "views.login.ForgotPassword": "Forgot password?",
  "views.login.SignInWithGoogle": "Sign in with Google"
};

export default {
  ...components,
  ...locale
};
