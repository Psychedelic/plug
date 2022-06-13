export default ({ IDL }) => {
  const Result = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const ICNSReverseRegistrar = IDL.Service({
    getName: IDL.Func([IDL.Principal], [IDL.Text], ['query']),
    setName: IDL.Func([IDL.Text], [Result], []),
  });
  return ICNSReverseRegistrar;
};
export const init = ({ IDL }) => [IDL.Principal, IDL.Principal, IDL.Text];
