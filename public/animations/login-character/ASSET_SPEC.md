# Login Character — Final Asset Spec

The five JSON files in this folder are **inert placeholders** (a translucent navy
rounded rectangle, opacity 18%). They are valid Lottie/Bodymovin JSON so the
integration code can load them today without errors, but they carry no real
artwork. The current visual is a hand-rigged animated SVG puppet
(`components/login/LoginCharacter.jsx`) standing in for the final character.

When the real character is produced, drop the finished exports into this folder
using the **exact filenames below** — no code changes are required, only wiring
`LoginCharacter.jsx` to render a `<DotLottieReact>`/`<Lottie>` player instead of
the SVG rig, keyed off the same `pose` prop it already receives.

## Character brief

- Modern corporate employee, young professional, friendly/confident, **no
  suitcase/briefcase/backpack/luggage, no pickup or carry animation**.
- 2.5D / stylized-3D illustration, realistic proportions (no oversized head,
  hands, feet or eyes), full body always visible, clean silhouette.
- Palette: navy/dark-blue jacket (`#12324f`), white/light shirt (`#f5f7fa`),
  charcoal trousers (`#2c333b`), neutral skin tone, clean formal shoes/sneakers.
  Brand accent to match the app's existing navy, `#113F67`.
- Hands must be detailed enough for a clear, unambiguous pointing gesture with
  a recognizable index finger — not a wave.

## Required layer structure (After Effects / rig source)

```
Character
├── Head
│   ├── Face (eyes as separate shapes for blink, mouth, brows)
│   ├── Hair
│   └── Ear (L/R)
├── Neck
├── Torso  (jacket + shirt insert as separate shapes/layers)
├── Left Upper Arm / Left Forearm / Left Hand (index finger separable)
├── Right Upper Arm / Right Forearm / Right Hand (index finger separable)
├── Left Thigh / Left Shin / Left Foot
├── Right Thigh / Right Shin / Right Foot
└── Shadow (ground contact ellipse)
```

Every limb segment must be its own layer/group with the pivot at the joint
(shoulder/elbow/wrist, hip/knee/ankle, neck) — exactly the puppet hierarchy
already implemented in `LoginCharacter.jsx`'s SVG rig, so parenting maps 1:1.

## Orientation

Character stands to the right of the login card; the near/left side of the
character (its left arm and left leg, screen-left) faces and interacts with
the card. Head/gaze turns toward the **left**, toward the form, in every pose
from "point" onward.

## Required animation files, exact names, exact durations

| File | Loop? | Duration | Content |
|---|---|---|---|
| `walk.json` | seamless loop | 0.8–1.0s | Full walk cycle in place (do **not** translate the character horizontally inside the Lottie — Framer Motion moves the container). Natural human gait: opposing arm/leg swing, torso counter-rotation, subtle vertical bounce. First and last frame must match exactly. |
| `idle.json` | seamless loop | ~2.0s | Standing idle: breathing (subtle chest/shoulder rise), blink, tiny posture shift. Very subtle — character should read as alive, not distracted. |
| `point.json` | one-shot | 0.8–1.0s | idle → torso turns slightly toward the card → shoulder raises → forearm extends → index finger points clearly at the login button. Must read unambiguously as pointing, not waving. |
| `lean.json` | one-shot | 0.8–1.0s | point → arm lowers and re-bends → body shifts toward the card → elbow/forearm settles against the card's edge → torso tilts → one leg folds/crosses, the other stays straight and weight-bearing → head finishes turned left. Must feel physically continuous from the point pose, not a jump-cut. |
| `lean-idle.json` | seamless loop | ~2.0–2.6s | Final resting state: same pose as the end of `lean.json`, plus breathing, blink, and micro posture shift. Main pose must **not** drift. |
| `transition-point-to-lean.json` (optional) | one-shot | — | Only needed if `lean.json` isn't authored to start exactly from `point.json`'s last frame. |

All files: 200×400 viewBox/composition (matches the current SVG rig and the
`character-slot` container in `LoginScene.jsx`), 30fps, exported via the
standard Illustrator → After Effects (Duik/rigging) → Bodymovin → `.json`
(or `.lottie`) pipeline.

## Integration contract (already implemented, do not change)

`LoginCharacter.jsx` receives a single prop:

```
pose: "walking" | "idle" | "point" | "lean" | "leanIdle"
```

`LoginScene.jsx` drives `pose` via `useLoginTimeline()` in
`components/login/animation/animationTimeline.js`, on this schedule:

- 0.0s–1.2s → `walking` (container slides in from off-screen)
- 1.2s–2.2s → `idle` (character settles into position)
- 2.2s–3.0s → login card bursts into view, "Task Assigned" badge appears
- 3.0s–4.0s → `point`
- 4.0s–4.8s → `lean`
- 4.8s onward → `leanIdle` (permanent)

`prefers-reduced-motion` skips straight to `leanIdle` with the card already
visible — the final Lottie character must support being mounted directly in
its `lean-idle.json` pose with no preceding animation.
