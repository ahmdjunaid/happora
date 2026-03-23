import { Router } from "express";
import { container } from "../DI/container";
import { TYPES } from "../DI/types";
import { IServiceController } from "../controllers/interface/service.controller.interface";

const router = Router();
const serviceController = container.get<IServiceController>(TYPES.ServiceController);

router.post("/", serviceController.createService);
router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);
router.put("/:id", serviceController.updateService);
router.delete("/:id", serviceController.deleteService);

export default router;
