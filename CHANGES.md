This is the old CHANGES file. Please look at [releases](https://github.com/christianalfoni/formsy-react/releases) for latest changes.

**0.8.0**
  - Fixed bug where dynamic form elements gave "not mounted" error (Thanks @sdemjanenko)
  - React is now a peer dependency (Thanks @snario)
  - Dynamically updated values should now work with initial "undefined" value (Thanks @sdemjanenko)
  - Validations are now dynamic. Change the prop and existing values are re-validated (thanks @bryannaegele)
  - You can now set a "disabled" prop on the form and check "isFormDisabled()" in form elements
  - Refactored some code and written a couple of tests

**0.7.2**:
  - isNumber validation now supports float (Thanks @hahahana)
  - Form XHR calls now includes CSRF headers, if exists (Thanks @hahahana)

**0.7.1**
  - Fixed bug where external update of value on pristine form element did not update the form model (Thanks @sdemjanenko)
  - Fixed bug where children are null/undefined (Thanks @sdemjanenko)

**0.7.0**
  - Dynamic form elements. Add them at any point and they will be registered with the form
  - **onChange()** handler is called whenever an form element has changed its value or a new form element is added to the form
  - isNumeric validator now also handles actual numbers, not only strings
  - Some more tests
  
**0.6.0**
  - **onSubmit()** now has the same signature regardless of passing url attribute or not
  - **isPristine()** is a new method to handle "touched" form elements (thanks @FoxxMD)
  - Mapping attributes to pass a function that maps input values to new structure. The new structure is either passed to *onSubmit* and/or to the server when using a url attribute (thanks for feedback @MattAitchison)
  - Added default "equalsField" validation rule
  - Lots of tests!

**0.5.2**
  - Fixed bug with handlers in ajax requests (Thanks @smokku)

**0.5.1**
  - Fixed bug with empty validations
  
**0.5.0**
  - Added [cross input validation](#formsyaddvalidationrule)
  - Fixed bug where validation rule refers to a string
  - Added "invalidateForm" function when manually submitting the form
  
**0.4.1**
  - Fixed bug where form element is required, but no validations

**0.4.0**:
  - Possibility to handle form data manually using "onSubmit"
  - Added two more default rules. *isWords* and *isSpecialWords*

**0.3.0**:
  - Deprecated everything related to buttons automatically added
  - Added onValid and onInvalid handlers, use those to manipulate submit buttons etc.

**0.2.3**:
  
  - Fixed bug where child does not have props property

**0.2.2**:
  
  - Fixed bug with updating the props

**0.2.1**:
  
  - Cancel button displays if onCancel handler is defined

**0.2.0**:
  
  - Implemented hasValue() method

**0.1.3**:
  
  - Fixed resetValue bug

**0.1.2**:
  
  - Fixed isValue check to empty string, needs to support false and 0

**0.1.1**:

  - Added resetValue method
  - Changed value check of showRequired
