from flask import Blueprint
from .utils import decimal_serializer, clean_row, clean_rows, currency_format
from .products.routes import products_bp
from .categories.routes import categories_bp
from .orders.routes import orders_bp
from .vouchers.routes import vouchers_bp
from .users.routes import users_bp
from .ai.routes import ai_bp
from .uploads.routes import uploads_bp

api_bp = Blueprint('api', __name__, url_prefix='/api')

# Register domain sub-blueprints into the master API blueprint
api_bp.register_blueprint(products_bp)
api_bp.register_blueprint(categories_bp)
api_bp.register_blueprint(orders_bp)
api_bp.register_blueprint(vouchers_bp)
api_bp.register_blueprint(users_bp)
api_bp.register_blueprint(ai_bp)
api_bp.register_blueprint(uploads_bp)

__all__ = [
    'api_bp',
    'decimal_serializer',
    'clean_row',
    'clean_rows',
    'currency_format'
]
