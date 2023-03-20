### 开启版本控制
在入口文件 `main.ts` 中添加 `app.enableVersioning({ type: XXX })`
具体如下：
```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// 版本控制type参数，是一个枚举
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 添加版本控制
  app.enableVersioning({
	// URI是指在url里控制版本号
    type: VersioningType.URI,
  });
  await app.listen(3000);
}
bootstrap();

```

##### 在controller里控制接口的版本

控制整体的版本号：
```ts
// ......
@Controller({
	path:'user',
	version:'1'
})
export class UserController {
	// ......
}
```

单独控制版本号：
```ts
// ......
@Controller('user')
export class UserController {
	// ......
	@Get()
	@Version('1')
	findAll(){
		return this.userService.findAll()
	}
}
```

### code码规范

`200` OK
`304 Not Modified` 协商缓存了
`400 Bad Request` 参数错误
`401 Unauthorized` token错误
`403 Forbidden` referer origin 验证失败
`404 Not Found` 接口不存在
`500 Internal Server Error` 服务端错误
`502 Bad Gateway` 上游接口有问题或者服务器问题