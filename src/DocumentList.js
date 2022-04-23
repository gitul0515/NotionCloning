import { push } from './router.js';

export default function DocumentList({
  $target,
  initialState,
  onDelete,
  onNewDocument,
}) {
  const $documentList = document.createElement('div');
  $documentList.className = 'documents__container';

  $target.appendChild($documentList);

  this.state = initialState;

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  /*
    HACK: 안 좋은 해결책. 구현이 복잡하고 비효율적임.
    - this.state를 부분적으로 수정한다.
      id와 일치하는 객체를 찾은 후,
      그 객체의 documents 배열에
      createdDocument를 반영하는 객체를 만들어 삽입한다. 
  */
  this.setStateOptimistic = (_id, createdDocument) => {
    const id = parseInt(_id, 10);
    function update(state) {
      state.forEach((item) => {
        if (item.id === parseInt(id, 10)) {
          item.documents.push({
            id: createdDocument.id,
            title: createdDocument.title,
            documents: [],
          });
        }
        if (item.documents.length !== 0) {
          update(item.documents);
        }
      });
    }
    update(this.state);
    this.render();
  };

  /*
    HACK: 안 좋은 해결책. 구현이 복잡하고 버그가 일부 존재한다. 
    1. 파라미터
      - selectedId: AccordionBtn이 클릭된 id를 의미한다. 
      - deletedId: DeleteBtn이 클릭된 id를 의미한다. 
    2. document의 프로퍼티 값에 따라 html이 달라진다.
      - isOpened: true일 경우 자식 document를 렌더링 한다.
      - isDeleted: true일 경우 현재 document를 렌더링하지 않는다. 
      - !!documents.length: true는 
        현재 document가 자식 document를 가졌음을 의미. false는 그 반대이다. 
        이 값에 따라 부여되는 버튼 및 아이콘이 다르다. 
    3. 버그
      - 자식 document를 모두 삭제하였음에도
        부모 document의 AccordionBtn이 사라지지 않는 버그.
      - isDeleted 프로퍼티로 인한 버그로 추측됨. 
        isDeleted 프로퍼티를 사용하지 말고 다른 방식으로 구현할 것.
  */
  this.getListHtml = (state, selectedId, deletedId) => {
    return `
      <ul class="documents__list">
        ${state
          .map((item) => {
            if (item.id === selectedId) {
              item.isOpened = !item.isOpened;
            }
            if (item.id === deletedId) {
              item.isDeleted = true;
            }
            if (item.isDeleted) {
              return '';
            }
            const { id, title, documents, isOpened } = item;
            return `
              <li class="documents__item" data-id=${id}>
                ${
                  !!documents.length
                    ? this.getAccordionBtnHtml()
                    : this.getNoteIconHtml()
                }
                <h2 class="item__title">${title}</h2>
                ${!!documents.length ? `` : this.getDeleteBtnHtml()}
                ${this.getAddBtnHtml()}
              </li>
              ${
                isOpened
                  ? this.getListHtml(documents, selectedId, deletedId)
                  : ``
              }
            `;
          })
          .join('')}
      </ul>
    `;
  };

  this.getAccordionBtnHtml = () =>
    `<button class="item__btn item__btn--accordion">
      <i class="fa-solid fa-caret-right"></i>
    </button>`;

  this.getNoteIconHtml = () => `<i class="fa-regular fa-note-sticky"></i>`;

  this.getDeleteBtnHtml = () =>
    `<button class="item__btn item__btn--delete">
      <i class="fa-solid fa-trash-can"></i>
    </button>`;

  this.getAddBtnHtml = () =>
    `<button class="item__btn item__btn--add">
      <i class="fa-solid fa-plus"></i>
    </button>`;

  this.getAddRootBtnHtml = () =>
    `<button class="documents__btn--add-root">
      <i class="fa-solid fa-plus"></i>
      문서 추가
    </button>`;

  this.render = (selectedId, deletedId) => {
    $documentList.innerHTML = this.getListHtml(
      this.state,
      selectedId,
      deletedId
    );
    $documentList.innerHTML += this.getAddRootBtnHtml();
  };
  this.render();

  $documentList.addEventListener('click', ({ target }) => {
    const $li = target.closest('li');
    if ($li) {
      const { id } = $li.dataset;
      if (target.matches('.documents__item')) {
        push(`/documents/${id}`);
      }
      if (target.matches('.item__btn--accordion')) {
        const selectedId = parseInt(id, 10);
        this.render(selectedId, null);
      }
      if (target.matches('.item__btn--delete')) {
        onDelete(id);
        const deletedId = parseInt(id, 10);
        this.render(null, deletedId);
      }
      if (target.matches('.item__btn--add')) {
        onNewDocument(id);
      }
    }
    if (target.matches('.documents__btn--add-root')) {
      onNewDocument(null);
    }
  });
}
