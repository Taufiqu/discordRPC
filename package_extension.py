import os
import zipfile

extension_dir = os.path.abspath('extension')
output_zip = os.path.abspath('extension.zip')

print(f"Packaging {extension_dir} into {output_zip} with standard POSIX paths...")

if os.path.exists(output_zip):
    os.remove(output_zip)

with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(extension_dir):
        for file in files:
            full_path = os.path.join(root, file)
            # Compute relative path and force forward slashes (/) for ZIP specification
            rel_path = os.path.relpath(full_path, extension_dir)
            arcname = rel_path.replace('\\', '/')
            zipf.write(full_path, arcname)
            print(f"  + Added: {arcname}")

print("\nSuccessfully created extension.zip with compliant forward-slash paths!")
