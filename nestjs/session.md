### 安装
`pnpm add express-session`
`pnpm add @types/express-session -D`

### 注册
在入口文件 `main.ts` 中
```ts
// ......
import * as session from 'express-session';

async function bootstrap(){
	const app = await NestFactory.create(AppModule);
	app.use(
		session({
			secret:'KurumiRin',
			rolling:true
		})
	)
	await app.listen(3000)
}
bootstrap()
```
其中 `session` 的参数配置有：
`secret` ：生成服务端session签名，可以理解为加盐
`name`  ：生成客户端cookie的名字，默认 connect.sid
`cookie` ：设置返回到前端key的属性，默认值为`{path:"/",httpOnly:true,secure:false,maxAge:null}`
`rolling` ：在每次请求时强行设置cookie，这将重置cookie过期时间(默认false)

### 服务端接口
在service里定义方法
```ts
@Injectable()
export class UserService {
	captchaCode() {

		return captcha;
	}
}
```
在controller里使用

```ts
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}
	@Get('code')
	createCode(@Req() req, @Res() res, @Session() session) {
    //
		const captcha = svgCaptcha.create({
			size: 4,
			fontSize: 50,
			width: 100,
			height: 34,
			background: '#cc9966',
		});
	    session.code = captcha.text;

	    res.type('image/svg+xml');
	    res.send(captcha.data);
	}

	@Post('create')
	createUser(@Body() Body, @Session() session) {
	    if (session.code.toLocaleLowerCase() === Body?.code?.toLocaleLowerCase()) {
			return {
				code: 200,
				messgae: '验证码正确',
			};
		} else {
			return {
				code: 200,
				message: '验证码错误',
			};
		}
	}
}

```