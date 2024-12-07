import { expect } from "@playwright/test";
import { AppPage } from "../abstractClasses";
import { step } from "../utils/reporters/step";

export class MainPage extends AppPage {
  public pagePath = "/courses";

  private scheduleRef = this.page.getByRole("link", { name: "Schedule" });
  private coursesRef = this.page.getByRole("link", { name: "Courses" });
  private groupsRef = this.page.getByRole("link", { name: "Groups" });
  private logoutButton = this.page.getByText("Logout");

  @step()
  async expectLoaded() {
    await expect(this.page).toHaveURL(this.pagePath);
  }

  @step()
  async goToGroups() {
    await this.expectLoaded();
    await this.groupsRef.click();
  }
}
