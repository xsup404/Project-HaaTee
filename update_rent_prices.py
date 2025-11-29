import json
import random

# Load properties
with open('src/data/properties.json', 'r', encoding='utf-8') as f:
    properties = json.load(f)

# Update rent prices
for prop in properties:
    if prop.get('listingType') == 'rent':
        # Generate realistic monthly rent prices based on type and size
        prop_type = prop.get('type', '')
        beds = prop.get('beds', 2)
        
        # Different price ranges per type
        rent_ranges = {
            'บ้านเดี่ยว': (15000, 80000),
            'คอนโด': (8000, 50000),
            'ทาวน์เฮาส์': (10000, 60000),
            'บ้านแฝด': (12000, 70000),
            'วิลล่า': (25000, 150000),
            'บ้านลิเวอรี่': (20000, 100000),
            'ห้องชุด': (6000, 30000),
            'อพาร์ตเมนต์': (5000, 25000),
            'สตูดิโอ': (4000, 15000),
        }
        
        min_price, max_price = rent_ranges.get(prop_type, (8000, 50000))
        
        # Adjust by beds
        if beds > 3:
            min_price = int(min_price * 1.5)
            max_price = int(max_price * 1.3)
        elif beds < 2:
            min_price = int(min_price * 0.7)
            max_price = int(max_price * 0.8)
        
        # Generate rent price (round to nearest 500)
        rent_price = random.randint(min_price, max_price)
        rent_price = round(rent_price / 500) * 500
        
        prop['rentPrice'] = rent_price
        prop['priceValue'] = rent_price
        
        # Update price display
        prop['price'] = f"฿{rent_price:,}/เดือน"

# Save back
with open('src/data/properties.json', 'w', encoding='utf-8') as f:
    json.dump(properties, f, ensure_ascii=False, indent=2)

print(f"✅ อัปเดต {len([p for p in properties if p.get('listingType') == 'rent'])} รายการเช่าแล้ว")
