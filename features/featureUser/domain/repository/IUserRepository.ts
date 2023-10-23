import { PasswordType } from "../model/PasswordType";
import { UserEntity } from "../model/UserEntity";
import { UserProfile } from "../model/UserProfile";

export interface IUserRepository {
  /**
   * Add new user in database.
   * @param userEntity User of type UserEntity
   */
  addUser(userEntity: UserEntity): Promise<void>;

  /**
   * Update password of user.
   * @param username username of user.
   * @param newPassword new password of user.
   */
  updatePassword(username: string, newPassword: PasswordType): Promise<boolean>;

  /**
   * Returns `UserEntity` containing username and password of user.
   * `RETURNS PROMISE`
   * @param username username of user
   */
  getUser(username: string): Promise<UserEntity>;

  /**
   * Search a user by username
   * @param username username of the user to search for
   */
  searchUser(username: string): Promise<UserEntity[]>;

  /**
   * Returns `UserProfile` of user containing username, about user
   * @param username username of user
   */
  getUserProfile(username: string): Promise<UserProfile>;
}
