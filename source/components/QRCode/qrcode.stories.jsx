import QRCode from './index';

export default {
  title: 'Components/QRCode',
  component: QRCode,
};

const Template = (args) => <div style={{ position: 'relative', width: 420, height: 420 }}><QRCode {...args} /></div>;

export const Default = Template.bind({});
Default.args = {};
