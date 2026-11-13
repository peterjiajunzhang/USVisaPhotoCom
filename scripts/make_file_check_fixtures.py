"""Create synthetic, non-portrait fixtures with macOS sips. Usage: script DIR."""
from pathlib import Path
import subprocess
import sys

target = Path(sys.argv[1])
target.mkdir(parents=True, exist_ok=True)
for name, width, height in [('valid600', 600, 600), ('valid1200', 1200, 1200), ('small599', 599, 599), ('wide', 800, 600)]:
    source = target / (name + '.ppm')
    source.write_bytes(f'P6\n{width} {height}\n255\n'.encode() + bytes([242, 245, 248]) * (width * height))
    subprocess.run(['sips', '-s', 'format', 'jpeg', str(source), '--out', str(target / (name + '.jpg'))], check=True, capture_output=True)
base = (target / 'valid600.jpg').read_bytes()
for size in [240000, 240001]:
    (target / f'bytes{size}.jpg').write_bytes(base + b'\0' * (size - len(base)))
subprocess.run(['sips', '-s', 'format', 'png', str(target / 'valid600.jpg'), '--out', str(target / 'renamed.jpg')], check=True, capture_output=True)
(target / 'corrupt.jpg').write_bytes(b'\xff\xd8\xff\xc0\0')
(target / 'too-large.jpg').write_bytes(b'\0' * (10 * 1024 * 1024 + 1))
