/**
 * PropType
 *
 * 根据给定对象类型 T 和路径字符串 Path，提取路径对应的属性类型。
 *
 * 机制说明：
 * - 如果 Path 是字符串类型，则返回 unknown。
 * - 如果 Path 是 T 的直接键，则返回 T[Path] 对应的属性类型。
 * - 如果 Path 是一个嵌套路径（例如 "key1.key2"），则递归查找 T 中的键，直到找到最终的属性类型。
 * - 如果路径中的某个键不存在于对象 T 中，则返回 unknown。
 *
 * @template T - 要提取属性类型的对象类型。
 * @template Path - 要提取的属性路径，格式为字符串。
 *
 * @example
 * type Example = {
 *   a: {
 *     b: {
 *       c: string;
 *     };
 *   };
 *   d: number;
 * };
 *
 * type Result1 = PropType<Example, 'a.b.c'>; // Result1 的类型为 string
 * type Result2 = PropType<Example, 'd'>; // Result2 的类型为 number
 * type Result3 = PropType<Example, 'a.b.d'>; // Result3 的类型为 unknown
 */
export type PropType<T, Path extends string> = string extends Path
  ? unknown
  : Path extends keyof T
  ? T[Path]
  : Path extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PropType<T[K], R>
    : unknown
  : unknown;

/**
 * NestedKeyOf
 *
 * 生成一个类型，该类型表示给定对象的所有嵌套键路径。
 *
 * 机制说明：
 * - 遍历对象的每个键，如果该键对应的值是一个对象，则递归调用 NestedKeyOf 以获取其嵌套键路径。
 * - 如果该键对应的值不是对象，则仅返回该键。
 * - 最终返回的类型是一个字符串字面量联合类型，包含所有可能的嵌套路径。
 *
 * @template ObjectType - 要提取嵌套键路径的对象类型。
 *
 * @example
 * type Example = {
 *   a: {
 *     b: {
 *       c: string;
 *     };
 *   };
 *   d: number;
 * };
 *
 * type Result = NestedKeyOf<Example>;
 * // Result 的类型为：
 * // 'a' | 'a.b' | 'a.b.c' | 'd'
 */
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

/**
 * RecordNamePaths
 * 生成一个对象类型，其中每个键都是给定对象的嵌套路径，值是对应路径的属性类型。
 *
 * 机制说明：
 * - 使用 NestedKeyOf<T> 获取对象 T 的所有可能嵌套路径。
 * - 对于每个路径 K，使用 PropType<T, K> 获取该路径对应的属性类型。
 *
 * @example
 * type Example = {
 *   a: {
 *     b: {
 *       c: string;
 *     };
 *   };
 *   d: number;
 * };
 *
 * type Result = RecordNamePaths<Example>;
 * // Result 的类型为：
 * // {
 * //   'a': { b: { c: string } },
 * //   'a.b': { c: string },
 * //   'a.b.c': string,
 * //   'd': number
 * // }
 */
export type RecordNamePaths<T extends object> = {
  [K in NestedKeyOf<T>]: PropType<T, K>;
};
