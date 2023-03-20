其实就是typescript的装饰器概念

### typescript类型

- 类装饰器：`ClassDecorator`
```typescript

const doc:ClassDecoratror = (target:any) => {}
// 构造函数
```
- 属性装饰器：`PropertyDecorator`
```typescript

const doc:ClassDecoratror = (target:any,key:string | symbol) => {}
// 原型对象，属性名
```
- 方法装饰器：`MethodDecorator`
```typescript

const doc:ClassDecoratror = (target:any,key:string | symbol,descriptor:any) => {}
// 原型对象，方法名，描述符
```
- 参数装饰器：`ParameterDecorator`
```typescript

const doc:ClassDecoratror = (target:any,key:string | symbol,index:number) => {}
// 原型对象，参数名，索引
```

