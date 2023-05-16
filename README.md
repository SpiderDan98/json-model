# json model

A json model creator for client and server side.

## Install

```bash
yarn add -D json-model
```

## Example model

```ts
import createModel from "json-model";
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
import Relationship from "/path/to/relationship/model";
import User from "/path/to/user/model";

const json = {
  type: "users",
  name: "SpiderDan98",
  email: "danielkemna@t-online.de",
  relationshipNames: ["relationship"],
  relationship: {
    ...
  },
};

// Register relationship models globally
setModels({
  relationship: Relationship,
});

const user = new User(json);

console.log(user.name) // SpiderDan98
console.log(user.lowerName) // spiderdan98
console.log(user.relationship) // Relationship model
```