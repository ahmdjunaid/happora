import { Router } from "express";
import { container } from "../DI/container";
import { TYPES } from "../DI/types";
import { IBookingController } from "../controllers/interface/booking.controller.interface";
import { verifyJWT } from "../utils/jwt.util";

const router = Router();
const bookingController = container.get<IBookingController>(TYPES.BookingController);

router.get("/availability", verifyJWT, bookingController.checkAvailability);
router.get("/admin", verifyJWT, bookingController.getAdminBookings);
router.post("/", verifyJWT, bookingController.bookService);
router.get("/my-bookings", verifyJWT, bookingController.getMyBookings);

export default router;
