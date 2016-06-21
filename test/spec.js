const assert = require('assert');
const descap = require('../');

describe('descap(spec)', function() {

  it('name only', function() {
    assert.deepEqual(descap('firefox'), [
      {browserName: 'firefox', version: 'latest'}
    ]);
  });

  it('aliases', function() {
    assert.deepEqual(descap('ie')[0].browserName, 'Internet Explorer');
    assert.deepEqual(descap('ffx')[0].browserName, 'Firefox');
  });

  it('name@version', function() {
    assert.deepEqual(descap('chrome@52'), [
      {browserName: 'chrome', version: '52'}
    ]);
  });

  it('name@range', function() {
    assert.deepEqual(descap('ie@8..10'), [
      {browserName: 'Internet Explorer', version: '8'},
      {browserName: 'Internet Explorer', version: '9'},
      {browserName: 'Internet Explorer', version: '10'}
    ]);
  });

  it('name@version,range', function() {
    assert.deepEqual(descap('ie@6,8..10'), [
      {browserName: 'Internet Explorer', version: '6'},
      {browserName: 'Internet Explorer', version: '8'},
      {browserName: 'Internet Explorer', version: '9'},
      {browserName: 'Internet Explorer', version: '10'}
    ]);
  });

  it('name?opts', function() {
    assert.deepEqual(descap('ie?platform=Windows+10'), [
      {browserName: 'Internet Explorer', version: 'latest', platform: 'Windows 10'}
    ]);
  });

  it('spec;spec', function() {
    assert.deepEqual(descap('chrome@51..53;firefox@45..47'), [
      {browserName: 'chrome', version: '51'},
      {browserName: 'chrome', version: '52'},
      {browserName: 'chrome', version: '53'},
      {browserName: 'firefox', version: '45'},
      {browserName: 'firefox', version: '46'},
      {browserName: 'firefox', version: '47'}
    ]);

    assert.deepEqual(descap('chrome@51?platform=OS X 10.11;firefox@45?profile=foo.fxp'), [
      {browserName: 'chrome', version: '51', platform: 'OS X 10.11'},
      {browserName: 'firefox', version: '45', profile: 'foo.fxp'}
    ]);
  });

});

describe('descap.parse(name)', function() {

  it('returns an object with {browserName: name}', function() {
    assert.equal(descap.parse('chrome').browserName, 'chrome');
  });

  it('returns {version: "latest"} with no version specified', function() {
    assert.equal(descap.parse('chrome').version, 'latest');
  });

  it('returns "Internet Explorer" for "ie"', function() {
    assert.equal(descap.parse('ie').browserName, 'Internet Explorer');
  });

  it('returns "Firefox" for "ff" and "ffx"', function() {
    assert.equal(descap.parse('ff').browserName, 'Firefox');
    assert.equal(descap.parse('ffx').browserName, 'Firefox');
  });

});
