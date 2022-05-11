import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from 'src/auth/user.entity';
import { Task } from './task.entity';
import { TaskStatus } from './task.model';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';
const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});
const mockUser: User = {
  username: 'jamilomar',
  password: 'somePassword',
  id: 'someId',
  tasks: [],
};
describe('TasksService', () => {
  let tasksService;
  let tasksRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();
    tasksService = module.get(TasksService);
    tasksRepository = module.get<TasksRepository>(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TaskRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TaskRepository.getOne and returns the result', async () => {
      const mockTask: Task = {
        id: 'someId',
        title: 'Test title',
        description: 'Test description',
        status: TaskStatus.DONE,
        user: mockUser,
      };
      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });
    it('calls TaskRepository.getOne and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
