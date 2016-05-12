import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import snakeToCamel from 'oz-worker-gui/utils/snake-to-camel';

describe('snakeToCamel', function () {
  it('dashed-words should be converted to camelCase format by default', function() {
    let result = snakeToCamel('hello-world');
    expect(result).to.be.equal('helloWorld');
  });

  it('single word should be leaved unmodified', function() {
    let result = snakeToCamel('hello');
    expect(result).to.equal('hello');
  });

  it('function supports underscore when custom separator provided', function() {
    let result = snakeToCamel('hello_world', '_');
    expect(result).to.equal('helloWorld');
  });
});
