export interface CredentialsStructure {
  environments: Environment[];
}

export interface Environment {
  name: string;
  orgId: string;
  baseUrl: string;
  users: User[];
}

export interface User {
  label: string;
  credentials: UserCredentials;
}

export interface UserCredentials {
  username: string;
  password: string;
}

//https://extendsclass.com/json-schema-validator.html
export const CredentialsStructureSchema = {
  definitions: {},
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://example.com/object1646599029.json",
  title: "Root",
  type: "object",
  required: ["environments"],
  properties: {
    environments: {
      $id: "#root/environments",
      title: "Environments",
      type: "array",
      minItems: 1,
      uniqueItems: true,
      items: {
        $id: "#root/environments/items",
        title: "Items",
        type: "object",
        required: ["name", "orgId", "baseUrl", "users"],
        properties: {
          name: {
            $id: "#root/environments/items/name",
            title: "Name",
            type: "string"
          },
          orgId: {
            $id: "#root/environments/items/orgId",
            title: "Orgid",
            type: "string"
          },
          baseUrl: {
            $id: "#root/environments/items/baseUrl",
            title: "Baseurl",
            type: "string"
          },
          users: {
            $id: "#root/environments/items/users",
            title: "Users",
            type: "array",
            minItems: 1,
            uniqueItems: true,
            items: {
              $id: "#root/environments/items/users/items",
              title: "Items",
              type: "object",
              required: ["label", "credentials"],
              properties: {
                label: {
                  $id: "#root/environments/items/users/items/label",
                  title: "Label",
                  type: "string"
                },
                credentials: {
                  $id: "#root/environments/items/users/items/credentials",
                  title: "Credentials",
                  type: "object",
                  required: ["username", "password"],
                  properties: {
                    username: {
                      $id: "#root/environments/items/users/items/credentials/username",
                      title: "Username",
                      type: "string"
                    },
                    password: {
                      $id: "#root/environments/items/users/items/credentials/password",
                      title: "Password",
                      type: "string"
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
