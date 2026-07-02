import urllib.request
import json
import socket

urls = [
    "https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=10&po=1&np=1&fields=f12,f14,f2,f3,f62&fid=f62&fs=m:90+t:2+f:!50",
    "http://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=10&po=1&np=1&fields=f12,f14,f2,f3,f62&fid=f62&fs=m:90+t:2+f:!50",
    "https://push2his.eastmoney.com/api/qt/clist/get?pn=1&pz=10&po=1&np=1&fields=f12,f14,f2,f3,f62&fid=f62&fs=m:90+t:2+f:!50"
]

for url in urls:
    print(f"Testing URL: {url}")
    for attempt in range(1, 4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.loads(response.read().decode("utf-8"))
                print(f"  Attempt {attempt}: Success! Keys: {list(data.keys())}")
                break
        except Exception as e:
            print(f"  Attempt {attempt} failed: {e}")
