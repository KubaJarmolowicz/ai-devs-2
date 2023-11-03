export const addUserSchema = {
  name: "addUser",
  description: "Add user to the database",
  parameters: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "User's first name",
      },
      surname: {
        type: "string",
        description: "User's last name",
      },
      year: {
        type: "integer",
        description: "User's year of birth",
      },
    },
  },
};
