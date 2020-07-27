"""empty message

Revision ID: b31879930b43
Revises: 
Create Date: 2020-07-10 15:21:15.609453

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b31879930b43'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('blacklist_token',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('token', sa.String(length=255), nullable=True),
    sa.Column('created_at', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('group',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('screen_name', sa.String(length=100), nullable=False),
    sa.Column('color', sa.String(length=10), nullable=True),
    sa.Column('created_at', sa.Integer(), nullable=False),
    sa.Column('updated_at', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_group_name'), 'group', ['name'], unique=False)
    op.create_index(op.f('ix_group_screen_name'), 'group', ['screen_name'], unique=False)
    op.create_table('permission',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('description', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.Integer(), nullable=False),
    sa.Column('updated_at', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_permission_description'), 'permission', ['description'], unique=False)
    op.create_index(op.f('ix_permission_name'), 'permission', ['name'], unique=True)
    op.create_table('rel_group_permission',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('group_id', sa.Integer(), nullable=False),
    sa.Column('permission_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['group_id'], ['group.id'], ),
    sa.ForeignKeyConstraint(['permission_id'], ['permission.id'], ),
    sa.PrimaryKeyConstraint('id', 'group_id', 'permission_id')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('full_name', sa.String(length=50), nullable=True),
    sa.Column('avatar', sa.String(length=255), nullable=True),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('password', sa.String(length=255), nullable=True),
    sa.Column('status', sa.Integer(), nullable=True),
    sa.Column('oauth_provider', sa.String(length=50), nullable=True),
    sa.Column('oauth_token', sa.String(length=255), nullable=True),
    sa.Column('oauth_refresh_token', sa.String(length=255), nullable=True),
    sa.Column('oauth_token_expired_at', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.Integer(), nullable=False),
    sa.Column('updated_at', sa.Integer(), nullable=True),
    sa.Column('group_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['group_id'], ['group.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)
    op.create_index(op.f('ix_user_password'), 'user', ['password'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_user_password'), table_name='user')
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_table('user')
    op.drop_table('rel_group_permission')
    op.drop_index(op.f('ix_permission_name'), table_name='permission')
    op.drop_index(op.f('ix_permission_description'), table_name='permission')
    op.drop_table('permission')
    op.drop_index(op.f('ix_group_screen_name'), table_name='group')
    op.drop_index(op.f('ix_group_name'), table_name='group')
    op.drop_table('group')
    op.drop_table('blacklist_token')
    # ### end Alembic commands ###
