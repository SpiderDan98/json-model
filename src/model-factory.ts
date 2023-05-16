import forgetKeys from "./lib/forgetKeys";
import type { Config, ConfigDefinition, Model } from "./types";

let globalConfig: Config = {
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

const resolveConfig = (currentConfig: Config, ...config: ConfigDefinition[]) =>
  config.reduce<Config>(
    (currentConfig, configDefinition) =>
      typeof configDefinition === "function"
        ? configDefinition(currentConfig)
        : {
            ...currentConfig,
            ...configDefinition,
          },
    currentConfig
  );

export const createModel = <Data extends object = {}>(
  modelConfig: ConfigDefinition = {}
) =>
  class {
    constructor(data: Data, localConfig: ConfigDefinition = {}) {
      const {
        resolveModelName,
        resolveRelationshipNames,
        ignoreAttributes,
        models,
      } = resolveConfig(globalConfig, modelConfig, localConfig);
      const relationships = resolveRelationshipNames(data);
      const attributes = forgetKeys(data, [
        ...relationships,
        ...ignoreAttributes,
      ]);

      Object.assign(this, attributes);

      for (const relationship of relationships) {
        const relationData = data[relationship as keyof Data];
        const isMany = Array.isArray(relationData);
        const RelationshipModel =
          models[resolveModelName(isMany ? relationData?.[0] : relationData)];

        if (!RelationshipModel) {
          console.error(`Model ${relationship} not registred.`);
          return;
        }

        Object.defineProperty(this, relationship, {
          get() {
            const relationModel = isMany
              ? relationData.map((relation) => new RelationshipModel(relation))
              : new RelationshipModel(relationData as object);

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
  } as Model<Data>;

export default createModel;
