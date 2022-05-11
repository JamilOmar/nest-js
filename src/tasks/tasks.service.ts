import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';
@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}
  private tasks: Task[] = [];
  public getTasks(filter: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filter, user);
  }

  public createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  public async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({
      id,
      user,
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with Id ${id} not found`);
    }
  }

  public async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    user: User,
  ) {
    const task = await this.getTaskById(id, user);
    task.status = updateTaskStatusDto.status;
    await this.tasksRepository.update(id, task);
    return task;
  }

  public async getTaskById(
    id: string,
    @GetUser() user: User,
  ): Promise<Task | null> {
    const found = await this.tasksRepository.findOne({
      id,
      user,
    });
    if (!found) {
      throw new NotFoundException(`Task with Id ${id} not found`);
    }
    return found;
  }
}
