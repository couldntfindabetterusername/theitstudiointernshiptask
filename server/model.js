import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, default: "" },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  hobbies: {
    type: [String],
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
