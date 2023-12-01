import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import TaskRepository from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    public taskRepository: TaskRepository
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto);
  }
  async getTaskById(id: number): Promise<Task> {
    console.info('d', id)
    const found = await this.taskRepository.findOne({ where: { id } });
    console.info('found', found)
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    console.info('fou2nd', found)
    return found;
  }

  async deleteTaskById(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }

  getAllTasks(filterdto : GetTaskFilterDto): Promise<Task[]> {
    return this.taskRepository.getAllTasks(filterdto);
  }
}
