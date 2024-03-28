export default interface IInspection {
    id?: any | null,
    name?: string,
    reason?: string,
    facility?: number,
    facility_name?: string,
    priority?: string | null,
    pilot?: number | null,
    pilot_username?: string | null,
    inspector?: number | null,
    inspector_username?: string | null,
    status?: string
}