import io
import json
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
d = json.load(io.open(sys.argv[1], encoding="utf-8"))
for k in ["components", "blocks", "appUi", "templates", "agentKit"]:
    v = d[k]
    print("==", k, len(v))
    print(json.dumps(v[0], indent=1)[:1200])
print("== agentSkill ==")
print(json.dumps(d["agentSkill"], indent=1)[:800])
print("== counts ==", d["counts"])
