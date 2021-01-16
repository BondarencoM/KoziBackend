const {
    validateEmail,
    validatePassword,
    checkDomain
} = require('../CLI/validation')
const commander = require('commander')

it('Checks the incorrect email input', async () => {
    const result = await validateEmail('blah');
    expect(result).toBe('Please enter a valid email');
});

it('Checks the email input with correct domain', async () => {
    const result = await validateEmail('test@Isaac.nl');
    expect(result).toBe(true);
});

it('Checks the email input with incorrect domain', async () => {
    const result = await validateEmail('test@gamil.com');
    expect(result).toBe("Wrong domain name");
});

it('Checks the email input with incorrect domain #2', async () => {
    const result = await validateEmail('test@Isaac2.nl');
    expect(result).toBe("Wrong domain name");
});

it('Checks the email input with incorrect domain #3', async () => {
    const result = await validateEmail('test@Isaac.nll');
    expect(result).toBe("Wrong domain name");
});

it('Checks the empty email input', async () => {
    const result = await validateEmail('');
    expect(result).toBe('Email field should not be empty');
});

it('Checks the incorrect password input', async () => {
    const result = await validatePassword('blah');
    expect(result).toBe('Password should be minimum eight characters, at least one letter and one number');
});

it('Checks the correct password input', async () => {
    const result = await validatePassword('12345678Test');
    expect(result).toBe(true);
});

it('Checks the empty password input', async () => {
    const result = await validatePassword('');
    expect(result).toBe('Password field should not be empty');
});

it('Checks the email with incorrect domain name', async () => {
    const result = await checkDomain('blah');
    expect(result).toBe(false);
});

it('Checks the email with correct domain name', async () => {
    const result = await checkDomain('@Isaac.nl');
    expect(result).toBe(true);
});

test('when .action called then command passed to action', () => {
    const actionMock = jest.fn();
    const program = new commander.Command();
    const cmd = program
        .command('add')
        .action(actionMock);
    program.parse(['node', 'test', 'add']);
    expect(actionMock).toHaveBeenCalledWith(cmd);
});
