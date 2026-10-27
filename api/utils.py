from decimal import Decimal
from datetime import datetime

def decimal_serializer(obj):
    """Serialize Decimal and datetime objects for JSON responses."""
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, datetime):
        return obj.strftime('%Y-%m-%d %H:%M:%S')
    return obj

def clean_row(row):
    """Transform dictionary values for safe JSON serialization."""
    if not row:
        return row
    return {k: decimal_serializer(v) for k, v in row.items()}

def clean_rows(rows):
    """Transform list of dictionary rows for safe JSON serialization."""
    if not rows:
        return []
    return [clean_row(r) for r in rows]

def currency_format(val):
    """Format numeric value into Vietnamese currency string."""
    if val is None:
        return '0 ₫'
    try:
        val = int(Decimal(str(val)))
        return f"{val:,.0f}".replace(',', '.') + ' ₫'
    except Exception:
        return f"{val} ₫"
