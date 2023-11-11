import { autoInjectable, inject } from "tsyringe";
import { I_USER_REPOSITORY } from "../../../../common/Constants";
import { IUserRepository } from "../../domain/repository/IUserRepository";
import { RequestHandler } from "express";
import { assertIsDefined } from "../../../../common/utils/assertIsDefined";
import createHttpError from "http-errors";
import { logger } from "../../../../common/winstonLoggerConfiguration";

interface searchUserRequestBody {
    usernameBody: string;
}

@autoInjectable()
export class SearchUserController {
  constructor (@inject(I_USER_REPOSITORY) private userRepository?: IUserRepository) {}

  searchUserHandler: RequestHandler<unknown, unknown, searchUserRequestBody, unknown> = async (req, res, next) => {
    assertIsDefined(this.userRepository);
        
    const searchUsername = req.body.usernameBody;

    try {
      if (!searchUsername || searchUsername.length === 0) {
        throw createHttpError(400, "username is required");
      }
      assertIsDefined(searchUsername);

      const users: string[] = (await this.userRepository.searchUser(searchUsername)).map((user) => {
        return user.username;
      });
      logger.info(`search username: ${searchUsername}`);
      return res.status(200).json({ searchString: searchUsername, users: users });

    } catch (error) {
      return next(error);
    }
  };
}