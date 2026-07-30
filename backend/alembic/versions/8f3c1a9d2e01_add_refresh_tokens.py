"""add refresh_tokens table

Revision ID: 8f3c1a9d2e01
Revises: 5b79fe2bca46
Create Date: 2026-07-30 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '8f3c1a9d2e01'
down_revision: Union[str, Sequence[str], None] = '5b79fe2bca46'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'refresh_tokens',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('jti', sa.String(length=64), nullable=False),
        sa.Column('admin_id', sa.Integer(), nullable=False),
        sa.Column('is_revoked', sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['admin_id'], ['admin_users.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_refresh_tokens_jti', 'refresh_tokens', ['jti'], unique=True)


def downgrade() -> None:
    op.drop_index('ix_refresh_tokens_jti', table_name='refresh_tokens')
    op.drop_table('refresh_tokens')
