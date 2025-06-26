'use client';

import React, { useEffect, useState } from 'react';
import { Task } from '../types/task';
import {
  Container,
  Title,
  SimpleGrid,
  Loader,
  Center,
  Notification,
  Button,
  Modal,
  Group,
} from '@mantine/core';
import TaskCard from './TaskCard';
import CreateTaskForm from './CreateTaskForm';
import { IconX, IconPlus } from '@tabler/icons-react';

const Hero = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch all tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${baseUrl}/tasks`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create task handler (append to state)
  const handleCreateTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
    setCreateModalOpen(false);
  };

  // Delete task handler
  const handleDeleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks((prev) => prev.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  // Update task handler
  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) throw new Error('Failed to update task');
      const data = await response.json();
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? data : task))
      );
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  return (
    <Container size="lg" py="md">
      <Group justify="space-between" mb="md">
        <Title order={2}>Your Tasks</Title>
        {/* <Button
          leftSection={<IconPlus size="1rem" />}
          onClick={() => setCreateModalOpen(true)}
          radius="md"
          color="grape"
        >
          Create Task
        </Button> */}
      </Group>

      {error && (
        <Notification
          icon={<IconX size="1.1rem" />}
          color="red"
          title="Error"
          onClose={() => setError(null)}
          mb="md"
        >
          {error}
        </Notification>
      )}

      {loading ? (
        <Center>
          <Loader color="grape" size="lg" />
        </Center>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
            />
          ))}
        </SimpleGrid>
      )}

      {/* Create Task Modal */}
      <Modal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Task"
        centered
      >
        <CreateTaskForm onSuccess={handleCreateTask} />
      </Modal>
    </Container>
  );
};

export default Hero;
