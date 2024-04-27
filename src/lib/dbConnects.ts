import mongoose from "mongoose"

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject={}

async function dbConnect(): Promise<void> {
// Check if we are already connected to db

if(connection.isConnected){
    console.log("Already connected to db")
    return;
}

try {
    // Connect to db

    const db = await mongoose.connect(process.env.MONGO_URL || "")

    connection.isConnected = db.connections[0].readyState

    console.log(db)

    console.log('Database connected successfully')
} catch (error) {
    console.error("Database connection error", error)

    process.exit(1)
}
}

export default dbConnect