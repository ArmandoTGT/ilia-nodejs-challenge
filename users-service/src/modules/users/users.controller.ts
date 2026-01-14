import { FastifyRequest, FastifyReply } from "fastify";
import { UsersService } from "./users.service.js";
import { CreateUserDTO } from "./dto/create-user.dto.js";
import { LoginDTO } from "./dto/login.dto.js";

export class UsersController {
  constructor(private readonly service: UsersService) {}

  async createUser(
    request: FastifyRequest<{ Body: CreateUserDTO }>,
    reply: FastifyReply
  ) {
    const user = await this.service.createUser(request.body);

    reply.code(200).send({
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
    });
  }

  async listUsers(_request: FastifyRequest, reply: FastifyReply) {
    const users = await this.service.listUsers();

    reply.send(
      users.map((u) => ({
        id: u.id,
        first_name: u.firstName,
        last_name: u.lastName,
        email: u.email,
      }))
    );
  }

  async getUserById(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { id } = request.params as { id: string };
    const user = await this.service.getUserById(id);

    reply.send({
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
    });
  }

  async updateUser(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { id } = request.params as { id: string };
    const body = request.body as CreateUserDTO;

    const user = await this.service.updateUser(id, body);

    reply.send({
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
    });
  }

  async deleteUser(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { id } = request.params as { id: string };
    await this.service.deleteUser(id);
    reply.code(200).send();
  }

  async login(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const body = request.body as LoginDTO;
    const { token, user } = await this.service.login( body );

    reply.send({
      user: {
        id: user.id,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
      },
      access_token: token,
    });
  }
}
