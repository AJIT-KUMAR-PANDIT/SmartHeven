import BaseDB from "./base.db";
import { v4 as uuidv4 } from "uuid";

class AutomationDB extends BaseDB {
  constructor() {
    super({ automations: {} });
    this.collection = "automations";
  }

  async getAllItems() {
    const automations = await super.getAllItems(this.collection);
    return Object.values(automations);
  }

  async getById(id) {
    const automations = await super.getAllItems(this.collection);
    return automations[id];
  }

  async save(id, data) {
    if (!data.id) {
      data.id = id;
    }
    if (!data.createdAt) {
      data.createdAt = Date.now();
    }
    data.updatedAt = Date.now();

    return super.save(this.collection, id, data);
  }

  async remove(id) {
    return super.remove(this.collection, id);
  }

  generateId() {
    return uuidv4();
  }

  async getAutomationsByCondition(conditionType) {
    const automations = await this.getAllItems();
    return automations.filter(
      (automation) => automation.conditionType === conditionType
    );
  }

  async getEnabledAutomations() {
    const automations = await this.getAllItems();
    return automations.filter((automation) => automation.isEnabled);
  }
}

export default new AutomationDB();
