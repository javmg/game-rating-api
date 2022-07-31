import bcrypt from "bcryptjs"

export async function hash(password: string): Promise<string> {

    const salt = await bcrypt.genSalt();

    return await bcrypt.hash(password, salt);
}

export async function matches(password: string, hash: string): Promise<boolean> {

    return bcrypt.compare(password, hash);
}