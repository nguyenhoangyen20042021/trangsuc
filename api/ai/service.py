import os
import re
import json
import requests
import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from config import Config
from db import query_all

SETTINGS_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'deepseek_settings.json')
MODEL_CACHE_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'intent_classifier.joblib')

# =================================================================
# 1. CẤU HÌNH DEEPSEEK (API KEY & MODEL SELECTION)
# =================================================================

def get_deepseek_config():
    """Lấy cấu hình DeepSeek từ settings file hoặc config.py."""
    api_key = Config.DEEPSEEK_API_KEY
    base_url = Config.DEEPSEEK_BASE_URL
    model = Config.DEEPSEEK_MODEL

    normalized_settings = os.path.abspath(SETTINGS_FILE)
    if os.path.exists(normalized_settings):
        try:
            with open(normalized_settings, 'r', encoding='utf-8') as f:
                data = json.load(f)
                api_key = data.get('api_key', api_key)
                base_url = data.get('base_url', base_url)
                model = data.get('model', model)
        except Exception as e:
            print(f"Error reading deepseek_settings.json: {e}")

    return {
        'api_key': api_key.strip(),
        'base_url': base_url.strip().rstrip('/'),
        'model': model.strip()
    }

def save_deepseek_config(api_key, model='deepseek-chat', base_url='https://api.deepseek.com'):
    """Lưu cấu hình DeepSeek vào file settings."""
    data = {
        'api_key': api_key.strip(),
        'model': model.strip(),
        'base_url': base_url.strip().rstrip('/')
    }
    normalized_settings = os.path.abspath(SETTINGS_FILE)
    with open(normalized_settings, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    return data


# =================================================================
# 2. TRAINING CORPUS & LOGISTIC REGRESSION INTENT CLASSIFIER
# =================================================================

INTENT_DATASET = [
    # Intent 1: Size ni tay & Đo kích thước nhẫn
    ("cách đo size nhẫn", "size_measurement"),
    ("hướng dẫn đo ni tay", "size_measurement"),
    ("làm sao biết ngón tay đeo size mấy", "size_measurement"),
    ("chu vi ngón tay 52mm là size bao nhiêu", "size_measurement"),
    ("ngón tay nhỏ nên đeo size nào", "size_measurement"),
    ("đo kích thước ngón tay tại nhà bằng chỉ", "size_measurement"),
    ("bảng size ni tay việt nam chuẩn", "size_measurement"),
    ("cách tính size nhẫn cưới", "size_measurement"),
    ("vòng tay bao nhiêu cm thì vừa", "size_measurement"),
    ("đo cỡ ngón tay đeo nhẫn", "size_measurement"),
    ("cách chọn size nhẫn cho bạn gái bí mật", "size_measurement"),
    ("lắc tay freesize hay có size", "size_measurement"),

    # Intent 2: Cầu hôn, đính hôn, nhẫn cưới
    ("tư vấn nhẫn cầu hôn", "proposal_wedding"),
    ("mua nhẫn đính hôn cho bạn gái", "proposal_wedding"),
    ("nhẫn cầu hôn kim cương tự nhiên đẹp nhất", "proposal_wedding"),
    ("nhẫn cưới đôi vàng 18k", "proposal_wedding"),
    ("cặp nhẫn cưới cho ngày trọng đại", "proposal_wedding"),
    ("lễ cưới nên chọn nhẫn cưới gì ý nghĩa", "proposal_wedding"),
    ("nhẫn đính hôn solitaire 6 chấu", "proposal_wedding"),
    ("nhẫn cưới nạm kim cương tấm", "proposal_wedding"),
    ("nhẫn đôi tình nhân gắn kết", "proposal_wedding"),
    ("mẫu nhẫn đính hôn được yêu thích nhất mùa cưới", "proposal_wedding"),
    ("chọn nhẫn cầu hôn bất ngờ", "proposal_wedding"),

    # Intent 3: Chính sách bảo hành & kiểm định GIA
    ("chính sách bảo hành trang sức thế nào", "warranty_policy"),
    ("kim cương có giấy kiểm định gia quốc tế không", "warranty_policy"),
    ("kim cương có giấy chứng thư gia không", "warranty_policy"),
    ("giấy chứng nhận gia kim cương", "warranty_policy"),
    ("chứng thư giám định đá quý", "warranty_policy"),
    ("chính sách thu đổi kim cương và vàng ra sao", "warranty_policy"),
    ("đánh bóng làm mới nhẫn có mất tiền không", "warranty_policy"),
    ("có kiểm định chất lượng đá quý không", "warranty_policy"),
    ("bảo hành đá tấm rơi rớt miễn phí không", "warranty_policy"),
    ("vàng 18k có đúng tuổi thật không", "warranty_policy"),
    ("được đổi hàng trong bao nhiêu ngày", "warranty_policy"),
    ("thu lại nhẫn cũ bao nhiêu phần trăm", "warranty_policy"),

    # Intent 4: Vận chuyển & Phí giao hàng
    ("phí vận chuyển bao nhiêu tiền", "shipping_policy"),
    ("phí ship về đà nẵng bao nhiêu", "shipping_policy"),
    ("phí ship các tỉnh bao nhiêu", "shipping_policy"),
    ("tiền ship bao nhiêu", "shipping_policy"),
    ("giao hàng mất mấy ngày nhận được", "shipping_policy"),
    ("giao hàng mất bao lâu", "shipping_policy"),
    ("có giao hỏa tốc trong 2 giờ không", "shipping_policy"),
    ("đơn hàng bao nhiêu thì được miễn phí ship", "shipping_policy"),
    ("có được kiểm tra hàng trước khi thanh toán không", "shipping_policy"),
    ("ship về tỉnh xa có an toàn bảo hiểm không", "shipping_policy"),
    ("giao hàng cod tận nhà không", "shipping_policy"),
    ("thời gian nhận hàng ở hà nội và sài gòn", "shipping_policy"),

    # Intent 5: Mã giảm giá & Voucher ưu đãi
    ("có mã giảm giá nào không shop", "voucher_promo"),
    ("shop có voucher khuyến mãi nào hôm nay", "voucher_promo"),
    ("mã giảm giá aura2026 áp dụng thế nào", "voucher_promo"),
    ("chương trình ưu đãi giảm giá mùa cưới", "voucher_promo"),
    ("nhập mã coupon ưu đãi ở đâu", "voucher_promo"),
    ("được giảm tối đa bao nhiêu tiền", "voucher_promo"),
    ("có mã voucher cho khách hàng mới không", "voucher_promo"),
    ("mã giảm 10 phần trăm hôm nay", "voucher_promo"),

    # Intent 6: Trang sức Nam / Quý ông
    ("tư vấn trang sức cho nam giới", "men_jewelry"),
    ("cho tôi xem mẫu nhẫn nam quý ông", "men_jewelry"),
    ("nhẫn cho đàn ông", "men_jewelry"),
    ("mẫu nhẫn nam đẹp", "men_jewelry"),
    ("nhẫn quý ông", "men_jewelry"),
    ("nhẫn nam vàng đúc bản to quyền lực", "men_jewelry"),
    ("quà tặng trang sức cho bạn trai", "men_jewelry"),
    ("nhẫn nam đính đá onyx đen và kim cương", "men_jewelry"),
    ("quý ông nên đeo mẫu nhẫn nào đẹp", "men_jewelry"),
    ("nhẫn cưới cho nam kiểu dáng đơn giản", "men_jewelry"),
    ("trang sức phong độ cho đàn ông thành đạt", "men_jewelry"),

    # Intent 7: Đá quý phong thủy / Ruby / Sapphire / Ngọc trai
    ("tư vấn trang sức đá quý phong thủy", "gemstone_fengshui"),
    ("nhẫn nữ đính đá ruby huyết bồ câu", "gemstone_fengshui"),
    ("dây chuyền mặt đá sapphire xanh hoàng gia", "gemstone_fengshui"),
    ("bông tai ngọc trai south sea ánh vàng", "gemstone_fengshui"),
    ("chọn đá quý hợp mệnh kim mộc thủy hỏa thổ", "gemstone_fengshui"),
    ("đá ruby mang lại may mắn gì", "gemstone_fengshui"),
    ("ngọc bích nephrite tự nhiên cao cấp", "gemstone_fengshui"),

    # Intent 8: Lời chào đón tiếp
    ("xin chào aura", "greeting"),
    ("chào shop tư vấn giúp mình với", "greeting"),
    ("hello có ai trực chat không", "greeting"),
    ("hi shop", "greeting"),
    ("chào bạn", "greeting"),
    ("bắt đầu tư vấn", "greeting")
]

INTENT_TITLES = {
    "size_measurement": "Hướng dẫn đo size ni tay (Size Guide)",
    "proposal_wedding": "Tư vấn nhẫn cầu hôn & nhẫn cưới hoàng gia",
    "warranty_policy": "Chính sách bảo hành & kiểm định GIA quốc tế",
    "shipping_policy": "Chính sách vận chuyển & bảo hiểm giao hàng",
    "voucher_promo": "Mã giảm giá & chương trình ưu đãi",
    "men_jewelry": "Bộ sưu tập trang sức nam lịch lãm",
    "gemstone_fengshui": "Đá quý hoàng gia & phong thủy may mắn",
    "greeting": "Lời chào đón tiếp khách hàng VIP"
}

_classifier_model = None

def get_or_train_intent_classifier():
    """Khởi tạo và huấn luyện mô hình Logistic Regression Intent Classifier."""
    global _classifier_model
    if _classifier_model is not None:
        return _classifier_model

    texts = [item[0] for item in INTENT_DATASET]
    labels = [item[1] for item in INTENT_DATASET]

    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True, min_df=1)),
        ('clf', LogisticRegression(C=1.5, max_iter=200, random_state=42))
    ])

    pipeline.fit(texts, labels)
    _classifier_model = pipeline
    return _classifier_model

def predict_intent_logistic_regression(user_msg, confidence_threshold=0.25):
    """Sử dụng Logistic Regression để dự đoán Intent của người dùng và trả về xác suất tin cậy."""
    model = get_or_train_intent_classifier()
    msg_clean = user_msg.strip().lower()

    probs = model.predict_proba([msg_clean])[0]
    classes = model.classes_
    max_idx = np.argmax(probs)
    best_intent = classes[max_idx]
    best_confidence = float(probs[max_idx])

    if best_confidence >= confidence_threshold:
        return {
            'matched': True,
            'intent': best_intent,
            'confidence': round(best_confidence * 100, 1),
            'intent_name': INTENT_TITLES.get(best_intent, best_intent)
        }

    return {
        'matched': False,
        'intent': None,
        'confidence': round(best_confidence * 100, 1)
    }

def format_products_for_chat(prods):
    """Định dạng mảng sản phẩm cho khung chat."""
    res = []
    for p in prods:
        res.append({
            'name': p['TenSanPham'],
            'slug': p.get('Slug') or f"sp-{p['MaSanPham']}",
            'price': int(p.get('GiaMin') or p.get('GiaCoSo', 0)),
            'image': p.get('HinhAnhChinh') or 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
            'material': p['ChatLieu']
        })
    return res

def generate_intent_form_response(intent, user_msg, products):
    """Tạo nội dung câu trả lời chuẩn (Form sẵn) dựa trên Intent do Logistic Regression quyết định."""
    if intent == 'size_measurement':
        reply = """💎 **HƯỚNG DẪN ĐO SIZE NI TAY CHUẨN XÁC TẠI NHÀ (AURA SIZE GUIDE):**
1. **Bước 1:** Dùng một sợi chỉ hoặc dải giấy nhỏ quấn quanh khớp ngón tay bạn định đeo nhẫn.
2. **Bước 2:** Đánh dấu điểm giao nhau và trải dải giấy ra thước kẻ để đọc chiều dài chu vi (milimét mm):
   - Chu vi **50 - 51mm** ➔ **Size 10** (Khuyên dùng cho ngón tay nữ nhỏ thanh mảnh)
   - Chu vi **52 - 53mm** ➔ **Size 11** (Size tiêu chuẩn nữ phổ biến nhất Việt Nam)
   - Chu vi **54 - 55mm** ➔ **Size 12** (Dành cho tay nữ đầy đặn)
   - Chu vi **57 - 58mm** ➔ **Size 14** (Thường vừa ngón tay nam thanh nhã)
   - Chu vi **60 - 62mm** ➔ **Size 17 - 18** (Size chuẩn nam giới)
💡 *Mẹo chuyên gia AURA:* Hãy đo vào cuối buổi chiều khi ngón tay giãn nở tự nhiên nhất. AURA hỗ trợ **chỉnh ni tay hoàn toàn miễn phí trọn đời** cho mọi quý khách!"""
        return reply, []

    elif intent == 'proposal_wedding':
        reply = """💍 **GỢI Ý TRANG SỨC CẦU HÔN & NHẪN CƯỚI THƯỢNG LƯU HOÀNG GIA:**
Khoảnh khắc cầu hôn thiêng liêng là lời ước hẹn trọn đời. AURA trân trọng giới thiệu hai kiệt tác biểu tượng:
1. **Nhẫn Kim Cương Solitaire Eternal Grace:** Thiết kế 6 chấu kinh điển, ôm trọn viên kim cương chủ chuẩn kiểm định GIA quốc tế, nước màu F siêu trắng phản chiếu tình yêu thuần khiết.
2. **Cặp Nhẫn Cưới Đôi Royal Eternity:** Sự hòa quyện hoàn mỹ giữa chất vàng 18K bền vững và dải kim cương tấm nạm tinh xảo, tượng trưng cho tình nghĩa phu thê son sắt."""
        suggested = [p for p in products if p.get('MaSanPham') in [1, 2] or 'Solitaire' in p.get('TenSanPham', '') or 'Eternity' in p.get('TenSanPham', '')]
        return reply, format_products_for_chat(suggested)

    elif intent == 'warranty_policy':
        reply = """🛡️ **CHÍNH SÁCH BẢO HÀNH & KIỂM ĐỊNH KIM HOÀN TẠI AURA:**
- **Chứng thư kiểm định GIA:** 100% kim cương tự nhiên từ 3.6 ly trở lên đều có giấy kiểm định quốc tế GIA minh bạch (mã số khắc laser trên cạnh kim cương).
- **Vàng đủ tuổi 100%:** Cam kết đúng hàm lượng vàng 18K (750) và 24K (999.9), đền bù 200% nếu phát hiện sai lệch.
- **Bảo hành trọn đời:** Miễn phí đánh bóng, làm mới, làm sạch siêu âm và gắn đá tấm trọn đời.
- **Chính sách thu đổi minh bạch:** Thu đổi từ **70% - 80%** giá trị sản phẩm theo quy chế bảo hành kim hoàn cao cấp."""
        return reply, []

    elif intent == 'shipping_policy':
        reply = """🚚 **CHÍNH SÁCH GIAO HÀNG & VẬN CHUYỂN BẢO HIỂM AURA:**
- **Miễn phí vận chuyển 100%:** Áp dụng cho mọi đơn hàng từ **5.000.000 ₫** trở lên trên toàn quốc.
- **Giao hỏa tốc:** 
  * Nội thành TP.HCM & Hà Nội: Giao chuyên biệt bằng xe bảo mật trong **2 - 4 giờ**.
  * Các tỉnh thành khác: Giao bảo đảm bảo hiểm 100% qua chuyển phát nhanh trong **24 - 48 giờ**.
- **Đồng kiểm & Niêm phong:** Quý khách được mở kiểm tra hộp nhung niêm phong, kiểm tra giấy kiểm định GIA trước khi thanh toán."""
        return reply, []

    elif intent == 'voucher_promo':
        reply = """🎁 **ĐẶC QUYỀN ƯU ĐÃI & MÃ GIẢM GIÁ AURA HIỆN TẠI:**
1. **Mã AURA2026:** Giảm ngay **10%** giá trị đơn hàng (tối đa 500.000 ₫), áp dụng cho toàn bộ bộ sưu tập online.
2. **Mã LUXURYVIP:** Giảm **15%** (tối đa 2.500.000 ₫) cho đơn hàng từ 15.000.000 ₫.
3. **Mã GIAM100K:** Giảm ngay 100.000 ₫ cho đơn từ 1.000.000 ₫.
✨ *Cách sử dụng:* Quý khách chỉ cần nhập mã tại trang Giỏ Hàng hoặc bước Thanh Toán để được trừ trực tiếp vào tổng tiền!"""
        return reply, []

    elif intent == 'men_jewelry':
        reply = """🎩 **BỘ SƯU TẬP TRANG SỨC DÀNH RIÊNG CHO PHÁI MẠNH:**
Trang sức nam tại AURA hướng đến sự uy quyền, mạnh mẽ và lịch lãm:
- **Nhẫn Nam Kim Cương Signet Black Onyx:** Vàng hồng 18K đúc đặc kết hợp mặt đá Onyx đen bóng huyền bí và viên kim cương chủ góc cạnh sắc nét, tôn vinh đẳng cấp của quý ông thành đạt."""
        suggested = [p for p in products if p.get('DoiTuong') == 'Nam']
        return reply, format_products_for_chat(suggested)

    elif intent == 'gemstone_fengshui':
        reply = """👑 **BỘ SƯU TẬP ĐÁ QUÝ HOÀNG GIA & PHONG THỦY:**
Mỗi viên đá quý tự nhiên tại AURA đều mang năng lượng phong thủy trường tồn và giá trị thẩm mỹ xa hoa:
- **Nhẫn Nữ Ruby Huyết Bồ Câu Passionate:** Viên đá Ruby đỏ thắm giác Oval rực rỡ, biểu trưng cho ngọn lửa may mắn, thịnh vượng và quyền lực.
- **Dây Chuyền Sapphire Xanh Hoàng Gia:** Tựa ánh biển thẳm bao bọc bởi dải kim cương kép, biểu trưng cho trí tuệ và sự bình an.
- **Bông Tai Ngọc Trai South Sea 18K:** Ánh xà cừ thuần khiết tôn vinh nét đẹp kiêu sa của quý cô."""
        suggested = [p for p in products if p.get('MaSanPham') in [10, 7, 5] or any(k in p.get('TenSanPham', '') for k in ['Ruby', 'Sapphire', 'Ngọc Trai'])]
        return reply, format_products_for_chat(suggested)

    elif intent == 'greeting':
        reply = """Kính chào quý khách! Tôi là **AuraStylist** - Cố vấn kim hoàn cao cấp tại thương hiệu trang sức thượng lưu **AURA Haute Joaillerie**.
Tôi có thể hỗ trợ quý khách:
- 💍 Tư vấn chọn nhẫn cầu hôn & nhẫn cưới kim cương chuẩn GIA
- 📏 Hướng dẫn đo kích thước ni tay nhẫn chuẩn xác tại nhà
- 👑 Gợi ý trang sức đá quý phong thủy (Ruby, Sapphire, Ngọc trai)
- 💰 Tìm kiếm trang sức theo mức ngân sách mong muốn

Quý khách đang tìm kiếm món trang sức cho bản thân hay làm quà tặng đặc biệt?"""
        return reply, []

    return "Chào quý khách, AURA hân hạnh được phục vụ bạn!", []

def build_deepseek_system_prompt(products):
    """Tạo System Prompt chi tiết với toàn bộ danh mục sản phẩm từ MySQL cho DeepSeek."""
    catalog_lines = []
    for p in products:
        price_str = f"{int(p.get('GiaMin') or p.get('GiaCoSo', 0)):,.0f}".replace(',', '.') + ' ₫'
        catalog_lines.append(
            f"- [{p['TenSanPham']}] (Mã SP: {p['MaSanPham']}) | Chất liệu: {p['ChatLieu']} | Phong cách: {p.get('PhongCach', 'Sang trọng')} | Đối tượng: {p.get('DoiTuong', 'Mọi khách')} | Giá từ: {price_str}"
        )
    catalog_text = "\n".join(catalog_lines)

    return f"""Bạn là AuraStylist - Cố vấn kim hoàn cao cấp của thương hiệu trang sức thượng lưu AURA Haute Joaillerie (Việt Nam).
Khách hàng đặt câu hỏi chuyên sâu, so sánh, tư vấn thiết kế hoặc câu hỏi mở KHÔNG CÓ TRONG FORM CỐ ĐỊNH.
Mô hình Machine Learning (Logistic Regression) đã xác định câu hỏi này cần sự suy luận tự nhiên của DeepSeek LLM.
Nhiệm vụ của bạn là đưa ra lời khuyên quý phái, chân thành, sắc bén và am hiểu sâu sắc về đá quý kim hoàn.

DANH MỤC TRANG SỨC THỰC TẾ TRONG CỬA HÀNG AURA:
{catalog_text}

QUY TẮC PHỤC VỤ KHÁCH HÀNG:
1. Hãy đề cập các mẫu trang sức có tên chính xác trong danh mục trên nếu phù hợp với nội dung câu hỏi.
2. Tiêu chuẩn kim cương: 100% GIA kiểm định quốc tế, giác cắt Excellent, nước màu D-F siêu trắng.
3. Hậu mãi & Voucher: Bảo hành làm mới & đánh bóng miễn phí trọn đời, miễn phí vận chuyển từ 5 triệu, mã ưu đãi AURA2026 giảm 10%.
4. Giọng văn: Quý tộc, trang nhã, ân cần ("Kính chào quý khách", "AURA rất hân hạnh được đồng hành...", "chúc quý khách...").
5. Định dạng Markdown rõ ràng, thêm emoji trang sức tinh tế (💎, 💍, ✨, 👑).
"""

def match_products_in_text(text, products):
    """Tìm sản phẩm được DeepSeek đề cập để hiển thị thẻ sản phẩm."""
    matched = []
    text_lower = text.lower()
    for p in products:
        if (p['TenSanPham'].lower() in text_lower or f"sp-{p['MaSanPham']}" in text_lower) and len(matched) < 4:
            matched.append({
                'name': p['TenSanPham'],
                'slug': p.get('Slug') or f"sp-{p['MaSanPham']}",
                'price': int(p.get('GiaMin') or p.get('GiaCoSo', 0)),
                'image': p.get('HinhAnhChinh') or 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
                'material': p['ChatLieu']
            })
    return matched

def deepseek_local_simulator(user_msg, products, context_dict, model_name, has_key):
    """Mô phỏng tư duy của DeepSeek khi câu hỏi mở không có form sẵn và chưa có API key trực tiếp."""
    context_note = ""
    if context_dict and (context_dict.get('budget') or context_dict.get('style')):
        context_note = f" với ngân sách {context_dict.get('budget', '')} và phong cách {context_dict.get('style', '')}"

    reply = f"""Kính chào quý khách! Tôi là **AuraStylist - Trợ lý kim hoàn DeepSeek AI**.
Mô hình **Logistic Regression Intent Classifier** đã phân tích câu hỏi của quý khách (*"{user_msg}"*{context_note}) là câu hỏi chuyên sâu mang tính tư vấn cá nhân hóa (không thuộc form sẵn có).

💎 **GÓC NHÌN & LỜI KHUYÊN TỪ DEEPSEEK AI:**
- Khi lựa chọn trang sức cao cấp theo yêu cầu đặc biệt, AURA khuyên bạn nên tập trung vào ba tiêu chí: **Độ tinh khiết kim loại quý (Vàng 18K/Bạch kim Pt950)**, **Giác cắt đối xứng hoàn mỹ (Excellent Cut)** và **Ý nghĩa phong thủy hòa hợp với bản mệnh của chủ nhân**.
- Đối với nhu cầu độc bản của bạn, những tuyệt tác chế tác thủ công nạm kim cương tự nhiên và đá quý của AURA sẽ là sự lựa chọn sang trọng vượt thời gian.

✨ Dưới đây là những mẫu trang sức tiêu biểu được đề xuất dành riêng cho bạn:"""

    suggested = [p for p in products if p.get('LaNoiBat') == 1][:3]
    return {
        'success': True,
        'reply': reply,
        'products': format_products_for_chat(suggested),
        'engine': 'DeepSeek Local Engine (Out-of-Form Fallback)',
        'model': f"DeepSeek ({model_name})",
        'is_live_ai': False,
        'has_api_key': has_key
    }

def call_deepseek_api(user_message, products, context_dict=None):
    """Gửi yêu cầu tới DeepSeek API (deepseek-chat hoặc deepseek-reasoner)."""
    cfg = get_deepseek_config()
    api_key = cfg['api_key']
    base_url = cfg['base_url']
    model = cfg['model'] or 'deepseek-chat'

    user_query = user_message.strip()
    if context_dict:
        extra_info = []
        if context_dict.get('occasion'): extra_info.append(f"Dịp: {context_dict['occasion']}")
        if context_dict.get('budget'): extra_info.append(f"Ngân sách: {context_dict['budget']}")
        if context_dict.get('style'): extra_info.append(f"Gu phong cách: {context_dict['style']}")
        if context_dict.get('finger_size'): extra_info.append(f"Size ni tay: {context_dict['finger_size']}")
        if extra_info:
            user_query += f"\n(Thông tin bổ sung từ bộ lọc khách hàng: {', '.join(extra_info)})"

    if api_key:
        try:
            system_prompt = build_deepseek_system_prompt(products)
            endpoint = f"{base_url}/chat/completions"
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_query}
                ],
                "temperature": 0.7,
                "max_tokens": 1200
            }
            resp = requests.post(endpoint, headers=headers, json=payload, timeout=25)
            if resp.status_code == 200:
                data = resp.json()
                reply_text = data['choices'][0]['message']['content']
                matched_prods = match_products_in_text(reply_text, products)
                return {
                    'success': True,
                    'reply': reply_text,
                    'products': matched_prods,
                    'engine': 'DeepSeek-LLM (Cloud API)',
                    'model': f"DeepSeek ({model})",
                    'is_live_ai': True
                }
            else:
                print(f"DeepSeek API Error: {resp.status_code} - {resp.text}")
        except Exception as e:
            print(f"DeepSeek Connection Exception: {e}")

    return deepseek_local_simulator(user_message, products, context_dict, model, bool(api_key))

def generate_deepseek_consultation(user_message, context_dict=None):
    """
    Quy trình điều phối quyết định Intent và Response:
    1. Sử dụng mô hình Machine Learning Logistic Regression:
       - Nếu khớp form sẵn -> Phản hồi kịch bản chuyên gia tức thì.
    2. Nếu không khớp form sẵn -> Gọi DeepSeek LLM phân tích mở.
    """
    try:
        products = query_all("""
            SELECT sp.*, dm.TenDanhMuc, MIN(bt.GiaBan) as GiaMin,
                   (SELECT DuongDanAnh FROM hinhanhsanpham ha WHERE ha.MaSanPham = sp.MaSanPham ORDER BY ha.ThuTuHienThi ASC LIMIT 1) AS HinhAnhChinh
            FROM sanpham sp
            JOIN danhmuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
            LEFT JOIN bienthesanpham bt ON sp.MaSanPham = bt.MaSanPham
            WHERE sp.TrangThai = 'DangBan'
            GROUP BY sp.MaSanPham
        """)
    except Exception as e:
        print(f"Error fetching products for AI: {e}")
        products = []

    intent_pred = predict_intent_logistic_regression(user_message)

    if intent_pred['matched']:
        intent = intent_pred['intent']
        reply, suggested_prods = generate_intent_form_response(intent, user_message, products)
        return {
            'success': True,
            'reply': reply,
            'products': suggested_prods,
            'engine': 'Logistic Regression (ML Classifier)',
            'intent': intent,
            'intent_name': intent_pred['intent_name'],
            'confidence': intent_pred['confidence'],
            'model': f"Logistic Regression [Độ tin cậy: {intent_pred['confidence']}%]"
        }

    deepseek_res = call_deepseek_api(user_message, products, context_dict)
    deepseek_res['intent'] = 'open_deepseek_consultation'
    deepseek_res['intent_name'] = 'DeepSeek LLM Phân Tích Mở'
    deepseek_res['confidence'] = intent_pred['confidence']
    return deepseek_res
