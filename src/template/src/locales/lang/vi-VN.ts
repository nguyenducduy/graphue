import antdViVN from 'ant-design-vue/es/locale-provider/vi_VN'
const momentVI = require('moment/locale/vi')

const components = {
  antLocale: antdViVN,
  momentName: 'vi',
  momentLocale: momentVI,
}

const locale = {
  // common
  'default.search': 'Tìm trong ',
  'default.refresh': 'Làm mới ',

  // profile menu components
  'profilemenu.Hello': 'Xin chào, ',
  'profilemenu.LoggedInAs': 'Đăng nhập quyền ',
  'profilemenu.ChangePassword': 'Đổi mật khẩu',
  'profilemenu.Logout': 'Thoát',

  // menu
  'menu.Overview': 'Tổng quan',
  'menu.Setting': 'Cài đặt',
  'menu.Menu': 'Cây điều hướng',
  'menu.User': 'Thành viên',
  'menu.List': 'Danh sách',
  'menu.Group': 'Nhóm',
  'menu.Permission': 'Quyền',

  // login page
  'views.login.SignIn': 'Đăng nhập',
  'views.login.ToGraphue': 'hệ quản trị',
  'views.login.Email': 'Email',
  'views.login.Password': 'Mật khẩu',
  'views.login.EmailIsRequired': 'Vui lòng nhập email!',
  'views.login.PasswordIsRequired': 'Vui lòng nhập mật khẩu!',
  'views.login.ForgotPassword': 'Quên mật khẩu?',
  'views.login.SignInWithGoogle': 'Đăng nhập với tài khoản Google',
}

export default {
  ...components,
  ...locale,
}
