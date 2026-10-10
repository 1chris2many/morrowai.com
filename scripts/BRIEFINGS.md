# Editing briefings and narration

Edit `theme-current.mjs`; keep the headline, three takeaways and short analysis.
At first mention, identify an unfamiliar company, product, acronym or program
in a few useful words. Prefer inline context to hover-only definitions.

Every briefing needs a `timelineIntro` connecting the selected developments.
Keep milestones that advance the explanation; related coverage remains in the
archive. A timeline may compare different tests rather than imply a causal chain.

Optional `metric`: `value`, `label`, `context`, and `sourceId`. The source must be
one of that briefing's developments. Include the population/test, units and any
forecast/availability qualification. Do not manufacture a metric to fill a slot.
Source-review dates remain factual; cosmetic edits do not reset the age policy.

`npm run build` validates the sources and generates narration before updating
the pages. It uses the local Mac Samantha synthetic voice, at 175 words/minute;
there are no TTS service credentials or paid calls. Text comes deterministically
from the reviewed briefing, including its takeaway labels, metric context,
timeline introduction, chronological milestones and source names. No separate
generative summary can drift from the copy. The exact transcript is visible in
an expandable section and saved alongside the audio.

Audio filenames include a hash of the narrated content and voice configuration.
Unchanged builds reuse verified bytes. Changed narrated content creates new
audio and a new resume-storage key; old cached pages retain their old assets.
If generation fails, the build fails before replacing public HTML. The renderer
also refuses to attach mismatched audio. Do not hand-edit the audio manifest.
Non-Mac builds require already generated matching audio; they fail clearly if it
is missing. Keep referenced `.m4a`, `.m4a.txt`, and `manifest.json` files in git.

The existing governed publisher stages new recordings and checks checksums,
player code and manifest. It byte-checks each recording/transcript on its first
release and once per Pacific day thereafter. No additional scheduler is needed.

Run `npm test` before release. Browser coverage includes actual decoding and
playback, speed, reload/resume, exclusive playback, broken audio, disabled
storage, no-JavaScript text/native controls and mobile widths. Resume position
and speed stay in this browser's local storage; they are not sent to analytics.
