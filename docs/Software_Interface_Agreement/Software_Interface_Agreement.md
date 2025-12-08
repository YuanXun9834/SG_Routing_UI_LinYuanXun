# Software Interface Agreement

## Overview

This document describes the API endpoints provided by the backend routing service. The backend service provides routing functionality for Singapore roads using OpenStreetMap data, including route calculation, road type management, and blockage management.

## Base URLs

- **Routing Service**: `https://routing-web-service-ityenzhnyq-an.a.run.app`
- **Bus Routing Service**: `https://nyc-bus-routing-k3q4yvzczq-an.a.run.app`

## API Endpoints

### 1. Server Readiness Check

**Purpose**: Check if the server is ready to handle requests. The server requires a cold start and may not be immediately available.

**Endpoint**: `GET /ready`

**Base URL**: `https://routing-web-service-ityenzhnyq-an.a.run.app`

**Request**:
```
GET /ready
```

**Response**:
- **Status Code**: 200 OK
- **Content-Type**: text/plain
- **Body**: 
  - `"ready"` - Server is ready to handle requests
  - `"wait"` - Server is still initializing

**Example**:
```bash
curl https://routing-web-service-ityenzhnyq-an.a.run.app/ready
```

**Response Example**:
```
ready
```

---

### 2. Get All Available Road Types

**Purpose**: Retrieve a list of all road types available in the system.

**Endpoint**: `GET /allAxisTypes`

**Base URL**: `https://nyc-bus-routing-k3q4yvzczq-an.a.run.app`

**Request**:
```
GET /allAxisTypes
```

**Response**:
- **Status Code**: 200 OK
- **Content-Type**: application/json
- **Body**: Array of strings representing road types

**Example**:
```bash
curl https://nyc-bus-routing-k3q4yvzczq-an.a.run.app/allAxisTypes
```

**Response Example**:
```json
[
  "primary",
  "secondary",
  "tertiary",
  "trunk",
  "motorway",
  "residential",
  "cycleway",
  "footway",
  "path",
  "primary_link",
  "secondary_link",
  "tertiary_link",
  "motorway_link",
  "trunk_link"
]
```

---

### 3. Get Valid Road Types

**Purpose**: Retrieve the list of road types currently used by the routing algorithm.

**Endpoint**: `GET /validAxisTypes`

**Base URL**: `https://routing-web-service-ityenzhnyq-an.a.run.app`

**Request**:
```
GET /validAxisTypes
```

**Response**:
- **Status Code**: 200 OK
- **Content-Type**: application/json
- **Body**: Array of strings representing active road types

**Example**:
```bash
curl https://routing-web-service-ityenzhnyq-an.a.run.app/validAxisTypes
```

**Response Example**:
```json
[
  "tertiary_link",
  "tertiary",
  "secondary_link",
  "primary_link",
  "primary",
  "motorway_link",
  "secondary",
  "motorway"
]
```

---

### 4. Get Road Type GeoJSON

**Purpose**: Retrieve GeoJSON data for a specific road type to visualize on the map.

**Endpoint**: `GET /axisType/{roadType}`

**Base URL**: `https://routing-web-service-ityenzhnyq-an.a.run.app`

**Path Parameters**:
- `roadType` (string, required): The road type identifier (e.g., "motorway", "primary", "secondary")

**Request**:
```
GET /axisType/motorway
```

**Response**:
- **Status Code**: 200 OK
- **Content-Type**: application/json
- **Body**: GeoJSON FeatureCollection

**Example**:
```bash
curl https://routing-web-service-ityenzhnyq-an.a.run.app/axisType/motorway
```

**Response Example**:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [103.8198, 1.3521],
          [103.8200, 1.3522]
        ]
      },
      "properties": {
        "road_type": "motorway"
      }
    }
  ]
}
```

---

### 5. Change Valid Road Types

**Purpose**: Update the road types used by the routing algorithm. This allows filtering routes based on travel mode (e.g., car, bicycle, walk).

**Endpoint**: `POST /changeValidRoadTypes`

**Base URL**: `https://nyc-bus-routing-k3q4yvzczq-an.a.run.app`

**Request**:
```
POST /changeValidRoadTypes
Content-Type: application/json
```

**Request Body**:
```json
[
  "primary",
  "secondary",
  "tertiary",
  "trunk",
  "primary_link",
  "secondary_link",
  "tertiary_link",
  "trunk_link"
]
```

**Response**:
- **Status Code**: 200 OK
- **Content-Type**: application/json
- **Body**: Array of strings representing the updated valid road types

**Example**:
```bash
curl -X POST https://nyc-bus-routing-k3q4yvzczq-an.a.run.app/changeValidRoadTypes \
  -H "Content-Type: application/json" \
  -d '["primary", "secondary", "tertiary"]'
```

**Response Example**:
```json
[
  "primary",
  "secondary",
  "tertiary"
]
```

---

### 6. Calculate Route

**Purpose**: Calculate the shortest route from a start point to an end point using the current valid road types.

**Endpoint**: `POST /route`

**Base URL**: `https://routing-web-service-ityenzhnyq-an.a.run.app`

**Request**:
```
POST /route
Content-Type: application/json
```

**Request Body**:
```json
{
  "startPt": {
    "long": 103.93443316267717,
    "lat": 1.323996524195518,
    "description": "Bedok 85"
  },
  "endPt": {
    "long": 103.75741069280338,
    "lat": 1.3783396904609801,
    "description": "Choa Chu Kang Road"
  }
}
```

**Request Body Schema**:
- `startPt` (object, required):
  - `long` (number, required): Longitude of the start point
  - `lat` (number, required): Latitude of the start point
  - `description` (string, optional): Human-readable description of the location
- `endPt` (object, required):
  - `long` (number, required): Longitude of the end point
  - `lat` (number, required): Latitude of the end point
  - `description` (string, optional): Human-readable description of the location

**Response**:
- **Status Code**: 200 OK
- **Content-Type**: application/json
- **Body**: GeoJSON FeatureCollection representing the route

**Example**:
```bash
curl -X POST https://routing-web-service-ityenzhnyq-an.a.run.app/route \
  -H "Content-Type: application/json" \
  -d '{
    "startPt": {
      "long": 103.93443316267717,
      "lat": 1.323996524195518,
      "description": "Bedok 85"
    },
    "endPt": {
      "long": 103.75741069280338,
      "lat": 1.3783396904609801,
      "description": "Choa Chu Kang Road"
    }
  }'
```

**Response Example**:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [103.93443316267717, 1.323996524195518],
          [103.9350, 1.3240],
          [103.75741069280338, 1.3783396904609801]
        ]
      },
      "properties": {
        "distance": 25000,
        "duration": 1800
      }
    }
  ]
}
```

---

### 7. Get All Blockages

**Purpose**: Retrieve all blockages currently stored in the system.

**Endpoint**: `GET /blockage`

**Base URL**: `https://routing-web-service-ityenzhnyq-an.a.run.app`

**Request**:
```
GET /blockage
```

**Response**:
- **Status Code**: 200 OK
- **Content-Type**: application/json
- **Body**: GeoJSON FeatureCollection

**Example**:
```bash
curl https://routing-web-service-ityenzhnyq-an.a.run.app/blockage
```

**Response Example**:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [103.8198, 1.3521]
      },
      "properties": {
        "name": "testing blockage 1",
        "description": "description 1",
        "radius": 200
      }
    }
  ]
}
```

---

### 8. Add Blockage

**Purpose**: Add a new blockage to the system. Blockages represent areas that should be avoided during routing.

**Endpoint**: `POST /blockage`

**Base URL**: `https://routing-web-service-ityenzhnyq-an.a.run.app`

**Request**:
```
POST /blockage
Content-Type: application/json
```

**Request Body**:
```json
{
  "point": {
    "long": 103.93443316267717,
    "lat": 1.323996524195518
  },
  "radius": 200,
  "name": "testing blockage 1",
  "description": "description 1"
}
```

**Request Body Schema**:
- `point` (object, required):
  - `long` (number, required): Longitude of the blockage center
  - `lat` (number, required): Latitude of the blockage center
- `radius` (number, required): Radius of the blockage in meters
- `name` (string, required): Unique identifier/name for the blockage
- `description` (string, required): Human-readable description of the blockage

**Response**:
- **Status Code**: 200 OK or 201 Created
- **Content-Type**: application/json (may be empty)

**Example**:
```bash
curl -X POST https://routing-web-service-ityenzhnyq-an.a.run.app/blockage \
  -H "Content-Type: application/json" \
  -d '{
    "point": {
      "long": 103.93443316267717,
      "lat": 1.323996524195518
    },
    "radius": 200,
    "name": "testing blockage 1",
    "description": "description 1"
  }'
```

---

### 9. Delete Blockage

**Purpose**: Remove an existing blockage from the system.

**Endpoint**: `DELETE /blockage/{name}`

**Base URL**: `https://routing-web-service-ityenzhnyq-an.a.run.app`

**Path Parameters**:
- `name` (string, required): The name/identifier of the blockage to delete

**Request**:
```
DELETE /blockage/testing%20blockage%201
```

**Note**: The blockage name should be URL-encoded in the path.

**Response**:
- **Status Code**: 200 OK or 204 No Content
- **Content-Type**: application/json (may be empty)

**Example**:
```bash
curl -X DELETE "https://routing-web-service-ityenzhnyq-an.a.run.app/blockage/testing%20blockage%201"
```

---

## Error Handling

All endpoints may return standard HTTP error codes:

- **400 Bad Request**: Invalid request parameters or body
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side error
- **503 Service Unavailable**: Server is not ready or temporarily unavailable

Error responses should include a JSON body with error details when applicable:

```json
{
  "error": "Error message description"
}
```

## Data Formats

### GeoJSON Format

The application uses the GeoJSON format (RFC 7946) for geographic data representation. GeoJSON objects can be:

- **Point**: Single coordinate pair `[longitude, latitude]`
- **LineString**: Array of coordinate pairs
- **Polygon**: Array of coordinate arrays (with first and last coordinates matching)
- **FeatureCollection**: Collection of Feature objects

Example GeoJSON structure:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [[lng1, lat1], [lng2, lat2]]
      },
      "properties": {
        "key": "value"
      }
    }
  ]
}
```

## Coordinate System

- **Longitude**: Range approximately 103.6 to 104.0 (Singapore)
- **Latitude**: Range approximately 1.2 to 1.5 (Singapore)
- **Format**: Decimal degrees (WGS84)
- **Order**: `[longitude, latitude]` in GeoJSON coordinates

## Rate Limiting

Currently, no rate limiting is specified. However, clients should implement reasonable retry logic and avoid excessive polling.

## Authentication

No authentication is required for the current API endpoints.

## Testing Tools

Recommended tools for testing the API:

- **Postman**: For manual API testing
- **cURL**: For command-line testing
- **GeoJSON Viewers**: 
  - http://geojson.io
  - https://geojson.tools

