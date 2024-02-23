export declare type ObjectKey = string | number | symbol;

export declare type CastFunction = (value: unknown) => unknown;
export declare type DefaultCasts = "date" | "string" | "int" | "float";

export interface Config<CastKeys extends ObjectKey = ObjectKey> {
  casts: Partial<Record<CastKeys, DefaultCasts | CastFunction>>;
  models: Record<string, Model<any>>;
  ignoreAttributes: ObjectKey[];
  resolveModelName: <M extends object>(model: M) => ObjectKey;
  resolveRelationshipNames: <M extends object>(model: M) => ObjectKey[];
}

export declare type ConfigDefinition<CastKeys extends ObjectKey = ObjectKey> =
  | ((config: Config<CastKeys>) => Config<CastKeys>)
  | Partial<Config<CastKeys>>;

export interface Model<Output extends object = {}> {
  new (data: object, localConfig?: ConfigDefinition<keyof Output>): Output;

  create<T extends object, Data extends object | object[] = {}>(
    this: new (...args: any[]) => T,
    data: Data,
    localConfig?: ConfigDefinition<keyof Output>
  ): Data extends object[] ? (Output & T)[] : Output & T;
}
