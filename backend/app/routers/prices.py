# app/routers/prices.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, database
import requests
from datetime import datetime

router = APIRouter()

def sync_prices_task():
    db = next(database.get_db())  # get DB session
    url = "https://prices.runescape.wiki/api/v1/osrs/latest"
    response = requests.get(url)
    if response.status_code != 200:
        print("Failed to fetch latest prices")
        return

    data = response.json().get("data", {})
    for item_id_str, price_info in data.items():
        item_id = int(item_id_str)
        item = db.query(models.Item).filter(models.Item.id == item_id).first()
        if not item:
            continue  # Skip items not in DB

        # Extract price details safely
        high = price_info.get("high")
        highTime = price_info.get("highTime")
        low = price_info.get("low")
        lowTime = price_info.get("lowTime")

        existing = db.query(models.ItemPrice).filter(models.ItemPrice.item_id == item_id).first()
        if existing:
            # Update only if any field changed to reduce writes
            if (existing.high != high or
                existing.highTime != highTime or
                existing.low != low or
                existing.lowTime != lowTime):
                existing.high = high
                existing.highTime = highTime
                existing.low = low
                existing.lowTime = lowTime
                existing.last_updated = datetime.utcnow()
        else:
            # Create new record if none exists
            new_entry = models.ItemPrice(
                item_id=item_id,
                high=high,
                highTime=highTime,
                low=low,
                lowTime=lowTime,
                last_updated=datetime.utcnow()
            )
            db.add(new_entry)

    db.commit()
    print("Prices synced successfully")




