#!/usr/bin/env python3
import re
import os

src_dir = '/home/iason/workbench/TurtleWebsite/src'
files = ['index.html', 'about.html', 'garage.html', 'divisions.html', 'partners.html', 'recruitment.html', 'contact.html']

# New logo HTML - smaller horizontal logo
new_logo = '<a href="index.html" class="flex items-center"><img src="assets/images/logo-horizontal.png" alt="Aristurtle Logo" class="h-8 w-auto"/></a>'

for filename in files:
    filepath = os.path.join(src_dir, filename)
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Replace the old logo block (multiline) with new smaller logo
    # Pattern matches the entire logo link block
    pattern = r'<a href="index\.html" class="flex items-center gap-3">\s*<img src="assets/images/Logo-Full_WHITE-scaled-500x500\.png" alt="Aristurtle Logo" class="h-10 w-auto"/>\s*<span class="text-2xl font-bold tracking-tighter text-white font-headline">ARISTURTLE</span>\s*</a>'
    
    content = re.sub(pattern, new_logo, content)
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"Updated {filename}")

print("Done!")
