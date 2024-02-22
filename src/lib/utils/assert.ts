export default function assert<T>(value: T): asserts value is NonNullable<T> {
  if (value == null) throw new Error('Value is nullish.');
}
