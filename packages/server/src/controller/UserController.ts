import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import { Request, Response, NextFunction } from 'express';

export class UserController {
  private userRepository = getRepository(User);

  async getAll(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find();
  }

  async getById(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.findOne(request.params.id);
  }

  async add(request: Request, response: Response, next: NextFunction) {
    let users = await this.userRepository.find({
      where: {
        notificationId: request.body.notificationId,
      },
    });

    let user = users[0];
    if (!user) {
      console.log('user did not exist already, saving');
      user = await this.userRepository.save(request.body);
    }

    response.json({
      userId: user.id,
    });
  }

  async updateUserIndex(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    let user = await this.userRepository.findOne(request.body.userId);
    user.locationIndex = request.body.locationIndex;
    console.log('update user index', request.body, 'for user', user);
    await this.userRepository.save(user);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let userToRemove = await this.userRepository.findOne(request.params.id);
    await this.userRepository.remove(userToRemove);
  }
}
