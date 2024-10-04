import { config, expect } from "chai";
import {
  ActivityBar,
  By,
  SideBarView,
  ViewControl,
  ViewSection,
  WebView,
} from "vscode-extension-tester";
import { sleep } from "./uiTestHelper";

config.truncateThreshold = 0;
export function welcomePageUITest(): void {
  describe("Verify welcome page sidebar and title is displayed as expected", async () => {
    let view: ViewControl;
    let sideBar: SideBarView;
    let adtSection: ViewSection;

    before(async () => {
      // Open Ansible Development Tools by clicking the Getting started button on the side bar
      view = (await new ActivityBar().getViewControl("Ansible")) as ViewControl;
      sideBar = await view.openView();
      // to get the content part
      adtSection = await sideBar
        .getContent()
        .getSection("Ansible Development Tools");
    });

    after(async function () {
      if (view) {
        await view.closeView();
      }
    });

    it("check for title and get started button", async function () {
      const title = await adtSection.getTitle();
      const getStartedButton = await adtSection.findElement(
        By.xpath(
          "//a[contains(@class, 'monaco-button') and " +
            ".//span/text()='Get started']",
        ),
      );

      expect(title).not.to.be.undefined;
      expect(title).to.equals("Ansible Development Tools");
      expect(getStartedButton).not.to.be.undefined;
    });

    it("check for header and subtitle", async function () {
      const getStartedButton = await adtSection.findElement(
        By.xpath(
          "//a[contains(@class, 'monaco-button') and " +
            ".//span/text()='Get started']",
        ),
      );

      expect(getStartedButton).not.to.be.undefined;

      if (getStartedButton) {
        await getStartedButton.click();
      }
      await sleep(3000);

      const welcomePageWebView = await new WebView();
      expect(welcomePageWebView, "welcomePageWebView should not be undefined")
        .not.to.be.undefined;
      await welcomePageWebView.switchToFrame(3000);
      expect(
        welcomePageWebView,
        "welcomePageWebView should not be undefined after switching to its frame",
      ).not.to.be.undefined;

      const adtHeaderTitle = await welcomePageWebView.findWebElement(
        By.className("title caption"),
      );
      expect(adtHeaderTitle).not.to.be.undefined;
      expect(await adtHeaderTitle.getText()).to.equals(
        "Ansible Development Tools",
      );

      const adtSubheader = await welcomePageWebView.findWebElement(
        By.className("subtitle description"),
      );
      expect(adtSubheader).not.to.be.undefined;
      expect(await adtSubheader.getText()).includes(
        "Create, test and deploy Ansible content",
      );

      await welcomePageWebView.switchBack();
    });
  });
}
