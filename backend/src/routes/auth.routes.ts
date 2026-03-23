import { Router } from "express";

const router = Router()

router.route('/register').post((req, res,next)=> {
    try {
        throw new Error("ee")
    } catch (error) {
        next(error)
    }
})

export default router;