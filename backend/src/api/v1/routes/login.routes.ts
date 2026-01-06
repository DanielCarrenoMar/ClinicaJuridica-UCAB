// @ts-nocheck
import { Router } from 'express';
import * as loginController from '../controllers/login.controller.js';

const router = Router();

// Endpoint de login
router.post('/', loginController.login);

export default router;
