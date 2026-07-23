// AUTO-GENERATED from converted/checkout.html — do not edit by hand.
/* eslint-disable */
export const CHECKOUT_HTML = `<!-- Background watermark icons (like the site) -->
  <div class="co-bg" aria-hidden="true">
    <img class="nav-bg" src="/checkout-assets/bg/sun.svg" alt="" style="top:8%;right:6%;width:140px;transform:rotate(-8deg);opacity:.05">
    <img class="nav-bg" src="/checkout-assets/bg/bali-flower.svg" alt="" style="top:27%;left:4%;width:130px;transform:rotate(10deg);opacity:.05">
    <img class="nav-bg" src="/checkout-assets/bg/peru-bird.svg" alt="" style="top:52%;right:9%;width:120px;transform:rotate(-12deg);opacity:.045">
    <img class="nav-bg" src="/checkout-assets/bg/good-vibes.svg" alt="" style="bottom:9%;left:7%;width:150px;transform:rotate(8deg);opacity:.045">
    <img class="nav-bg" src="/checkout-assets/bg/lantern.svg" alt="" style="top:68%;left:44%;width:110px;transform:rotate(6deg);opacity:.04">
    <img class="nav-bg" src="/checkout-assets/bg/mask.svg" alt="" style="bottom:18%;right:28%;width:140px;transform:rotate(10deg);opacity:.04">
    <img class="nav-bg" src="/checkout-assets/bg/komodo-dragon.svg" alt="" style="top:40%;left:58%;width:150px;transform:rotate(-6deg);opacity:.04">
    <img class="nav-bg" src="/checkout-assets/bg/tru-logo.svg" alt="" style="top:14%;left:38%;width:100px;transform:rotate(-10deg);opacity:.05">
  </div>

  <!-- ============ SECURE HEADER ============ -->
  <header class="co-header">
    <div class="co-header__inner">
      <a class="co-header__logo" href="index.html" aria-label="TruTravels home">
        <img src="/checkout-assets/logo-white.png" alt="TruTravels" />
      </a>
      <nav class="co-progress" aria-label="Checkout progress">
      <ol class="co-progress__list" data-progress>
        <li class="co-pstep is-active" data-pstep="1"><span class="co-pstep__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM5 21a7 7 0 0114 0"/></svg></span><span class="co-pstep__label">Travellers</span></li>
        <li class="co-pstep" data-pstep="2"><span class="co-pstep__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="7" width="16" height="13" rx="2"/><path stroke-linecap="round" d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"/></svg></span><span class="co-pstep__label">Add-ons</span></li>
        <li class="co-pstep" data-pstep="3"><span class="co-pstep__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path stroke-linecap="round" d="M2 10h20"/></svg></span><span class="co-pstep__label">Payment</span></li>
        <li class="co-pstep" data-pstep="4"><span class="co-pstep__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M8.5 12.5l2.5 2.5 4.5-5"/></svg></span><span class="co-pstep__label">Confirmed</span></li>
      </ol>
      </nav>
      <div class="co-header__right">
        <button class="co-header__login" data-login-open data-login><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM5 21a7 7 0 0114 0"/></svg><span data-login-label>Log in</span></button>
        <div class="co-header__secure"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="10" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 018 0v4"/></svg><span>Secure checkout</span></div>
      </div>
    </div>
  </header>

  <main class="co-main">
    <div class="co-grid">

      <!-- ============ LEFT: FLOW ============ -->
      <div class="co-flow">

        <!-- Mobile order summary (collapsible) -->
        <div class="co-summary co-summary--mobile" data-order-mobile>
          <button class="co-summary__bar" data-order-toggle aria-expanded="false">
            <span class="co-summary__bar-l"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> Booking summary <svg class="co-summary__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></span>
            <span class="co-summary__bar-total" data-order-total>&pound;0</span>
          </button>
          <div class="co-summary__drop" data-order-drop hidden></div>
        </div>

        <!-- STEP 1 — TRAVELLER INFO -->
        <section class="co-card co-card--bare is-open" data-step="1">
          <h2 class="section-heading co-step-heading">Traveller <span style="color: var(--tru-pink);">Info</span></h2>
          <div class="co-card__body">
            <form data-details novalidate>
              <p class="co-sub">Tell us about everyone travelling &mdash; names must match each passport exactly. We&rsquo;ll send each traveller&rsquo;s confirmation and e-tickets to their email. No account needed; you can create one after you book.</p>
              <div class="co-pax co-pax--mobile" data-pax-box></div>
              <div class="co-travellers-list" data-travellers></div>
              <button type="button" class="co-btn co-btn--yellow" data-next="1">Continue to your trip &rarr;</button>
              <p class="co-autosave"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg> Your progress is saved automatically</p>
            </form>
            <datalist id="co-nationalities"></datalist>
          </div>
          <div class="co-card__done" data-done="1" hidden></div>
        </section>

        <!-- STEP 2 — YOUR TRIP (rooming + add-ons) -->
        <section class="co-card co-card--bare" data-step="2">
          <h2 class="section-heading co-step-heading">Customise Your <span style="color: var(--tru-pink);">Trip</span></h2>
          <div class="co-card__body">
            <p class="co-lead">Here&rsquo;s everything in your basket. Pick how you&rsquo;d like to room on each trip and add any extras &mdash; airport transfers, extra nights &mdash; then choose how to pay. Nothing&rsquo;s charged yet.</p>
            <div class="co-trips" data-trip-list></div>
            <p class="co-hint">Adding more travellers or changing dates? <a href="/">Edit in your basket &rarr;</a></p>

            <!-- Booking summary footer -->
            <div class="co-booking-sec">
              <h2 class="section-heading co-step-heading co-booking-h">Booking <span style="color: var(--tru-pink);">Summary</span></h2>
              <p class="co-sub">Check your details before you continue to payment.</p>

              <div class="co-review">
                <div class="co-rev">
                  <button type="button" class="co-rev__head" data-rev-toggle><span class="co-rev__title">Traveller info</span><span class="co-rev__sub" data-rev-travsub></span><svg class="co-rev__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></button>
                  <div class="co-rev__body">
                    <div data-rev-trav></div>
                    <div class="co-rev__edits"><button type="button" class="co-rev__edit" data-goto="1">Edit traveller info</button></div>
                  </div>
                </div>
                <div class="co-rev">
                  <button type="button" class="co-rev__head" data-rev-toggle><span class="co-rev__title">Trip &amp; add-ons</span><span class="co-rev__sub" data-rev-tripsub></span><svg class="co-rev__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></button>
                  <div class="co-rev__body">
                    <div data-rev-trip></div>
                    <div class="co-rev__edits"><button type="button" class="co-rev__edit" data-scroll-trips>Edit above &uarr;</button></div>
                  </div>
                </div>
                <div class="co-rev co-rev--static is-open">
                  <div class="co-rev__head co-rev__head--static"><span class="co-rev__title">Cost breakdown</span></div>
                  <div class="co-rev__body"><div class="co-summary__rows" data-booking-rows></div></div>
                </div>
                <div class="co-rev co-rev--static is-open">
                  <div class="co-rev__head co-rev__head--static"><span class="co-rev__title">Terms &amp; Conditions</span></div>
                  <div class="co-rev__body co-terms">
                    <label class="co-check"><input type="checkbox" data-tc-marketing /><span>I would like to receive special offers, news and other relevant information</span></label>
                    <label class="co-check"><input type="checkbox" data-tc-agree /><span>I agree to <a href="/terms-conditions" target="_blank" rel="noopener">Booking Terms and Conditions</a> <span class="co-req">*</span></span></label>
                    <p class="co-payopts__err" data-tc-err hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 8v5M12 16.3v.2"/></svg> Please accept the Booking Terms &amp; Conditions to continue.</p>
                  </div>
                </div>
              </div>

              <div class="co-credit" data-credit-card hidden>
                <span class="co-credit__ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg></span>
                <span class="co-credit__txt"><strong data-credit-card-h>&pound;150 travel credit</strong><span data-credit-card-s>Add it to this booking to reduce your total.</span></span>
                <button type="button" class="co-credit__btn" data-credit-toggle>Add</button>
              </div>

              <p class="co-pay-h">Choose how you&rsquo;d like to book</p>
              <div class="co-payopts" data-payopts>
                <button class="co-payopt" data-mode="hold" type="button" data-opt-hold><span class="co-payopt__radio"></span><span class="co-payopt__txt"><strong>Hold your spot</strong><span>Secure your spot for 48 hours</span></span><span class="co-payopt__price" data-price-hold>Free</span></button>
                <button class="co-payopt" data-mode="deposit" type="button" data-opt-deposit><span class="co-payopt__radio"></span><span class="co-payopt__txt"><strong>Deposit</strong><span data-deposit-sub>Pay the balance 60 days before departure</span></span><span class="co-payopt__price" data-price-deposit>&pound;0</span></button>
                <button class="co-payopt" data-mode="plan" type="button" data-opt-plan><span class="co-payopt__radio"></span><span class="co-payopt__txt"><strong>Payment plan</strong><span data-plan-sub>Spread the cost monthly</span></span><span class="co-payopt__price" data-price-plan>&pound;0</span></button>
                <button class="co-payopt" data-mode="full" type="button"><span class="co-payopt__radio"></span><span class="co-payopt__txt"><strong>Pay in full</strong><span>Everything paid &amp; sorted today</span></span><span class="co-payopt__price" data-price-full>&pound;0</span></button>
              </div>
              <p class="co-payopts__note" data-pay-note hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 16.3v.2M12 8v5"/></svg> Your trip departs within 60 days, so the full balance is due to book. Deposit, payment plan and hold-your-spot are only available for departures more than 60 days away.</p>
              <p class="co-payopts__err" data-pay-err hidden><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" d="M12 8v5M12 16.3v.2"/></svg> Please choose a payment option to continue.</p>

              <button type="button" class="co-btn co-btn--yellow" data-next="2">Continue to payment &rarr;</button>
            </div>
          </div>
          <div class="co-card__done" data-done="2" hidden></div>
        </section>

        <!-- STEP 3 — PAYMENT -->
        <section class="co-card co-card--bare" data-step="3">
          <h2 class="section-heading co-step-heading"><span style="color: var(--tru-pink);">Payment</span></h2>
          <div class="co-card__body">
            <p class="co-pay-total" data-pay-total>&pound;0</p>
            <p class="co-sub" data-pay-chosen></p>
            <button type="button" class="co-rev__edit co-pay-change" data-goto="2">&larr; Change payment option</button>

            <div data-pay-card>
              <p class="co-pay-h">Payment method</p>
              <div class="co-paymethods">
                <button type="button" class="co-paymethod" data-express="apple">
                  <span class="co-paymethod__label">Apple Pay</span>
                  <span class="co-paymethod__logo"><img src="/checkout-assets/pay/apple-pay.png" alt="Apple Pay" /></span>
                </button>
                <button type="button" class="co-paymethod" data-express="google">
                  <span class="co-paymethod__label">Google Pay</span>
                  <span class="co-paymethod__logo"><img src="/checkout-assets/pay/google-pay.png" alt="Google Pay" /></span>
                </button>
                <div class="co-paycard" data-paycard>
                  <button type="button" class="co-paycard__head" data-paycard-toggle>
                    <span class="co-paycard__label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path stroke-linecap="round" d="M2 10h20"/></svg> Pay by card</span>
                    <span class="co-paycard__brands"><img src="/checkout-assets/pay/visa.png" alt="Visa" /><img src="/checkout-assets/pay/mastercard.png" alt="Mastercard" /><img src="/checkout-assets/pay/amex.png" alt="Amex" /><svg class="co-paycard__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></span>
                  </button>
                  <div class="co-paycard__body">
                    <form data-card novalidate>
                      <div class="co-field">
                        <label for="co-card-num">Card number</label>
                        <div class="co-input-icon">
                          <input id="co-card-num" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" maxlength="19" />
                        </div>
                      </div>
                      <div class="co-field-row">
                        <div class="co-field"><label for="co-exp">Expiry</label><input id="co-exp" inputmode="numeric" autocomplete="cc-exp" placeholder="MM / YY" maxlength="7" /></div>
                        <div class="co-field"><label for="co-cvc">CVC</label><input id="co-cvc" inputmode="numeric" autocomplete="cc-csc" placeholder="123" maxlength="4" /></div>
                      </div>
                      <div class="co-field"><label for="co-name">Name on card</label><input id="co-name" type="text" autocomplete="cc-name" placeholder="Alex Morgan" /></div>
                      <div class="co-field"><label for="co-addr1">Billing address (first line)</label><input id="co-addr1" type="text" autocomplete="address-line1" placeholder="42 Marlborough Road" /></div>
                      <div class="co-field"><label for="co-postcode">Billing postcode</label><input id="co-postcode" type="text" autocomplete="postal-code" placeholder="SW1A 1AA" /></div>
                      <button type="button" class="co-btn co-btn--primary co-btn--pay" data-pay><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="10" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 018 0v4"/></svg> Pay <span data-pay-amount>&pound;0</span> securely</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div class="co-hold" data-pay-hold hidden>
              <p class="co-hold__txt">We&rsquo;ll hold your place for <strong>48 hours</strong> at no charge &mdash; time to check flights and book annual leave. We&rsquo;ll email a link to complete your booking before it expires.</p>
              <button type="button" class="co-btn co-btn--primary" data-hold><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 2"/></svg> Hold my spot for 48 hours &rarr;</button>
            </div>

            <div class="co-paynote">
              <div class="co-trust co-pay-trust">
                <ul class="co-trust__points">
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg> Financially protected &amp; ATOL covered</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg> Secure payment via Stripe</li>
                </ul>
                <div class="co-trust__badges">
                  <img src="/checkout-assets/pay/atol-logo.png" alt="ATOL protected" />
                  <img src="/checkout-assets/pay/abta-logo.png" alt="ABTA" />
                </div>
              </div>
              <p class="co-secure-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="10" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 018 0v4"/></svg> Payments are encrypted with 256-bit SSL. We never store your card details.</p>
            </div>
          </div>
        </section>

        <!-- STEP 4 — CONFIRMED -->
        <section class="co-card co-confirm" data-step="4" hidden>
          <div class="co-confirm__tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg></div>
          <h2 class="co-confirm__title">You&rsquo;re going!</h2>
          <p class="co-confirm__script">Leave ordinary behind&hellip;</p>
          <p class="co-confirm__sub">We&rsquo;ve emailed your confirmation to <strong data-confirm-email>you@email.com</strong>. Your adventure is locked in.</p>
          <div class="co-confirm__ref"><span>Booking reference</span><strong data-confirm-ref>TRU-000000</strong></div>
          <div class="co-confirm__next">
            <p class="co-confirm__next-h">What happens next</p>
            <ul>
              <li><span>1</span> Check your inbox for your confirmation &amp; e-tickets.</li>
              <li><span>2</span> Pay your balance anytime before 60 days out.</li>
              <li><span>3</span> Pay in full to unlock your Trip Hub &mdash; group chat, leader video &amp; packing guides.</li>
            </ul>
          </div>
          <div class="co-confirm__account">
            <div>
              <p class="co-confirm__account-h">Create your account</p>
              <p class="co-confirm__account-s">Manage your booking, add extras and chat with your group. Takes 20 seconds.</p>
            </div>
            <button class="co-btn co-btn--primary" data-create-account>Set a password</button>
          </div>
          <a class="co-btn co-btn--ghost" href="/">Back to exploring</a>
        </section>

        <a class="co-back-link" href="/">&larr; Back to basket &mdash; change dates or remove a tour</a>

      </div>

      <!-- ============ RIGHT: ORDER SUMMARY ============ -->
      <aside class="co-summary co-summary--desk">
        <div class="co-summary__inner" data-order-desk>
          <h3 class="co-summary__h">Booking summary</h3>
          <div data-order-items></div>
          <div class="co-pax co-pax--desk" data-pax-box></div>
          <div class="co-summary__rows" data-order-rows></div>
          <div class="co-trust">
            <ul class="co-trust__points">
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg> Financially protected &amp; ATOL covered</li>
              <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg> Secure payment via Stripe</li>
            </ul>
            <div class="co-trust__badges">
              <img src="/checkout-assets/pay/atol-logo.png" alt="ATOL protected" />
              <img src="/checkout-assets/pay/abta-logo.png" alt="ABTA" />
              <div class="co-trust__rating"><span class="co-trust__rstars"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span><span class="co-trust__rlabel">4.9 &middot; Trustpilot</span></div>
              <div class="co-trust__rating"><span class="co-trust__rstars"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span><span class="co-trust__rlabel">4.8 &middot; Google</span></div>
            </div>
            <div class="co-trust__cards">
              <img src="/checkout-assets/pay/visa.png" alt="Visa" />
              <img src="/checkout-assets/pay/mastercard.png" alt="Mastercard" />
              <img src="/checkout-assets/pay/amex.png" alt="Amex" />
              <img src="/checkout-assets/pay/apple-pay.png" alt="Apple Pay" />
              <img src="/checkout-assets/pay/google-pay.png" alt="Google Pay" />
            </div>
          </div>
        </div>
      </aside>

    </div>
  </main>

  <!-- Log in modal -->
  <div class="co-modal" data-login-modal hidden>
    <div class="co-modal__backdrop" data-login-close></div>
    <div class="co-modal__panel">
      <button type="button" class="co-modal__x" data-login-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
      <h3 class="co-modal__title">Log in</h3>
      <p class="co-modal__sub">Log in to autofill your details and manage your booking.</p>
      <div class="co-field"><label for="co-login-email">Email</label><input id="co-login-email" type="email" data-login-email placeholder="you@email.com" /></div>
      <div class="co-field"><label for="co-login-pass">Password</label><input id="co-login-pass" type="password" data-login-pass placeholder="Your password" /></div>
      <button type="button" class="co-btn co-btn--primary" data-login-submit>Log in</button>
      <button type="button" class="co-modal__guest" data-login-close>Continue as guest</button>
      <p class="co-login__hint">Prototype: any email &amp; password works.</p>
    </div>
  </div>

  <!-- Travel credit popup (shown after login) -->
  <div class="co-modal" data-credit-modal hidden>
    <div class="co-modal__backdrop" data-credit-pop-close></div>
    <div class="co-modal__panel co-creditpop">
      <button type="button" class="co-modal__x" data-credit-pop-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
      <span class="co-creditpop__badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg></span>
      <h3 class="co-modal__title">You&rsquo;ve got travel credit!</h3>
      <p class="co-creditpop__amt" data-credit-pop-amt>&pound;150</p>
      <p class="co-modal__sub" data-credit-pop-sub>You have travel credit on your account — add it to this booking now, or save it for next time.</p>
      <button type="button" class="co-btn co-btn--primary" data-credit-pop-apply>Add to this booking</button>
      <button type="button" class="co-modal__guest" data-credit-pop-close>Save for later</button>
    </div>
  </div>

  <!-- Create account (set password) modal -->
  <div class="co-modal" data-account-modal hidden>
    <div class="co-modal__backdrop" data-account-close></div>
    <div class="co-modal__panel">
      <button type="button" class="co-modal__x" data-account-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
      <h3 class="co-modal__title">Create your account</h3>
      <p class="co-modal__sub">Set a password to manage your booking, add extras and chat with your group.</p>
      <div class="co-field"><label for="co-acc-pass">Password</label><input id="co-acc-pass" type="password" data-acc-pass placeholder="Create a password" /></div>
      <div class="co-field"><label for="co-acc-pass2">Repeat password</label><input id="co-acc-pass2" type="password" data-acc-pass2 placeholder="Repeat your password" /></div>
      <p class="co-modal__err" data-acc-err hidden></p>
      <button type="button" class="co-btn co-btn--primary" data-account-submit>Create account</button>
      <p class="co-login__hint">Prototype: any password of 6+ characters works.</p>
    </div>
  </div>`;
