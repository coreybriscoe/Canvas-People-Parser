export class GradingAssignmentsData {
	"sectionPrefix": string;
	"sections": Section[];

	constructor(sectionPrefix: string) {
		this.sectionPrefix = sectionPrefix;
		this.sections = [];
	}
}

export class Section {
	"sectionId": string;
	"instructors": Instructor[];

	constructor(sectionId: string) {
		this.sectionId = sectionId;
		this.instructors = [];
	}
}

export class Instructor {
	"name": string;
	"assignees": Student[];

	constructor(name: string) {
		this.name = name;
		this.assignees = [];
	}
}

export class Student {
	"name": string;
	"id": string;
	"pronouns": string;
	"section": string;

	constructor(name: string, id: string, pronouns: string, section: string) {
		this.name = name;
		this.id = id;
		this.pronouns = pronouns;
		this.section = section;
	}
}