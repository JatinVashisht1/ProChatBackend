import { autoInjectable, inject } from "tsyringe";
import { I_USER_REPOSITORY } from "../../../../common/Constants";
import { IUserRepository } from "../../domain/repository/IUserRepository";
import { RequestHandler } from "express";
import { assertIsDefined } from "../../../../common/utils/assertIsDefined";
import createHttpError from "http-errors";

interface updateFirebaseTokenBody {
    updatedFirebaseToken?: string;
}

@autoInjectable()
export class UpdateFirebaseTokenController {
  constructor (@inject(I_USER_REPOSITORY) private userRepository?: IUserRepository) {}

  updateFirebaseTokenRequestHandler: RequestHandler<unknown, unknown, updateFirebaseTokenBody, unknown> = async (req, res, next) => {
    try {
        
      assertIsDefined(this.userRepository);
        
      const { updatedFirebaseToken } = req.body;
      const { username } = req;
      
      if (!updatedFirebaseToken) {
        throw createHttpError(404, "token is required");
      }

      await this.userRepository.updateUserFirebaseToken(username, updatedFirebaseToken);

      return res.status(200).json({ success: true, message: "successfully updated firebase token" });

    } catch (error) {
      return next(error);   
    }
  };

}