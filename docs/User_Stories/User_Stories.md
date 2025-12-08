# User Stories

## Document Information

- **Document Version**: 1.0
- **Date**: 2024
- **Purpose**: Define user stories with acceptance criteria for the SG Routing Application

## Overview

This document contains user stories that describe the functionalities of the SG Routing Application from the user's perspective. Each user story includes acceptance criteria that define when the story is considered complete.

---

## User Story 1: Check Server Readiness

**As a** user  
**I want to** see if the routing server is ready  
**So that** I know when I can use the routing features

### Acceptance Criteria

1. The application displays the server status (Ready/Waiting) in the control panel
2. The status indicator updates automatically every 5 seconds
3. When the server is "ready", the status indicator shows green with a checkmark
4. When the server is "wait", the status indicator shows orange with a waiting icon
5. All routing-related buttons are disabled when the server is not ready
6. The status check does not block the UI or cause performance issues

---

## User Story 2: Select Travel Type

**As a** user  
**I want to** select different travel types (Car, Bicycle, Walk)  
**So that** I can get routes appropriate for my mode of transportation

### Acceptance Criteria

1. The control panel displays three travel type buttons: Car, Bicycle, and Walk
2. Each travel type button has a distinct icon (🚗, 🚲, 🚶)
3. Clicking a travel type button highlights it as active
4. When a travel type is selected, the application automatically updates the valid road types for routing
5. The active road types are displayed below the travel type buttons
6. Changing travel type clears any existing route on the map
7. The selected travel type persists during the session

### Road Type Configurations

- **Car**: primary, secondary, tertiary, trunk, motorway, residential, and their link variants
- **Bicycle**: cycleway, residential, primary, secondary, tertiary, path, footway
- **Walk**: footway, path, residential, pedestrian, steps

---

## User Story 3: Calculate Route Between Two Points

**As a** user  
**I want to** calculate and view the shortest route between a start point and end point  
**So that** I can navigate from one location to another in Singapore

### Acceptance Criteria

1. The control panel provides input fields for start point (longitude, latitude, description)
2. The control panel provides input fields for end point (longitude, latitude, description)
3. Default values are pre-filled for start and end points (Bedok 85 and Choa Chu Kang Road)
4. A "Plan Mode" feature allows users to click on the map to set start and end points
5. When entering plan mode, users are prompted to click on the map for the start point first
6. After selecting the start point, users are prompted to click on the map for the end point
7. After selecting both points in plan mode, the route is automatically calculated
8. A "Calculate Route" button is available for manual route calculation
9. When the button is clicked, the application sends a route request to the backend
10. The route is displayed on the map as a blue line
11. Start point is marked with a green marker on the map
12. End point is marked with a red marker on the map
13. The map automatically zooms to fit the route
14. If route calculation fails, an error message is displayed
15. The route calculation respects the currently selected travel type
16. The "Calculate Route" button is enabled when valid start and end points are set
17. Points selected via plan mode persist in the input fields after route calculation

---

## User Story 4: View Road Types on Map

**As a** user  
**I want to** view specific road types on the map  
**So that** I can understand the road network structure

### Acceptance Criteria

1. A dropdown list displays all available road types from the server
2. When a road type is selected, a "View on Map" button becomes enabled
3. Clicking "View on Map" fetches and displays the GeoJSON data for the selected road type
4. The road type is displayed on the map as gray lines
5. Multiple road types can be viewed sequentially (previous view is cleared when a new one is selected)
6. The road type visualization does not interfere with route display
7. If the road type fetch fails, an error message is displayed

---

## User Story 5: View All Blockages

**As a** user  
**I want to** see all blockages on the map  
**So that** I can be aware of areas to avoid

### Acceptance Criteria

1. Blockages are automatically loaded when the application starts
2. Blockages are displayed on the map as red circles/areas
3. A blockage list panel appears in the bottom-right corner of the map
4. The blockage list shows the name and description of each blockage
5. The blockage list displays the total count of blockages
6. Blockages are refreshed automatically when a new blockage is added or deleted
7. If no blockages exist, the list shows "No blockages found"

---

## User Story 6: Add New Blockage

**As a** user  
**I want to** add a new blockage to the system  
**So that** I can mark areas that should be avoided during routing

### Acceptance Criteria

1. The control panel provides input fields for:
   - Blockage name (required)
   - Description (optional)
   - Longitude
   - Latitude
   - Radius in meters
2. An "Add Blockage" button is available
3. The button is disabled if the blockage name is empty or the server is not ready
4. When the button is clicked, the blockage is sent to the backend
5. Upon successful addition, a success message is displayed
6. The blockage list is automatically refreshed to show the new blockage
7. The new blockage appears on the map immediately
8. If addition fails, an error message is displayed
9. Input fields are cleared after successful addition

---

## User Story 7: Delete Existing Blockage

**As a** user  
**I want to** delete a blockage from the system  
**So that** I can remove blockages that are no longer relevant

### Acceptance Criteria

1. Each blockage in the blockage list has a delete button (×)
2. Clicking the delete button shows a confirmation dialog
3. If confirmed, the blockage is deleted from the backend
4. Upon successful deletion, the blockage is removed from the list
5. The blockage is removed from the map display
6. The blockage list is automatically refreshed
7. If deletion fails, an error message is displayed
8. The confirmation dialog prevents accidental deletions

---

## User Story 8: Interactive Map Display

**As a** user  
**I want to** interact with an OpenStreetMap-based map  
**So that** I can visualize routes and geographic data

### Acceptance Criteria

1. The map displays OpenStreetMap tiles for Singapore
2. The map is centered on Singapore by default (approximately 1.3521°N, 103.8198°E)
3. The default zoom level is appropriate for viewing Singapore (zoom level 12)
4. Users can pan the map by dragging
5. Users can zoom in/out using mouse wheel or zoom controls
6. The map displays routes, blockages, road types, and markers correctly
7. Markers have appropriate icons (green for start, red for end)
8. The map is responsive and fills the available space
9. Map layers (routes, blockages, road types) can be displayed simultaneously
10. The map does not allow routing outside of Singapore boundaries

---

## User Story 9: Handle Server Errors Gracefully

**As a** user  
**I want to** receive clear error messages when operations fail  
**So that** I understand what went wrong and can take appropriate action

### Acceptance Criteria

1. When the server is unreachable, appropriate error messages are displayed
2. When route calculation fails, a user-friendly error message is shown
3. When blockage operations fail, specific error messages are displayed
4. Error messages do not use technical jargon
5. The application does not crash when errors occur
6. Users can retry failed operations
7. Loading states are shown during API calls
8. Buttons are disabled during loading to prevent duplicate requests

---

## User Story 10: Responsive User Interface

**As a** user  
**I want to** use an intuitive and responsive interface  
**So that** I can efficiently use all features of the application

### Acceptance Criteria

1. The control panel is clearly organized with sections for different features
2. The control panel has a modern gradient header with the application title
3. The control panel can be collapsed to the left, showing only a floating expand button
4. When collapsed, the map expands to fill the entire screen with no borders or gaps
5. A floating expand button (▶) appears in the top-left when the panel is collapsed
6. Input fields have appropriate labels and placeholders
7. Buttons have clear, descriptive text with modern gradient styling
8. The UI provides visual feedback for user actions (hover states, active states, smooth animations)
9. Loading states are indicated with disabled buttons or loading indicators
10. The layout uses modern card-based design with shadows and rounded corners
11. Colors use a consistent purple gradient theme (#667eea to #764ba2)
12. The interface is responsive and works on different screen sizes
13. The map and control panel are properly sized and do not overlap incorrectly
14. Smooth transitions and animations enhance the user experience
15. Custom scrollbars with gradient styling match the theme

---

## User Story 11: View Active Road Types

**As a** user  
**I want to** see which road types are currently active for routing  
**So that** I understand how my travel type selection affects routing

### Acceptance Criteria

1. After selecting a travel type, the active road types are displayed
2. The road types are shown as a comma-separated list
3. The display updates automatically when travel type changes
4. The information is clearly visible but not intrusive
5. The road types match the configuration for the selected travel type

---

## User Story 12: Persistent Session State

**As a** user  
**I want to** have my selections persist during the session  
**So that** I don't have to reconfigure settings repeatedly

### Acceptance Criteria

1. The selected travel type persists until changed
2. Start and end point inputs retain their values until manually changed
3. The map view (zoom, pan) persists during interactions
4. Blockage list state is maintained
5. Road type selection persists until changed

---

## User Story 13: Plan Mode for Route Selection

**As a** user  
**I want to** select start and end points by clicking on the map  
**So that** I can quickly plan routes without manually entering coordinates

### Acceptance Criteria

1. A "Plan Mode" button is available in the Route Planning section
2. Clicking "Enter Plan Mode" activates plan mode and shows instructions
3. When in plan mode, the button text changes to indicate the current step
4. Users are first prompted to click on the map for the START point
5. After clicking for start point, users are prompted to click for the END point
6. The selected coordinates are automatically filled into the input fields
7. After selecting both points, the route is automatically calculated
8. Plan mode can be cancelled by clicking the button again
9. Visual feedback (hints) guides users through the process
10. The selected points persist after route calculation

## Summary

The application provides the following core functionalities:

1. ✅ Server status monitoring with automatic updates
2. ✅ Travel type selection with automatic road type configuration
3. ✅ Route calculation and visualization with plan mode
4. ✅ Interactive map-based point selection (plan mode)
5. ✅ Automatic route calculation after selecting both points
6. ✅ Road type visualization with improved visibility
7. ✅ Blockage management (view, add, delete) with minimize feature
8. ✅ Interactive map with OpenStreetMap and auto-resize
9. ✅ Collapsible control panel for more map space
10. ✅ Minimizable blockage list
11. ✅ Error handling and user feedback
12. ✅ Modern, responsive UI with gradient theme
13. ✅ Smooth animations and transitions

All user stories are implemented with their respective acceptance criteria met.

---

**Document End**

