export default ({ IDL }) => {
  const TxReceipt = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const Time = IDL.Int;
  const RecordExt = IDL.Record({
    ttl: IDL.Nat64,
    controller: IDL.Principal,
    resolver: IDL.Principal,
    owner: IDL.Principal,
    operator: IDL.Principal,
    name: IDL.Text,
    expiry: Time,
  });
  const Info = IDL.Record({
    memSize: IDL.Nat,
    heapSize: IDL.Nat,
    historySize: IDL.Nat,
    cycles: IDL.Nat,
    names: IDL.Nat,
    users: IDL.Nat,
  });
  const ICNSRegistry = IDL.Service({
    addWhitelist: IDL.Func([IDL.Text], [IDL.Bool], []),
    approve: IDL.Func([IDL.Text, IDL.Principal], [TxReceipt], []),
    balanceOf: IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    controller: IDL.Func([IDL.Text], [IDL.Opt(IDL.Principal)], ['query']),
    expiry: IDL.Func([IDL.Text], [IDL.Opt(Time)], ['query']),
    exportOwnerDomains: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(IDL.Text)))],
      ['query'],
    ),
    getApproved: IDL.Func([IDL.Text], [IDL.Opt(IDL.Principal)], ['query']),
    getControllerDomains: IDL.Func(
      [IDL.Principal],
      [IDL.Opt(IDL.Vec(RecordExt))],
      ['query'],
    ),
    getInfo: IDL.Func([], [Info], ['query']),
    getRecord: IDL.Func([IDL.Text], [IDL.Opt(RecordExt)], ['query']),
    getUserDomains: IDL.Func(
      [IDL.Principal],
      [IDL.Opt(IDL.Vec(RecordExt))],
      ['query'],
    ),
    isApproved: IDL.Func([IDL.Text, IDL.Principal], [IDL.Bool], ['query']),
    isApprovedForAll: IDL.Func(
      [IDL.Principal, IDL.Principal],
      [IDL.Bool],
      ['query'],
    ),
    isWhitelisted: IDL.Func([IDL.Text], [IDL.Bool], []),
    owner: IDL.Func([IDL.Text], [IDL.Opt(IDL.Principal)], ['query']),
    recordExists: IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    removeWhitelist: IDL.Func([IDL.Text], [IDL.Bool], []),
    resolver: IDL.Func([IDL.Text], [IDL.Opt(IDL.Principal)], ['query']),
    setApprovalForAll: IDL.Func([IDL.Principal, IDL.Bool], [TxReceipt], []),
    setController: IDL.Func([IDL.Text, IDL.Principal], [TxReceipt], []),
    setOwner: IDL.Func([IDL.Text, IDL.Principal], [TxReceipt], []),
    setRecord: IDL.Func(
      [IDL.Text, IDL.Principal, IDL.Principal, IDL.Nat64, Time],
      [TxReceipt],
      [],
    ),
    setResolver: IDL.Func([IDL.Text, IDL.Principal], [TxReceipt], []),
    setSubnodeExpiry: IDL.Func([IDL.Text, IDL.Text, Time], [TxReceipt], []),
    setSubnodeOwner: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Principal],
      [TxReceipt],
      [],
    ),
    setSubnodeRecord: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Principal, IDL.Principal, IDL.Nat64, Time],
      [TxReceipt],
      [],
    ),
    setTTL: IDL.Func([IDL.Text, IDL.Nat64], [TxReceipt], []),
    transfer: IDL.Func([IDL.Principal, IDL.Text], [TxReceipt], []),
    transferFrom: IDL.Func(
      [IDL.Principal, IDL.Principal, IDL.Text],
      [TxReceipt],
      [],
    ),
    ttl: IDL.Func([IDL.Text], [IDL.Opt(IDL.Nat64)], ['query']),
  });
  return ICNSRegistry;
};
export const init = ({ IDL }) => [IDL.Principal, IDL.Principal];
