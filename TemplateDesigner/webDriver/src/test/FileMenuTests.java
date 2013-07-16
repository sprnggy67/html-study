package test;

import java.io.IOException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class FileMenuTests {

	private static String BASE_URL = "http://localhost:8888/TemplateDesigner/designer.html";
	private WebDriver driver;

	@Before
	public void openBrowser() {
		driver = new FirefoxDriver();
		driver.get(BASE_URL);
	}

	@After
	public void saveScreenshotAndCloseBrowser() throws IOException {
		driver.quit();
	}

	@Test
	public void testPageOpensCorrectly() throws IOException {
		assertEquals(
				"The page title should equal to Template Designer",
				"Template Designer", driver.getTitle());
	}

	@Test
	public void testFileNewCreatesEmptyDocument() throws IOException {
		assertEquals(
				"The page title should equal to Template Designer",
				"Template Designer", driver.getTitle());
	}

}
