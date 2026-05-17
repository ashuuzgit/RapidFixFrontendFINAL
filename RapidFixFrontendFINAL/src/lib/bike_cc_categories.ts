export const CC_CATEGORIES = [
  "0 - 150 CC",
  "150 - 250 CC",
  "250 - 400 CC",
  "400 - 450 CC",
  "450 - 650 CC",
  "650+ CC",
] as const;

export type CCCategory = typeof CC_CATEGORIES[number];

export const MODEL_CC_MAP: Record<string, CCCategory[]> = {
  // ── HERO ──────────────────────────────────────────────────
  "Splendor Plus":      ["0 - 150 CC"],
  "HF Deluxe":         ["0 - 150 CC"],
  "Passion Pro":        ["0 - 150 CC"],
  "Glamour":            ["0 - 150 CC"],
  "Xtreme 160R":        ["150 - 250 CC"],
  "Xpulse 200":         ["150 - 250 CC"],
  "Xpulse 200T":        ["150 - 250 CC"],
  "Destini 125":        ["0 - 150 CC"],
  "Maestro Edge 125":   ["0 - 150 CC"],

  // ── HONDA ─────────────────────────────────────────────────
  "Activa 6G":          ["0 - 150 CC"],
  "Shine 100":          ["0 - 150 CC"],
  "SP 125":             ["0 - 150 CC"],
  "Dio":                ["0 - 150 CC"],
  "Unicorn":            ["150 - 250 CC"],
  "Hornet 2.0":         ["150 - 250 CC"],
  "CB300R":             ["250 - 400 CC"],
  "CB650R":             ["450 - 650 CC"],
  "Africa Twin":        ["650+ CC"],

  // ── TVS ───────────────────────────────────────────────────
  "Jupiter":            ["0 - 150 CC"],
  "Ntorq 125":          ["0 - 150 CC"],
  "Raider 125":         ["0 - 150 CC"],
  "Apache RTR 160":     ["150 - 250 CC"],
  "Apache RTR 200 4V":  ["150 - 250 CC"],
  "Apache RR 310":      ["250 - 400 CC"],
  "Ronin":              ["150 - 250 CC"],
  "Star City+":         ["0 - 150 CC"],

  // ── BAJAJ ─────────────────────────────────────────────────
  "Pulsar 125":         ["0 - 150 CC"],
  "Pulsar 150":         ["0 - 150 CC"],
  "Pulsar 220F":        ["150 - 250 CC"],
  "Pulsar NS200":       ["150 - 250 CC"],
  "Pulsar RS200":       ["150 - 250 CC"],
  "Dominar 250":        ["150 - 250 CC"],
  "Dominar 400":        ["250 - 400 CC"],
  "Discover 125":       ["0 - 150 CC"],
  "Platina 110":        ["0 - 150 CC"],

  // ── ROYAL ENFIELD ─────────────────────────────────────────
  "Classic 350":        ["250 - 400 CC"],
  "Bullet 350":         ["250 - 400 CC"],
  "Meteor 350":         ["250 - 400 CC"],
  "Hunter 350":         ["250 - 400 CC"],
  "Scram 411":          ["400 - 450 CC"],
  "Himalayan 450":      ["450 - 650 CC"],
  "Super Meteor 650":   ["450 - 650 CC"],
  "Interceptor 650":    ["450 - 650 CC"],
  "Continental GT 650": ["450 - 650 CC"],

  // ── YAMAHA ────────────────────────────────────────────────
  "FZ-S V3":            ["0 - 150 CC"],
  "FZ-X":               ["0 - 150 CC"],
  "MT-15 V2":           ["150 - 250 CC"],
  "YZF-R15 V4":         ["150 - 250 CC"],
  "YZF-R3":             ["250 - 400 CC"],
  "FZ25":               ["150 - 250 CC"],
  "Aerox 155":          ["150 - 250 CC"],
  "Fascino 125":        ["0 - 150 CC"],
  "Ray ZR 125":         ["0 - 150 CC"],

  // ── SUZUKI ────────────────────────────────────────────────
  "Access 125":         ["0 - 150 CC"],
  "Burgman Street 125": ["0 - 150 CC"],
  "Intruder 150":       ["150 - 250 CC"],
  "Gixxer 150":         ["150 - 250 CC"],
  "Gixxer SF 150":      ["150 - 250 CC"],
  "Gixxer 250":         ["150 - 250 CC"],
  "Gixxer SF 250":      ["150 - 250 CC"],
  "V-Strom SX 250":     ["150 - 250 CC"],
  "Hayabusa":           ["650+ CC"],

  // ── KTM ───────────────────────────────────────────────────
  "Duke 125":           ["0 - 150 CC"],
  "Duke 200":           ["150 - 250 CC"],
  "Duke 250":           ["150 - 250 CC"],
  "Duke 390":           ["250 - 400 CC"],
  "RC 125":             ["0 - 150 CC"],
  "RC 200":             ["150 - 250 CC"],
  "RC 390":             ["250 - 400 CC"],
  "Adventure 250":      ["150 - 250 CC"],
  "Adventure 390":      ["250 - 400 CC"],

  // ── JAWA ──────────────────────────────────────────────────
  "Jawa 42":            ["250 - 400 CC"],
  "Jawa 42 Bobber":     ["250 - 400 CC"],
  "Jawa 350":           ["250 - 400 CC"],
  "Perak":              ["250 - 400 CC"],
  "Yezdi Roadster":     ["250 - 400 CC"],
  "Yezdi Scrambler":    ["250 - 400 CC"],

  // ── BMW ───────────────────────────────────────────────────
  "G 310 R":            ["250 - 400 CC"],
  "G 310 GS":           ["250 - 400 CC"],
  "F 900 R":            ["650+ CC"],
  "F 900 XR":           ["650+ CC"],
  "S 1000 RR":          ["650+ CC"],
  "R 1250 GS":          ["650+ CC"],
  "M 1000 RR":          ["650+ CC"],

  // ── BENELLI ───────────────────────────────────────────────
  "TRK 502":            ["450 - 650 CC"],
  "TRK 502X":           ["450 - 650 CC"],
  "Leoncino 500":       ["450 - 650 CC"],
  "502C":               ["450 - 650 CC"],
  "302R":               ["250 - 400 CC"],
  "TNT 600i":           ["450 - 650 CC"],

  // ── DUCATI ────────────────────────────────────────────────
  "Monster":            ["650+ CC"],
  "Scrambler Icon":     ["650+ CC"],
  "Scrambler Desert Sled": ["650+ CC"],
  "Panigale V2":        ["650+ CC"],
  "Panigale V4":        ["650+ CC"],
  "Multistrada V2":     ["650+ CC"],
  "DesertX":            ["650+ CC"],

  // ── HARLEY DAVIDSON ───────────────────────────────────────
  "Nightster":          ["650+ CC"],
  "Sportster S":        ["650+ CC"],
  "Iron 883":           ["650+ CC"],
  "Forty-Eight":        ["650+ CC"],
  "Fat Bob":            ["650+ CC"],
  "Fat Boy":            ["650+ CC"],
  "Street Glide":       ["650+ CC"],
  "Road Glide":         ["650+ CC"],
  "Pan America 1250":   ["650+ CC"],

  // ── HUSQVARNA ─────────────────────────────────────────────
  "Svartpilen 250":     ["150 - 250 CC"],
  "Vitpilen 250":       ["150 - 250 CC"],
  "Svartpilen 401":     ["250 - 400 CC"],
  "Vitpilen 401":       ["250 - 400 CC"],

  // ── HYOSUNG ───────────────────────────────────────────────
  "GT250R":             ["150 - 250 CC"],
  "GT650R":             ["450 - 650 CC"],
  "GV300S Aquila Pro":  ["250 - 400 CC"],
  "GT250":              ["150 - 250 CC"],
  "GD250N":             ["150 - 250 CC"],

  // ── INDIAN ────────────────────────────────────────────────
  "Scout":              ["650+ CC"],
  "Scout Bobber":       ["650+ CC"],
  "Chief":              ["650+ CC"],
  "Chieftain":          ["650+ CC"],
  "Springfield":        ["650+ CC"],
  "Challenger":         ["650+ CC"],
  "FTR 1200":           ["650+ CC"],
  "Pursuit":            ["650+ CC"],

  // ── KAWASAKI ──────────────────────────────────────────────
  "Ninja 300":          ["250 - 400 CC"],
  "Ninja 400":          ["250 - 400 CC"],
  "Ninja 650":          ["450 - 650 CC"],
  "Ninja ZX-10R":       ["650+ CC"],
  "Z650":               ["450 - 650 CC"],
  "Z900":               ["650+ CC"],
  "Versys 650":         ["450 - 650 CC"],
  "W175":               ["150 - 250 CC"],
  "Eliminator 450":     ["450 - 650 CC"],

  // ── TRIUMPH ───────────────────────────────────────────────
  "Speed 400":          ["250 - 400 CC"],
  "Scrambler 400 X":    ["250 - 400 CC"],
  "Street Triple R":    ["650+ CC"],
  "Speed Triple 1200":  ["650+ CC"],
  "Tiger 900":          ["650+ CC"],
  "Tiger 1200":         ["650+ CC"],
  "Bonneville T100":    ["650+ CC"],
  "Bonneville T120":    ["650+ CC"],
  "Rocket 3":           ["650+ CC"],
};
