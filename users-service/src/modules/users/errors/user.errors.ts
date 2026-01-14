import { AppError } from "../../../app.error.js";

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super("User already exists", 409);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("Invalid email or password", 401);
  }
}

export class MissingUserDataError extends AppError {
  constructor(message = "Missing required user information") {
    super(message, 400);
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super("User not found", 404);
  }
}
