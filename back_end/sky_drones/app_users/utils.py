from enum import Enum


class UserStatuses(Enum):
    ACTIVE = 'ACTIVE'
    INACTIVE = 'INACTIVE'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]
