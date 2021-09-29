/**
 * @jest-environment ./tests/__setup__/test-enviroment
 */
import React from 'react';
import { create, act } from 'react-test-renderer';
import extension from 'extensionizer';

import { HANDLER_TYPES } from '@background/Keyring';
import Welcome from '../../source/Options/Views/Welcome';
import { ActionsStep } from '../../source/Options/Views/Welcome/steps';
import useSteps from '../../source/Options/Views/Welcome/hooks/useSteps';
import App from '../../source/Popup/app';
import Popup from '../../source/Popup/Popup';

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
  afterEach(() => {
    extension.reset();
  });

  it("Creates a browser tab when no Keyring has no locks", () => {
    act(() => {
      create(
        <App />
      )
    });

    expect(HANDLER_TYPES.GET_LOCKS).toBeDefined();
    expect(extension.runtime.sendMessage.mock.calls.length).toBe(1);
    expect(extension.runtime.sendMessage.mock.calls[0][0].type).toBe(HANDLER_TYPES.GET_LOCKS);
    expect(browser.tabs.create.withArgs({ url: 'options.html' }).calledOnce).toBe(true);
  });

  it("Sets initial route to 'login' on locked keyring", () => {
    extension.runtime.sendMessage.mockImplementationOnce((args, cb) => cb({ isInitialized: true }));

    let component;
    act(() => {
      component = create(
        <App />
      )
    });

    expect(component.root.findByType(Popup).props.initialRoute).toBe('login');
  });

  /*
  it("Sets initial route to 'home' on unlocked keyring", () => {
    extension.runtime.sendMessage.mockImplementationOnce((args, cb) => cb({
      isInitialized: true,
      isUnlocked: true,
    }));

    let component;
    act(() => {
      component = create(
        <App />
      )
    });

    console.log(component.root.findByType(Popup).props);
  });
  */
});
