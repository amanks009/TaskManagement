import React, { useState } from 'react';
import { Task } from '../types/task';
import { Card, Text, Badge, Group, Menu, ActionIcon, Modal } from '@mantine/core';
import { IconDots, IconTrash, IconEdit } from '@tabler/icons-react';
import CreateTaskForm from './CreateTaskForm';
import { TaskStatus } from '../types/task';
const getTimeAgo = (timestamp: Date | string | undefined): string => {
  if (!timestamp) return 'Just now';
  
  const now = new Date();
  const createdAt = timestamp instanceof Date ? timestamp : new Date(timestamp);
  
  if (isNaN(createdAt.getTime())) return 'Invalid date';

  const seconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(seconds / 86400);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: number) => void;
  onUpdate: (updatedTask: Task) => void;
}

// Define the type for the updated task data


interface UpdatedTaskData {
  title: string;
  description: string;
  status: TaskStatus; // ✅ Use correct type
}

const TaskCard = ({ task, onDelete, onUpdate }: TaskCardProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const statusColor = task.status === 'done' ? 'green' : 'gray';

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="xs">
          <Text fw={700} size="lg" c="blue.7">
            {task.title}
          </Text>
          
          <Group gap="xs">
            <Badge color="blue" variant="light">
              {getTimeAgo(task.createdAt)}
            </Badge>
            
            <Menu withinPortal position="bottom-end" shadow="sm">
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray">
                  <IconDots size="1rem" />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEdit size={14} />}
                  onClick={() => setEditModalOpen(true)}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconTrash size={14} />}
                  color="red"
                  onClick={handleDelete}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>

        <Text size="sm" c="dimmed" mb="sm">
          {task.description}
        </Text>

        <Group justify="space-between">
          <Text size="xs" c="gray.6" fs="italic">
            Status:
          </Text>
          <Badge color={statusColor} variant="light">
            {task.status}
          </Badge>
        </Group>
      </Card>

      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Task"
        centered
      >
        <CreateTaskForm
          initialValues={{
            title: task.title,
            description: task.description,
            status: task.status
          }}
          onSuccess={(updatedTask: UpdatedTaskData) => {
            onUpdate({
              ...task,
              title: updatedTask.title,
              description: updatedTask.description,
              status: updatedTask.status
            });
            setEditModalOpen(false);
          }}
        />
      </Modal>
    </>
  );
};

export default TaskCard;