#!/bin/bash
# Update all HTML files with consistent navbar, mobile menu, and footer

cd /home/iason/workbench/TurtleWebsite/src

FILES=("about.html" "garage.html" "divisions.html" "partners.html" "recruitment.html" "contact.html")

for file in "${FILES[@]}"; do
  echo "Updating $file..."
  
  # Fix duplicate class attributes in nav links (remove the second class="...")
  sed -i 's|class="text-secondary border-b-2 border-secondary pb-1">|">|g' "$file"
  sed -i 's|class="text-orange-500 border-b-2 border-orange-500 pb-1" href|class="text-secondary border-b-2 border-secondary pb-1" href|g' "$file"
  
  # Replace ARISTURTLE text with logo + text
  sed -i 's|<div class="text-2xl font-bold tracking-tighter text-white font-headline">ARISTURTLE</div>|<a href="index.html" class="flex items-center gap-3"><img src="assets/images/Logo-Full_WHITE-scaled-500x500.png" alt="Aristurtle Logo" class="h-10 w-auto"/><span class="text-2xl font-bold tracking-tighter text-white font-headline">ARISTURTLE</span></a>|g' "$file"
  
  # Add mobile menu button before EN/GR
  sed -i 's|<div class="font-.*EN/GR.*</div>|&\n  <button class="md:hidden text-white mobile-menu-btn"><span class="material-symbols-outlined">menu</span></button>|g' "$file"
  sed -i 's|<span class="font-headline font-bold text-xs tracking-widest text-secondary">EN/GR</span>|&\n    <button class="md:hidden text-white mobile-menu-btn"><span class="material-symbols-outlined">menu</span></button>|g' "$file"
  sed -i 's|<span class="font-\['"'"'Space_Grotesk'"'"'\] tracking-tight font-bold uppercase text-xs text-secondary">EN/GR</span>|&\n    <button class="md:hidden text-white mobile-menu-btn"><span class="material-symbols-outlined">menu</span></button>|g' "$file"
  sed -i 's|<div class="text-neutral-400 font-headline text-sm font-bold uppercase tracking-widest">EN/GR</div>|&\n  <button class="md:hidden text-white mobile-menu-btn"><span class="material-symbols-outlined">menu</span></button>|g' "$file"
  sed -i 's|<div class="font-\['"'"'Space_Grotesk'"'"'\] font-bold text-sm text-on-surface-variant">EN/GR</div>|&\n  <button class="md:hidden text-white mobile-menu-btn"><span class="material-symbols-outlined">menu</span></button>|g' "$file"
  
  # Add mobile menu div after nav closing div (before </nav>)
  sed -i '/<\/div>\n<\/nav>/i <!-- Mobile Menu -->\n<div class="mobile-menu hidden md:hidden bg-neutral-950 border-t border-outline-variant\/20">\n  <div class="flex flex-col px-8 py-4 gap-4">\n    <a class="text-neutral-400 hover:text-white uppercase text-sm" href="index.html">Home</a>\n    <a class="text-neutral-400 hover:text-white uppercase text-sm" href="about.html">About</a>\n    <a class="text-neutral-400 hover:text-white uppercase text-sm" href="garage.html">Cars</a>\n    <a class="text-neutral-400 hover:text-white uppercase text-sm" href="divisions.html">Divisions</a>\n    <a class="text-neutral-400 hover:text-white uppercase text-sm" href="partners.html">Partners</a>\n    <a class="text-neutral-400 hover:text-white uppercase text-sm" href="recruitment.html">Recruitment</a>\n    <a class="text-neutral-400 hover:text-white uppercase text-sm" href="contact.html">Contact</a>\n  </div>\n</div>' "$file"
  
  # Add JS script before closing body tag
  sed -i 's|</body>|<script src="js/main.js"></script>\n</body>|g' "$file"
  
done

echo "Done!"
