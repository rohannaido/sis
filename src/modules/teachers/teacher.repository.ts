import db from "@/db";

export class TeacherRepository {
  async createTeacher(userId: string) {
    try {
      db.teacher.create({
        data: {
          userId: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
