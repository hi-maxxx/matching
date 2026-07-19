"""allow null in penname

Revision ID: afb4cd59f691
Revises: 583133caba65
Create Date: 2026-07-19 03:58:23.860777

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'afb4cd59f691'
down_revision: Union[str, Sequence[str], None] = '583133caba65'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column('users', 'penname', nullable=True)

def downgrade() -> None:
    op.alter_column('users', 'penname', nullable=False)
