import { request } from './api.js';
import DocumentEditor from './DocumentEditor.js';
import { getItem, setItem, removeItem } from './storage.js';

/* 
  주요 기능
  1. DocumentEditor 컴포넌트 생성
  2. Document 조회하기 및 저장 관련 기능
    - 로컬 스토리지 연동
    - fetchPost()로 특정 Document 조회하기
    - onEditing()로 document 편집 시 저장하기
*/
export default function DocumentEditPage({ $target, initialState }) {
  const $page = document.createElement('main');
  $page.className = 'document-editor';
  $target.appendChild($page);

  this.state = initialState;

  let postLocalSaveKey = `temp-post=${this.state.documentId}`;

  const post = getItem(postLocalSaveKey, {
    title: '',
    content: '',
    documents: [],
  });

  const documentEditor = new DocumentEditor({
    $target: $page,
    initialState: post,
    onEditing,
  });

  this.setState = async (nextState) => {
    if (this.state.documentId !== nextState.documentId) {
      this.state = nextState;
      postLocalSaveKey = `temp-post-${this.state.documentId}`;
      await fetchPost();
      return;
    }
    this.state = nextState;
    documentEditor.setState(
      this.state.post || {
        title: '',
        content: '',
        documents: [],
      }
    );
  };

  /*
    - post: 서버로부터 특정 Document를 조회한 데이터
    - tempPost: 로컬 스토리지에 임시 저장된 데이터
    tempPost가 post보다 최신 데이터라면, 
    사용자에게 tempPost를 불러올지를 묻는다.
  */
  const fetchPost = async () => {
    const { documentId } = this.state;
    if (documentId) {
      const post = await request(`/documents/${documentId}`);
      const tempPost = getItem(postLocalSaveKey, {
        title: '',
        content: '',
        documents: [],
      });

      const { tempSaveDate } = tempPost;
      if (tempSaveDate && tempSaveDate > post.updatedAt) {
        if (confirm('저장되지 않은 임시 데이터가 있습니다. 불러올까요?')) {
          this.setState({
            ...this.state,
            post: tempPost,
          });
          return;
        }
      }
      this.setState({
        ...this.state,
        post,
      });
    }
  };

  /*
    사용자가 에디터를 수정 시,
    post를 로컬 스토리지에 실시간으로 저장한다.
    수정이 끝나면 3초 후 서버에 저장하고 로컬 스토리지를 비운다.
  */
  let timer = null;
  function onEditing(post) {
    setItem(postLocalSaveKey, {
      ...post,
      tempSaveDate: new Date(),
    });
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      await request(`/documents/${post.id}`, {
        method: 'PUT',
        body: JSON.stringify(post),
      });
      removeItem(postLocalSaveKey);
    }, 3000);
  }

  this.show = () => {
    $page.classList.add('show');
  };

  this.hide = () => {
    $page.classList.remove('show');
  };

  this.toLeft = () => {
    $page.classList.add('to-left');
  };

  this.toRight = () => {
    $page.classList.remove('to-left');
  };
}
