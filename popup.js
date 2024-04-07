let btn = document.getElementById('get_time')
let span = document.getElementById('box')

// Send a message to content.js to get the video duration when the extension button is clicked
let ComingArray = {};
let pageUrl = null;
let VideoTitle = null;
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  pageUrl = tabs[0].url;
  ComingArray[pageUrl] = [];
  if (/^https:\/\/www\.youtube\.com\/watch\?v=.+/.test(pageUrl)) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "giveImageArray", pageUrl });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  ComingArray[pageUrl] = JSON.parse(JSON.stringify(message.ImagesArray));
  VideoTitle = message.videoTitle;
  const Container = document.getElementById('container');
  const title = document.createElement('h1');
  title.style.display = 'flex';
  title.style.justifyContent = 'center';
  title.style.marginBottom = '20px';
  title.innerHTML = VideoTitle;
  Container.appendChild(title);
  message.ImagesArray.map((src) => {
    const image = document.createElement('img');
    image.src = src[0];
    image.style.width = '100%';

    const a = document.createElement('a');
    a.href = src[1];
    a.appendChild(image);
    Container.appendChild(a);
    if(src[2] != ""){
      const note = document.createElement('p');
      note.style.fontSize = '15px';
      note.innerText = src[2];
      Container.appendChild(note);
    }
  })
});

const downloadbtns = document.getElementById('downloadbtns');
downloadbtns.addEventListener('click', () => {
  convertHTMLtoPDF()
})

function convertHTMLtoPDF() {

  const Container = document.getElementById('container');
  // Choose the element and save the PDF for your user.
  // pagebreak: { before: 'a', after: ['p'], avoid: 'a' },

  var opt = {
    margin :       [0.38, 0.5],
    filename:     VideoTitle,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, allowTaint: true, letterRendering: true},
    pagebreak: {avoid: ['a','p'] },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(Container).save();
}