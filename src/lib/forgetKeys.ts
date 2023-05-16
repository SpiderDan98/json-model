import type { ObjectKey } from "@/types";

const forgetKeys = <Data extends object, IgnoreKey extends ObjectKey>(
  data: Data,
  ignore: IgnoreKey[]
): Omit<Data, (typeof ignore)[number]> =>
  Object.entries(data).reduce((attributes, [key, value]) => {
    if (ignore.includes(key as IgnoreKey)) {
      return attributes;
    }

    return {
      ...attributes,
      [key]: value,
    };
  }, {}) as Omit<Data, (typeof ignore)[number]>;

export default forgetKeys;
