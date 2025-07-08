import { Router } from 'express';
import TasksController from '../controllers/tasks.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', TasksController.getAll);
router.get('/:id', TasksController.getById);
router.post('/', TasksController.create);
router.put('/:id', TasksController.update);
router.delete('/:id', TasksController.delete);

export default router;