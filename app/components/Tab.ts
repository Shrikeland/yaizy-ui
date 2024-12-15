import { Locator, Page } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";
import { AnnotationHelper } from "../utils/annotations/AnnotationHelper";

export class Tab extends BaseComponent {
  /**
   * Constructor
   * @param page Page
   * @param annotationHelper Annotation that stores steps and custom annotations
   * @param name Name or css locator for the link
   * @param [byRole=true]
   * True - To locate by role/name
   * False - To locate by css selector
   */
  constructor(
    page: Page,
    annotationHelper: AnnotationHelper,
    private name: string,
    byRole = true,
    isFirst = false
  ) {
    let locator: Locator = page.getByRole("tab", { name: name });
    if (!byRole) locator = page.locator(name);
    if (isFirst) locator = locator.first();
    super(page, annotationHelper, locator);
    this.text = this.name;
    this.label = this.name;
  }

  /**
   * Click in the tab
   */
  async click() {
    const tabText = await this.getText();
    const stepDescription = `Click: "${tabText}"`;
    await this.addStepWithAnnotation(stepDescription, async () => {
      await this.locator.click();
    });
  }

  /**
   * Get the text of the tab
   * @returns Tab text content
   */
  override async getText(): Promise<string> {
    if (!this.label) {
      const tabText = await this.locator.textContent();
      if (tabText) this.label = tabText;
    }
    return this.label ?? "";
  }
}
