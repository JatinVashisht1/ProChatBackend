var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { autoInjectable, inject } from "tsyringe";
import { UserRepository } from '../../data/repository/UserRepository.js';
import { I_USER_REPOSITORY } from '../../../../common/Constants.js';
import { assertIsDefined } from '../../../../common/utils/assertIsDefined.js';
import createHttpError from "http-errors";
import { logger } from '../../../../common/winstonLoggerConfiguration.js';
export let GetUserProfileController = class GetUserProfileController {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    getUserProfileRequestHandler = async (req, res, nextFunction) => {
        try {
            assertIsDefined(this.userRepository);
            const username = req.body.usernameBody;
            if (!username || username.length === 0) {
                throw createHttpError(400, "username is required");
                // throw Error("wtf is going on");
            }
            const userProfile = await this.userRepository.getUserProfile(username);
            return res.status(200).json(userProfile);
        }
        catch (error) {
            logger.error(`error is ${error}`);
            return nextFunction(error);
            // logger.info(`after error handler called`);
        }
    };
};
GetUserProfileController = __decorate([
    autoInjectable(),
    __param(0, inject(I_USER_REPOSITORY)),
    __metadata("design:paramtypes", [UserRepository])
], GetUserProfileController);
