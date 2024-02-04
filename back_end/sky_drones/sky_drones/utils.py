from enum import Enum


class Statuses(Enum):
    ACTIVE = 'ACTIVE'
    INACTIVE = 'INACTIVE'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]
