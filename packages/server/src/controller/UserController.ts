import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Request, Response, NextFunction } from "express";

export class UserController {
  private userRepository = getRepository(User);

  async getAll(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find();
  }

  async getById(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.findOne(request.params.id);
  }

  async add(request: Request, response: Response, next: NextFunction) {
    let user = await this.userRepository.save(request.body);
    response.json({
      userId: user.id
    })
  }

  async updateUserIndex(request: Request, response: Response, next: NextFunction) {
    let user = await this.userRepository.findOne(request.body.id);
    user.locationIndex = request.body.locationIndex
    await this.userRepository.save(user)
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let userToRemove = await this.userRepository.findOne(
      request.params.id
    );
    await this.userRepository.remove(userToRemove);
  }
}
