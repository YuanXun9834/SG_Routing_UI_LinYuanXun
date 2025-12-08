# Test Procedures

## Document Information

- **Document Version**: 1.0
- **Date**: 2024
- **Purpose**: Document the testing procedures for the SG Routing Application

## Overview

This document describes the test procedures for validating that all user stories and their acceptance criteria are met. Each test procedure corresponds to one or more user stories and includes step-by-step instructions, expected results, and pass/fail criteria.

## Test Environment Setup

### Prerequisites

1. Node.js (v18 or higher) installed
2. npm or yarn package manager
3. Modern web browser (Chrome, Firefox, Edge, or Safari)
4. Internet connection (for accessing backend APIs and OpenStreetMap tiles)
5. Backend server should be accessible

### Installation Steps

1. Clone the repository
2. Navigate to the project directory
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the development server
5. Open the application in a web browser (typically `http://localhost:5173`)

### External Tools Used

- **Postman**: For API testing and validation
  - Download: https://www.postman.com/downloads/
- **GeoJSON Viewer**: For validating GeoJSON responses
  - Online tool: http://geojson.io
  - Alternative: https://geojson.tools

---

## Test Procedure 1: Server Readiness Check

**Related User Story**: User Story 1 - Check Server Readiness

### Test Steps

1. **Start the application**
   - Open the application in a web browser
   - Wait for the page to load completely

2. **Observe server status**
   - Locate the "Server Status" section in the control panel
   - Check the status indicator

3. **Verify status display**
   - If server is ready: Status should show "✓ Ready" with green background
   - If server is waiting: Status should show "⏳ Waiting..." with orange background

4. **Wait for status update**
   - Wait 5-10 seconds
   - Observe if the status updates automatically

5. **Check button states**
   - Verify that routing-related buttons are disabled when status is "Waiting"
   - Verify that buttons are enabled when status is "Ready"

### Expected Results

- ✅ Server status is displayed in the control panel
- ✅ Status updates automatically every 5 seconds
- ✅ Green indicator with checkmark when ready
- ✅ Orange indicator when waiting
- ✅ Buttons are disabled when server is not ready
- ✅ No UI freezing or performance issues

### Pass/Fail Criteria

**PASS**: All expected results are met  
**FAIL**: Any expected result is not met

### Screenshots/Evidence

- Screenshot of "Ready" status
- Screenshot of "Waiting" status
- Screenshot showing disabled buttons when server is not ready

---

## Test Procedure 2: Travel Type Selection

**Related User Story**: User Story 2 - Select Travel Type

### Test Steps

1. **Locate travel type buttons**
   - Find the "Travel Type" section in the control panel
   - Verify three buttons are visible: 🚗 Car, 🚲 Bicycle, 🚶 Walk

2. **Test Car selection**
   - Click the "🚗 Car" button
   - Verify the button is highlighted/active
   - Check the "Active road types" display below
   - Verify road types include: primary, secondary, tertiary, trunk, motorway, residential, and link variants

3. **Test Bicycle selection**
   - Click the "🚲 Bicycle" button
   - Verify the button is highlighted/active
   - Check the "Active road types" display
   - Verify road types include: cycleway, residential, primary, secondary, tertiary, path, footway

4. **Test Walk selection**
   - Click the "🚶 Walk" button
   - Verify the button is highlighted/active
   - Check the "Active road types" display
   - Verify road types include: footway, path, residential, pedestrian, steps

5. **Test route clearing**
   - If a route is displayed on the map, change travel type
   - Verify the route is cleared from the map

### Expected Results

- ✅ Three travel type buttons are visible with appropriate icons
- ✅ Clicking a button highlights it as active
- ✅ Road types update automatically when travel type changes
- ✅ Road types match the configuration for each travel type
- ✅ Existing routes are cleared when travel type changes

### Pass/Fail Criteria

**PASS**: All expected results are met  
**FAIL**: Any expected result is not met

### Screenshots/Evidence

- Screenshot of travel type buttons
- Screenshot showing active road types for each travel type

---

## Test Procedure 3: Route Calculation

**Related User Story**: User Story 3 - Calculate Route Between Two Points

### Test Steps

1. **Test Plan Mode (Recommended Method)**
   - Locate the "🗺️ Route Planning" section
   - Click "📍 Enter Plan Mode" button
   - Verify the button text changes to "📍 Click on map for START point"
   - Verify a hint message appears: "Click anywhere on the map to set the start point"
   - Click anywhere on the map
   - Verify the start point coordinates are automatically filled in the input fields
   - Verify the button text changes to "📍 Click on map for END point"
   - Verify the hint message changes: "Click anywhere on the map to set the end point"
   - Click anywhere on the map again
   - Verify the end point coordinates are automatically filled in
   - Verify the route is automatically calculated and displayed
   - Verify plan mode exits automatically (button returns to "📍 Enter Plan Mode")
   - Verify the selected coordinates remain in the input fields after route calculation

2. **Test Manual Entry Method**
   - Locate the input fields for start and end points
   - Verify start point fields: Longitude, Latitude, Description
   - Verify end point fields: Longitude, Latitude, Description
   - Check that default values are pre-filled (Bedok 85 and Choa Chu Kang Road)
   - Ensure server status is "Ready"
   - Click "Calculate Route" button
   - Wait for the route to be calculated

3. **Verify route display**
   - Check that a blue line appears on the map representing the route
   - Verify a green marker appears at the start point
   - Verify a red marker appears at the end point
   - Check that the map automatically zooms to fit the route

4. **Test with custom coordinates**
   - Enter new coordinates for start point (e.g., 103.8500, 1.3000)
   - Enter new coordinates for end point (e.g., 103.8000, 1.3500)
   - Click "Calculate Route"
   - Verify the route updates with new points

5. **Test error handling**
   - Enter invalid coordinates (outside Singapore, e.g., 0, 0)
   - Click "Calculate Route"
   - Verify an error message is displayed
   - Verify the application does not crash

6. **Test with different travel types**
   - Select "Bicycle" travel type
   - Use plan mode to calculate a route
   - Verify the route may differ from the car route
   - Select "Walk" travel type
   - Calculate the same route
   - Verify the route may differ again

### Expected Results

- ✅ Plan mode button is present and functional
- ✅ Plan mode guides users through selecting start and end points
- ✅ Coordinates are automatically filled when clicking on the map
- ✅ Route is automatically calculated after selecting both points
- ✅ Input fields are present and functional
- ✅ Default values are pre-filled
- ✅ Route is displayed as a blue line on the map
- ✅ Start point marked with green marker
- ✅ End point marked with red marker
- ✅ Map auto-zooms to fit route
- ✅ Route calculation works with custom coordinates
- ✅ Selected points persist after route calculation (do not reset to defaults)
- ✅ Error messages are displayed for invalid inputs
- ✅ Route differs based on travel type selection

### Pass/Fail Criteria

**PASS**: All expected results are met  
**FAIL**: Any expected result is not met

### Screenshots/Evidence

- Screenshot of route displayed on map
- Screenshot showing start and end markers
- Screenshot of error message for invalid coordinates
- Screenshot comparing routes for different travel types

---

## Test Procedure 4: View Road Types

**Related User Story**: User Story 4 - View Road Types on Map

### Test Steps

1. **Locate road type selector**
   - Find the "View Road Types" section in the control panel
   - Verify a dropdown list is present

2. **Load road types**
   - Wait for the dropdown to populate with road types
   - Verify multiple road types are available (e.g., primary, secondary, motorway, etc.)

3. **Select and view a road type**
   - Select "motorway" from the dropdown
   - Click "View on Map" button
   - Wait for the road type to load

4. **Verify display**
   - Check that gray lines appear on the map representing the selected road type
   - Verify the lines are visible and correctly positioned

5. **Test multiple selections**
   - Select a different road type (e.g., "primary")
   - Click "View on Map"
   - Verify the previous road type is cleared and the new one is displayed

6. **Test with route displayed**
   - Calculate a route first
   - Then view a road type
   - Verify both the route and road type are visible simultaneously

### Expected Results

- ✅ Dropdown list displays all available road types
- ✅ "View on Map" button is enabled when a road type is selected
- ✅ Selected road type is displayed as gray lines on the map
- ✅ Previous road type view is cleared when a new one is selected
- ✅ Road type visualization does not interfere with route display

### Pass/Fail Criteria

**PASS**: All expected results are met  
**FAIL**: Any expected result is not met

### Screenshots/Evidence

- Screenshot of road type dropdown
- Screenshot showing a road type displayed on the map
- Screenshot showing route and road type displayed together

---

## Test Procedure 5: View Blockages

**Related User Story**: User Story 5 - View All Blockages

### Test Steps

1. **Check automatic loading**
   - Start the application
   - Wait for the page to load completely
   - Verify blockages are loaded automatically

2. **Locate blockage list**
   - Find the blockage list panel in the bottom-right corner of the map
   - Verify it displays "🚧 Blockages" with a count in the header

3. **Test minimize feature**
   - Click the ▼ button in the blockage list header
   - Verify the list collapses to show only the header (approximately 56px tall)
   - Verify the button changes to ▲
   - Click the ▲ button to expand
   - Verify the full list is displayed again

4. **Verify blockage display on map**
   - Check if any blockages are displayed on the map as red circles/areas
   - Verify the blockages are visible and correctly positioned

5. **Verify blockage list content**
   - Check the blockage list panel
   - If blockages exist, verify each shows:
     - Blockage name
     - Description (if available)
   - If no blockages exist, verify "No blockages found" message with icon

6. **Test refresh after addition**
   - Add a new blockage (see Test Procedure 6)
   - Verify the blockage list updates automatically
   - Verify the new blockage appears on the map

### Expected Results

- ✅ Blockages are automatically loaded on application start
- ✅ Blockages are displayed on the map as red circles/areas
- ✅ Blockage list panel is visible in the bottom-right corner
- ✅ Blockage list can be minimized and expanded
- ✅ Minimize button (▼/▲) is functional
- ✅ Blockage list shows names and descriptions
- ✅ Blockage count is displayed in the header
- ✅ "No blockages found" message appears when no blockages exist
- ✅ List updates automatically when blockages are added/deleted
- ✅ Compact design with modern styling

### Pass/Fail Criteria

**PASS**: All expected results are met  
**FAIL**: Any expected result is not met

### Screenshots/Evidence

- Screenshot of blockage list panel
- Screenshot showing blockages on the map
- Screenshot of "No blockages found" message

---

## Test Procedure 6: Add Blockage

**Related User Story**: User Story 6 - Add New Blockage

### Test Steps

1. **Locate blockage input fields**
   - Find the "Blockage Management" section in the control panel
   - Verify input fields for:
     - Blockage Name
     - Description
     - Longitude
     - Latitude
     - Radius (meters)

2. **Test with valid data**
   - Enter a blockage name: "Test Blockage 1"
   - Enter a description: "Test description"
   - Enter coordinates: Longitude 103.8198, Latitude 1.3521
   - Enter radius: 200
   - Ensure server status is "Ready"
   - Click "Add Blockage" button

3. **Verify success**
   - Check for a success message
   - Verify the blockage appears in the blockage list
   - Verify the blockage appears on the map as a red circle
   - Verify input fields are cleared

4. **Test validation**
   - Leave blockage name empty
   - Try to click "Add Blockage"
   - Verify the button is disabled or an error message appears

5. **Test error handling**
   - Enter invalid data or use a duplicate name
   - Click "Add Blockage"
   - Verify an error message is displayed
   - Verify the application does not crash

### Expected Results

- ✅ All input fields are present and functional
- ✅ Blockage is successfully added with valid data
- ✅ Success message is displayed
- ✅ Blockage appears in the list and on the map
- ✅ Input fields are cleared after successful addition
- ✅ Validation prevents adding blockages with empty names
- ✅ Error messages are displayed for failures

### Pass/Fail Criteria

**PASS**: All expected results are met  
**FAIL**: Any expected result is not met

### Screenshots/Evidence

- Screenshot of blockage input form
- Screenshot of success message
- Screenshot showing new blockage in the list and on the map
- Screenshot of validation error

---

## Test Procedure 7: Delete Blockage

**Related User Story**: User Story 7 - Delete Existing Blockage

### Test Steps

1. **Locate blockage list**
   - Ensure at least one blockage exists (add one if needed)
   - Find the blockage list panel in the bottom-right corner

2. **Identify delete button**
   - Locate a blockage in the list
   - Verify a delete button (×) is present for each blockage
   - Verify the delete button has a red gradient background

3. **Test deletion with confirmation**
   - Click the delete button for a blockage
   - Verify a confirmation dialog appears
   - Click "Cancel" in the dialog
   - Verify the blockage is not deleted

4. **Test deletion confirmation**
   - Click the delete button again
   - Click "OK" or "Confirm" in the dialog
   - Wait for deletion to complete

5. **Verify deletion**
   - Check that the blockage is removed from the list
   - Check that the blockage is removed from the map
   - Verify the blockage count updates
   - Verify no error messages appear if deletion succeeds (even with network issues)

6. **Test error handling**
   - Try to delete a blockage that doesn't exist (if possible)
   - Verify appropriate error messages are displayed for real failures
   - Verify the application handles network errors gracefully

### Expected Results

- ✅ Delete button is present for each blockage
- ✅ Confirmation dialog appears before deletion
- ✅ Blockage is deleted when confirmed
- ✅ Blockage is removed from both list and map
- ✅ Blockage list updates automatically
- ✅ Error messages are displayed for failed deletions

### Pass/Fail Criteria

**PASS**: All expected results are met  
**FAIL**: Any expected result is not met

### Screenshots/Evidence

- Screenshot of delete button in blockage list
- Screenshot of confirmation dialog
- Screenshot showing blockage removed from list and map

---

## Test Procedure 8: Map Interaction

**Related User Story**: User Story 8 - Interactive Map Display

### Test Steps

1. **Verify map display**
   - Check that OpenStreetMap tiles are displayed
   - Verify the map is centered on Singapore
   - Check the default zoom level

2. **Test panning**
   - Click and drag the map
   - Verify the map moves smoothly
   - Verify map tiles load correctly while panning

3. **Test zooming**
   - Use mouse wheel to zoom in
   - Use mouse wheel to zoom out
   - Verify zoom controls work (if present)
   - Verify map tiles load at different zoom levels

4. **Test map layers**
   - Calculate a route
   - View a road type
   - Add a blockage
   - Verify all layers are visible simultaneously
   - Verify layers do not overlap incorrectly

5. **Test markers**
   - Calculate a route
   - Verify start marker is green
   - Verify end marker is red
   - Verify markers have popups when clicked

6. **Test responsiveness**
   - Resize the browser window
   - Verify the map adjusts to the new size
   - Verify the map remains functional

### Expected Results

- ✅ OpenStreetMap tiles are displayed correctly
- ✅ Map is centered on Singapore
- ✅ Default zoom level is appropriate
- ✅ Panning works smoothly
- ✅ Zooming works with mouse wheel and controls
- ✅ Multiple layers can be displayed simultaneously
- ✅ Markers are correctly colored and functional
- ✅ Map is responsive to window resizing

### Pass/Fail Criteria

**PASS**: All expected results are met  
**FAIL**: Any expected result is not met

### Screenshots/Evidence

- Screenshot of map with OpenStreetMap tiles
- Screenshot showing multiple layers (route, blockage, road type)
- Screenshot of markers with popups

---

## Test Procedure 9: Error Handling

**Related User Story**: User Story 9 - Handle Server Errors Gracefully

### Test Steps

1. **Test server unreachable**
   - Disconnect from the internet (or block API access)
   - Try to calculate a route
   - Verify an appropriate error message is displayed
   - Verify the application does not crash

2. **Test invalid route calculation**
   - Enter coordinates outside Singapore (e.g., 0, 0)
   - Click "Calculate Route"
   - Verify a user-friendly error message is displayed

3. **Test blockage operation errors**
   - Try to add a blockage with invalid data
   - Verify specific error messages are displayed
   - Try to delete a non-existent blockage
   - Verify appropriate error handling

4. **Test loading states**
   - Perform operations that require API calls
   - Verify buttons are disabled during loading
   - Verify loading indicators are shown (if present)

5. **Test retry capability**
   - After an error, verify users can retry the operation
   - Verify the application state is recoverable

### Expected Results

- ✅ Error messages are user-friendly and clear
- ✅ Application does not crash on errors
- ✅ Users can retry failed operations
- ✅ Loading states are indicated
- ✅ Buttons are disabled during loading

### Pass/Fail Criteria

**PASS**: All expected results are met  
**FAIL**: Any expected result is not met

### Screenshots/Evidence

- Screenshot of error message for server unreachable
- Screenshot of error message for invalid route
- Screenshot showing disabled buttons during loading

---

## Test Procedure 10: User Interface

**Related User Story**: User Story 10 - Responsive User Interface

### Test Steps

1. **Verify layout**
   - Check that the control panel is on the left side
   - Check that the map fills the remaining space
   - Verify sections are clearly organized

2. **Test input fields**
   - Verify all input fields have labels
   - Verify placeholders are helpful
   - Test that inputs accept appropriate data types

3. **Test buttons**
   - Verify buttons have clear, descriptive text with gradient styling
   - Check hover states with scale and shadow effects
   - Verify active states for travel type buttons
   - Check disabled states with reduced opacity
   - Verify smooth transitions on all interactions

4. **Test color consistency and theme**
   - Verify primary actions use purple gradient theme (#667eea to #764ba2)
   - Verify blockages use red gradient colors
   - Verify status indicators use appropriate colors (green for ready, orange for waiting)
   - Verify consistent gradient usage throughout the UI

5. **Test responsiveness**
   - Resize the browser window
   - Verify the layout adjusts appropriately
   - Verify all features remain accessible
   - Verify the map resizes correctly when window size changes

6. **Test visual feedback**
   - Interact with buttons and inputs
   - Verify visual feedback is provided (hover, focus, active states)
   - Verify smooth animations and transitions
   - Verify the UI is not cluttered
   - Verify custom scrollbars with gradient styling

### Expected Results

- ✅ Layout is clean and organized with modern card-based design
- ✅ Control panel can be collapsed and expanded smoothly
- ✅ Map automatically resizes when panel collapses/expands
- ✅ Input fields have labels, placeholders, and gradient focus states
- ✅ Buttons have clear text, gradient styling, and visual feedback
- ✅ Colors use consistent purple gradient theme
- ✅ UI is responsive to window resizing
- ✅ Smooth animations and transitions enhance user experience
- ✅ Custom scrollbars match the theme

### Pass/Fail Criteria

**PASS**: All expected results are met  
**FAIL**: Any expected result is not met

### Screenshots/Evidence

- Screenshot of the full application interface
- Screenshot showing button hover states
- Screenshot of responsive layout at different sizes

---

## Test Summary

### Test Execution Log

| Test ID | Test Procedure | Status | Date | Notes |
|---------|---------------|--------|------|-------|
| TP-1 | Server Readiness Check | ⬜ | | |
| TP-2 | Travel Type Selection | ⬜ | | |
| TP-3 | Route Calculation | ⬜ | | |
| TP-4 | View Road Types | ⬜ | | |
| TP-5 | View Blockages | ⬜ | | |
| TP-6 | Add Blockage | ⬜ | | |
| TP-7 | Delete Blockage | ⬜ | | |
| TP-8 | Map Interaction | ⬜ | | |
| TP-9 | Error Handling | ⬜ | | |
| TP-10 | User Interface | ⬜ | | |

### Overall Test Result

- **Total Tests**: 10
- **Passed**: ___
- **Failed**: ___
- **Not Executed**: ___

### Notes

- All tests should be executed in a controlled environment
- Screenshots and evidence should be collected for each test
- Any deviations from expected results should be documented
- Retest any failed tests after fixes are applied

---

## AI Tools and External Resources Used

### AI Tools
- **Cursor AI**: Used for code generation and assistance during development
- **GitHub Copilot**: Used for code suggestions and autocompletion

### External Tools
- **Postman**: https://www.postman.com/downloads/ - For API testing
- **GeoJSON.io**: http://geojson.io - For viewing and validating GeoJSON data
- **GeoJSON.tools**: https://geojson.tools - Alternative GeoJSON viewer

### Documentation References
- **OpenStreetMap**: https://www.openstreetmap.org
- **Leaflet Documentation**: https://leafletjs.com
- **React Documentation**: https://react.dev
- **GeoJSON Specification**: https://geojson.org

---

**Document End**

