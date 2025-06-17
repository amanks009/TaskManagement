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
  status: Task["status"];
}

interface CreateTaskFormProps {
  onSuccess: (newTask: Task) => void;
  initialValues?: UpdatedTaskData;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onSuccess, initialValues }) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [status, setStatus] = useState<Task["status"]>(initialValues?.status || 'pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send a POST request to create a new task
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const createdTask = await response.json();

      // Trigger the parent callback with new task
      onSuccess(createdTask);

      // Clear form only if it's not in edit mode
      if (!initialValues) {
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
          {initialValues ? 'Edit Task' : 'Create a Task'}
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
          onChange={(value) => setStatus(value as Task["status"])}
          data={[
            { value: 'pending', label: 'Pending' },
            { value: 'completed', label: 'Completed' },
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
            ) : 'Submit'}
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};

export default CreateTaskForm;
