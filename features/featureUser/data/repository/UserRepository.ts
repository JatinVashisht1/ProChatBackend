import createHttpError from "http-errors";
import { logger } from "../../../../common/winstonLoggerConfiguration";
import { PasswordType } from "../../domain/model/PasswordType";
import { UserEntity } from "../../domain/model/UserEntity";
import { IUserRepository } from "../../domain/repository/IUserRepository";
import { UserModel } from "../database/UserModel";
import { injectable, singleton } from "tsyringe";

@injectable()
@singleton()
export class UserRepository implements IUserRepository {
  constructor() {}

  async addUser(userEntity: UserEntity) {
    const username = userEntity.username;
    const userDb = await UserModel.findOne({ username: username });

    if (userDb) {
      throw createHttpError(409, "Username already exist");
    }

    await UserModel.create(userEntity);
  }
  async updatePassword(
    username: string,
    newPassword: PasswordType
  ): Promise<Boolean> {
    const userExist = await UserModel.findOne({ username: username });
    if (!userExist) throw createHttpError(404, "User not found");

    const updateResult = await UserModel.updateOne(
      { username: username },
      { password: newPassword }
    ).exec();

    return updateResult.acknowledged;
  }

  async getUser(username: string): Promise<UserEntity> {
    const user = await UserModel.findOne({ username: username });

    if (!user) {
      throw createHttpError(401, "invalid username or password");
    }

    const userEntity: UserEntity = {
      username: user.username,
      password: {
        salt: user.password.salt,
        hash: user.password.hash,
      },
    };

    return userEntity;
  }
}
