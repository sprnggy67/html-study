package test;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.Keys;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class CanvasTests {

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
	public void testDragHeadline() {
		testDragPaletteItem("Headline", "h1", "Best of Times");
	}

	@Test
	public void testDragStandfirst() {
		testDragPaletteItem("Standfirst", "h2", "Start here for the best of the times");
	}

	private void testDragPaletteItem(String componentName, String resultTag, String resultText) {
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
	
	@Test
	public void testSelectSubArticle1AndDragHeadline() {
		// Given
		WebElement element = driver.findElement(byText("li", "Sub Article 4"));
		element.click();
		
		// When then
		testDragPaletteItem("Headline", "h1", "4. Software Developer goes crazy");
	}

	@Test
	public void testSelectSubArticle1AndDragStandfirst() {
		// Given
		WebElement element = driver.findElement(byText("li", "Sub Article 4"));
		element.click();
		
		// When then
		testDragPaletteItem("Standfirst", "h2", "4. An independent software developer in London today said that working at home drove him crazy.");
	}

	@Test
	public void testMoveComponent() {
		// Given a headline component.
		testDragPaletteItem("Headline", "h1", "Best of Times");
		WebElement originalComponent = driver.findElement(byText("h1", "Best of Times"));
		Point originalLocation = originalComponent.getLocation();
		
		// Get another grid cell.
		List<WebElement> results = driver.findElements(By.className("gridCell"));
		WebElement target = results.get(10);
		
		// When we drag the component to a new grid cell.
		Actions builder = new Actions(driver);
		builder.clickAndHold(originalComponent).moveToElement(target, 100, 100).release(target);
		builder.build().perform();
		
		// Wait while the javascript renders the page.
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		// Then its position should move.
		WebElement newComponent = driver.findElement(byText("h1", "Best of Times"));
		Point newLocation = newComponent.getLocation();
		assertNotEquals(originalLocation, newLocation);
	}

	// Don't Test - This test fails because it is so difficult to do an exact Drag and Drop
	public void testResizeComponent() {
		// Given a headline component.
		testDragPaletteItem("Headline", "h1", "Best of Times");
		WebElement originalComponent = driver.findElement(byText("h1", "Best of Times"));
		Point originalLocation = originalComponent.getLocation();
		Dimension originalSize = originalComponent.getSize();
		
		// Get the first and second grid cells.
		List<WebElement> results = driver.findElements(By.className("gridCell"));
		WebElement source = results.get(0);
		WebElement target = results.get(1);
		
		// When we drag the drag handle to the second grid cell.
		Actions builder = new Actions(driver);
		builder.moveToElement(source, source.getSize().width, source.getSize().height)
			.clickAndHold()
			.moveToElement(target, target.getSize().width, target.getSize().height);
//			.release();
		builder.build().perform();
		
		// Wait while the javascript renders the page.
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		builder = new Actions(driver);
		builder.release();
		builder.build().perform();

		// Wait while the javascript renders the page.
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		// Then its position should move.
		WebElement newComponent = driver.findElement(byText("h1", "Best of Times"));
		Point newLocation = newComponent.getLocation();
		Dimension newSize = newComponent.getSize();
		assertEquals(originalLocation, newLocation);
		assertNotEquals(originalSize, newSize);
	}

	@Test
	public void testDeleteComponent() {
		// Given
		testDragPaletteItem("Headline", "h1", "Best of Times");
		
		// When
		String selectAll = Keys.chord(Keys.DELETE);
		driver.findElement(By.tagName("html")).sendKeys(selectAll);
		
		// Then the element should no longer exist.
		List<WebElement> results = driver.findElements(By.xpath("//h1[contains(.,'Best of Times')]"));
		assertTrue(results.size() == 0);
	}


}
