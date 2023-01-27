import { readFileSync } from 'fs';
import { resolve } from 'path';
import { GradingAssignmentsData, Section, Instructor, Student } from './types';

// read from ../in/file.txt
const contents = readFileSync(resolve(__dirname, '../in/file.txt'), 'utf8');

// a simple tr regex. Each individual (student or instructor) is one row in the table
// This will include the header row, so we slice it off later
const rowRegex = /<tr[^>]*>[\s\S]+?(?=<\/tr>)<\/tr>/g;
const rowMatch = contents.match(rowRegex);

if (!rowMatch) throw new Error('No rows found');

// get user input options at runtime
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
			const taName = prompt(`Enter one name of the TA(s) for ${section.sectionId}, or enter for next section: `);
			if (taName) {
				section.instructors.push(new Instructor(taName))
			} else break;
		}
		
		data.sections.push(section);
	}
} else {
	console.warn('Functionality not supported yet.');
	process.exit(0);
}
for (const row of rowMatch.slice(1)) {
	const rowContents = row.split('</td>');
	// column 1 is the profile picture (skip)
	// column 2 is the name and pronouns, we just want name
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
	const sections = rowContents[3] // third row
	.split(`${data.sectionPrefix}`) // split by the section prefix
	.slice(1) // exclude anything before first prefix
	.map(section => section.split('</div>')[0].trim()) // trim everything after section name
	.filter(section => data.sections.map(labSections => labSections.sectionId).includes(section)); // filter out sections that aren't lab sections
	if (!sections) throw new Error('No sections found');
	if (sections.length > 1) console.warn(`WARNING: More than one section found for student ${name}`);

	// column 5 is the role, which may be {Student, TA, Teacher, Instructor-Added Student, ...}, and appears in divs
	const role = rowContents[4].split('<div>')[1].split('</div>')[0].trim();
	if (!role) throw new Error('No role found');
	if (!role.includes("Student")) continue;

	const student = new Student(name, username, '', sections[0]);
	// add student to instructor in section with least students
	// get the Section object corresponding to the student's section
	const section = data.sections.filter((sec: Section) => sec.sectionId === sections[0])[0];
	try {
		const instructorToAddTo = data.sections.filter((sec: Section) => sec.sectionId === sections[0])[0]
	.instructors.reduce((prev: Instructor, curr: Instructor) => prev.assignees.length < curr.assignees.length ? prev : curr);
	instructorToAddTo.assignees.push(student);
	} catch (e) {
		console.log(e, student.name, student.section);
	}
	
}

console.log(data);

// display output
data.sections.forEach((section: Section) => {
	console.log(`==========${section.sectionId}==========`);
	section.instructors.forEach((instructor: Instructor) => {
		console.log(`${instructor.name}'s students:`);
		instructor.assignees.forEach((student: Student) => {
			console.log(student.name + ' ' + student.id);
		});
		console.log();
	});
});