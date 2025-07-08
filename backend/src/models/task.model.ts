import pool from '../config/db';

interface Task {
    id?: number;
    title: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed';
    user_id: number;
    created_at?: Date;
    updated_at?: Date;
}

class TaskModel {
    static async getAllByUser(userId: number): Promise<Task[]> {
        const [rows] = await pool.execute('SELECT * FROM tasks WHERE user_id = ?', [userId]);
        return rows as Task[];
    }

    static async getById(id: number, userId: number): Promise<Task | null> {
        const [rows] = await pool.execute('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
        return (rows as any)[0] || null;
    }

    static async create(task: Task): Promise<Task> {
        const [result] = await pool.execute(
            'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)',
            [task.title, task.description, task.status, task.user_id]
        );
        return this.getById((result as any).insertId, task.user_id) as Promise<Task>;
    }

    static async update(id: number, userId: number, task: Partial<Task>): Promise<Task | null> {
        await pool.execute(
            'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
            [task.title, task.description, task.status, id, userId]
        );
        return this.getById(id, userId);
    }

    static async delete(id: number, userId: number): Promise<void> {
        await pool.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
    }
}

export default TaskModel;