import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "wallet-service",
  brokers: process.env.KAFKA_BROKERS?.split(",") ?? ["localhost:9092"],
});
