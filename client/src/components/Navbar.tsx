'use client';

import { FC, useState } from 'react';
import { Button, Container, Group, Modal, Title } from '@mantine/core';
import CreateTaskForm from './CreateTaskForm';

const Navbar: FC = () => {
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  const handleOpenModal = () => {
    console.log('Opening modal...'); // Debug log
    setIsCreateTaskModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal...'); // Debug log
    setIsCreateTaskModalOpen(false);
  };

  const handleTaskSuccess = () => {
    console.log('Task created successfully!'); // Debug log
    setIsCreateTaskModalOpen(false);
  };

  console.log('Modal state:', isCreateTaskModalOpen); // Debug log

  return (
    <>
      <nav>
        <Container
          size="xl"
          px="md"
          py="sm"
          style={{
            background: 'linear-gradient(to right, #7e22ce, #4c1d95)',
            color: 'white',
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Group justify="space-between" align="center">
            <Title order={2} style={{ fontWeight: 700 }}>Mini Task Manager</Title>
            <Button
              variant="white"
              color="grape"
              radius="xl"
              size="md"
              onClick={handleOpenModal}
            >
              Create Task
            </Button>
          </Group>
        </Container>
      </nav>

      <Modal
        opened={isCreateTaskModalOpen}
        onClose={handleCloseModal}
        title={<Title order={3}>Create New Task</Title>}
        centered
        size="lg"
        closeOnClickOutside={true}
        closeOnEscape={true}
      >
        <CreateTaskForm onSuccess={handleTaskSuccess} />
      </Modal>
    </>
  );
};

export default Navbar;