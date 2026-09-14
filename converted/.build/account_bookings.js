  <script>/* Bookings — mirrors src/components/booking-history.tsx.
     Same five bookings, the same card (image + progress timeline + actions),
     the same four tabs (Overview / Good to Go / Add-Ons / Feedback), the
     cancelled booking's refund panel, and the video-review modal.
     Add-on prices and rooming rules mirror src/lib/addons.ts. */
  (function () {
    var money = function (n) { return '£' + Math.round(n).toLocaleString('en-GB'); };

    /* Departure dates are stored as offsets from today so the demo never goes
       stale — resolve them once up front into the fields the renderers use.
       A booking may instead pin literal dates with departsOn/endsOn. */
    (function () {
      function at(offset) { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + offset); return d; }
      function longFmt(d) { return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }); }
      function shortFmt(d) { return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
      /* local-date ISO — toISOString() would shift a BST midnight back a day */
      function iso(d) {
        return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
      }
      BOOKINGS.forEach(function (b) {
        var dep = b.departsOn ? new Date(b.departsOn) : at(b.departsIn);
        var end = b.endsOn ? new Date(b.endsOn) : at(b.departsIn + b.lasts);
        b.departs = iso(dep);
        b.departsFmt = longFmt(dep);
        b.departsShort = shortFmt(dep);
        b.endsShort = shortFmt(end);
        b.bookedFmt = b.cancellation ? b.cancellation.dateBooked : shortFmt(at(b.bookedIn || -60));
        b.balanceDueDays = b.balanceDueIn || 0;
      });
    })();

    /* state per booking: panel open, active tab, add-on selections, (i)
       popover, and whether the Good to Go form is in edit mode. */
    var state = {};
    var videoFor = null;      /* booking id the review modal is open for */
    var videoDone = false;

    /* ------------------------------------------------------------- icons -- */
    function svg(path, w) {
      return '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="' + (w || 2) + '" stroke-linecap="round" stroke-linejoin="round">' + path + '</svg>';
    }
    var ICON = {
      tick: svg('<path d="M5 13l4 4L19 7"/>', 3),
      plus: svg('<path d="M12 4v16m8-8H4"/>'),
      pin: svg('<path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>'),
      chevron: svg('<path d="M19 9l-7 7-7-7"/>'),
      arrow: svg('<path d="M9 5l7 7-7 7"/>'),
      close: svg('<path d="M6 18L18 6M6 6l12 12"/>'),
      cal: svg('<path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>'),
      coin: svg('<path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'),
      tag: svg('<path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>'),
      hotel: svg('<path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>', 1.5),
      van: svg('<path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H6.375m11.25 0h3.375c.621 0 1.125-.504 1.125-1.125v-3.026a3 3 0 00-.879-2.121l-3.496-3.496A3 3 0 0014.25 8.25H6.375c-.621 0-1.125.504-1.125 1.125v8.25c0 .621.504 1.125 1.125 1.125z"/>', 1.5),
      star: svg('<path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>'),
      clip: svg('<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>'),
      video: svg('<path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>'),
      upload: svg('<path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>'),
      pencil: svg('<path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>')
    };

    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

    /* ------------------------------------------------------ add-on model -- */
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
    function gtgCount(b) {
      if (!b.goodToGo) return null;
      var keys = Object.keys(b.goodToGo);
      return { done: keys.filter(function (k) { return b.goodToGo[k]; }).length, total: keys.length };
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

    /* ---------------------------------------------------------- timeline -- */
    /* Confirmed -> Paid in Full -> Good to Go, on every upcoming booking. */
    function timeline(b) {
      var g = gtgCount(b);
      var steps = [
        { label: 'Confirmed', done: true },
        { label: 'Paid in Full', done: b.balance === 0 },
        { label: 'Good to Go', done: !!g && g.done === g.total }
      ];
      return '<div class="acct-tl">' + steps.map(function (s, i) {
        return '<div class="acct-tl__step">'
          + (i > 0 ? '<span class="acct-tl__line' + (steps[i - 1].done && s.done ? ' is-done' : '') + '"></span>' : '')
          + '<span class="acct-tl__dot' + (s.done ? ' is-done' : '') + '">' + (s.done ? ICON.tick : (i + 1)) + '</span>'
          + '<span class="acct-tl__lbl' + (s.done ? ' is-done' : '') + '">' + s.label + '</span>'
          + '</div>';
      }).join('') + '</div>';
    }

    /* ------------------------------------------------------ overview tab -- */
    function kvCell(label, value, cls) {
      return '<div class="acct-ov__cell"><p class="acct-ov__k">' + label + '</p>'
        + '<p class="acct-ov__v' + (cls ? ' ' + cls : '') + '">' + value + '</p></div>';
    }

    function paymentHistory(b) {
      var seq = b.ref.split('-')[2] || '000';
      var rows = [];
      var running = b.price - b.deposit;
      var n = 2;
      rows.push({ date: b.bookedFmt, desc: 'Deposit (' + b.travellers + ' PAX)', amount: money(b.deposit), ref: 'PAY-' + seq + '-001', balance: running });
      if (b.extras && b.extras.prenight) {
        running -= 45;
        rows.push({ date: b.bookedFmt, desc: 'Pre-Night Hotel', amount: money(45), ref: 'PAY-' + seq + '-00' + n++, balance: running });
      }
      if (b.extras && b.extras.arrival) {
        running -= 60;
        rows.push({ date: b.bookedFmt, desc: 'Airport Transfer', amount: money(60), ref: 'PAY-' + seq + '-00' + n++, balance: running });
      }
      if (b.paid > b.deposit) {
        rows.push({ date: b.bookedFmt, desc: 'Final Balance', amount: money(running), ref: 'PAY-' + seq + '-00' + n++, balance: 0 });
      }
      return '<p class="acct-h">Payment History</p>'
        + '<div class="acct-tbl">'
        + '<div class="acct-tbl__head"><span>Date</span><span>Description</span><span>Amount</span><span>Reference</span><span class="is-right">Balance After</span></div>'
        + rows.map(function (r) {
            return '<div class="acct-tbl__row">'
              + '<div><span class="acct-tbl__m">Date</span><p>' + r.date + '</p></div>'
              + '<div><span class="acct-tbl__m">Description</span><p class="is-dim">' + r.desc + '</p></div>'
              + '<div><span class="acct-tbl__m">Amount</span><p class="is-green">' + r.amount + '</p></div>'
              + '<div><span class="acct-tbl__m">Reference</span><p class="is-dim">' + r.ref + '</p></div>'
              + '<div class="is-right"><span class="acct-tbl__m">Balance</span><p class="' + (r.balance > 0 ? 'is-pink' : 'is-green') + '">' + money(r.balance) + '</p></div>'
              + '</div>';
          }).join('')
        + '<div class="acct-tbl__row is-total">'
        + '<p class="is-bold">Total Paid</p><p class="acct-tbl__sp"></p>'
        + '<p class="is-green is-bold">' + money(b.paid) + '</p><p class="acct-tbl__sp"></p>'
        + '<p class="is-right is-bold ' + (b.balance > 0 ? 'is-pink' : 'is-green') + '">'
        + (b.balance > 0 ? money(b.balance) + ' remaining' : 'Paid in full ✓') + '</p>'
        + '</div></div>';
    }

    function overviewTab(b) {
      var upcoming = b.status === 'upcoming';
      var pax = b.passengers.map(function (name, i) {
        return '<div class="acct-ov__split">'
          + kvCell(b.travellers > 1 ? 'Passenger ' + (i + 1) : 'Passenger', name)
          + kvCell('Email', (b.emails && b.emails[i]) || 'pax' + (i + 1) + '@email.com')
          + '</div>';
      }).join('');

      var overview = '<div class="acct-ov">'
        + kvCell('Booking Ref', b.ref)
        + kvCell('Date Booked', b.bookedFmt)
        + kvCell('Tour', b.title + ' · ' + b.duration)
        + '<div class="acct-ov__split">'
        + '<div class="acct-ov__cell"><p class="acct-ov__k">Start</p><p class="acct-ov__v">' + b.departsShort + '</p><p class="acct-ov__s">' + b.start + '</p></div>'
        + '<div class="acct-ov__cell"><p class="acct-ov__k">End</p><p class="acct-ov__v">' + b.endsShort + '</p><p class="acct-ov__s">' + b.end + '</p></div>'
        + '</div>'
        + pax
        + '<div class="acct-ov__split is-3">'
        + kvCell('Total Price', money(b.price))
        + kvCell('Paid', money(b.paid), 'is-green')
        + kvCell('Balance', b.balance > 0 ? money(b.balance) : '£0 ✓', b.balance > 0 ? 'is-pink' : 'is-green')
        + '</div>'
        + (b.promo
            ? '<div class="acct-ov__promo">' + ICON.tag
              + '<p>' + b.promo.code + ' · -' + money(b.promo.discount) + ' off <s>' + money(b.promo.originalPrice) + '</s></p></div>'
            : '')
        + '</div>';

      var credit = (upcoming && b.balance > 0)
        ? '<div class="acct-credit"><span class="acct-credit__ico">' + ICON.coin + '</span>'
          + '<div class="acct-credit__txt"><p>You have £50 travel credit</p>'
          + '<small>Apply towards your remaining balance of ' + money(b.balance) + '</small></div>'
          + '<button type="button" class="acct-credit__btn">Apply Credit</button></div>'
        : '';

      var actions = upcoming
        ? '<div class="acct-acts">'
          + '<button type="button" class="acct-act"><span class="acct-act__ico is-blue">' + ICON.cal + '</span>'
          + '<span class="acct-act__txt"><strong>Request Date Change</strong><small>Move your trip to a different departure date</small></span>'
          + '<span class="acct-act__go">' + ICON.arrow + '</span></button>'
          + '<button type="button" class="acct-act is-danger"><span class="acct-act__ico is-red">' + ICON.close + '</span>'
          + '<span class="acct-act__txt"><strong>Request Cancellation</strong><small>Cancel your booking · ' + money(b.deposit) + ' non-refundable deposit applies</small></span>'
          + '<span class="acct-act__go">' + ICON.arrow + '</span></button>'
          + '</div>'
        : '';

      var extras = '';
      if (b.extras && (b.extras.prenight || b.extras.arrival)) {
        var items = '';
        if (b.extras.prenight) {
          items += '<div class="acct-ext"><span class="acct-ext__ico">' + ICON.hotel + '</span>'
            + '<div class="acct-ext__txt"><p class="acct-ext__n">Pre-Night Hotel</p>'
            + '<p class="acct-ext__d">TruTravels ' + b.start + ' Hotel · <strong>' + (b.travellers > 1 ? 'Twin Room' : 'Single Room') + '</strong> · ' + b.travellers + ' PAX</p>'
            + '<p class="acct-ext__m">Check-in ' + shiftDate(b.departs, -1) + '</p></div>'
            + '<div class="acct-ext__r"><p>' + money(45) + '</p><span>Booked</span></div></div>';
        }
        if (b.extras.arrival) {
          items += '<div class="acct-ext"><span class="acct-ext__ico">' + ICON.van + '</span>'
            + '<div class="acct-ext__txt"><p class="acct-ext__n">Airport Arrival Transfer</p>'
            + '<p class="acct-ext__d">Pick-up from ' + b.start + ' Airport to your pre-night hotel</p>'
            + '<p class="acct-ext__m">' + (b.flight ? 'Flight ' + b.flight.flightNo + ' · ' : '') + 'Arriving ' + b.departsShort + '</p></div>'
            + '<div class="acct-ext__r"><p>' + money(60) + '</p><span>Booked</span></div></div>';
        }
        extras = '<p class="acct-h">Booked Extras</p><div class="acct-exts">' + items + '</div>';
      }

      return overview + credit + actions + extras + paymentHistory(b);
    }

    /* ---------------------------------------------------- good to go tab -- */
    function gtgItems(b) {
      return [
        { key: 'flightDetails', label: 'Flight Details', detail: b.flight ? [b.flight.airline + ' · ' + b.flight.flightNo, 'Departs: ' + b.flight.departs, 'Arrives: ' + b.flight.arrives] : null },
        { key: 'travelInsurance', label: 'Travel Insurance', detail: b.insurance ? ['Provider: ' + b.insurance.provider, 'Plan: ' + b.insurance.type, 'Policy No: ' + b.insurance.policyNo] : null },
        { key: 'passportDetails', label: 'Passport Details', detail: null },
        { key: 'emergencyContact', label: 'Emergency Contact', detail: ['Sarah Traveller · +44 7700 900123 · Mother'] },
        { key: 'dietaryRequirements', label: 'Dietary Requirements', detail: ['No allergies · Vegetarian'] },
        { key: 'visaCheck', label: 'Visa &amp; Entry Requirements', detail: null }
      ];
    }

    function field(name, ph, val) {
      return '<input class="acct-fld" name="' + name + '" placeholder="' + esc(ph) + '" value="' + esc(val || '') + '" />';
    }

    function gtgEditForm(b) {
      var f = b.flight || {}, ins = b.insurance || {};
      return '<form class="acct-form" data-form="' + b.id + '">'
        + '<div class="acct-form__head"><p class="acct-h is-flush">Edit Good to Go</p>'
        + '<button type="button" class="acct-form__cancel" data-gtg-cancel="' + b.id + '">Cancel</button></div>'

        + '<fieldset class="acct-fs"><legend>Flight Details</legend>'
        + '<div class="acct-fs__2">' + field('flightAirline', 'Airline', f.airline) + field('flightNo', 'Flight No.', f.flightNo) + '</div>'
        + field('flightDeparts', 'Departs from (e.g. London Heathrow, Sat 11 Apr at 21:30)', f.departs)
        + field('flightArrives', 'Arrives at (e.g. Bangkok BKK, Sun 12 Apr at 15:30)', f.arrives)
        + '</fieldset>'

        + '<fieldset class="acct-fs"><legend>Travel Insurance</legend>'
        + '<div class="acct-fs__2">' + field('insProvider', 'Provider', ins.provider) + field('insType', 'Plan type', ins.type) + '</div>'
        + field('insPolicy', 'Policy number', ins.policyNo)
        + '</fieldset>'

        + '<fieldset class="acct-fs"><legend>Passport Details</legend>'
        + field('ppName', 'Full name (as on passport)', '')
        + '<div class="acct-fs__2">' + field('ppNo', 'Passport number', '') + field('ppExp', 'Expiry date', '') + '</div>'
        + '</fieldset>'

        + '<fieldset class="acct-fs"><legend>Emergency Contact</legend>'
        + field('emName', 'Full name', 'Sarah Traveller')
        + '<div class="acct-fs__2">' + field('emPhone', 'Phone number', '+44 7700 900123') + field('emRel', 'Relationship', 'Mother') + '</div>'
        + '</fieldset>'

        + '<fieldset class="acct-fs"><legend>Dietary Requirements</legend>'
        + field('diet', 'Allergies, dietary preferences etc.', 'No allergies · Vegetarian')
        + '</fieldset>'

        + '<fieldset class="acct-fs"><legend>Visa &amp; Entry Requirements</legend>'
        + '<p class="acct-fs__p">Check your visa requirements for this destination using the Sherpa travel tool below.</p>'
        + '<div class="acct-sherpa"><iframe src="https://apply.joinsherpa.com/travel-restrictions?affiliateId=trutravels&amp;language=en-US" title="Visa and entry requirements" loading="lazy"></iframe></div>'
        + '<p class="acct-fs__fine">Powered by Sherpa. This portal should be used for information purposes only and is not associated with TruTravels.</p>'
        + '</fieldset>'

        + '<div class="acct-form__foot">'
        + '<button type="button" class="acct-btn is-ghost" data-gtg-cancel="' + b.id + '">Cancel</button>'
        + '<button type="button" class="acct-btn is-green" data-gtg-save="' + b.id + '">Save All</button>'
        + '</div></form>';
    }

    function goodToGoTab(b) {
      if (state[b.id].editing) return gtgEditForm(b);
      var items = gtgItems(b);
      var done = items.filter(function (i) { return b.goodToGo[i.key]; }).length;
      var total = items.length;
      var pct = Math.round((done / total) * 100);
      return '<div class="acct-gtg__head">'
        + '<div class="acct-gtg__prog">'
        + '<span class="acct-gtg__pill' + (done === total ? ' is-done' : '') + '">' + done + '/' + total + ' complete</span>'
        + '<span class="acct-gtg__bar"><i style="width:' + pct + '%;background:' + (done === total ? '#6BD495' : '#FF3F99') + '"></i></span>'
        + '</div>'
        + '<button type="button" class="acct-gtg__edit" data-gtg-edit="' + b.id + '">' + ICON.pencil + 'Edit</button>'
        + '</div>'
        + '<div class="acct-gtg">' + items.map(function (i) {
            var ok = !!b.goodToGo[i.key];
            return '<div class="acct-gtg__row">'
              + '<span class="acct-gtg__box' + (ok ? ' is-done' : '') + '">' + (ok ? ICON.tick : ICON.plus) + '</span>'
              + '<div class="acct-gtg__txt"><p class="acct-gtg__n' + (ok ? ' is-done' : '') + '">' + i.label + '</p>'
              + (ok
                  ? (i.detail ? i.detail.map(function (l) { return '<p class="acct-gtg__d">' + l + '</p>'; }).join('') : '')
                  : '<p class="acct-gtg__inc">Incomplete</p>')
              + '</div></div>';
          }).join('') + '</div>';
    }

    /* ------------------------------------------------------ feedback tab -- */
    function feedbackTab(b) {
      var out = '';
      if (!b.feedbackCompleted) {
        out += '<div class="acct-fb is-blue">' + ICON.clip
          + '<p class="acct-fb__h">Feedback form incomplete</p>'
          + '<p class="acct-fb__s">Help us improve by sharing your experience</p>'
          + '<button type="button" class="acct-btn is-pink">Complete Feedback</button></div>';
      }
      if (!b.reviewLeft) {
        out += '<div class="acct-fb is-green">' + ICON.star
          + '<p class="acct-fb__h">Leave a review</p>'
          + '<p class="acct-fb__s">Loved your trip? Help others decide</p>'
          + '<button type="button" class="acct-btn is-green">Write a Review</button></div>';
      }
      return out || '<p class="acct-note">All done &mdash; thanks for the feedback.</p>';
    }

    /* --------------------------------------------------- cancelled panel -- */
    function cancelledPanel(b) {
      var c = b.cancellation;
      var afterDeposit = b.price - c.nonRefundableDeposit;
      var rows = [
        { date: c.dateBooked, desc: 'Deposit payment', ref: '2504891', amount: money(c.nonRefundableDeposit), cls: 'is-green', balance: money(afterDeposit) },
        { date: '20 Jan 2026', desc: 'Balance payment', ref: '2511247', amount: money(afterDeposit), cls: 'is-green', balance: '£0' },
        { date: c.dateCancelled, desc: 'Booking cancelled', ref: '2538102', amount: '—', cls: 'is-red', balance: '£0', row: 'is-red' },
        { date: c.refundDate, desc: 'Refund processed', ref: '2542679', amount: '+' + money(c.refundAmount), cls: 'is-green', balance: '£0', row: 'is-green' }
      ];
      return '<div class="acct-canc__banner"><span class="acct-canc__ico">' + ICON.close + '</span>'
        + '<div><p>Booking Cancelled</p><small>This booking has been cancelled and a refund has been processed minus the non-refundable deposit.</small></div></div>'

        + '<div class="acct-canc__grid">'
        + '<div class="acct-canc__box"><p class="acct-ov__k">Date Booked</p><p class="acct-ov__v">' + c.dateBooked + '</p></div>'
        + '<div class="acct-canc__box"><p class="acct-ov__k">Date Cancelled</p><p class="acct-ov__v is-red">' + c.dateCancelled + '</p></div>'
        + '<div class="acct-canc__box is-wide"><p class="acct-ov__k">Reason</p><p class="acct-ov__v">' + c.reason + '</p></div>'
        + '</div>'

        + '<div class="acct-refund">'
        + '<p class="acct-refund__h">Refund Summary</p>'
        + '<div class="acct-refund__r"><span>Total Paid</span><span>' + money(b.paid) + '</span></div>'
        + '<div class="acct-refund__r"><span>Non-refundable Deposit</span><span class="is-red">-' + money(c.nonRefundableDeposit) + '</span></div>'
        + '<div class="acct-refund__r is-hl"><span class="is-bold">Refund Amount</span><span class="is-green is-bold">' + money(c.refundAmount) + '</span></div>'
        + '<div class="acct-refund__r is-foot"><span>Refund Status</span><span class="is-green"><i class="acct-dot"></i>' + c.refundStatus + ' · ' + c.refundDate + '</span></div>'
        + '</div>'

        + '<p class="acct-h">Payment History</p>'
        + '<div class="acct-tbl">'
        + '<div class="acct-tbl__head"><span>Date</span><span>Description</span><span>Reference</span><span>Amount</span><span class="is-right">Balance</span></div>'
        + rows.map(function (r) {
            return '<div class="acct-tbl__row ' + (r.row || '') + '">'
              + '<div><span class="acct-tbl__m">Date</span><p>' + r.date + '</p></div>'
              + '<div><span class="acct-tbl__m">Description</span><p class="' + (r.row === 'is-red' ? 'is-red' : 'is-dim') + '">' + r.desc + '</p></div>'
              + '<div><span class="acct-tbl__m">Reference</span><p class="is-dim">' + r.ref + '</p></div>'
              + '<div><span class="acct-tbl__m">Amount</span><p class="' + r.cls + '">' + r.amount + '</p></div>'
              + '<div class="is-right"><span class="acct-tbl__m">Balance</span><p class="is-dim">' + r.balance + '</p></div>'
              + '</div>';
          }).join('')
        + '<div class="acct-tbl__row is-total">'
        + '<p class="is-bold">Net Result</p>'
        + '<p class="is-dim">Non-refundable deposit</p>'
        + '<p class="is-red is-bold">-' + money(c.nonRefundableDeposit) + '</p>'
        + '<p class="acct-tbl__sp"></p>'
        + '<p class="is-green is-bold is-right">' + money(c.refundAmount) + ' refunded</p>'
        + '</div></div>';
    }

    /* ------------------------------------------------------------- card -- */
    function tabsFor(b) {
      var t = [{ id: 'overview', label: 'Overview' }];
      if (b.status === 'upcoming') {
        if (b.goodToGo) t.push({ id: 'goodtogo', label: 'Good to Go', gtg: true });
        t.push({ id: 'addons', label: 'Add-Ons' });
      }
      if (b.status === 'completed') t.push({ id: 'feedback', label: 'Feedback' });
      return t;
    }

    function bookingCard(b) {
      var s = state[b.id];
      var upcoming = b.status === 'upcoming';
      var days = daysToGo(b.departs);
      var g = gtgCount(b);

      var tabBar = tabsFor(b).map(function (t) {
        var badge = '';
        if (t.gtg && g) badge = g.done < g.total
          ? '<span class="acct-bk__count">' + g.done + '/' + g.total + '</span>'
          : '<span class="acct-bk__ok">✓</span>';
        return '<button type="button" class="acct-bk__tab' + (s.tab === t.id ? ' is-active' : '') + '" data-tab="' + t.id + '" data-bk="' + b.id + '">' + t.label + badge + '</button>';
      }).join('');

      var panel = s.tab === 'addons' ? addonsTab(b)
                : s.tab === 'goodtogo' ? goodToGoTab(b)
                : s.tab === 'feedback' ? feedbackTab(b)
                : overviewTab(b);

      /* completed trips get status pills where an upcoming one has a timeline */
      var pills = '';
      if (b.status === 'completed') {
        if (!b.feedbackCompleted) pills += '<span class="acct-pill is-pink">' + ICON.clip + 'Feedback needed</span>';
        if (!b.reviewLeft) pills += '<span class="acct-pill is-green">' + ICON.star + 'Leave an online review</span>';
        if (pills) pills = '<div class="acct-pills">' + pills + '</div>';
      }

      var cancelled = b.status === 'cancelled';
      var manage = '<button type="button" class="acct-bk__manage' + (cancelled ? ' is-danger' : '') + '" data-manage="' + b.id + '">'
        + (s.open ? 'Close' : (cancelled ? 'View Details' : 'Manage Booking'))
        + '<span class="acct-bk__chev' + (s.open ? ' is-open' : '') + '">' + ICON.chevron + '</span></button>';

      var cta = '';
      if (upcoming && b.balance > 0) cta = '<button type="button" class="acct-btn is-pink">Make a Payment</button>';
      if (b.status === 'completed') cta = '<button type="button" class="acct-btn is-grad" data-video="' + b.id + '">' + ICON.video + 'Leave a Video Review</button>';

      return '<article class="acct-bk' + (cancelled ? ' is-cancelled' : '') + '">'
        + '<div class="acct-bk__top">'
        + '<div class="acct-bk__media"><img src="' + b.image + '" alt="' + esc(b.title) + '" loading="lazy" />'
        + '<span class="acct-bk__scrim"></span>'
        + (cancelled ? '<span class="acct-bk__flag">Cancelled</span>' : '')
        + '<div class="acct-bk__date"><p>' + b.departsShort + '</p>'
        + (upcoming ? '<span class="acct-bk__days">' + (days > 0 ? days + ' days to go' : 'Departing today') + '</span>' : '')
        + '</div></div>'

        + '<div class="acct-bk__body">'
        + '<div class="acct-bk__head">'
        + '<div class="acct-bk__id">'
        + '<p class="acct-bk__dur">' + b.duration + '</p>'
        + '<h2 class="acct-bk__title">' + b.title + '</h2>'
        + '<p class="acct-bk__route">' + ICON.pin + b.start + ' &rarr; ' + b.end + '</p>'
        + '<p class="acct-bk__ref">' + b.ref + '</p>'
        + '</div>'
        + '<div class="acct-bk__money"><p class="acct-bk__price">' + money(b.price) + '</p>'
        + (b.balance > 0 ? '<p class="acct-bk__due">' + money(b.balance) + ' due in ' + b.balanceDueDays + ' days</p>' : '')
        + '</div></div>'

        + (upcoming ? timeline(b) : '')
        + pills
        + '<div class="acct-bk__foot">' + manage + cta + '</div>'
        + '</div></div>'

        + (s.open
            ? (cancelled
                ? '<div class="acct-bk__panel is-canc">' + cancelledPanel(b) + '</div>'
                : '<div class="acct-bk__tabs">' + tabBar + '</div><div class="acct-bk__panel">' + panel + '</div>')
            : '')
        + '</article>';
    }

    /* ------------------------------------------------------ video modal -- */
    function videoModal() {
      if (!videoFor) return '';
      var b = BOOKINGS.filter(function (x) { return x.id === videoFor; })[0];
      var tips = [['🎯', 'Keep it short — 10-20 seconds is perfect'],
                  ['😊', 'Be yourself — authentic beats polished'],
                  ['🌟', 'Share a highlight or favourite moment'],
                  ['💡', 'Film vertically for best results']];
      var body = videoDone
        ? '<div class="acct-vid__done"><span class="acct-vid__tick">' + ICON.tick + '</span>'
          + '<p class="acct-vid__h2">Video Submitted!</p>'
          + '<p class="acct-vid__p">Thanks for sharing your experience. Your review will appear on the ' + b.title + ' page once approved.</p>'
          + '<button type="button" class="acct-btn is-ghost is-full" data-video-close>Done</button></div>'
        : '<p class="acct-vid__p">Record a <strong>10-20 second video</strong> sharing your favourite moment, what surprised you, or why someone should book this trip. Your review will inspire future travellers on the trip page!</p>'
          + '<div class="acct-vid__tips"><p class="acct-vid__tipsh">Tips for a great review</p>'
          + tips.map(function (t) { return '<p class="acct-vid__tip"><span>' + t[0] + '</span>' + t[1] + '</p>'; }).join('')
          + '</div>'
          + '<label class="acct-btn is-grad is-full">' + ICON.upload + 'Upload Video'
          + '<input type="file" accept="video/*" hidden data-video-file /></label>';

      return '<div class="acct-vid" data-video-backdrop>'
        + '<div class="acct-vid__box" role="dialog" aria-modal="true" aria-label="Leave a video review">'
        + '<div class="acct-vid__top">'
        + '<button type="button" class="acct-vid__x" data-video-close aria-label="Close">' + ICON.close + '</button>'
        + '<span class="acct-vid__badge">' + ICON.video + '</span>'
        + '<h3>Share Your Experience</h3><p>' + b.title + '</p></div>'
        + '<div class="acct-vid__body">' + body + '</div>'
        + '</div></div>';
    }

    /* ------------------------------------------------------------ render -- */
    function render() {
      var wrap = document.querySelector('[data-bookings]');
      if (wrap) wrap.innerHTML = BOOKINGS.map(bookingCard).join('');
      var modal = document.querySelector('[data-video-root]');
      if (modal) modal.innerHTML = videoModal();
      document.body.style.overflow = videoFor ? 'hidden' : '';
    }

    BOOKINGS.forEach(function (b) { state[b.id] = { open: false, tab: 'overview', addons: {}, info: null, editing: false }; });
    render();

    /* ----------------------------------------------------------- events -- */
    document.addEventListener('click', function (e) {
      var t = e.target;

      var vopen = t.closest('[data-video]');
      if (vopen) { videoFor = vopen.dataset.video; videoDone = false; render(); return; }
      if (t.closest('[data-video-close]') || (t.matches && t.matches('[data-video-backdrop]'))) { videoFor = null; render(); return; }

      var manage = t.closest('[data-manage]');
      if (manage) {
        var mb = state[manage.dataset.manage];
        mb.open = !mb.open;
        if (mb.open) { mb.tab = 'overview'; mb.editing = false; }
        render();
        return;
      }

      var tab = t.closest('[data-tab]');
      if (tab) { state[tab.dataset.bk].tab = tab.dataset.tab; state[tab.dataset.bk].editing = false; render(); return; }

      var gEdit = t.closest('[data-gtg-edit]');
      if (gEdit) { state[gEdit.dataset.gtgEdit].editing = true; render(); return; }

      var gCancel = t.closest('[data-gtg-cancel]');
      if (gCancel) { state[gCancel.dataset.gtgCancel].editing = false; render(); return; }

      var gSave = t.closest('[data-gtg-save]');
      if (gSave) { state[gSave.dataset.gtgSave].editing = false; render(); return; }

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

      /* click anywhere else closes an open (i) — but never re-render while a
         Good to Go form is being filled in, or typed values would be lost */
      var editingOpen = Object.keys(state).some(function (k) { return state[k].editing; });
      var changed = false;
      Object.keys(state).forEach(function (k) { if (state[k].info) { state[k].info = null; changed = true; } });
      if (changed && !editingOpen) render();
    });

    /* a chosen file stands in for a recorded review */
    document.addEventListener('change', function (e) {
      if (e.target.matches('[data-video-file]')) { videoDone = true; render(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && videoFor) { videoFor = null; render(); }
    });
  })();
  </script>
