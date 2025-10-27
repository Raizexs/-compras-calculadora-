from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from bson import ObjectId
from typing import List

from app.database import connect_to_mongo, close_mongo_connection, get_collection
from app.models import (
    UserIn, UserOut, UserLogin,
    PersonIn, PersonOut,
    ProductIn, ProductOut,
    PurchaseIn, PurchaseOut, TotalOut
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()


# Initialize FastAPI app
app = FastAPI(
    title="Shopping App API",
    description="API for shopping app with FastAPI and MongoDB",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============= HEALTH CHECK =============
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "API is running"}


# ============= AUTHENTICATION ENDPOINTS =============
@app.post("/auth/register", response_model=UserOut, status_code=status.HTTP_201_CREATED, tags=["Auth"])
async def register_user(user: UserIn):
    """Register a new user (demo - password in plain text)"""
    users = get_collection("users")
    
    # Check if user already exists
    existing_user = await users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Create user (demo - no password hashing)
    user_dict = user.model_dump()
    result = await users.insert_one(user_dict)
    
    created_user = await users.find_one({"_id": result.inserted_id})
    return UserOut(**created_user)


@app.post("/auth/login", response_model=UserOut, tags=["Auth"])
async def login_user(credentials: UserLogin):
    """Login user (demo - plain text password comparison)"""
    users = get_collection("users")
    
    # Find user
    user = await users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Check password (demo - plain text comparison)
    if user["password"] != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    return UserOut(**user)


# ============= PERSON ENDPOINTS =============
@app.post("/persons", response_model=PersonOut, status_code=status.HTTP_201_CREATED, tags=["Persons"])
async def create_person(person: PersonIn):
    """Create a new person"""
    persons = get_collection("persons")
    
    person_dict = person.model_dump()
    result = await persons.insert_one(person_dict)
    
    created_person = await persons.find_one({"_id": result.inserted_id})
    return PersonOut(**created_person)


@app.get("/persons/{person_id}", response_model=PersonOut, tags=["Persons"])
async def get_person(person_id: str):
    """Get a person by ID"""
    if not ObjectId.is_valid(person_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid person ID format"
        )
    
    persons = get_collection("persons")
    person = await persons.find_one({"_id": ObjectId(person_id)})
    
    if not person:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Person not found"
        )
    
    return PersonOut(**person)


@app.get("/persons", response_model=List[PersonOut], tags=["Persons"])
async def list_persons():
    """List all persons"""
    persons = get_collection("persons")
    cursor = persons.find({})
    persons_list = await cursor.to_list(length=100)
    return [PersonOut(**person) for person in persons_list]


# ============= PRODUCT ENDPOINTS =============
@app.post("/products", response_model=ProductOut, status_code=status.HTTP_201_CREATED, tags=["Products"])
async def create_product(product: ProductIn):
    """Create a new product"""
    products = get_collection("products")
    
    product_dict = product.model_dump()
    result = await products.insert_one(product_dict)
    
    created_product = await products.find_one({"_id": result.inserted_id})
    return ProductOut(**created_product)


@app.get("/products", response_model=List[ProductOut], tags=["Products"])
async def list_products():
    """List all products"""
    products = get_collection("products")
    cursor = products.find({})
    products_list = await cursor.to_list(length=100)
    return [ProductOut(**product) for product in products_list]


@app.get("/products/{product_id}", response_model=ProductOut, tags=["Products"])
async def get_product(product_id: str):
    """Get a product by ID"""
    if not ObjectId.is_valid(product_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid product ID format"
        )
    
    products = get_collection("products")
    product = await products.find_one({"_id": ObjectId(product_id)})
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return ProductOut(**product)


# ============= PURCHASE ENDPOINTS =============
@app.post("/purchases", response_model=PurchaseOut, status_code=status.HTTP_201_CREATED, tags=["Purchases"])
async def create_purchase(purchase: PurchaseIn):
    """Create a new purchase and calculate total"""
    purchases = get_collection("purchases")
    persons = get_collection("persons")
    
    # Verify person exists
    person = await persons.find_one({"_id": purchase.person_id})
    if not person:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Person not found"
        )
    
    # Calculate total
    total = sum(item.price * item.quantity for item in purchase.items)
    total = round(total, 2)
    
    # Create purchase document
    purchase_dict = purchase.model_dump()
    purchase_dict["total"] = total
    
    result = await purchases.insert_one(purchase_dict)
    
    created_purchase = await purchases.find_one({"_id": result.inserted_id})
    return PurchaseOut(**created_purchase)


@app.get("/purchases/{purchase_id}", response_model=PurchaseOut, tags=["Purchases"])
async def get_purchase(purchase_id: str):
    """Get a purchase by ID"""
    if not ObjectId.is_valid(purchase_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid purchase ID format"
        )
    
    purchases = get_collection("purchases")
    purchase = await purchases.find_one({"_id": ObjectId(purchase_id)})
    
    if not purchase:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Purchase not found"
        )
    
    return PurchaseOut(**purchase)


@app.get("/purchases/person/{person_id}/total", response_model=TotalOut, tags=["Purchases"])
async def get_person_total(person_id: str):
    """Get total purchases amount for a person"""
    if not ObjectId.is_valid(person_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid person ID format"
        )
    
    purchases = get_collection("purchases")
    persons = get_collection("persons")
    
    # Verify person exists
    person = await persons.find_one({"_id": ObjectId(person_id)})
    if not person:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Person not found"
        )
    
    # Calculate total using aggregation
    pipeline = [
        {"$match": {"person_id": ObjectId(person_id)}},
        {"$group": {
            "_id": "$person_id",
            "total": {"$sum": "$total"},
            "purchase_count": {"$sum": 1}
        }}
    ]
    
    result = await purchases.aggregate(pipeline).to_list(length=1)
    
    if not result:
        return TotalOut(
            person_id=ObjectId(person_id),
            total=0.0,
            purchase_count=0
        )
    
    return TotalOut(
        person_id=result[0]["_id"],
        total=round(result[0]["total"], 2),
        purchase_count=result[0]["purchase_count"]
    )


@app.get("/purchases/person/{person_id}", response_model=List[PurchaseOut], tags=["Purchases"])
async def list_person_purchases(person_id: str):
    """List all purchases for a person"""
    if not ObjectId.is_valid(person_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid person ID format"
        )
    
    purchases = get_collection("purchases")
    cursor = purchases.find({"person_id": ObjectId(person_id)})
    purchases_list = await cursor.to_list(length=100)
    return [PurchaseOut(**purchase) for purchase in purchases_list]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
