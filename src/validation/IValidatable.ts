export interface IValidatable<T, E> {
    validate(request: T): E[];
}
