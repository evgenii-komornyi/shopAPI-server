export class UserFindRequest {
    private UserId: number;

    public set userId(userId: number) {
        this.UserId = userId;
    }

    public get $UserId(): number {
        return this.UserId;
    }
}
