// ⚡️ Import Styles
import './style.scss';
import feather from 'feather-icons';
import qrcode from './assets/images/qrcode.png';
import { showNotification } from './modules/showNotification.js';

// ⚡️ Render Skeleton
document.querySelector('#app').innerHTML = `
<div class='app-container'>
  <div class='qr-code'>
    <h2>QR Code Generator</h2>
    <p>Paste a url or enter text to create QR code</p>

    <form data-form>
      <input type='text' name='text' placeholder='Enter text or url' />
      <select name='size'>
        ${[100, 200, 300, 400, 500, 600, 700].map(index => index === 300 ? `<option selected value='${index}'>${index}x${index}</option>` : `<option value='${index}'>${index}x${index}</option>`).join('')}
      </select>
      <button type='submit' data-submit>Generate QR Code</button>
    </form>

    <div class='content' data-container=''>
      <img src='${qrcode}' alt='QR Code' data-code=''>
      <button data-save=''>Save</button>
    </div>
  </div>

  <a class='app-author' href='https://github.com/nagoev-alim' target='_blank'>${feather.icons.github.toSvg()}</a>
</div>
`;

// ⚡️Class
class App {
  constructor() {
    this.DOM = {
      form: document.querySelector('[data-form]'),
      qrcode: document.querySelector('[data-code]'),
      submitBtn: document.querySelector('[data-submit]'),
      saveBtn: document.querySelector('[data-save]'),
      container: document.querySelector('[data-container]'),
    };


    this.DOM.form.addEventListener('submit', this.onSubmit);
  }

  /**
   * @function onSubmit - Form submit handler
   * @param event
   */
  onSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const { text, size } = Object.fromEntries(new FormData(form).entries());
    if (!text) {
      showNotification('warning', 'Please enter a valid URL');
      return;
    }
    this.DOM.submitBtn.textContent = 'Generating QR Code...';
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${text}`;
    this.DOM.qrcode.src = url;
    this.DOM.qrcode.addEventListener('load', () => {
      this.DOM.container.classList.add('is-show');
      this.DOM.submitBtn.textContent = 'Generate QR Code';
    });

    this.DOM.saveBtn.addEventListener('click', () => this.onSave(url));
  };
  /**
   * @function onSave - Create and save image
   * @param src
   * @returns {Promise<void>}
   */
  onSave = async (src) => {
    const image = await fetch(src);
    const imageBlob = await image.blob();
    const imageURL = URL.createObjectURL(imageBlob);
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'QRCode';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
}

// ⚡️Class Instance
new App();

