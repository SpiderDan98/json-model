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
}
