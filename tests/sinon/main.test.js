/**
 * @jest-environment ./tests/__setup__/test-enviroment
 */
import React from 'react';
import { create, act } from 'react-test-renderer';
import extension from 'extensionizer';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from '@ui';

import Welcome from '../../source/Options/Views/Welcome';
import { ActionsStep } from '../../source/Options/Views/Welcome/steps';
import useSteps from '../../source/Options/Views/Welcome/hooks/useSteps';
import App from '../../source/Popup/app';

jest.mock('webextension-polyfill', () => ({
  __esModule: true,
  default: global.browser,
  namedExport: jest.fn(),
}));

jest.mock('extensionizer', () => ({
  __esModule: true,
  default: {
    ...global.browser,
    runtime: {
      ...global.browser.runtime,
      sendMessage: jest.fn().mockImplementation((args, cb) => cb(args)),
    }
  },
  namedExport: jest.fn()
}));

describe("Inpage", () => {
  it("Creates a browser tab", () => {
    act(() => {
      create(
        <App />
      )
    });

    expect(extension.runtime.sendMessage.mock.calls.length).toBe(1);
    expect(browser.tabs.create.withArgs({ url: 'options.html' }).calledOnce).toBe(true);
  });
});
