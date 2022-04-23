export default function DocumentHeader({ $target }) {
  const $header = document.createElement('header');
  $header.className = 'documents__header';
  $target.appendChild($header);

  this.render = () => {
    $header.innerHTML = `
      <a class="header__anchor" href="/">
        <img class="header__logo" src="/asset/image/notion-logo-1.svg" alt="노션 로고"">
        <h1 class="header__title">기홍의 Notion</h1>
      </a>
    `;
  };
  this.render();
}
