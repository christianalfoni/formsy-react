Formsy React Examples
=====================

To run and development examples:

1. Clone this repo
2. Run `npm install`
3. Start the development server with `npm run examples`
4. Point your browser to http://localhost:8080


## Possible Issues

Examples might not run if you have an old node packages. Try clear [npm cache](https://docs.npmjs.com/cli/cache#details) and reinstall dependencies:
```
rm -rf node_modules
npm cache clean
npm install
npm run examples
```

If it is not helped try update your node.js and npm.

## Examples

1. [**Login**](http://localhost:8080/login)

    Two required fields with simple validation.

2. [**Custom Validation**](http://localhost:8080/custom-validation)

    One field with added validation rule (`Formsy.addValidationRule`) and one field with dynamically added validation and error messages. 