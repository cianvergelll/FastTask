import { Request, Response } from 'express';
import TaskModel from '../models/task.model';

class TasksController {
    static async getAll(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const tasks = await TaskModel.getAllByUser(userId);
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching tasks', error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const task = await TaskModel.getById(parseInt(req.params.id), userId);

            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            res.json(task);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching task', error });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const taskData = { ...req.body, user_id: userId };
            const task = await TaskModel.create(taskData);
            res.status(201).json(task);
        } catch (error) {
            res.status(500).json({ message: 'Error creating task', error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const taskId = parseInt(req.params.id);
            const task = await TaskModel.update(taskId, userId, req.body);

            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            res.json(task);
        } catch (error) {
            res.status(500).json({ message: 'Error updating task', error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const taskId = parseInt(req.params.id);
            await TaskModel.delete(taskId, userId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting task', error });
        }
    }
}

export default TasksController;