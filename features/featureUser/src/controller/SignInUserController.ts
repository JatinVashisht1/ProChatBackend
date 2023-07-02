import { autoInjectable, inject } from "tsyringe";
import { I_USER_REPOSITORY } from "../../../../common/Constants";
import { IUserRepository } from "../../domain/repository/IUserRepository";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { PasswordType } from "../../domain/model/PasswordType";
import { issueJWT, validPassword } from "../../../utils/jwtUtils";
import { assertIsDefined } from "../../../../common/utils/assertIsDefined";
import { logger } from "../../../../common/winstonLoggerConfiguration";

interface signInUserBody {
  username?: string;
  password?: string;
}

@autoInjectable()
export class SignInController {
  constructor(
    @inject(I_USER_REPOSITORY) private userRepository?: IUserRepository
  ) {}

  signInHandler: RequestHandler<unknown, unknown, signInUserBody, unknown> =
    async (req, res, next) => {
      try {
        assertIsDefined(this.userRepository);

        const { username, password } = req.body;
        if (!username || !password) {
          throw createHttpError(412, "In sufficient credentials");
        }

        const userEntity = await this.userRepository.getUser(username);

        logger.info(JSON.stringify(userEntity));

        const passwordHashed: PasswordType = {
          salt: userEntity.password.salt,
          hash: userEntity.password.hash,
        };

        const isPasswordValid = validPassword(password, passwordHashed);

        if (!isPasswordValid) {
          throw createHttpError(401, "invalid username or password");
        }

        const jwt = issueJWT(username);

        return res.status(200).json({ success: true, token: jwt.token });
      } catch (error) {
        next(error);
      }
    };
}
