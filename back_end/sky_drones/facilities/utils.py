from enum import Enum


class FacilityType(Enum):
    Aircraft = 'Aircraft'
    Airport = 'Airport'
    Bridges = 'Bridges'
    Buildings = 'Buildings'
    Commercial_Buildings = 'Commercial Buildings'
    Construction = 'Construction'
    Cranes = 'Cranes'
    Dam = 'Dam'
    Drilling_Heads = 'Drilling Heads'
    Electrical_Pylons = 'Electrical Pylons'
    Factories = 'Factories'
    Mining_Site = 'Mining Site'
    Motorways = 'Motorways'
    Nuclear = 'Nuclear'
    Other = 'Other'
    Pipeline = 'Pipeline'
    Power_Station = 'Power Station'
    Railway = 'Railway'
    Refineries = 'Refineries'
    Solar_Farms_Panels = 'Solar Farms & Panels'
    Stockpile = 'Stockpile'
    Storage_Tanks = 'Storage Tanks'
    Substation = 'Substation'
    Telecom_Tower_Mobile_Cell_Sites = 'Telecom Tower & Mobile Cell Sites'
    Tunnels = 'Tunnels'
    Wind_Turbines = 'Wind Turbines'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]
