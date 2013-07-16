package test;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class FileMenuTests {

	private static String BASE_URL = "http://localhost:8888/TemplateDesigner/designer.html";
	private WebDriver driver;

	@Before
	public void openBrowser() {
		driver = new FirefoxDriver();
		driver.get(BASE_URL);
	}

	@After
	public void closeBrowser() {
		driver.quit();
	}

	@Test
	public void testPageOpensCorrectly() {
		assertEquals(
				"The page title should equal to Template Designer",
				"Template Designer", driver.getTitle());
	}

	@Test
	public void testFileNewCreatesEmptyDocument() {
		// Given a canvas with one element.
		testDrag("Headline", "h1", "Best of Times");
		
		// When we press the New button.
		WebElement element = driver.findElement(By.id("newTemplate"));
		element.click();
		
		// Then the element should no longer exist.
		List<WebElement> results = driver.findElements(By.xpath("//h1[contains(.,'Best of Times')]"));
		assertTrue(results.size() == 0);
	}

	private void testDrag(String componentName, String resultTag, String resultText) {
		// Given 
		WebElement element = driver.findElement(byText("li", componentName));
		WebElement target = driver.findElement(By.className("gridCell"));

		// When we drag the headline component onto the canvas.
		Actions builder = new Actions(driver);
		builder.clickAndHold(element).moveToElement(target).release(target);
		builder.build().perform();
		
		// Wait while the javascript renders the page.
		WebDriverWait wait = new WebDriverWait(driver, 10);
		wait.until(ExpectedConditions.presenceOfElementLocated(byText(resultTag, resultText)));

		// Then
		WebElement result = driver.findElement(byText(resultTag, resultText));
		assertNotNull(result);
	}

	private By byText(String tag, String name) {
		return By.xpath("//" + tag + "[contains(.,'" + name + "')]");
	}
	
}
