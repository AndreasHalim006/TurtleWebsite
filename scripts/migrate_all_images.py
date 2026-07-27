import sys
import os
import re
import urllib.request
import urllib.parse
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = Path(r"c:\Aristurtle-site-LOCAL")
SEASONS_DIR = ROOT_DIR / "src" / "content" / "seasons"
SPONSORS_DIR = ROOT_DIR / "src" / "content" / "sponsors"
PUBLIC_MEMBERS_DIR = ROOT_DIR / "public" / "assets" / "members"
PUBLIC_SPONSORS_DIR = ROOT_DIR / "public" / "assets" / "sponsors"

PUBLIC_MEMBERS_DIR.mkdir(parents=True, exist_ok=True)
PUBLIC_SPONSORS_DIR.mkdir(parents=True, exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def safe_download(url, dest_path):
    if dest_path.exists() and dest_path.stat().st_size > 0:
        return True
    try:
        parsed = urllib.parse.urlparse(url)
        encoded_path = urllib.parse.quote(parsed.path)
        encoded_url = urllib.parse.urlunparse((parsed.scheme, parsed.netloc, encoded_path, parsed.params, parsed.query, parsed.fragment))
        
        req = urllib.request.Request(encoded_url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp, open(dest_path, 'wb') as f:
            f.write(resp.read())
        print(f"Downloaded: {dest_path.name}")
        return True
    except Exception as e:
        print(f"ERROR downloading {url} -> {e}")
        return False

# 1. Process Seasons
for season_file in SEASONS_DIR.glob("*.md"):
    season_name = season_file.stem
    season_asset_dir = PUBLIC_MEMBERS_DIR / season_name
    season_asset_dir.mkdir(parents=True, exist_ok=True)
    
    content = season_file.read_text(encoding="utf-8")
    urls = set(re.findall(r'https?://aristurtle\.gr/wp-content/uploads/[^\s"\']+', content))
    
    replacements = {}
    for url in urls:
        parsed_url = urllib.parse.unquote(url)
        filename = Path(parsed_url).name
        clean_filename = re.sub(r'[^\w\.-]', '_', filename)
        dest_path = season_asset_dir / clean_filename
        
        if safe_download(url, dest_path):
            local_path = f"/assets/members/{season_name}/{clean_filename}"
            replacements[url] = local_path
            
    for old_url, new_path in replacements.items():
        content = content.replace(old_url, new_path)
        
    season_file.write_text(content, encoding="utf-8")

# 2. Process Sponsors
for sponsor_file in SPONSORS_DIR.glob("*.md"):
    content = sponsor_file.read_text(encoding="utf-8")
    urls = set(re.findall(r'https?://aristurtle\.gr/wp-content/uploads/[^\s"\']+', content))
    
    replacements = {}
    for url in urls:
        parsed_url = urllib.parse.unquote(url)
        filename = Path(parsed_url).name
        clean_filename = re.sub(r'[^\w\.-]', '_', filename)
        dest_path = PUBLIC_SPONSORS_DIR / clean_filename
        
        if safe_download(url, dest_path):
            local_path = f"/assets/sponsors/{clean_filename}"
            replacements[url] = local_path
            
    for old_url, new_path in replacements.items():
        content = content.replace(old_url, new_path)
        
    sponsor_file.write_text(content, encoding="utf-8")

print("ALL ASSETS MIGRATION COMPLETED SUCCESSFULLY!")
