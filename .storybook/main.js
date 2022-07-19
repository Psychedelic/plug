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
      "@utils": path.join(path.resolve(__dirname, "../source/utils")),
      "@services": path.join(path.resolve(__dirname, "../source/services")),
      "@constants": path.join(path.resolve(__dirname, "../source/constants")),
      "@styles": path.join(path.resolve(__dirname, "../source/styles")),
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
