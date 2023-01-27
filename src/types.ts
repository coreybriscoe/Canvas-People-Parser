export class GradingAssignmentsData {
	"sectionPrefix": string;
	"sections": Section[];

	constructor(sectionPrefix) {
		this.sectionPrefix = sectionPrefix;
		this.sections = [];
	}
}

export class Section {
	"sectionId": string;
	"instructors": Instructor[];

	constructor(sectionId) {
		this.sectionId = sectionId;
		this.instructors = [];
	}
}

export class Instructor {
	"name": string;
	"assignees": Student[];

	constructor(name) {
		this.name = name;
		this.assignees = [];
	}
}

export class Student {
	"name": string;
	"id": string;
	"pronouns": string;
	"section": string;

	constructor(name, id, pronouns, section) {
		this.name = name;
		this.id = id;
		this.pronouns = pronouns;
		this.section = section;
	}
}