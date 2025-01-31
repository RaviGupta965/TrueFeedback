import mongoose from "mongoose";

type connectionobject={
    isConnected?:number,
}

const connection: connectionobject = {}

async function dbconnect() : Promise<void> {
    if(connection.isConnected){
        console.log('Already connected to db');
        return ;
    }

    try{
        const db=await mongoose.connect(process.env.MONGODB_URI || '',{})
        connection.isConnected=db.connections[0].readyState
        console.log("DB connected successfully");
    }
    catch(err){
        console.log('MONGODB :: CONNECTION FAILED',err)
        process.exit(1);
    }
}
export default dbconnect;