import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {EmergencyEvent} from "../entity/EmergencyEvent";
import { geoToH3, kRing } from 'h3-js'
import { User } from "../entity/User";
import { EmergencyEventType } from "../entity/EmergencyEventType";
import { NotificationService } from "../NotificationService";

export class EmergencyEventController {
    private emergencyEventRepository = getRepository(EmergencyEvent);
    private userRepository = getRepository(User);
    private emergencyTypeRepository = getRepository(EmergencyEventType)
    private notificationService = new NotificationService()

    async getAll(request: Request, response: Response, next: NextFunction) {
        return this.emergencyEventRepository.find();
    }

    async getById(request: Request, response: Response, next: NextFunction) {
        return this.emergencyEventRepository.findOne(request.params.id);
    }

    async add(request: Request, response: Response, next: NextFunction) {
        let emergency = new EmergencyEvent()
        
        emergency.latitude = request.body.latitude
        emergency.longitude = request.body.longitude
        emergency.address = request.body.address
        emergency.emergencyType = await this.emergencyTypeRepository.findOne({where: [{code: request.body.emergencyCode}]})
        await this.emergencyEventRepository.save(emergency)
        
        const emergencyIndex = geoToH3(emergency.latitude, emergency.longitude, Number(process.env.H3_RESOLUTION))
        let indices = kRing(emergencyIndex, Number(process.env.H3_KRING_SIZE))

        let searchArray = []

        for (const index of indices) {
            searchArray.push({ locationIndex: index})
        }

        const nearbyUsers = await this.userRepository.find({
            where: searchArray
        })
        await this.notificationService.sendNotification(emergency, nearbyUsers)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let emergencyToRemove = await this.emergencyEventRepository.findOne(request.params.id);
        await this.emergencyEventRepository.remove(emergencyToRemove);
    }

    async accept(request: Request, response: Response, next: NextFunction) {

    }
}