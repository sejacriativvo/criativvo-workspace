# Padrões prontos de Motion (copia e cola)

Todos assumem `import { motion, AnimatePresence } from "motion/react"`.

## Hero com texto em cascata
```jsx
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
}

export function Hero() {
  return (
    <section>
      {["Título forte", "Subtítulo que vende", "CTA"].map((t, i) => (
        <motion.div key={t} custom={i} variants={fadeUp} initial="hidden" animate="show">
          {t}
        </motion.div>
      ))}
    </section>
  )
}
```

## Card que sobe no hover
```jsx
<motion.article
  whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
  transition={{ type: "spring", stiffness: 300, damping: 25 }}
/>
```

## Botão com tap satisfatório
```jsx
<motion.button
  whileHover={{ scale: 1.04 }}
  whileTap={{ scale: 0.96 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Falar no WhatsApp
</motion.button>
```

## Seções que revelam no scroll (reutilizável)
```jsx
function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
// uso: <Reveal delay={0.1}><Feature /></Reveal>
```

## Barra de progresso de leitura (topo da página)
```jsx
import { useScroll } from "motion/react"

function ProgressBar() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      style={{ scaleX: scrollYProgress, transformOrigin: "0%",
               position: "fixed", top: 0, left: 0, right: 0, height: 4 }}
    />
  )
}
```

## Parallax suave numa imagem
```jsx
import { useScroll, useTransform } from "motion/react"

function ParallaxImg({ src }) {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -120])
  return <motion.img src={src} style={{ y }} />
}
```

## Modal com entrada e saída
```jsx
<AnimatePresence>
  {open && (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={close}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)" }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        conteúdo do modal
      </motion.div>
    </>
  )}
</AnimatePresence>
```

## Accordion / FAQ que expande
```jsx
<motion.div layout>
  <motion.button layout onClick={() => setOpen(!open)}>{pergunta}</motion.button>
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        style={{ overflow: "hidden" }}
      >
        {resposta}
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>
```

## Números contando (counter)
```jsx
import { useEffect } from "react"
import { useMotionValue, animate, useTransform, motion } from "motion/react"

function Counter({ to }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  useEffect(() => {
    const controls = animate(count, to, { duration: 1.5, ease: "easeOut" })
    return controls.stop
  }, [to])
  return <motion.span>{rounded}</motion.span>
}
```

## Respeitar prefers-reduced-motion
```jsx
import { useReducedMotion } from "motion/react"

function Safe() {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    />
  )
}
```

## Transição entre páginas (Next.js App Router)
Envolva o conteúdo da página em `motion.main` com `key` na rota e use `AnimatePresence mode="wait"` num layout client component.
```jsx
"use client"
import { AnimatePresence, motion } from "motion/react"
import { usePathname } from "next/navigation"

export function PageTransition({ children }) {
  const path = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.main key={path}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  )
}
```
