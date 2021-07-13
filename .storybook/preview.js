import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import initConfig from "../source/locales";
import { withProvider } from './decorators';
import { addDecorator } from '@storybook/react';

i18n.use(initReactI18next).init(initConfig);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

// global decorator
addDecorator(withProvider);
