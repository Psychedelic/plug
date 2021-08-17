/**
 * @jest-environment ./tests/__setup__/test-enviroment
 */
import React from 'react';
import { create, act } from 'react-test-renderer';
import extension from 'extensionizer';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from '@ui';

import Welcome from '../source/Options/Views/Welcome';
import { ActionsStep } from '../source/Options/Views/Welcome/steps';
import useSteps from '../source/Options/Views/Welcome/hooks/useSteps';
import App from '../source/Popup/app';

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

describe("Login flow", () => {
  it("Renders inpage", () => {
    act(() => {
      create(
        <App />
      )
    });

    expect(extension.runtime.sendMessage.mock.calls.length).toBe(1);
    expect(browser.tabs.create.withArgs({ url: 'options.html' }).calledOnce).toBe(true);
  });

  describe("Welcome Inpage", () => {
    it("Renders Welcome inpage", () => {
      let child;
      let parent;

      act(() => {
        parent = create(
          <App />
        );

        child = create(
          <ThemeProvider theme={theme}>
            <Welcome />
          </ThemeProvider>
        );
      });

      const welcomeType = child.root.children[0].type;

      parent.root.findAllByType(welcomeType);
    });

    it("Renders ActionStep view", () => {
      let parent;
      let actionStep;

      act(() => {
        parent = create(
          <App />
        );

        actionStep = create(
          <ThemeProvider theme={theme}>
            <ActionsStep handleChangeBranch={() => {}} />
          </ThemeProvider>
        );
      });

      const actionStepType = actionStep.root.children[0].type;

      parent.root.findAllByType(actionStepType);
    });
  });
});
