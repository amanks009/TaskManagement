import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Acceptable enum values
const validStatuses = ['pending', 'done'];

export const getAllTasks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json(tasks);
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const getTaskById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid task ID" });
    return;
  }

  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      res.status(404).json({ error: "Task not found" });
    } else {
      res.status(200).json(task);
    }
  } catch (error: any) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Error fetching task" });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  const { title, description, status } = req.body;

  // Check required fields
  if (!title || !description) {
    res.status(400).json({ error: "Title and description are required" });
    return;
  }

  // Validate status (if provided)
  const taskStatus = status?.toLowerCase() ?? 'pending';
  if (!validStatuses.includes(taskStatus)) {
    res.status(400).json({ error: "Invalid status. Must be 'pending' or 'done'" });
    return;
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: taskStatus,
      },
    });

    res.status(201).json(task);
  } catch (error: any) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

export const updateTask = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);
  const { title, description, status } = req.body;

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid task ID" });
    return;
  }

  if (!title || !description || !status) {
    res.status(400).json({ error: "Title, description, and status are required" });
    return;
  }

  const taskStatus = status.toLowerCase();
  if (!validStatuses.includes(taskStatus)) {
    res.status(400).json({ error: "Invalid status. Must be 'pending' or 'done'" });
    return;
  }

  try {
    const updated = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status: taskStatus,
      },
    });

    res.status(200).json(updated);
  } catch (error: any) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

export const deleteTask = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid task ID" });
    return;
  }

  try {
    await prisma.task.delete({ where: { id } });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};
