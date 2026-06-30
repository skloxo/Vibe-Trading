import os
import glob
import re
from pathlib import Path

tests_dir = "/home/skloxo/aho/openclaw/project/Vibe-Trading/agent/tests"
py_files = glob.glob(os.path.join(tests_dir, "**/*.py"), recursive=True)

modified_files = []

for filepath in py_files:
    path = Path(filepath)
    if not path.is_file():
        continue
    
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
        
    original = content
    
    # Replace .vibe-trading ONLY if it is not already followed by -cnx
    content = re.sub(r'\.vibe-trading(?!-cnx)', '.vibe-trading-cnx', content)
    
    if content != original:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        modified_files.append(filepath)

print(f"Successfully modified {len(modified_files)} test files:")
for f in modified_files:
    print(f" - {f}")
