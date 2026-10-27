/* سرویس‌ورکر اعلان‌ها — این فایل باید کنار index.html باشد */
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil((async () => {
    const list = await self.clients.matchAll({type:'window', includeUncontrolled:true});
    for (const c of list) { if ('focus' in c) return c.focus(); }
    if (self.clients.openWindow) return self.clients.openWindow('./');
  })());
});
