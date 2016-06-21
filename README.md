# descap
descap generates Selenium-friendly "desired capabilities" objects from
human-friendly strings. It support browser name shorthands (like
`ie`), version numbers and ranges (`48..52`), and other arbitrary
parameters via query strings.

## API

### `descap(str)`
Parse the string into an array of desired capabilities objects,
according to the [expected format]. Because strings may describe two
or more configurations, the `descap()` function always an array, even
when only one capabilitiy is created. You can reliably parse a single
spec with [descap.parse](#descap-parse).

### `descap.parse(str)`
Parse a string into a single desired capabilities object, according
to the [expected format].

## Expected Format
The format of expected strings is:

Format | Returns | Examples
:----- | :---------- | :-------
`name` | `[{browserName: browser}]` | `chrome`, `firefox`, `ie`
`name@version` | `[{browserName: browser, version: version}]` | `chrome@52`, `firefox@40`, `ie@11`
`name@start..end` | An array with as many entries as there are numbers between `start` and `end` (inclusive) | `chrome@49..52`, `ie@8..11`
`name[...]?options` | An array in which each object has additional properties defined in the `querystring` | `chrome@40?platform=Windows+7`, `firefox@40@platform=OS X 10.11`
`spec;spec` | An array of parsed specs, with one or more for each `spec` | `chrome;firefox@40` `ie@11,10;firefox@40?platform=Windows+7`

```js
var descap = require('descap');
var assert = require('assert');

assert.deepEqual(descap('ie8'), [
  {
    browserName: 'Internet Explorer',
    version: 8
  }
]);

assert.deepEqual(descap('chrome@52..54'), [
  {
    browserName: 'chrome'
    version: 52
  },
  {
    browserName: 'chrome'
    version: 53
  },
  {
    browserName: 'chrome'
    version: 54
  }
]);

assert.deep
```

