import { pool } from "../../database/index.js";
import { User } from "./entities/user.entity.js";

export class UsersRepository {
  async create(user: User): Promise<void> {
    await pool.query(
      `
      INSERT INTO users (
        id, first_name, last_name, email, password_hash, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        user.id,
        user.firstName,
        user.lastName,
        user.email,
        user.passwordHash,
        user.createdAt,
      ]
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (result.rowCount === 0) return null;

    const row = result.rows[0];
    return this.mapRow(row);
  }

  async findById(id: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) return null;

    return this.mapRow(result.rows[0]);
  }

  async findAll(): Promise<User[]> {
    const result = await pool.query(`SELECT * FROM users ORDER BY created_at`);
    return result.rows.map(this.mapRow);
  }

  async update(user: User): Promise<void> {
    await pool.query(
      `
      UPDATE users
      SET first_name = $1,
          last_name = $2,
          email = $3,
          password_hash = $4
      WHERE id = $5
      `,
      [
        user.firstName,
        user.lastName,
        user.email,
        user.passwordHash,
        user.id,
      ]
    );
  }

  async deleteById(id: string): Promise<void> {
    await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  }

  private mapRow(row: any): User {
    return new User(
      row.id,
      row.first_name,
      row.last_name,
      row.email,
      row.password_hash,
      row.created_at
    );
  }
}
