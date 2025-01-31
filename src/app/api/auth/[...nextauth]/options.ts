import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import dbconnect from "@/app/lib/dbconnect";
import UserModel from "@/app/model/User";

export const authOptions:NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:'credentials',
            name:'Credentials',
            credentials:{
                identifier: { label: "Username or Email", type: "text", placeholder: "jsmith@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any): Promise<any>{
                await dbconnect()

                try {
                    // finding user with that email or username in db
                    const user=await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},{username:credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error('No user find with this credential');
                    }
                    if(!user.isverified){
                        throw new Error('verify your account before login');
                    }

                    const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password);
                    if(isPasswordCorrect){
                        return user;
                    }
                    else{
                        throw new Error('Password is incorrect');
                    }
                } catch (error:any) {
                    console.log('Something went wrong',error);
                    throw new Error
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token._id=user._id?.toString();
                token.isverified=user.isverified;
                token.isAcceptingMessage=user.isAcceptingMessage;
                token.username=user.username

            }
            return token;
        },
        async session({session,token}){
            if(token){
                session.user._id=token._id
                session.user.isverified=token.isverified
                session.user.isAcceptingMessage=token.isAcceptingMessage
            }
            return session;
        }
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:'jwt'
    },
    secret:process.env.NEXTAUTH_SECRET,
}