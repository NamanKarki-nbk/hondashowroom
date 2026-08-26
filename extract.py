import json

with open('/home/max1ie/.gemini/antigravity/brain/f148fe05-1334-4f43-ba1c-374790a3882e/.system_generated/logs/transcript_full.jsonl', 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'USER_INPUT':
                content = data.get('content', '')
                if 'features' in content.lower() and ('eg 1000' in content.lower() or 'ez6500cxs' in content.lower() or 'ez3000cx' in content.lower() or 'hornet' in content.lower() or 'nx 200' in content.lower()):
                    print("--- MESSAGE ---")
                    print(content)
        except:
            pass
