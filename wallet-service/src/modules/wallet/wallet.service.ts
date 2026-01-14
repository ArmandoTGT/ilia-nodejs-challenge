import { randomUUID } from "crypto";
import { WalletRepository } from "./wallet.repository.js";
import { CreateTransactionDTO } from "./dto/create-transaction.dto.js";
import { Transaction } from "./entities/transaction.entity.js";
import { Wallet } from "./entities/wallet.entity.js";
import { TransactionType } from "./entities/transaction.entity.js";

import {
  MissingTransactionDataError,
  InvalidTransactionTypeError,
  InsufficientBalanceError,
  WalletNotFoundError,
} from "./errors/wallet.errors.js";

export class WalletService {
  constructor(private readonly repository: WalletRepository) {}

  async createTransaction(dto: CreateTransactionDTO): Promise<void> {
    if (!dto.user_id || !dto.type || dto.amount === undefined) {
      throw new MissingTransactionDataError();
    }

    if (dto.amount <= 0) {
      throw new MissingTransactionDataError();
    }

    if (dto.type !== "CREDIT" && dto.type !== "DEBIT") {
      throw new InvalidTransactionTypeError();
    }

    let wallet = await this.repository.findWalletByUser(dto.user_id);

    if (!wallet) {
      wallet = new Wallet(randomUUID(), dto.user_id, 0, new Date());
      await this.repository.createWallet(wallet);
    }

    if (dto.type === "DEBIT" && wallet.balance < dto.amount) {
      throw new InsufficientBalanceError();
    }

    wallet.balance =
      dto.type === "CREDIT"
        ? wallet.balance + dto.amount
        : wallet.balance - dto.amount;

    await this.repository.updateWalletBalance(wallet.id, wallet.balance);

    const transaction = new Transaction(
      randomUUID(),
      wallet.id,
      dto.type,
      dto.amount,
      "",
      new Date()
    );

    await this.repository.createTransaction(transaction);
  }

  async listTransactions(
    userId: string | undefined,
    type?: TransactionType
  ) {
    if (!userId) {
      throw new MissingTransactionDataError();
    }

    if (type && type !== "CREDIT" && type !== "DEBIT") {
      throw new InvalidTransactionTypeError();
    }

    const wallet = await this.repository.findWalletByUser(userId);
    if (!wallet) {
      throw new WalletNotFoundError();
    }

    return this.repository.findTransactionsByWallet(wallet.id, type);
  }

  async getBalance(userId: string | undefined): Promise<number> {
    if (!userId) {
      throw new MissingTransactionDataError();
    }

    return this.repository.getBalanceByUser(userId);
  }
}
