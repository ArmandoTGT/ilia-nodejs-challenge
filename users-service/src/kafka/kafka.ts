import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "users-service",
  brokers: process.env.KAFKA_BROKERS?.split(",") ?? ["localhost:9092"],
});
