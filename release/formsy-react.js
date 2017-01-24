!function(t,i){"object"==typeof exports&&"object"==typeof module?module.exports=i(require("react")):"function"==typeof define&&define.amd?define(["react"],i):"object"==typeof exports?exports.Formsy=i(require("react")):t.Formsy=i(t.react)}(this,function(t){return function(t){function i(r){if(e[r])return e[r].exports;var n=e[r]={exports:{},id:r,loaded:!1};return t[r].call(n.exports,n,n.exports,i),n.loaded=!0,n.exports}var e={};return i.m=t,i.c=e,i.p="",i(0)}([function(t,i,e){(function(i){"use strict";function r(t,i){var e={};for(var r in t)i.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e}var n=Object.assign||function(t){for(var i=1;i<arguments.length;i++){var e=arguments[i];for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])}return t},s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o=i.React||e(1),u={},a=e(6),l=e(7),d=e(3),c=e(2),f=e(5),h=e(4),F={},p=[];u.Mixin=c,u.HOC=f,u.Decorator=h,u.defaults=function(t){F=t},u.addValidationRule=function(t,i){a[t]=i},u.Form=o.createClass({displayName:"Formsy",getInitialState:function(){return{isValid:!0,isSubmitting:!1,canChange:!1}},getDefaultProps:function(){return{onSuccess:function(){},onError:function(){},onSubmit:function(){},onValidSubmit:function(){},onInvalidSubmit:function(){},onValid:function(){},onInvalid:function(){},onChange:function(){},validationErrors:null,preventExternalInvalidation:!1}},childContextTypes:{formsy:o.PropTypes.object},getChildContext:function(){var t=this;return{formsy:{attachToForm:this.attachToForm,detachFromForm:this.detachFromForm,validate:this.validate,isFormDisabled:this.isFormDisabled,isValidValue:function(i,e){return t.runValidation(i,e).isValid}}}},componentWillMount:function(){this.inputs=[]},componentDidMount:function(){this.validateForm()},componentWillUpdate:function(){this.prevInputNames=this.inputs.map(function(t){return t.props.name})},componentDidUpdate:function(){this.props.validationErrors&&"object"===s(this.props.validationErrors)&&Object.keys(this.props.validationErrors).length>0&&this.setInputValidationErrors(this.props.validationErrors);var t=this.inputs.map(function(t){return t.props.name});d.arraysDiffer(this.prevInputNames,t)&&this.validateForm()},reset:function(t){this.setFormPristine(!0),this.resetModel(t)},submit:function(t){t&&t.preventDefault(),this.setFormPristine(!1);var i=this.getModel();this.props.onSubmit(i,this.resetModel,this.updateInputsWithError),this.state.isValid?this.props.onValidSubmit(i,this.resetModel,this.updateInputsWithError):this.props.onInvalidSubmit(i,this.resetModel,this.updateInputsWithError)},mapModel:function(t){return this.props.mapping?this.props.mapping(t):l.toObj(Object.keys(t).reduce(function(i,e){for(var r=e.split("."),n=i;r.length;){var s=r.shift();n=n[s]=r.length?n[s]||{}:t[e]}return i},{}))},getModel:function(){var t=this.getCurrentValues();return this.mapModel(t)},setModel:function(t,i){this.setFormPristine(!0),this.inputs.forEach(function(i){var e=i.props.name;t&&t.hasOwnProperty(e)?i.setValue(t[e]):i.resetValue()}),i&&this.validateForm()},resetModel:function(t){this.inputs.forEach(function(i){var e=i.props.name;t&&t.hasOwnProperty(e)?i.setValue(t[e]):i.resetValue()}),this.validateForm()},setInputValidationErrors:function(t){this.inputs.forEach(function(i){var e=i.props.name,r=[{_isValid:!(e in t),_validationError:"string"==typeof t[e]?[t[e]]:t[e]}];i.setState.apply(i,r)})},isChanged:function(){return!d.isSame(this.getPristineValues(),this.getCurrentValues())},getPristineValues:function(){return this.inputs.reduce(function(t,i){var e=i.props.name;return t[e]=i.props.value,t},{})},updateInputsWithError:function(t){var i=this;Object.keys(t).forEach(function(e,r){var n=d.find(i.inputs,function(t){return t.props.name===e});if(!n)throw new Error("You are trying to update an input that does not exist. Verify errors object with input names. "+JSON.stringify(t));var s=[{_isValid:i.props.preventExternalInvalidation||!1,_externalError:"string"==typeof t[e]?[t[e]]:t[e]}];n.setState.apply(n,s)})},isFormDisabled:function(){return this.props.disabled},getCurrentValues:function(){return this.inputs.reduce(function(t,i){var e=i.props.name;return t[e]=i.state._value,t},{})},setFormPristine:function(t){this.setState({_formSubmitted:!t}),this.inputs.forEach(function(i,e){i.setState({_formSubmitted:!t,_isPristine:t})})},validate:function(t){this.state.canChange&&this.props.onChange(this.getCurrentValues(),this.isChanged());var i=this.runValidation(t);t.setState({_isValid:i.isValid,_isRequired:i.isRequired,_validationError:i.error,_externalError:null},this.validateForm)},runValidation:function(t,i){var e=this.getCurrentValues(),r=t.props.validationErrors,n=t.props.validationError;i=2===arguments.length?i:t.state._value;var s=this.runRules(i,e,t._validations),o=this.runRules(i,e,t._requiredValidations);"function"==typeof t.validate&&(s.failed=t.validate()?[]:["failed"]);var u=!!Object.keys(t._requiredValidations).length&&!!o.success.length,a=!(s.failed.length||this.props.validationErrors&&this.props.validationErrors[t.props.name]);return{isRequired:u,isValid:!u&&a,error:function(){if(a&&!u)return p;if(s.errors.length)return s.errors;if(this.props.validationErrors&&this.props.validationErrors[t.props.name])return"string"==typeof this.props.validationErrors[t.props.name]?[this.props.validationErrors[t.props.name]]:this.props.validationErrors[t.props.name];if(u){var i=r[o.success[0]];return i?[i]:null}return s.failed.length?s.failed.map(function(t){return r[t]?r[t]:n}).filter(function(t,i,e){return e.indexOf(t)===i}):void 0}.call(this)}},runRules:function(t,i,e){var r={errors:[],failed:[],success:[]};return Object.keys(e).length&&Object.keys(e).forEach(function(n){if(a[n]&&"function"==typeof e[n])throw new Error("Formsy does not allow you to override default validations: "+n);if(!a[n]&&"function"!=typeof e[n])throw new Error("Formsy does not have the validation rule: "+n);if("function"==typeof e[n]){var s=e[n](i,t);return void("string"==typeof s?(r.errors.push(s),r.failed.push(n)):s||r.failed.push(n))}if("function"!=typeof e[n]){var s=a[n](i,t,e[n]);return void("string"==typeof s?(r.errors.push(s),r.failed.push(n)):s?r.success.push(n):r.failed.push(n))}return r.success.push(n)}),r},validateForm:function(){var t=this,i=function(){var t=this.inputs.every(function(t){return t.state._isValid});this.setState({isValid:t}),t?this.props.onValid():this.props.onInvalid(),this.setState({canChange:!0})}.bind(this);this.inputs.forEach(function(e,r){var n=t.runValidation(e);n.isValid&&e.state._externalError&&(n.isValid=!1),e.setState({_isValid:n.isValid,_isRequired:n.isRequired,_validationError:n.error,_externalError:!n.isValid&&e.state._externalError?e.state._externalError:null},r===t.inputs.length-1?i:null)}),!this.inputs.length&&this.isMounted()&&this.setState({canChange:!0})},attachToForm:function(t){this.inputs.indexOf(t)===-1&&this.inputs.push(t),this.validate(t)},detachFromForm:function(t){var i=this.inputs.indexOf(t);i!==-1&&(this.inputs=this.inputs.slice(0,i).concat(this.inputs.slice(i+1))),this.validateForm()},render:function(){var t=this.props,i=(t.mapping,t.validationErrors,t.onSubmit,t.onValid,t.onValidSubmit,t.onInvalid,t.onInvalidSubmit,t.onChange,t.reset,t.preventExternalInvalidation,t.onSuccess,t.onError,r(t,["mapping","validationErrors","onSubmit","onValid","onValidSubmit","onInvalid","onInvalidSubmit","onChange","reset","preventExternalInvalidation","onSuccess","onError"]));return o.createElement("form",n({},i,{onSubmit:this.submit}),this.props.children)}}),i.exports||i.module||i.define&&i.define.amd||(i.Formsy=u),t.exports=u}).call(i,function(){return this}())},function(i,e){i.exports=t},function(t,i,e){(function(i){"use strict";var r=e(3),n=i.React||e(1),s=function(t){return"string"==typeof t?t.split(/\,(?![^{\[]*[}\]])/g).reduce(function(t,i){var e=i.split(":"),r=e.shift();if(e=e.map(function(t){try{return JSON.parse(t)}catch(i){return t}}),e.length>1)throw new Error("Formsy does not support multiple args on string validations. Use object format of validations instead.");return t[r]=!e.length||e[0],t},{}):t||{}};t.exports={getInitialState:function(){return{_value:this.props.value,_isRequired:!1,_isValid:!0,_isPristine:!0,_pristineValue:this.props.value,_validationError:[],_externalError:null,_formSubmitted:!1}},contextTypes:{formsy:n.PropTypes.object},getDefaultProps:function(){return{validationError:"",validationErrors:{}}},componentWillMount:function(){var t=function(){this.setValidations(this.props.validations,this.props.required),this.context.formsy.attachToForm(this)}.bind(this);if(!this.props.name)throw new Error("Form Input requires a name property when used");t()},componentWillReceiveProps:function(t){this.setValidations(t.validations,t.required)},componentDidUpdate:function(t){r.isSame(this.props.value,t.value)||this.setValue(this.props.value),r.isSame(this.props.validations,t.validations)&&r.isSame(this.props.required,t.required)||this.context.formsy.validate(this)},componentWillUnmount:function(){this.context.formsy.detachFromForm(this)},setValidations:function(t,i){this._validations=s(t)||{},this._requiredValidations=i===!0?{isDefaultRequiredValue:!0}:s(i)},setValue:function(t){this.setState({_value:t,_isPristine:!1},function(){this.context.formsy.validate(this)}.bind(this))},resetValue:function(){this.setState({_value:this.state._pristineValue,_isPristine:!0},function(){this.context.formsy.validate(this)})},getValue:function(){return this.state._value},hasValue:function(){return""!==this.state._value},getErrorMessage:function(){var t=this.getErrorMessages();return t.length?t[0]:null},getErrorMessages:function(){return!this.isValid()||this.showRequired()?this.state._externalError||this.state._validationError||[]:[]},isFormDisabled:function(){return this.context.formsy.isFormDisabled()},isValid:function(){return this.state._isValid},isPristine:function(){return this.state._isPristine},isFormSubmitted:function(){return this.state._formSubmitted},isRequired:function(){return!!this.props.required},showRequired:function(){return this.state._isRequired},showError:function(){return!this.showRequired()&&!this.isValid()},isValidValue:function(t){return this.context.formsy.isValidValue.call(null,this,t)}}}).call(i,function(){return this}())},function(t,i){"use strict";var e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};t.exports={arraysDiffer:function(t,i){var e=!1;return t.length!==i.length?e=!0:t.forEach(function(t,r){this.isSame(t,i[r])||(e=!0)},this),e},objectsDiffer:function(t,i){var e=!1;return Object.keys(t).length!==Object.keys(i).length?e=!0:Object.keys(t).forEach(function(r){this.isSame(t[r],i[r])||(e=!0)},this),e},isSame:function(t,i){return("undefined"==typeof t?"undefined":e(t))===("undefined"==typeof i?"undefined":e(i))&&(Array.isArray(t)&&Array.isArray(i)?!this.arraysDiffer(t,i):"function"==typeof t?t.toString()===i.toString():"object"===("undefined"==typeof t?"undefined":e(t))&&null!==t&&null!==i?!this.objectsDiffer(t,i):t===i)},find:function(t,i){for(var e=0,r=t.length;e<r;e++){var n=t[e];if(i(n))return n}return null}}},function(t,i,e){(function(i){"use strict";var r=Object.assign||function(t){for(var i=1;i<arguments.length;i++){var e=arguments[i];for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])}return t},n=i.React||e(1),s=e(2);t.exports=function(){return function(t){return n.createClass({mixins:[s],render:function(){return n.createElement(t,r({setValidations:this.setValidations,setValue:this.setValue,resetValue:this.resetValue,getValue:this.getValue,hasValue:this.hasValue,getErrorMessage:this.getErrorMessage,getErrorMessages:this.getErrorMessages,isFormDisabled:this.isFormDisabled,isValid:this.isValid,isPristine:this.isPristine,isFormSubmitted:this.isFormSubmitted,isRequired:this.isRequired,showRequired:this.showRequired,showError:this.showError,isValidValue:this.isValidValue},this.props))}})}}}).call(i,function(){return this}())},function(t,i,e){(function(i){"use strict";function r(t){return t.displayName||t.name||("string"==typeof t?t:"Component")}var n=Object.assign||function(t){for(var i=1;i<arguments.length;i++){var e=arguments[i];for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])}return t},s=i.React||e(1),o=e(2);t.exports=function(t){return s.createClass({displayName:"Formsy("+r(t)+")",mixins:[o],render:function(){var i=this.props.innerRef,e=n({setValidations:this.setValidations,setValue:this.setValue,resetValue:this.resetValue,getValue:this.getValue,hasValue:this.hasValue,getErrorMessage:this.getErrorMessage,getErrorMessages:this.getErrorMessages,isFormDisabled:this.isFormDisabled,isValid:this.isValid,isPristine:this.isPristine,isFormSubmitted:this.isFormSubmitted,isRequired:this.isRequired,showRequired:this.showRequired,showError:this.showError,isValidValue:this.isValidValue},this.props);return i&&(e.ref=i),s.createElement(t,e)}})}}).call(i,function(){return this}())},function(t,i){"use strict";var e=function(t){return null!==t&&void 0!==t},r=function(t){return""===t},n={isDefaultRequiredValue:function(t,i){return void 0===i||""===i},isExisty:function(t,i){return e(i)},matchRegexp:function(t,i,n){return!e(i)||r(i)||n.test(i)},isUndefined:function(t,i){return void 0===i},isEmptyString:function(t,i){return r(i)},isEmail:function(t,i){return n.matchRegexp(t,i,/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i)},isUrl:function(t,i){return n.matchRegexp(t,i,/^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i)},isTrue:function(t,i){return i===!0},isFalse:function(t,i){return i===!1},isNumeric:function(t,i){return"number"==typeof i||n.matchRegexp(t,i,/^[-+]?(?:\d*[.])?\d+$/)},isAlpha:function(t,i){return n.matchRegexp(t,i,/^[A-Z]+$/i)},isAlphanumeric:function(t,i){return n.matchRegexp(t,i,/^[0-9A-Z]+$/i)},isInt:function(t,i){return n.matchRegexp(t,i,/^(?:[-+]?(?:0|[1-9]\d*))$/)},isFloat:function(t,i){return n.matchRegexp(t,i,/^(?:[-+]?(?:\d+))?(?:\.\d*)?(?:[eE][\+\-]?(?:\d+))?$/)},isWords:function(t,i){return n.matchRegexp(t,i,/^[A-Z\s]+$/i)},isSpecialWords:function(t,i){return n.matchRegexp(t,i,/^[A-Z\s\u00C0-\u017F]+$/i)},isLength:function(t,i,n){return!e(i)||r(i)||i.length===n},equals:function(t,i,n){return!e(i)||r(i)||i==n},equalsField:function(t,i,e){return i==t[e]},maxLength:function(t,i,r){return!e(i)||i.length<=r},minLength:function(t,i,n){return!e(i)||r(i)||i.length>=n}};t.exports=n},function(t,i){function e(t){return Object.keys(t).reduce(function(i,e){var r=e.match(/[^\[]*/i),n=e.match(/\[.*?\]/g)||[];n=[r[0]].concat(n).map(function(t){return t.replace(/\[|\]/g,"")});for(var s=i;n.length;){var o=n.shift();o in s?s=s[o]:(s[o]=n.length?isNaN(n[0])?{}:[]:t[e],s=s[o])}return i},{})}function r(t){function i(t,e,r){return Array.isArray(r)||"[object Object]"===Object.prototype.toString.call(r)?(Object.keys(r).forEach(function(n){i(t,e+"["+n+"]",r[n])}),t):(t[e]=r,t)}var e=Object.keys(t);return e.reduce(function(e,r){return i(e,r,t[r])},{})}t.exports={fromObj:r,toObj:e}}])});
//# sourceMappingURL=formsy-react.js.map