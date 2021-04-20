import { StorageMock } from '@components';

import Popup from './Popup';

export default {
  title: 'Popup',
  component: Popup,
};

const Template = (args) => <div style={{ width: 420, margin: 20, boxShadow: '0 0 10px' }}><Popup {...args} /></div>;

export const Default = Template.bind({});
Default.args = {
  storage: new StorageMock(),
};
