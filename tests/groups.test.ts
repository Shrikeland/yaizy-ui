import { test } from "@playwright/test";
import { MainPage } from "../app/pages/MainPage";
import { GroupsPage } from "../app/pages/GroupsPage";
import { AnnotationType } from "../app/utils/annotations/AnnotationType";

test.describe("Admin user", async () => {
  test.use({ storageState: "auth/admin.json" });
  test(
    "Create new group",
    {
      tag: ["@Basic"],
      annotation: [
        {
          type: AnnotationType.Description,
          description: "Should create a new group successfully",
        },
        {
          type: AnnotationType.Precondition,
          description: "Login with admin credentials",
        },
      ],
    },
    async ({ page }) => {
      const mainPage = new MainPage(page);
      const groupsPage = new GroupsPage(page);
      await mainPage.goTo();
      await mainPage.goToGroups();
      await page.waitForURL("**/groups", { timeout: 5000 });
      const expectedPage = mainPage.baseURL + "/groups";
      await mainPage.AssertEqual(
        expectedPage,
        page.url(),
        'Check URL Page is equal to: "' + expectedPage + '"'
      );
      await groupsPage.waitForGroupsLoad();
      await groupsPage.addNewGroup();
    }
  );

  test(
    "Upload students by CSV file",
    {
      tag: ["@Basic"],
      annotation: [
        {
          type: AnnotationType.Description,
          description: "Should upload students to group successfully",
        },
        {
          type: AnnotationType.Precondition,
          description: "Login with admin credentials and open existing group",
        },
      ],
    },
    async ({ page }) => {
      const mainPage = new MainPage(page);
      const groupsPage = new GroupsPage(page);
      await mainPage.goTo();
      await mainPage.goToGroups();
      await page.waitForURL("**/groups", { timeout: 5000 });
      const expectedPage = mainPage.baseURL + "/groups";
      await mainPage.AssertEqual(
        expectedPage,
        page.url(),
        'Check URL Page is equal to: "' + expectedPage + '"'
      );
      await groupsPage.waitForGroupsLoad();
      await groupsPage.addNewGroup();
      await groupsPage.importStudents();
    }
  );

  test("Should update group schedule by available lessons", async ({
    context,
  }) => {
    await mainPage.goToGroups();
    await groupsPage.waitForGroupsLoad();
    const pagePromise = context.waitForEvent("page");
    await groupsPage.openGroup();
    const newPage = await pagePromise;
    await newPage.waitForLoadState("domcontentloaded");
    await newPage
      .getByRole("tab", {
        name: "Available lessons",
      })
      .click();
    await expect(newPage.getByText("All lessons")).toBeVisible();
  });
});
