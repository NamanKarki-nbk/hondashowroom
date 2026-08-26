import json

with open('/home/max1ie/.gemini/antigravity/brain/f148fe05-1334-4f43-ba1c-374790a3882e/.system_generated/logs/transcript_full.jsonl', 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'USER_INPUT':
                content = data.get('content', '')
                if 'ez6500' in content.lower() or 'eg 1000' in content.lower() or 'hornet' in content.lower() or 'nx 200' in content.lower() or 'ez3000' in content.lower():
                    print("--- USER INPUT ---")
                    print(content)
        except Exception as e:
            pass
