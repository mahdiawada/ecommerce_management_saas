export type id = string;

export interface ID {
    /**
     * Retrieves the unique identifier of the entity.
     * @returns {string} The unique identifier as a string.
     */
    getId(): string;
}

export interface IRepository<T> {
    // Invalid element
    create(element: T): Promise<id>;
    
    // Throw an error if element not found
    get(id: id): Promise<T>;
    
    
    getAll(): Promise<T[]>;
    
    // Throw element not found || Invalid element
    update(element: T): Promise<void>;
    
    // Throw element not found
    delete(id: id): Promise<void>;

}

export interface Initializable {
    init(): Promise<void>;
}
