from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class ChartConfig(BaseModel):
    type: str
    title: str
    x: str
    y: str
    group_by: Optional[str] = None
    color: Optional[str] = "#8884d8"

class FilterConfig(BaseModel):
    type: str
    label: str
    id: str
    options: Optional[List[str]] = None

class AlleyConfig(BaseModel):
    charts: List[ChartConfig]

class LaneConfig(BaseModel):
    charts: List[ChartConfig]

class LayoutConfig(BaseModel):
    layout: str  # "minimal-reports" or "jacket-reports"
    cards: List[str]
    filters: List[FilterConfig]
    alleys: Optional[List[AlleyConfig]] = None
    lanes: Optional[List[LaneConfig]] = None
    include_table: bool = False
