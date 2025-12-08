# SG Routing UI Application

A web-based routing application for Singapore roads using OpenStreetMap data. This application provides route calculation, visualization, and blockage management features similar to Google Maps.

## Features

- 🗺️ Interactive map using OpenStreetMap tiles with auto-resize
- 🚗 Multiple travel types (Car, Bicycle, Walk) with automatic road type filtering
- 🧭 Route calculation and visualization between two points
- 📍 Plan Mode: Click on map to set start and end points (automatic route calculation)
- 🚧 Blockage management (view, add, delete) with minimize feature
- 🛣️ Road type visualization with improved styling
- 📊 Real-time server status monitoring
- 🎨 Modern UI with gradient theme and smooth animations
- 📱 Collapsible side panel for more map space
- 🔄 Automatic map resizing when panel collapses

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Leaflet** - Map library
- **React-Leaflet** - React bindings for Leaflet
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SG_Routing_UI_LinYuanXun
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Project Structure

```
SG_Routing_UI_LinYuanXun/
├── docs/                          # Documentation
│   ├── Software_Interface_Agreement/
│   ├── User_Stories/
│   ├── Test_Procedures/
│   └── Software_Design_Description/
├── src/
│   ├── components/                # React components
│   │   ├── Map.tsx
│   │   ├── ControlPanel.tsx
│   │   ├── ControlPanel.css
│   │   ├── BlockageList.tsx
│   │   └── BlockageList.css
│   ├── services/                  # API services
│   │   └── api.ts
│   ├── config/                    # Configuration
│   │   └── roadTypes.ts
│   ├── types/                     # TypeScript types
│   │   └── index.ts
│   ├── App.tsx                    # Main app component
│   ├── App.css
│   ├── main.tsx                   # Entry point
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Usage

### Calculate a Route

**Method 1: Plan Mode (Recommended)**
1. Ensure the server status shows "✓ Ready"
2. Select a travel type (Car, Bicycle, or Walk)
3. Click "📍 Enter Plan Mode" button
4. Click anywhere on the map to set the START point
5. Click anywhere on the map to set the END point
6. The route is automatically calculated and displayed

**Method 2: Manual Entry**
1. Ensure the server status shows "✓ Ready"
2. Select a travel type (Car, Bicycle, or Walk)
3. Enter start and end point coordinates in the input fields (or use defaults)
4. Click "Calculate Route"
5. The route will be displayed on the map as a blue line

### View Road Types

1. Select a road type from the dropdown
2. Click "View on Map"
3. The selected road type will be displayed as gray lines

### Manage Blockages

**Add a Blockage:**
1. Enter blockage name, description, location (longitude, latitude), and radius
2. Click "Add Blockage"
3. The blockage will appear on the map and in the blockage list

**Delete a Blockage:**
1. Find the blockage in the blockage list (bottom-right corner)
2. Click the × button next to the blockage
3. Confirm deletion
4. The blockage will be removed from the map and list

**Minimize Blockage List:**
1. Click the ▼ button in the blockage list header to minimize
2. Click the ▲ button to expand the list again

### Collapse Control Panel

1. Click the ◀ button in the control panel header to collapse
2. The panel collapses to the left, giving more space for the map
3. Click the ▶ button (floating in top-left) to expand the panel again
4. The map automatically resizes to fill the available space

## API Endpoints

The application uses the following backend APIs:

- **Server Readiness**: `GET /ready`
- **All Road Types**: `GET /allAxisTypes`
- **Valid Road Types**: `GET /validAxisTypes`
- **Road Type GeoJSON**: `GET /axisType/{roadType}`
- **Change Valid Road Types**: `POST /changeValidRoadTypes`
- **Calculate Route**: `POST /route`
- **Get Blockages**: `GET /blockage`
- **Add Blockage**: `POST /blockage`
- **Delete Blockage**: `DELETE /blockage/{name}`

See `docs/Software_Interface_Agreement/Software_Interface_Agreement.md` for detailed API documentation.

## Documentation

All project documentation is located in the `docs/` folder:

- **Software Interface Agreement**: API documentation and interface specifications
- **User Stories**: Feature descriptions with acceptance criteria
- **Test Procedures**: Testing instructions and procedures
- **Software Design Description**: Architecture and design documentation

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Notes

- The application is designed for Singapore roads only
- The backend server may require a cold start (check server status)
- All coordinates should be within Singapore boundaries
- Road types are automatically configured based on travel type selection

## License

This project is for educational purposes.
