import JsonBigInt from 'json-bigint';

export const recursiveParseBigint = (obj) => JsonBigInt.parse(JsonBigInt.stringify(obj));
export default { recursiveParseBigint };
