import { readFileSync } from 'fs';
import { resolve } from 'path';

// read from ../in/file.txt
const contents = readFileSync(resolve(__dirname, '../in/file.txt'), 'utf8');

// a simple tr regex. Each individual (student or instructor) is one row in the table
const rowRegex = /<tr[^>]*>[\s\S]+?(?=<\/tr>)<\/tr>/g;
const rowMatch = contents.match(rowRegex);

if (!rowMatch) throw new Error('No rows found');

// get user input at runtime
const prompt = require('prompt-sync')({sigint: true});
const useLabSectionResponse = prompt('Prioritize assigning students to their lab section instructors? (y/n): ');
const useLabSection = useLabSectionResponse === 'y';
const data = {"sections": []};
if (useLabSection) {
	const labSectionPrefix = prompt('What is the Canvas section prefix for lab sections? ');
	// data["section-prefix"] = labSectionPrefix;
	const labSectionNames = prompt('Enter the names of the lab sections, separated by spaces: ').split(' ');
	for (const section of labSectionNames) {
		// data["sections"].push({"name": section, "students": []});
		const taName = prompt(`Enter one name of the TA(s) for ${section}, or enter for next section: `);
		if (taName) {

		}
	}
} else {
	console.log('Functionality not supported yet.');
	process.exit(0);
}
for (const row of rowMatch) {
	const rowContents = row.split('</td>');
	// column 1 is the profile picture
	// column 2 is the name and pronouns, we just want name
	// 
	const name = rowContents[1] // first row
	.split(/<a [^>]*class="roster_user_name student_context_card_trigger"[^>]*>/) // find the a tag Canvas puts around the name
	[1] // get the name itself
	.split('</a>')[0] // remove the closing a tag
	.split('<')[0] // remove the pronouns
	.trim(); // remove whitespace
	if (!name) throw new Error('No name found');

	// column 3 is the username with nothing fancy
	const username = rowContents[2].split('>')[1].split('<')[0].trim();

	// extract instance of text in an a tag with the class "roster_user_name student_context_card_trigger" with arbitrary properties before or after the class attribute
	const nameRegex = /<a [^>]*class="roster_user_name student_context_card_trigger"[^>]*>[\s\S]+?(?=<\/a>)<\/a>/g;
	const nameMatch = row.match(nameRegex);
	if (!nameMatch) throw new Error('No name found');
	
	// extract the username. This is the 3rd td element in the row -- there's no specific regex applicable here
	// maybe it would be best to just go off of td's...


	// console.log(name);
}
