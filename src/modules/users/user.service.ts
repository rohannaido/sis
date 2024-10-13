// Application layer
// use cases

import { User } from "./user";
import { UserRepository } from "./user.repository";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async registerUser(user: User, organizationId: number) {
    try {
      this.userRepository.getUserByUsername(user.name);

      if (user) {
        throw new Error("Username taken!"); // TODO: have error types
      }

      const newUser = this.userRepository.createUser(user, organizationId);

      return newUser;
    } catch (error) {
      throw error;
    }
  }
}
