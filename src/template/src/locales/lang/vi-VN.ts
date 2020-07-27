import antdViVN from "ant-design-vue/es/locale-provider/vi_VN";
const momentVI = require("moment/locale/vi");

const components = {
  antLocale: antdViVN,
  momentName: "vi",
  momentLocale: momentVI
};

const locale = {
  "views.login.SignIn": "Đăng nhập",
  "views.login.ToGraphue": "hệ quản trị",
  "views.login.Email": "Email",
  "views.login.Password": "Mật khẩu",
  "views.login.EmailIsRequired": "Vui lòng nhập email!",
  "views.login.PasswordIsRequired": "Vui lòng nhập mật khẩu!",
  "views.login.ForgotPassword": "Quên mật khẩu?",
  "views.login.SignInWithGoogle": "Đăng nhập với tài khoản Google"
};

export default {
  ...components,
  ...locale
};
