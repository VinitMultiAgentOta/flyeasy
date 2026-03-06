# DELIVERABLE 1 - 50 FUNCTIONAL TEST CASES

## SEARCH FLOW

1. **TC01**: Valid one-way search DEL to DXB returns results within 5 seconds.
	* Steps: 
		1. Navigate to the home page.
		2. Select one-way trip type.
		3. Fill in the origin as DEL.
		4. Fill in the destination as DXB.
		5. Click the Search Flights button.
	* Expected Result: Results are displayed within 5 seconds.
	* Severity: High
2. **TC02**: Valid round-trip search with return date shows both legs.
	* Steps: 
		1. Navigate to the home page.
		2. Select round-trip.
		3. Fill in the origin as DEL.
		4. Fill in the destination as DXB.
		5. Select a return date.
		6. Click the Search Flights button.
	* Expected Result: Both legs of the journey are displayed.
	* Severity: High
3. **TC03**: Multi-city search with 3 legs works correctly.
	* Steps: 
		1. Navigate to the home page.
		2. Select multi-city.
		3. Fill in the origin as DEL.
		4. Fill in the first destination as DXB.
		5. Fill in the second destination as BOM.
		6. Fill in the third destination as DEL.
		7. Click the Search Flights button.
	* Expected Result: All legs of the journey are displayed.
	* Severity: Medium
4. **TC04**: Search with no available flights shows empty state message.
	* Steps: 
		1. Navigate to the home page.
		2. Select one-way trip type.
		3. Fill in the origin as DEL.
		4. Fill in the destination as a location with no flights.
		5. Click the Search Flights button.
	* Expected Result: An empty state message is displayed.
	* Severity: Low
5. **TC05**: Search with past departure date shows validation error.
	* Steps: 
		1. Navigate to the home page.
		2. Select one-way trip type.
		3. Fill in the origin as DEL.
		4. Fill in the destination as DXB.
		5. Select a past departure date.
		6. Click the Search Flights button.
	* Expected Result: A validation error is displayed.
	* Severity: Medium
6. **TC06**: Search without selecting origin airport shows error.
	* Steps: 
		1. Navigate to the home page.
		2. Select one-way trip type.
		3. Do not fill in the origin.
		4. Fill in the destination as DXB.
		5. Click the Search Flights button.
	* Expected Result: An error is displayed.
	* Severity: High
7. **TC07**: Search without selecting destination airport shows error.
	* Steps: 
		1. Navigate to the home page.
		2. Select one-way trip type.
		3. Fill in the origin as DEL.
		4. Do not fill in the destination.
		5. Click the Search Flights button.
	* Expected Result: An error is displayed.
	* Severity: High
8. **TC08**: Swap origin and destination button reverses both values correctly.
	* Steps: 
		1. Navigate to the home page.
		2. Select one-way trip type.
		3. Fill in the origin as DEL.
		4. Fill in the destination as DXB.
		5. Click the swap button.
	* Expected Result: The origin and destination are swapped.
	* Severity: Low
9. **TC09**: Passenger selector enforces maximum 9 total passengers.
	* Steps: 
		1. Navigate to the home page.
		2. Select one-way trip type.
		3. Fill in the origin as DEL.
		4. Fill in the destination as DXB.
		5. Try to select more than 9 passengers.
	* Expected Result: An error is displayed.
	* Severity: Medium
10. **TC10**: Adding infant without adult passenger shows validation error.
	* Steps: 
		1. Navigate to the home page.
		2. Select one-way trip type.
		3. Fill in the origin as DEL.
		4. Fill in the destination as DXB.
		5. Try to add an infant without an adult.
	* Expected Result: A validation error is displayed.
	* Severity: Medium

## RESULTS PAGE

11. **TC11**: Flight results load and display within 5 seconds.
	* Steps: 
		1. Navigate to the home page.
		2. Select one-way trip type.
		3. Fill in the origin as DEL.
		4. Fill in the destination as DXB.
		5. Click the Search Flights button.
	* Expected Result: Results are displayed within 5 seconds.
	* Severity: High
12. **TC12**: Sort by cheapest reorders all results by price ascending.
	* Steps: 
		1. Navigate to the results page.
		2. Click the sort by cheapest button.
	* Expected Result: Results are reordered by price.
	* Severity: Medium
13. **TC13**: Sort by fastest reorders all results by duration ascending.
	* Steps: 
		1. Navigate to the results page.
		2. Click the sort by fastest button.
	* Expected Result: Results are reordered by duration.
	* Severity: Medium
14. **TC14**: Filter by zero stops shows only non-stop flights.
	* Steps: 
		1. Navigate to the results page.
		2. Click the filter by zero stops button.
	* Expected Result: Only non-stop flights are displayed.
	* Severity: Medium
15. **TC15**: Filter by specific airline shows only that airline flights.
	* Steps: 
		1. Navigate to the results page.
		2. Click the filter by airline button.
	* Expected Result: Only flights from the selected airline are displayed.
	* Severity: Medium
16. **TC16**: Price range filter removes flights outside selected range.
	* Steps: 
		1. Navigate to the results page.
		2. Click the price range filter button.
	* Expected Result: Flights outside the selected price range are removed.
	* Severity: Medium
17. **TC17**: Loading skeleton cards display during API call.
	* Steps: 
		1. Navigate to the results page.
		2. Click the Search Flights button.
	* Expected Result: Loading skeleton cards are displayed.
	* Severity: Low
18. **TC18**: Clicking a flight card navigates to correct flight detail page.
	* Steps: 
		1. Navigate to the results page.
		2. Click a flight card.
	* Expected Result: The correct flight detail page is displayed.
	* Severity: High

## BOOKING FLOW

19. **TC19**: Passenger form blocks submission when required fields are empty.
	* Steps: 
		1. Navigate to the booking page.
		2. Try to submit the form with empty required fields.
	* Expected Result: The form submission is blocked.
	* Severity: High
20. **TC20**: Invalid passport number format is rejected with error message.
	* Steps: 
		1. Navigate to the booking page.
		2. Fill in an invalid passport number.
		3. Try to submit the form.
	* Expected Result: An error message is displayed.
	* Severity: Medium
21. **TC21**: Invalid email format is rejected with error message.
	* Steps: 
		1. Navigate to the booking page.
		2. Fill in an invalid email.
		3. Try to submit the form.
	* Expected Result: An error message is displayed.
	* Severity: Medium
22. **TC22**: Phone number without plus 91 prefix shows format error.
	* Steps: 
		1. Navigate to the booking page.
		2. Fill in a phone number without the plus 91 prefix.
		3. Try to submit the form.
	* Expected Result: A format error is displayed.
	* Severity: Medium
23. **TC23**: Seat selection persists correctly for each passenger.
	* Steps: 
		1. Navigate to the seat selection page.
		2. Select a seat for each passenger.
	* Expected Result: The seat selection is persisted.
	* Severity: Medium
24. **TC24**: Skip seat selection link proceeds directly to payment page.
	* Steps: 
		1. Navigate to the seat selection page.
		2. Click the skip seat selection link.
	* Expected Result: The payment page is displayed.
	* Severity: Medium
25. **TC25**: 15 minute countdown timer is visible and running on payment page.
	* Steps: 
		1. Navigate to the payment page.
	* Expected Result: The countdown timer is visible and running.
	* Severity: High
26. **TC26**: Timer reaching zero shows fare expired message with option to search again.
	* Steps: 
		1. Navigate to the payment page.
		2. Wait for the countdown timer to reach zero.
	* Expected Result: A fare expired message is displayed.
	* Severity: High
27. **TC27**: Successful test card payment completes booking and shows PNR.
	* Steps: 
		1. Navigate to the payment page.
		2. Complete a successful test card payment.
	* Expected Result: The booking is completed and the PNR is displayed.
	* Severity: High
28. **TC28**: Successful UPI test payment completes booking and shows PNR.
	* Steps: 
		1. Navigate to the payment page.
		2. Complete a successful UPI test payment.
	* Expected Result: The booking is completed and the PNR is displayed.
	* Severity: High
29. **TC29**: Failed payment shows error message with retry payment option.
	* Steps: 
		1. Navigate to the payment page.
		2. Complete a failed payment.
	* Expected Result: An error message is displayed with a retry payment option.
	* Severity: High
30. **TC30**: Confirmation page displays correct PNR in large format.
	* Steps: 
		1. Navigate to the confirmation page.
	* Expected Result: The correct PNR is displayed in large format.
	* Severity: High

## TICKET FLOW

31. **TC31**: E-ticket page loads with all correct data for given PNR.
	* Steps: 
		1. Navigate to the e-ticket page.
		2. Enter a valid PNR.
	* Expected Result: The e-ticket page loads with the correct data.
	* Severity: High
32. **TC32**: All passenger names display correctly on e-ticket.
	* Steps: 
		1. Navigate to the e-ticket page.
		2. Enter a valid PNR.
	* Expected Result: All passenger names are displayed correctly.
	* Severity: Medium
33. **TC33**: Print button triggers browser print dialog correctly.
	* Steps: 
		1. Navigate to the e-ticket page.
		2. Click the print button.
	* Expected Result: The browser print dialog is triggered.
	* Severity: Low
34. **TC34**: Booking confirmation email arrives within 2 minutes of payment.
	* Steps: 
		1. Complete a booking.
		2. Wait for 2 minutes.
	* Expected Result: A booking confirmation email is received.
	* Severity: Medium
35. **TC35**: WhatsApp share button generates link containing PNR and route.
	* Steps: 
		1. Navigate to the e-ticket page.
		2. Click the WhatsApp share button.
	* Expected Result: A link containing the PNR and route is generated.
	* Severity: Low

## EDGE CASES

36. **TC36**: Fare expired between search and booking shows clear expired message.
	* Steps: 
		1. Navigate to the booking page.
		2. Wait for the fare to expire.
	* Expected Result: A clear expired message is displayed.
	* Severity: High
37. **TC37**: Seat sold between search and booking offers alternative options.
	* Steps: 
		1. Navigate to the booking page.
		2. Wait for a seat to be sold.
	* Expected Result: Alternative options are offered.
	* Severity: Medium
38. **TC38**: Price increased between search and payment shows price change alert.
	* Steps: 
		1. Navigate to the payment page.
		2. Wait for the price to increase.
	* Expected Result: A price change alert is displayed.
	* Severity: High
39. **TC39**: Amadeus API timeout after 30 seconds shows friendly retry message.
	* Steps: 
		1. Navigate to the booking page.
		2. Wait for the Amadeus API to timeout.
	* Expected Result: A friendly retry message is displayed.
	* Severity: Medium
40. **TC40**: Payment success but PNR creation failed shows support contact message.
	* Steps: 
		1. Navigate to the payment page.
		2. Complete a successful payment.
		3. Wait for the PNR creation to fail.
	* Expected Result: A support contact message is displayed.
	* Severity: High
41. **TC41**: Attempting duplicate booking for same flight and passenger is blocked.
	* Steps: 
		1. Navigate to the booking page.
		2. Try to book the same flight and passenger again.
	* Expected Result: The booking is blocked.
	* Severity: Medium
42. **TC42**: Browser back button during payment page does not lose entered data.
	* Steps: 
		1. Navigate to the payment page.
		2. Enter some data.
		3. Click the browser back button.
	* Expected Result: The entered data is not lost.
	* Severity: Medium
43. **TC43**: Page refresh during passenger form restores data from Zustand store.
	* Steps: 
		1. Navigate to the passenger form page.
		2. Enter some data.
		3. Refresh the page.
	* Expected Result: The data is restored from the Zustand store.
	* Severity: Medium
44. **TC44**: Slow 3G network simulation shows loading states on all pages.
	* Steps: 
		1. Simulate a slow 3G network.
		2. Navigate to different pages.
	* Expected Result: Loading states are displayed on all pages.
	* Severity: Low
45. **TC45**: Network disconnect during payment shows connection error with recovery.
	* Steps: 
		1. Navigate to the payment page.
		2. Disconnect the network.
	* Expected Result: A connection error with recovery is displayed.
	* Severity: Medium
46. **TC46**: Accessing ticket page with invalid PNR returns 404 not found page.
	* Steps: 
		1. Navigate to the ticket page.
		2. Enter an invalid PNR.
	* Expected Result: A 404 not found page is displayed.
	* Severity: Medium
47. **TC47**: Accessing payment page directly without completing passengers redirects back.
	* Steps: 
		1. Navigate to the payment page directly.
	* Expected Result: The user is redirected back to the passenger form page.
	* Severity: High
48. **TC48**: Accessing confirm page directly without completing payment redirects back.
	* Steps: 
		1. Navigate to the confirm page directly.
	* Expected Result: The user is redirected back to the payment page.
	* Severity: High
49. **TC49**: Multi-city search with identical origin and destination is blocked.
	* Steps: 
		1. Navigate to the search page.
		2. Enter the same origin and destination for a multi-city search.
	* Expected Result: The search is blocked.
	* Severity: Medium
50. **TC50**: Booking with infant count exceeding adult count is blocked.
	* Steps: 
		1. Navigate to the booking page.
		2. Try to book with an infant count exceeding the adult count.
	* Expected Result: The booking is blocked.
	* Severity: Medium

# DELIVERABLE 2 - POSTMAN COLLECTION JSON

```json
{
  "info": {
    "_postman_id": "flyeasy-api-tests",
    "name": "FlyEasy API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Search Flights",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"origin\":\"DEL\",\"destination\":\"DXB\"}"
        },
        "url": {
          "raw": "https://api.flyeasy.com/api/flights/search",
          "protocol": "https",
          "host": [
            "api",
            "flyeasy",
            "com"
          ],
          "path": [
            "api",
            "flights",
            "search"
          ]
        }
      }
    },
    {
      "name": "Get Flight Offer",
      "request": {
        "method": "GET",
        "url": {
          "raw": "https://api.flyeasy.com/api/flights/offerId",
          "protocol": "https",
          "host": [
            "api",
            "flyeasy",
            "com"
          ],
          "path": [
            "api",
            "flights",
            "offerId"
          ]
        }
      }
    },
    {
      "name": "Create Booking",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"passengers\":[{\"name\":\"John Doe\",\"email\":\"john@example.com\"}]}"
        },
        "url": {
          "raw": "https://api.flyeasy.com/api/bookings/create",
          "protocol": "https",
          "host": [
            "api",
            "flyeasy",
            "com"
          ],
          "path": [
            "api",
            "bookings",
            "create"
          ]
        }
      }
    },
    {
      "name": "Initiate Payment",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body