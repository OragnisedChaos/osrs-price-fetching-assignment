from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models
import requests
from datetime import datetime


def fetch_and_update_prices():
    db: Session = SessionLocal()
    try:
        response = requests.get("https://prices.runescape.wiki/api/v1/osrs/latest")
        if response.status_code != 200:
            print(f"[Scheduler] Failed to fetch prices: {response.status_code}")
            return

        prices_data = response.json().get("data", {})
        updated_count = 0

        for item_id_str, price_info in prices_data.items():
            try:
                item_id = int(item_id_str)
                price = price_info.get("high")

                if price is None:
                    continue

                # Check if the item exists
                existing = db.query(models.ItemPrice).filter_by(item_id=item_id).first()
                if existing:
                    if existing.price != price:
                        existing.price = price
                        existing.last_updated = datetime.utcnow()
                        updated_count += 1
                else:
                    # Check item exists in items table
                    item = db.query(models.Item).filter_by(id=item_id).first()
                    if item:
                        new_price = models.ItemPrice(
                            item_id=item_id,
                            price=price,
                            last_updated=datetime.utcnow()
                        )
                        db.add(new_price)
                        updated_count += 1
            except Exception as e:
                continue  # Skip malformed data

        db.commit()
        print(f"[Scheduler] Updated prices for {updated_count} items.")

    finally:
        db.close()


def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(fetch_and_update_prices, "interval", seconds=20) 
    scheduler.start()
    print("[Scheduler] Started.")
