"""add live_classes table

Revision ID: 2fdef0465b21
Revises: 8f3c1a9d2e01
Create Date: 2026-08-02 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '2fdef0465b21'
down_revision: Union[str, Sequence[str], None] = '8f3c1a9d2e01'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'live_classes',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('title', sa.String(length=150), nullable=False),
        sa.Column('batch_label', sa.String(length=100), nullable=False, server_default=''),
        sa.Column('platform', sa.String(length=30), nullable=False, server_default='Google Meet'),
        sa.Column('meeting_link', sa.String(length=500), nullable=False),
        sa.Column('scheduled_at', sa.DateTime(timezone=False), nullable=False),
        sa.Column('duration_minutes', sa.Integer(), nullable=False, server_default='60'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()),
    )


def downgrade() -> None:
    op.drop_table('live_classes')