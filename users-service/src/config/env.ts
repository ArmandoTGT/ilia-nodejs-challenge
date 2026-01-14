import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value;
}

export const env = {
  PORT: Number(process.env.PORT ?? 3002),

  DB_HOST: requireEnv("DB_HOST"),
  DB_PORT: Number(requireEnv("DB_PORT")),
  DB_NAME: requireEnv("DB_NAME"),
  DB_USER: requireEnv("DB_USER"),
  DB_PASSWORD: requireEnv("DB_PASSWORD"),

  JWT_SECRET: requireEnv("JWT_SECRET"),
  JWT_INTERNAL_SECRET: requireEnv("JWT_INTERNAL_SECRET"),

  KAFKA_BROKERS: requireEnv("KAFKA_BROKERS"),
};

