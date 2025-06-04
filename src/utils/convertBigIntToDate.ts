export function convertBigIntToDate(bigIntDate: bigint) {
  return new Date(Number(bigIntDate));
}
