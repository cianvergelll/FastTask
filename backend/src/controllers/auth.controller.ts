import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { username, email, password } = req.body;

            // Check if user already exists
            const existingUser = await UserModel.getByUsername(username);
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const user = await UserModel.create({ username, email, password });
            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
            console.log('Token generated:', token);

            res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email } });
        } catch (error) {
            res.status(500).json({ message: 'Error registering user', error });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const user = await UserModel.getByUsername(username);

            if (!user || !(await UserModel.verifyPassword(user, password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error });
        }
    }
}

export default AuthController;