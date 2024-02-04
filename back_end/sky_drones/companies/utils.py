from enum import Enum


class CompanyType(Enum):
    INSPECTING = 'INSPECTING'
    INSPECTED = 'INSPECTED'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]
