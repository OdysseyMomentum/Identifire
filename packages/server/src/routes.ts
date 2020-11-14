import {EmergencyEventController} from "./controller/EmergencyEventController";
import { UserController } from "./controller/UserController";

const eventRoutes = [
    {
        method: "post",
        route: "/event",
        controller: EmergencyEventController,
        action: "add"
    },
    {
        method: "get",
        route: "/event/:id",
        controller: EmergencyEventController,
        action: "getById"
    },
    {
        method: "get",
        route: "/event",
        controller: EmergencyEventController,
        action: "getAll"
    },
    {
        method: "post",
        route: "/event/accept",
        controller: EmergencyEventController,
        action: "accept"
    }
]

const userRoutes = [
    {
        method: "post",
        route: '/user/onboard',
        controller: UserController,
        action: "add"
    },
    {
        method: "put",
        route: '/user/location',
        controller: UserController,
        action: "updateUserIndex"
    }
]

export const Routes = [
    ...eventRoutes,
    ...userRoutes
];