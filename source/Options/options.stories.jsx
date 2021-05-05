import { StorageMock } from '@components';

import Options from './Options';

export default {
  title: 'Options',
  component: Options,
};

const Template = (args) => <div style={{ width: 420, margin: 20, boxShadow: '0 0 10px' }}><Options {...args} /></div>;

export const Default = Template.bind({});
Default.args = {
  storage: new StorageMock(),
};
