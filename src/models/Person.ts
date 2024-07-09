export class Person {
    protected Id: number;
    protected Email: string;

    constructor(email: string) {
        this.Email = email;
    }

    public set id(id: number) {
        this.Id = id;
    }

    public get $Id(): number {
        return this.Id;
    }

    public set email(email: string) {
        this.Email = email;
    }

    public get $Email(): string {
        return this.Email;
    }
}
