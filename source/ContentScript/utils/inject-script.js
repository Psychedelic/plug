const injectScript = (filePath, content) => {
  const container = document.head || document.documentElement;
  const script = document.createElement('script');

  script.setAttribute('async', 'false');
  script.setAttribute('type', 'text/javascript');

  if (content) {
    script.textContent = content;
  }

  if (filePath) {
    script.setAttribute('src', filePath);
  }

  container.insertBefore(script, container.children[0]);
  container.removeChild(script);
};

export default injectScript;
