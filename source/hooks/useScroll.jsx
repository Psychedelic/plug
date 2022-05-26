import { useState } from 'react';

export default function useScroll(offset = 0) {
  const [scrollTop, setScrollTop] = useState(0);
  const [fullScroll, setFullScroll] = useState(false);
  const onScroll = (event) => {
    setFullScroll(
      event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - offset,
    );
    setScrollTop(event.target.scrollTop);
  };
  return { scrollTop, fullScroll, onScroll };
}
