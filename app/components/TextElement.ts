import { Locator, Page } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";
import { AnnotationHelper } from "../utils/annotations/AnnotationHelper";

export class TextElement extends BaseComponent {
  /**
   * Constructor
   * @param page Page
   * @param annotationHelper Annotation that stores steps and custom annotations
   * @param text The text to locate the element
   * @param [byText=true]
   * True - To locate by text
   * False - To locate by css selector
   */
  constructor(
    page: Page,
    annotationHelper: AnnotationHelper,
    text: string,
    byText = true
  ) {
    let locator: Locator = page.getByText(text);
    if (!byText) locator = page.locator(text);
    super(page, annotationHelper, locator);
  }

  /**
   * Click the text element
   */
  async click() {
    this.label = this.text; // Using the provided text as the label
    const stepDescription = `Click on the text element: "${this.label}"`;
    await this.addStepWithAnnotation(stepDescription, async () => {
      await this.locator.click();
    });
  }

  /**
   * Check if the text element is visible
   */
  async IsVisible(): Promise<boolean> {
    const stepDescription = `Check if the text element: "${this.text}" is visible`;
    return await this.addStepWithAnnotation(stepDescription, async () => {
      return await this.locator.isVisible();
    });
  }

  /**
   * Get the inner text of the element
   */
  async getInnerText(): Promise<string> {
    const stepDescription = `Retrieve the inner text of the element: "${this.text}"`;
    return await this.addStepWithAnnotation(stepDescription, async () => {
      return await this.locator.innerText();
    });
  }
}
