# Intelligence Unit - Threat Report Terminal

An Express.js + MongoDB API for managing intelligence reports.

## Features

### Core Endpoints
- **POST** `/reports` - Submit new intelligence report
- **GET** `/reports` - Get all reports
- **GET** `/reports/high` - Get high-priority threats (level >= 4)
- **PUT** `/reports/:id/confirm` - Confirm report validity
- **DELETE** `/reports/:id` - Delete report

### Bonus Features
- **GET** `/reports/:id` - Get specific report by ID
- **GET** `/reports/agent/:fieldCode` - Get all reports from specific agent
- **GET** `/stats` - Comprehensive statistics dashboard

## Data Structure

Each intelligence report contains:

| Field | Type | Description |
|-------|------|-------------|
| `fieldCode` | String | Agent's ID (e.g. "X92-A") |
| `location` | String | Region name |
| `threatLevel` | Number | 1–5 (5 = highest danger) |
| `description` | String | Short intel summary |
| `timestamp` | Date | Time of report (auto-set if missing) |
| `confirmed` | Boolean | Was this intel verified? (default: false) |

## Quick Start

### Installation

1. **Clone and setup:**
   ```bash
   git clone https://github.com/rel770/intel-report.git
   cd intel-report
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Update `CONNECTION_STRING` with your MongoDB Atlas credentials

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Verify connection:**
   ```bash
   curl http://localhost:3000
   ```

## API Documentation

### Submit New Report
```http
POST /reports
Content-Type: application/json

{
  "fieldCode": "X92-A",
  "location": "Tehran Outskirts",
  "threatLevel": 4,
  "description": "Suspicious activity near embassy"
}
```

**Response:**
```json
{
  "message": "Report created successfully",
  "id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "report": {
    "fieldCode": "X92-A",
    "location": "Tehran Outskirts",
    "threatLevel": 4,
    "description": "Suspicious activity near embassy",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "confirmed": false,
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0"
  }
}
```

### Get All Reports
```http
GET /reports
```

### Get High-Priority Threats
```http
GET /reports/high
```

### Confirm Report
```http
PUT /reports/64f8a1b2c3d4e5f6a7b8c9d0/confirm
```

### Get Agent Reports
```http
GET /reports/agent/X92-A
```

### Get Statistics
```http
GET /stats
```

**Response:**
```json
{
  "message": "Intelligence Unit Statistics",
  "overview": {
    "totalReports": 157,
    "highThreatReports": 23,
    "confirmedReports": 98,
    "unconfirmedReports": 59,
    "confirmationRate": "62.4%"
  },
  "threatLevelDistribution": [
    { "_id": 1, "count": 15 },
    { "_id": 2, "count": 32 },
    { "_id": 3, "count": 87 },
    { "_id": 4, "count": 18 },
    { "_id": 5, "count": 5 }
  ],
  "topAgents": [
    { "_id": "X92-A", "reportCount": 23, "highThreatCount": 7 }
  ]
}
```

## Testing the API

### Using curl:

```bash
# Health check
curl http://localhost:3000

# Submit report
curl -X POST http://localhost:3000/reports \
  -H "Content-Type: application/json" \
  -d '{
    "fieldCode": "X92-A",
    "location": "Damascus Border",
    "threatLevel": 5,
    "description": "Imminent threat detected"
  }'

# Get all reports
curl http://localhost:3000/reports

# Get high-priority reports
curl http://localhost:3000/reports/high

# Get statistics
curl http://localhost:3000/stats
```

## Database

- **MongoDB Database:** `intelligence_unit`
- **Collection:** `intel_reports`

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `CONNECTION_STRING` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `PORT` | Server port (default: 3000) | `3000` |
