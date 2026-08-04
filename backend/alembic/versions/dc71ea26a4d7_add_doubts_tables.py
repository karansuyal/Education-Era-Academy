"""add doubts tables

Revision ID: dc71ea26a4d7
Revises: 2fdef0465b21
Create Date: 2026-08-04 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'dc71ea26a4d7'
down_revision: Union[str, Sequence[str], None] = '2fdef0465b21'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'doubts',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('chapter_id', sa.Integer(), sa.ForeignKey('chapters.id', ondelete='CASCADE'), nullable=False),
        sa.Column('student_name', sa.String(length=120), nullable=False),
        sa.Column('student_phone', sa.String(length=20), nullable=False),
        sa.Column('question_text', sa.Text(), nullable=False),
        sa.Column('image_url', sa.String(length=500), nullable=False, server_default=''),
        sa.Column('status', sa.String(length=20), nullable=False, server_default='pending'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('ix_doubts_student_phone', 'doubts', ['student_phone'])

    op.create_table(
        'doubt_replies',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('doubt_id', sa.Integer(), sa.ForeignKey('doubts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('admin_id', sa.Integer(), sa.ForeignKey('admin_users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('reply_text', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table('doubt_replies')
    op.drop_index('ix_doubts_student_phone', table_name='doubts')
    op.drop_table('doubts')
