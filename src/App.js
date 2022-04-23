import DocumentEditPage from './DocumentEditPage.js';
import DocumentsPage from './DocumentsPage.js';
import { initRouter, onPopstate } from './router.js';
import { request } from './api.js';
import TitlePage from './TitlePage.js';

/*
  주요 기능
  1. DocumentsPage, TitlePage, DocumentEditPage 컴포넌트 생성
  2. 각각의 컴포넌트에 전달하는 콜백함수를 정의
    (TODO: 함수 추출 등 리팩터링 필요)
  3. 라우팅
    - URL에 따라 페이지를 동적으로 렌더링: this.route()
    - popstate 등 라우팅 관련 이벤트 핸들러 등록
*/
export default function App({ $target }) {
  const documentsPage = new DocumentsPage({
    $target,
    onDelete: async (deletedId) => {
      await request(`/documents/${deletedId}`, {
        method: 'DELETE',
      });

      // 편집 중이던 document를 삭제한 경우, 홈 루트로 돌아간다.
      const { pathname } = window.location;
      if (pathname.indexOf('/documents/') === 0) {
        const [, , documentId] = pathname.split('/');
        if (deletedId === documentId) {
          history.replaceState(null, null, '/');
          this.route();
        }
      }
    },

    /*
      TODO: 하위 컴포넌트로 로직을 위임하거나 커스텀 이벤트를 사용하여
      지금보다 간단하게 구현할 필요 있음
    */
    onNewDocument: async (id) => {
      const createdDocument = await request('/documents', {
        method: 'POST',
        body: JSON.stringify({
          title: '새 문서',
          parent: id,
        }),
      });
      history.replaceState(null, null, `/documents/${createdDocument.id}`);
      this.route();

      /*
        id가 존재한다면 서버에 요청하지 않고
        documentsPage를 낙관적으로 업데이트한다.
        id가 존재하지 않는다면
        서버에 요청하여 documentsPage를 업데이트한다.
       */
      if (id) {
        documentsPage.setStateOptimistic(id, createdDocument);
      } else {
        documentsPage.setState();
      }
    },
    onToggle: (isToggled) => {
      if (isToggled) {
        documentsPage.toLeft(); // TODO: 세 개의 함수를 하나로 묶어서 처리하는 리팩터링
        titlePage.toLeft();
        documentEditPage.toLeft();
      } else {
        documentsPage.toRight();
        titlePage.toRight();
        documentEditPage.toRight();
      }
    },
  });

  const titlePage = new TitlePage({
    $target,
  });

  const documentEditPage = new DocumentEditPage({
    $target,
    initialState: {
      documentId: '',
      post: {
        title: '',
        content: '',
      },
    },
  });

  /*
    라우팅: URL에 따라 페이지를 동적으로 렌더링
    - 루트: DocumentsPage, TitlePage
    - 루트 외: DocumentsPage, DocumentEditPage
   */
  let isInit = false;
  this.route = () => {
    const { pathname } = window.location;
    if (pathname === '/' || pathname === '/index.html') {
      documentsPage.setState();
      titlePage.show();
      documentEditPage.hide();
      isInit = true;
    } else if (pathname.indexOf('/documents/') === 0) {
      if (!isInit) {
        documentsPage.setState();
        isInit = true;
      }
      const [, , documentId] = pathname.split('/');
      documentEditPage.setState({
        documentId,
      });
      titlePage.hide();
      documentEditPage.show();
    }
  };
  this.route();

  initRouter(() => this.route());
  onPopstate(() => this.route());
}
