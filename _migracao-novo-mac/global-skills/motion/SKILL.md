---
name: motion
description: Animações em React com Motion (ex-Framer Motion, motion.dev). Adiciona animações de entrada, hover/tap, scroll, layout, transições de página e micro-interações em sites, landing pages e dashboards. Use quando o usuário mencionar "animação", "animar", "Framer Motion", "Motion", "motion.dev", "transição", "fade in", "scroll animation", "parallax", "hover effect", "micro-interação", "animar a landing page", "deixar o site mais vivo", ou pedir movimento/efeito numa página React/Next.js/.tsx/.jsx.
---

# Motion (Framer Motion) para React

Biblioteca de animação para React. O pacote antigo `framer-motion` virou **`motion`** e a doc migrou de framer.com/motion para **motion.dev**. Use sempre o import novo.

## Instalação e import

```bash
npm install motion
```

```jsx
import { motion, AnimatePresence } from "motion/react"
```

> Projeto legado ainda em `framer-motion`? Funciona igual, só troca o import por `from "framer-motion"`. Em projeto novo, use `motion`.

## Regra de ouro
Qualquer elemento HTML/SVG vira animável prefixando com `motion.`: `motion.div`, `motion.button`, `motion.section`, `motion.path`. A partir daí, as props `initial`, `animate`, `exit`, `whileHover`, `whileTap`, `whileInView`, `drag`, `layout` controlam tudo.

## Os 6 padrões que resolvem 90% dos casos

### 1. Entrada (fade / slide in)
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
  conteúdo
</motion.div>
```

### 2. Hover e tap (botões, cards)
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Quero saber mais
</motion.button>
```

### 3. Animar ao entrar na viewport (scroll reveal)
```jsx
<motion.section
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.6 }}
/>
```
`once: true` = anima uma vez só. `amount` = fração visível pra disparar.

### 4. Lista com stagger (cascata)
Variants no pai com `staggerChildren` faz os filhos entrarem em sequência:
```jsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map((i) => (
    <motion.li key={i} variants={item} />
  ))}
</motion.ul>
```

### 5. Entrada E saída (modais, toasts, troca de tela)
Exit só funciona dentro de `AnimatePresence`:
```jsx
<AnimatePresence>
  {open && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    />
  )}
</AnimatePresence>
```
Em listas, dê `key` único e use `mode="popLayout"` pra reflow suave.

### 6. Layout automático (reordenar, expandir, accordion)
```jsx
<motion.div layout />            // anima mudança de tamanho/posição
<motion.div layoutId="card" />   // anima entre elementos diferentes (shared transition)
```

## Scroll-linked (parallax, barra de progresso)
```jsx
import { useScroll, useTransform } from "motion/react"

const { scrollYProgress } = useScroll()
const y = useTransform(scrollYProgress, [0, 1], [0, -200])

<motion.div style={{ y }} />                       // parallax
<motion.div style={{ scaleX: scrollYProgress }} /> // barra de progresso de leitura
```

## Transition: como controlar o movimento
- Propriedades físicas (`x`, `y`, `scale`, `rotate`) usam **spring** por padrão.
- Propriedades visuais (`opacity`, `color`) usam **tween** por padrão.

```jsx
transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}        // tween
transition={{ type: "spring", stiffness: 300, damping: 30 }}          // mola
```
Easings comuns: `"easeOut"` (entradas), `"easeInOut"` (loop/ida-volta), `"linear"` (progresso/scroll).

## Boas práticas
- **Performance:** anime só `transform` (`x`, `y`, `scale`, `rotate`) e `opacity`. Evite animar `width`/`height`/`top`/`left` direto (usa `layout` no lugar).
- **Acessibilidade:** respeite `prefers-reduced-motion`. Use o hook `useReducedMotion()` pra desligar movimento.
- **Entrada na primeira carga:** `initial={false}` pula a animação inicial quando não quiser flash.
- **SVG desenhando:** anime `pathLength` de 0 a 1 em `motion.path`.

## Referência
- Padrões prontos copia-e-cola: ver [patterns.md](patterns.md)
- Doc oficial: https://motion.dev/docs/react

Ao aplicar numa página: identifique o framework (Next.js/Vite/CRA), confirme `motion` instalado, troque os elementos certos por `motion.*` e aplique o padrão mínimo necessário. Não anime tudo, movimento demais polui. Foque em entrada de seções, hover de CTAs e reveal no scroll.
