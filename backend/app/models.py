from sqlalchemy import Column, Integer, String , Float, ForeignKey, DateTime , Boolean
from app.database import Base
from sqlalchemy.orm import relationship
from datetime import datetime

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    examine = Column(String)
    members = Column(Boolean)
    lowalch = Column(Integer)
    limit = Column(Integer)
    value = Column(Integer)
    highalch = Column(Integer)
    icon = Column(String)

    price = relationship("ItemPrice", back_populates="item", uselist=False)

class ItemPrice(Base):
    __tablename__ = "item_prices"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"), unique=True)
    high = Column(Float)
    highTime = Column(Integer)
    low = Column(Float)
    lowTime = Column(Integer)
    last_updated = Column(DateTime, default=datetime.utcnow)

    item = relationship("Item", back_populates="price")
