# calamars

[![Build Status](https://travis-ci.org/fczuardi/calamars.svg?branch=master)](https://travis-ci.org/fczuardi/calamars)
[![Dependency Status](https://david-dm.org/fczuardi/calamars.svg)](https://david-dm.org/fczuardi/calamars)
[![coveralls](https://coveralls.io/repos/github/fczuardi/calamars/badge.svg?branch=master)](https://coveralls.io/github/fczuardi/calamars?branch=master)
[see all badges…][badges]

An alpha quality, under heavily development, proto-frramework for building
chat applications.

## Usage

```sh
npm install --save calamars
```

string -> string

```javascript
import { createExactMatchRouter } from 'calamars';
const pairs = [
    ['yes', 'no'],
    ['stop', 'go go go'],
    ['goodbye', 'hello'],
    ['high', 'low'],
    ['why', 'I don’t know']
];
const router = createExactMatchRouter(pairs);

console.log(router('goodbye')); // hello
```

string -> callback -> string

```javascript
import { createExactMatchRouter } from 'calamars';
const callbacks = {
    yes() { return 'no'; },
    halt() { return 'go go go'; },
    goodbye() { return 'hello'; },
    high() { return 'low'; },
    why() { return 'I don’t know'; }
};
const pairs = [
    ['yes', callbacks.yes],
    ['stop', callbacks.halt],
    ['goodbye', callbacks.goodbye],
    ['high', callbacks.high],
    ['why', callbacks.why]
];
const router = createExactMatchRouter(pairs);

console.log(router('goodbye')()); // hello
```

See source code of the tests for the answers lib for more examples:

  - [regex -> string][regexString]
  - [regex -> callback -> string][regexCallbackString]

string -> LUIS -> intentName -> callback

```javascript
// TBD
```

chatSession -> string -> LUIS -> intentName -> callback -> chatSession

```javascript
// TBD
```

## Patches are welcome

If you want to help us improve this library with a fix, a feature, better
documentation or any other thing, please refer to the
[contributing guide][contributing].

[badges]: https://github.com/fczuardi/calamars/blob/master/badges.md
[regexString]: https://github.com/fczuardi/calamars/blob/master/test/answers.js#L20-L31
[regexCallbackString]: https://github.com/fczuardi/calamars/blob/master/test/answers.js#L53-L64
[contributing]: https://github.com/fczuardi/calamars/blob/master/CONTRIBUTING.md