### @Get
#### @Request
```ts
// ......
@Controller('user')
export class UserController {
	// ......
	@Get()
	findAll(@Request() req) {
		// req.query拿到请求内容
		console.log(req.query);
		return {
			code: 200,
			message: req.query.name,
		};
	}
}
```

#### @Query
```ts
// ......
@Controller('user')
export class UserController {
	// ......
	@Get()
	findAll(@Query() query) {
		// query可以直接拿到请求内容
		console.log(query);
		return {
			code: 200,
			message: req.query.name,
		};
	}
}
```
`@Query()` 中传入参数，可以直接获取对应Key的值
### @Post
#### @Request
```ts
// ......
@Controller('user')
export class UserController {
	// ......
	@Post()
	create(@Request() req) {
		// req.body拿到请求内容
		console.log(req.body);
		return {
			code: 200,
			message: req.body.name,
		};
	}
}
```

#### @Body
```ts
// ......
@Controller('user')
export class UserController {
	// ......
	@Post()
	// create(@Body('name') body) {
	// 可以给@Body传入参数，直接获取对应key的值
	create(@Body() body) {
		// body直接拿到请求内容
		console.log(body);
		return {
			code: 200,
			message: body.name,
		};
	}
}
```
### 动态路由
#### @Get(":id")
```ts
// ......
@Controller('user')
export class UserController {
	// ......
	@Get(':id')
	create(@Request() req) {
		console.log(req.params);
		return {
			code: 200,
			message: req.params.id,
		};
	}
}
```
#### @Param
```ts
// ......
@Controller('user')
export class UserController {
	// ......
	@Get(':id')
	create(@Param() params) {
		console.log(params);
		return {
			code: 200,
			message: params.id,
		};
	}
}
```
### @Headers
获取请求头的内容
```ts
// ......
@Controller('user')
export class UserController {
	// ......
	@Get(':id')
	create(@Param() params, @Headers() headers) {
		console.log(headers);
		return {
			code: 200,
		};
	}
}
```

@HttpCode
设置响应头里的状态码
```ts
// ......
@Controller('user')
export class UserController {
	// ......
	@Get(':id')
	// 设置响应头的状态码为500
	@HttpCode(500)
	create(@Param() params) {
		return {
			code: 200,
		};
	}
}
```