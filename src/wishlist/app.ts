// Wishlist page (wishlist/<number>/). Talks to the wishlist API Worker (repo urmamge/wishlist, src/worker.ts).
import './wishlist.css'

// The real list everywhere, including `npm run dev`. Add ?localapi to the address to use
// a local Worker instead (`npm run dev` in the wishlist repo, port 18799).
const LOCAL_API = new URLSearchParams(location.search).has('localapi')
const API = LOCAL_API ? 'http://localhost:18799' : 'https://wishlist-api.matthewhearst.com'
const OWNER_KEY = 'wishlist-owner-key'
const CLAIMS_KEY = 'wishlist-claims'

interface Item {
  id: string
  /** Null for things with no shop page (gift cards etc.). */
  url: string | null
  title: string
  site: string | null
  price: string | null
  note: string | null
  image: string | null
  /** Only sent to visitors, never to the owner. */
  bought?: boolean
}

interface Draft {
  url: string
  title: string
  site: string
  price: string
  note: string
  imageUrl: string
}

// ---------- storage (can be missing in private windows) ----------

let memoryOwnerKey: string | null = null
function getOwnerKey(): string | null {
  try {
    return localStorage.getItem(OWNER_KEY)
  } catch {
    return memoryOwnerKey
  }
}
function setOwnerKey(key: string | null) {
  memoryOwnerKey = key
  try {
    if (key) localStorage.setItem(OWNER_KEY, key)
    else localStorage.removeItem(OWNER_KEY)
  } catch {
    // memory only
  }
}

let memoryClaims: Record<string, string> = {}
function getClaims(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(CLAIMS_KEY) ?? '{}') as Record<string, string>
  } catch {
    return memoryClaims
  }
}
function setClaim(id: string, claim: string | null) {
  const claims = { ...getClaims() }
  if (claim) claims[id] = claim
  else delete claims[id]
  memoryClaims = claims
  try {
    localStorage.setItem(CLAIMS_KEY, JSON.stringify(claims))
  } catch {
    // memory only
  }
}

// ---------- helpers ----------

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T

type Child = Node | string | null | undefined | false
function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Record<string, unknown> = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null || v === false) continue
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v as EventListener)
    else if (k === 'class') el.className = String(v)
    else if (k in el && k !== 'list') (el as unknown as Record<string, unknown>)[k] = v
    else el.setAttribute(k, String(v))
  }
  for (const c of children) if (c) el.append(c)
  return el
}

class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const headers = new Headers(init.headers)
  const key = getOwnerKey()
  if (key) headers.set('X-Owner-Key', key)
  let bodyInit = init.body
  if (init.json !== undefined) {
    headers.set('Content-Type', 'application/json')
    bodyInit = JSON.stringify(init.json)
  }
  let res: Response
  try {
    res = await fetch(API + path, { ...init, headers, body: bodyInit })
  } catch {
    throw new ApiError(0, "Couldn't reach the wishlist. Check your connection and try again.")
  }
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) throw new ApiError(res.status, data.error ?? 'Something went wrong.')
  return data
}

function imageSrc(image: string | null): string | null {
  if (!image) return null
  return image.startsWith('/img/') ? API + image : image
}

let toastTimer = 0
function toast(message: string) {
  const el = $('toast')
  el.textContent = message
  el.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => el.classList.remove('show'), 2600)
}

// ---------- state ----------

let owner = false
let items: Item[] = []

async function load() {
  try {
    const sentKey = getOwnerKey()
    const data = await api<{ owner: boolean; items: Item[] }>('/api/items')
    if (sentKey && !data.owner) {
      setOwnerKey(null)
      toast('Owner code changed, log in again.')
    }
    owner = data.owner
    items = data.items
    $('status').hidden = true
    render()
  } catch (err) {
    $('status').hidden = false
    $('status').textContent = (err as Error).message
  }
}

// ---------- rendering ----------

function render() {
  $('owner').hidden = !owner
  const grid = $('grid')
  grid.replaceChildren()
  // Visitors see taken items at the end. The owner gets the plain order (no hint from sorting).
  const list = owner ? items : [...items.filter((i) => !i.bought), ...items.filter((i) => i.bought)]
  list.forEach((item) => grid.append(card(item)))
  $('empty').hidden = items.length > 0
}

function card(item: Item): HTMLElement {
  const src = imageSrc(item.image)
  const claims = getClaims()
  const mine = Boolean(claims[item.id])
  const bought = !owner && item.bought

  const linkProps = (extra: Record<string, unknown>) =>
    item.url ? { ...extra, href: item.url, target: '_blank', rel: 'noopener noreferrer' } : extra
  const img = h(
    item.url ? 'a' : 'div',
    linkProps({ class: 'img', 'data-title': item.title, 'aria-label': item.url ? `Open ${item.title}` : undefined }),
    src
      ? h('img', { src, alt: '', loading: 'lazy', referrerPolicy: 'no-referrer', onerror: imageFailed })
      : noImage(),
    bought && h('span', { class: 'badge' }, 'Bought'),
  )

  const foot = h('div', { class: 'foot' })
  if (owner) {
    const index = items.indexOf(item)
    foot.append(
      h('button', { class: 'btn small', onclick: () => openEditor(item) }, 'Edit'),
      h('button', { class: 'btn small', title: 'Move earlier', disabled: index === 0, onclick: () => move(item, -1) }, '↑'),
      h(
        'button',
        { class: 'btn small', title: 'Move later', disabled: index === items.length - 1, onclick: () => move(item, 1) },
        '↓',
      ),
      h('button', { class: 'btn small danger', onclick: () => remove(item) }, 'Delete'),
    )
  } else if (bought) {
    foot.append(h('span', { class: 'boughtnote' }, mine ? 'You marked this as bought.' : "Someone's already got this one."))
    if (mine) foot.append(h('button', { class: 'undo', onclick: () => unbuy(item) }, 'Undo'))
  } else {
    foot.append(h('button', { class: 'btn', onclick: () => askBuy(item) }, 'Mark as bought'))
  }

  return h(
    'article',
    { class: bought ? 'card bought' : 'card' },
    img,
    h(
      'div',
      { class: 'body' },
      h('div', { class: 'meta' }, h('span', {}, item.site ?? ''), item.price && h('span', { class: 'price' }, item.price)),
      h('h2', {}, item.url ? h('a', linkProps({}), item.title) : item.title),
      item.note && h('p', { class: 'note' }, item.note),
      foot,
    ),
  )
}

/** Gift icon for items with no picture (gift cards etc.) or whose picture stopped loading. */
function noImage(): HTMLElement {
  const box = h('div', { class: 'noimg' })
  box.innerHTML =
    '<svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/></svg>'
  return box
}

function imageFailed(this: HTMLImageElement) {
  this.replaceWith(noImage())
}

// ---------- visitors: bought marks ----------

let buying: Item | null = null

function askBuy(item: Item) {
  buying = item
  $('buyName').textContent = item.title
  $('buyErr').textContent = ''
  $<HTMLButtonElement>('buyConfirm').disabled = false
  $<HTMLDialogElement>('buyDialog').showModal()
}

$('buyCancel').addEventListener('click', () => $<HTMLDialogElement>('buyDialog').close())
$('buyConfirm').addEventListener('click', async () => {
  if (!buying) return
  const item = buying
  const btn = $<HTMLButtonElement>('buyConfirm')
  btn.disabled = true
  try {
    const { claim } = await api<{ claim: string }>(`/api/items/${item.id}/buy`, { method: 'POST' })
    setClaim(item.id, claim)
    item.bought = true
    $<HTMLDialogElement>('buyDialog').close()
    render()
    toast('Marked as bought. Thank you!')
  } catch (err) {
    btn.disabled = false
    $('buyErr').textContent = (err as Error).message
    if ((err as ApiError).status === 409 || (err as ApiError).status === 404) void load()
  }
})

async function unbuy(item: Item) {
  const claim = getClaims()[item.id]
  if (!claim) return
  try {
    await api(`/api/items/${item.id}/unbuy`, { method: 'POST', json: { claim } })
    setClaim(item.id, null)
    item.bought = false
    render()
    toast('Undone. It’s back on the list.')
  } catch (err) {
    toast((err as Error).message)
  }
}

// ---------- owner ----------

function openLogin() {
  $('loginErr').textContent = ''
  $<HTMLInputElement>('loginKey').value = ''
  $<HTMLDialogElement>('loginDialog').showModal()
}

$('loginCancel').addEventListener('click', () => $<HTMLDialogElement>('loginDialog').close())
$('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const key = $<HTMLInputElement>('loginKey').value.trim()
  const previous = getOwnerKey()
  setOwnerKey(key)
  try {
    await api('/api/login', { method: 'POST' })
    $<HTMLDialogElement>('loginDialog').close()
    history.replaceState(null, '', location.pathname + location.search)
    await load()
    toast('Logged in. Bought marks are now hidden on this device.')
  } catch (err) {
    setOwnerKey(previous)
    $('loginErr').textContent = (err as ApiError).status === 401 ? "That code isn't right." : (err as Error).message
  }
})

$('logout').addEventListener('click', () => {
  setOwnerKey(null)
  closeEditor()
  void load()
})

// The normal page is /wishlist/<number>/; the Christmas one is the same path + christmastheme/.
const basePath = location.pathname.replace(/christmastheme\/?$/, '').replace(/\/?$/, '/')
async function copyLink(link: string, what: string) {
  try {
    await navigator.clipboard.writeText(link)
    toast(`${what} copied.`)
  } catch {
    prompt('Copy this link:', link)
  }
}
$('copyLink').addEventListener('click', () => copyLink(location.origin + basePath, 'Link'))
$('copyXmas').addEventListener('click', () => copyLink(location.origin + basePath + 'christmastheme/', 'Christmas link'))

$('addPlain').addEventListener('click', () => {
  openEditor(null, { url: '', title: '', site: '', price: '', note: '', imageUrl: '' })
})

$('addForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const url = $<HTMLInputElement>('addUrl').value.trim()
  const btn = $<HTMLButtonElement>('addBtn')
  btn.disabled = true
  btn.textContent = 'Fetching…'
  try {
    const found = await api<{ title: string | null; image: string | null; price: string | null; site: string; blocked: boolean }>(
      '/api/preview',
      { method: 'POST', json: { url } },
    )
    openEditor(null, {
      url,
      title: found.title ?? '',
      site: found.site,
      price: found.price ?? '',
      note: '',
      imageUrl: found.image ?? '',
    }, found.blocked)
  } catch (err) {
    toast((err as Error).message)
  } finally {
    btn.disabled = false
    btn.textContent = 'Get details'
  }
})

function closeEditor() {
  const box = $('editor')
  box.hidden = true
  box.replaceChildren()
}

/** Shows the add/edit form. `item` null = adding a new one from `draft`. */
function openEditor(item: Item | null, draft?: Draft, blocked = false) {
  const d: Draft = draft ?? {
    url: item!.url ?? '',
    title: item!.title,
    site: item!.site ?? '',
    price: item!.price ?? '',
    note: item!.note ?? '',
    imageUrl: item!.image ?? '',
  }
  let file: File | null = null

  const field = (label: string, input: HTMLInputElement | HTMLTextAreaElement) =>
    h('div', {}, h('label', { htmlFor: input.id }, label), input)
  const url = h('input', { type: 'url', id: 'edUrl', value: d.url, placeholder: 'Leave empty for things like gift cards' })
  const title = h('input', { type: 'text', id: 'edTitle', value: d.title, required: true, maxLength: 300 })
  const price = h('input', { type: 'text', id: 'edPrice', value: d.price, placeholder: '£0.00', maxLength: 50 })
  const site = h('input', { type: 'text', id: 'edSite', value: d.site, maxLength: 100 })
  const note = h('textarea', { id: 'edNote', placeholder: 'Size, colour, anything they should know', maxLength: 500 })
  note.value = d.note
  const imageUrl = h('input', {
    type: 'text',
    id: 'edImage',
    value: d.imageUrl.startsWith('/img/') ? '' : d.imageUrl,
    placeholder: d.imageUrl.startsWith('/img/') ? 'Saved picture (paste a link to replace)' : 'Picture link',
  })
  const fileInput = h('input', { type: 'file', accept: 'image/*', hidden: true })
  const pic = h('div', { class: 'pic' })

  const showPic = (src: string | null) => {
    pic.replaceChildren(src ? h('img', { src, alt: '', referrerPolicy: 'no-referrer' }) : 'No picture')
  }
  showPic(imageSrc(d.imageUrl || null))
  imageUrl.addEventListener('input', () => {
    file = null
    showPic(imageUrl.value.trim() || imageSrc(d.imageUrl.startsWith('/img/') ? d.imageUrl : null))
  })
  fileInput.addEventListener('change', () => {
    file = fileInput.files?.[0] ?? null
    if (file) {
      imageUrl.value = ''
      showPic(URL.createObjectURL(file))
    }
  })

  const save = h('button', { class: 'btn primary', type: 'submit' }, item ? 'Save changes' : 'Add to list')
  const form = h(
    'form',
    {
      class: 'editor',
      onsubmit: async (e: Event) => {
        e.preventDefault()
        save.disabled = true
        const typed = imageUrl.value.trim()
        // Keep the saved picture unless a new link or file was given.
        const keepSaved = !typed && !file && d.imageUrl.startsWith('/img/')
        const payload = {
          url: url.value.trim(),
          title: title.value.trim(),
          price: price.value.trim(),
          site: site.value.trim(),
          note: note.value.trim(),
          imageUrl: file ? (item ? item.image : null) : keepSaved ? d.imageUrl : typed || null,
        }
        try {
          let id = item?.id
          if (item) await api(`/api/items/${item.id}`, { method: 'PATCH', json: payload })
          else id = (await api<{ id: string }>('/api/items', { method: 'POST', json: payload })).id
          if (file && id) {
            await api(`/api/items/${id}/image`, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
          }
          closeEditor()
          $<HTMLInputElement>('addUrl').value = ''
          await load()
          toast(item ? 'Saved.' : 'Added to the list.')
        } catch (err) {
          toast((err as Error).message)
          save.disabled = false
        }
      },
    },
    h(
      'div',
      {},
      pic,
      h(
        'button',
        { class: 'btn small', type: 'button', style: 'margin-top:8px;width:100%', onclick: () => fileInput.click() },
        'Upload picture',
      ),
      fileInput,
    ),
    h(
      'div',
      {},
      blocked &&
        h(
          'p',
          { class: 'hint warn' },
          "That shop didn't let me read the page, so fill in the details yourself. Right-click the product picture → Copy image address, or save it and use Upload picture.",
        ),
      field('Name', title),
      h('div', { class: 'row2' }, field('Price', price), field('Shop', site)),
      field('Note (optional)', note),
      field('Picture link', imageUrl),
      field('Link (optional)', url),
      h(
        'div',
        { class: 'actions' },
        save,
        h('button', { class: 'btn ghost', type: 'button', onclick: closeEditor }, 'Cancel'),
      ),
    ),
  )

  const box = $('editor')
  box.replaceChildren(form)
  box.hidden = false
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  title.focus()
}

async function move(item: Item, by: number) {
  const from = items.indexOf(item)
  const to = from + by
  if (to < 0 || to >= items.length) return
  items.splice(from, 1)
  items.splice(to, 0, item)
  render()
  try {
    await api('/api/order', { method: 'POST', json: { ids: items.map((i) => i.id) } })
  } catch (err) {
    toast((err as Error).message)
    void load()
  }
}

async function remove(item: Item) {
  if (!confirm(`Delete "${item.title}" from the list?`)) return
  try {
    await api(`/api/items/${item.id}`, { method: 'DELETE' })
    items = items.filter((i) => i !== item)
    render()
    toast('Deleted.')
  } catch (err) {
    toast((err as Error).message)
  }
}

// ---------- start ----------

function checkHash() {
  if (location.hash === '#owner' && !owner) openLogin()
}
window.addEventListener('hashchange', checkHash)
void load().then(checkHash)
