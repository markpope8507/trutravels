import re, os

BASE = "/Users/markpope/Claude Test/trutravels/converted"
COMP = os.path.join(BASE, "components")

def read(fn): return open(os.path.join(BASE, fn), encoding="utf-8").read()
def block(fn, a, b): return "\n".join(read(fn).split("\n")[a-1:b])

# --- extract first 3 tripcards from the homepage trip carousel ---
idx = read("index.html")
cards = re.findall(r'<article class="tripcard">.*?</article>', idx, re.S)[:3]
TRIPCARDS = "\n        ".join(cards)
# this file lives in components/, so fix root-relative asset + page paths
TRIPCARDS = TRIPCARDS.replace('"assets/', '"../assets/').replace('href="thailand-island-hopper.html"', 'href="../thailand-island-hopper.html"')

# --- carousel scripts (arrows + exp-disclosure + drag-to-scroll) from explore.html ---
CAROUSEL_JS = block("explore.html", 594, 677)

HEAD = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>__TITLE__ (component) — TruTravels</title>
  <meta name="description" content="__DESC__" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Montserrat:wght@300;400;500;600;700;800;900&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <!-- Note the ../ — this component lives in components/, styles.css is one level up -->
  <link rel="stylesheet" href="../styles.css" />
</head>
<body>
'''

def demo_label(text):
    return ('  <div style="padding:2.5rem 1.5rem 0;max-width:80rem;margin:0 auto;">'
            '<p style="color:#9ca3af;font-family:\'Montserrat\',sans-serif;text-transform:uppercase;letter-spacing:0.2em;font-size:0.72rem;margin:0;">'
            + text + '</p></div>\n')

# ============================ 1. TRIP CAROUSEL ============================
trip = (HEAD.replace("__TITLE__", "Trip carousel").replace("__DESC__", "Reusable horizontally-scrollable carousel of trip cards.")
  + demo_label("Trip carousel component &mdash; demo (drag to scroll · arrows · expandable experience types)")
  + '''
  <!-- ===================================================================
       TRIP CAROUSEL COMPONENT — copy this block + the <script> below into
       any page. Requires styles.css (.rev-carousel, .carousel--related,
       .tripcard*, .rev-arrow). Add/remove <article class="tripcard"> items.
       =================================================================== -->
  <section style="padding:2rem 0 4rem;">
    <div class="container">
      <div class="rev-carousel" data-arrows>
        <div class="carousel carousel--related">
        ''' + TRIPCARDS + '''
        </div>
        <button class="rev-arrow rev-arrow--prev" data-rev="prev" aria-label="Previous"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg></button>
        <button class="rev-arrow rev-arrow--next" data-rev="next" aria-label="Next"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></button>
      </div>
    </div>
  </section>

  <!-- Carousel behaviour: arrow nav + experience-type disclosure + drag-to-scroll.
       These handlers are generic (they power every .rev-carousel / .carousel on the site). -->
''' + CAROUSEL_JS + '''
</body>
</html>
''')
open(os.path.join(COMP, "trip-carousel.html"), "w", encoding="utf-8").write(trip)

# ============================ 2. BLOG CARDS ============================
def story_card(image, cat, title, excerpt, author, date, mins, href="#", exclusive=False):
    lock = ('<div class="story-card__lock"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg><span>Members Only</span></div>') if exclusive else ''
    badge = '<span class="story-card__badge">Exclusive</span>' if exclusive else ''
    read = 'Join to read' if exclusive else 'Read story'
    return ('<a class="story-card' + (' story-card--locked' if exclusive else '') + '" href="' + href + '">'
      + '<div class="story-card__media"><img class="story-card__image" src="' + image + '" alt="' + title + '" />'
      + badge + lock + '<span class="story-card__time">' + str(mins) + ' min</span></div>'
      + '<div class="story-card__body"><p class="story-card__category">' + cat + '</p>'
      + '<h3 class="story-card__title">' + title + '</h3>'
      + '<p class="story-card__excerpt">' + excerpt + '</p>'
      + '<div class="story-card__foot"><p class="story-card__meta"><strong>' + author + '</strong> &middot; ' + date + '</p>'
      + '<span class="story-card__read">' + read + ' &rarr;</span></div></div></a>')

CARDS = (
  story_card("https://cdn.trutravels.com/jordan-tours/jordan-uncovered-desert-petra-walking-tour.jpg", "Destination Guides", "Top UNESCO World Heritage Sites You Need to Visit", "From the Great Barrier Reef to the Treasury at Petra &mdash; 10 of the most jaw-dropping sites on the planet.", "Sophie", "13 Jun 2026", 4, "../story-top-unesco-world-heritage-sites.html")
  + story_card("https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80", "Travel Stories", "How Solo Travel Changed My Life", "I booked a one-way ticket with no plan. Here's what two years on the road taught me about myself.", "Priya Kapoor", "2 Jun 2026", 6, "#")
  + story_card("https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80", "Member Exclusive", "The Secret Vietnam Itinerary", "Our members-only route through the north &mdash; the villages, the food stops, and the hidden bays.", "TruTravels Team", "28 May 2026", 8, "../signup.html", exclusive=True)
)
blog_cards = (HEAD.replace("__TITLE__", "Blog cards").replace("__DESC__", "Reusable story / blog card (with an optional members-only variant).")
  + demo_label("Blog card component &mdash; demo (standard &middot; standard &middot; members-only)")
  + '''
  <!-- ===================================================================
       BLOG CARD COMPONENT — copy any <a class="story-card"> block into a
       grid. Requires styles.css (.story-card*). For a members-only card add
       class "story-card--locked", the __badge and __lock, and point the href
       at your sign-up page. Omit __time to hide the read-time pill.
       =================================================================== -->
  <section style="padding:2rem 0 4rem;">
    <div class="container">
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(19rem,1fr));gap:2rem;">
        ''' + CARDS + '''
      </div>
    </div>
  </section>
</body>
</html>
''')
open(os.path.join(COMP, "blog-card.html"), "w", encoding="utf-8").write(blog_cards)

# ============================ 3. BLOG IMAGE SLIDER ============================
SLIDES = [
  ("https://cdn.trutravels.com/images/thailandbottlebeach.jpeg", "Bottle Beach"),
  ("https://cdn.trutravels.com/thailand/girls-koh-nang-yuan.jpg", "Koh Nang Yuan viewpoint"),
  ("https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=80", "Phi Phi Islands"),
  ("https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&q=80", "Longtail boats"),
]
slide_html = "".join('<div class="art-slider__slide"><img src="%s" alt="%s" /></div>' % s for s in SLIDES)
STACK = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16V6a2 2 0 012-2h10M8 8h10a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2z"/></svg>'
slider = (HEAD.replace("__TITLE__", "Blog image slider").replace("__DESC__", "Swipeable image gallery that lives inside a blog image box.")
  + demo_label("Blog image slider &mdash; demo (arrows &middot; dots &middot; counter; box size unchanged)")
  + '''
  <!-- ===================================================================
       BLOG IMAGE SLIDER — drop-in replacement for a single blog image.
       Keep the outer .art-section__media wrapper (that's the fixed image
       box); put .art-slider inside it and list one .art-slider__slide per
       image. Requires styles.css (.art-slider*) + the <script> below.
       =================================================================== -->
  <section style="padding:2rem 0 4rem;">
    <div class="container" style="max-width:42rem;">
      <div class="art-section__media">
        <div class="art-slider" data-slider>
          <div class="art-slider__track" data-track>''' + slide_html + '''</div>
          <span class="art-slider__badge">''' + STACK + ''' <span data-count>1 / ''' + str(len(SLIDES)) + '''</span></span>
          <button class="art-slider__arrow art-slider__arrow--prev" type="button" data-slide="prev" aria-label="Previous image"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg></button>
          <button class="art-slider__arrow art-slider__arrow--next" type="button" data-slide="next" aria-label="Next image"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></button>
          <div class="art-slider__dots" data-dots></div>
        </div>
      </div>
    </div>
  </section>

  <script>/* blog image slider */
  document.querySelectorAll('[data-slider]').forEach(function (sl) {
    var track = sl.querySelector('[data-track]');
    var n = track.children.length, idx = 0;
    var dots = sl.querySelector('[data-dots]'), countEl = sl.querySelector('[data-count]');
    for (var d = 0; d < n; d++) { var b = document.createElement('button'); b.type = 'button'; b.className = 'art-slider__dot'; b.setAttribute('data-dot', d); dots.appendChild(b); }
    function go(k) {
      idx = (k + n) % n;
      track.style.transform = 'translateX(-' + (idx * 100) + '%)';
      for (var i = 0; i < dots.children.length; i++) dots.children[i].classList.toggle('is-on', i === idx);
      if (countEl) countEl.textContent = (idx + 1) + ' / ' + n;
    }
    sl.querySelector('[data-slide="prev"]').addEventListener('click', function () { go(idx - 1); });
    sl.querySelector('[data-slide="next"]').addEventListener('click', function () { go(idx + 1); });
    dots.addEventListener('click', function (e) { var t = e.target.closest('[data-dot]'); if (t) go(+t.getAttribute('data-dot')); });
    go(0);
  });
  </script>
</body>
</html>
''')
open(os.path.join(COMP, "blog-image-slider.html"), "w", encoding="utf-8").write(slider)

# ============================ 4. BLOG VIDEO INSERT ============================
PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
video = (HEAD.replace("__TITLE__", "Blog video insert").replace("__DESC__", "Click-to-play inline video that lives inside a blog image box.")
  + demo_label("Blog video insert &mdash; demo (poster + play button; native controls on play; box size unchanged)")
  + '''
  <!-- ===================================================================
       BLOG VIDEO INSERT — drop-in replacement for a single blog image.
       Keep the outer .art-section__media box; add class "art-video" + the
       data-video hook. Set the <video poster> and <source src>. Requires
       styles.css (.art-video*) + the <script> below.
       =================================================================== -->
  <section style="padding:2rem 0 4rem;">
    <div class="container" style="max-width:42rem;">
      <div class="art-section__media art-video" data-video>
        <video class="art-video__el" preload="metadata" playsinline poster="https://cdn.trutravels.com/blog/khao-sok-southern-thailand-blog.jpg"><source src="https://videos.pexels.com/video-files/1093661/1093661-uhd_2560_1440_30fps.mp4" type="video/mp4" /></video>
        <button class="art-video__play" type="button" data-video-play aria-label="Play video"><span>''' + PLAY + '''</span></button>
        <span class="art-video__badge">Video</span>
      </div>
    </div>
  </section>

  <script>/* blog video insert */
  document.querySelectorAll('[data-video]').forEach(function (v) {
    var el = v.querySelector('video'), play = v.querySelector('[data-video-play]');
    if (play) play.addEventListener('click', function () { el.controls = true; el.play(); v.classList.add('is-playing'); });
  });
  </script>
</body>
</html>
''')
open(os.path.join(COMP, "blog-video.html"), "w", encoding="utf-8").write(video)

# ============================ 5. FOMO TOAST ============================
tih = read("thailand-island-hopper.html")
mm = re.search(r'<div class="fomo" data-fomo[\s\S]*?/\* FOMO social-proof toast[\s\S]*?</script>', tih)
FOMO_BLOCK = mm.group(0) if mm else ''
fomo = (HEAD.replace("__TITLE__", "FOMO toast").replace("__DESC__", "Rotating social-proof / FOMO toast for trip pages.")
  + demo_label("FOMO toast &mdash; demo (slides in bottom-left after ~3.5s, rotates, dismissible; aggregate counts only &mdash; no names, GDPR-safe)")
  + '''
  <div style="min-height:120vh;padding:1.5rem;max-width:46rem;margin:0 auto;color:#9ca3af;line-height:1.7;">
    <p>Wait a few seconds &mdash; the toast slides in at the bottom-left and rotates through: live viewers, <strong>added to basket</strong> (uses the nav basket icon), spots-left, and saves. Every message uses <strong>aggregate counts only</strong> (no customer names, GDPR-safe). Dismiss with the &times; (stays hidden for the rest of the browser session).</p>
  </div>

  <!-- ===================================================================
       FOMO TOAST COMPONENT — copy this block + its <script> into a trip /
       tour page. Requires styles.css (.fomo*). Fixed bottom-left; the script
       rotates the messages and remembers dismissal for the session. Edit the
       build() list to change the messages (keep them aggregate — no names).
       =================================================================== -->
''' + FOMO_BLOCK + '''
</body>
</html>
''')
open(os.path.join(COMP, "fomo-toast.html"), "w", encoding="utf-8").write(fomo)

print("wrote: trip-carousel.html, blog-card.html, blog-image-slider.html, blog-video.html, fomo-toast.html")
print("tripcards embedded:", len(cards), "| fomo block chars:", len(FOMO_BLOCK))
