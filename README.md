# SauceDemo Playwright Test Suite

This project contains automated tests for the SauceDemo application using Playwright with Page Object Model (POM) structure.

## Project Structure

```
saucedemo/
├── pages/                      # Page Object Model classes
│   ├── LoginPage.js           # Login page interactions
│   ├── InventoryPage.js       # Product inventory page
│   ├── CartPage.js            # Shopping cart page
│   ├── CheckoutStepOnePage.js # Checkout step 1 (user info)
│   ├── CheckoutStepTwoPage.js # Checkout step 2 (order review)
│   └── CheckoutCompletePage.js # Checkout completion page
├── tests/                     # Test files
│   ├── login.spec.js         # Login functionality tests
│   ├── inventory.spec.js     # Product inventory tests
│   └── e2e.spec.js          # End-to-end tests
├── test-data/                # Test data files
│   └── testData.js          # Test data constants
├── utils/                    # Utility classes
│   └── PageManager.js       # Page object manager
├── package.json             # Dependencies and scripts
├── playwright.config.js     # Playwright configuration
└── README.md               # This file
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm

### Installation

1. Navigate to the saucedemo directory:
   ```bash
   cd saucedemo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npm run install
   ```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (visible browser)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run tests with UI mode
```bash
npm run test:ui
```

### Run specific test file
```bash
npx playwright test login.spec.js
```

### Run specific test
```bash
npx playwright test login.spec.js -g "should login successfully"
```

## Test Reports

After running tests, view the HTML report:
```bash
npm run report
```

## Page Object Model Structure

### Page Classes

Each page class encapsulates:
- **Locators**: Element selectors for the page
- **Actions**: Methods to interact with page elements
- **Assertions**: Methods to verify page state

#### Example Page Class Structure:
```javascript
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyLoginPageLoaded() {
    await expect(this.loginButton).toBeVisible();
  }
}
```

### PageManager Utility

The `PageManager` class provides:
- Central access to all page objects
- Helper methods for common workflows
- Simplified test setup

#### Usage Example:
```javascript
const pageManager = new PageManager(page);

// Access individual pages
await pageManager.getLoginPage().login('username', 'password');
await pageManager.getInventoryPage().addBackpackToCart();

// Use helper methods
await pageManager.loginAsStandardUser();
await pageManager.completePurchaseFlow(checkoutInfo);
```

## Test Data

Test data is centralized in `test-data/testData.js`:

```javascript
const TestData = {
  users: {
    standard: {
      username: 'standard_user',
      password: 'secret_sauce'
    }
  },
  products: {
    backpack: {
      name: 'Sauce Labs Backpack',
      price: '$29.99'
    }
  }
};
```

## Test Categories

### Login Tests (`login.spec.js`)
- Valid login scenarios
- Invalid credential handling
- Error message validation
- Form field validation

### Inventory Tests (`inventory.spec.js`)
- Product display verification
- Add/remove products from cart
- Product sorting functionality
- Cart badge updates

### End-to-End Tests (`e2e.spec.js`)
- Complete purchase workflows
- Multi-step user journeys
- Integration between pages
- Happy path and alternate scenarios

## Detailed Test Coverage

### ✅ Positive Test Scenarios (Happy Path)

#### **Login Functionality**
- ✅ **Login with valid credentials**
  - Test: `should login successfully with valid credentials`
  - Verifies successful login with standard_user/secret_sauce
  - Validates navigation to inventory page
  - Location: `tests/login.spec.js`

#### **Product Management**
- ✅ **Add product to cart**
  - Test: `should add single product to cart`
  - Adds Sauce Labs Backpack to cart
  - Verifies cart badge shows count of 1
  - Location: `tests/inventory.spec.js`

#### **Checkout Process**
- ✅ **Checkout with form**
  - Test: `complete purchase flow - standard user`
  - Fills all required checkout fields (First Name, Last Name, Postal Code)
  - Validates successful form submission
  - Location: `tests/e2e.spec.js`

#### **Order Completion**
- ✅ **Complete order**
  - Test: `complete purchase flow - standard user`
  - Completes entire purchase flow from login to confirmation
  - Verifies "Thank you for your order!" message
  - Validates order completion page elements
  - Location: `tests/e2e.spec.js`

#### **User Session Management**
- ✅ **Logout**
  - Test: `should logout successfully`
  - Clicks hamburger menu and logout link
  - Verifies redirect to login page
  - Location: `tests/inventory.spec.js`

### ❌ Negative Test Scenarios (Error Handling)

#### **Login Validation**
- ❌ **Try login with empty password**
  - Test: `should show error for missing password`
  - Attempts login with username but empty password field
  - Validates error message: "Epic sadface: Password is required"
  - Location: `tests/login.spec.js`

#### **Cart Functionality**
- ❌ **Try to open cart without items**
  - Test: `should verify cart badge disappears when no items in cart`
  - Opens cart page with zero items
  - Verifies cart badge is not visible
  - Validates empty cart state
  - Location: `tests/inventory.spec.js`

#### **Checkout Form Validation**
- ❌ **Submit checkout with empty fields**
  - Test: `verifyFirstNameRequired`, `verifyLastNameRequired`, `verifyPostalCodeRequired`
  - Attempts checkout with missing required fields
  - Validates error messages for each missing field:
    - "Error: First Name is required"
    - "Error: Last Name is required" 
    - "Error: Postal Code is required"
  - Location: `tests/` (individual validation methods in CheckoutStepOnePage)

### Additional Error Scenarios

#### **Login Security**
- ❌ **Locked out user**
  - Test: `should show error for locked out user`
  - Attempts login with locked_out_user
  - Validates error: "Epic sadface: Sorry, this user has been locked out."

- ❌ **Missing username**
  - Test: `should show error for missing username`
  - Attempts login with empty username field
  - Validates error: "Epic sadface: Username is required"

- ❌ **Invalid credentials**
  - Test: `should show error for invalid credentials`
  - Attempts login with non-existent user
  - Validates error: "Epic sadface: Username and password do not match any user in this service"

### Test Execution Matrix

| Test Scenario | Status | Test File | Test Method |
|---------------|--------|-----------|-------------|
| Login with valid creds | ✅ | `login.spec.js` | `should login successfully with valid credentials` |
| Login with empty password | ❌ | `login.spec.js` | `should show error for missing password` |
| Add product to cart | ✅ | `inventory.spec.js` | `should add single product to cart` |
| Open cart without items | ❌ | `inventory.spec.js` | `should verify cart badge disappears when no items in cart` |
| Checkout with form | ✅ | `e2e.spec.js` | `complete purchase flow - standard user` |
| Submit checkout with empty fields | ❌ | Individual methods | `verifyFirstNameRequired`, `verifyLastNameRequired`, `verifyPostalCodeRequired` |
| Complete order | ✅ | `e2e.spec.js` | `complete purchase flow - standard user` |
| Logout | ✅ | `inventory.spec.js` | `should logout successfully` |

## Best Practices

### 1. Page Object Design
- Keep page objects focused on single pages
- Use descriptive method names
- Include both actions and assertions
- Maintain clear separation of concerns

### 2. Test Structure
- Use descriptive test names
- Include setup and teardown
- Focus on business scenarios
- Avoid test interdependencies

### 3. Locator Strategy
- Prefer data-test attributes
- Use semantic locators when possible
- Avoid fragile CSS selectors
- Keep locators maintainable

### 4. Test Data Management
- Centralize test data
- Use meaningful variable names
- Separate test data from test logic
- Consider environment-specific data

## Configuration

### Playwright Configuration (`playwright.config.js`)
- Base URL: `https://www.saucedemo.com`
- Browser support: Chrome (Desktop)
- Screenshot and video capture on failure
- HTML reporting enabled
- Parallel test execution
- CI/CD optimized settings

### Supported Browsers
- Desktop Chrome (Primary testing browser)

## Troubleshooting

### Common Issues

1. **Tests failing due to timeout**
   - Increase timeout in playwright.config.js
   - Add explicit waits for slow elements

2. **Element not found errors**
   - Verify locators are correct
   - Check if elements are dynamically loaded
   - Add proper wait conditions

3. **Browser installation issues**
   - Run `npm run install` to install browsers
   - Check system requirements

### Debug Tips

1. **Run in headed mode**
   ```bash
   npm run test:headed
   ```

2. **Use Playwright Inspector**
   ```bash
   npm run test:debug
   ```

3. **Add debug screenshots**
   ```javascript
   await page.screenshot({ path: 'debug.png' });
   ```

## Contributing

1. Follow the existing POM structure
2. Add appropriate tests for new functionality
3. Update documentation as needed
4. Ensure all tests pass before submitting changes

## Test Execution Examples

### Run login tests only
```bash
npx playwright test login.spec.js
```

### Run tests on specific browser
```bash
npx playwright test --project=chromium
```

### Run tests with specific tag
```bash
npx playwright test --grep "should login successfully"
```

## Continuous Integration

The test suite is configured to run in CI environments with:
- Automatic retries on failure
- HTML report generation
- Screenshot and video capture
- Parallel test execution 