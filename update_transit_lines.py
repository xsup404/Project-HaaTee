import json

# Map district/location to correct BTS/MRT line
district_to_line = {
    # BTS Green Line (สายเขียว)
    'สามเสน': {'line': 'BTS สายเขียว', 'color': 'green'},
    'หลักสี่': {'line': 'BTS สายเขียว', 'color': 'green'},
    'จตุจักร': {'line': 'BTS สายเขียว', 'color': 'green'},
    'พหลโยธิน': {'line': 'BTS สายเขียว', 'color': 'green'},
    'ชิดลม': {'line': 'BTS สายเขียว', 'color': 'green'},
    'เอกมัย': {'line': 'BTS สายเขียว', 'color': 'green'},
    'สุขุมวิท': {'line': 'BTS สายเขียว', 'color': 'green'},
    'พระโขนง': {'line': 'BTS สายเขียว', 'color': 'green'},
    
    # BTS Purple Line (สายม่วง)
    'อนุสาวรีย์': {'line': 'BTS สายม่วง', 'color': 'purple'},
    'วงศ์สวรรค์': {'line': 'BTS สายม่วง', 'color': 'purple'},
    'บ้านสวรรค์': {'line': 'BTS สายม่วง', 'color': 'purple'},
    'อินทรพาลวัลย์': {'line': 'BTS สายม่วง', 'color': 'purple'},
    'ชั้นสิบ': {'line': 'BTS สายม่วง', 'color': 'purple'},
    'บ้านท่อม': {'line': 'BTS สายม่วง', 'color': 'purple'},
    'ตลิ่งชัน': {'line': 'BTS สายม่วง', 'color': 'purple'},
    
    # BTS Orange Line (สายส้ม)
    'สุทัศน์': {'line': 'BTS สายส้ม', 'color': 'orange'},
    'มีนบุรี': {'line': 'BTS สายส้ม', 'color': 'orange'},
    'ศาสตร์': {'line': 'BTS สายส้ม', 'color': 'orange'},
    'ราชเทวะ': {'line': 'BTS สายส้ม', 'color': 'orange'},
    'สะพานแควน้อย': {'line': 'BTS สายส้ม', 'color': 'orange'},
    'ตลาดบางกะปิ': {'line': 'BTS สายส้ม', 'color': 'orange'},
    'บ้านทับ': {'line': 'BTS สายส้ม', 'color': 'orange'},
    
    # BTS Pink Line (สายชมพู)
    'บางซื่อ': {'line': 'BTS สายชมพู', 'color': 'pink'},
    'ป้อมปราณ': {'line': 'BTS สายชมพู', 'color': 'pink'},
    'ลำสาลี': {'line': 'BTS สายชมพู', 'color': 'pink'},
    'คูคต': {'line': 'BTS สายชมพู', 'color': 'pink'},
    'ขอนแก่น': {'line': 'BTS สายชมพู', 'color': 'pink'},
    
    # MRT Blue Line (สายน้ำเงิน)
    'ลาดพร้าว': {'line': 'MRT สายน้ำเงิน', 'color': 'blue'},
    'ราษฎร์บูรณะ': {'line': 'MRT สายน้ำเงิน', 'color': 'blue'},
    'สิลป์': {'line': 'MRT สายน้ำเงิน', 'color': 'blue'},
    'ลุมพินี': {'line': 'MRT สายน้ำเงิน', 'color': 'blue'},
    'เสนานิเวศน์': {'line': 'MRT สายน้ำเงิน', 'color': 'blue'},
    
    # MRT Red Line (สายแดง)
    'สาทร': {'line': 'MRT สายแดง', 'color': 'red'},
    'ระยอง': {'line': 'MRT สายแดง', 'color': 'red'},
    'สาธารณสุข': {'line': 'MRT สายแดง', 'color': 'red'},
    'ฟ้าแผ่นดิน': {'line': 'MRT สายแดง', 'color': 'red'},
    'สระแก้ว': {'line': 'MRT สายแดง', 'color': 'red'},
    
    # Other locations
    'ปทุมวัน': {'line': 'BTS สายเขียว', 'color': 'green'},
    'สยาม': {'line': 'BTS สายเขียว', 'color': 'green'},
    'เชียงใหม่': {'line': 'BTS สายม่วง', 'color': 'purple'},
    'ภูเก็ต': {'line': 'BTS สายม่วง', 'color': 'purple'},
    'นนทบุรี': {'line': 'BTS สายม่วง', 'color': 'purple'},
    'บ้านจันทร์': {'line': 'BTS สายเขียว', 'color': 'green'},
}

# Read properties
with open('src/data/properties.json', 'r', encoding='utf-8') as f:
    props = json.load(f)

# Update each property with correct line based on location/district
updated = 0
for p in props:
    location = p.get('location', '')
    district = p.get('district', location)
    
    # Find matching line mapping
    line_info = district_to_line.get(location) or district_to_line.get(district)
    
    if line_info:
        p['transitLine'] = line_info['line']
        p['transitLineColor'] = line_info['color']
        updated += 1

# Write back
with open('src/data/properties.json', 'w', encoding='utf-8') as f:
    json.dump(props, f, ensure_ascii=False, indent=2)

print(f'✅ อัปเดตสำเร็จ: {updated} รายการ')
