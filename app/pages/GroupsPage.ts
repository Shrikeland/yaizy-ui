import { Page, expect } from "@playwright/test";
import { TextElement } from "../components/TextElement";
import { InputText } from "../components/InputText";
import { Link } from "../components/Link";
import { Cell } from "../components/Cell";
import { Button } from "../components/Button";
import { Tab } from "../components/Tab";
import { Heading } from "../components/Heading";
import { BasePage } from "./BasePage";

export class GroupsPage extends BasePage {
  readonly groupsTable: Heading;
  readonly newGroupLink: Link;
  readonly groupCourseInput: InputText;
  readonly groupCourseElement: TextElement;
  readonly groupTutorInput: InputText;
  readonly groupTutorElement: TextElement;
  readonly groupAssistantInput: InputText;
  readonly groupAssistantElement: TextElement;
  readonly groupStartDateElement: TextElement;
  readonly groupStartDateCell: Cell;
  readonly saveGroupButton: Button;
  readonly sucessNotification: TextElement;
  readonly groupStudentsTab: Tab;
  readonly addStudentButton: Button;
  readonly uploadFileLink: TextElement;
  readonly uploadFileButton: Button;
  readonly importResultsHeader: Heading;
  public baseURL = process.env.BASE_URL!;

  constructor(page: Page) {
    super(page, "Groups");
    const noByRole = false;
    this.groupsTable = new Heading(
      this.page,
      this.annotationHelper,
      ".v-data-table-header",
      noByRole
    );
    this.newGroupLink = new Link(this.page, this.annotationHelper, "New group");
    this.groupCourseInput = new InputText(
      this.page,
      this.annotationHelper,
      "input[data-testid=courses-list__y-text-field-search]",
      noByRole
    );
    this.groupCourseElement = new TextElement(
      this.page,
      this.annotationHelper,
      "Metaverse"
    );
    this.groupTutorInput = new InputText(
      this.page,
      this.annotationHelper,
      "input[data-testid='tutors-list__y-text-field-search']",
      noByRole
    );
    this.groupTutorElement = new TextElement(
      this.page,
      this.annotationHelper,
      "Andrey Test"
    );
    this.groupAssistantInput = new InputText(
      this.page,
      this.annotationHelper,
      "[placeholder='Enter assistants']",
      noByRole
    );
    this.groupAssistantElement = new TextElement(
      this.page,
      this.annotationHelper,
      "New Test Assist"
    );
    this.groupStartDateElement = new TextElement(
      this.page,
      this.annotationHelper,
      "div.y-date-picker",
      noByRole
    );
    this.groupStartDateCell = new Cell(this.page, this.annotationHelper, "16");
    this.saveGroupButton = new Button(this.page, this.annotationHelper, "Save");
    this.sucessNotification = new TextElement(
      this.page,
      this.annotationHelper,
      "Group has been successfully created"
    );
    this.groupStudentsTab = new Tab(
      this.page,
      this.annotationHelper,
      "Students"
    );
    this.addStudentButton = new Button(
      this.page,
      this.annotationHelper,
      "Sign up a student"
    );
    this.uploadFileLink = new TextElement(
      this.page,
      this.annotationHelper,
      "Upload CSV file"
    );
    this.uploadFileButton = new Button(
      this.page,
      this.annotationHelper,
      "Upload file"
    );
    this.importResultsHeader = new Heading(
      this.page,
      this.annotationHelper,
      "Import results"
    );
  }

  /**
   * Go to groups page in sidebar
   * @param groups Groups link
   */
  async addNewGroup() {
    await this.newGroupLink.click();
    await this.fillGroupCreationForm();
    await this.saveGroupButton.click();
    await expect(
      this.page.getByText("Group has been successfully created")
    ).toBeVisible();
    // expect(this.sucessNotification.IsVisible());
  }

  async waitForGroupsLoad() {
    await expect(this.page.locator(".v-data-table-header")).toBeVisible();
    // expect(this.groupsTable.IsVisible());
  }

  async fillGroupCreationForm() {
    await this.groupCourseInput.fill("Metaverse");
    await this.groupCourseElement.click();
    await this.groupTutorInput.fill("Andrey Test");
    await this.groupTutorElement.click();
    await this.groupAssistantInput.fill("New Test Assist");
    await this.groupAssistantElement.click();
    await this.groupStartDateElement.click();
    await this.groupStartDateCell.click();
  }

  async importStudents() {
    await this.groupStudentsTab.click();
    await this.addStudentButton.click();
    const fileChooserPromise = this.page.waitForEvent("filechooser");
    await this.uploadFileLink.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(["./app/utils/helpers/test-file.csv"]);
    await this.uploadFileButton.click();
    await this.page.waitForTimeout(15000);
    await expect(
      this.page.getByRole("heading", { name: "Import results" })
    ).toBeVisible();
    // expect(this.importResultsHeader.IsVisible());
  }
}
