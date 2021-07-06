import BirdIcon from '@assets/icons/help/bird.svg';
import BookIcon from '@assets/icons/help/book.svg';
import NewspaperIcon from '@assets/icons/help/newspaper.svg';
import { useTranslation } from 'react-i18next';

const useHelpItems = () => {
  const { t } = useTranslation();

  return [
    {
      image: BookIcon,
      name: t('help.documentation'),
      onClick: (() => window.open('https://docs.plugwallet.ooo', '_blank')),
    },
    {
      image: NewspaperIcon,
      name: t('help.blog'),
      onClick: (() => window.open('https://medium.com/plugwallet', '_blank')),
    },
    {
      image: BirdIcon,
      name: t('help.followUs'),
      onClick: (() => window.open('https://twitter.com/plug_wallet', '_blank')),
    },
    // {
    //   image: StarIcon,
    //   name: t('help.review'),
    //   onClick: (() => null),
    // },
  ];
};

export default useHelpItems;
