const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const FilemanagerPlugin = require('filemanager-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WextManifestWebpackPlugin = require('wext-manifest-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const viewsPath = path.join(__dirname, 'views');
const sourcePath = path.join(__dirname, 'source');
const destPath = path.join(__dirname, 'extension');
const nodeEnv = process.env.NODE_ENV || 'development';
const targetBrowser = process.env.TARGET_BROWSER;

const inpageScript = fs.readFileSync(
  path.join(__dirname, 'dist', 'inpage.js'),
  'utf8',
);

const extensionReloaderPlugin = nodeEnv === 'development'
  ? new ExtensionReloader({
    port: 9090,
    reloadPage: true,
    entries: {
      // TODO: reload manifest on update
      contentScript: 'contentScript',
      background: 'background',
      extensionPage: ['popup', 'options'],
    },
  })
  : () => {
    this.apply = () => { };
  };

const getExtensionFileType = (browser) => {
  if (browser === 'opera') {
    return 'crx';
  }

  if (browser === 'firefox') {
    return 'xpi';
  }

  return 'zip';
};

module.exports = {
  devtool: false, // https://github.com/webpack/webpack/issues/1194#issuecomment-560382342

  stats: {
    all: false,
    builtAt: true,
    errors: true,
    hash: true,
  },

  mode: nodeEnv === 'test' ? 'none' : nodeEnv,

  entry: {
    manifest: path.join(sourcePath, 'manifest.json'),
    background: path.join(sourcePath, 'Background', 'index.js'),
    contentScript: path.join(sourcePath, 'scripts', 'ContentScript', 'index.js'),
    popup: path.join(sourcePath, 'views', 'Extension', 'index.jsx'),
    options: path.join(sourcePath, 'views', 'Options', 'index.jsx'),
    inpage: path.join(sourcePath, 'scripts', 'Inpage', 'index.js'),
    notification: path.join(sourcePath, 'views', 'Popup', 'index.jsx'),
  },
  node: {
    fs: 'empty',
  },
  output: {
    path: path.join(destPath, targetBrowser),
    filename: 'js/[name].bundle.js',
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
      '@modules': path.join(path.resolve(__dirname, './source/Modules')),
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
        test: /\.(png|jpe?g|gif|jp2|webp|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: /\.(js|ts)x?$/,
        loader: 'babel-loader',
        // exclude: /node_modules/,
        options: {
          plugins: ['@babel/plugin-proposal-export-namespace-from', '@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-optional-chaining'],
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            // It creates a CSS file per JS file which contains CSS
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader', // Takes the CSS files and returns the CSS with imports and url(...) for Webpack
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'autoprefixer',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          'resolve-url-loader', // Rewrites relative paths in url() statements
        ],
      },
    ],
  },

  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    // Plugin to not generate js bundle for manifest entry
    new WextManifestWebpackPlugin(),
    // Generate sourcemaps
    new webpack.DefinePlugin({
      INPAGE_SCRIPT: JSON.stringify(inpageScript),
    }),
    new webpack.SourceMapDevToolPlugin({ filename: false }),
    // environmental variables
    new webpack.EnvironmentPlugin(['NODE_ENV', 'TARGET_BROWSER']),
    // delete previous build files
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        path.join(process.cwd(), `extension/${targetBrowser}`),
        path.join(
          process.cwd(),
          `extension/${targetBrowser}.${getExtensionFileType(targetBrowser)}`,
        ),
      ],
      cleanStaleWebpackAssets: false,
      verbose: true,
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'popup.html'),
      inject: 'body',
      chunks: ['popup'],
      hash: true,
      filename: 'popup.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'options.html'),
      inject: 'body',
      chunks: ['options'],
      hash: true,
      filename: 'options.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(viewsPath, 'notification.html'),
      inject: 'body',
      chunks: ['notification'],
      hash: true,
      filename: 'notification.html',
    }),
    // write css file(s) to build folder
    new MiniCssExtractPlugin({ filename: 'css/[name].css' }),
    // copy static assets
    new CopyWebpackPlugin({
      patterns: [{ from: 'source/assets', to: 'assets' }],
    }),
    // plugin to enable browser reloading in development mode
    extensionReloaderPlugin,
  ],

  optimization: {
    minimize: nodeEnv === 'production',
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
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
      }),
      new FilemanagerPlugin({
        events: {
          onEnd: {
            archive: [
              {
                format: 'zip',
                source: path.join(destPath, targetBrowser),
                destination: `${path.join(
                  destPath,
                  targetBrowser,
                )}.${getExtensionFileType(targetBrowser)}`,
                options: { zlib: { level: 6 } },
              },
            ],
          },
        },
      }),
    ],
  },
};
