const mongoose = require("mongoose");
const brcypt = require("bcrypt");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
  },
  {
    timeStamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await brcypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
  const salt = await brcypt.genSalt(10);

  this.password = await brcypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
