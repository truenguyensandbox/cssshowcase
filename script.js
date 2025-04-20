const gallery = document.getElementById('gallery');
const loader = document.getElementById('loader');
const searchInput = document.getElementById('searchInput');

let page = 1;
let query = '';
let isLoading = false;

const accessKey = "HfuNBOQ4TrJtC_KGyFkPjhuidL-PwCd8Vvhs_mV102k";

async function fetchImages() {
  if (isLoading) return;
  isLoading = true;
  loader.style.display = 'inline-block';

  const endpoint = query
    ? \`https://api.unsplash.com/search/photos?query=\${query}&page=\${page}&client_id=\${accessKey}\`
    : \`https://api.unsplash.com/photos?page=\${page}&client_id=\${accessKey}\`;

  const res = await fetch(endpoint);
  const data = await res.json();
  const results = query ? data.results : data;

  results.forEach(photo => {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4 col-lg-3 fade-in';
    col.innerHTML = \`
      <div class="card border-0 shadow-sm">
        <img src="\${photo.urls.small}" alt="\${photo.alt_description || 'Unsplash photo'}" 
             data-full="\${photo.urls.full}" data-author="\${photo.user.name}" 
             data-download="\${photo.links.download}" class="img-fluid gallery-img" />
        <small class="text-muted px-2 pb-2">Photo by \${photo.user.name}</small>
      </div>
    \`;
    gallery.appendChild(col);
  });

  isLoading = false;
  loader.style.display = 'none';
  page++;
}

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    query = e.target.value.trim();
    page = 1;
    gallery.innerHTML = '';
    fetchImages();
  }
});

window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
    fetchImages();
  }
});

document.addEventListener('click', e => {
  if (e.target.classList.contains('gallery-img')) {
    openLightbox(e.target);
  } else if (e.target.classList.contains('close')) {
    closeLightbox();
  }
});

function openLightbox(img) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxInfo = document.getElementById('lightboxInfo');
  const downloadBtn = document.getElementById('downloadBtn');

  lightboxImage.src = img.dataset.full;
  lightboxImage.alt = img.alt;
  lightboxInfo.textContent = 'Photo by ' + img.dataset.author;
  downloadBtn.href = img.dataset.download;

  lightbox.classList.remove('d-none');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.add('d-none');
}

fetchImages();
