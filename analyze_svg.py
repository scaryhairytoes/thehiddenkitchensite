import re

with open('public/logo_only.svg', encoding='utf-8') as f:
    content = f.read()

# The logo symbol appears at roughly center of the 1536x907 canvas
# Let's crop to a tight square around the center symbol
# Based on visual inspection: symbol is ~100x100 pixels centered at ~768, 453
# Let's crop to 200x200 around center to see
new_viewbox = "620 350 290 210"  # tight crop around center HK mark

# Update the viewBox attribute
updated = re.sub(r'viewBox="[^"]*"', f'viewBox="{new_viewbox}"', content)

# Also update width/height to be square-ish
updated = re.sub(r'width="[^"]*"', 'width="100%"', updated)
updated = re.sub(r'height="[^"]*"', 'height="100%"', updated)

with open('public/logo_only.svg', 'w', encoding='utf-8') as f:
    f.write(updated)

print("Done. New viewBox:", new_viewbox)
