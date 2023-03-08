import { model, Schema } from "mongoose";

const documentModelName = "User";
const collectionName = "users";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  email: {
    type: String,
    required: true,
  },
  games: {
    type: Array,
  },
});

const User = model(documentModelName, userSchema, collectionName);

export default User;
