import sys
import urllib.request
import json

sys.stdout.reconfigure(encoding='utf-8')

test_cases = [
    'hướng dẫn đo ni tay ngón tay',
    'mình muốn mua nhẫn cầu hôn bạn gái',
    'kim cương có giấy chứng thư GIA không',
    'phí ship về đà nẵng bao nhiêu',
    'mã giảm giá hôm nay có gì',
    'cho tôi xem mẫu nhẫn nam quý ông',
    'Hãy so sánh độ cứng theo thang Mohs giữa kim cương tự nhiên và Sapphire khi làm trang sức truyền đời'
]

for q in test_cases:
    req = urllib.request.Request(
        'http://127.0.0.1:5000/api/ai-consultant',
        data=json.dumps({'message': q}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    res = urllib.request.urlopen(req)
    d = json.loads(res.read().decode('utf-8'))
    print(f"Câu hỏi: {q}")
    print(f"   -> Động cơ: {d.get('engine')}")
    print(f"   -> Intent : {d.get('intent_name')} [Độ tin cậy: {d.get('confidence', 0)}%]")
    print(f"   -> Số sản phẩm đính kèm: {len(d.get('products', []))}")
    print("-" * 65)
