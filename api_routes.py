"""
Backward-compatibility facade for api_routes.
The API has been decomposed into individual domain business modules under api/:
- api/products/
- api/categories/
- api/orders/
- api/vouchers/
- api/users/
- api/ai/
- api/uploads/
"""

from api import api_bp, decimal_serializer, clean_row, clean_rows, currency_format

__all__ = [
    'api_bp',
    'decimal_serializer',
    'clean_row',
    'clean_rows',
    'currency_format'
]
