import os
import glob

sponsors_dir = r"public\assets\sponsors"
categories = os.listdir(sponsors_dir)

for cat in categories:
    cat_path = os.path.join(sponsors_dir, cat)
    if os.path.isdir(cat_path):
        webps = glob.glob(os.path.join(cat_path, "*.webp"))
        print(f"Category: {cat} (has {len(webps)} webp files)")
        for w in webps[:10]:
            print(f"  {os.path.basename(w)}")
        if len(webps) > 10:
            print("  ...")
