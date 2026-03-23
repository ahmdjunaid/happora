import { Router } from "express";
import { container } from "../DI/container";
import { TYPES } from "../DI/types";
import { IBookingController } from "../controllers/interface/booking.controller.interface";

const router = Router();
const bookingController = container.get<IBookingController>(TYPES.BookingController);

router.post("/", bookingController.bookService);
router.get("/my-bookings", bookingController.getMyBookings);

export default router;
