const domainMetadata = () => {
  const links = document.getElementsByTagName('link');
  const icons = [];

  for (let i = 0; i < links.length; i += 1) {
    const link = links[i];

    const rel = link.getAttribute('rel');

    if (rel) {
      if (rel.toLowerCase().indexOf('icon') > -1) {
        const href = link.getAttribute('href');

        if (href) {
          if (
            href.toLowerCase().indexOf('https:') === -1
            && href.toLowerCase().indexOf('http:') === -1
            && href.indexOf('//') !== 0
          ) {
            let absoluteHref = `${window.location.protocol}//${window.location.host}`;

            if (window.location.port) {
              absoluteHref += `:${window.location.port}`;
            }

            if (href.indexOf('/') === 0) {
              absoluteHref += href;
            } else {
              const path = window.location.pathname.split('/');
              path.pop();
              const finalPath = path.join('/');

              absoluteHref += `${finalPath}/${href}`;
            }

            icons.push(absoluteHref);
          } else if (href.indexOf('//') === 0) {
            const absoluteUrl = window.location.protocol + href;

            icons.push(absoluteUrl);
          } else {
            icons.push(href);
          }
        }
      }
    }
  }

  return {
    url: window.location.origin,
    icons,
  };
};

export default domainMetadata;
