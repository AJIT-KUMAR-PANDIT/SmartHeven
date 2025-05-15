import BaseDB from "./base.db.js";
import bcrypt from "bcryptjs";

const saltRounds = parseInt(import.meta.env.VITE_BCRYPT_SALT_ROUNDS);

class AuthDB extends BaseDB {
  constructor() {
    super({ users: {} });
    this.collection = "users";
  }

  async createUser(username, password) {
    const users = await this.getAllItems(this.collection);
    if (users[username]) {
      throw new Error("User already exists");
    }

    const hash = bcrypt.hashSync(password, saltRounds);
    return this.save(this.collection, username, { username, hash });
  }

  async validateCredentials(username, password) {
    const user = await this.getById(this.collection, username);
    return user ? bcrypt.compareSync(password, user.hash) : false;
  }

  async resetPassword(username, newPassword) {
    const user = await this.getById(this.collection, username);
    if (!user) throw new Error("User not found");

    user.hash = bcrypt.hashSync(newPassword, saltRounds);
    return this.save(this.collection, username, user);
  }
}

export default new AuthDB();
