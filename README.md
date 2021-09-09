<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master

[travis-url]: https://travis-ci.org/nestjs/nest

[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux

[linux-url]: https://travis-ci.org/nestjs/nest

  <p align="center">A small <a href="https://github.com/OptimalBits/bull" target="blank">bull</a> module for <a href="https://github.com/nestjs/nest" target="blank">nestjs</a> that additionally adds decorators</p>
<a href="https://www.npmjs.com/~celbine"><img src="https://img.shields.io/npm/v/type-bull" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~celbine"><img src="https://img.shields.io/npm/l/type-bull" alt="Package License" /></a>
<a href="https://www.npmjs.com/~celbine"><img src="https://img.shields.io/npm/dt/type-bull" alt="Total downloads" /></a>
<a href="https://www.npmjs.com/~celbine"><img src="https://img.shields.io/github/languages/code-size/celbine/type-bull" alt="Code size" /></a>
<a href="https://www.npmjs.com/~celbine"><img src="https://img.shields.io/github/issues-raw/celbine/type-bull" alt="Open issues" /></a>

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
    imports: [TestModule]
})
export class AppModule {
}
```

```js
// test.module.ts

@Module({
    imports: [TestQueueModule],
})
export class TestModule {
}
```

```js
// test.queue.module.ts

@Module({
    imports: [BullModule.forFeature([TestQueue])],
    providers: [TestQueueService, TestQueue]
})
export class TestQueueModule {
}
```

```js
// test.queue.service.ts

@Injectable()
export class TestQueueService {
    constructor(
        @Inject(TestQueue)
        private readonly testQueue: TypeBull<TestQueue>
    ) {}

    addInQueue(someData) {
      return this.testQueue.constructor.bull.add(someData);
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
export class TestQueue extends Bull {
    public readonly logger = new Logger();

    // this way
    @Process('HANDLE_TEST') 
    testProcess(job) {
        this.logger.debug(job)
    }

    // or this way
    @Process({
        name: 'someName',
        filePath: '../somepath.js',
        concurrency: 5
    }) testChildProcess() {}


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
