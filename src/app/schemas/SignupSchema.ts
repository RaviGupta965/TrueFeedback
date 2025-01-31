import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(4,"username must be atleast 4 character")
    .max(15,'username must be more than 15 character')
    .regex(/^[a-zA-Z0-9_]+$/,"username nmust not contain special character")

export const SignupSchema = z.object({
    username: usernameValidation,
    email:z.string().email({message:'Invalid email address'}),
    password: z.string().min(6,{message:'must be atleast 6 characters'})
})