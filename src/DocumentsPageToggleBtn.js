/*
  DocumentsPage를 open/close 할 수 있는 토글 버튼이다. 
  - open: isToggled가 false인 상태. DocumentsPage가 화면에 보인다. 
  - close: isToggled가 true인 상태. DocumentsPage가 왼쪽으로 이동하여 보이지 않는다. 
  - onToggle에 isToggled를 전달한다. 
*/
export default function DocumentsPageToggleBtn({
  $target,
  initialState,
  onToggle,
}) {
  const $button = document.createElement('button');
  $button.className = 'documents__toggle-btn';

  $target.appendChild($button);

  this.state = initialState;

  this.render = () => {
    if (this.state.isToggled) {
      $button.innerHTML = '<i class="fa-solid fa-angles-right"></i>';
      $button.classList.add('toggled');
    } else {
      $button.innerHTML = '<i class="fa-solid fa-angles-left"></i>';
      $button.classList.remove('toggled');
    }
  };
  this.render();

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  $button.addEventListener('click', (e) => {
    this.setState({
      isToggled: !this.state.isToggled,
    });
    onToggle(this.state.isToggled);
  });
}
