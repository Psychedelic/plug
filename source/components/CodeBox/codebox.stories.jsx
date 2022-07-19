import CodeBox from './index';

export default {
  title: 'UI/CodeBox',
  component: CodeBox,
};

const Template = (args) => <div style={{ width: 420 }}><CodeBox {...args} /></div>;

export const Default = Template.bind({});

Default.args = {
  prefix: '$',
  code: 'dfx canister --no-wallet call $(dfx identity get-wallet) wallet_call "(record { canister=(principal "<dank-canister-id>"); method_name="deposit"; args=(blob "(principal "<user-plug-principal>")"); cycles=<amount> })"',
};
