# app/schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ItemPriceSchema(BaseModel):
    item_id: int
    price: float
    last_updated: datetime
    high: Optional[float]
    highTime: Optional[int]
    low: Optional[float]
    lowTime: Optional[int]

    class Config:
        orm_mode = True

class ItemWithPriceSchema(BaseModel):
    id: int
    name: str
    examine: Optional[str]
    members: Optional[bool]
    lowalch: Optional[int]
    limit: Optional[int]
    value: Optional[int]
    highalch: Optional[int]
    icon: Optional[str]
    last_updated: Optional[datetime]
    high: Optional[float]
    highTime: Optional[int]
    low: Optional[float]
    lowTime: Optional[int]

    class Config:
        orm_mode = True
