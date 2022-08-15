const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const WextManifestWebpackPlugin = require('wext-manifest-webpack-plugin');

const sourcePath = path.join(__dirname, 'source');

module.exports = {
  devtool: false, // https://github.com/webpack/webpack/issues/1194#issuecomment-560382342

  stats: {
    all: false,
    builtAt: true,
    errors: true,
    hash: true,
  },

  mode: 'production',

  entry: {
    inpage: path.join(sourcePath, 'scripts', 'Inpage', 'index.js'),
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@components': path.join(path.resolve(__dirname, './source/components')),
      '@assets': path.join(path.resolve(__dirname, './source/assets')),
      '@shared': path.join(path.resolve(__dirname, './source/shared')),
      '@hooks': path.join(path.resolve(__dirname, './source/hooks')),
      '@redux': path.join(path.resolve(__dirname, './source/redux')),
      '@background': path.join(path.resolve(__dirname, './source/background')),
    },
  },

  module: {
    rules: [
      {
        type: 'javascript/auto', // prevent webpack handling json with its own loaders,
        test: /manifest\.json$/,
        use: {
          loader: 'wext-manifest-loader',
          options: {
            // set to false to not use package.json version for manifest
            usePackageJSONVersion: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(js|ts)x?$/,
        loader: 'babel-loader',
        // exclude: /node_modules/,
        options: {
          plugins: ['@babel/plugin-proposal-export-namespace-from'],
        },
      },
      {
        test: /\.(png|jpe?g|gif|jp2|webp|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
    ],
  },

  plugins: [
    // Plugin to not generate js bundle for manifest entry
    new WextManifestWebpackPlugin(),
    // Generate sourcemaps
    new webpack.SourceMapDevToolPlugin({ filename: false }),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
};
