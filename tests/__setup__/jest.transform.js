const transformer = require('babel-jest');

const babelOptions = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  plugins: [
    "transform-class-properties",
    "transform-object-rest-spread",
    "transform-react-jsx"
  ]
};
module.exports = transformer.default.createTransformer({...babelOptions});
