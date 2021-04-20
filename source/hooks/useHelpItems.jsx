import { useState, useEffect } from 'react';
import BirdIcon from '@assets/icons/help/bird.svg';
import BookIcon from '@assets/icons/help/book.svg';
import NewspaperIcon from '@assets/icons/help/newspaper.svg';
import StarIcon from '@assets/icons/help/star.svg';
import { useTranslation } from 'react-i18next';

const useHelpItems = () => {
  const [helpItems, setHelpItems] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    setHelpItems([
      {
        image: BookIcon,
        name: t('help.documentation'),
        onClick: (() => window.open('https://docs.plugwallet.ooo', '_blank')),
      },
      {
        image: NewspaperIcon,
        name: t('help.blog'),
        onClick: (() => window.open('https://docs.plugwallet.ooo/#resources', '_blank')),
      },
      {
        image: BirdIcon,
        name: t('help.followUs'),
        onClick: (() => window.open('https://twitter.com/plug_wallet', '_blank')),
      },
      {
        image: StarIcon,
        name: t('help.review'),
        onClick: (() => null),
      },
    ]);
  }, []);

  return { helpItems };
};

export default useHelpItems;
