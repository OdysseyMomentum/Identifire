import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {EmergencyEvent} from "../entity/EmergencyEvent";

export class EmergencyEventController {


    private emergencyEventRepository = getRepository(EmergencyEvent);

    async getAll(request: Request, response: Response, next: NextFunction) {
        return this.emergencyEventRepository.find();
    }

    async getById(request: Request, response: Response, next: NextFunction) {
        return this.emergencyEventRepository.findOne(request.params.id);
    }

    async add(request: Request, response: Response, next: NextFunction) {
        return this.emergencyEventRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let emergencyToRemove = await this.emergencyEventRepository.findOne(request.params.id);
        await this.emergencyEventRepository.remove(emergencyToRemove);
    }

    async accept(request: Request, response: Response, next: NextFunction) {

    }
}