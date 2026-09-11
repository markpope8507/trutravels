  <script>/* Bookings — cards, manage panel tabs, and the add-ons model.
     Add-on prices and rooming rules mirror src/lib/addons.ts; the panel behaves
     the same way the checkout's does, capped at the travellers on the booking. */
  (function () {
    var money = function (n) { return '£' + Math.round(n).toLocaleString('en-GB'); };

    /* Departure dates are stored as offsets from today so the demo never goes
       stale — resolve them once up front into the fields the renderers use. */
    (function () {
      function at(offset) { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + offset); return d; }
      function fmt(d) { return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }); }
      BOOKINGS.forEach(function (b) {
        var dep = at(b.departsIn);
        b.departs = dep.toISOString().slice(0, 10);
        b.departsFmt = fmt(dep);
        b.endsFmt = fmt(at(b.departsIn + b.lasts));
        b.balanceDue = b.balanceDueIn ? fmt(at(b.balanceDueIn)) : '';
      });
    })();
    var state = {};   /* bookingId -> { open, tab, addons: {id: true|rooming} } */

    function roomType(id) { for (var i = 0; i < ROOM_TYPES.length; i++) if (ROOM_TYPES[i].id === id) return ROOM_TYPES[i]; return null; }
    function placed(r) { return ROOM_TYPES.reduce(function (n, t) { return n + (r[t.id] || 0) * t.sleeps; }, 0); }
    function roomingCost(r) { return !r ? 0 : r.nights * ROOM_TYPES.reduce(function (s, t) { return s + (r[t.id] || 0) * t.price; }, 0); }
    function defaultRooming(pax) {
      var r = { nights: 1 };
      ROOM_TYPES.forEach(function (t) { r[t.id] = 0; });
      r.twin = Math.max(1, pax);
      return r;
    }
    function clampRooming(r, pax) {
      r.nights = Math.max(1, Math.min(14, r.nights || 1));
      ROOM_TYPES.forEach(function (t) { r[t.id] = Math.max(0, r[t.id] || 0); });
      for (var i = ROOM_TYPES.length - 1; i >= 0; i--) {
        while (r[ROOM_TYPES[i].id] > 0 && placed(r) > pax) r[ROOM_TYPES[i].id]--;
      }
      return r;
    }
    function shiftDate(iso, days) {
      var d = new Date(iso);
      d.setDate(d.getDate() + days);
      return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    }
    function daysToGo(iso) {
      var d = new Date(iso); d.setHours(0, 0, 0, 0);
      var t = new Date(); t.setHours(0, 0, 0, 0);
      return Math.round((d - t) / 86400000);
    }

    /* ---------------------------------------------------------- steppers -- */
    function stepper(bid, aid, key, val, canDec, canInc) {
      return '<span class="acct-step">'
        + '<button type="button" class="acct-step__btn" data-step="' + key + '" data-addon="' + aid + '" data-bk="' + bid + '" data-dir="-1" aria-label="One fewer"' + (canDec ? '' : ' disabled') + '>&minus;</button>'
        + '<span class="acct-step__val">' + val + '</span>'
        + '<button type="button" class="acct-step__btn" data-step="' + key + '" data-addon="' + aid + '" data-bk="' + bid + '" data-dir="1" aria-label="One more"' + (canInc ? '' : ' disabled') + '>+</button>'
        + '</span>';
    }

    function roomingPanel(b, addon, r) {
      var pax = b.travellers, n = placed(r), left = pax - n, cost = roomingCost(r);
      var checkin = addon.id === 'prenight' ? shiftDate(b.departs, -r.nights) : shiftDate(b.departs, 0);
      var rows = ROOM_TYPES.filter(function (t) { return !t.min2 || pax > 1; }).map(function (t) {
        return '<div class="acct-room">' + stepper(b.id, addon.id, t.id, r[t.id], r[t.id] > 0, left >= t.sleeps)
          + '<span class="acct-room__txt"><span class="acct-room__name">' + t.name
          + ' <span class="acct-room__rate">£' + t.price + ' ' + t.rate + '</span></span>'
          + '<small>' + t.note + '</small></span></div>';
      }).join('');
      return '<div class="acct-addon__cfg">'
        + '<div class="acct-room">' + stepper(b.id, addon.id, 'nights', r.nights, r.nights > 1, r.nights < 14)
        + '<span class="acct-room__txt"><span class="acct-room__name">Nights at <strong>TruTravels '
        + (addon.on === 'start' ? b.start : b.end) + ' Hotel</strong></span></span></div>'
        + '<p class="acct-addon__checkin">Check-in <strong>' + checkin + '</strong></p>'
        + '<div class="acct-addon__rhead"><p class="acct-addon__rh">Rooming</p>'
        + '<p class="acct-addon__cap' + (left > 0 ? ' is-warn' : '') + '">' + n + ' of ' + pax + ' traveller' + (pax === 1 ? '' : 's') + ' placed</p></div>'
        + rows
        + '<div class="acct-addon__total">'
        + (cost > 0
            ? '<span>' + r.nights + ' night' + (r.nights > 1 ? 's' : '') + ' · ' + n + ' traveller' + (n === 1 ? '' : 's') + '</span><strong>' + money(cost) + '</strong>'
            : '<span class="acct-addon__hint">Choose how your group is rooming to include this stay.</span>')
        + '</div></div>';
    }

    function addonRow(b, addon) {
      var s = state[b.id], booked = !!(b.extras && b.extras[addon.id]);
      var on = !booked && !!s.addons[addon.id];
      var r = addon.hotel && on ? s.addons[addon.id] : null;
      var cost = addon.hotel ? roomingCost(r) : addon.price;
      var from = Math.min.apply(null, ROOM_TYPES.map(function (t) { return t.price; }));
      var price = addon.hotel ? (on && cost > 0 ? money(cost) : 'from £' + from) : money(addon.price);
      var sub = addon.id === 'arrival' ? 'Pick-up from ' + b.start + ' Airport'
              : addon.id === 'departure' ? 'Drop-off to ' + b.end + ' Airport'
              : (addon.on === 'start' ? b.start : b.end) + ' · ' + shiftDate(b.departs, addon.on === 'start' ? -1 : 0);
      var info = addon.info
        ? '<span class="acct-info"><button type="button" class="acct-info__btn" data-info="' + addon.id + '" data-bk="' + b.id + '" aria-label="More about the ' + addon.name + '">'
          + '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 11.25v4.75"/><circle cx="12" cy="7.9" r="1" fill="currentColor" stroke="none"/></svg></button>'
          + '<span class="acct-info__pop"' + (s.info === addon.id ? '' : ' hidden') + ' role="tooltip">'
          + addon.info.replace('{start}', b.start).replace('{end}', b.end) + '</span></span>'
        : '';
      return '<div class="acct-addon' + (on ? ' is-on' : '') + '">'
        + '<div class="acct-addon__row"><div class="acct-addon__info">'
        + '<p class="acct-addon__name">' + addon.name + info + '</p>'
        + '<p class="acct-addon__sub">' + sub + '</p></div>'
        + '<div class="acct-addon__right"><p class="acct-addon__price">' + price + '</p>'
        + (booked
            ? '<span class="acct-addon__booked">Booked ✓</span>'
            : '<button type="button" class="acct-addon__btn' + (on ? ' is-on' : '') + '" data-addon-toggle="' + addon.id + '" data-bk="' + b.id + '">' + (on ? 'Added' : 'Add') + '</button>')
        + '</div></div>'
        + (on && addon.hotel && r ? roomingPanel(b, addon, r) : '')
        + '</div>';
    }

    function addonsTab(b) {
      var s = state[b.id];
      var cats = ['Accommodation', 'Transfers'].map(function (cat) {
        return '<p class="acct-addon__cat">' + cat + '</p>'
          + ADDONS.filter(function (a) { return a.cat === cat; }).map(function (a) { return addonRow(b, a); }).join('');
      }).join('');
      var running = ADDONS.reduce(function (sum, a) {
        if (!s.addons[a.id] || (b.extras && b.extras[a.id])) return sum;
        return sum + (a.hotel ? roomingCost(s.addons[a.id]) : a.price);
      }, 0);
      return '<p class="acct-note">Everything you could add at checkout, you can still add here. Extras are confirmed by the team and charged to your booking &mdash; nothing is taken until they’re confirmed.</p>'
        + cats
        + '<p class="acct-addon__cat">Rooming on the trip</p>'
        + '<div class="acct-addon"><div class="acct-addon__row"><div class="acct-addon__info">'
        + '<p class="acct-addon__name">My Own Room Upgrade</p>'
        + '<p class="acct-addon__sub">Upgrade from twin-share to your own private room for the whole trip. Subject to availability.</p></div>'
        + '<div class="acct-addon__right"><p class="acct-addon__price">' + money(ROOM_UPGRADE) + '</p>'
        + '<span class="acct-addon__per">per person</span>'
        + '<button type="button" class="acct-addon__btn">Request</button></div></div></div>'
        + (running > 0
            ? '<div class="acct-addon__sum"><div><p>Extras to add</p><small>We’ll confirm availability before anything is charged.</small></div>'
              + '<div class="acct-addon__sum-r"><strong>' + money(running) + '</strong><button type="button" class="acct-addon__btn">Request extras</button></div></div>'
            : '');
    }

    /* -------------------------------------------------------------- tabs -- */
    function overviewTab(b) {
      var rows = [
        ['Booking reference', b.ref],
        ['Trip', b.title + ' · ' + b.duration],
        ['Route', b.start + ' → ' + b.end],
        ['Departs', b.departsFmt],
        ['Returns', b.endsFmt],
        ['Travellers', b.travellers + ' · ' + b.passengers.join(', ')],
        ['Tour leader', b.leader],
      ].map(function (r) { return '<div class="acct-kv"><span>' + r[0] + '</span><span>' + r[1] + '</span></div>'; }).join('');
      var pay = '<div class="acct-kv"><span>Trip total</span><span>' + money(b.price) + '</span></div>'
        + '<div class="acct-kv"><span>Paid</span><span class="is-green">' + money(b.paid) + '</span></div>'
        + (b.balance > 0
            ? '<div class="acct-kv"><span>Balance due ' + (b.balanceDue ? '· ' + b.balanceDue : '') + '</span><span class="is-pink">' + money(b.balance) + '</span></div>'
              + '<button type="button" class="acct-pay">Make a payment</button>'
            : '<div class="acct-kv"><span>Balance</span><span class="is-green">Paid in full</span></div>');
      return '<div class="acct-kvs">' + rows + '</div><p class="acct-addon__cat">Payments</p><div class="acct-kvs">' + pay + '</div>';
    }

    function goodToGoTab(b) {
      var items = [
        ['Passport details', b.goodToGo],
        ['Insurance policy', b.goodToGo],
        ['Emergency contact', b.goodToGo],
        ['Dietary requirements', b.goodToGo],
        ['Flight details', false],
        ['Booking conditions accepted', true],
      ];
      var done = items.filter(function (i) { return i[1]; }).length;
      return '<p class="acct-note">' + done + ' of ' + items.length + ' complete. We need these before you travel.</p>'
        + '<div class="acct-checks">' + items.map(function (i) {
            return '<div class="acct-check' + (i[1] ? ' is-done' : '') + '">'
              + '<span class="acct-check__box">' + (i[1] ? '✓' : '') + '</span>'
              + '<span>' + i[0] + '</span>'
              + (i[1] ? '' : '<button type="button" class="acct-check__cta">Add</button>') + '</div>';
          }).join('') + '</div>';
    }

    function feedbackTab() {
      return '<div class="acct-feedback"><p class="acct-feedback__h">How was your trip?</p>'
        + '<p class="acct-note">Your feedback shapes the trips we run and helps the next group.</p>'
        + '<button type="button" class="acct-pay">Leave feedback</button></div>';
    }

    /* ------------------------------------------------------------- card -- */
    function tabsFor(b) {
      var t = [{ id: 'overview', label: 'Overview' }];
      if (b.status === 'upcoming') {
        t.push({ id: 'goodtogo', label: 'Good to Go' + (b.goodToGo ? ' ✓' : '') });
        t.push({ id: 'addons', label: 'Add-Ons' });
      }
      if (b.status === 'completed') t.push({ id: 'feedback', label: 'Feedback' });
      return t;
    }

    function bookingCard(b) {
      var s = state[b.id];
      var days = daysToGo(b.departs);
      var badge = b.status === 'completed'
        ? '<span class="acct-bk__badge is-done">Completed</span>'
        : '<span class="acct-bk__badge">' + (days >= 0 ? days + ' days to go' : 'Departed') + '</span>';
      var tabs = tabsFor(b);
      var tabBar = tabs.map(function (t) {
        return '<button type="button" class="acct-bk__tab' + (s.tab === t.id ? ' is-active' : '') + '" data-tab="' + t.id + '" data-bk="' + b.id + '">' + t.label + '</button>';
      }).join('');
      var panel = s.tab === 'addons' ? addonsTab(b)
                : s.tab === 'goodtogo' ? goodToGoTab(b)
                : s.tab === 'feedback' ? feedbackTab()
                : overviewTab(b);
      return '<article class="acct-bk">'
        + '<div class="acct-bk__top">'
        + '<div class="acct-bk__media"><img src="' + b.image + '" alt="" loading="lazy" />'
        + '<div class="acct-bk__date"><p>' + b.departsFmt.replace(/^[A-Za-z]{3},\s*/, '') + '</p>' + badge + '</div></div>'
        + '<div class="acct-bk__body">'
        + '<p class="acct-bk__dur">' + b.duration + '</p>'
        + '<h2 class="acct-bk__title">' + b.title + '</h2>'
        + '<p class="acct-bk__route">' + b.start + ' → ' + b.end + '</p>'
        + '<p class="acct-bk__ref">' + b.ref + '</p>'
        + '<p class="acct-bk__price">' + money(b.price) + '</p>'
        + '<button type="button" class="acct-bk__manage" data-manage="' + b.id + '">' + (s.open ? 'Close' : 'Manage booking') + '</button>'
        + '</div></div>'
        + (s.open ? '<div class="acct-bk__tabs">' + tabBar + '</div><div class="acct-bk__panel">' + panel + '</div>' : '')
        + '</article>';
    }

    function render() {
      var wrap = document.querySelector('[data-bookings]');
      if (wrap) wrap.innerHTML = BOOKINGS.map(bookingCard).join('');
    }

    BOOKINGS.forEach(function (b) { state[b.id] = { open: false, tab: 'overview', addons: {}, info: null }; });
    render();

    /* ----------------------------------------------------------- events -- */
    document.addEventListener('click', function (e) {
      var t = e.target;

      var manage = t.closest('[data-manage]');
      if (manage) { var b = state[manage.dataset.manage]; b.open = !b.open; render(); return; }

      var tab = t.closest('[data-tab]');
      if (tab) { state[tab.dataset.bk].tab = tab.dataset.tab; render(); return; }

      var info = t.closest('[data-info]');
      if (info) {
        var si = state[info.dataset.bk];
        si.info = si.info === info.dataset.info ? null : info.dataset.info;
        render();
        return;
      }

      var add = t.closest('[data-addon-toggle]');
      if (add) {
        var sa = state[add.dataset.bk], id = add.dataset.addonToggle;
        var addon = ADDONS.filter(function (a) { return a.id === id; })[0];
        var bk = BOOKINGS.filter(function (x) { return x.id === add.dataset.bk; })[0];
        if (sa.addons[id]) delete sa.addons[id];
        else sa.addons[id] = addon.hotel ? defaultRooming(bk.travellers) : true;
        render();
        return;
      }

      var step = t.closest('[data-step]');
      if (step) {
        var ss = state[step.dataset.bk];
        var bk2 = BOOKINGS.filter(function (x) { return x.id === step.dataset.bk; })[0];
        var r = ss.addons[step.dataset.addon];
        if (r && typeof r === 'object') {
          var key = step.dataset.step, dir = +step.dataset.dir;
          if (key === 'nights') r.nights = Math.max(1, Math.min(14, r.nights + dir));
          else {
            /* never place more travellers in beds than are on the booking */
            var ty = roomType(key);
            if (ty && (dir < 0 ? r[key] > 0 : placed(r) + ty.sleeps <= bk2.travellers)) r[key] += dir;
          }
          ss.addons[step.dataset.addon] = clampRooming(r, bk2.travellers);
          render();
        }
        return;
      }

      /* click anywhere else closes an open (i) */
      var changed = false;
      Object.keys(state).forEach(function (k) { if (state[k].info) { state[k].info = null; changed = true; } });
      if (changed) render();
    });
  })();
  </script>
