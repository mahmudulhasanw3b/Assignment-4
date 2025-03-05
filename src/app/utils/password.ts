import bcrypt from 'bcrypt';
import config from '../config';

export const hashPassword = async (plainTextPassword: string) =>
    await bcrypt.hash(plainTextPassword, Number(config.bcrypt_salt_round));

export const checkPassword = async (
    plainTextPassword: string,
    hashedPassword: string,
) => await bcrypt.compare(plainTextPassword, hashedPassword);
