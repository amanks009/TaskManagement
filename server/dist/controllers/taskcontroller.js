"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getAllTasks = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Acceptable enum values
const validStatuses = ['pending', 'done'];
const getAllTasks = async (_req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            orderBy: { createdAt: "desc" }
        });
        res.status(200).json(tasks);
    }
    catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
};
exports.getAllTasks = getAllTasks;
const getTaskById = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: "Invalid task ID" });
        return;
    }
    try {
        const task = await prisma.task.findUnique({ where: { id } });
        if (!task) {
            res.status(404).json({ error: "Task not found" });
        }
        else {
            res.status(200).json(task);
        }
    }
    catch (error) {
        console.error("Error fetching task:", error);
        res.status(500).json({ error: "Error fetching task" });
    }
};
exports.getTaskById = getTaskById;
const createTask = async (req, res) => {
    var _a;
    const { title, description, status } = req.body;
    // Check required fields
    if (!title || !description) {
        res.status(400).json({ error: "Title and description are required" });
        return;
    }
    // Validate status (if provided)
    const taskStatus = (_a = status === null || status === void 0 ? void 0 : status.toLowerCase()) !== null && _a !== void 0 ? _a : 'pending';
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
    }
    catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Failed to create task" });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Failed to update task" });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ error: "Invalid task ID" });
        return;
    }
    try {
        await prisma.task.delete({ where: { id } });
        res.status(200).json({ message: "Task deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Failed to delete task" });
    }
};
exports.deleteTask = deleteTask;
