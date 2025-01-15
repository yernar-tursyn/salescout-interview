// Write a script that:
// 1. Connects to MongoDB.
// 2. Creates the 'users' collection.
// 3. Adds new users.
// 4. Finds users with duplicate emails.

// Use Mongoose library

import mongoose, { Schema, model } from 'mongoose';

type DuplicatedUsers = {
    email: string;
};

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
});

const User = model('User', userSchema);

async function manageUsers(): Promise<DuplicatedUsers[]> {
    try {
        await mongoose.connect('mongodb://localhost:27017/testdb');
        console.log('Connected to MongoDB');

        const users = [
            { name: 'Kairat', email: 'kairat@example.com' },
            { name: 'Almas', email: 'almas@example.com' },
            { name: 'Yermek', email: 'yermek@example.com' },
            { name: 'Alina', email: 'alina@example.com' },
        ];

        for (const user of users) {
            try {
                await User.create(user);
            } catch (error) {
                if (error instanceof Error && (error as any).code === 11000) {
                    console.log(`Duplicate email found: ${user.email}`);
                } else {
                    console.error('Error creating user:', error);
                }
            }
        }

        const duplicates = await User.aggregate<DuplicatedUsers>([
            {
                $group: {
                    _id: "$email",
                    count: { $sum: 1 },
                },
            },
            {
                $match: {
                    count: { $gt: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    email: "$_id",
                },
            },
        ]);

        return duplicates;
    } catch (error) {
        console.error('Error managing users:', error);
        return [];
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

module.exports = { manageUsers };
