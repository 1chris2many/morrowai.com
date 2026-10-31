# Editing briefings and narration

Edit `theme-current.mjs`; keep the headline, three takeaways and short analysis.

Write for someone who knows AI generally and has not followed the news. Every
brief must make sense to a reader arriving cold:

- **Title:** a plain statement of what is happening, understandable with no
  other context. Name the concrete thing (customers, bills, chips, records), not
  an abstraction such as "the work", "the operator" or "the bottleneck".
- **Teaser and summary:** explain the situation first. The summary says what the
  story is, then which question it tracks. Never lead with shorthand for
  evidence ("switching data", "the Qwen test"); a reader has not met it yet.
- **Why it matters (`meaning`):** say what changes for the reader's understanding
  of AI. Mention an event only with enough context to stand alone.
- **Developments:** keep only stories that advance the theme; the rest stay in
  the news archive. Every active brief's developments need `why`, one short
  reader-facing sentence on how this story connects to the theme. `relation` is
  the internal evidence note and is not published. The build fails without `why`.

At first mention, identify an unfamiliar company, product, acronym or program
in a few useful words. Prefer inline context to hover-only definitions.

Every briefing needs a `timelineIntro` connecting the selected developments.
Keep milestones that advance the explanation; related coverage remains in the
archive. A timeline may compare different tests rather than imply a causal chain.

Optional `metric`: `value`, `label`, `context`, and `sourceId`. The source must be
one of that briefing's developments. Include the population/test, units and any
forecast/availability qualification. Do not manufacture a metric to fill a slot.
Source-review dates remain factual; cosmetic edits do not reset the age policy.

`npm run build` validates the sources and verifies pre-generated **Eleven v4 /
Rachel** narration before updating the pages. The engine identity is
`eleven-v4-rachel-v1`, with model `eleven_v4` and Rachel voice
`21m00Tcm4TlvDq8ikWAM`. The public publisher has no TTS service credentials or
provider calls. Ordinary builds never generate audio and never fall back to
Samantha, including on a Mac. Text comes deterministically
from the reviewed briefing, including its takeaway labels, metric context,
timeline introduction, chronological milestones and source names. No separate
generative summary can drift from the copy. The exact transcript is visible in
an expandable section and saved alongside the audio.

Audio filenames include a hash of the narrated content and voice configuration.
Unchanged builds verify and reuse existing bytes without writing the cache.
Changed narrated content requires a new recording and resume-storage key; old
cached pages retain their old assets. Missing, stale, corrupt, or wrong-engine
audio fails the build with the affected briefing IDs before replacing public
HTML. The renderer also refuses mismatched metadata. Do not hand-edit the audio
manifest. Keep referenced `.m4a`, `.m4a.txt`, and `manifest.json` files in git.

## Broker generation and explicit import

The authorized Rig publisher should perform this preparation before its existing
build/publish checks. A plain website build is deliberately an offline verifier;
the governed Rig step owns generation authorization, retries and spending. It
must complete generation/import for changed briefs before proceeding. Do not
publish a partial migration or retry a paid call after an ambiguous result.

1. Export a plan outside the public tree:
   `npm run audio:plan -- /path/to/audio-plan`. This writes `requests.json` and
   each exact reviewed `<id>.txt` transcript, including its trailing newline.
   It makes no provider calls. Each request includes `id`, content/engine `hash`,
   `transcriptSha256`, `transcript`, expected `output` and `receipt` filenames,
   `textCharacters`, `needsRender`, and a diagnostic `reason`. `needsRender:false`
   means the existing engine/content hashes, transcript, audio checksum, byte
   count and AAC/M4A duration all verified. Skip those entries.
2. For each `needsRender:true` entry, use Rig's registered `speak` action with the
   plan's explicit model and voice and the exact transcript. Do not summarize,
   rewrite, or truncate it. Preserve the broker receipt. If the broker produces
   MP3, convert locally to AAC in an M4A container, then calculate the checksum,
   byte count and duration from the final M4A. This repository never invokes
   `speak`, reads provider credentials, or makes a paid request.
3. Create a local import receipt using the plan hashes and final output metadata:

   ```json
   {
     "id": "chip-switching",
     "engine": "eleven-v4-rachel-v1",
     "model": "eleven_v4",
     "voice": "21m00Tcm4TlvDq8ikWAM",
     "hash": "<full content-and-engine SHA-256 from requests.json>",
     "transcriptSha256": "<SHA-256 of the exact .txt including final newline>",
     "bytes": 123456,
     "sha256": "<SHA-256 of final M4A bytes>",
     "duration": 123.456
   }
   ```

   A broker-produced record may include additional fields; the importer does not
   copy private paths, broker metadata or receipts into the public manifest.
   Engine/voice metadata is a declaration from the trusted broker handoff, not
   something a checksum can establish from the sound itself.
4. Import **serially** into the isolated release worktree:
   `npm run audio:import -- chip-switching /path/to/recording.m4a /path/to/receipt.json`.
   The importer checks the current reviewed copy again, rejects wrong voice or
   stale hashes, verifies checksum/bytes, inspects AAC/M4A metadata and duration,
   and atomically replaces files and then the manifest. Repeating an unchanged
   verified import makes no writes. It never renames legacy Samantha bytes as
   modern recordings. Import all required entries before building.
5. Run `npm run build`, `npm test`, and the existing governed release checks.
   Browser decoding/listening remains required: container metadata and checksums
   alone cannot establish narration quality or whether every word was spoken.

`npm run test:audio-pipeline` exercises plan/import/cache compatibility without
generating audio. When preparing an engine migration before its recordings are
ready, old release files remain intact, but `npm run build` and current-audio
release assertions intentionally reject them. Full release tests require all
current modern imports.

The existing governed publisher stages new recordings and checks checksums,
player code and manifest. It byte-checks each recording/transcript on its first
release and once per Pacific day thereafter. No additional scheduler is needed.

Run `npm test` before release. Browser coverage includes actual decoding and
playback, speed, reload/resume, exclusive playback, broken audio, disabled
storage, no-JavaScript text/native controls and mobile widths. Resume position
and speed stay in this browser's local storage; they are not sent to analytics.
