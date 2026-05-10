import os
import random
from datetime import datetime, timedelta

output_file = os.path.join(os.path.dirname(__file__), '../public/data/rescuetime-n1.csv')

ACTIVITIES = [
    {"activity": "github.com", "category": "Software Development", "productivity": 2},
    {"activity": "VS Code", "category": "Software Development", "productivity": 2},
    {"activity": "terminal", "category": "Software Development", "productivity": 2},
    {"activity": "slack.com", "category": "Communication", "productivity": 0},
    {"activity": "mail.google.com", "category": "Communication", "productivity": 0},
    {"activity": "youtube.com", "category": "Entertainment", "productivity": -2},
    {"activity": "twitter.com", "category": "Social Media", "productivity": -2},
    {"activity": "docs.google.com", "category": "Reference & Learning", "productivity": 1},
    {"activity": "stackoverflow.com", "category": "Reference & Learning", "productivity": 1},
]

def random_activity():
    r = random.random()
    if r < 0.4: return ACTIVITIES[1]
    if r < 0.5: return ACTIVITIES[0]
    if r < 0.6: return ACTIVITIES[2]
    if r < 0.75: return ACTIVITIES[3]
    if r < 0.8: return ACTIVITIES[8]
    return random.choice(ACTIVITIES)

start_date = datetime.now() - timedelta(days=90)
end_time = datetime.now()
current_time = start_date

csv = "Date,Time,Activity,Category,Productivity,Time Spent (seconds)\n"

current_cluster = "focus"
cluster_remaining = timedelta(seconds=0)

while current_time < end_time:
    if cluster_remaining.total_seconds() <= 0:
        r = random.random()
        if r < 0.6:
            current_cluster = "focus"
            cluster_remaining = timedelta(hours=(1 + random.random() * 3))
        elif r < 0.8:
            current_cluster = "scattered"
            cluster_remaining = timedelta(hours=(0.5 + random.random() * 2))
        else:
            current_cluster = "offline"
            cluster_remaining = timedelta(hours=(2 + random.random() * 10))
            
    if current_cluster == "offline":
        current_time += cluster_remaining
        cluster_remaining = timedelta(seconds=0)
        continue
        
    if current_cluster == "focus":
        act = random_activity()
        if act["category"] != "Software Development":
            if random.random() < 0.8:
                act = ACTIVITIES[1]
        duration_sec = 300 + random.random() * 1200
    else:
        act = random.choice(ACTIVITIES)
        duration_sec = 30 + random.random() * 300
        
    duration = timedelta(seconds=duration_sec)
    
    date_str = current_time.strftime("%Y-%m-%d")
    time_str = current_time.strftime("%H:%M:%S")
    
    csv += f"{date_str},{time_str},{act['activity']},{act['category']},{act['productivity']},{int(duration_sec)}\n"
    
    current_time += duration
    cluster_remaining -= duration

with open(output_file, 'w') as f:
    f.write(csv)
print(f"Successfully generated {output_file}")
