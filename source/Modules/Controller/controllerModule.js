class ControllerModule {
  constructor(backgroundController, secureController, keyring) {
    this.keyring = keyring;
    this.secureController = secureController;
    this.backgroundController = backgroundController;
  }

  // Utils
  secureWrapper({ args, handlerObject }) {
    return this.secureController(
      args[0].callback,
      async () => {
        handlerObject.handler(...args);
      }
    );
  }

  // Exporter
  exposeMethods(handlerObjects) {
    handlerObjects.forEach(handlerObject => {
      this.backgroundController.exposeController(
        handlerObject.methodName,
        async (...args) => this.secureWrapper({ args, handlerObject })
      );
    });
  }
}

export default ControllerModule;
