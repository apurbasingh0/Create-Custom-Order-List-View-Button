"# Create-Custom-Order-List-View-Button" 
# Order Request List View Button (Salesforce)

A Salesforce feature that enables B2B portal users to quickly raise Order Requests from a list view using a custom Lightning Web Component and Apex controller. It supports account-based filtering, PO date input, and product selection from the Distributor Pricebook.

---

## 🚀 Features

- Fetches logged-in portal user details and associated account.
- Supports order creation with PO date and dynamic product selection.
- Dynamically adds/removes product rows with quantity input.
- Uses `PricebookEntry` records tied to the "Distributor Pricebook".
- Automatically sets billing/shipping details from the user's account.
- Navigates to the newly created Order record after creation.
- Displays success/error messages via Lightning toast notifications.

---

## 📂 Components

### Apex Class: `createOrderListViewButtonController.cls`

#### Methods:
- `@AuraEnabled(cacheable=true) static User getLoggedInUser()`:  
  Returns the current portal user’s basic info and associated Account.

- `@AuraEnabled static Order createOrderRequest(String orderName, Date poDate, String accountId, List<docSizewrap> orderItems)`:  
  Creates an `Order` and related `OrderItems` for the current portal user using the Distributor Pricebook.

#### Inner Class:
- `docSizewrap`: Wrapper for selected product and quantity.

---

### LWC: `createOrderListViewButton`

#### Key Features:
- Multi-step UI modal triggered from a list view.
- Order details: Name, PO Date, and read-only Account.
- Product selection table with:
  - Product lookup (filtered to Distributor Pricebook)
  - Quantity input
  - Add/Delete row functionality
- Navigation to created order after submission.

#### Apex Methods Used:
- `getLoggedInUser()`
- `createOrderRequest(...)`

---

### HTML Template

- Uses `lightning-input`, `lightning-button`, `lightning-button-icon`, and custom `c-custom-lookup` components.
- Displays a table for entering products and quantities.
- Modal dialog pattern with cancel/save actions.
- Displays feedback using `lightning/platformShowToastEvent`.

---

## 🛠 Setup Instructions

1. **Deploy Apex Class**  
   Upload `createOrderListViewButtonController.cls` to your Salesforce org.

2. **Deploy Lightning Web Component**  
   Upload `createOrderListViewButton`, including JavaScript and HTML files.

3. **Custom Lookup Component**  
   Ensure `c-custom-lookup` is available or create one to handle filtered product selection.

4. **Pricebook Setup**  
   Confirm that a custom pricebook named `"Distributor Pricebook"` exists and contains active `PricebookEntry` records.

5. **User Permissions**  
   Ensure portal users have access to:
   - Apex class
   - Order and OrderItem objects
   - PricebookEntry, Product2, and Account read access

6. **Lightning Page Integration**  
   Add the LWC to a relevant Lightning Record Page or App Page for visibility.

---

## ✅ Usage

1. Navigate to the object or page where the `createOrderListViewButton` LWC is deployed.
2. Click **"Add Order Request"** to open the modal.
3. Enter Order Name and PO Date.
4. Select products using lookup and specify quantities.
5. Click **Save** to submit the order request.
6. You’ll be redirected to the newly created Order record.

---

## ⚠️ Error Handling

- Prevents saving orders without selected products.
- Displays clear error messages using Lightning toasts.
- Handles Apex exceptions with user-friendly messaging.

---

