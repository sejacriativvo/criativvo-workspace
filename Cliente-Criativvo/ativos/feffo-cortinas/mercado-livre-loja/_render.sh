#!/bin/zsh
# uso: ./_render.sh arquivo.html largura altura saida.jpg
HTML="$1"; W="$2"; H="$3"; OUT="$4"
BRAVE="/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
TMP="${OUT%.jpg}_2x.png"
"$BRAVE" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --screenshot="$TMP" --window-size=$W,$H "file://$HTML" >/dev/null 2>&1
# downscale 2x -> tamanho exato e converte pra jpg
sips -z $H $W "$TMP" --out "$OUT" >/dev/null 2>&1
rm -f "$TMP"
echo "render: $OUT ($W x $H)"
