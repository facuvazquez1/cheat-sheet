import './style.css'

/* ═══════════════════════════════════════════
   Sidebar automático, buscador y scrollspy.
   No hace falta tocarlo al agregar atajos o secciones.
   ═══════════════════════════════════════════ */

const $ = (sel, root = document) => root.querySelector(sel)
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]

// Pasa a minúsculas, saca tildes y reemplaza "+" por espacio ("Alt + Tab" -> "alt tab")
const normalize = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const sections = $$('section[data-section]')
const nav = $('#nav')
const input = $('#search')
const clearBtn = $('#clearBtn')
const slashHint = $('#slashHint')
const status = $('#status')
const empty = $('#empty')
const sidebar = $('#sidebar')
const backdrop = $('#backdrop')
const totalShortcuts = $$('.shortcut').length

/* ---------- 1. Sidebar generado desde las secciones ---------- */
const links = new Map()

sections.forEach((section) => {
  const title = $('h3', section).textContent.trim()
  const dotClasses = $('h3', section).previousElementSibling.className

  const link = document.createElement('a')
  link.href = `#${section.id}`
  link.dataset.nav = section.id
  link.className =
    'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-zinc-100 data-[active=true]:bg-indigo-500/10 data-[active=true]:text-zinc-50 data-[dim=true]:opacity-30'
  link.innerHTML = `
    <span class="${dotClasses}"></span>
    <span class="flex-1 truncate">${title}</span>
    <span data-count class="rounded-md bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-zinc-500"></span>
  `
  link.addEventListener('click', closeMenu)
  nav.appendChild(link)
  links.set(section.id, link)
})

/* ---------- 2. Buscador ---------- */
function filter() {
  const query = input.value
  const words = normalize(query).split(' ').filter(Boolean)
  let visibleTotal = 0

  sections.forEach((section) => {
    const cards = $$('.shortcut', section)
    let visible = 0

    cards.forEach((card) => {
      // Se calcula una sola vez y se guarda en el propio elemento
      card.dataset.haystack ??= normalize(card.textContent)
      const match = words.every((word) => card.dataset.haystack.includes(word))
      card.hidden = !match
      if (match) visible++
    })

    section.hidden = visible === 0
    visibleTotal += visible

    const link = links.get(section.id)
    $('[data-count]', link).textContent = visible
    link.dataset.dim = String(visible === 0)
  })

  empty.hidden = visibleTotal !== 0
  const searching = words.length > 0
  clearBtn.hidden = !searching
  slashHint.hidden = searching
  status.textContent = searching
    ? `${visibleTotal} de ${totalShortcuts} atajos`
    : `${totalShortcuts} atajos`
}

input.addEventListener('input', filter)
clearBtn.addEventListener('click', () => {
  input.value = ''
  filter()
  input.focus()
})

// "/" o Ctrl+K enfocan el buscador, Esc lo limpia
document.addEventListener('keydown', (e) => {
  const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)
  if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && e.ctrlKey)) {
    e.preventDefault()
    input.focus()
    input.select()
  } else if (e.key === 'Escape') {
    if (input.value) {
      input.value = ''
      filter()
    } else {
      input.blur()
      closeMenu()
    }
  }
})

/* ---------- 3. Scrollspy: marca la sección que estás mirando ---------- */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      links.forEach((link, id) => {
        link.dataset.active = String(id === entry.target.id)
      })
    })
  },
  { rootMargin: '-20% 0px -65% 0px' }
)
sections.forEach((section) => observer.observe(section))

/* ---------- 4. Menú mobile ---------- */
function openMenu() {
  sidebar.classList.remove('-translate-x-full')
  backdrop.classList.remove('hidden')
}
function closeMenu() {
  sidebar.classList.add('-translate-x-full')
  backdrop.classList.add('hidden')
}
$('#menuBtn').addEventListener('click', openMenu)
backdrop.addEventListener('click', closeMenu)

// Estado inicial
filter()
links.values().next().value?.setAttribute('data-active', 'true')