import { Router } from "express";
import { container } from "../DI/container";
import { TYPES } from "../DI/types";
import { IServiceController } from "../controllers/interface/service.controller.interface";
import { verifyJWT } from "../utils/jwt.util";

const router = Router();
const serviceController = container.get<IServiceController>(TYPES.ServiceController);

router.post("/", verifyJWT, serviceController.createService);
router.get("/admin/my-services", verifyJWT, serviceController.getAdminServices);
router.get("/", verifyJWT, serviceController.getAllServices);
router.get("/:id", verifyJWT, serviceController.getServiceById);
router.put("/:id", verifyJWT, serviceController.updateService);
router.delete("/:id", verifyJWT, serviceController.deleteService);

export default router;
