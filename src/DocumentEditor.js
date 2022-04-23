import { push } from './router.js';

export default function DocumentEditor({ $target, initialState, onEditing }) {
  const $editor = document.createElement('div');
  $editor.className = 'document-editor__container';
  $target.appendChild($editor);

  this.state = initialState;

  $editor.innerHTML = `
    <input type="text" name="title" class="document-editor__title"/>
    <div name="content" contenteditable="true" class="document-editor__content"></div>
    <ul class="sub-document__list"></ul>
  `;

  const $titleInput = $editor.querySelector('.document-editor__title');
  const $contentDiv = $editor.querySelector('.document-editor__content');
  const $subDocumentList = $editor.querySelector('.sub-document__list');

  this.render = () => {
    const { title, content, documents } = this.state;
    $titleInput.value = title;
    $contentDiv.innerHTML = '<div><br/></div>';
    $contentDiv.innerHTML += content ? content.replace(/\n/g, '<br>') : '';
    renderSubList(documents);
  };
  this.render();

  // subList: 현재 편집 중인 Document의 하위 Document 리스트
  function renderSubList(documents) {
    function getSubListHtml(documents) {
      return documents
        .map(
          ({ id, title }) =>
            `<li data-id=${id} class="sub-document__item">@ ${title}</li>`
        )
        .join('');
    }
    if (!!documents.length) {
      $subDocumentList.innerHTML = getSubListHtml(documents);
    } else {
      $subDocumentList.innerHTML = '';
    }
  }

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  $titleInput.addEventListener('keyup', ({ target }) => {
    const nextState = {
      ...this.state,
      title: target.value,
    };
    this.setState(nextState);
    onEditing(this.state);
  });

  $contentDiv.addEventListener('input', ({ target }) => {
    const nextState = {
      ...this.state,
      content: target.innerHTML,
    };
    onEditing(nextState);
  });

  /* 
    마크다운 문법을 변환해주는 기능이다. (현재까지는 # 만을 변환 가능)
    예: # 제목 => <h1>제목</h1>로 변환한다. 
    Enter 또는 Tab 키가 눌렸을 때 발생한다. 
  */
  $contentDiv.addEventListener('keydown', (e) => {
    if (e.isComposing) {
      return;
    }
    switch (e.key) {
      case 'Enter':
      case 'Tab':
        const selection = getSelection();
        const node = selection.anchorNode; // 해당 줄
        const text = node.textContent; // 해당 줄 텍스트
        const parentNode = node.parentNode; // 해당 줄 랩퍼(<div>)

        // 맨 앞 커서에서 엔터키
        if (
          parentNode.nodeName !== 'DIV' &&
          selection.getRangeAt(0).endOffset === 0
        ) {
          e.preventDefault();
          const divEl = document.createElement('div');
          divEl.innerHTML = '<br>';
          parentNode.parentNode.before(divEl);
        }

        if (!text) {
          return;
        }

        /*
          Heading 태그 변환
          - HACK: 좋지 않은 코드. 중복이 너무 많음. 가독성이 좋지 않음.
          - FIXME: 엔터 후 커서가 첫째 줄로 강제 이동하는 버그 존재. 
            항상 발생하는 것은 아니고 때때로 발생함. 원인 미파악.
            향후 수정 필요.
        */
        if (/^#{1}\s?/.test(text)) {
          e.preventDefault();
          let nodeIndex;
          parentNode.innerHTML = text.replace(/^#\s?(.+)/, `<h1>$1</h1>`);
          $contentDiv.childNodes.forEach((node, index) => {
            if (node === parentNode) nodeIndex = index;
          });
          selection.collapse($contentDiv, nodeIndex + 1);
        }
        if (/^#{2}\s?/.test(text)) {
          e.preventDefault();
          let nodeIndex;
          parentNode.innerHTML = text.replace(/^#{2}\s?(.+)/, `<h2>$1</h2>`);
          $contentDiv.childNodes.forEach((node, index) => {
            if (node === parentNode) nodeIndex = index;
          });
          selection.collapse($contentDiv, nodeIndex + 1);
        }
        if (/^#{3}\s?/.test(text)) {
          e.preventDefault();
          let nodeIndex;
          parentNode.innerHTML = text.replace(/^#{3}\s?(.+)/, `<h3>$1</h3>`);
          $contentDiv.childNodes.forEach((node, index) => {
            if (node === parentNode) nodeIndex = index;
          });
          selection.collapse($contentDiv, nodeIndex + 1);
        }
        if (/^#{4}\s?/.test(text)) {
          e.preventDefault();
          let nodeIndex;
          parentNode.innerHTML = text.replace(/^#{4}\s?(.+)/, `<h4>$1</h4>`);
          $contentDiv.childNodes.forEach((node, index) => {
            if (node === parentNode) nodeIndex = index;
          });
          selection.collapse($contentDiv, nodeIndex + 1);
        }
    }
  });

  // 하위 Document 리스트를 클릭하면 해당 Document로 이동한다.
  $subDocumentList.addEventListener('click', ({ target }) => {
    const $li = target.closest('li');
    if ($li) {
      const { id } = $li.dataset;
      push(`/documents/${id}`);
    }
  });
}
