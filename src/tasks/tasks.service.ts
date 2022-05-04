import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  public getAllTasks(): Task[] {
    return this.tasks;
  }
  public getTasksWithFilter(filter: GetTasksFilterDto): Task[] {
    const { status, search } = filter;
    let result = this.getAllTasks();
    if (status) {
      result = result.filter((task) => task.status === status);
    }
    if (search) {
      result = result.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }
    return result;
  }

  public createTask(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: uuid(),
      status: TaskStatus.OPEN,
      description: createTaskDto.description,
      title: createTaskDto.title,
    };
    this.tasks.push(task);
    return task;
  }

  public deleteTask(id: string): void {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }

  public updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    const task = this.getTaskById(id);
    task.status = updateTaskStatusDto.status;
    return task;
  }

  public getTaskById(id: string): Task | null {
    const found = this.tasks.find((task) => task.id == id);
    if (!found) {
      throw new NotFoundException(`Task with Id ${id} not found`);
    }
    return found;
  }
}
