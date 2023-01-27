export class GradingAssignmentsData {
	"section-prefix": string;
	"sections": Section[];
}

export class Section {
	"section-id": string;
	"instructors": Instructor[];
}

export class Instructor {
	"name": string;
	"assignees": Student[];
}

export class Student {
	"name": string;
	"id": string;
	"pronouns": string;
	"section": string;
}