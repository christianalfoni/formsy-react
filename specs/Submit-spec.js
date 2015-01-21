var Formsy = require('./../src/main.js');

describe('Ajax', function() {

  beforeEach(function () {
    jasmine.Ajax.install();
  });

  afterEach(function () {
    jasmine.Ajax.uninstall();
  });

  it('should post to a given url if passed', function () {

    var form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users">
      </Formsy.Form>
    );
    
    TestUtils.Simulate.submit(form.getDOMNode());
    expect(jasmine.Ajax.requests.mostRecent().url).toBe('/users');
    expect(jasmine.Ajax.requests.mostRecent().method).toBe('POST');

  });

  it('should put to a given url if passed a method attribute', function () {

    var form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users" method="PUT">
      </Formsy.Form>
    );
    
    TestUtils.Simulate.submit(form.getDOMNode());
    expect(jasmine.Ajax.requests.mostRecent().url).toBe('/users');
    expect(jasmine.Ajax.requests.mostRecent().method).toBe('PUT');

  });

  it('should pass x-www-form-urlencoded as contentType when urlencoded is set as contentType', function () {

    var form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users" contentType="urlencoded">
      </Formsy.Form>
    );
    
    TestUtils.Simulate.submit(form.getDOMNode());
    expect(jasmine.Ajax.requests.mostRecent().contentType()).toBe('application/x-www-form-urlencoded');

  });

  it('should run an onSuccess handler, if passed and ajax is successfull. First argument is data from server', function (done) {
 
    var onSuccess = jasmine.createSpy("success");
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users" onSuccess={onSuccess}>
      </Formsy.Form>
    );
    
    jasmine.Ajax.stubRequest('/users').andReturn({
      status: 200,
      contentType: 'application/json',
      responseText: '{}'
    });

    TestUtils.Simulate.submit(form.getDOMNode());

    // Since ajax is returned as a promise (async), move assertion
    // to end of event loop
    setTimeout(function () {
      expect(onSuccess).toHaveBeenCalledWith({});
      done();
    }, 0);

  });

  it('should not do ajax request if onSubmit handler is passed, but pass the model as first argument to onSubmit handler', function () {
    
    var TestInput = React.createClass({
      mixins: [Formsy.Mixin],
      render: function () {
        return <input value={this.getValue()}/>
      }
    });
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form onSubmit={onSubmit}>
        <TestInput name="foo" value="bar"/>
      </Formsy.Form>
    );

    TestUtils.Simulate.submit(form.getDOMNode());

    expect(jasmine.Ajax.requests.count()).toBe(0);

    function onSubmit (data) {
      expect(data).toEqual({
        foo: 'bar'
      });
    }

  });

  it('should trigger an onSubmitted handler, if passed and the submit has responded with SUCCESS', function (done) {
    
    var onSubmitted = jasmine.createSpy("submitted");
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users" onSubmitted={onSubmitted}>
      </Formsy.Form>
    );
    
    jasmine.Ajax.stubRequest('/users').andReturn({
      status: 200,
      contentType: 'application/json',
      responseText: '{}'
    });

    TestUtils.Simulate.submit(form.getDOMNode());

    // Since ajax is returned as a promise (async), move assertion
    // to end of event loop
    setTimeout(function () {
      expect(onSubmitted).toHaveBeenCalled();
      done();
    }, 0);

  });

  it('should trigger an onSubmitted handler, if passed and the submit has responded with ERROR', function (done) {
    
    var onSubmitted = jasmine.createSpy("submitted");
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users" onSubmitted={onSubmitted}>
      </Formsy.Form>
    );
    
    jasmine.Ajax.stubRequest('/users').andReturn({
      status: 500,
      contentType: 'application/json',
      responseText: '{}'
    });

    TestUtils.Simulate.submit(form.getDOMNode());

    // Since ajax is returned as a promise (async), move assertion
    // to end of event loop
    setTimeout(function () {
      expect(onSubmitted).toHaveBeenCalled();
      done();
    }, 0);

  });

  it('should trigger an onError handler, if passed and the submit has responded with ERROR', function (done) {
    
    var onError = jasmine.createSpy("error");
    var form = TestUtils.renderIntoDocument(
      <Formsy.Form url="/users" onError={onError}>
      </Formsy.Form>
    );
    
    // Do not return any error because there are no inputs
    jasmine.Ajax.stubRequest('/users').andReturn({
      status: 500,
      contentType: 'application/json',
      responseText: '{}'
    });

    TestUtils.Simulate.submit(form.getDOMNode());

    // Since ajax is returned as a promise (async), move assertion
    // to end of event loop
    setTimeout(function () {
      expect(onError).toHaveBeenCalledWith({});
      done();
    }, 0);

  });

});
