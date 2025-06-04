export function toCandidOpt<T>(value: T | null | undefined): [] | [T] {
  return value != null ? [value] : [];
}
