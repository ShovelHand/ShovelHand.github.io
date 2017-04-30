import os
[os.rename(f, f.replace('2016-05-', '')) for f in os.listdir('.') if not f.startswith('.')]
