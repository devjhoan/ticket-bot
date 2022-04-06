const chalk = require('chalk');

/**
 * 
 * @param {String} message 
 * @returns {void}
 */
function debug(message) {
	const date = new Date();
	const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
	console.log(chalk.blue(`[${dateString}] [DEBUG] ${message}`));
}

/**
 * 
 * @param {String} message 
 * @returns {void}
 */
function warn(message) {
	const date = new Date();
	const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
	console.log(chalk.yellow(`[${dateString}] [WARN] ${message}`));
}

/**
 * 
 * @param {String} message 
 * @returns {void}
 */
function error(message) {
	const date = new Date();
	const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
	console.log(chalk.red(`[${dateString}] [ERROR] ${message}`));
}

/**
 * 
 * @param {String} message 
 * @returns {void}
 */
function success(message) {
	const date = new Date();
	const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
	console.log(chalk.green(`[${dateString}] [SUCCESS] ${message}`));
}

module.exports = {
	debug,
	warn,
	error,
	success
}