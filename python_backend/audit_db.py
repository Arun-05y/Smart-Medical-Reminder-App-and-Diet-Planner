import asyncio
from database import get_db
from bson import ObjectId

async def find_duplicate_medicines():
    db = get_db()
    pipeline = [
        {"$group": {"_id": {"name": "$name", "userId": "$userId"}, "count": {"$sum": 1}, "ids": {"$push": "$_id"}}},
        {"$match": {"count": {"$gt": 1}}}
    ]
    duplicates = await db.medicines.aggregate(pipeline).to_list(length=100)
    
    if not duplicates:
        print("No duplicate medicines found. Database is clean.")
    else:
        for dup in duplicates:
            print(f"Found {dup['count']} entries for '{dup['_id']['name']}'. Recommend cleanup.")

if __name__ == "__main__":
    print("Running SmartMed Database Audit...")
    asyncio.run(find_duplicate_medicines())
