import Fastify from "fastify";
import { registerJwt } from "./config/jwt.js";
import { usersRoutes } from "./modules/users/users.routes.js";
import { AppError } from "./app.error.js";


export async function buildApp() {
  const app = Fastify({ logger: true });

  app.setErrorHandler((error, _request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: error.message,
    });
  }

  app.log.error(error);

  return reply.status(500).send({
    error: "Internal server error",
  });
});

  await registerJwt(app);

  app.register(usersRoutes);

  return app;
}
