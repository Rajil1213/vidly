export type User = {
    id: number,
    name: string,
    email: string,
    isAdmin: boolean,
    authToken: string | null
}