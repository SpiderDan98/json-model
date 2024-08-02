import forgetKeys from "./lib/forgetKeys";
import type {
  CastFunction,
  Config,
  ConfigDefinition,
  DefaultCasts,
  Model,
} from "./types";

const defaultCasts: Record<DefaultCasts, CastFunction> = {
  date: (date) =>
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date,
  float: (float) =>
    typeof float === "number"
      ? float
      : typeof float === "string"
      ? parseFloat(float)
      : float,
  int: (int) =>
    typeof int === "number"
      ? int
      : typeof int === "string"
      ? parseInt(int)
      : int,
  string: (string) => (!string ? string : String(string)),
};

let globalConfig: Config = {
  casts: {},
  models: {},
  ignoreAttributes: [],
  resolveModelName: (model) => (model as any)?.type || "",
  resolveRelationshipNames: (model) => (model as any)?.relationshipNames || [],
};

export const setModels = (newModels: Record<string, Model<any>>) =>
  (globalConfig.models = newModels);

export const addModel = <T extends Model>(modelName: string, model: T) =>
  (globalConfig.models[modelName] = model);

export const removeModel = (modelName: string) =>
  delete globalConfig.models[modelName];

export const setGlobalConfig = (newConfig: Config) =>
  (globalConfig = newConfig);

export const getGlobalConfig = () => globalConfig;

const resolveConfig = (baseConfig: Config, ...config: ConfigDefinition[]) =>
  config.reduce<Config>(
    (baseConfig, configDefinition) =>
      typeof configDefinition === "function"
        ? configDefinition(baseConfig)
        : {
            ...baseConfig,
            ...configDefinition,
          },
    baseConfig
  );

export const createModel = <Data extends object = {}>(
  modelConfig: ConfigDefinition<keyof Data> = {}
) =>
  class BaseModel {
    constructor(data: Data, localConfig: ConfigDefinition<keyof Data> = {}) {
      const {
        resolveModelName,
        resolveRelationshipNames,
        ignoreAttributes,
        models,
        casts,
      } = resolveConfig(globalConfig, modelConfig, localConfig);
      const relationships = resolveRelationshipNames(data);
      const attributes = forgetKeys(data, [
        ...relationships,
        ...ignoreAttributes,
      ]);

      for (const [key, cast] of Object.entries(casts)) {
        const resolvedCast =
          typeof cast === "string" ? defaultCasts[cast] : cast;
        if ((attributes as any)[key]) {
          (attributes as any)[key] = resolvedCast?.((attributes as any)[key]);
        }
      }

      Object.assign(this, attributes);

      for (const relationship of relationships) {
        const relationData = data[relationship as keyof Data];
        const isMany = Array.isArray(relationData);
        const RelationshipModel =
          models[
            resolveModelName(
              isMany ? relationData?.[0] : relationData
            ) as string
          ];

        if (isMany ? !relationData.length : !relationData) {
          return;
        }

        if (!RelationshipModel) {
          console.error(`Model ${relationship as string} not registred.`);
          return;
        }

        Object.defineProperty(this, relationship, {
          get() {
            const relationModel = RelationshipModel.create(
              relationData as Record<string, unknown>
            );

            Object.defineProperty(this, relationship, {
              value: relationModel,
              writable: false,
              configurable: false,
            });

            return relationModel;
          },
          configurable: true,
          enumerable: true,
        });
      }
    }

    static create<T extends BaseModel>(
      this: new (...args: any[]) => T,
      data: Data,
      localConfig?: ConfigDefinition
    ) {
      if (Array.isArray(data)) {
        return data.map((data) => new this(data, localConfig));
      }

      return new this(data, localConfig);
    }
  } as Model<Data>;

export default createModel;
