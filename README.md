# Sales Analysis System

A Node.js and MongoDB application for analyzing sales data.

## Features

- Data loading from CSV files
- Scheduled data refresh
- REST API for sales analysis
- Comprehensive logging

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up MongoDB connection in `.env` file
4. Start the server: `npm start`

## API Endpoints

- `POST /api/refresh` - Refresh data
- `GET /api/analysis/revenue/total` - Get total revenue
- `GET /api/analysis/revenue/by-category` - Get revenue by category
- `GET /api/analysis/products/top` - Get top products

## Environment Variables

Create a `.env` file with: