var Formsy = require('./../src/main.js');

describe('Formsy', function() {

  describe('Setting up a form', function () {
    
    it('should render a form into the document', function() {
      var form = TestUtils.renderIntoDocument(
        <Formsy.Form></Formsy.Form>
      );
      expect(form.getDOMNode().tagName).toEqual('FORM');
    });

    it('should set a class name if passed', function () {
      var form = TestUtils.renderIntoDocument(
        <Formsy.Form className="foo"></Formsy.Form>
      );
      expect(form.getDOMNode().className).toEqual('foo');
    });

  });

});
