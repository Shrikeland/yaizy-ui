import { Locator, Page } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";
import { AnnotationHelper } from "../utils/annotations/AnnotationHelper";
import { expect } from "@playwright/test";

export class Heading extends BaseComponent {
  /**
   * Constructor
   * @param page Playwright page
   * @param annotationHelper Annotation that stores steps and custom annotations
   * @param selector Name for the button
   */
  constructor(
    page: Page,
    annotationHelper: AnnotationHelper,
    private name: string,
    byRole = true
  ) {
    let locator: Locator = page.getByRole("heading", { name: name });
    if (!byRole) locator = page.locator(name);
    super(page, annotationHelper, locator);
    this.text = this.name;
  }

  async IsVisible(): Promise<boolean> {
    return await this.addStepWithAnnotation(
      "Check if the header is visible",
      async () => {
        return this.locator.waitFor({ state: "visible" });
      }
    );
  }
}
