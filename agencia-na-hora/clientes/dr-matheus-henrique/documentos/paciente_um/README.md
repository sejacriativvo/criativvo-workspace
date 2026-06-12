# Paciente 01 — Carrossel do site

Coloque aqui as fotos do caso na ordem em que devem aparecer no carrossel do site:

```
1.jpg  → primeiro slide (geralmente o "antes")
2.jpg  → segundo slide
3.jpg  → ...
4.jpg  → ...
5.jpg  → último slide (geralmente o "depois")
```

## Como funciona

As fotos publicadas no carrossel do site ficam em **`site/assets/paciente-01/`** (cópia otimizada para web).

Esta pasta `documentos/paciente_um/` é a fonte original. Se atualizar uma foto aqui, copie também para `site/assets/paciente-01/` com o mesmo número, ou rode:

```bash
cp documentos/paciente_um/*.jpg site/assets/paciente-01/
```

O site lê automaticamente `1.jpg` até `5.jpg` e monta um carrossel arrastável tipo Instagram (gap zero entre slides para as imagens se completarem visualmente).

## Legenda atual

> Melhorando a estética do sorriso desse paciente que se incomodava com o desalinhamento e espaços em seus dentes. Após o uso do aparelho ortodôntico, finalizamos o tratamento com 10 facetas em resina para melhorar os formatos e a tonalidade dos dentes, devolvendo harmonia e um sorriso mais iluminado.

A legenda fica logo abaixo do carrossel no site. Para alterar, editar o trecho marcado `<!-- LEGENDA PACIENTE_UM -->` no `site/index.html`.
