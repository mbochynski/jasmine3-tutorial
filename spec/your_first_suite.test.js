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
    foo(false, function() {
      fail("Callback has been called");
    });
  });
});

// Before a spec is executed,
// Jasmine walks down the tree executing each 
// beforeEach function in order. 
// After the spec is executed,
// Jasmine walks through the afterEach functions similarly.
describe("A spec", function() {
  var foo;

  beforeEach(function() {
    foo = 0;
    foo += 1;
  });

  afterEach(function() {
    foo = 0;
  });

  it("is just a function, so it can contain any code", function() {
    expect(foo).toEqual(1);
  });

  it("can have more than one expectation", function() {
    expect(foo).toEqual(1);
    expect(true).toEqual(true);
  });

  describe("nested inside a second describe", function() {
    var bar;

    beforeEach(function() {
      bar = 1;
    });

    it("can reference both scopes as needed", function() {
      expect(foo).toEqual(bar);
    });
  });
});

// disable suite
xdescribe("A spec", function() {
  var foo;

  beforeEach(function() {
    foo = 0;
    foo += 1;
  });

  it("is just a function, so it can contain any code", function() {
    expect(foo).toEqual(1);
  });
});

// disable tests
describe('Pending specs', function() {
  xit("can be declared 'xit'", function() {
    expect(true).toBe(false);
  });

  it("can be declared with 'it' but without a function");

  it("can be declared by calling 'pending' in the spec body", function() {
    expect(true).toBe(false);
    pending('this is why it is pending');
  });
});
