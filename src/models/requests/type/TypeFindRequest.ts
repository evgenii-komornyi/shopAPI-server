import { TypeBasicRequest } from './TypeBasicRequest.ts';

export class TypeFindRequest extends TypeBasicRequest {
    private TypeName: string;

    public get $TypeName(): string {
        return this.TypeName;
    }

    public set typeName(typeName: string) {
        this.TypeName = typeName;
    }
}
