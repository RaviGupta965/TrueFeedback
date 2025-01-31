
import { sendVerificationEmail } from "@/app/helpers/sendVerificationEmail";
import dbconnect from "@/app/lib/dbconnect";
import UserModel from "@/app/model/User";
import bcrypt from 'bcryptjs'

export async function POST(request:Request){
    await dbconnect()

    try {
        const {username,email,password}=await request.json();
        const existingUserVeriefiedbyUsername=await UserModel.findOne({
            username,
            isverified:true
        })

        const verifyCode=Math.floor(100000 + Math.random() * 900000).toString()
        if(existingUserVeriefiedbyUsername){
            return Response.json({
                success:false,
                message:'user with this username already exist'
            },{status:400})
        }
        
        const existingUserByEmail=await UserModel.findOne({
            email
        })

        if(existingUserByEmail){
            if(existingUserByEmail.isverified){
                return Response.json({
                    success:false,
                    message:"user with this email already exist"
                },{status:400});
            }
            else{
                const hashed_password=await bcrypt.hash(password,10);
                existingUserByEmail.password=hashed_password;
                existingUserByEmail.verifyCode=verifyCode;
                existingUserByEmail.verifyCodeExpiry=new Date(Date.now() + 3600);
                await existingUserByEmail.save();
            }
        }
        else{
            const hashed_password=bcrypt.hash(password,10);
            const expiryDate=new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newuser=new UserModel({
                Username:username,
                email,
                password:hashed_password,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isverified:false,
                isAcceptingMessage:true,
                message:[],
            })

            // send verification email
            const emailResponse=await sendVerificationEmail(email,username,verifyCode);
            
            if(!emailResponse){
                return Response.json({
                    success:false,
                    message:'error sending email'
                },{status:500});
            }

            return Response.json({
                success:true,
                message:"user registered successfully please verify your email"
            },{status:500});
        }

    } catch (error) {
        console.error('ERROR :: REGISTERING USER',error);

        return Response.json({
                success:false,
                message:'error registering user'
            },{status:500})
    }
}