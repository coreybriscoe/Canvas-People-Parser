import { readFileSync } from 'fs';
import { resolve } from 'path';

// read from ../in/file.txt
const contents = readFileSync(resolve(__dirname, '../in/file.txt'), 'utf8');

// a simple tr regex. Each individual (student or instructor) is one row in the table
const rowRegex = /<tr[^>]*>[\s\S]+?(?=<\/tr>)<\/tr>/g;
const rowMatch = contents.match(rowRegex);

if (!rowMatch) throw new Error('No rows found');
for (const row of rowMatch) {
	// extract the each instance of text in an a tag with the class "roster_user_name student_context_card_trigger" with arbitrary properties before or after the class attribute
	const nameRegex = /<a [^>]*class="roster_user_name student_context_card_trigger"[^>]*>[\s\S]+?(?=<\/a>)<\/a>/g;
	const nameMatch = row.match(nameRegex);
	if (!nameMatch) throw new Error('No name found');
	// extract from nameMatch the text between the a tags
	const name = nameMatch[0].replace(/<a [^>]*>/, '').replace(/<\/a>/, '');
	console.log(name);
}
