import Tabs from './index';

export default {
  title: 'UI/Tabs',
  component: Tabs,
};

const Template = (args) => <Tabs {...args} />;

export const Default = Template.bind({});
Default.args = {
  tabs: [{
    label: 'First tab',
    component: <div>first content</div>,
  },
  {
    label: 'Second tab',
    component: <div>second content</div>,
  }],
};
