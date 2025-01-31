import 'next-auth'
import { DefaultSession } from 'next-auth'
// adding new field _id in next auth modules
declare module 'next-auth'{
    interface User{
        _id?:string,
        isverified?:boolean,
        isAcceptingMessage?:boolean,
        username?:string
    }
    interface Session{
        user:{
            _id?:string,
            isverified?:boolean,
            isAcceptingMessage?:boolean,
            username?:string
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt'{
    interface JWT{
        _id?:string,
        isverified?:boolean,
        isAcceptingMessage?:boolean,
        username?:string
    }
}