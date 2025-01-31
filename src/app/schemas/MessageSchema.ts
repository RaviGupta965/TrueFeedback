import {z} from 'zod'

export const MessageSchema=z.object({
    content:z.string().min(10,{message:'content must not be empty'}).max(400,{message:'content must be no longer than 400 words'})
})