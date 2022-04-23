const ROUTE_CHANGE_EVENT_NAME = 'route-change';

// 커스텀 이벤트 핸들러 등록
export const initRouter = (onRoute) => {
  window.addEventListener(ROUTE_CHANGE_EVENT_NAME, (e) => {
    const { nextUrl } = e.detail;
    if (nextUrl && nextUrl !== location.pathname) {
      history.pushState(null, null, nextUrl);
      onRoute();
    }
  });
};

// 커스텀 이벤트 생성 및 디스패치
export const push = (nextUrl) => {
  window.dispatchEvent(
    new CustomEvent(ROUTE_CHANGE_EVENT_NAME, {
      detail: {
        nextUrl,
      },
    })
  );
};

export const onPopstate = (onRoute) => {
  window.addEventListener('popstate', () => {
    onRoute();
  });
};
