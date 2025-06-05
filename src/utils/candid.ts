export function toCandidOpt<T>(value: T | null | undefined): [] | [T] {
  return value != null ? [value] : [];
}

export function fromCandidOpt<T>(opt: [] | [T]): T | null | undefined {
  return opt.length > 0 ? opt[0] : null;
}

export function fromCandidOptString<T>(opt: [] | [T]): string {
  return opt.length > 0 ? String(opt[0]) : "";
}

export function unwrapOpt<T>(value: [] | [T]): T | null {
  return value.length ? value[0] : null;
}
