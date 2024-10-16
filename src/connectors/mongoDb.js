import mongoose from "mongoose"
import dotenv from "dotenv";

dotenv.config();

// TODO : abstract database for extendability
class MongoDatabase {
    constructor() {
        this.db = process.env.MONGO_URI;
        this.connection = null;
    }

    async connect() {
        try {
            if (this.connection) {
                console.log('Already connected to MongoDB');
                return;
            }
            this.connection = await mongoose.connect(this.db);
            console.log('MongoDB connected successfully');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            process.exit(1);
        }
    }

    isConnected() {
        return this.connection && mongoose.connection.readyState === 1;
    }
}

export default MongoDatabase;