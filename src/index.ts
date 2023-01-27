import { readFileSync } from 'fs';
import { resolve } from 'path';
import { GradingAssignmentsData, Section, Instructor, Student } from './types';

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
let data: GradingAssignmentsData;

if (useLabSection) {
	const labSectionPrefix = prompt('What is the Canvas section prefix for lab sections? ');
	data = new GradingAssignmentsData(labSectionPrefix);
	const labSectionNames = prompt('Enter the names of the lab sections, separated by spaces: ').split(' ');
	for (const sectionName of labSectionNames) {
		const section = new Section(sectionName);
		while (true) {
			const taName = prompt(`Enter one name of the TA(s) for ${section}, or enter for next section: `);
			if (taName) {
				section.instructors.push(new Instructor(taName))
			} else break;
		}
		
		data.sections.push(section);
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

	// column 4 is the sections
	const sections = rowContents[3].split(`${data.sectionPrefix}`).slice(1).map(section => section.split('</div>')[0].trim()).filter(section => data.sections.map(labSections => labSections.sectionId).includes(section));
	console.log(sections);
	if (!sections) throw new Error('No sections found');
	if (sections.length > 1) throw new Error('More than one section found');
}
