'use client';

import React, { useState } from 'react';
import {
  TextInput,
  Textarea,
  Button,
  Group,
  Box,
  Text,
  Stack,
  Loader,
  Select,
} from '@mantine/core';
import { Task } from '../types/task';

interface UpdatedTaskData {
  title: string;
  description: string;
  status: Task['status'];
}

interface CreateTaskFormProps {
  onSuccess: (task: Task) => void;
  initialValues?: UpdatedTaskData;
  editingTaskId?: number;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  onSuccess,
  initialValues,
  editingTaskId,
}) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [status, setStatus] = useState<Task['status']>(initialValues?.status || 'pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const url = editingTaskId
  ? `${baseUrl}/tasks/${editingTaskId}`
  : `${baseUrl}/tasks`;

    const method = editingTaskId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, status }),
      });

      if (!response.ok) {
        throw new Error(editingTaskId ? 'Failed to update task' : 'Failed to create task');
      }

      const task = await response.json();
      onSuccess(task);

      // Clear form only if creating
      if (!editingTaskId) {
        setTitle('');
        setDescription('');
        setStatus('pending');
      }

    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack gap="sm">
        <Text size="lg" fw={600}>
          {editingTaskId ? 'Edit Task' : 'Create a Task'}
        </Text>

        {error && <Text c="red" size="sm">{error}</Text>}

        <TextInput
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          required
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          required
        />

        <Select
          label="Status"
          value={status}
          onChange={(value) => setStatus(value as Task['status'])}
          data={[
            { value: 'pending', label: 'Pending' },
            { value: 'done', label: 'Done' },
          ]}
          required
        />

        <Group justify="flex-end" mt="sm">
          <Button
            type="submit"
            disabled={loading}
            radius="md"
            color="grape"
            styles={{
              root: { backgroundColor: '#7635dc' },
              label: { color: 'white' },
            }}
          >
            {loading ? (
              <Group gap={6}>
                <Loader size="xs" color="white" />
                Submitting...
              </Group>
            ) : editingTaskId ? 'Update' : 'Create'}
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};

export default CreateTaskForm;
