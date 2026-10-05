#!/bin/zsh
# Fotografias (Unsplash License). Origem registada em public/img/CREDITS.md
cd "$(dirname $0)/../public/img"
typeset -A IMG
IMG=(
hero photo-1563191848-b01d0258f1f9
plane photo-1639616322896-357c8e5a449a
plane2 photo-1657102432377-f4e2fe7d42ff
pickup photo-1694445645372-8b66c5ce54d9
greeter photo-1771970574224-bb8435ab590b
backseat photo-1535735798140-0659d97a5b6d
arrive photo-1779903726785-7cf25bed78f7
exec photo-1581091871235-868c13b39a42
sedan photo-1592309905620-e5b59f6dcb98
suite photo-1785528266178-81cdec8eacf4
villa photo-1613490493576-7fde63acd811
van photo-1765461734605-34657fa04db2
vansun photo-1656426650699-a76ffe479608
coach photo-1570125909517-53cb21c89ff2
lua photo-1518521901256-c90d4db6f85c
luanda photo-1743172140481-5c7044dd23d6
apart photo-1779903726439-5c27e3996c8a
)
for k v in ${(kv)IMG}; do
  curl -sfL -m 60 -o "$k.webp" "https://images.unsplash.com/$v?ixlib=rb-4.1.0&w=2400&q=72&fm=webp" || echo "FAIL $k"
  curl -sfL -m 60 -o "$k-m.webp" "https://images.unsplash.com/$v?ixlib=rb-4.1.0&w=1100&q=70&fm=webp" || echo "FAIL $k-m"
done
ls -la
