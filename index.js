const assign = require('object-assign');
const querystring = require('querystring');

const QUERYSTRING_DELIMITER = '?';
const RANGE_DELIMITER = '..';
const SPEC_DELIMITER = /\s*;\s*/;
const VERSION_DELIMITER = /\s*,\s*/;
const VERSION_MARKER = '@';
const VERSION_DEFAULT = 'latest';

// browser name shorthand mappings
const BROWSER_ALIAS = {
  'edge': 'MicrosoftEdge',
  'ie':   'Internet Explorer',
  'ff':   'Firefox',
  'ffx':  'Firefox',
  'msie': 'Internet Explorer',
};

/**
 * parse a query string and coerce booleans from strings.
 * @param {String}
 * @return {Object}
 */
const parseQueryString = function(str) {
  var opts = querystring.parse(str);
  for (var key in opts) {
    switch (opts[key]) {
      case 'true':
        opts[key] = true;
        break;
      case 'false':
        opts[key] = false;
        break;
    }
  }
  return opts;
};

/**
 * split a string into one or more specs
 * @param {String}
 * @return {Array<String>}
 */
const splitSpecs = function(spec) {
  return spec.split(SPEC_DELIMITER);
};

/**
 * parse a single spec string into one or more object specs,
 * depending on the version.
 *
 * @param {String} spec
 * @return {Array<Object>}
 */
const parse = function(spec) {
  var opts;
  var q = spec.indexOf(QUERYSTRING_DELIMITER);
  if (q > -1) {
    opts = parseQueryString(spec.substr(q + 1));
    spec = spec.substr(0, q);
  }

  var at = spec.indexOf(VERSION_MARKER);
  var browser = spec;
  var versions = [VERSION_DEFAULT];
  if (at > -1) {
    browser = spec.substr(0, at);
    versions = parseVersion(spec.substr(at + 1));
  }

  if (browser in BROWSER_ALIAS) {
    browser = BROWSER_ALIAS[browser];
  }
  return versions.reduce(function(specs, version) {
    var spec = {browserName: browser, version: version};
    if (opts) {
      assign(spec, opts);
    }
    specs.push(spec);
    return specs;
  }, []);
};

/**
 * parse a version string into an array of versions in which ranges
 * are expanded
 * @param {String}
 * @return {Array<String>}
 */
const parseVersion = function(str) {
  return str.split(VERSION_DELIMITER).reduce(function(numbers, str) {
    if (str.indexOf(RANGE_DELIMITER) > -1) {
      numbers = numbers.concat(parseRange(str));
    } else {
      numbers.push(str);
    }
    return numbers;
  }, []).map(String);
};

/**
 * parse a range string into an array of numbers
 * @param {String}
 * @return {Array<Number>}
 */
const parseRange = function(str) {
  var range = str.split(RANGE_DELIMITER).map(Number);
  var start = range[0];
  var end = range[1];
  range = [];
  for (var n = start; n <= end; n++) {
    range.push(n);
  }
  return range;
};

const parseAll = function(str) {
  return splitSpecs(str).map(parse).reduce(function(specs, _specs) {
    return specs.concat(_specs);
  }, []);
};

module.exports = function(spec, opts) {
  if (typeof spec === 'object') {
    if (Array.isArray(spec)) {

    }
  } else if (!spec || !spec.length) {
    return undefined;
  }

  var specs = parseAll(spec);
  if (opts) {
    specs.forEach(function(spec) {
      assign(spec, opts);
    });
  }
  return specs;
};

module.exports.parse = function(spec, opts) {
  spec = parse(spec)[0];
  if (opts) {
    assign(spec, opts);
  }
  return spec;
};
