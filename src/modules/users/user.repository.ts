// Persistence layer
// Infrastructure layer

import db from "@/db";
import { User } from "./user";
export class UserRepository {
  async getUser(id: string) {
    try {
      const user = db.user.findUnique({
        where: {
          id,
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByUsername(username: string) {
    try {
      const user = db.user.findFirst({
        where: {
          name: username,
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async createUser(input: User, organizationId: number) {
    try {
      const user = await db.user.create({
        data: { ...input, organizationId },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }
}
