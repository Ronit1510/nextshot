import os

def search_dir(directory):
    for root, dirs, files in os.walk(directory):
        # Exclude directories we don't want to search
        dirs[:] = [d for d in dirs if d not in ('node_modules', '.next', '.git')]
        for file in files:
            full_path = os.path.join(root, file)
            try:
                with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    if 'nextshort' in content.lower():
                        print(f"FOUND IN: {full_path}")
                        lines = content.splitlines()
                        for i, line in enumerate(lines):
                            if 'nextshort' in line.lower():
                                print(f"  Line {i+1}: {line.strip()}")
            except Exception as e:
                pass

search_dir('.')
