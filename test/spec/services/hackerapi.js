'use strict';

describe('Service: hackerApi', function () {

  // load the service's module
  beforeEach(module('hackerNewsApp'));

  // instantiate service
  var hackerApi;
  beforeEach(inject(function (_hackerApi_) {
    hackerApi = _hackerApi_;
  }));

  it('should do something', function () {
    expect(!!hackerApi).toBe(true);
  });

});
