# Login character asset

`character.json` is the 3D character on the `/hrm` login page — it walks in
from the left, sets its briefcase down, and settles against the login card.

It is a **walk-cycle loop** (1000x1000, 30fps, ~1.33s). The scene drives
playback rather than just looping it forever:

- while walking in → the cycle plays at full speed
- once it arrives → playback parks on the passing pose (legs together) so the
  character reads as *standing*, with a slow breathing loop layered on top

## Swapping the character

Replace `character.json` with any other Lottie walk cycle — no code change
needed. Two knobs at the top of
`components/hrm/login/LoginCharacter.jsx` handle the common mismatches:

| Constant     | When to change it                                              |
| ------------ | -------------------------------------------------------------- |
| `REST_FRAME` | Character parks mid-stride when it stops — try ±10 frames        |
| `FACE_LEFT`  | Replacement character faces left instead of right — set `true`   |

Free walk cycles: <https://lottiefiles.com/free-animations/3d-character>
(search `3d character walking`, `3d businessman`). Download as **Lottie JSON**
and save it here as `character.json`.

## Positioning

The slot is square because the artwork canvas is 1:1 — a taller box would just
letterbox it. To reseat the character or the briefcase, edit the `.actor` and
`.case` blocks in `components/hrm/login/LoginScene.jsx`.
