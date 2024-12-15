import { BasePage } from "./BasePage";
import { expect } from "@playwright/test";

export class GroupPage extends BasePage {
  constructor(page) {
    super(page);
    this.groupCourse = this.page.locator(".v-data-table-header");
    this.newGroupButton = this.page.locator('a[href="/groups/new"]');
    this.generalTab = this.page.getByRole("tab", { name: "General" });
    this.scheduleTab = this.page.getByRole("tab", { name: "Schedule" });
    this.availableLessonsTab = this.page.getByRole("tab", {
      name: "Available lessons",
    });
    this.upcomingLesson = this.page.getByText("Upcoming").first();
  }

  async dataShouldBeVisible() {
    await expect(this.groupsTable).toBeVisible();
  }

  async addNewGroup() {
    await this.newGroupButton.click();
  }

  async switchToScheduleTab() {
    await expect(this.generalTab).toBeVisible();
    await this.scheduleTab.click();
    console.log(this.upcomingLesson);
  }

  async waitForGroupLoad() {
    await expect(this.page).toHaveURL(/.*groups\/4145/);
    await expect(this.generalTab).toBeVisible({ timeout: 15000 });
  }

  async waitForAvailableLessonsLoad() {
    await expect(this.availableLessonsTab).toBeVisible({ timeout: 15000 });
  }
}
