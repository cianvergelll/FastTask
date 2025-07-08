import pool from '../config/db';
import bcrypt from 'bcryptjs';

interface User {
    id?: number;
    username: string;
    email: string;
    password: string;
    created_at?: Date;
}

class UserModel {
    static async create(user: User): Promise<User> {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [user.username, user.email, hashedPassword]
        );
        const newUser = await this.getById((result as any).insertId);
        if (!newUser) {
            throw new Error('User creation failed');
        }
        return newUser;
    }

    static async getById(id: number): Promise<User | null> {
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
        return (rows as any)[0] || null;
    }

    static async getByUsername(username: string): Promise<User | null> {
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        return (rows as any)[0] || null;
    }

    static async verifyPassword(user: User, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.password);
    }
}

export default UserModel;