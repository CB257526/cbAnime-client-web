# CB Anime 用户服务API文档


**简介**:CB Anime 用户服务API文档


**HOST**:http://localhost:8081


**联系人**:CB Anime Team


**Version**:v1.0.0


**接口路径**:/v3/api-docs/default


[TOC]






# 认证管理


## 发送验证码


**接口地址**:`/api/auth/captcha`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>向指定邮箱发送登录验证码，验证码有效期为5分钟。同一邮箱发送间隔不少于60秒。</p>



**请求示例**:


```javascript
{
  "email": "user@example.com"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|registerCaptchaDTO|目标邮箱|body|true|RegisterCaptchaDTO|RegisterCaptchaDTO|
|&emsp;&emsp;email|邮箱||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|发送成功|ResultVoid|
|400|邮箱格式不正确|ResultVoid|
|401|Unauthorized|ResultVoid|
|404|Not Found|ResultVoid|
|405|Method Not Allowed|ResultVoid|
|429|发送过于频繁，请稍后再试|ResultVoid|
|500|Internal Server Error|ResultVoid|
|502|Bad Gateway|ResultVoid|
|503|Service Unavailable|ResultVoid|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-401**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-404**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-405**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-429**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-502**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-503**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


## 用户登录


**接口地址**:`/api/auth/login`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>使用邮箱和密码进行登录验证，验证成功后返回JWT访问令牌和刷新令牌。返回的access_token用于后续接口认证，refresh_token用于续期。</p>



**请求示例**:


```javascript
{
  "email": "user@example.com",
  "password": "password123",
  "captchaCode": "a1b2c3d4"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|loginDTO|登录参数，包含邮箱、密码和验证码|body|true|LoginDTO|LoginDTO|
|&emsp;&emsp;email|用户邮箱||true|string||
|&emsp;&emsp;password|密码（6-20位）||true|string||
|&emsp;&emsp;captchaCode|验证码内容||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|登录成功，返回令牌信息|TokenDTO|
|400|参数校验失败|ResultVoid|
|401|认证失败，用户名密码错误或验证码错误|ResultVoid|
|404|Not Found|ResultVoid|
|405|Method Not Allowed|ResultVoid|
|429|请求过于频繁|ResultTokenDTO|
|500|Internal Server Error|ResultVoid|
|502|Bad Gateway|ResultVoid|
|503|Service Unavailable|ResultVoid|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|accessToken|访问令牌|string||
|refreshToken|刷新令牌|string||
|accessTokenExpireTime|访问令牌过期时间戳（毫秒）|integer(int64)|integer(int64)|
|refreshTokenExpireTime|刷新令牌过期时间戳（毫秒）|integer(int64)|integer(int64)|
|tokenType|令牌类型，默认为Bearer|string||
|expiresIn|访问令牌有效期（秒）|integer(int64)|integer(int64)|


**响应示例**:
```javascript
{
	"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	"accessTokenExpireTime": 1709337600000,
	"refreshTokenExpireTime": 1709424000000,
	"tokenType": "Bearer",
	"expiresIn": 1800
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-401**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-404**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-405**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-429**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data||TokenDTO|TokenDTO|
|&emsp;&emsp;accessToken|访问令牌|string||
|&emsp;&emsp;refreshToken|刷新令牌|string||
|&emsp;&emsp;accessTokenExpireTime|访问令牌过期时间戳（毫秒）|integer(int64)||
|&emsp;&emsp;refreshTokenExpireTime|刷新令牌过期时间戳（毫秒）|integer(int64)||
|&emsp;&emsp;tokenType|令牌类型，默认为Bearer|string||
|&emsp;&emsp;expiresIn|访问令牌有效期（秒）|integer(int64)||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {
		"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
		"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
		"accessTokenExpireTime": 1709337600000,
		"refreshTokenExpireTime": 1709424000000,
		"tokenType": "Bearer",
		"expiresIn": 1800
	},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-502**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-503**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


## 用户登出


**接口地址**:`/api/auth/logout`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>退出当前登录状态，清除服务端存储的刷新令牌。登出后访问令牌仍可在过期前短暂使用，建议登出后清除本地存储的令牌。</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|登出成功|ResultVoid|
|400|Bad Request|ResultVoid|
|401|未登录或令牌已失效|ResultVoid|
|404|Not Found|ResultVoid|
|405|Method Not Allowed|ResultVoid|
|500|Internal Server Error|ResultVoid|
|502|Bad Gateway|ResultVoid|
|503|Service Unavailable|ResultVoid|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-401**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-404**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-405**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-502**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-503**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


## 获取当前用户信息


**接口地址**:`/api/auth/me`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取当前登录用户的详细信息，包括用户ID、昵称、邮箱、头像等。需要携带有效的访问令牌。</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|获取成功|UserDTO|
|400|Bad Request|ResultVoid|
|401|未登录或令牌已失效|ResultVoid|
|404|Not Found|ResultVoid|
|405|Method Not Allowed|ResultVoid|
|500|Internal Server Error|ResultVoid|
|502|Bad Gateway|ResultVoid|
|503|Service Unavailable|ResultVoid|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id|用户ID|integer(int64)|integer(int64)|
|nickname|用户昵称|string||
|email|用户邮箱|string||
|avatar|头像URL|string||
|gender|性别: 0=未知, 1=男, 2=女|integer(int32)|integer(int32)|
|birthday|生日|string||
|status|状态: 0=禁用, 1=正常|integer(int32)|integer(int32)|
|role|角色编码|string||
|permissions|权限列表（逗号分隔）|string||


**响应示例**:
```javascript
{
	"id": 1,
	"nickname": "二次元爱好者",
	"email": "user@example.com",
	"avatar": "https://your-oss.com/avatar/1.png",
	"gender": 1,
	"birthday": "2000-01-01",
	"status": 1,
	"role": "USER",
	"permissions": "user:read,content:read"
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-401**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-404**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-405**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-502**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-503**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


## 刷新令牌


**接口地址**:`/api/auth/refresh`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>使用刷新令牌获取新的访问令牌和刷新令牌。当访问令牌即将过期时使用。刷新令牌过期后需重新登录。</p>



**请求示例**:


```javascript
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|refreshTokenDTO|刷新令牌参数|body|true|RefreshTokenDTO|RefreshTokenDTO|
|&emsp;&emsp;refreshToken|刷新令牌||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|刷新成功，返回新令牌|TokenDTO|
|400|Bad Request|ResultVoid|
|401|刷新令牌无效或已过期|ResultVoid|
|404|Not Found|ResultVoid|
|405|Method Not Allowed|ResultVoid|
|500|Internal Server Error|ResultVoid|
|502|Bad Gateway|ResultVoid|
|503|Service Unavailable|ResultVoid|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|accessToken|访问令牌|string||
|refreshToken|刷新令牌|string||
|accessTokenExpireTime|访问令牌过期时间戳（毫秒）|integer(int64)|integer(int64)|
|refreshTokenExpireTime|刷新令牌过期时间戳（毫秒）|integer(int64)|integer(int64)|
|tokenType|令牌类型，默认为Bearer|string||
|expiresIn|访问令牌有效期（秒）|integer(int64)|integer(int64)|


**响应示例**:
```javascript
{
	"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	"accessTokenExpireTime": 1709337600000,
	"refreshTokenExpireTime": 1709424000000,
	"tokenType": "Bearer",
	"expiresIn": 1800
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-401**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-404**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-405**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-502**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-503**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


## 用户注册


**接口地址**:`/api/auth/register`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>注册新用户账号，需要提供用户名、密码和邮箱。注册成功后会自动登录并返回JWT令牌。</p>



**请求示例**:


```javascript
{
  "nickname": "anime_user_2024",
  "password": "password123",
  "email": "user@example.com",
  "captchaCode": "a1b2c3d4"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|registerDTO|注册参数，包含用户名、密码和邮箱|body|true|RegisterDTO|RegisterDTO|
|&emsp;&emsp;nickname|用户名（3-20位字母数字下划线）||true|string||
|&emsp;&emsp;password|密码（6-20位）||true|string||
|&emsp;&emsp;email|用户邮箱||true|string||
|&emsp;&emsp;captchaCode|验证码内容||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|注册成功|ResultVoid|
|400|参数校验失败|ResultVoid|
|401|Unauthorized|ResultVoid|
|404|Not Found|ResultVoid|
|405|Method Not Allowed|ResultVoid|
|409|用户名或邮箱已存在|ResultVoid|
|500|Internal Server Error|ResultVoid|
|502|Bad Gateway|ResultVoid|
|503|Service Unavailable|ResultVoid|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-401**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-404**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-405**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-409**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-502**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-503**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


# 用户管理


## 管理员查看用户详情


**接口地址**:`/api/user/admin/detail/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取指定用户的详细信息，仅限管理员访问。需要user:read或user:admin权限之一。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|用户ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|获取成功|ResultString|
|400|Bad Request|ResultVoid|
|401|未登录或令牌已失效|ResultVoid|
|403|权限不足|ResultString|
|404|用户不存在|ResultVoid|
|405|Method Not Allowed|ResultVoid|
|500|Internal Server Error|ResultVoid|
|502|Bad Gateway|ResultVoid|
|503|Service Unavailable|ResultVoid|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|string||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": "",
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-401**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|string||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": "",
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-404**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-405**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-502**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-503**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


## 管理员获取用户列表


**接口地址**:`/api/user/admin/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取系统所有用户的列表，仅限管理员访问。</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|获取成功|ResultString|
|400|Bad Request|ResultVoid|
|401|未登录或令牌已失效|ResultVoid|
|403|需要管理员权限|ResultString|
|404|Not Found|ResultVoid|
|405|Method Not Allowed|ResultVoid|
|500|Internal Server Error|ResultVoid|
|502|Bad Gateway|ResultVoid|
|503|Service Unavailable|ResultVoid|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|string||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": "",
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-401**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|string||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": "",
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-404**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-405**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-502**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-503**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


## 根据ID获取用户信息


**接口地址**:`/api/user/info/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据用户ID获取指定用户的基本信息，包括昵称、头像、性别等。需要user:read权限。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|用户ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|获取成功|UserDTO|
|400|Bad Request|ResultVoid|
|401|未登录或令牌已失效|ResultVoid|
|403|权限不足|ResultUserDTO|
|404|用户不存在|ResultVoid|
|405|Method Not Allowed|ResultVoid|
|500|Internal Server Error|ResultVoid|
|502|Bad Gateway|ResultVoid|
|503|Service Unavailable|ResultVoid|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id|用户ID|integer(int64)|integer(int64)|
|nickname|用户昵称|string||
|email|用户邮箱|string||
|avatar|头像URL|string||
|gender|性别: 0=未知, 1=男, 2=女|integer(int32)|integer(int32)|
|birthday|生日|string||
|status|状态: 0=禁用, 1=正常|integer(int32)|integer(int32)|
|role|角色编码|string||
|permissions|权限列表（逗号分隔）|string||


**响应示例**:
```javascript
{
	"id": 1,
	"nickname": "二次元爱好者",
	"email": "user@example.com",
	"avatar": "https://your-oss.com/avatar/1.png",
	"gender": 1,
	"birthday": "2000-01-01",
	"status": 1,
	"role": "USER",
	"permissions": "user:read,content:read"
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-401**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-403**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data||UserDTO|UserDTO|
|&emsp;&emsp;id|用户ID|integer(int64)||
|&emsp;&emsp;nickname|用户昵称|string||
|&emsp;&emsp;email|用户邮箱|string||
|&emsp;&emsp;avatar|头像URL|string||
|&emsp;&emsp;gender|性别: 0=未知, 1=男, 2=女|integer(int32)||
|&emsp;&emsp;birthday|生日|string||
|&emsp;&emsp;status|状态: 0=禁用, 1=正常|integer(int32)||
|&emsp;&emsp;role|角色编码|string||
|&emsp;&emsp;permissions|权限列表（逗号分隔）|string||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {
		"id": 1,
		"nickname": "二次元爱好者",
		"email": "user@example.com",
		"avatar": "https://your-oss.com/avatar/1.png",
		"gender": 1,
		"birthday": "2000-01-01",
		"status": 1,
		"role": "USER",
		"permissions": "user:read,content:read"
	},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-404**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-405**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-502**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-503**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


## 内部接口-根据ID获取用户


**接口地址**:`/api/user/internal/id/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>供其他微服务通过OpenFeign调用的内部接口，不需要认证。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|用户ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|获取成功|UserDTO|
|400|Bad Request|ResultVoid|
|401|Unauthorized|ResultVoid|
|404|用户不存在|ResultVoid|
|405|Method Not Allowed|ResultVoid|
|500|Internal Server Error|ResultVoid|
|502|Bad Gateway|ResultVoid|
|503|Service Unavailable|ResultVoid|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id|用户ID|integer(int64)|integer(int64)|
|nickname|用户昵称|string||
|email|用户邮箱|string||
|avatar|头像URL|string||
|gender|性别: 0=未知, 1=男, 2=女|integer(int32)|integer(int32)|
|birthday|生日|string||
|status|状态: 0=禁用, 1=正常|integer(int32)|integer(int32)|
|role|角色编码|string||
|permissions|权限列表（逗号分隔）|string||


**响应示例**:
```javascript
{
	"id": 1,
	"nickname": "二次元爱好者",
	"email": "user@example.com",
	"avatar": "https://your-oss.com/avatar/1.png",
	"gender": 1,
	"birthday": "2000-01-01",
	"status": 1,
	"role": "USER",
	"permissions": "user:read,content:read"
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-401**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-404**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-405**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-502**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-503**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


## 内部接口-获取用户权限


**接口地址**:`/api/user/internal/permissions/{userId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>供其他微服务通过OpenFeign调用的内部接口，返回用户的权限编码列表。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId|用户ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|获取成功|ResultString|
|400|Bad Request|ResultVoid|
|401|Unauthorized|ResultVoid|
|404|用户不存在|ResultVoid|
|405|Method Not Allowed|ResultVoid|
|500|Internal Server Error|ResultVoid|
|502|Bad Gateway|ResultVoid|
|503|Service Unavailable|ResultVoid|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|string||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": "",
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-401**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-404**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-405**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-502**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-503**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


## 内部接口-根据用户名获取用户


**接口地址**:`/api/user/internal/username/{username}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>供其他微服务通过OpenFeign调用的内部接口，根据用户名精确匹配用户。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|username|用户名|path|true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|获取成功|UserDTO|
|400|Bad Request|ResultVoid|
|401|Unauthorized|ResultVoid|
|404|用户不存在|ResultVoid|
|405|Method Not Allowed|ResultVoid|
|500|Internal Server Error|ResultVoid|
|502|Bad Gateway|ResultVoid|
|503|Service Unavailable|ResultVoid|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id|用户ID|integer(int64)|integer(int64)|
|nickname|用户昵称|string||
|email|用户邮箱|string||
|avatar|头像URL|string||
|gender|性别: 0=未知, 1=男, 2=女|integer(int32)|integer(int32)|
|birthday|生日|string||
|status|状态: 0=禁用, 1=正常|integer(int32)|integer(int32)|
|role|角色编码|string||
|permissions|权限列表（逗号分隔）|string||


**响应示例**:
```javascript
{
	"id": 1,
	"nickname": "二次元爱好者",
	"email": "user@example.com",
	"avatar": "https://your-oss.com/avatar/1.png",
	"gender": 1,
	"birthday": "2000-01-01",
	"status": 1,
	"role": "USER",
	"permissions": "user:read,content:read"
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-401**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-404**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-405**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-502**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-503**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


## 获取个人资料


**接口地址**:`/api/user/profile`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取当前登录用户的个人资料，包括昵称、邮箱、头像、手机号等详细信息。当前登录用户只能查看自己的资料。</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|获取成功|UserDTO|
|400|Bad Request|ResultVoid|
|401|未登录或令牌已失效|ResultVoid|
|404|Not Found|ResultVoid|
|405|Method Not Allowed|ResultVoid|
|500|Internal Server Error|ResultVoid|
|502|Bad Gateway|ResultVoid|
|503|Service Unavailable|ResultVoid|


**响应状态码-200**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|id|用户ID|integer(int64)|integer(int64)|
|nickname|用户昵称|string||
|email|用户邮箱|string||
|avatar|头像URL|string||
|gender|性别: 0=未知, 1=男, 2=女|integer(int32)|integer(int32)|
|birthday|生日|string||
|status|状态: 0=禁用, 1=正常|integer(int32)|integer(int32)|
|role|角色编码|string||
|permissions|权限列表（逗号分隔）|string||


**响应示例**:
```javascript
{
	"id": 1,
	"nickname": "二次元爱好者",
	"email": "user@example.com",
	"avatar": "https://your-oss.com/avatar/1.png",
	"gender": 1,
	"birthday": "2000-01-01",
	"status": 1,
	"role": "USER",
	"permissions": "user:read,content:read"
}
```


**响应状态码-400**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-401**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-404**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-405**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-500**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-502**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```


**响应状态码-503**:


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|状态码|integer(int32)|integer(int32)|
|message|提示信息|string||
|data|响应数据|object||
|timestamp|响应时间戳（毫秒）|integer(int64)|integer(int64)|
|success||boolean||


**响应示例**:
```javascript
{
	"code": 200,
	"message": "操作成功",
	"data": {},
	"timestamp": 1709337600000,
	"success": true
}
```