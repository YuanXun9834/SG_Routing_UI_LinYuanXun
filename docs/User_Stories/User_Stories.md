# User Stories

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
5. A manual "🔄 Check" button is available next to the status indicator
6. Clicking the check button manually triggers a server status check
7. When the server becomes ready after manual check, road types are automatically reloaded
8. All routing-related buttons are disabled when the server is not ready
9. The status check does not block the UI or cause performance issues
10. Routes can still be calculated even when server status shows "waiting"

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
4. A location search field is available for both start and end points using OpenStreetMap geocoding
5. Users can search for locations by name (e.g., "Marina Bay", "Orchard Road", "Changi Airport")
6. Search results appear in a dropdown with full address and location type
7. Selecting a search result automatically fills coordinates and description
8. Manual coordinate entry is still available below the search field
9. A "Plan Mode" feature allows users to click on the map to set start and end points
10. When entering plan mode, users are prompted to click on the map for the start point first
11. After selecting the start point, users are prompted to click on the map for the end point
12. After selecting both points in plan mode, the route is automatically calculated
13. A "Calculate Route" button is available for manual route calculation
14. When the button is clicked, the application sends a route request to the backend
15. The route is displayed on the map as a blue line
16. Start point is marked with a green marker on the map
17. End point is marked with a red marker on the map
18. The map automatically zooms to fit the route
19. If route calculation fails, an error message is displayed
20. The route calculation respects the currently selected travel type
21. The "Calculate Route" button is enabled when valid start and end points are set
22. Points selected via plan mode or search persist in the input fields after route calculation

---

## User Story 4: View Road Types on Map

**As a** user  
**I want to** view specific road types on the map  
**So that** I can understand the road network structure

### Acceptance Criteria

1. A dropdown list displays all available road types from the server
2. When a road type is selected, a "View on Map" button becomes enabled
3. Clicking "View on Map" fetches and displays the GeoJSON data for the selected road type
4. The road type is displayed on the map as darker gray lines (weight 3, opacity 0.7)
5. The map automatically zooms to fit the displayed road type data
6. A "✕ Clear Road Types" button appears at the top-right of the map when road types are displayed
7. Clicking the clear button removes the highlighted road types from the map
8. Multiple road types can be viewed sequentially (previous view is cleared when a new one is selected)
9. The road type visualization does not interfere with route display
10. If the road type fetch fails, an error message is displayed

---

## User Story 5: View All Blockages

**As a** user  
**I want to** see all blockages on the map  
**So that** I can be aware of areas to avoid

### Acceptance Criteria

1. Blockages are automatically loaded when the application starts
2. Blockages are displayed on the map as orange circles/areas with orange markers
3. Blockage markers are distinct from route markers (orange vs green/red)
4. A blockage list panel appears in the bottom-right corner of the map
5. The blockage list shows the name and description of each blockage
6. The blockage list displays the total count of blockages
7. The blockage list can be minimized to show only the header
8. When minimized, clicking the expand button (▲) restores the full list
9. Blockages are refreshed automatically when a new blockage is added or deleted
10. If no blockages exist, the list shows "No blockages found"
11. The blockage list has a compact, modern design with smooth animations

---

## User Story 6: Add New Blockage

**As a** user  
**I want to** add a new blockage to the system  
**So that** I can mark areas that should be avoided during routing

### Acceptance Criteria

1. A location search field is available in the Blockage Management section
2. Users can search for blockage locations by name using OpenStreetMap geocoding
3. Search results appear in a dropdown with full address and location type
4. Selecting a search result automatically sets the blockage location coordinates
5. A "📍 Choose Location on Map" button is available as an alternative to search
6. Clicking the button activates location selection mode
7. A yellow prompt appears: "📍 Click on the map to choose blockage location"
8. Users click anywhere on the map to select the blockage location
9. After selecting location (via search or map click), a green confirmation shows the selected coordinates
10. Input fields appear for:
    - Blockage name (required)
    - Description (optional)
    - Radius in meters (default: 200)
11. An "Add Blockage" button becomes available after location is selected
12. The button is disabled if the blockage name is empty or the server is not ready
13. When the button is clicked, the blockage is sent to the backend
14. Upon successful addition, a success message is displayed
15. The blockage list is automatically refreshed to show the new blockage
16. The new blockage appears on the map immediately with an orange marker
17. If addition fails, an error message is displayed
18. Input fields are cleared after successful addition
19. Location selection can be cancelled by clicking the button again

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

## User Story 8: View Active Road Types

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

## User Story 9: Plan Mode for Route Selection

**As a** user  
**I want to** select start and end points by clicking on the map  
**So that** I can quickly plan routes without manually entering coordinates

### Acceptance Criteria

1. A "📍 Enter Plan Mode" button is available in the Route Planning section
2. Clicking the button activates plan mode and shows a hint message
3. When in plan mode, the button text changes to "📍 Click on map for START point"
4. Users are prompted with a hint: "Click anywhere on the map to set the start point"
5. After clicking for start point, coordinates are automatically filled in input fields
6. The button text changes to "📍 Click on map for END point"
7. Users are prompted with a hint: "Click anywhere on the map to set the end point"
8. After clicking for end point, coordinates are automatically filled in
9. The route is automatically calculated after selecting both points
10. Plan mode exits automatically after route calculation
11. The selected points persist in input fields after route calculation
12. Plan mode can be cancelled by clicking the button again
13. Visual feedback (hints) guides users through the process

---

## User Story 10: Clear Route and Road Type Visualizations

**As a** user  
**I want to** clear displayed routes and road types from the map  
**So that** I can remove visualizations when they're no longer needed

### Acceptance Criteria

1. When a route is displayed, a "✕ Clear Route" button appears at the top-right of the map
2. Clicking the clear route button removes the route line, start marker, and end marker from the map
3. When road types are displayed, a "✕ Clear Road Types" button appears at the top-right
4. If both route and road types are displayed, buttons are stacked vertically
5. Clicking the clear road types button removes the highlighted roads from the map
6. Buttons disappear after clearing their respective visualizations
7. Clear buttons have consistent styling with gradient theme and hover effects
8. The map remains functional after clearing visualizations

---

## User Story 11: Search Locations by Name

**As a** user  
**I want to** search for locations by name when planning routes or adding blockages  
**So that** I can quickly find and select locations without manually entering coordinates

### Acceptance Criteria

1. A location search field is available for start point, end point, and blockage location
2. Users can type location names (e.g., "Marina Bay", "Orchard Road", "Changi Airport")
3. Search uses OpenStreetMap geocoding service (Nominatim) restricted to Singapore
4. Search results appear in a dropdown list after typing at least 2 characters
5. Each search result displays the full address and location type
6. Users can navigate results using keyboard arrow keys
7. Selecting a result (click or Enter key) automatically fills coordinates and description
8. Search is debounced to avoid excessive API calls (300ms delay)
9. A loading indicator appears while searching
10. Manual coordinate entry remains available below the search field
11. Search respects rate limits (1 request per second) to comply with service policies
12. If no results are found, a "No locations found" message is displayed
13. The dropdown closes when clicking outside or pressing Escape
14. Selected location description is saved and displayed

## Summary

The application provides the following core functionalities:

1. ✅ Server status monitoring with automatic updates and manual check button
2. ✅ Travel type selection with automatic road type configuration
3. ✅ Route calculation and visualization with plan mode
4. ✅ Location search by name for start/end points and blockages (OpenStreetMap geocoding)
5. ✅ Interactive map-based point selection (plan mode)
6. ✅ Automatic route calculation after selecting both points
7. ✅ Clear route button to remove route visualization
8. ✅ Road type visualization with improved visibility and auto-zoom
9. ✅ Clear road types button to remove highlighted roads
10. ✅ Blockage management (view, add, delete) with minimize feature
11. ✅ Map-click and search-based location selection for blockages
12. ✅ View active road types for selected travel mode

All user stories are implemented with their respective acceptance criteria met.

