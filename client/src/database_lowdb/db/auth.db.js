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

    if (!username.trim()) {
      throw new Error("Username is required");
    }

    if (password.length !== 6 || !/^\d+$/.test(password)) {
      throw new Error("Password must be 6 digits");
    }

    const hash = bcrypt.hashSync(password, saltRounds);
    return this.save(this.collection, username, { username, hash });
  }

  async validateCredentials(username, password) {
    const user = await this.getById(this.collection, username);
    if (!user) return false;
    const isValid = bcrypt.compareSync(password, user.hash);
    if (isValid) {
      user.lastLogin = Date.now();
      await this.save(this.collection, username, user);
    }
    return isValid;
  }

  async resetPassword(username, newPassword) {
    const user = await this.getById(this.collection, username);
    if (!user) throw new Error("User not found");

    user.hash = bcrypt.hashSync(newPassword, saltRounds);
    return this.save(this.collection, username, user);
  }
}

export default new AuthDB();
