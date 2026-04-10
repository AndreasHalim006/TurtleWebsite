#!/usr/bin/env python3
import re
import os

src_dir = '/home/iason/workbench/TurtleWebsite/src'
files = ['about.html', 'garage.html', 'divisions.html', 'partners.html', 'recruitment.html', 'contact.html']

logo_nav = '''<a href="index.html" class="flex items-center gap-3">
  <img src="assets/images/Logo-Full_WHITE-scaled-500x500.png" alt="Aristurtle Logo" class="h-10 w-auto"/>
  <span class="text-2xl font-bold tracking-tighter text-white font-headline">ARISTURTLE</span>
</a>'''

mobile_menu = '''</div>
  <button class="md:hidden text-white mobile-menu-btn"><span class="material-symbols-outlined">menu</span></button>
</div>
<!-- Mobile Menu -->
<div class="mobile-menu hidden md:hidden bg-neutral-950 border-t border-outline-variant/20">
  <div class="flex flex-col px-8 py-4 gap-4">
    <a class="text-neutral-400 hover:text-white uppercase text-sm" href="index.html">Home</a>
    <a class="text-neutral-400 hover:text-white uppercase text-sm" href="about.html">About</a>
    <a class="text-neutral-400 hover:text-white uppercase text-sm" href="garage.html">Cars</a>
    <a class="text-neutral-400 hover:text-white uppercase text-sm" href="divisions.html">Divisions</a>
    <a class="text-neutral-400 hover:text-white uppercase text-sm" href="partners.html">Partners</a>
    <a class="text-neutral-400 hover:text-white uppercase text-sm" href="recruitment.html">Recruitment</a>
    <a class="text-neutral-400 hover:text-white uppercase text-sm" href="contact.html">Contact</a>
  </div>
</div>
</nav>'''

for filename in files:
    filepath = os.path.join(src_dir, filename)
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Fix broken class attributes
    content = re.sub(r'href="([^"]+)"\s*">([^<]+)</a>', r'href="\1">\2</a>', content)
    content = re.sub(r'class="text-orange-500 border-b-2 border-orange-500 pb-1"', r'class="text-secondary border-b-2 border-secondary pb-1"', content)
    
    # Replace ARISTURTLE text with logo
    content = re.sub(
        r'<div class="text-2xl font-bold tracking-tighter text-white font-headline">\s*ARISTURTLE\s*</div>',
        logo_nav,
        content
    )
    content = re.sub(
        r'<div class="text-2xl font-bold tracking-tighter text-white font-headline">ARISTURTLE</div>',
        logo_nav,
        content
    )
    
    # Add mobile menu button and dropdown
    # Find the nav closing pattern and replace
    content = re.sub(
        r'</div>\s*</nav>',
        mobile_menu,
        content,
        count=1
    )
    
    # Add JS before closing body
    content = content.replace('</body>', '<script src="js/main.js"></script>\n</body>')
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"Updated {filename}")

print("Done!")
