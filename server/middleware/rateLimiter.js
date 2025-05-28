import rateLimiter from 'express-rate-limit'
import { ErrorHandler } from '../utils/utility.js'

const incomingLimiter = rateLimiter({
    windowMs:1*60*1000,
    limit:10,
    keyGenerator:(req,res)=>{
        const token = req.headers['cl-x-token']
        return token || req.ip
    },
    handler:(req,res,next)=>{
        return next(new ErrorHandler('Too many requests. Try again later.',429)) 
    },
    standardHeaders:true,
    legacyHeaders:false
})

export {
    incomingLimiter
}