from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to test page...")
            page.goto("http://localhost:3000/test-color")

            # Wait for content
            print("Waiting for content...")
            expect(page.get_by_role("heading", name="Test Color Circle")).to_be_visible(timeout=30000)

            # Locate the input
            color_input = page.locator('input[type="color"]')
            expect(color_input).to_be_attached()

            # Verify it is hidden (opacity 0)
            print("Verifying input styles...")
            expect(color_input).to_have_css("opacity", "0")

            # Verify tabIndex=-1
            print("Verifying tabIndex...")
            expect(color_input).to_have_attribute("tabindex", "-1")

            # Verify click trigger
            print("Verifying click behavior...")
            page.evaluate("""
                window.inputClicked = false;
                const input = document.querySelector('input[type="color"]');
                input.addEventListener('click', () => {
                    window.inputClicked = true;
                    console.log('Input clicked!');
                });
            """)

            # Click the container
            container = color_input.locator('..')
            container.click()

            # Check if input was clicked programmatically
            # Note: programmatic .click() on an input usually triggers the click event synchronously.
            is_clicked = page.evaluate("window.inputClicked")

            if not is_clicked:
                # Sometimes programmatic click might not fire event in the same way if blocked?
                # But it should.
                print("Input click event not detected immediately. Checking console logs if any.")

            assert is_clicked, "Input was not clicked when container was clicked"

            print("Verification Successful: Input is hidden, has tabIndex=-1, and receives programmatic click.")

            page.screenshot(path="verification/color_circle_test.png")

        except Exception as e:
            print(f"Verification Failed: {e}")
            try:
                page.screenshot(path="verification/color_circle_failure.png")
            except:
                pass
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    run()
