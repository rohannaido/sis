// Application layer
// use cases

import { User } from "./user";
import { UserRepository } from "./user.repository";

export type NewUserWithoutPassword = Omit<User, "id" | "password">;

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async registerUser(user: User) {
    try {
      this.userRepository.getUserByUsername(user.name);

      if (user) {
        throw new Error("Username taken!");
      }

      const newUser = this.userRepository.createUser(user);

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async createUserWithoutPassword(user: NewUserWithoutPassword) {
    try {
      this.userRepository.getUserByUsername(user.name);

      if (user) {
        throw new Error("Username taken!");
      }

      const newUser = this.userRepository.createUserWithoutPassword(user);

      return newUser;
    } catch (error) {
      throw error;
    }
  }
}
