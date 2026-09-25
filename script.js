const $ = (selector) => document.querySelector(selector);
const searchDialog = $('#search-dialog');
const postDialog = $('#post-dialog');
const input = $('#search-input');
const rows = [...document.querySelectorAll('.post-row')];

$('#year').textContent = new Date().getFullYear();
$('#open-search').addEventListener('click', () => { searchDialog.showModal(); setTimeout(() => input.focus(), 0); });
searchDialog.addEventListener('close', () => { input.value = ''; filterPosts(''); });
input.addEventListener('input', (event) => filterPosts(event.target.value));

function filterPosts(query) {
  const term = query.trim().toLowerCase();
  let shown = 0;
  rows.forEach((row) => { const match = !term || row.dataset.search.includes(term); row.hidden = !match; if (match) shown += 1; });
  $('#no-results').hidden = shown !== 0;
}

document.querySelectorAll('.read-post').forEach((button) => button.addEventListener('click', () => {
  if (button.dataset.post === 'starting') postDialog.showModal();
}));
$('.close-post').addEventListener('click', () => postDialog.close());
postDialog.addEventListener('click', (event) => { if (event.target === postDialog) postDialog.close(); });
searchDialog.addEventListener('click', (event) => { if (event.target === searchDialog) searchDialog.close(); });
