# app/routers/items.py

from sqlalchemy.orm import Session
from app import models, database
import requests

def sync_items_task():
    db = next(database.get_db())
    url = "https://prices.runescape.wiki/api/v1/osrs/mapping"
    response = requests.get(url)
    if response.status_code != 200:
        return

    data = response.json()
    for item in data:
        existing_item = db.query(models.Item).filter(models.Item.id == item["id"]).first()
        if not existing_item:
            new_item = models.Item(
                id=item["id"],
                name=item["name"],
                examine=item.get("examine", ""),
                members=item.get("members", "false"),
                lowalch=item.get("lowalch", 0),
                limit=item.get("limit", 0),
                value=item.get("value", 0),
                highalch=item.get("highalch", 0),
                icon=item.get("icon", "")
                
            )
            db.add(new_item)
    db.commit()

