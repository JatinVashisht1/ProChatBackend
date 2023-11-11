import { autoInjectable, inject } from "tsyringe";
import { UserRepository } from "../../data/repository/UserRepository";
import { I_USER_REPOSITORY } from "../../../../common/Constants";
import { RequestHandler } from "express";
import { assertIsDefined } from "../../../../common/utils/assertIsDefined";
import createHttpError from "http-errors";
import { logger } from "../../../../common/winstonLoggerConfiguration";

interface GetUserProfileBody {
    usernameBody: string
}

@autoInjectable()
export class GetUserProfileController {
  constructor (@inject(I_USER_REPOSITORY) private userRepository?: UserRepository) {}
    
  getUserProfileRequestHandler: RequestHandler<unknown, unknown, GetUserProfileBody, unknown> = async(req, res, nextFunction) => {
    try {
      assertIsDefined(this.userRepository);
      const username = req.body.usernameBody;
      if (!username || username.length === 0) {
        throw createHttpError(400, "username is required");
        // throw Error("wtf is going on");
      }

      const userProfile = await this.userRepository.getUserProfile(username);

      return res.status(200).json(userProfile);
    } catch (error) {
      logger.error(`error is ${error}`);
      return nextFunction(error);
      // logger.info(`after error handler called`);
    }
  };
    
}