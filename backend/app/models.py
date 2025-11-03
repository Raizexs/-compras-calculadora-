from typing import Optional, Any
from pydantic import BaseModel, Field, ConfigDict, field_validator
from bson import ObjectId


class PyObjectId(ObjectId):
    """Custom type for MongoDB ObjectId serialization"""

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, _):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type: Any, _handler):
        from pydantic_core import core_schema
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )


# ============= USER MODELS =============
class UserIn(BaseModel):
    """User registration input"""
    email: str
    password: str


class UserOut(BaseModel):
    """User output (without password)"""
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    email: str

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )


class UserLogin(BaseModel):
    """User login input"""
    email: str
    password: str


# ============= PERSON MODELS =============
class PersonIn(BaseModel):
    """Person creation input"""
    name: str


class PersonOut(BaseModel):
    """Person output"""
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    name: str

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )


# ============= PRODUCT MODELS =============
class ProductIn(BaseModel):
    """Product creation input"""
    name: str
    price: float
    description: Optional[str] = ""
    category: Optional[str] = "Otros"
    characteristics: Optional[list[str]] = []

    @field_validator("price")
    @classmethod
    def validate_price(cls, v):
        if v <= 0:
            raise ValueError("Price must be greater than 0")
        return round(v, 2)


class ProductOut(BaseModel):
    """Product output"""
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    name: str
    price: float
    description: Optional[str] = ""
    category: Optional[str] = "Otros"
    characteristics: Optional[list[str]] = []

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )


# ============= PURCHASE MODELS =============
class PurchaseItem(BaseModel):
    """Individual item in a purchase"""
    product_id: PyObjectId
    name: str
    price: float
    quantity: int

    @field_validator("quantity")
    @classmethod
    def validate_quantity(cls, v):
        if v <= 0:
            raise ValueError("Quantity must be greater than 0")
        return v


class PurchaseIn(BaseModel):
    """Purchase creation input"""
    person_id: PyObjectId
    items: list[PurchaseItem]

    @field_validator("items")
    @classmethod
    def validate_items(cls, v):
        if len(v) == 0:
            raise ValueError("Purchase must contain at least one item")
        return v


class PurchaseOut(BaseModel):
    """Purchase output"""
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    person_id: PyObjectId
    items: list[PurchaseItem]
    total: float

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )


class TotalOut(BaseModel):
    """Total purchases by person"""
    person_id: PyObjectId
    total: float
    purchase_count: int

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
