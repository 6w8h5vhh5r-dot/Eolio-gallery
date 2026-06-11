const albumGrid = document.querySelector('#albumGrid')
const styleGrid = document.querySelector('#styleGrid')
const viewer = document.querySelector('#viewer')
const photoFlow = document.querySelector('#photoFlow')
const viewerTitle = document.querySelector('#viewerTitle')
const viewerMeta = document.querySelector('#viewerMeta')
const viewerDesc = document.querySelector('#viewerDesc')
const backBtn = document.querySelector('#backBtn')

const loadJson = async (url) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Cannot load ${url}`)
  return res.json()
}

const makeCard = (item, label) => {
  const card = document.createElement('article')
  card.className = 'card'
  card.tabIndex = 0
  card.innerHTML = `
    <img src="${item.cover}" alt="${item.title || item.name}" loading="lazy">
    <h3>${item.title || item.name}</h3>
    <p>${label} · ${item.count} photos</p>
  `
  const open = () => openViewer(item, label)
  card.addEventListener('click', open)
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') open()
  })
  return card
}

const openViewer = (item, label) => {
  viewer.hidden = false
  viewerTitle.textContent = item.title || item.name
  viewerMeta.textContent = `${label} · ${item.count} photos`
  viewerDesc.textContent = item.description || ''
  photoFlow.innerHTML = ''
  item.photos.forEach((photo, index) => {
    const image = document.createElement('img')
    image.src = photo
    image.alt = `${item.title || item.name} ${index + 1}`
    image.loading = 'lazy'
    photoFlow.appendChild(image)
  })
  viewer.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

backBtn.addEventListener('click', () => {
  viewer.hidden = true
  document.querySelector('#albums').scrollIntoView({ behavior: 'smooth' })
})

Promise.all([loadJson('data/albums.json'), loadJson('data/styles.json')])
  .then(([albums, styles]) => {
    albumGrid.replaceChildren(...albums.map((item) => makeCard(item, 'Album')))
    styleGrid.replaceChildren(...styles.map((item) => makeCard(item, 'Style')))
  })
  .catch((error) => {
    document.body.insertAdjacentHTML('beforeend', `<p style="padding: 20px">${error.message}</p>`)
  })
