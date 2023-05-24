export declare type ObjectKey = string | number;

export interface Config {
  models: Record<string, Model<any, any>>;
  ignoreAttributes: ObjectKey[];
  resolveModelName: <M extends object>(model: M) => ObjectKey;
  resolveRelationshipNames: <M extends object>(model: M) => ObjectKey[];
}

export declare type ConfigDefinition =
  | ((config: Config) => config)
  | Partial<Config>;

export interface Model<Output extends object = {}> {
  new (data: Record<string, unknown>, localConfig?: ConfigDefinition): Output;

  static create<
    T extends object,
    Data extends Record<string, unknown> | Record<string, unknown>[] = {}
  >(
    this: new (...args: any[]) => T,
    data: Data,
    localConfig?: ConfigDefinition = {}
  ): Data extends object[] ? (Output & T)[] : Output & T;
}
