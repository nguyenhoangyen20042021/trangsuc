"""
Backward-compatibility facade for ai_service.
The AI consultation service and Intent Classifier have been modularized into api/ai/.
"""

from api.ai.service import (
    get_deepseek_config,
    save_deepseek_config,
    predict_intent_logistic_regression,
    generate_intent_form_response,
    generate_deepseek_consultation,
    call_deepseek_api,
    match_products_in_text,
    deepseek_local_simulator,
    format_products_for_chat,
    build_deepseek_system_prompt,
    get_or_train_intent_classifier,
    INTENT_DATASET,
    INTENT_TITLES,
    SETTINGS_FILE,
    MODEL_CACHE_FILE
)

__all__ = [
    'get_deepseek_config',
    'save_deepseek_config',
    'predict_intent_logistic_regression',
    'generate_intent_form_response',
    'generate_deepseek_consultation',
    'call_deepseek_api',
    'match_products_in_text',
    'deepseek_local_simulator',
    'format_products_for_chat',
    'build_deepseek_system_prompt',
    'get_or_train_intent_classifier',
    'INTENT_DATASET',
    'INTENT_TITLES',
    'SETTINGS_FILE',
    'MODEL_CACHE_FILE'
]
