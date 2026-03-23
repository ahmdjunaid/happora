
export const TYPES = {
    //User
    UserRepository: Symbol.for("UserRepository"),
    UserService: Symbol.for("UserService"),
    AuthController: Symbol.for("AuthController"),

    //Service
    ServiceRepository: Symbol.for("ServiceRepository"),
    ServiceService: Symbol.for("ServiceService"),
    ServiceController: Symbol.for("ServiceController"),

    //Booking
    BookingRepository: Symbol.for("BookingRepository"),
    BookingService: Symbol.for("BookingService"),
    BookingController: Symbol.for("BookingController")
}
