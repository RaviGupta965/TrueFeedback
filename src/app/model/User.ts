import mongoose,{Schema, Document} from "mongoose";

export interface Message extends Document{
    content:string;
    createdAt:Date;
}

const messageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    }
})

export interface User extends Document{
    Username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isverified:boolean;
    isAcceptingMessage : boolean;
    message:Message[];
}

const UserSchema:Schema<User> = new Schema({
    Username:{
        type:String,
        required:[true,"username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"username is required"],
        unique:true,
        match:[/.+\@.+\..+/,'please enter valid email address']
    },
    password:{
        type:String,
        required:[true,'password is required'],
    },
    verifyCode:{
        type:String,
        required:[true,'verify code is required'],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,'verify code expiry is required'],
    },
    isverified:{
        type:Boolean,
        default:false,
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true,
    },
    message:[messageSchema]
})

const UserModel=(mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)
export default UserModel;