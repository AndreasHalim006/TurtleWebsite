import os
import glob
import re

sponsors_md_dir = r"src\content\sponsors"
sponsors_assets_dir = r"public\assets\sponsors"

# Mappings of subfolder to category key
folder_to_category = {
    "PLATINUM": "platinum",
    "GOLD": "gold",
    "SILVER": "silver",
    "bronze": "bronze",
    "labs": "academia"
}

def normalize(name):
    # lowercase, alphanumeric only
    return re.sub(r'[^a-z0-9]', '', name.lower())

def clean_name(filename):
    # remove extension, replace underscores/hyphens with spaces, capitalize words
    base = os.path.splitext(filename)[0]
    base = base.replace('_', ' ').replace('-', ' ')
    # capitalize words
    return ' '.join(word.capitalize() for word in base.split())

# Parse simple frontmatter
def parse_md(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # regex to match frontmatter between ---
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)$', content, re.DOTALL)
    if not match:
        return None
    
    fm_text, body = match.groups()
    data = {}
    for line in fm_text.split('\n'):
        line = line.strip()
        if not line or ':' not in line:
            continue
        key, val = line.split(':', 1)
        key = key.strip()
        val = val.strip()
        # strip quotes
        if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
            val = val[1:-1]
        data[key] = val
    return data, body

def write_md(filepath, data, body=""):
    fm_lines = ["---"]
    for key, val in data.items():
        # if val is boolean or number, don't quote, otherwise quote
        if val in ('true', 'false', True, False):
            fm_lines.append(f"{key}: {str(val).lower()}")
        elif isinstance(val, int) or (isinstance(val, str) and val.isdigit()):
            fm_lines.append(f"{key}: {val}")
        else:
            fm_lines.append(f'{key}: "{val}"')
    fm_lines.append("---")
    fm_lines.append(body)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(fm_lines) + '\n')

def main():
    # 1. Read existing markdown sponsors
    existing_sponsors = {}
    md_files = glob.glob(os.path.join(sponsors_md_dir, "*.md"))
    
    for filepath in md_files:
        parsed = parse_md(filepath)
        if not parsed:
            continue
        data, body = parsed
        basename = os.path.splitext(os.path.basename(filepath))[0]
        
        norm_filename = normalize(basename)
        norm_name = normalize(data.get('name', ''))
        
        sponsor_info = {
            'filepath': filepath,
            'basename': basename,
            'data': data,
            'body': body,
            'matched': False
        }
        
        existing_sponsors[norm_filename] = sponsor_info
        if norm_name not in existing_sponsors:
            existing_sponsors[norm_name] = sponsor_info

    # 2. Scan WebP files in assets
    webp_sponsors = []
    for folder, category in folder_to_category.items():
        folder_path = os.path.join(sponsors_assets_dir, folder)
        if not os.path.isdir(folder_path):
            continue
        webps = glob.glob(os.path.join(folder_path, "*.webp"))
        for webp_path in webps:
            filename = os.path.basename(webp_path)
            basename = os.path.splitext(filename)[0]
            webp_sponsors.append({
                'webp_path': webp_path,
                'basename': basename,
                'category': category,
                'logo_url': f"/assets/sponsors/{folder}/{filename}"
            })

    print(f"Loaded {len(webp_sponsors)} WebP logos from assets.")
    print(f"Loaded {len(md_files)} existing markdown files.")

    updated_count = 0
    created_count = 0
    deactivated_count = 0

    # 3. Match and Update/Create
    matched_paths = set()
    for webp in webp_sponsors:
        norm_webp = normalize(webp['basename'])
        
        # Try to find a match in existing sponsors
        match = None
        if norm_webp in existing_sponsors:
            match = existing_sponsors[norm_webp]
        
        if match:
            # Update existing sponsor
            data = match['data']
            data['category'] = webp['category']
            data['logo'] = webp['logo_url']
            data['active'] = 'true'
            # Keep original order, website, alt if present
            write_md(match['filepath'], data, match['body'])
            print(f"Updated: {match['basename']} -> {webp['logo_url']} (Category: {webp['category']})")
            match['matched'] = True
            matched_paths.add(match['filepath'])
            updated_count += 1
        else:
            # Create a new sponsor file
            new_basename = webp['basename'].lower().replace('_', '-').replace(' ', '-')
            new_filepath = os.path.join(sponsors_md_dir, f"{new_basename}.md")
            
            data = {
                'name': clean_name(webp['basename']),
                'category': webp['category'],
                'order': 1,
                'logo': webp['logo_url'],
                'website': 'https://www.aristurtle.gr/', # Default placeholder website
                'alt': 'Partner Logo',
                'active': 'true'
            }
            write_md(new_filepath, data)
            print(f"Created: {new_basename}.md -> {webp['logo_url']} (Category: {webp['category']})")
            created_count += 1

    # 4. Deactivate unmatched sponsors
    for filepath in md_files:
        if filepath not in matched_paths:
            parsed = parse_md(filepath)
            if not parsed:
                continue
            data, body = parsed
            if data.get('active') != 'false':
                data['active'] = 'false'
                write_md(filepath, data, body)
                print(f"Deactivated: {os.path.basename(filepath)}")
                deactivated_count += 1

    print("\n--- Summary ---")
    print(f"Created: {created_count}")
    print(f"Updated: {updated_count}")
    print(f"Deactivated: {deactivated_count}")

if __name__ == '__main__':
    main()
