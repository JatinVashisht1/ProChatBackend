import { autoInjectable, inject } from "tsyringe";
import { I_USER_REPOSITORY } from "../../../../common/Constants";
import { IUserRepository } from "../../domain/repository/IUserRepository";
import { RequestHandler } from "express";
import { assertIsDefined } from "../../../../common/utils/assertIsDefined";
import createHttpError from "http-errors";
import { UserEntity } from "../../domain/model/UserEntity";
import { logger } from "../../../../common/winstonLoggerConfiguration";

interface searchUserRequestBody {
    username: string;
}

@autoInjectable()
export class SearchUserController {
    constructor (@inject(I_USER_REPOSITORY) private userRepository?: IUserRepository ) {}

    searchUserHandler: RequestHandler<unknown, unknown, searchUserRequestBody, unknown> = async (req, res, next) => {
        assertIsDefined(this.userRepository);
        
        const searchUsername = req.body.username;

        try {
            assertIsDefined(searchUsername);
            if (searchUsername.length == 0) {
                throw createHttpError(400, "username is required");
            }

            const users: string[] = (await this.userRepository.searchUser(searchUsername)).map((user)=>{
                return user.username;
            });
            logger.info(`search username: ${searchUsername}`)
            return res.status(200).json({searchString: searchUsername, users: users});

        } catch (error) {
            return next(error);
        }
    }


}