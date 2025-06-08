# app/routers/items.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, database
from app.schema import ItemWithPriceSchema
from typing import List
from fastapi import HTTPException
from datetime import datetime, timezone

def time_ago(unix_timestamp):
    now = datetime.now(timezone.utc)
    past = datetime.fromtimestamp(unix_timestamp, tz=timezone.utc)  # No /1000
    diff = now - past

    total_minutes = int(diff.total_seconds() // 60)
    hours = total_minutes // 60
    minutes = total_minutes % 60

    if hours > 0:
        if minutes > 0:
            return f"{hours} hour{'s' if hours > 1 else ''} {minutes} min ago"
        return f"{hours} hour{'s' if hours > 1 else ''} ago"
    elif minutes > 0:
        return f"{minutes} min ago"
    else:
        return "just now"

router = APIRouter()
@router.get("/items-with-prices", response_model=List[ItemWithPriceSchema])
def get_items_with_prices(db: Session = Depends(database.get_db)):

    try:
        results = db.query(models.Item, models.ItemPrice).join(
            models.ItemPrice, models.Item.id == models.ItemPrice.item_id
        ).all()

        response = []
        for item, price in results:
            combined = ItemWithPriceSchema(
                id=item.id,
                name=item.name,
                examine=item.examine,
                members=item.members,
                lowalch=item.lowalch,
                limit=item.limit,
                value=item.value,
                highalch=item.highalch,
                icon=item.icon,
                last_updated=price.last_updated,
                high=price.high,
                highTime=time_ago(price.highTime),
                low=price.low,
                lowTime=time_ago(price.lowTime),
            )
            response.append(combined)

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch items with prices: {str(e)}")