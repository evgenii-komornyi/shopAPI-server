export interface IValidatable<T, E> {
    validate(request: T): E[];
    validate(request: T, passwordRequest?: string): E[];
}
