import { PasswordUtil } from './api/v1/utils/password.util.js';

async function verify() {
    const plainText = 'my-secret-password';

    console.log('Testing PasswordUtil...');

    // Test validation
    const validationSuccess = PasswordUtil.validate(plainText);
    console.log('Validation (valid):', validationSuccess.success);

    const validationFail = PasswordUtil.validate('a'.repeat(61));
    console.log('Validation (too long):', validationFail.success === false, validationFail.message);

    // Test hashing
    const hash = await PasswordUtil.hash(plainText);
    console.log('Hashed Password:', hash);
    console.log('Hash starts with $2b$:', hash.startsWith('$2b$'));

    // Test comparison
    const match = await PasswordUtil.compare(plainText, hash);
    console.log('Comparison (correct):', match);

    const mismatch = await PasswordUtil.compare('wrong-password', hash);
    console.log('Comparison (incorrect):', mismatch === false);

    console.log('Verification finished.');
}

verify().catch(console.error);
