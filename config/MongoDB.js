import mongoose from "mongoose";

const connectDB = async () => {
    try {

        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected ${conn.connection.host}`)

    } catch (error) {
        console.log("Error in Connecting DB")
        console.log(error)
    }
}

export default connectDB;