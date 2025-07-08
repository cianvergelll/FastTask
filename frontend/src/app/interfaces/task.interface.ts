export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
    id?: number;
    title: string;
    description?: string;
    status: TaskStatus;
    user_id?: number;
    created_at?: string;
    updated_at?: string;
}