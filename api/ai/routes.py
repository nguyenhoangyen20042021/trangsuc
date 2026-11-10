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

import time
import requests

@ai_bp.route('/ai/settings', methods=['GET', 'POST'])
@ai_bp.route('/ai-settings', methods=['GET', 'POST'])
def ai_settings_endpoint():
    """Lấy hoặc cập nhật thông số cấu hình mô hình DeepSeek AI."""
    if request.method == 'POST':
        data = request.get_json() or request.form or {}
        api_key = data.get('api_key') if 'api_key' in data else data.get('apiKey', '')
        model = data.get('model', 'deepseek-chat')
        base_url = data.get('base_url') if 'base_url' in data else data.get('baseUrl', 'https://api.deepseek.com')
        confidence_threshold = data.get('confidence_threshold') if 'confidence_threshold' in data else data.get('confidenceThreshold', 0.38)
        system_prompt = data.get('system_prompt') if 'system_prompt' in data else data.get('systemPrompt', '')

        saved = save_deepseek_config(
            api_key=str(api_key or '').strip(),
            model=str(model or 'deepseek-chat').strip(),
            base_url=str(base_url or 'https://api.deepseek.com').strip(),
            confidence_threshold=confidence_threshold,
            system_prompt=system_prompt
        )
        return jsonify({
            'success': True,
            'message': 'Đã lưu cấu hình AI DeepSeek Stylist thành công!',
            'config': {
                'apiKey': saved['api_key'],
                'model': saved['model'],
                'baseUrl': saved['base_url'],
                'confidenceThreshold': saved['confidence_threshold'],
                'systemPrompt': saved['system_prompt'],
                'hasApiKey': bool(saved['api_key']),
                'api_key_masked': (saved['api_key'][:4] + '****' + saved['api_key'][-4:]) if len(saved['api_key']) > 8 else ''
            }
        })

    cfg = get_deepseek_config()
    return jsonify({
        'success': True,
        'config': {
            'apiKey': cfg['api_key'],
            'model': cfg['model'],
            'baseUrl': cfg['base_url'],
            'confidenceThreshold': cfg['confidence_threshold'],
            'systemPrompt': cfg['system_prompt'],
            'hasApiKey': bool(cfg['api_key']),
            'api_key_masked': (cfg['api_key'][:4] + '****' + cfg['api_key'][-4:]) if len(cfg['api_key']) > 8 else ''
        }
    })

@ai_bp.route('/ai/test-connection', methods=['POST'])
def ai_test_connection_endpoint():
    """Kiểm tra kết nối thực tế tới DeepSeek API hoặc bộ giả lập ML."""
    data = request.get_json() or {}
    api_key = data.get('api_key') if 'api_key' in data else data.get('apiKey')
    base_url = data.get('base_url') if 'base_url' in data else data.get('baseUrl')
    model = data.get('model')

    cfg = get_deepseek_config()
    if api_key is None:
        api_key = cfg['api_key']
    if not base_url:
        base_url = cfg['base_url']
    if not model:
        model = cfg['model']

    api_key = str(api_key or '').strip()
    base_url = str(base_url or 'https://api.deepseek.com').strip().rstrip('/')
    model = str(model or 'deepseek-chat').strip()

    if not api_key:
        return jsonify({
            'success': True,
            'is_live_ai': False,
            'status': 'simulator',
            'message': 'Chưa cài đặt API Key. Hệ thống đang sử dụng Mô hình Giả lập Tư vấn (DeepSeek Local Engine) kết hợp ML Logistic Regression.',
            'model': f"DeepSeek Local ({model})"
        })

    start_time = time.time()
    try:
        endpoint = f"{base_url}/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": model,
            "messages": [
                {"role": "user", "content": "Ping test"}
            ],
            "max_tokens": 5
        }
        resp = requests.post(endpoint, headers=headers, json=payload, timeout=12)
        latency = round((time.time() - start_time) * 1000)

        if resp.status_code == 200:
            return jsonify({
                'success': True,
                'is_live_ai': True,
                'status': 'connected',
                'latency_ms': latency,
                'message': f"Kết nối DeepSeek API thành công! Mô hình '{model}' phản hồi sau {latency}ms.",
                'model': model
            })
        else:
            err_msg = resp.text
            try:
                err_json = resp.json()
                err_msg = err_json.get('error', {}).get('message', resp.text)
            except Exception:
                pass
            return jsonify({
                'success': False,
                'is_live_ai': False,
                'status': 'error',
                'statusCode': resp.status_code,
                'message': f"Lỗi phản hồi từ DeepSeek ({resp.status_code}): {err_msg}",
                'model': model
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'is_live_ai': False,
            'status': 'network_error',
            'message': f"Không thể kết nối đến máy chủ DeepSeek ({base_url}): {str(e)}",
            'model': model
        })

