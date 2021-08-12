/**
 * @jest-environment ./tests/__setup__/test-enviroment
 */
import React from 'react';
import App from '../source/Popup/app';
import { create, act } from 'react-test-renderer';
import extension from 'extensionizer';

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
  it("Renders inpage", async () => {
    act(() => {
      create(
        <App />
      )
    });

    expect(extension.runtime.sendMessage.mock.calls.length).toBe(1);
    expect(browser.tabs.create.withArgs({ url: 'options.html' }).calledOnce).toBe(true);
  });
});
