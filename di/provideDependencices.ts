import "reflect-metadata";
import { container } from "tsyringe";
import { I_USER_REPOSITORY } from "../common/Constants";
import { IUserRepository } from "../features/featureUser/domain/repository/IUserRepository";
import { UserRepository } from "../features/featureUser/data/repository/UserRepository";

container.registerSingleton<IUserRepository>(I_USER_REPOSITORY, UserRepository);
