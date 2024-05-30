import { ItemBasicRequest } from './ItemBasicRequest.ts';

export class ItemFindRequest extends ItemBasicRequest {
    private ItemId: string;

    public set itemId(itemId: string) {
        this.ItemId = itemId;
    }

    public get $ItemId(): string {
        return this.ItemId;
    }
}
