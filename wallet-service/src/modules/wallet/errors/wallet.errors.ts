import { AppError } from "../../../app.error.js";

export class MissingTransactionDataError extends AppError {
  constructor() {
    super("user_id, type and amount are required", 400);
  }
}

export class InvalidTransactionTypeError extends AppError {
  constructor() {
    super("Invalid transaction type", 400);
  }
}

export class InsufficientBalanceError extends AppError {
  constructor() {
    super("Insufficient balance", 409);
  }
}

export class WalletNotFoundError extends AppError {
  constructor() {
    super("Wallet not found", 404);
  }
}
