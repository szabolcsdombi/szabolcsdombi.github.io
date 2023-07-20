import os

routes = [
]

index = open('/web/index.html', 'rb').read()
open('/web/404.html', 'wb').write(index)

for route in routes:
    filename = os.path.join('/web/', route, 'index.html')
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    open(filename, 'wb').write(index)
