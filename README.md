# json model

A json model creator for client and server side.

## Install

```bash
yarn add -D @spiderdan98/json-model
```

## Example model

```ts
import createModel from "@spiderdan98/json-model";
import Relationship from "/path/to/relationship/model";

export const USER_TYPE = "users";

const Model = createModel<{
  type: typeof USER_TYPE;
  name: string;
  email: string;
  relationshipNames?: string[];
  relationship: Relationship[];
}>();

class User extends Model {
  lowerName = this.name.toLowerCase(),
}

export default User;
```

## Example model usage

```ts 
import { setModels } from "@spiderdan98/json-model";
import Relationship from "/path/to/relationship/model";
import User from "/path/to/user/model";

const json = {
  type: "users",
  name: "SpiderDan98",
  email: "test@example.com",
  relationshipNames: ["relationship"],
  relationship: {
    ...
  },
};

// Register relationship models globally
setModels({
  relationship: Relationship,
});

const user = User.create(json, {
  // Register relationship models on create
  relationship: Relationship,
});

console.log(user.name); // SpiderDan98
console.log(user.lowerName); // spiderdan98
console.log(user.relationship); // Relationship model

const users = User.create([json]);

console.log(users[0].name); // SpiderDan98
console.log(users[0].lowerName); // spiderdan98
console.log(users[0].relationship); // Relationship model
```