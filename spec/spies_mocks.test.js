describe('a spy', function() {
  var foo = null;
  var bar = null;

  beforeEach(function() {
    foo = {
      setBar: function(value) {
        bar = value;
      }
    }

    spyOn(foo, 'setBar');

    foo.setBar(123);
    foo.setBar(456, 'another param');
  });

  it('tracks that the spy was called', function() {
    expect(foo.setBar).toHaveBeenCalled();
  });

  it('tracks that the spy was called x times', function() {
    expect(foo.setBar).toHaveBeenCalledTimes(2);
  });

  it('tracks all the arguments of its calls', function() {
    // The toHaveBeenCalledWith matcher
    // will return true if the argument list matches 
    // ANY 
    // of the recorded calls to the spy.
    expect(foo.setBar).toHaveBeenCalledWith(123);
    expect(foo.setBar).toHaveBeenCalledWith(456, 'another param');
  });

  it('stops all execution on a function', function() {
    expect(bar).toBeNull();
  });
});

describe('a spy, when created manually', function() {
  var whatAml;

  beforeEach(function() {
    whatAml = jasmine.createSpy('whatAml');

    whatAml('i', 'am', 'a', 'spy');
  });

  it('tracks that the spy was called', function() {
    expect(whatAml).toHaveBeenCalled();
  });
});



describe("Multiple spies, when created manually", function() {
  var tape;

  beforeEach(function() {
    tape = jasmine.createSpyObj('tape', ['play', 'pause', 'stop', 'rewind']);

    tape.play();
    tape.pause();
    tape.rewind(0);
  });

  it("creates spies for each requested function", function() {
    expect(tape.play).toBeDefined();
    expect(tape.pause).toBeDefined();
    expect(tape.stop).toBeDefined();
    expect(tape.rewind).toBeDefined();
  });
});

describe('Matching with finesse', function() {
  describe('jasmine.any', function() {
    it('matches any value', function() {
      expect({}).toEqual(jasmine.any(Object));
      expect(12).toEqual(jasmine.any(Number));
    });

    describe('when used with a spy', function() {
      it('is usefull for comparing arguments', function() {
        var foo = jasmine.createSpy('foo');
        foo(12, function() { return true; });

        expect(foo).toHaveBeenCalledWith(jasmine.any(Number), jasmine.any(Function));
      });
    });
  });

  describe('jasmine.anything', function() {
    // jasmine.anything returns true 
    // if the actual value is not null or undefined.
    it('matches anything', function() {
      expect(1).toEqual(jasmine.anything())
    });
  });

  describe("jasmine.objectContaining", function() {
    var foo;

    beforeEach(function() {
      foo = {
        a: 1,
        b: 2,
        bar: "baz"
      };
    });

    it("matches objects with the expect key/value pairs", function() {
      expect(foo).toEqual(jasmine.objectContaining({
        bar: "baz"
      }));
      expect(foo).not.toEqual(jasmine.objectContaining({
        c: 37
      }));
    });

    describe("when used with a spy", function() {
      it("is useful for comparing arguments", function() {
        var callback = jasmine.createSpy('callback');

        callback({
          bar: "baz"
        });

        expect(callback).toHaveBeenCalledWith(jasmine.objectContaining({
          bar: "baz"
        }));
      });
    });
  });

  describe("jasmine.arrayContaining", function() {
    var foo;

    beforeEach(function() {
      foo = [1, 2, 3, 4];
    });

    it("matches arrays with some of the values", function() {
      expect(foo).toEqual(jasmine.arrayContaining([3, 1]));
      expect(foo).not.toEqual(jasmine.arrayContaining([6]));
    });

    describe("when used with a spy", function() {
      it("is useful when comparing arguments", function() {
        var callback = jasmine.createSpy('callback');

        callback([1, 2, 3, 4]);

        expect(callback).toHaveBeenCalledWith(jasmine.arrayContaining([4, 2, 3]));
        expect(callback).not.toHaveBeenCalledWith(jasmine.arrayContaining([5, 2]));
      });
    });
  });

  describe('jasmine.stringMatching', function() {
    it("matches as a regexp", function() {
      expect({foo: 'bar'}).toEqual({foo: jasmine.stringMatching(/^bar$/)});
      expect({foo: 'foobarbaz'}).toEqual({foo: jasmine.stringMatching('bar')});
    });

    describe("when used with a spy", function() {
      it("is useful for comparing arguments", function() {
        var callback = jasmine.createSpy('callback');

        callback('foobarbaz');

        expect(callback).toHaveBeenCalledWith(jasmine.stringMatching('bar'));
        expect(callback).not.toHaveBeenCalledWith(jasmine.stringMatching(/^bar$/));
      });
    });
  });

  describe('custom asymmetry', function() {
    var tester = {
      asymmetricMatch: function(actual) {
        var secondValue = actual.split(',')[1];
        return secondValue === 'bar';
      }
    };

    it('dives in deep', function() {
      expect('foo,bar,baz,quux').toEqual(tester);
    });

    describe('when used with a syp', function() {
      it('is useful for comparing arguments', function() {
        var callback = jasmine.createSpy('callback');

        callback('foo,bar,baz');

        expect(callback).toHaveBeenCalledWith(tester);
      });
    });
  });
});

describe('Manual ticking the Jasmine Clock', function() {
  var timerCallback;

  beforeEach(function() {
    timerCallback = jasmine.createSpy('timerCallback');
    jasmine.clock().install();
  });

  afterEach(function() {
    jasmine.clock().uninstall();
  });

  it('causes a timeout to be called synchronously', function() {
    setTimeout(() => {
      timerCallback();
    }, 100);

    expect(timerCallback).not.toHaveBeenCalled();

    jasmine.clock().tick(101);

    expect(timerCallback).toHaveBeenCalled();
  });

  it('causes an interval to be called synchronously', function() {
    setInterval(function() {
      timerCallback();
    }, 100);

    expect(timerCallback).not.toHaveBeenCalled();

    jasmine.clock().tick(101);
    expect(timerCallback.calls.count()).toEqual(1);

    jasmine.clock().tick(50);
    expect(timerCallback.calls.count()).toEqual(1);
    
    jasmine.clock().tick(50);
    expect(timerCallback.calls.count()).toEqual(2);
  });

  describe('Mocking the Date object', function() {
    it('mocks the Date object and sets it to a given time', function() {
      var baseTime = new Date(2013, 9, 23);

      jasmine.clock().mockDate(baseTime);

      jasmine.clock().tick(50);
      expect(new Date().getTime()).toEqual(baseTime.getTime() + 50);
    });
  });
});


