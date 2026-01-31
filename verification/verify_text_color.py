from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    try:
        page.goto("http://localhost:3000/test-text-editor")

        # Wait for the component to render
        page.wait_for_selector("text=Text Editor Drawer Test", timeout=10000)

        # Check if the new color picker UI is present
        # We expect "Selecciona un color" text
        expect(page.get_by_text("Selecciona un color")).to_be_visible()

        # Check if the ColorCircle (input type=color) is present
        # The ColorCircle component has an input type="color"
        expect(page.locator("input[type='color']")).to_be_visible()

        # Take screenshot
        page.screenshot(path="verification/text_editor_verification.png", full_page=True)
        print("Verification successful, screenshot saved.")

    except Exception as e:
        print(f"Verification failed: {e}")
        # Capture failure screenshot
        page.screenshot(path="verification/failure.png", full_page=True)
        raise e
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
