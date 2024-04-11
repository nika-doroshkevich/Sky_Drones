export default interface IDefectModel {
    id?: any | null,
    name: string,
    severity: string,
    description: string,
    file_storage_item: number,
    file_storage_item_path?: string | null,
    inspection: number
}
