from typing import Type

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_admin


def build_crud_router(
    *,
    model,
    create_schema: Type[BaseModel],
    update_schema: Type[BaseModel],
    out_schema: Type[BaseModel],
    prefix: str,
    tag: str,
    order_by_field: str | None = "order_index",
) -> APIRouter:
    """Builds a standard list/create/update/delete router for a simple
    SQLAlchemy model, protected by admin auth. All fields on update_schema
    should be Optional — we only apply the ones the caller actually sent
    (partial update), so admins can tweak one field without resending everything.
    """

    router = APIRouter(prefix=prefix, tags=[tag])

    @router.get("", response_model=list[out_schema])
    def list_items(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
        query = db.query(model)
        if order_by_field and hasattr(model, order_by_field):
            query = query.order_by(getattr(model, order_by_field))
        return query.all()

    @router.post("", response_model=out_schema, status_code=status.HTTP_201_CREATED)
    def create_item(
        payload: create_schema,
        db: Session = Depends(get_db),
        admin=Depends(get_current_admin),
    ):
        obj = model(**payload.model_dump())
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    @router.get("/{item_id}", response_model=out_schema)
    def get_item(item_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
        obj = db.get(model, item_id)
        if obj is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{model.__name__} not found")
        return obj

    @router.put("/{item_id}", response_model=out_schema)
    def update_item(
        item_id: int,
        payload: update_schema,
        db: Session = Depends(get_db),
        admin=Depends(get_current_admin),
    ):
        obj = db.get(model, item_id)
        if obj is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{model.__name__} not found")
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(obj, field, value)
        db.commit()
        db.refresh(obj)
        return obj

    @router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
    def delete_item(item_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
        obj = db.get(model, item_id)
        if obj is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{model.__name__} not found")
        db.delete(obj)
        db.commit()
        return None

    return router
