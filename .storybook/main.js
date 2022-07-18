const path = require("path");

module.exports = {
  webpackFinal: async (config) => {
    config.target = 'web';

    config.node = {
      fs: 'empty',
    };

    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.(js|ts)x?$/,
        loader: 'babel-loader',
        options: {
          plugins: [
            "@babel/plugin-proposal-export-namespace-from",
            "babel-plugin-react-require",
          ],
          presets: [
            "@babel/react",
            ["@babel/preset-env", {
              modules: "commonjs"
            }]
          ]
        },
      },
    ];

    config.resolve.alias = {
      "@components": path.join(path.resolve(__dirname, "../source/components")),
      "@assets": path.join(path.resolve(__dirname, "../source/assets")),
      "@shared": path.join(path.resolve(__dirname, "../source/shared")),
      "@hooks": path.join(path.resolve(__dirname, "../source/hooks")),
      "@redux": path.join(path.resolve(__dirname, "../source/redux")),
      "@background": path.join(path.resolve(__dirname, "../source/Background")),
    };

    return config;
  },
  stories: [
    "../source/**/*.stories.mdx",
    "../source/**/*.stories.@(js|jsx|ts|tsx)",
    "../source/**/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
};
