const {validateEmail,validatePassword} = require('../CLI/validation')
const commander = require('commander')

it('Checks the incorrect email input', async () => {
        const result = await validateEmail('blah');
        expect(result).toBe('Please enter a valid email');
});

it('Checks the correct email input', async () => {
    const result = await validateEmail('test@gmail.com');
    expect(result).toBe(true);
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

test('when .action called then command passed to action', () => {
    const actionMock = jest.fn();
    const program = new commander.Command();
    const cmd = program
        .command('add')
        .action(actionMock);
    program.parse(['node', 'test', 'add']);
    expect(actionMock).toHaveBeenCalledWith(cmd);
}); 
