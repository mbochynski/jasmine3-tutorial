describe('A suite', function() {
  it('contains spec with an expectation', function() {
    expect(true).toBe(true);
  })
});

describe('A spec', function() {
  beforeEach(function() {
    this.foo = 0;
  });

  it('can use this to share state', function() {
    expect(this.foo).toEqual(0);
    this.bar = 'test pollution?';
  })

  it('prevent test pollution by having an empty this created for next spec', function() {
    expect(this.foo).toEqual(0);
    expect(this.bar).toBe(undefined);
  })
})

describe("A spec using the fail function", function() {
  var foo = function(x, callBack) {
    if (x) {
      callBack();
    }
  };

  it("should not call the callBack", function() {
    foo(true, function() {
      fail("Callback has been called");
    });
  });
});


