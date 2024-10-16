import mongoose from 'mongoose';
import MongoDatabase from '../../src/connectors/mongoDb.js';

jest.mock('mongoose', () => ({
    connect: jest.fn(),
    connection: {
        readyState: 0, // 0  disconnected, 1  connected
    },
}));

describe('MongoDatabase', () => {
    let db;

    beforeEach(() => {
        process.env.MONGO_URI = 'mongodb://localhost:5000/testdb';
        db = new MongoDatabase();
    });

    afterEach(() => {
        jest.clearAllMocks(); 
    });

    describe('connect', () => {
        it('should connect to MongoDB when no connection exists', async () => {
            mongoose.connect.mockResolvedValueOnce(true);

            await db.connect();

            expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO_URI);
            expect(mongoose.connect).toHaveBeenCalledTimes(1);
            expect(db.connection).toBeTruthy();
        });

        it('should throw error if connection fails', async () => {
            const mockError = new Error('Connection failed');
            mongoose.connect.mockRejectedValueOnce(mockError);

            const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            await db.connect();

            expect(consoleErrorSpy).toHaveBeenCalledWith('MongoDB connection error:', mockError);
            expect(exitSpy).toHaveBeenCalledWith(1);
        });
    });

});