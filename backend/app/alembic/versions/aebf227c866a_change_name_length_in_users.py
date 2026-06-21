"""change name length in users

Revision ID: aebf227c866a
Revises: ade1abb26a53
Create Date: 2026-06-07 02:58:46.263976

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'aebf227c866a'
down_revision: Union[str, Sequence[str], None] = 'ade1abb26a53'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# 生成されたファイルを手動で修正する例
def upgrade() -> None:
    op.alter_column('users', 'name',
        existing_type=sa.String(),
        type_=sa.String(100),
        nullable=False
    )

def downgrade() -> None:
    op.alter_column('users', 'name',
        existing_type=sa.String(100),
        type_=sa.String(),
        nullable=False
    )
