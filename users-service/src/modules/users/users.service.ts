import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { UsersRepository } from "./users.repository.js";
import { User } from "./entities/user.entity.js";
import { CreateUserDTO } from "./dto/create-user.dto.js";
import { LoginDTO } from "./dto/login.dto.js";
import { publishUserCreated } from "../../kafka/user.producer.js";

import {
  UserNotFoundError,
  UserAlreadyExistsError,
  InvalidCredentialsError,
  MissingUserDataError,
} from "./errors/user.errors.js";

export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly jwt: any
  ) {}

  async createUser(dto: CreateUserDTO): Promise<User> {
    if (!dto.first_name || !dto.last_name || !dto.email || !dto.password) {
      throw new MissingUserDataError(
        "first_name, last_name, email and password are required"
      );
    }

    const existing = await this.repository.findByEmail(dto.email);
    if (existing) throw new UserAlreadyExistsError();

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = new User(
      randomUUID(),
      dto.first_name,
      dto.last_name,
      dto.email,
      passwordHash,
      new Date()
    );

    await this.repository.create(user);
    await publishUserCreated(user.id, user.email);

    return user;
  }

  async login(dto: LoginDTO): Promise<{ user: User; token: string }> {
    if (!dto.user.email || !dto.user.password) {
      throw new MissingUserDataError("email and password are required");
    }

    const user = await this.repository.findByEmail(dto.user.email);
    if (!user) throw new InvalidCredentialsError();

    const valid = await bcrypt.compare(dto.user.password, user.passwordHash);
    if (!valid) throw new InvalidCredentialsError();

    const token = this.jwt.sign({
      sub: user.id,
      email: user.email,
    });

    return { user, token };
  }

  async listUsers(): Promise<User[]> {
    return this.repository.findAll();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user) throw new UserNotFoundError();
    return user;
  }

  async updateUser(id: string, dto: CreateUserDTO): Promise<User> {
    if (!dto.first_name || !dto.last_name || !dto.email || !dto.password) {
      throw new MissingUserDataError(
        "first_name, last_name, email and password are required"
      );
    }

    const existing = await this.repository.findById(id);
    if (!existing) throw new UserNotFoundError();

    const emailOwner = await this.repository.findByEmail(dto.email);
    if (emailOwner && emailOwner.id !== id) {
      throw new UserAlreadyExistsError();
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const updated = new User(
      existing.id,
      dto.first_name,
      dto.last_name,
      dto.email,
      passwordHash,
      existing.createdAt
    );

    await this.repository.update(updated);
    return updated;
  }

  async deleteUser(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new UserNotFoundError();

    await this.repository.deleteById(id);
  }
}
