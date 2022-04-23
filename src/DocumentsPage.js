import { request } from './api.js';
import DocumentHeader from './DocumentHeader.js';
import DocumentList from './DocumentList.js';
import DocumentsPageToggleBtn from './DocumentsPageToggleBtn.js';

/* 
  주요 기능
    - DocumentHeader, DocumentList, DocumentsPageToggleBtn 컴포넌트 생성
*/
export default function DocumentsPage({
  $target,
  onDelete,
  onNewDocument,
  onToggle,
}) {
  const $page = document.createElement('aside');
  $page.className = 'documents';
  $target.appendChild($page);

  new DocumentHeader({
    $target: $page,
  });

  const documentList = new DocumentList({
    $target: $page,
    initialState: [],
    onDelete,
    onNewDocument,
  });

  new DocumentsPageToggleBtn({
    $target: $page,
    initialState: {
      isToggled: false,
    },
    onToggle,
  });

  /* 
    서버에게 documents를 GET 요청한 뒤,
    documentList의 state를 변경한다. 
  */
  this.setState = async () => {
    const documents = await request('/documents');
    documentList.setState(documents);
  };

  /*
    서버에게 documents를 GET 요청하지 않고
    낙관적 업데이트 방식으로 
    documentList의 state를 변경한다. 
  */
  this.setStateOptimistic = (id, createdDocument) => {
    documentList.setStateOptimistic(id, createdDocument);
  };

  this.toLeft = () => {
    $page.classList.add('to-left');
  };

  this.toRight = () => {
    $page.classList.remove('to-left');
  };
}
