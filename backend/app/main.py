from fastapi import FastAPI
from apscheduler.schedulers.background import BackgroundScheduler
from app.routers import items, prices , items_with_prices  # only if you need routes to expose data to frontend

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware here
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["*"] for dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# If you want API endpoints to fetch items/prices, keep routers:
# app.include_router(items.router)
app.include_router(items_with_prices.router)

scheduler = BackgroundScheduler()

@app.on_event("startup")
def start_scheduler():
    items.sync_items_task()  # one-time at startup
    scheduler.add_job(prices.sync_prices_task, 'interval', seconds=30)
    scheduler.start()

@app.on_event("shutdown")
def shutdown_scheduler():
    scheduler.shutdown()
