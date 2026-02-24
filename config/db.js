import mongoose from "mongoose";


const connectDb = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("DB Error ❌ MONGO_URI is not defined in environment variables.");
      process.exit(1);
    }
    const uri = process.env.MONGO_URI.replace(/^["']|["']$/g, '');
    await mongoose.connect(uri);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("DB Error ❌", error.message);
    process.exit(1);
  }
}


export default connectDb;