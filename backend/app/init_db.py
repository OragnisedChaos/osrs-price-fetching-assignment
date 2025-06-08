from app.database import Base, engine
from app import models  # this ensures all models are registered

Base.metadata.create_all(bind=engine)


print("Database initialized successfully.")