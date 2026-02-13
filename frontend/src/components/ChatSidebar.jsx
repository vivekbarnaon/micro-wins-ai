import { useEffect } from 'react';

const ChatSidebar = ({ chatHistory, onNewChat, onLoadHistory, onClose, showSidebar }) => {
  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (showSidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showSidebar]);
  return (
    <nav
      className={`fixed left-0 h-screen bg-white dark:bg-gray-900 z-50 flex flex-col transition-all duration-300 shadow-2xl
        w-56
        top-16
        sm:w-56
        md:w-56
        lg:w-56
        xl:w-56
        2xl:w-56
        sm:translate-x-0
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        sm:static
      `}
      style={{ minHeight: '100vh', overflow: 'hidden' }}
    >

      <div className="flex flex-col gap-2 py-4" style={{ minHeight: 0 }}>
        <button
          onClick={onNewChat}
          className="flex items-center w-full px-4 py-3 rounded-lg transition-colors group text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-base font-medium">New Chat</span>
        </button>
        <div className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-400">Recent</div>
        <div className="flex-1 overflow-y-auto flex flex-col gap-2" style={{ minHeight: 0, maxHeight: 'calc(100vh - 140px)' }}>
          {chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-8">
              <svg className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center">No previous chats</p>
            </div>
          ) : (
            chatHistory.map((item) => (
              <button
                key={item.id}
                className="group flex items-center w-full px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                onClick={() => onLoadHistory(item)}
              >
                <svg className="w-4 h-4 mr-2 text-gray-300 dark:text-gray-600 group-hover:text-gray-800 dark:group-hover:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="flex-1 truncate text-gray-800 dark:text-gray-100 text-sm">{item.title}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </nav>
  );
};

export default ChatSidebar;
