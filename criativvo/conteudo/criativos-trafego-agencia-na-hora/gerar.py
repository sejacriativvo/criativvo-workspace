#!/usr/bin/env python3
"""V3 — copies eixo vitrine/credibilidade + tipografia mista premium."""
import os, subprocess, urllib.parse, shutil

ROOT = "/Users/matheusvareschi/CLAUDE CODE/criativvo/conteudo/criativos-trafego-agencia-na-hora"
SRC = f"{ROOT}/imagens-origem"
HTMLS = f"{ROOT}/htmls"
FEED = f"{ROOT}/feed"
STORIES = f"{ROOT}/stories"
FONT = "/Users/matheusvareschi/CLAUDE CODE/criativvo/marca/AVEstiana-Black.otf"
BRAVE = "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"

# h1 = eyebrow serif italic
# h2 = headline sans-serif bold massivo (com |trecho laranja|)
# sub = subtexto sans medium
# pos = top | bottom
CREATIVES = [
    {
        "id": "01", "slug": "praia-descanso",
        "img": "freepik_professional-cinematic-st_2811664690.png",
        "h1": "enquanto você relaxa,",
        "h2": "|93%| pesquisam você no google.",
        "sub": "e se tua vitrine for arcaica, fecham com o concorrente. site premium em 24h.",
        "focus_feed": "65% 50%", "focus_stories": "50% 55%",
        "pos": "bottom",
    },
    {
        "id": "02", "slug": "cozinha-escolha",
        "img": "freepik_professional-cinematic-st_2811706546.png",
        "h1": "para de comparar.",
        "h2": "vitrine |arcaica| afasta cliente.",
        "sub": "teu produto pode ser ouro. se o site for de plástico, ninguém prova.",
        "focus_feed": "60% 45%", "focus_stories": "55% 50%",
        "pos": "bottom",
    },
    {
        "id": "03", "slug": "vestiario-foco",
        "img": "freepik_professional-cinematic-st_2811723470.png",
        "h1": "teu concorrente já entendeu.",
        "h2": "você ainda tá nos |anos 90|?",
        "sub": "eles evoluíram o site, você perde cliente todo dia que passa.",
        "focus_feed": "60% 45%", "focus_stories": "55% 45%",
        "pos": "bottom",
    },
    {
        "id": "04", "slug": "futebol-time",
        "img": "freepik_professional-cinematic-st_2811782077.png",
        "h1": "no mercado existem dois times:",
        "h2": "|quem tem vitrine| e quem perde cliente.",
        "sub": "ponto fora da curva é quem se diferencia. a gente entrega esse diferencial em 24h.",
        "focus_feed": "50% 45%", "focus_stories": "50% 50%",
        "pos": "bottom",
    },
    {
        "id": "05", "slug": "futebol-capacete",
        "img": "freepik_professional-cinematic-st_2811782127.png",
        "h1": "joga com as armas certas.",
        "h2": "site |1000x mais profissional| que o do concorrente.",
        "sub": "porque entrega boa com vitrine ruim ainda perde cliente.",
        "focus_feed": "50% 40%", "focus_stories": "50% 40%",
        "pos": "bottom",
    },
    {
        "id": "06", "slug": "f1-velocidade",
        "img": "freepik_professional-cinematic-st_2812012650.png",
        "h1": "no mercado, quem se diferencia ganha.",
        "h2": "site |1000x| acima do concorrente.",
        "sub": "premium. persuasivo. do tipo que cliente lembra antes de te ligar.",
        "focus_feed": "50% 45%", "focus_stories": "50% 45%",
        "pos": "bottom",
    },
    {
        "id": "07", "slug": "kombi-jornada",
        "img": "freepik_professional-cinematic-st_2814530557.png",
        "h1": "93% pesquisam no google",
        "h2": "antes de |comprar com você|.",
        "sub": "se a vitrine for arcaica, fecham com outro. 24h pra mudar isso.",
        "focus_feed": "55% 50%", "focus_stories": "50% 50%",
        "pos": "bottom",
    },
    {
        "id": "08", "slug": "cafe-artesanal",
        "img": "freepik_professional-cinematic-st_2814621135.png",
        "h1": "serviço impecável, site dos anos 90:",
        "h2": "|credibilidade| zerada.",
        "sub": "imagina um karatê faixa preta com vitrine de papelão. cliente nem entra.",
        "focus_feed": "55% 50%", "focus_stories": "55% 50%",
        "pos": "bottom",
    },
    {
        "id": "09", "slug": "carro-noite-trabalho",
        "img": "freepik_professional-cinematic-st_2815738825.png",
        "h1": "você se mata de trabalhar.",
        "h2": "tua vitrine tá |quebrada|.",
        "sub": "cliente bate o olho no google, fecha a aba, vai pro concorrente.",
        "focus_feed": "50% 40%", "focus_stories": "50% 40%",
        "pos": "bottom",
    },
    {
        "id": "10", "slug": "rua-foco",
        "img": "freepik_professional-cinematic-st_2815745229.png",
        "h1": "site não é detalhe.",
        "h2": "é tua |primeira impressão|.",
        "sub": "em 3 segundos no google o cliente decide se confia em você. 24h pra mudar.",
        "focus_feed": "55% 50%", "focus_stories": "55% 50%",
        "pos": "bottom",
    },
    {
        "id": "11", "slug": "perseguicao",
        "img": "freepik_professional-cinematic-st_2815745295.png",
        "h1": "enquanto você acha que tá bom,",
        "h2": "teu concorrente |modernizou tudo|.",
        "sub": "cliente abre os dois sites e fecha com ele. para a hemorragia.",
        "focus_feed": "50% 40%", "focus_stories": "50% 40%",
        "pos": "bottom",
    },
    {
        "id": "12", "slug": "carro-frio-noite",
        "img": "freepik_professional-cinematic-st_2815914149.png",
        "h1": "acorda.",
        "h2": "tua marca tá |presa nos anos 90|.",
        "sub": "enquanto o mercado evolui, vitrine amadora queima teu nome.",
        "focus_feed": "55% 50%", "focus_stories": "55% 45%",
        "pos": "bottom",
    },
    {
        "id": "13", "slug": "sofa-laptop",
        "img": "freepik_real-photograph-of-matheu_2815510321.png",
        "h1": "enquanto você descansa,",
        "h2": "eu monto a |vitrine| que tua marca merece.",
        "sub": "site premium em 24h. design persuasivo, mil vezes acima do mercado.",
        "focus_feed": "50% 25%", "focus_stories": "50% 35%",
        "pos": "bottom",
    },
    {
        "id": "14", "slug": "baloes-clones",
        "img": "hf_20260204_180524_f59e374c-0edf-44b4-8dd9-e736ef9d986e.png",
        "h1": "todo empresário sério tem site.",
        "h2": "e o teu é |digno| do nome?",
        "sub": "em 2026 ninguém entra em loja sem vitrine. no digital é igual.",
        "focus_feed": "50% 30%", "focus_stories": "50% 45%",
        "pos": "bottom",
    },
    {
        "id": "15", "slug": "astronauta-marte",
        "img": "magnific__crie-uma-imagem-fotorealista-de-uma-pessoa-exatame__75186.png",
        "h1": "site genérico não impressiona.",
        "h2": "ele |afasta| cliente.",
        "sub": "ponto fora da curva é quem se diferencia. site é o caminho mais barato.",
        "focus_feed": "50% 30%", "focus_stories": "50% 40%",
        "pos": "bottom",
    },
    {
        "id": "16", "slug": "piloto-aviao",
        "img": "magnific__crie-uma-imagem-fotorealista-vertical-916-de-uma-p__75187.png",
        "h1": "ou você decola,",
        "h2": "ou outro |voa por cima|.",
        "sub": "site premium separa quem é referência de quem é só mais um nome no google.",
        "focus_feed": "55% 35%", "focus_stories": "55% 35%",
        "pos": "bottom",
    },
    {
        "id": "17", "slug": "piloto-sorrindo",
        "img": "magnific__crie-uma-imagem-fotorealista-vertical-916-de-uma-p__75188.png",
        "h1": "vencedor não improvisa.",
        "h2": "site |profissional| em 24h.",
        "sub": "premium, persuasivo, mil vezes acima do que o mercado entrega.",
        "focus_feed": "55% 35%", "focus_stories": "55% 35%",
        "pos": "bottom",
    },
    {
        "id": "18", "slug": "selva-plaquinha",
        "img": "magnific__crie-uma-imagem-fotorealista-vertical-916-em-close__75185.png",
        "h1": "regra do mercado:",
        "h2": "site |arcaico| é cliente perdido.",
        "sub": "",
        "focus_feed": "50% 30%", "focus_stories": "50% 35%",
        "pos": "top",
    },
]

# ============================================================================

FONT_URI = f"file://{urllib.parse.quote(FONT)}"


def render_headline(text):
    parts = text.split("|")
    out = []
    for i, p in enumerate(parts):
        if i % 2 == 1:
            out.append(f'<span class="accent">{p}</span>')
        else:
            out.append(p)
    return "".join(out)


def tpl(c, fmt):
    W, H = (1080, 1080) if fmt == "feed" else (1080, 1920)
    focus = c["focus_feed"] if fmt == "feed" else c["focus_stories"]
    img_full = SRC + "/" + c["img"]
    img_uri = "file://" + urllib.parse.quote(img_full, safe="/")
    pos = c.get("pos", "bottom")

    if fmt == "stories":
        h1_size = 52
        h2_size = 102
        sub_size = 34
        brand_size = 46
        tag_size = 18
        pad = 70
        margin_edge = 130
        gap_h1_h2 = 8
        gap_h2_sub = 32
    else:  # feed
        h1_size = 42
        h2_size = 84
        sub_size = 28
        brand_size = 38
        tag_size = 16
        pad = 60
        margin_edge = 70
        gap_h1_h2 = 4
        gap_h2_sub = 24

    h2_html = render_headline(c["h2"])
    sub_html = c["sub"]

    if pos == "bottom":
        gradient = """.fade {
  position:absolute; bottom:0; left:0; right:0; height:68%;
  background: linear-gradient(180deg,
    rgba(0,0,0,0) 0%,
    rgba(0,0,0,0.25) 25%,
    rgba(0,0,0,0.65) 60%,
    rgba(0,0,0,0.92) 100%);
  pointer-events:none;
}"""
        text_block_pos = f"bottom:{margin_edge}px; left:{pad}px; right:{pad}px;"
        brand_pos = f"top:{pad}px; left:{pad}px;"
        tag_pos = f"top:{pad+10}px; right:{pad}px;"
    else:  # top
        gradient = """.fade {
  position:absolute; top:0; left:0; right:0; height:60%;
  background: linear-gradient(180deg,
    rgba(0,0,0,0.92) 0%,
    rgba(0,0,0,0.65) 40%,
    rgba(0,0,0,0.25) 75%,
    rgba(0,0,0,0) 100%);
  pointer-events:none;
}"""
        text_block_pos = f"top:{pad + brand_size + 50}px; left:{pad}px; right:{pad}px;"
        brand_pos = f"top:{pad}px; left:{pad}px;"
        tag_pos = f"bottom:{pad}px; right:{pad}px;"

    sub_block = f'<div class="sub">{sub_html}</div>' if sub_html else ''

    return f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
@font-face {{ font-family: 'AVEstiana'; src: url('{FONT_URI}') format('opentype'); }}
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,300;1,9..144,400;1,9..144,500;1,9..144,600;1,9..144,700&family=Inter:wght@400;500;600;700;800;900&display=swap');
* {{ margin:0; padding:0; box-sizing:border-box; }}
html, body {{ width:{W}px; height:{H}px; overflow:hidden; background:#000; font-family:'Inter',sans-serif; -webkit-font-smoothing:antialiased; }}
.canvas {{ position:relative; width:{W}px; height:{H}px; overflow:hidden; }}
.bg {{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:{focus}; }}
{gradient}

.brand {{
  position:absolute; {brand_pos}
  font-family:'AVEstiana','Inter',sans-serif;
  color:#fff; font-size:{brand_size}px; letter-spacing:-0.03em; line-height:1;
  z-index:3;
  text-shadow:0 2px 14px rgba(0,0,0,0.55);
}}

.tag {{
  position:absolute; {tag_pos}
  font-family:'Fraunces', serif;
  font-style:italic; font-weight:400;
  color:rgba(255,255,255,0.85);
  font-size:{tag_size+8}px;
  letter-spacing:0.02em;
  z-index:3;
  text-shadow:0 2px 10px rgba(0,0,0,0.7);
}}
.tag::after {{
  content:""; display:inline-block; width:7px; height:7px; border-radius:50%;
  background:#FF5501; margin-left:14px; vertical-align:middle;
  box-shadow:0 0 10px rgba(255,85,1,0.7);
}}

.text-block {{
  position:absolute; {text_block_pos}
  z-index:3;
}}
.h1 {{
  font-family:'Fraunces', serif;
  font-style:italic; font-weight:400;
  color:rgba(255,255,255,0.9);
  font-size:{h1_size}px;
  line-height:1.1; letter-spacing:-0.005em;
  margin-bottom:{gap_h1_h2}px;
}}
.h2 {{
  font-family:'Inter', sans-serif;
  color:#fff; font-weight:900;
  font-size:{h2_size}px; line-height:0.95; letter-spacing:-0.04em;
}}
.h2 .accent {{
  font-family:'Fraunces', serif;
  font-style:italic; font-weight:600;
  color:#FF5501;
  letter-spacing:-0.02em;
}}
.sub {{
  font-family:'Inter', sans-serif;
  color:rgba(255,255,255,0.82);
  font-weight:500;
  font-size:{sub_size}px;
  line-height:1.3; letter-spacing:0;
  margin-top:{gap_h2_sub}px;
  max-width:92%;
}}
</style></head><body>
<div class="canvas">
  <img class="bg" src="{img_uri}" />
  <div class="fade"></div>
  <div class="brand">criativvo</div>
  <div class="tag">site em 24h</div>
  <div class="text-block">
    <div class="h1">{c["h1"]}</div>
    <div class="h2">{h2_html}</div>
    {sub_block}
  </div>
</div>
</body></html>"""


def main():
    os.makedirs(HTMLS, exist_ok=True)
    os.makedirs(FEED, exist_ok=True)
    os.makedirs(STORIES, exist_ok=True)

    for f in os.listdir(HTMLS):
        if f.endswith(".png"):
            os.remove(f"{HTMLS}/{f}")

    for c in CREATIVES:
        for fmt in ("feed", "stories"):
            html = tpl(c, fmt)
            with open(f"{HTMLS}/{c['id']}-{c['slug']}-{fmt}.html", "w") as f:
                f.write(html)
    print(f"Gerados {len(CREATIVES)*2} HTMLs")

    for c in CREATIVES:
        for fmt in ("feed", "stories"):
            W, H = (1080, 1080) if fmt == "feed" else (1080, 1920)
            html_path = f"{HTMLS}/{c['id']}-{c['slug']}-{fmt}.html"
            png_path = f"{HTMLS}/{c['id']}-{c['slug']}-{fmt}.png"
            url = f"file://{urllib.parse.quote(html_path, safe='/')}"
            cmd = [
                BRAVE, "--headless=new", "--disable-gpu",
                f"--window-size={W},{H}",
                f"--screenshot={png_path}",
                "--hide-scrollbars",
                "--virtual-time-budget=4500",
                "--default-background-color=00000000",
                url,
            ]
            print(f"[{c['id']}-{fmt}]")
            subprocess.run(cmd, capture_output=True, timeout=60)

            out_dir = FEED if fmt == "feed" else STORIES
            jpg_path = f"{out_dir}/{c['id']}-{c['slug']}.jpg"
            subprocess.run([
                "sips", "-s", "format", "jpeg", "-s", "formatOptions", "92",
                png_path, "--out", jpg_path
            ], capture_output=True)

    dest_docs = "/Users/matheusvareschi/Documents/criativvo-criativos"
    # Limpar pasta destino
    for fmt in ("feed", "stories"):
        d = f"{dest_docs}/{fmt}"
        if os.path.exists(d):
            shutil.rmtree(d)
        os.makedirs(d, exist_ok=True)
    for fmt, out in (("feed", FEED), ("stories", STORIES)):
        for f in os.listdir(out):
            if f.endswith(".jpg"):
                shutil.copy(f"{out}/{f}", f"{dest_docs}/{fmt}/{f}")

    print("✓ Tudo gerado.")
    print(f"  - Documents: {dest_docs}")


if __name__ == "__main__":
    main()
