import { InternalServerErrorException } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task.model';
import { Logger } from '@nestjs/common';
@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository', { timestamp: true });
  public async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = {
      status: TaskStatus.OPEN,
      description: createTaskDto.description,
      title: createTaskDto.title,
      user,
    };
    return this.save(task);
  }
  public async getTasks(
    filter: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = filter;
    const query = this.createQueryBuilder('task');

    query.where({ user });
    if (status) {
      query.andWhere(`task.status = :status`, { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (err) {
      this.logger.error(
        `Failed to get tasks for user ${
          user.username
        }. Filters: ${JSON.stringify(filter)}`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
