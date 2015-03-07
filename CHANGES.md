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
