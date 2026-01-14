import { FastifyInstance } from "fastify";
import { UsersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";

import { UsersRepository } from "./users.repository.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

export async function usersRoutes(app: FastifyInstance) {
  const usersRepository = new UsersRepository();
  const service = new UsersService(usersRepository, app.jwt);
  const usersController = new UsersController(service);

  app.post("/users", usersController.createUser.bind(usersController));
  app.post("/auth", usersController.login.bind(usersController));

  app.get(
    "/users",
    { preHandler: [authMiddleware] },
    usersController.listUsers.bind(usersController)
  );

  app.get(
    "/users/:id",
    { preHandler: [authMiddleware] },
    usersController.getUserById.bind(usersController)
  );

  app.patch(
    "/users/:id",
    { preHandler: [authMiddleware] },
    usersController.updateUser.bind(usersController)
  );

  app.delete(
    "/users/:id",
    { preHandler: [authMiddleware] },
    usersController.deleteUser.bind(usersController)
  );
}
