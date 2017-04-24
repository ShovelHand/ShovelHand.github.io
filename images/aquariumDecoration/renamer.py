import os
[os.rename(f, f.replace('jpg', 'JPG')) for f in os.listdir('.') if not f.startswith('.')]
