import { PrismaClient } from "@prisma/client";
import Connection from "./Connection";

export default class PrismaAdapter implements Connection {
  connection;

  constructor(){
    this.connection = new PrismaClient();
  }

  query(statment: string, params: any): Promise<any> {
    return this.connection.$queryRawUnsafe(statment, ...params);
  }
  one(statment: string, params: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  close(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}