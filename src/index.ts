import createModel from "@/model-factory";

export type * from "@/types";
export * from "@/model-factory";
const ProjectModel = createModel<{
  type: "projects";
  url: string;
}>();

const UserModel = createModel<{
  type: "users";
  name: string;
  projects: Project[];
}>();

class Project extends ProjectModel {
  log = () => console.log(this.url);
}

class User extends UserModel {
  lower = this.name.toLowerCase();
  test = this.name || undefined;
}

const jsonUser = {
  type: "users",
  name: "SpiderDan98",
  relationshipNames: ["projects"],
  projects: [
    {
      type: "projects",
      url: "https://darts-turniere.de",
    },
  ],
};

const jsonUsers = [
  jsonUser,
  jsonUser,
  {
    type: "users",
    name: "TESTWESRs",
    relationshipNames: ["projects"],
    projects: [],
  },
];

const user = User.create(jsonUser, {
  models: {
    projects: Project,
  },
});

const users = User.create(jsonUsers, {
  models: {
    projects: Project,
  },
});

user.projects[0].log();

console.log(user.test);

console.log(user, users);

export default createModel;
