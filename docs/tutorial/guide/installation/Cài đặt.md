# Cài đặt

## Backend

> Đề xuất: nên dùng **Pyenv**, **virtualenv** và **Python** version 3.6 trở lên.

```bash
# Ví dụ sử dụng Pyenv và Virtualenv
pyenv virtualenv 3.6.10 <your-env>
pyenv local <your-env>
```

```bash
# Clone và cài thư viện cho python qua pip
git clone https://github.com/nguyenducduy/graphue <your-project>

cd <your-project>/src
pip install -r requirements.txt
```

#### Tạo file cấu hình ẩn (.env)

> Vì sao lại dùng file ẩn, vì file này sẽ chứa những thông tin nhạy cảm của hệ thống, ví dụ như là user để truy cập database, api key/secret key dùng để truy xuất bên thứ 3, ... khi commit code chúng ta sẽ không commit file này lên, chỉ tạo tại server cần sử dụng nó.

`cd <your-project>/src/app/config/` và tạo file `.env` với nội dung như sau:

```bash
# src/app/config/.env
TESTING = True
DEBUG = True
SECRET_KEY = b'_5#y2L"F4Q8z\n\xec]/'

# development environment
DEVELOPMENT_BASE_URI = 'http://localhost:5000'
DEVELOPMENT_SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:root@localhost/graphue'
DEVELOPMENT_REDIS_URI = 'redis://localhost:6379/'
DEVELOPMENT_NOT_FOUND_PAGE_URI = 'http://localhost:8080/404'
DEVELOPMENT_OAUTH_VERIFIED_PAGE_URI = 'http://localhost:8080/oauth'
DEVELOPMENT_GOOGLE_REDIRECT_URI = 'http://localhost:5000/oauth/google'
DEVELOPMENT_GOOGLE_CLIENT_ID = ''
DEVELOPMENT_GOOGLE_CLIENT_SECRET = ''

# production environment
PRODUCTION_BASE_URI = 'http://localhost:5000'
PRODUCTION_SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:root@localhost/graphue'
PRODUCTION_REDIS_URI = 'redis://localhost:6379/'
PRODUCTION_NOT_FOUND_PAGE_URI = 'http://graphue.dev/404'
PRODUCTION_OAUTH_VERIFIED_PAGE_URI = 'http://graphue.dev/oauth'
PRODUCTION_GOOGLE_REDIRECT_URI = 'http://api.graphue.dev/oauth/google'
PRODUCTION_GOOGLE_CLIENT_ID = ''
PRODUCTION_GOOGLE_CLIENT_SECRET = ''


```

File `.env` này sẽ chứa thông tin kết nối MySQL và 1 số dịch vụ khác, codebase đã chia sẵn ra 2 biến môi trường riêng biệt để chuẩn bị cho việc **develop** và **deploy** trở nên tách biệt.

Bạn sẽ cần phải sửa lại thông tin kết nối MySQL để chuẩn bị cho lần **migrate schema** ở bước tiếp theo.

#### Tạo cơ sở dữ liệu trong MySQL và gán quyền cho user trong MySQL:

```sql
-- Tạo database và gán quyền
CREATE DATABASE <db-name>;
GRANT ALL ON <db-name>.* TO admin@'localhost' IDENTIFIED BY '<your-password>';
FLUSH PRIVILEGES;
```

#### Migrate cấu trúc bảng cho database vừa mới tạo

> Chúng ta sẽ dùng migrate schema tool sẵn có của Flask framework nên sẽ dùng chung 1 file cấu hình database sử dụng trong Backend.

Sau khi setup lại đường dẫn MySQL và tạo database rồi thì đơn giản chạy lệnh migrate để tạo những table cần có cho hệ thống.

```bash
# Tạo cấu trúc table cho database
cd <your-project>/src
FLASK_APP=manage.py flask db upgrade
```

Sau khi migrate thành công thì sẽ có được cấu trúc bảng như hình bên dưới:

![](C%C3%A0i%20%C4%91%E1%BA%B7t/Screen%20Shot%202020-07-27%20at%2016.48.47.png ':size=50%')
_SequelPro MySQL viewer_

Lúc này thì Backend đã ready, start backend server với câu lệnh sau:

`FLASK_ENV=development python manage.py`

Thử vào đường dẫn [http://localhost:5000/graphql](http://localhost:5000/graphql), nếu hiện ra như hình bên dưới nghĩa là quá triình setup Backend server đã hoàn tất OK.

![](C%C3%A0i%20%C4%91%E1%BA%B7t/Screen%20Shot%202020-07-27%20at%2016.53.24.png ':size=100%')
_GraphiQL viewer_

### Frontend

> Frontend sử dụng [Vue framework](https://vuejs.org/) và [Ant Design Vue](https://antdv.com/docs/vue/introduce/)
> Đề xuất nên dùng Nodejs version 12.  
> Đường dẫn mặc định cho Frontend: [http://localhost:8080](http://localhost:8080)

```bash
# Cài đặt và start dev server frontend
cd <your-project>/src/template
yarn
yarn serve
```

`cd <your-project>/src/app/template/` và tạo file `.env` với nội dung như sau:

```bash
# src/template/.env
VUE_APP_BASE_TITLE=Graphue
VUE_APP_REST_URI=http://localhost:5000
VUE_APP_GRAPHQL_URI=http://localhost:5000/graphql
VUE_APP_SOCKETIO_URI=http://localhost:5000

VUE_APP_GOOGLE_OAUTH_CLIENT_ID=
VUE_APP_GOOGLE_OAUTH_REDIRECT_URI=
```

File `.env` này chứa thông tin để Frontend kết nối tới Backend server để lấy dữ liệu.

#### Cài đặt quyền quản trị viên

> Mặc định khi setup Backend server sẽ không tạo bất kỳ user nào trong hệ thống, cho nên chúng ta phải tự khởi tạo 1 tài khoản quyền "Administrator" để quản lý hệ thống.

Truy cập vào đường dẫn [http://localhost:8080/install](http://localhost:8080/install) và tạo tài khoản quyền quản trị.

![](C%C3%A0i%20%C4%91%E1%BA%B7t/Screen%20Shot%202020-07-27%20at%2017.06.55.png)
_localhost:8080/install_

Sau khi tạo tài khoản quản trị thành công thì hệ thống sẽ tự chuyển sang trang [http://localhost:8080/admin/login](http://localhost:8080/admin/login) như hình bên dưới:

![](C%C3%A0i%20%C4%91%E1%BA%B7t/Screen%20Shot%202020-07-27%20at%2017.15.47.png)
_localhost:8080/admin/login_

Đăng nhập thành công thì bạn sẽ vào được trang Overview như bên dưới.

![](C%C3%A0i%20%C4%91%E1%BA%B7t/Screen%20Shot%202020-07-27%20at%2017.32.33.png)
_localhost:8080/admin/overview_

> Sau khi đăng nhập thành công thì bạn xóa đường dẫn http://localhost:8080/install để không ai có thể vào đường dẫn này cài đặt lại hệ thống.

Đơn giản bằng cách không load route này trong Backend và Frontend

```python
# src/app/__init__.py
# comment lại 2 dòng này để không load route trong Backend
from .rest.install.default import ns as install_namespace
rest.add_namespace(install_namespace)
```

```typescript
// src/template/router/index.ts
// comment lại block này để không load route trong Frontend installation path
{
  path: "/install",
  component: LoginLayout,
  children: [
    {
      path: "/install",
      meta: {
        title: "Installation"
      },
      component: () =>
        import(
          /* webpackChunkName: "admin_install" */ "../views/Install/index.vue"
        )
    }
  ]
},
```

Sau khi sửa trong 2 file trên thì khi vào đường dẫn `/install`thì hệ thống sẽ tự chuyển qua trang `/404`.

#graphue #graphue/tutorial #graphue/tutorial/guide #graphue/tutorial/guide/installation
