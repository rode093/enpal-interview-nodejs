import DBClient from "../providers/db";

class BaseModel {
  protected dbClient: DBClient;
  constructor() {
    this.dbClient = DBClient.getInstance();
  }
}

export default BaseModel;
