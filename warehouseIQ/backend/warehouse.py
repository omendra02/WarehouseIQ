from typing import List, Dict, Optional
from datetime import datetime

class Bin:
    def __init__(self, bin_id: str, max_capacity: int):
        self.id = bin_id
        self.max_capacity = max_capacity
        self.items: List[Dict] = []  # List of dicts with {item_id, qty, height, day}
        self.occupied = 0
        self.day_stored: Optional[datetime] = None

    def has_space(self, item_height: int) -> bool:
        return self.occupied + item_height <= self.max_capacity

    def add_item(self, item_id: str, qty: int, height: int) -> None:
        if not self.has_space(height * qty):
            raise ValueError(f"Not enough space in bin {self.id}")
        self.items.append({
            "item_id": item_id,
            "qty": qty,
            "height": height,
            "day": datetime.now()
        })
        self.occupied += height * qty
        self.day_stored = datetime.now()

    def remove_item(self, item_id: str, qty: int) -> int:
        removed = 0
        for item in self.items:
            if item["item_id"] == item_id:
                take = min(item["qty"], qty - removed)
                item["qty"] -= take
                removed += take
                self.occupied -= take * item["height"]
        self.items = [i for i in self.items if i["qty"] > 0]
        return removed

class Warehouse:
    def __init__(self):
        self.bins: List[Bin] = []

    def add_bin(self, bin_obj: Bin) -> None:
        self.bins.append(bin_obj)

    def find_bins_for_item(self, item_id: str) -> List[Bin]:
        return sorted(
            [bin for bin in self.bins if any(i["item_id"] == item_id for i in bin.items)],
            key=lambda b: b.day_stored if b.day_stored else datetime.max
        )

    def dispatch_item(self, item_id: str, qty: int) -> int:
        bins = self.find_bins_for_item(item_id)
        dispatched = 0
        for bin in bins:
            removed = bin.remove_item(item_id, qty - dispatched)
            dispatched += removed
            if dispatched >= qty:
                break
        if dispatched < qty:
            raise ValueError(f"Not enough stock to dispatch. Requested: {qty}, Available: {dispatched}")
        return dispatched

    def get_stock_status(self) -> Dict:
        status = {}
        for bin in self.bins:
            for item in bin.items:
                if item["item_id"] not in status:
                    status[item["item_id"]] = 0
                status[item["item_id"]] += item["qty"]
        return status

    def get_bin_status(self) -> List[Dict]:
        return [{
            "bin_id": bin.id,
            "occupied": bin.occupied,
            "max_capacity": bin.max_capacity,
            "items": bin.items
        } for bin in self.bins]

# Create a singleton warehouse instance
warehouse = Warehouse() 