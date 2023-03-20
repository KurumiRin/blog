### Providers
Providers 是 Nest 的一个基本概念。他是一个用`@Injectable` 装饰器注释的类

`service.ts` 中
```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello';
  }
  getKurumiRin() {
    return 'KurumiRin';
  }
}
```

在 `module.ts` 中引入 service，并在 providers 中注入

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

在 `controller.ts` 中使用
```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

```

### 自定义名称

自定义 providers 的名称
默认是简写，需要自定义名称的话需要改成对象
```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
	imports: [UserModule],
	controllers: [AppController],
	// 自定义名称
	providers: [{
		provide: "newName",
		useClass: AppService
	}],
})
export class AppModule {}

```

在 `controller.ts` 中使用，需要用 `@Inject` 装饰器修饰 providers，Inject需要传入在module中自定义的名字
```ts
import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(@Inject('newName') private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}
}
```

### 自定义注入值

在 `module.ts`中
```ts
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
	imports: [UserModule],
	controllers: [AppController],
	providers: [{
		// 自定义注入值
		provide: 'Test',
		useValue: ['Kurumi', 'Rin'],
    }],
})
export class AppModule {}

```

在 `controller.ts` 使用自定义值
通过 `@Inject` 传入自定义值的key来获取自定义值
```ts
import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(
    @Inject('Test') private readonly name: string[],
	) {}

	@Get()
	getHello(): string[] {
	    return this.name;
	}
}
```

### 工厂模式

工厂模式可以根据条件返回值或者类，工程模式可以通过注入类来使用对应的类，工厂模式也支持异步。

在 `module.ts` 中
```ts
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppService2 } from './app.service2';
import { UserModule } from './user/user.module';

@Module({
	imports: [UserModule],
	controllers: [AppController],
	providers: [
	// 传入 AppService2
	AppService2,
	{
		provide: 'Test',
		useFactory(){
			if(){
				// 可以 return 值
			
			} else {
				// 也可以return 类
				
			}
		}
    },{
	    provide: 'CCC',
	    // 注入上面传入的 AppService2
	    Inject:[AppService2],
		useFactory(AppService2:AppService2){
			// return AppService2.getHello()
			return 'Factory Test'
		}
    },{
	    provide: 'DDD',
	    Inject:[AppService2],
	    // 工厂模式支持异步
		async useFactory(AppService2:AppService2){
			return await new Promise((r)=>{
				setTimeout(()=>{
					r(AppService2.getHello())
				},2000)
			})
		}	    
    }],
})
export class AppModule {}

```

在 `controller.ts` 中使用
```ts
import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(
	    @Inject('Test') private readonly name: string[],
	    /**
		    工程模式的值
	    **/
	    @Inject('CCC') private readonly ccc: string
	) {}

	@Get()
	getHello(): string {
	    return this.ccc;
	}
}
```