import { PrismaClient } from "@prisma/client";
/**
 * DBClient class provides prisma client class in singleton pattern to avoid creating multiple db connections.
 */
class DBClient {
  public prisma: PrismaClient;
  private static instance: DBClient;
  /**
   * Constructs the class. Creates a new instance of PrismaClient
   */
  private constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Returns existing DBClient instance if exists else a new instance of DBClient class.
   * @returns DBClient
   */
  public static getInstance(): DBClient {
    if (!DBClient.instance) {
      DBClient.instance = new DBClient();
    }
    return DBClient.instance;
  }
}

export default DBClient;
