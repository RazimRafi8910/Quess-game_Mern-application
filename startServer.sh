#!/bin/bash

echo "Starting frontend..."
cd client || exit 1
npm run dev &

echo "Starting backend..."
cd ../server || exit 1
npm start &

echo "All services started 🚀"

wait