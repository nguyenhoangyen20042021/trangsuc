from flask import Blueprint, request, jsonify, session
from .service import (
    generate_deepseek_consultation,
    get_deepseek_config,
    save_deepseek_config
)

ai_bp = Blueprint('ai_api', __name__)

@ai_bp.route('/ai-consultant', methods=['POST'])
@ai_bp.route('/ai/consult', methods=['POST'])
def ai_consultant_endpoint():
    """Tư vấn trang sức thông minh qua mô hình kết hợp ML Logistic Regression và DeepSeek LLM."""
    data = request.get_json() or {}
    user_msg = data.get('message', '').strip()
    style = data.get('style', '')
    budget = data.get('budget', '')
    occasion = data.get('occasion', '')
    finger_size = data.get('finger_size', '')

    if not user_msg:
        return jsonify({'success': False, 'message': 'Vui lòng nhập câu hỏi tư vấn.'}), 400

    context_dict = {
        'style': style,
        'budget': budget,
        'occasion': occasion,
        'finger_size': finger_size
    }

    result = generate_deepseek_consultation(user_msg, context_dict)
    reply = result.get('reply', '')
    suggested_products = result.get('products', [])

    return jsonify({
        'success': True,
        'reply': reply,
        'products': suggested_products,
        'model': result.get('model', 'DeepSeek-V3'),
        'engine': result.get('engine', 'Logistic Regression (ML Classifier)'),
        'intent': result.get('intent', ''),
        'intent_name': result.get('intent_name', ''),
        'confidence': result.get('confidence', 0),
        'is_live_ai': result.get('is_live_ai', False)
    })

@ai_bp.route('/ai/settings', methods=['GET', 'POST'])
@ai_bp.route('/ai-settings', methods=['GET', 'POST'])
def ai_settings_endpoint():
    """Lấy hoặc cập nhật thông số cấu hình mô hình DeepSeek AI."""
    if request.method == 'POST':
        data = request.get_json() or request.form or {}
        api_key = data.get('api_key', '').strip()
        model = data.get('model', 'deepseek-chat').strip()
        base_url = data.get('base_url', 'https://api.deepseek.com').strip()

        saved = save_deepseek_config(api_key, model, base_url)
        return jsonify({
            'success': True,
            'message': 'Đã lưu cấu hình DeepSeek AI thành công.',
            'config': {
                'model': saved['model'],
                'base_url': saved['base_url'],
                'has_api_key': bool(saved['api_key'])
            }
        })

    cfg = get_deepseek_config()
    return jsonify({
        'success': True,
        'config': {
            'model': cfg['model'],
            'base_url': cfg['base_url'],
            'has_api_key': bool(cfg['api_key']),
            'api_key_masked': (cfg['api_key'][:4] + '****' + cfg['api_key'][-4:]) if len(cfg['api_key']) > 8 else ''
        }
    })
