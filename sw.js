/* سرویس‌ورکر اعلان‌ها — این فایل باید کنار index.html و روی HTTPS قرار گیرد */

self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(event){ event.waitUntil(self.clients.claim()); });

/* پیام Web Push از سرور: {title, body, tag, url} */
self.addEventListener('push', function(event){
  let data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch(e){ data = { body: event.data ? event.data.text() : '' }; }
  const opts = {
    body: data.body || '',
    tag: data.tag || undefined,
    renotify: !!data.tag,
    dir: 'rtl',
    lang: 'fa',
    data: { url: data.url || './' }
  };
  event.waitUntil(self.registration.showNotification(data.title || 'سامانه جامع HSE', opts));
});

/* کلیک روی اعلان: اگر برنامه باز است همان پنجره فعال شود، وگرنه برنامه باز شود */
self.addEventListener('notificationclick', function(event){
  event.notification.close();
  const target = new URL((event.notification.data && event.notification.data.url) || './', self.registration.scope).href;
  event.waitUntil((async function(){
    const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of list){
      if ('focus' in c){
        await c.focus();
        if (c.url !== target && 'navigate' in c){ try { await c.navigate(target); } catch(e){} }
        return;
      }
    }
    if (self.clients.openWindow) return self.clients.openWindow(target);
  })());
});
