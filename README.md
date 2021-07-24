<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>

## Description

[Bull](https://github.com/OptimalBits/bull) module for [Nest](https://github.com/nestjs/nest).

## Installation

```bash
$ npm install --save bull 
```

```bash
$ npm install --save-dev @types/bull
```

```bash
$ npm i --save type-bull
```

## Quick Start

[Overview & Tutorial](https://blog.taskforce.sh/)

## Quick Guide
### Basic Usage

```
project
│   app.module.ts 
│   
│  
└───test
│   │   test.module.ts
│   │
│   └───test-queue
│       │   test.queue.module.ts
│       │   test.queue.service.ts
│       │   
│       └───queue
│           │
│           │   test.queue.ts
```


```js
// app.module.ts

@Module({
    imports: [TestModule],
    providers: [AppService]
})
export class AppModule {}
```
```js
// test.module.ts

@Module({
  imports: [BullModule.forRoot(), TestQueueModule],
})
export class TestModule {}
```
```js
// test.queue.module.ts

@Module({
    imports: [BullModule.forFeature([TestQueue])],
    providers: [TestQueueService]
})
export class TestQueueModule {}
```
```js
// test.queue.service.ts

@Injectable()
export class TestQueueService {
    constructor(
        @InjectQueue(TestQueue)
        private readonly testQueue: TestQueue
    ) {}

    addInQueue(someData) {
        return this.testQueue.add(someData);
    }
}
```
```js
// test.queue.ts

@Queue('test_queue', {
    redis: {
        port: 6379,
        host: '127.0.0.1',
    },
})
export class TestQueue extends QueueEntity {
    public readonly logger = new Logger();

    @Process()
    testProcess(job, done) {
        this.logger.debug(job)
        this.logger.debug(done)
    }

    @Process({
        name: 'someName',
        filePath: '../somepath.js',
        concurrency: 5
    })
    testChildProcess() {}


    @Event('global:progress')
    testEventGlobal(job, progress) {
        this.logger.debug(job)
        this.logger.debug(progress)
    }

    @Event('progress')
    testEventProgress(job, progress) {
        this.logger.debug(job)
        this.logger.debug(progress)
    }


}
```

## Stay in touch

* Author - Denis Vakhtenkov
* Telegram - [@dev_wizzard0](https://t.me/dev_wizzard0)

## License

type-bull is [MIT licensed](LICENSE).

bull is [MIT licensed](https://github.com/OptimalBits/bull/blob/develop/LICENSE.md).

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
