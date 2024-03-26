from enum import Enum


class InspectionPriority(Enum):
    HIGH = 'HIGH'
    MEDIUM = 'MEDIUM'
    LOW = 'LOW'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]


class InspectionStatus(Enum):
    CREATED = 'CREATED'
    IN_PROCESS = 'IN_PROCESS'
    DONE = 'DONE'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]
