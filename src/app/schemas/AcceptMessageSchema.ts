import {z} from 'zod'

export const AcceptMessageSchema=z.object({
    acceptingMessages:z.boolean(),
})