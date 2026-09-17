"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

/**
 * Photo / video upload.
 *
 * The page this replaces takes your name and email and then emails you a
 * Dropbox link — two steps, a wait, and a context switch before anyone has
 * uploaded anything. Here the drop zone is the first thing on the page and the
 * details sit beside it, so the thing you came to do is the thing on screen.
 *
 * Four decisions worth keeping:
 *
 *  1. The zone is a <label> wrapping a visually-hidden <input type="file">,
 *     not a div with a click handler forwarding to a hidden input. That gets
 *     click-to-browse, keyboard focus and screen-reader labelling for free —
 *     the hand-rolled version is the usual way this breaks for keyboard users.
 *     `focus-within` is why the zone lights up on tab.
 *  2. Files live in React state, not in the input. A FileList is read-only, so
 *     "remove this one" is impossible if the input is the source of truth, and
 *     picking again would replace the selection rather than add to it. A
 *     DataTransfer is rebuilt on submit so FormData sees them.
 *  3. Bad files are shown, marked, with the reason — not silently dropped.
 *     Submit is blocked while any are bad.
 *  4. Object URLs are revoked when a file goes, or video thumbnails hold their
 *     decoded data for the life of the page.
 *
 * Consent is a required checkbox rather than a line in the terms: we're asking
 * to publish someone's face.
 *
 * NO BACKEND — submit is intercepted and the success panel shown. The wire-up
 * point is marked below; the file field is `photos[]`.
 *
 * Mirrored by converted/components/upload-dropzone.html.
 */

const MAX_FILES = 25;
const MAX_BYTES = 200 * 1024 * 1024; // 200MB per file

const TRIPS = [
  "Thailand Island Hopper",
  "Bali Experience",
  "Vietnam Express",
  "Philippines Island Hopper",
  "Sri Lanka Experience",
  "Something else",
];

type Picked = { file: File; url: string };

function mb(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function problem(f: File) {
  if (!/^(image\/|video\/)/.test(f.type)) return "not a photo or video";
  if (f.size > MAX_BYTES) return "over 200MB";
  return "";
}

const FIELD_LABEL =
  "block text-[10px] text-tru-pink font-bold uppercase tracking-[0.2em] font-heading mb-2";
const FIELD =
  "w-full bg-white/5 border border-white/10 rounded-[10px] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-tru-pink/50 transition";
const HINT = "text-gray-500 text-xs leading-relaxed mt-1.5";

export default function UploadDropzone() {
  const [picked, setPicked] = useState<Picked[]>([]);
  const [over, setOver] = useState(false);
  const [sent, setSent] = useState(0);
  const [noFiles, setNoFiles] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /* Revoke every object URL on unmount — the per-file revoke on remove only
     covers files the user takes out, not the ones still listed when they go. */
  useEffect(() => () => picked.forEach((p) => URL.revokeObjectURL(p.url)), [picked]);

  const add = useCallback((list: FileList | null) => {
    if (!list) return;
    setNoFiles(false);
    setPicked((prev) => {
      const next = [...prev];
      Array.from(list).forEach((file) => {
        // same name and size twice over is a re-pick, not a second photo
        if (next.some((p) => p.file.name === file.name && p.file.size === file.size)) return;
        next.push({ file, url: URL.createObjectURL(file) });
      });
      return next;
    });
  }, []);

  const remove = (i: number) =>
    setPicked((prev) => {
      URL.revokeObjectURL(prev[i].url);
      return prev.filter((_, k) => k !== i);
    });

  const clear = () =>
    setPicked((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return [];
    });

  const { total, bad } = useMemo(
    () => ({
      total: picked.reduce((n, p) => n + p.file.size, 0),
      bad: picked.filter((p) => problem(p.file)).length,
    }),
    [picked],
  );

  const error =
    bad > 0
      ? `${bad} ${bad === 1 ? "file can’t" : "files can’t"} be sent — remove the ones marked in red.`
      : picked.length > MAX_FILES
        ? `That’s ${picked.length} files. The limit is ${MAX_FILES} at a time.`
        : noFiles
          ? "Pick at least one photo or video first."
          : "";

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!picked.length) {
      setNoFiles(true);
      return;
    }
    if (!formRef.current?.checkValidity()) {
      formRef.current?.reportValidity();
      return;
    }
    // Put our array back on the input so FormData picks the files up.
    const dt = new DataTransfer();
    picked.forEach((p) => dt.items.add(p.file));
    if (inputRef.current) inputRef.current.files = dt.files;

    /* ---- wire the real upload here -------------------------------
       const body = new FormData(formRef.current!);
       await fetch("/api/uploads", { method: "POST", body });
       -------------------------------------------------------------- */

    setSent(picked.length);
  };

  if (sent > 0) {
    return (
      <div className="rounded-[16px] border border-white/10 bg-white/[0.03] p-8 sm:p-10 text-center">
        <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-tru-pink/15 border border-tru-pink/30 flex items-center justify-center">
          <svg className="h-7 w-7 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-white uppercase font-heading tracking-tight mb-2">
          Got Them &mdash; <span className="text-tru-pink">Thank You</span>
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed max-w-sm mx-auto">
          <b className="text-white">{sent}</b> {sent === 1 ? "file" : "files"}{" "}
          on their way. You&apos;re in the next
          £250 draw, and if we post one of yours we&apos;ll tag you.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-12 items-start">
      {/* ---------- left: the zone and what's in it ---------- */}
      <div>
        <label
          onDragEnter={(e) => { e.preventDefault(); setOver(true); }}
          onDragOver={(e) => { e.preventDefault(); setOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); setOver(false); }}
          onDrop={(e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files); }}
          className={`relative flex min-h-[15rem] sm:min-h-[18rem] cursor-pointer flex-col items-center justify-center rounded-[16px] border-2 border-dashed p-8 sm:p-10 text-center transition focus-within:border-tru-pink focus-within:bg-tru-pink/[0.08] ${
            over ? "border-tru-pink bg-tru-pink/[0.08]" : "border-white/[0.18] bg-white/[0.03] hover:border-tru-pink/50 hover:bg-white/[0.05]"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            name="photos[]"
            accept="image/*,video/*"
            multiple
            onChange={(e) => { add(e.target.files); e.target.value = ""; }}
            className="sr-only"
          />
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-tru-pink/30 bg-tru-pink/15" aria-hidden>
            <svg className="h-7 w-7 text-tru-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 15V3m0 0L8 7m4-4l4 4" />
            </svg>
          </span>
          <p className="font-heading text-lg font-black uppercase tracking-tight text-white mb-1.5">
            Drop Your Photos <span className="text-tru-pink">Here</span>
          </p>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Or click to browse. Photos and videos both welcome &mdash; selfies, group shots, the 10/10 stuff.
          </p>
          <p className="text-gray-500 text-xs leading-relaxed mt-4">
            JPG, PNG, HEIC, MP4 or MOV &middot; up to {MAX_FILES}{" "}
            files &middot; 200MB each
          </p>
        </label>

        {picked.length > 0 && (
          <>
            <ul className="mt-5 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(7rem,1fr))]">
              {picked.map((p, i) => {
                const why = problem(p.file);
                const isVideo = /^video\//.test(p.file.type);
                return (
                  <li
                    key={`${p.file.name}-${p.file.size}`}
                    className={`relative overflow-hidden rounded-[10px] border bg-white/[0.04] ${why ? "border-red-500/60" : "border-white/10"}`}
                  >
                    <div className="relative aspect-square bg-black/30">
                      {isVideo ? (
                        <>
                          <video src={p.url} muted playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
                          <span className="absolute left-1.5 top-1.5 z-10 rounded-full bg-black/65 px-1.5 py-0.5 font-heading text-[9px] font-bold uppercase tracking-wider text-white">
                            Video
                          </span>
                        </>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => remove(i)}
                        aria-label={`Remove ${p.file.name}`}
                        className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-tru-pink"
                      >
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <span className="block truncate px-2 pt-1.5 text-[0.7rem] leading-tight text-gray-300">{p.file.name}</span>
                    <span className={`block px-2 pb-1.5 text-[0.65rem] tabular-nums ${why ? "text-red-400" : "text-gray-500"}`}>
                      {why || mb(p.file.size)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[0.8125rem] text-gray-400">
              <span>
                <b className="text-white tabular-nums">{picked.length}</b>{" "}
                selected &middot;{" "}
                <b className="text-white tabular-nums">{mb(total)}</b>{" "}
                total
              </span>
              <button type="button" onClick={clear} className="text-[0.8125rem] text-gray-500 underline hover:text-white">
                Remove all
              </button>
            </div>
          </>
        )}

        {error && <p className="mt-3 text-[0.8125rem] leading-relaxed text-red-400">{error}</p>}
      </div>

      {/* ---------- right: who it's from ---------- */}
      <div>
        <div className="mb-6 rounded-[14px] border border-tru-pink/30 bg-tru-pink/[0.07] p-5 sm:p-6">
          <p className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-tru-pink mb-2">
            Every Three Months
          </p>
          <p className="font-heading text-3xl font-black leading-none text-white mb-2">
            £250 <span className="text-tru-pink">Travel Credit</span>
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Everyone who uploads goes into the draw. It literally pays to show off your holiday photos for once.
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="upl-name" className={FIELD_LABEL}>First Name <span className="text-gray-500">*</span></label>
          <input id="upl-name" name="name" type="text" required placeholder="Your first name" autoComplete="given-name" className={FIELD} />
        </div>
        <div className="mb-4">
          <label htmlFor="upl-email" className={FIELD_LABEL}>Email <span className="text-gray-500">*</span></label>
          <input id="upl-email" name="email" type="email" required placeholder="you@email.com" autoComplete="email" className={FIELD} />
          <p className={HINT}>Only so we can tell you if you win.</p>
        </div>
        <div className="mb-4">
          <label htmlFor="upl-trip" className={FIELD_LABEL}>Which Trip?</label>
          <select id="upl-trip" name="trip" className={FIELD}>
            <option value="">Pick your trip&hellip;</option>
            {TRIPS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="upl-insta" className={FIELD_LABEL}>Instagram Handle</label>
          <input id="upl-insta" name="instagram" type="text" placeholder="@yourhandle" className={FIELD} />
          <p className={HINT}>So we can tag you if we post it.</p>
        </div>

        <label className="mb-4 flex cursor-pointer items-start gap-2.5 text-[0.82rem] leading-relaxed text-gray-400">
          <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 shrink-0 accent-tru-pink" />
          <span>
            I&apos;m happy for TruTravels to use these on the website and social, and everyone in them is happy too.{" "}
            <span className="text-gray-500">*</span>
          </span>
        </label>

        <button
          type="submit"
          disabled={bad > 0 || picked.length > MAX_FILES}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-tru-pink px-6 py-3 font-heading text-xs font-bold uppercase tracking-wider text-white transition hover:bg-tru-pink-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send My Photos
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <p className="mt-4 text-xs leading-relaxed text-gray-500">
          By uploading you accept the{" "}
          <Link href="/terms-conditions" className="text-gray-300 underline">terms</Link>. We&apos;ll never sell your
          photos or pass them on.
        </p>
      </div>
    </form>
  );
}
