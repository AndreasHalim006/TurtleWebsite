#!/bin/bash
# Update all HTML files to use compiled CSS and fix navigation links

cd /home/iason/workbench/TurtleWebsite/src

# Files to process
FILES=("index.html" "about.html" "garage.html" "divisions.html" "partners.html" "recruitment.html" "contact.html")

for file in "${FILES[@]}"; do
  echo "Processing $file..."
  
  # Remove Tailwind CDN script
  sed -i '/<script src="https:\/\/cdn.tailwindcss.com/d' "$file"
  
  # Remove inline tailwind.config script (multi-line)
  sed -i '/<script id="tailwind-config">/,/<\/script>/d' "$file"
  
  # Remove inline style block with tailwind config
  sed -i '/<style>/,/<\/style>/d' "$file"
  
  # Add compiled CSS link after charset meta
  sed -i '/<meta charset="utf-8"\/>/a <link href="../dist/css/style.css" rel="stylesheet"/>' "$file"
  
  # Fix navigation links based on file
  case "$file" in
    "index.html")
      sed -i 's|href="#">Home</a>|href="index.html" class="text-secondary border-b-2 border-secondary pb-1">Home</a>|g' "$file"
      sed -i 's|href="#">About</a>|href="about.html">About</a>|g' "$file"
      sed -i 's|href="#">Cars</a>|href="garage.html">Cars</a>|g' "$file"
      sed -i 's|href="#">Divisions</a>|href="divisions.html">Divisions</a>|g' "$file"
      sed -i 's|href="#">Partners</a>|href="partners.html">Partners</a>|g' "$file"
      sed -i 's|href="#">Recruitment</a>|href="recruitment.html">Recruitment</a>|g' "$file"
      sed -i 's|href="#">Contact</a>|href="contact.html">Contact</a>|g' "$file"
      ;;
    "about.html")
      sed -i 's|href="#">Home</a>|href="index.html">Home</a>|g' "$file"
      sed -i 's|href="#">About</a>|href="about.html" class="text-secondary border-b-2 border-secondary pb-1">About</a>|g' "$file"
      sed -i 's|href="#">Cars</a>|href="garage.html">Cars</a>|g' "$file"
      sed -i 's|href="#">Divisions</a>|href="divisions.html">Divisions</a>|g' "$file"
      sed -i 's|href="#">Partners</a>|href="partners.html">Partners</a>|g' "$file"
      sed -i 's|href="#">Recruitment</a>|href="recruitment.html">Recruitment</a>|g' "$file"
      sed -i 's|href="#">Contact</a>|href="contact.html">Contact</a>|g' "$file"
      ;;
    "garage.html")
      sed -i 's|href="#">Home</a>|href="index.html">Home</a>|g' "$file"
      sed -i 's|href="#">About</a>|href="about.html">About</a>|g' "$file"
      sed -i 's|href="#">Cars</a>|href="garage.html" class="text-secondary border-b-2 border-secondary pb-1">Cars</a>|g' "$file"
      sed -i 's|href="#">Divisions</a>|href="divisions.html">Divisions</a>|g' "$file"
      sed -i 's|href="#">Partners</a>|href="partners.html">Partners</a>|g' "$file"
      sed -i 's|href="#">Recruitment</a>|href="recruitment.html">Recruitment</a>|g' "$file"
      sed -i 's|href="#">Contact</a>|href="contact.html">Contact</a>|g' "$file"
      ;;
    "divisions.html")
      sed -i 's|href="#">Home</a>|href="index.html">Home</a>|g' "$file"
      sed -i 's|href="#">About</a>|href="about.html">About</a>|g' "$file"
      sed -i 's|href="#">Cars</a>|href="garage.html">Cars</a>|g' "$file"
      sed -i 's|href="#">Divisions</a>|href="divisions.html" class="text-secondary border-b-2 border-secondary pb-1">Divisions</a>|g' "$file"
      sed -i 's|href="#">Partners</a>|href="partners.html">Partners</a>|g' "$file"
      sed -i 's|href="#">Recruitment</a>|href="recruitment.html">Recruitment</a>|g' "$file"
      sed -i 's|href="#">Contact</a>|href="contact.html">Contact</a>|g' "$file"
      ;;
    "partners.html")
      sed -i 's|href="#">Home</a>|href="index.html">Home</a>|g' "$file"
      sed -i 's|href="#">About</a>|href="about.html">About</a>|g' "$file"
      sed -i 's|href="#">Cars</a>|href="garage.html">Cars</a>|g' "$file"
      sed -i 's|href="#">Divisions</a>|href="divisions.html">Divisions</a>|g' "$file"
      sed -i 's|href="#">Partners</a>|href="partners.html" class="text-secondary border-b-2 border-secondary pb-1">Partners</a>|g' "$file"
      sed -i 's|href="#">Recruitment</a>|href="recruitment.html">Recruitment</a>|g' "$file"
      sed -i 's|href="#">Contact</a>|href="contact.html">Contact</a>|g' "$file"
      ;;
    "recruitment.html")
      sed -i 's|href="#">Home</a>|href="index.html">Home</a>|g' "$file"
      sed -i 's|href="#">About</a>|href="about.html">About</a>|g' "$file"
      sed -i 's|href="#">Cars</a>|href="garage.html">Cars</a>|g' "$file"
      sed -i 's|href="#">Divisions</a>|href="divisions.html">Divisions</a>|g' "$file"
      sed -i 's|href="#">Partners</a>|href="partners.html">Partners</a>|g' "$file"
      sed -i 's|href="#">Recruitment</a>|href="recruitment.html" class="text-secondary border-b-2 border-secondary pb-1">Recruitment</a>|g' "$file"
      sed -i 's|href="#">Contact</a>|href="contact.html">Contact</a>|g' "$file"
      ;;
    "contact.html")
      sed -i 's|href="#">Home</a>|href="index.html">Home</a>|g' "$file"
      sed -i 's|href="#">About</a>|href="about.html">About</a>|g' "$file"
      sed -i 's|href="#">Cars</a>|href="garage.html">Cars</a>|g' "$file"
      sed -i 's|href="#">Divisions</a>|href="divisions.html">Divisions</a>|g' "$file"
      sed -i 's|href="#">Partners</a>|href="partners.html">Partners</a>|g' "$file"
      sed -i 's|href="#">Recruitment</a>|href="recruitment.html">Recruitment</a>|g' "$file"
      sed -i 's|href="#">Contact</a>|href="contact.html" class="text-secondary border-b-2 border-secondary pb-1">Contact</a>|g' "$file"
      ;;
  esac
  
  # Fix footer links
  sed -i 's|href="#">Instagram</a>|href="https://instagram.com/aristurtle" target="_blank" rel="noopener">Instagram</a>|g' "$file"
  sed -i 's|href="#">LinkedIn</a>|href="https://linkedin.com/company/aristurtle" target="_blank" rel="noopener">LinkedIn</a>|g' "$file"
  sed -i 's|href="#">Facebook</a>|href="https://facebook.com/aristurtle" target="_blank" rel="noopener">Facebook</a>|g' "$file"
  sed -i 's|href="#">YouTube</a>|href="https://youtube.com/@aristurtle" target="_blank" rel="noopener">YouTube</a>|g' "$file"
  
done

echo "Done!"
