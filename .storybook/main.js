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
      "@ui": path.join(path.resolve(__dirname, "../source/ui")),
      "@components": path.join(path.resolve(__dirname, "../source/components")),
      "@assets": path.join(path.resolve(__dirname, "../source/assets")),
      "@shared": path.join(path.resolve(__dirname, "../source/shared")),
      "@hooks": path.join(path.resolve(__dirname, "../source/hooks")),
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
