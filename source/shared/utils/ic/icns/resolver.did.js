export default ({ IDL }) => {
  const Info = IDL.Record({
    extensionLimit: IDL.Nat,
    memSize: IDL.Nat,
    heapSize: IDL.Nat,
    maxRecordLength: IDL.Nat,
    entries: IDL.Nat,
    cycles: IDL.Nat,
  });
  const DefaultInfoExt = IDL.Record({
    btc: IDL.Opt(IDL.Text),
    eth: IDL.Opt(IDL.Text),
    icp: IDL.Opt(IDL.Text),
    pid: IDL.Opt(IDL.Principal),
    url: IDL.Opt(IDL.Text),
    twitter: IDL.Opt(IDL.Text),
    host: IDL.Opt(
      IDL.Variant({ url: IDL.Text, canister: IDL.Principal }),
    ),
    canisterExtensions: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Principal)),
    description: IDL.Opt(IDL.Text),
    email: IDL.Opt(IDL.Text),
    textExtensions: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    addrExtensions: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    discord: IDL.Opt(IDL.Text),
    mainCanister: IDL.Opt(IDL.Principal),
    telegram: IDL.Opt(IDL.Text),
    github: IDL.Opt(IDL.Text),
    avatar: IDL.Opt(IDL.Text),
  });
  const Result = IDL.Variant({ ok: IDL.Null, err: IDL.Text });
  const ICNSResolver = IDL.Service({
    getAddr: IDL.Func([IDL.Text, IDL.Text], [IDL.Opt(IDL.Text)], []),
    getCanister: IDL.Func(
      [IDL.Text, IDL.Text],
      [IDL.Opt(IDL.Principal)],
      [],
    ),
    getExtensionLimit: IDL.Func([], [IDL.Nat], ['query']),
    getHost: IDL.Func(
      [IDL.Text],
      [
        IDL.Opt(
          IDL.Variant({ url: IDL.Text, canister: IDL.Principal }),
        ),
      ],
      ['query'],
    ),
    getInfo: IDL.Func([], [Info], ['query']),
    getLengthLimit: IDL.Func([], [IDL.Nat], ['query']),
    getText: IDL.Func([IDL.Text, IDL.Text], [IDL.Opt(IDL.Text)], []),
    getUserDefaultInfo: IDL.Func(
      [IDL.Text],
      [IDL.Opt(DefaultInfoExt)],
      ['query'],
    ),
    setAddr: IDL.Func([IDL.Text, IDL.Text, IDL.Opt(IDL.Text)], [Result], []),
    setCanister: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Opt(IDL.Principal)],
      [Result],
      [],
    ),
    setExtensionLimit: IDL.Func([IDL.Nat], [IDL.Nat], []),
    setHost: IDL.Func(
      [
        IDL.Text,
        IDL.Opt(
          IDL.Variant({ url: IDL.Text, canister: IDL.Principal }),
        ),
      ],
      [Result],
      [],
    ),
    setLengthLimit: IDL.Func([IDL.Nat], [IDL.Nat], []),
    setText: IDL.Func([IDL.Text, IDL.Text, IDL.Opt(IDL.Text)], [Result], []),
  });
  return ICNSResolver;
};
export const init = ({ IDL }) => [IDL.Principal, IDL.Principal];
