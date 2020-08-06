# Graphql endpoint

> [Graphql là gì?](https://viblo.asia/p/cung-tim-hieu-ve-graphql-07LKX4zeKV4)  
> Tài liệu [GraphQL | A query language for your API](https://graphql.org/)  
> [JWT là gì?](https://topdev.vn/blog/jwt-la-gi/)

Hệ thống sử dụng Graphql cho giao thức kết nối API giữa client và server, để hiểu đơn giản hơn thì graphql sử dụng Query cho những tác vụ đọc dữ liệu và Mutation cho những tác vụ ghi dữ liệu, thay cho việc phân biệt bằng các phương thức khác nhau (GET, POST, PUT, ..) như của REST.
Tất cả tác vụ đều được phân biệt qua chỉ 1 method GET hoặc POST (khuyến cáo sử dụng POST để bảo mật hơn) nhưng khác dữ liệu trong body (POST method) hoặc query string (GET method) và kiểu (Query/Mutation).
Tất cả Query và được chứa trong thư mục `src/app/schema` và khai báo trong file `src/app/schema/__init__.py`

![](Graphql%20endpoint/Screen%20Shot%202020-08-05%20at%2016.20.42.png ':size=30%')
_src/app/schema_

Hệ thống sử dụng thư viện Graphene để dễ dàng tạo graphql endpoint.
Tài liệu [Graphene-Python](https://docs.graphene-python.org/en/latest/)

Đường dẫn mặc định của Graphql endpoint [http://localhost:5000/graphql](http://localhost:5000/graphql), bạn có đổi bằng cách sửa giá trị của biến `GRAPHQL_ENDPOINT` trong file `src/app/config/__init__.py`.

Đường dẫn mặc định của GraphiQL với method GET [http://localhost:5000/graphql](http://localhost:5000/graphql)

Mặc định thì khi vào GraphiQL thì bạn sẽ nhìn thấy được documentation và có thể run query trực tiếp trên GraphiQL, còn nếu bạn muốn document schema rõ hơn thì có thể generate sử dụng thư viện [graphdoc](https://github.com/2fd/graphdoc) với câu lệnh như sau:

`graphdoc -f -e http://localhost:5000/graphql -o ./graphdoc/schema`

Sau khi generate thì sẽ được document schema như hình dưới.

![](Graphql%20endpoint/Screen%20Shot%202020-08-05%20at%2016.27.45.png ':size=100%')
_Graphdoc documentation_

Để test graphql endpoint thì bạn sẽ phải dùng đến [Postman](https://learning.postman.com/docs/sending-requests/supported-api-frameworks/graphql/) hoặc [Insomnia](https://insomnia.rest/products/core/) để test vì đa số endpoint trong Graphql đều được bảo mật sử dụng JWT token, sẽ không thể test bằng GraphiQL được vì cần phải gửi custom header lên server.

![](Graphql%20endpoint/Screen%20Shot%202020-08-05%20at%2016.33.09.png)
_Test query listUser_

#graphue/codebase #graphue/codebase/backend #graphue/codebase/backend/graphql
