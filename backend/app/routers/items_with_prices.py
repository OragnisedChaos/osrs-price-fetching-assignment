# app/routers/items.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, database
from app.schema import ItemWithPriceSchema
from typing import List
from fastapi import HTTPException

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
                highTime=price.highTime,
                low=price.low,
                lowTime=price.lowTime,
            )
            response.append(combined)

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch items with prices: {str(e)}")