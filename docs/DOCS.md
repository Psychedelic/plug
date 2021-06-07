# App Architecture

![App Diagram](https://storageapi-dev.fleek.co/gpuente123dev-team-bucket/Plug%20Diagram.png)

## Browser/WebView

- `Provider`: Object injected by the browser extension (plug) or the webview (plug mobile). It has a **cross-platform promise based** interface (it can be based on [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193)) used by web apps to interact with the wallet . The provider can be injected on `window.ic` or `window.plug`
- `Message Handler`: This library is specific for every platform. It handles the message exchange between the provider and the wallet (browser extension / mobile app). It should use JSON RPC as protocol to exchange the messages.

Message Hanlder implementation draft

```typescript
// Browser Message Handler
export type Error = {
  code: number,
  message: string,
  data?: any,
};

export type Req = {
  jsonrpc: '2.0',
  method: string,
  params: any[],
  id?: string | number,
};

export type Res = {
  jsonrpc: '2.0',
  result?: any,
  error?: Error,
  id: string | number,
};

type Controller = (req: Req) => null | Res;

export const sendMessage = (method: string, params: any[]): Promise<Res> => new Promise((resolve, reject) => {
  const messageId: number = createUniqueID();
  const req: Req = {
    id: messageId,
    method,
    params,
    jsonrpc: '2.0',
  };

  // Custom logic ...

  window.postMessage(req, '*');
  window.addEventListener('message', (event: { data: Res }) => {
    const { data } = event;
    if (data.id === messageId) {
      if (data.error) {
        return reject(error);
      }

      resolve(data.result);
    }
  });
});

export const sendResponse (res: Res): void => {
  window.postMessage(res, '*');
};

export const listenMessages = (controller: Controller): void => {
  window.addEventListener('message', (event: { data: Req }) => {
    const { data } = event;
    const res = controller(data);

    if (res) {
      window.postMessage(res, '*');
    }
  });
};




// Content Script
import { listenMessages } from 'web-message-handler';
import controllers from './controllers';

listenMessages(controllers);




// Web Page Provider
import { sendMessage, Res } from 'web-message-handler';

export const signTransaction = (transaction: any): Promise<Res> => {
  // Custom Logic...
  return sendMessage('sign_transaction', [transaction]);
};




// Webpage
window.plug.signTransaction('my-tx')
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });
```

## Browser Extension

- `Content Script`: Implements the web `browser message handler` to listen for calls and send the responses back to the provider. This script is also responsible for injecting the provider into the webpage:

```typescript
// Provider Injector Draft
const injectScript = (filePath: string, tag: string): void => {
  const node = documents.getElementsByTagName(tag)[0];
  const script = document.createElement("script");

  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", filePath);

  node.appendChild(script);
};

// usage
injectScript(chrome.extension.getURL("provider-script.js"), "body");
```

- `Background Script`: It contains the logic of the controllers (used to resolve the requests from the provider) and the logic to open **Extension Pages** related with the requests

  - `Controllers`: Functions that receive a `Req` object type and return (or not) a `Res` object type. If the response is handled in a different place (Extension Page), the req has to be passed to the response emitter to generate the `Res` object based on the ID. `void` controllers delegate the response to another resources that use `sendResponse` method to emit the res message.
  - `Extension Pages Handler`: A controller can open a popup window to confirm user actions. In this case the response is handled by the Popup Page or delegated back to a controller.

- `In Memory State`: It keeps the app state, used to handle the UI interactions. It can be a simple `Redux` store
- `Persisted State`: It keeps information persisted, like user information. This info can be loaded into the `In Memory State` as part of the initialization script for the extension. Options to use here can be `localStorage` or something similar
- `Extension Pages`: Pages that are included into the extension and can be opened dynamically for ask user actions (like notifications). Extension pages can be connected to the `In Memory State` and the `Persisted State` to trigger changes and trigger response messages using `sendResponse` from the Message Handler Lib

# Key Points

- `Browser API Support`: API support is different between the browsers. We have to consider an abstraction layer to provide a common interface between browsers, similar to [Extensionizer](https://github.com/MetaMask/extensionizer). Check the resources section / WebExtension API Support
- `Communication between Content Script / Background Script / Extension Pages`: This communication layer is not defined yet. We have to research which API the browser provides to communicate between them.
- `Security Points`: we need to research in order to get more info about possible security vulnerabilities. Check the section resources / messaging (item: MESSAGE PASSING AND SECURITY CONSIDERATIONS IN CHROME EXTENSIONS)
- `Provider Injection`: we have to define the provider injection object, interface and injection in window object process (consider that in the injection process, the provider should take an specific messaging handler). We can use EIP-1193 proposal as a draft to define our standard.
- `Handling extension pages`: Needs research for Browser API to open extension pages on new windows as a popup
- `Dank Communication`: We need to define how the extension is going to communicate with Dank

# Resources

- messaging:

  - [Send message from web page to chrome extension\'s background script](https://krasimirtsonev.com/blog/article/Send-message-from-web-page-to-chrome-extensions-background-script)
  - [sending message to chrome extension from a web page](https://stackoverflow.com/questions/11431337/sending-message-to-chrome-extension-from-a-web-page)
  - [Message passing](https://developer.chrome.com/docs/extensions/mv2/messaging/)
  - [Sending & Listening to Messages within Chrome Extension](https://ashiknesin.com/blog/sending-listening-to-messages-within-chrome-extension)
  - [Chrome Extension Tutorial: How to Pass Messages from a Page's Context](https://www.freecodecamp.org/news/chrome-extension-message-passing-essentials/)
  - [Building Chrome Extensions: Communicating Between Scripts](https://betterprogramming.pub/building-chrome-extensions-communicating-between-scripts-75e1dbf12bb7)
  - [How to communicate from your website to a Chrome Extension](https://patrickdesjardins.com/blog/how-to-communicate-from-your-website-to-a-chrome-extension)
  - [MESSAGE PASSING AND SECURITY CONSIDERATIONS IN CHROME EXTENSIONS](https://duo.com/labs/tech-notes/message-passing-and-security-considerations-in-chrome-extensions)

- Script Injection:

  - [Chrome Extension Tutorial: How to Pass Messages from a Page's Context](https://www.freecodecamp.org/news/chrome-extension-message-passing-essentials/)
  - [Use a content script to access the page context variables and functions](https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions)
  - [Chrome Extension Content Script - Inject Javascript before page code](https://stackoverflow.com/questions/55244963/chrome-extension-content-script-inject-javascript-before-page-code)
  - [Metamask Implementation](https://github.com/MetaMask/metamask-extension/blob/develop/app/scripts/contentscript.js#L40)

- Content Script Injection:

  - [Optionally inject Content Script](https://stackoverflow.com/questions/26667112/optionally-inject-content-script)

- EIP-1193:

  - [Proposal](https://eips.ethereum.org/EIPS/eip-1193)

- Content Script:

  - [Content scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)

- Extensions:

  - [Anatomy of an extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Anatomy_of_a_WebExtension)
  - [Browser Extensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)

- WebExtension API Support:

  - [Porting a Google Chrome extension](https://extensionworkshop.com/documentation/develop/porting-a-google-chrome-extension/)
  - [Chrome API Reference](https://developer.chrome.com/docs/extensions/reference/)
  - [Firefox API Reference](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Browser_support_for_JavaScript_APIs)

- Persisted Memory

  - [Storage API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage)

- In Memory State:

  - [Redux Docs](https://redux.js.org/introduction/getting-started)

- JSON RPC:
  - [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)
