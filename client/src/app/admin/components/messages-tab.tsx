'use client';

import React from 'react';
import { useAdmin } from './admin-context';

export function MessagesTab() {
  const { t, msgFilter, setMsgFilter, filteredMessages, unreadCount, expandedMsg, setExpandedMsg, handleMarkRead, handleDeleteMsg } = useAdmin();

  return (
    <>
      <div className="flex gap-2 mb-4 flex-wrap">
        {(['all', 'unread', 'read'] as const).map((f) => (
          <button key={f} onClick={() => setMsgFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full transition font-medium ${msgFilter === f ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700'}`}>
            {f === 'all' ? t.admin.allMessages : f === 'unread' ? `${t.admin.unread} (${unreadCount})` : t.admin.read}
          </button>
        ))}
      </div>
      {filteredMessages.length === 0 ? (
        <p className="text-center text-slate-500 dark:text-slate-400 py-12">{t.admin.noMessages}</p>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => (
            <div key={msg.id} className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border transition ${msg.isRead ? 'border-slate-200 dark:border-slate-700' : 'border-l-4 border-l-slate-500 border-slate-200 dark:border-slate-700'}`}>
              <button onClick={() => setExpandedMsg(expandedMsg === msg.id ? null : msg.id)} className="w-full text-left p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!msg.isRead && <span className="w-2 h-2 bg-slate-500 rounded-full shrink-0" />}
                      <h3 className="font-semibold text-slate-800 dark:text-white truncate">{msg.subject}</h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{msg.name} &lt;{msg.email}&gt;</p>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap ml-4">{new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                {expandedMsg === msg.id && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{msg.message}</p>
                    <div className="flex gap-2 mt-4">
                      {!msg.isRead && <button onClick={(e) => { e.stopPropagation(); handleMarkRead(msg.id); }}
                        className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition font-medium">{t.admin.markRead}</button>}
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteMsg(msg.id); }}
                        className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition font-medium">{t.admin.delete}</button>
                    </div>
                  </div>
                )}
                {expandedMsg !== msg.id && <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 truncate">{msg.message}</p>}
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
