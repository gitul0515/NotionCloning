export default function TitlePage({ $target }) {
  const $div = document.createElement('div');
  $div.className = 'title-page';
  $target.appendChild($div);

  this.render = () => {
    $div.innerHTML = `
    <div class="title-page__title">
      <h1>환영합니다</h1>
      <h2>
        문서를 만들고 수정해 보세요. <br>
        입력한 내용은 자동으로 저장됩니다. 
      </h2>
    </div>
    <img
      class="title-page__img"
      src="../asset/image/title-img.png" 
      alt="타이틀 이미지" 
    /> 
    `;
  };
  this.render();

  this.show = () => {
    $div.classList.add('show');
  };

  this.hide = () => {
    $div.classList.remove('show');
  };

  this.toLeft = () => {
    $div.classList.add('to-left');
  };

  this.toRight = () => {
    $div.classList.remove('to-left');
  };
}
