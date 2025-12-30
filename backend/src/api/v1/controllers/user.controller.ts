// @ts-nocheck
import { Request, Response } from 'express';
import userService from '../services/user.service.js';

export const getAllUsers = async (req: Request, res: Response) => {
  const result = await userService.getAllUsers();
  res.status(result.success ? 200 : 500).json(result);
};

export const getUserById = async (req: Request, res: Response) => {
  const result = await userService.getUserById(req.params.id);
  res.status(result.success ? 200 : 404).json(result);
};

export const createUser = async (req: Request, res: Response) => {
  const result = await userService.createUser(req.body);
  res.status(result.success ? 201 : 400).json(result);
};

export const updateUser = async (req: Request, res: Response) => {
  const result = await userService.updateUser(req.params.id, req.body);
  res.status(result.success ? 200 : 400).json(result);
};

export const changeUserStatus = async (req: Request, res: Response) => {
  const result = await userService.updateUser(req.params.id, { isActive: req.body.isActive });
  res.status(result.success ? 200 : 400).json(result);
};

export const changePassword = async (req: Request, res: Response) => {
  const result = await userService.updateUser(req.params.id, { password: req.body.password });
  res.status(result.success ? 200 : 400).json(result);
};

export const getUserCases = async (req: Request, res: Response) => {
  const result = await userService.getUserCases(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
};

export const deleteUser = async (req: Request, res: Response) => {
  const result = await userService.deleteUser(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
};