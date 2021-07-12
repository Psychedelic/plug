import NavBar from './index';
import { RouterWrapper } from '../../../.storybook/decorators';

export default {
  title: 'Components/NavBar',
  component: NavBar,
  decorators: [
    (Story) => (
      <RouterWrapper story={Story} />
    ),
  ],
};

const Template = () => <NavBar />;

export const Default = Template.bind({});
Default.args = {};
