import { expect } from "@playwright/test";
import { AppPage } from "../abstractClasses";
import { step } from "../utils/reporters/step";

export class GroupsPage extends AppPage {
  public pagePath = "/groups";

  private groupsTable = this.page.locator(".v-data-table-header");
  private newGroupButton = this.page.getByRole("button", { name: "New group" });

  async expectLoaded() {
    await expect(this.page).toHaveURL(this.pagePath);
    await expect(this.groupsTable).toBeVisible();
  }

  async addNewGroup() {
    await this.newGroupButton.click();
  }
}
