import { InferSchemaType, Schema, model } from "mongoose";

const PasswordSchema = new Schema({
  salt: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
});

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: PasswordSchema,
      required: true,
    },

    about: {
      type: String,
      required: false,
      default: ""
    },
    
    connectivityStatus: {
      type: String,
      enum: ['online', 'offline'],
      required: true,
      default: "offline"
    },

    firebaseToken: {
      type: String,
      required: true,
      default: "",
    }
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ username: 'text' });

export type UserType = InferSchemaType<typeof UserSchema>;

export const UserModel = model<UserType>("User", UserSchema);
