import {NextRequest, NextResponse} from 'next/server';
import jwt from 'jsonwebtoken';
import mongoClientPromise from '@/utils/mongodb';
import { dbName } from '@/utils/mongodb';
//import bcrypt from 'bcrypt';

// Handle POST requests to the /api/login route
export async function POST(request: NextRequest) {
    try {
        // Parse the request body as JSON
        const body = await request.json();
        const { username, password } = body;

        // Validate the input
        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        // Connect to the MongoDB database
        const client = await mongoClientPromise;
        const db = client.db(dbName);

        const usersCollection = db.collection('users');

        const existingUser = await usersCollection.findOne({ username, password });
        if (!existingUser) {
            return NextResponse.json({ message: "Username or password invalid" }, { status: 401});
        }

        //will use bcrypt if there is account creation page and sensitive data, for now it's just to setup db connection etc
        /*const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) {
            return NextResponse.json({ message: "Invalid password" }, { status: 401 });
        }*/

        // Create a JWT token
        const token = jwt.sign(
            {
                username: existingUser.username,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" },
        )

        const response = NextResponse.json({ message: 'Login successful', username: existingUser.username }, { status: 200 });
        response.cookies.set("authToken", token, {
            httpOnly: true,
            secure: false, // Set to true in production)
            maxAge: 60 * 60 * 1000, // 1 hour
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}