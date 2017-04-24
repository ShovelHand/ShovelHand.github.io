import os
[os.rename(f, f.replace('JPG', 'jpg')) for f in os.listdir('.') if not f.startswith('.')]
