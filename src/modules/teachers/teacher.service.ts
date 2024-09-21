import { NewUserWithoutPassword, UserService } from "../users/user.service";
import { TeacherRepository } from "./teacher.repository";

export type NewTeacher = {
  name: string;
  email: string;
};

export class TeacherService {
  private teacherRepository: TeacherRepository;
  private userService: UserService;

  constructor(teacherRepository: TeacherRepository, userService: UserService) {
    this.teacherRepository = teacherRepository;
    this.userService = userService;
  }

  async createTeacher(teacher: NewTeacher) {
    try {
      const newTeacher = {
        ...teacher,
        role: "TEACHER",
      };
      const newUser = await this.userService.createUserWithoutPassword(
        newTeacher
      );
      this.teacherRepository.createTeacher(newUser.id);
    } catch (error) {
      throw error;
    }
  }
}
