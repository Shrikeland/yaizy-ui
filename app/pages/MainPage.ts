import { Page } from "@playwright/test";
import { Button } from "../components/Button";
import { AnnotationType } from "../utils/annotations/AnnotationType";
import { InputText } from "../components/InputText";
import { Link } from "../components/Link";
import { BasePage } from "./BasePage";

export class MainPage extends BasePage {
  readonly role: Button;
  readonly login: Button;
  readonly groups: Link;
  public baseURL = process.env.BASE_URL!;

  constructor(page: Page) {
    //We need the page, and a friendly name for the page to be used in reports
    super(page, "Main page (Courses default)");
    const noByRole = false;
    this.groups = new Link(this.page, this.annotationHelper, "Groups");
  }

  /**
   * Go to Courses page
   */
  public async goTo() {
    const mainPage = this.baseURL + "/courses";
    await this.addStepWithAnnotation(
      AnnotationType.GoTo,
      `Go to: "${mainPage}"`,
      async () => {
        await this.page.goto(mainPage);
      }
    );
  }

  /**
   * Go to groups page in sidebar
   * @param groups Groups link
   */
  public async goToGroups() {
    await this.groups.click();
  }
}
